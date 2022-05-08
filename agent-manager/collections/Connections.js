const { model, Schema, Document } = require("mongoose");

const Connections = new Schema(
  {
    clientId: String,
    status: String,
    os: String,
    user: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Connections", Connections);
