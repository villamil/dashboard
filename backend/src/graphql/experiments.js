const Projects = require("../collections/Projects");
const Users = require("../collections/Users");
const Experiments = require("../collections/Experiments");
const Datasets = require("../collections/Datasets");
const Chunks = require("../collections/Chunks");
const { EXPERIMENT_STATUS } = require("../constants");
const minioClient = require("../minio");
const { kebabCase } = require("lodash");

const resolvers = {
  Query: {
    getExperiments: async (obj, args, context) => {
      console.log(context.user._id);
      return await Experiments.find({ user: context.user._id });
    },
  },
  Mutation: {
    async createExperiment(obj, args, context) {
      const {
        data: { name, image, projectId, datasetId, epochs, splits },
      } = args || {};
      const experiment = await Experiments.create({
        name,
        image,
        epochs,
        splits,
        status: EXPERIMENT_STATUS.INITIALAZING,
        dataset: datasetId,
        project: projectId,
        user: context.user._id,
      });

      const project = await Projects.findByIdAndUpdate(projectId, {
        $push: { experiments: experiment._id },
      });

      return project;
    },
  },
  Experiment: {
    async user(experiment) {
      return await Users.findById(experiment.user);
    },
    async dataset(experiment) {
      return await Datasets.findById(experiment.dataset);
    },
    async project(experiment) {
      return await Projects.findById(experiment.project);
    },
    async download(experiment) {
      if (experiment.status === EXPERIMENT_STATUS.DONE) {
        const latestFinishedChunk = await Chunks.findOne(
          {
            experiment: experiment._id,
          },
          {},
          { sort: { created_at: -1 } }
        );
        const dataset = await Datasets.findById(experiment.dataset);
        const bucketName = kebabCase(`${dataset.name}-${dataset._id}`);
        const filename = `model-weights-${latestFinishedChunk._id}.h5`;
        const presignedURL = await minioClient.presignedGetObject(
          bucketName,
          filename,
          24 * 60 * 60
        );
        return presignedURL;
      }
      return null;
    },
  },
};

module.exports = resolvers;
