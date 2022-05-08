const { AssignmentTypes } = require("./constants");

const CLIENT_STATUS = {
  IDLE: "idle",
  COMPUTING: "computing",
};

class Client {
  constructor(socket, id, type) {
    this.id = id;
    this.socket = socket;
    this.type = type;
    this.status = CLIENT_STATUS.IDLE;
  }

  getClientId() {
    return this.id;
  }

  isIdle() {
    return this.status === CLIENT_STATUS.IDLE;
  }

  addLinkClient(linkedClient) {
    this.linkedClient = linkedClient;
  }

  addDataChunk(chunk) {
    if (this.status !== CLIENT_STATUS.IDLE) {
      throw new Error("Can't assign a chunk, client needs to be idle.");
    }
    this.chunk = chunk;
  }

  addWeightsData(bucket) {
    this.weights = bucket;
  }

  addCombineChunks(chunks) {}

  workDone() {
    this.status = CLIENT_STATUS.IDLE;
    this.chunk = null;
  }

  startJob(jobId) {
    switch (this.type) {
      case AssignmentTypes.worker: {
        this.startTraining(jobId);
      }
      case AssignmentTypes.combiner: {
        this.startCombine(jobId);
      }
      default: {
        console.log("Invalid client type");
      }
    }
  }

  startCombine(jobId) {
    this.socket.emit("combine-job", {
      jobId,
      chunkData: this.chunk,
      image: "villamil350/histopathology",
    });
  }

  startTraining(jobId) {
    this.status = CLIENT_STATUS.COMPUTING;
    console.log("Start", jobId);
    this.socket.emit("start-job", {
      jobId,
      chunkData: this.chunk,
      image: "villamil350/histopathology",
      weights: this.weights,
    });
  }
}

module.exports = {
  Client,
  AssignmentTypes,
};
