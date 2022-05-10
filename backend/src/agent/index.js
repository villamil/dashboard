const io = require("socket.io-client");
const os = require("os");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const { setVariables } = require("./variables.js");
const Job = require("./Job.js");

const jobs = [];
variables = setVariables();

console.log("Conectando");

const networkInterfaces = os.networkInterfaces();

const macAddressList = Object.keys(networkInterfaces).filter(
  (key) =>
    !!networkInterfaces[key].find((item) => item.mac !== "00:00:00:00:00:00")
);

let clientId = uuidv4();

if (macAddressList.length) {
  clientId = networkInterfaces[macAddressList[0]][0].mac;
}

const socket = io(
  `${variables.agent_manager_url}:${variables.agent_manager_port}`,
  {
    reconnectionDelayMax: 10000,
    auth: {
      token: "123",
    },
    query: {
      clientId,
      userId: variables.user_id,
      projectId: variables.project_id,
      os: os.type(),
    },
  }
);

socket.on("connect", (...args) => {
  console.log(args);
  console.log("Conectado!");
});

socket.on("disconnect", (reason) => {
  console.log("Desconectado!");
});

let blocked = false;

const startJob = async () => {
  console.log(blocked, clientId);
  if (!blocked && clientId) {
    blocked = true;
    try {
      console.log("send clientId", clientId);
      const {
        data: { chunkInfo, experiment, bucketName, latestWeight },
      } = await axios.get(
        `${variables.agent_manager_url}:${variables.agent_manager_port}/chunk-files`,
        { params: { clientId } }
      );
      if (chunkInfo) {
        const job = new Job(socket);
        job.run(
          {
            files: chunkInfo.files,
            bucketName,
            image: experiment.image,
            chunkId: chunkInfo._id,
            latestWeight,
          },
          () => {
            blocked = false;
            startJob();
          }
        );
        socket.emit("chunk-started", { chunkId: chunkInfo._id });
      }
      blocked = false;
    } catch (error) {
      console.log(error);
      blocked = false;
    }
  }
};

function lookForJobs() {
  setTimeout(async () => {
    console.log("Looking for jobs ");
    startJob();

    lookForJobs();
  }, 1000 * 10);
}
startJob();
lookForJobs();

// socket.on("start-job", (args) => {
//   console.log(args);
//   const job = new Job(args.jobId, socket, clientId);
//   job.run(args);
//   jobs.push(job);
// });
