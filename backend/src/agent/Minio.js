import { Dir } from "fs";
import Minio from "minio";
import path from "path";
import { setVariables, variables } from "./variables.js";

setVariables();
class MinioHandler {
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: variables.minio_endpoint,
      port: Number(variables.minio_port),
      useSSL: false,
      accessKey: variables.minio_access_key,
      secretKey: variables.minio_secret_key,
    });
  }

  getObjects(bucket) {
    return this.minioClient.listObjects(bucket, "", true);
  }

  async moveSingleToTmp(bucket, file, tmpDir) {
    const dir = path.join(tmpDir, file);
    return this.minioClient.fGetObject(bucket, file, dir);
  }

  async moveToTmp(bucket, file, tmpDir) {
    return new Promise((resolve, reject) => {
      const dir = path.join(tmpDir, file);
      this.minioClient.fGetObject(bucket, file, dir, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }

  uploadFile(bucket, fileName, fileDir) {
    // console.log(bucket);
    // console.log(fileName);
    // console.log(fileDir);
    return this.minioClient.fPutObject(bucket, fileName, fileDir, {
      "Content-Type": "application/octet-stream",
    });
  }
}

const minioHandler = new MinioHandler();

export default minioHandler;
