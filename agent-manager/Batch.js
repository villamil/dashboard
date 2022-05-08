const BATCH_STATUS = {
  CREATED: "CREATED",
};

class Batch {
  constructor(bucket) {
    this.id = uuidv4();
    this.status = BATCH_STATUS.CREATED;
    this.bucket = bucket;
  }
}
