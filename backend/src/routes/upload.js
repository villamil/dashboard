const { Router, Response, RequestHandler } = require("express");
const os = require("os");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: os.tmpdir() });
const tmp = require("tmp");
const fs = require("fs");
var AdmZip = require("adm-zip");
const jwt = require("jsonwebtoken");
const { kebabCase } = require("lodash");
const { jwtSecret } = require("../config");
const Datasets = require("../collections/Datasets");

const minioClient = require("../minio");

const Upload = Router();

function parseToken(rawToken) {
  return jwt.verify(rawToken, jwtSecret);
}

Upload.post("/dataset", upload.single("dataset"), async function (req, res) {
  const file = req.file;
  const { name, description, rootFolder } = req.body;
  const { userId } = req.query;

  const dataset = await Datasets.create({
    name,
    description,
    rootFolder,
    user: userId,
  });

  const tmpdir = tmp.dirSync({ prefix: "tmpdir" });

  const zip = new AdmZip(file.path);

  zip.extractAllTo(tmpdir.name, true);

  let filePaths = [];
  let folders = {};

  const getFilePaths = (main) => {
    fs.readdirSync(main).forEach((file) => {
      let fullPath = path.join(main, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        getFilePaths(fullPath);
      } else {
        if (!folders[main]) {
          folders[main] = [];
        } else {
          folders[main].push(fullPath);
        }
        filePaths.push(fullPath);
      }
    });
  };

  getFilePaths(tmpdir.name);

  const bucketName = kebabCase(`${name}-${dataset._id}`);

  minioClient.makeBucket(bucketName, "us-east-1", async function (err) {
    if (err) return console.log(err.code);

    console.log("Bucket created successfully");

    for (let i = 0; i < filePaths.length; i++) {
      const folderSepLength = filePaths[i].split(path.sep).indexOf(rootFolder);
      const filename = filePaths[i]
        .split(path.sep)
        .slice(folderSepLength, filePaths[i].split(path.sep).length)
        .join(path.sep);
      await minioClient.fPutObject(bucketName, filename, filePaths[i]);
    }
    dataset.ready = true;
    dataset.save();
    console.log("finished");
  });

  res.sendStatus(200);
});

module.exports = Upload;
