var Minio = require("minio");
require("dotenv").config();

class MinioHandler {
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  createBucket(name) {
    console.log("create bucket", name);
    try {
      return this.minioClient.makeBucket(name);
    } catch (error) {
      console.log(error);
    }
  }

  uploadFile(bucket, fileName, fileDir) {
    // console.log(bucket);
    // console.log(fileName);
    // console.log(fileDir);
    return this.minioClient.fPutObject(bucket, fileName, fileDir, {
      "Content-Type": "application/octet-stream",
    });
  }

  removeBucket(bucketName) {
    return this.minioClient.removeBucket(bucketName);
  }

  listAllBuckets() {
    this.minioClient.listBuckets(async (err, buckets) => {
      if (err) return console.log(err);
      for (let i = 0; i < buckets.length; i++) {
        await this.removeBucket(buckets[i].name);
      }
    });
  }
}

const minioHandler = new MinioHandler();
module.exports = minioHandler;
