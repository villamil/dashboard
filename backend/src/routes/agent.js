const { Router, Response, RequestHandler } = require("express");
const fs = require("fs");
const path = require("path");

const Agent = Router();

Agent.get(
  "/",
  wrap(async (req, res) => {
    console.log(req.query);
    const { os } = req.query || {};
    console.log(os);
    switch (os) {
      case "linux":
        res.download(path.join(__dirname, "../..", "index-linux"));
        break;
      case "mac":
        res.download(path.join(__dirname, "../..", "index-macos"));
        break;
      case "windows":
        res.download(path.join(__dirname, "../..", "index-win.exe"));
        break;
      default:
        res.send(null);
        break;
    }
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

module.exports = Agent;
