const { Router, Response, RequestHandler } = require("express");
const User = require("../collections/Users");
const Token = require("../collections/Token");

const Auth = Router();

Auth.post(
  "/register",
  wrap(async (req, res) => {
    let user = null;
    const { name, email, password } = req.body;

    user = await User.create({ name, email });
    user.setPassword(password);
    await user.save();

    res.send({ _id: user?._id });
  })
);

Auth.post(
  "/login",
  wrap(async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      throw new Error("Bad user");
    }

    if (!user.verifyPassword(password)) {
      throw new Error("Bad user");
    }

    const tokenDB = await Token.create({ user: user._id });
    const token = tokenDB.getToken(user);
    res.json({ token, user });
  })
);

function wrap(fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = Auth;
