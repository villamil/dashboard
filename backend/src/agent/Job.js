const Docker = require("dockerode");
const minioHandler = require("./Minio.js");
const tmp = require("tmp");
const path = require("path");

class Job {
  constructor(socket) {
    this.socket = socket;
    this.docker = new Docker();
    this.tmpFolder = tmp.dirSync({ unsafeCleanup: true });
  }

  async run(args) {
    this.args = args;
    if (this.args.latestWeight) {
      console.log(this.args.latestWeight);
      await minioHandler.moveToTmp(
        args.bucketName,
        args.latestWeight,
        this.tmpFolder.name
      );
    }
    for (let x = 0; x < args.files.length; x++) {
      await minioHandler.moveToTmp(
        args.bucketName,
        args.files[x].name,
        this.tmpFolder.name
      );
    }

    this.startContainer();
  }

  async startContainer() {
    console.log(
      "start docker",
      "weights",
      this.args?.latestWeight,
      this.args?.latestWeight !== undefined
    );
    this.docker.run(
      this.args.image,
      [
        "bash",
        `${this.args?.latestWeight !== undefined ? "--use_weights=True" : ""} `,
        `${
          this.args?.latestWeight !== undefined
            ? `--weights_name=${this.args?.latestWeight}`
            : ""
        } `,
      ],
      process.stdout,
      {
        HostConfig: {
          AutoRemove: true,
          Binds: [`${this.tmpFolder.name}:/dataset`],
        },
      },
      async (err, data, container) => {
        // console.log("container done, check folder", this.tmpFolder.name);
        // console.log(data && data.StatusCode);
        console.log("done");
        await this.uploadModel();
        this.clear();
        this.jobDone();
      }
    );
  }

  async uploadModel() {
    const filename = `model-weights-${this.args.chunkId}.h5`;
    return minioHandler.uploadFile(
      this.args.bucketName,
      filename,
      path.join(this.tmpFolder.name, "model-weights.h5")
    );
  }

  jobDone() {
    this.socket.emit("chunk-done", {
      chunkId: this.args.chunkId,
    });
  }

  clear() {
    this.tmpFolder = tmp.dirSync({ unsafeCleanup: true });
  }
}

module.exports = Job;
