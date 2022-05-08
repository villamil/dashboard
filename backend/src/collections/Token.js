const { model, Schema } = require("mongoose");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");
const day = 1000 * 60 * 60 * 24;

const Token = new Schema({
  expire: {
    type: Date,
    default: () => Date.now() + day,
    index: { expires: 0 },
  },
  data: { type: Schema.Types.Mixed },
  from: { type: String, default: "general" },
  user: { type: Schema.Types.ObjectId, ref: "Users" },
});

Token.methods = {
  getToken(user) {
    return jwt.sign({ token: this._id.toString(), user }, jwtSecret);
  },
};

function parseToken(rawToken) {
  return jwt.verify(rawToken, jwtSecret);
}

module.exports = model("Token", Token);
