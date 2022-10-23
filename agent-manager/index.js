const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const minioClient = require("./Minio");
const { connect, Types } = require("mongoose");
const Connections = require("./collections/Connections");
const Projects = require("./collections/Projects");
const Experiments = require("./collections/Experiments");
const Chunks = require("./collections/Chunks");
const { kebabCase } = require("lodash");
const { CONNECTION_STATUS, EXPERIMENT_STATUS } = require("./constants");
const {
  RunExperiments,
  LookForFinishedExperiments,
} = require("./controllers/Experiments");
const Datasets = require("./collections/Datasets");
const { reAssignChunks } = require("./controllers/Chunks");
const { resetConnections } = require("./controllers/Connections");

(async function () {
  await connect(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
    ssl: false,
  });
})();

RunExperiments();
LookForFinishedExperiments();
reAssignChunks();
resetConnections();

function lookForExperiments() {
  setTimeout(async () => {
    RunExperiments();
    LookForFinishedExperiments();

    lookForExperiments();
  }, 1000 * 10);
}

lookForExperiments();

function lookForOrphanChunks() {
  setTimeout(async () => {
    reAssignChunks();

    lookForOrphanChunks();
  }, 1000 * 10);
}

lookForOrphanChunks();

app.get("/clear-buckets", (req, res) => {
  minioClient.listAllBuckets();
  res.send("cleaning...");
});

app.get("/chunk-files", async (req, res) => {
  try {
    console.log("chunk files requested");
    const { clientId } = req.query;
    const connection = await Connections.findOne({ clientId });

    const projects = await Projects.find({
      volunteers: { $all: [Types.ObjectId(connection.user.toString())] },
    });

    if (!projects) {
      return res.send("Project with no experiments");
    }

    let experimentId = null;
    for (const project of projects) {
      console.log("Project", project);
      for (const experiment of project.experiments) {
        console.log("Experiment", experiment);
        const isExperimentDone = await Experiments.findOne({
          _id: experiment,
          status: EXPERIMENT_STATUS.DONE,
        });
        if (isExperimentDone) {
          continue;
        }
        const experimentInProgress = await Chunks.findOne({
          experiment: experiment,
          assignedTo: { $exists: true },
          status: EXPERIMENT_STATUS.PROGRESS,
        });

        if (!experimentInProgress) {
          console.log("assign experiment");
          experimentId = experiment;
          break;
        }
      }
    }
    console.log("Using experimentId", experimentId);
    const chunkInfo = await Chunks.findOneAndUpdate(
      {
        experiment: experimentId,
        assignedTo: { $exists: false },
        status: EXPERIMENT_STATUS.INITIALAZING,
      },
      {
        status: EXPERIMENT_STATUS.PROGRESS,
        assignedTo: connection.user,
      },
      {
        new: true,
      }
    );

    if (!chunkInfo) {
      console.log("No Chunk available");
      return res.send({ chunkInfo: null });
    }

    const latestFinishedChunk = await Chunks.findOne(
      {
        status: EXPERIMENT_STATUS.DONE,
        experiment: chunkInfo.experiment,
      },
      {},
      { sort: { created_at: -1 } }
    );
    let latestWeight;
    const experiment = await Experiments.findById(chunkInfo.experiment);
    const dataset = await Datasets.findById(experiment.dataset);
    const bucketName = kebabCase(`${dataset.name}-${dataset._id}`);

    if (latestFinishedChunk) {
      latestWeight = `model-weights-${latestFinishedChunk._id}.h5`;
    }
    return res.send({ chunkInfo, experiment, bucketName, latestWeight });
  } catch (error) {
    console.log(error);
    res.send({});
  }
});

io.on("connection", async (socket) => {
  console.log("connected");
  const clientId = socket.handshake.query.clientId;
  const projectId = socket.handshake.query.projectId;
  const os = socket.handshake.query.os;
  const userId = socket.handshake.query.userId;

  let connection = await Connections.findOne({ clientId });

  const project = await Projects.findOneAndUpdate(
    { _id: projectId, volunteers: { $ne: userId } },
    {
      $push: { volunteers: userId },
    },
    { new: true }
  );

  if (!connection) {
    connection = await Connections.create({
      clientId,
      status: CONNECTION_STATUS.CONNECTED,
      os,
      user: userId,
    });
  } else {
    connection.status = CONNECTION_STATUS.CONNECTED;
    await connection.save();
  }

  let finalConnection = await Connections.findOne({ clientId });
  console.log("send connection id", clientId, finalConnection._id);
  socket.emit("send-connection-id-respond", {
    connectionId: connection._id,
  });

  socket.on("chunk-started", async ({ chunkId }) => {
    await Chunks.findByIdAndUpdate(chunkId, {
      status: EXPERIMENT_STATUS.PROGRESS,
    });
  });

  socket.on("chunk-done", async ({ chunkId }) => {
    await Chunks.findByIdAndUpdate(chunkId, {
      status: EXPERIMENT_STATUS.DONE,
    });
  });

  socket.on("disconnect", async (reason) => {
    connection.status = CONNECTION_STATUS.DISCONNECTED;
    await connection.save();

    console.log("Desconectado!");
  });
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
