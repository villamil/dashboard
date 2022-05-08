const { model, Schema, Document } = require("mongoose");

const Projects = new Schema(
  {
    name: String,
    description: String,
    category: String,
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    experiments: [{ type: Schema.Types.ObjectId, ref: "Experiments" }],
    volunteers: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Projects", Projects);
