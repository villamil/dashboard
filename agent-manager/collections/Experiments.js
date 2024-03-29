const { model, Schema, Document } = require("mongoose");

const Experiments = new Schema(
  {
    name: String,
    image: String,
    epochs: Number,
    splits: Number,
    status: String,
    dataset: { type: Schema.Types.ObjectId, ref: "Datasets" },
    project: { type: Schema.Types.ObjectId, ref: "Projects" },
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    start: { type: Schema.Types.Date },
    end: { type: Schema.Types.Date },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Experiments", Experiments);
