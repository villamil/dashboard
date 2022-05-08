const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const minioHandler = require("./Minio");

class FilesLib {
  constructor() {
    this.filePaths = [];
    this.folders = {};
  }

  getLabels() {}

  async splitDataSet(parts = 2) {
    this.parts = parts;
    this.localDir = "/Users/luis/Documents/ITESO/TOG/server-client/server";
    this.mainDirectory = "/test-datasets/breast_histopathology_images";
    this.mainDirectoryPath = path.join(
      __dirname,
      "/test-datasets/breast_histopathology_images"
    );
    console.log(this.mainDirectoryPath);
    const bucketNames = await this.writeIntoMinio();
    console.log("created", bucketNames);
    return bucketNames;
  }

  readDirectory(dir) {
    return fs.promises.readdir(dir);
  }

  async writeIntoMinio() {
    await this.getFilePaths(this.mainDirectoryPath);
    const bucketNames = Array.from(
      { length: this.parts },
      (_, i) => `bucket-${i}-${uuidv4()}`
    );
    const tmpFolders = Object.keys(this.folders).filter(
      (foldi) => this.folders[foldi].length
    );
    const bucketData = Object.assign(
      {},
      ...bucketNames.map((name) => ({ [name]: [] }))
    );
    console.log(bucketData);
    for (const foldi of tmpFolders) {
      const splittedFiles = this.splitFiles(this.folders[foldi]);
      for (let i = 0; i < bucketNames.length; i++) {
        bucketData[bucketNames[i]].push(splittedFiles[i]);
      }
    }
    try {
      await Promise.all(
        bucketNames.map((bucket) => minioHandler.createBucket(bucket))
      );
    } catch (error) {
      console.log(error);
    }

    await Promise.all(
      Object.keys(bucketData).map(
        async (key) => await this.uploadBucketData(key, bucketData[key])
      )
    );

    return bucketNames;
  }

  async uploadBucketData(bucketName, bucketData) {
    if (Array.isArray(bucketData[0])) {
      for (const data of bucketData) {
        await this.uploadBucketData(bucketName, data);
      }
    } else {
      return await this.uploadFiles(bucketData, bucketName);
    }
  }

  async getFilePaths(main) {
    fs.readdirSync(main).forEach((file) => {
      let fullPath = path.join(main, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        this.getFilePaths(fullPath);
      } else {
        if (!this.folders[main]) {
          this.folders[main] = [];
        } else {
          this.folders[main].push(fullPath);
        }
        this.filePaths.push(fullPath);
      }
    });
  }

  async uploadFiles(files, bucketName) {
    try {
      for (let i = 0; i < files.length; i++) {
        const fileName = files[i]
          .split("/")
          .slice(this.localDir.split("/").length, files[i].split("/").length)
          .join("/");
        console.log(fileName, files[i]);
        await minioHandler.uploadFile(bucketName, fileName, files[i]);
      }
    } catch (error) {
      console.log("fail", error);
      // await minioHandler.removeBucket(bucketName);
    }
  }

  splitFiles(files) {
    let result = [];
    for (let i = this.parts; i > 0; i--) {
      result.push(files.splice(0, Math.ceil(files.length / i)));
    }
    return result;
  }
}

module.exports = FilesLib;
