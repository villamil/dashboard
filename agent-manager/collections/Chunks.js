const { model, Schema, Document } = require("mongoose");

const Chunks = new Schema(
  {
    status: String,
    timeout: { type: Number, default: 1000 * 3 },
    files: [Object],
    assignedTo: { type: Schema.Types.ObjectId, ref: "Connections" },
    experiment: { type: Schema.Types.ObjectId, ref: "Experiment" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Chunks", Chunks);
