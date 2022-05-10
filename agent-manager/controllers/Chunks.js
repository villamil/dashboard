const { kebabCase } = require("lodash");
const Connections = require("../collections/Connections");
const Projects = require("../collections/Projects");
const Experiments = require("../collections/Experiments");
const Chunks = require("../collections/Chunks");
const Datasets = require("../collections/Datasets");
const minioClient = require("./minio");
const { CONNECTION_STATUS, EXPERIMENT_STATUS } = require("../constants");

const generateChunks = (experiment) =>
  new Promise(async (resolve, reject) => {
    const dataset = await Datasets.findById(experiment.dataset);
    if (!dataset || !dataset.ready) {
      return reject("Dataset is not ready");
    }
    const bucketName = kebabCase(`${dataset.name}-${dataset._id}`);
    const objects = await getObjectsFromBucket(bucketName);

    const annotations = objects.reduce((groupedAnnotations, curr) => {
      if (curr.name.split(".")[1] === "txt") {
        groupedAnnotations.push(curr);
      }
      return groupedAnnotations;
    }, []);

    const filteredObj = objects.filter(
      ({ name }) => !annotations.find(({ name: nameAnno }) => nameAnno === name)
    );

    const mainF = filteredObj.reduce((mainFolders, current) => {
      const folder = getFilePath(current.name);
      if (!mainFolders.includes(folder) && folder.split("/").length > 1) {
        mainFolders.push(folder);
      }
      return mainFolders;
    }, []);

    const groupedF = mainF.reduce((grouped, current) => {
      const filtered = filteredObj.filter(
        ({ name }) => getFilePath(name) === current
      );
      grouped.push(filtered);
      return grouped;
    }, []);

    const splitedObject = groupedF.reduce(
      (grouped, current) => {
        const split = splitFiles(current, experiment.splits);
        for (let x = 0; x < experiment.splits; x++) {
          grouped[x] = [...grouped[x], ...split[x]];
        }

        return grouped;
      },
      Array.from({ length: experiment.splits }, () => [])
    );
    const splitedWithAnnotations = splitedObject.map((item) => {
      return [...item, ...annotations];
    });

    const project = await Projects.findById(experiment.project);

    // const connectedVolunteers = await Connections.find({
    //   user: { $in: project.volunteers },
    // });

    for (let x = 0; x < splitedWithAnnotations.length; x++) {
      await Chunks.create({
        status: EXPERIMENT_STATUS.INITIALAZING,
        files: [...splitedWithAnnotations[x]],
        experiment: experiment._id,
      });
    }

    const result = await Experiments.findByIdAndUpdate(experiment._id, {
      status: EXPERIMENT_STATUS.PROGRESS,
    });

    return resolve(result);
  });

const getFilePath = (filePath) => {
  const splitted = filePath.split("/");
  return splitted.slice(0, splitted.length - 1).join("/");
};

const splitFiles = (files, parts) => {
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(files.splice(0, Math.ceil(files.length / i)));
  }
  return result;
};

const getObjectsFromBucket = (bucketName) =>
  new Promise(async (resolve, reject) => {
    const data = [];
    const stream = minioClient.listObjects(bucketName, "", true);
    stream.on("data", function (obj) {
      data.push(obj);
    });
    stream.on("end", function (obj) {
      resolve(data);
    });
  });

const reAssignChunks = async () => {
  const disconnectedClients = await Connections.find({
    status: CONNECTION_STATUS.DISCONNECTED,
  });
  console.log(disconnectedClients);
  if (disconnectedClients) {
    const disconnectedIds = disconnectedClients.map((item) => item._id);
    for (const disconnectedId of disconnectedIds) {
      const allPendingChunks = await Chunks.find({
        assignedTo: disconnectedId,
        $or: [
          { status: EXPERIMENT_STATUS.PROGRESS },
          { status: EXPERIMENT_STATUS.INITIALAZING },
        ],
      });

      for (const chunk of allPendingChunks) {
        const pendingChunk = await Chunks.findByIdAndUpdate(
          chunk,
          {
            status: EXPERIMENT_STATUS.INITIALAZING,
          },
          { new: true }
        );

        if (pendingChunk) {
          const experiment = await Experiments.findById(
            pendingChunk.experiment
          );
          const project = await Projects.findById(experiment.project);

          const connectedVolunteers = await Connections.find({
            user: { $in: project.volunteers },
            status: CONNECTION_STATUS.CONNECTED,
          });
          if (connectedVolunteers.length) {
            const randomSelectedVolunteer =
              connectedVolunteers[
                Math.floor(Math.random() * connectedVolunteers.length)
              ];
            await Chunks.findByIdAndUpdate(pendingChunk._id, {
              assignedTo: randomSelectedVolunteer._id,
            });
          }
        }
      }
    }
  }
};

module.exports = { generateChunks, reAssignChunks };
