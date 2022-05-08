import io from "socket.io-client";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { setVariables, variables } from "./variables.js";
import Job from "./Job.js";

const jobs = [];
setVariables();

console.log("Conectando");

let connectionId;
let runningJob = false;
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

socket.on("send-connection-id", ({ connectionId }) => {
  connectionId = connectionId;
});

socket.on("connect", (...args) => {
  console.log(args);
  console.log("Conectado!");
});

socket.on("disconnect", (reason) => {
  console.log("Desconectado!");
});

let blocked = false;

const startJob = async () => {
  if (!blocked) {
    blocked = true;
    const {
      data: { chunkInfo, experiment, bucketName, latestWeight },
    } = await axios.get(
      `${variables.agent_manager_url}:${variables.agent_manager_port}/chunk-files`,
      { params: { connectionId } }
    );
    console.log(chunkInfo);
    if (chunkInfo) {
      const job = new Job(socket);
      job.run({
        files: chunkInfo.files,
        bucketName,
        image: experiment.image,
        chunkId: chunkInfo._id,
        latestWeight,
      });

      socket.emit("chunk-started", { chunkId: chunkInfo._id });
      runningJob = true;
    }
    blocked = false;
  }
};

function lookForJobs() {
  setTimeout(async () => {
    console.log("Looking for jobs ");
    if (!runningJob) {
      startJob();
    }

    lookForJobs();
  }, 1000 * 60 * 2);
}
startJob();
lookForJobs();

// socket.on("start-job", (args) => {
//   console.log(args);
//   const job = new Job(args.jobId, socket, clientId);
//   job.run(args);
//   jobs.push(job);
// });
