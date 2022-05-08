const { model, Schema, Document } = require("mongoose");

const Datasets = new Schema(
  {
    name: String,
    description: String,
    rootFolder: String,
    ready: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Datasets", Datasets);
