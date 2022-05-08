const Minio = require("minio");
require("dotenv").config();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

minioClient.makeBucket("projects-description", "us-east-1", function (err) {
  if (err) return console.log(err.code);

  console.log("Bucket created successfully");
});

module.exports = minioClient;
