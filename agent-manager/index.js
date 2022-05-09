const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { Client } = require("./Clients");
const io = new Server(server);
// const Job = require("./Job");
const minioClient = require("./Minio");
const template = require("lodash/template");
const { connect } = require("mongoose");
const Connections = require("./collections/Connections");
const Projects = require("./collections/Projects");
const Experiments = require("./collections/Experiments");
const Chunks = require("./collections/Chunks");
const { kebabCase } = require("lodash");
const { CONNECTION_STATUS, EXPERIMENT_STATUS } = require("./constants");
const { RunExperiments } = require("./controllers/Experiments");
const Datasets = require("./collections/Datasets");

let clients = [];
let jobInstances = [];
let jobs = {};

(async function () {
  const mongoUri = template(
    process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/db"
  );

  await connect(mongoUri({ env: process.env }), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
})();

RunExperiments();

function lookForExperiments() {
  setTimeout(async () => {
    console.log("Looking for experiments ");
    RunExperiments();

    lookForExperiments();
  }, 1000 * 60);
}

lookForExperiments();

app.get("/start-job", (req, res) => {
  try {
    const job = new Job(clients);
    jobInstances.push(job);
    jobs[job.id] = Object.assign({}, job);
  } catch (error) {
    console.log(error?.message);
  }

  res.send("started");
});

app.get("/clear-buckets", (req, res) => {
  minioClient.listAllBuckets();
  res.send("cleaning...");
});

app.get("/chunk-files", async (req, res) => {
  try {
    const { connectionId } = req.params;

    console.log(connectionId);
    const chunkInfo = await Chunks.findOne({
      assignetTo: connectionId,
      status: EXPERIMENT_STATUS.INITIALAZING,
    });
    const latestFinishedChunk = await Chunks.findOne(
      {
        assignetTo: connectionId,
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
    res.send({ chunkInfo, experiment, bucketName, latestWeight });
  } catch (error) {
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
    }
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

  function delay(t, v) {
    return new Promise(function (resolve) {
      setTimeout(resolve.bind(null, v), t);
    });
  }

  socket.emit("send-connection-id", {
    connectionId: connection.id,
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
