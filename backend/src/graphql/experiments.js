const Projects = require("../collections/Projects");
const Users = require("../collections/Users");
const Experiments = require("../collections/Experiments");
const Datasets = require("../collections/Datasets");
const EXPERIMENT_STATUS = require("../constants");

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
  },
};

module.exports = resolvers;
