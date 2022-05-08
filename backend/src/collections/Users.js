const { model, Schema, Document } = require("mongoose");
const { hashSync, compareSync } = require("bcrypt");

const Users = new Schema(
  {
    name: String,
    email: String,
    password: String
  },
  {
    timestamps: true,
  }
);

Users.methods = {
    setPassword(password) {
        this.set("password", hashSync(password, 10));
    },
    verifyPassword(password) {
        return compareSync(password, this.get("password"));
    },
}

module.exports = model("Users", Users);
