class DataChunk {
  constructor(bucket) {
    this.bucket = bucket;
    // recives the chunk bucket and uploads to minio
  }

  async upload(minioConnection) {
    minioConnection.upload(this.bucket);
  }

  getChunkUrl(minioConnection) {
    minioConnection.getObjectUrl(this.bucket);
  }
}

module.exports = DataChunk;
