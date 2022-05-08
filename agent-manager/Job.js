const { v4: uuidv4 } = require("uuid");
const DataChunk = require("./DataChunk");
const FilesLib = require("./FilesLib");

const MIN_WORKERS = 2;

class Job {
  constructor(clients) {
    this.id = uuidv4();
    this.clients = clients.map((client, i) => {
      if (i === 0) {
        client.addLinkClient(clients[clients.length - 1]);
        return client;
      }
      client.addLinkClient(clients[i - 1]);
      return client;
    });
    this.workerClients = clients.map((client) => client.id);
    //   .slice(0, clients.length - 1)
    //   .map((client) => client.id);
    // this.combiner = clients
    //   .slice(clients.length - 1, clients.length)
    //   .map((client) => client.id);
    this.chunks = [];
    this.chunkIterator;
    this.startJob();
  }

  *getChunkGenerator(chunks) {
    yield* chunks;
  }

  async startJob() {
    const filelib = new FilesLib();
    const tmpDirs = await filelib.splitDataSet(4);
    // const tmpDirs = [
    //   "bucket-0-890a3416-f7d7-45b3-9220-cc6e3a83f0ba",
    //   "bucket-1-74d63451-721d-4e83-87eb-e618c5ae0db5",
    // ];
    const clientWorkers = this.clients.filter((client) =>
      this.workerClients.includes(client.id)
    );

    for (let i = 0; i < tmpDirs.length; i++) {
      this.chunks.push(new DataChunk(tmpDirs[i]));
    }

    this.chunkIterator = this.getChunkGenerator(this.chunks);

    for (let i = 0; i < clientWorkers.length; i++) {
      console.log(clientWorkers.length, i);
      if (clientWorkers[i].isIdle()) {
        const { value: chunk, done } = this.chunkIterator.next();
        console.log(chunk, done);
        clientWorkers[i].addDataChunk(chunk);
        clientWorkers[i].startTraining(this.id);
      }
    }
  }

  async workDone(doneChunk, clientId) {
    const client = this.clients.find((client) => client.id === clientId);
    this.updateChunks(doneChunk);
    const { value: nextChunk, done } = this.chunkIterator.next();
    client.linkedClient.addWeightsData(doneChunk);
    if (!done) {
      client.workDone();
      client.addDataChunk(nextChunk);
      client.startTraining(this.id);
    }
    console.log("done", doneChunk, "next", nextChunk, done);
  }

  updateChunks(doneChunk) {
    this.chunks = this.chunks.filter((chunk) => chunk.bucket === doneChunk);
  }
}

module.exports = Job;
