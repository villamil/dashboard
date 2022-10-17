const Connections = require("../collections/Connections");
const Projects = require("../collections/Projects");
const Experiments = require("../collections/Experiments");
const { EXPERIMENT_STATUS } = require("../constants");
const { generateChunks } = require("./Chunks");
const Chunks = require("../collections/Chunks");

let blocked = false;

const RunExperiments = async () => {
  if (!blocked) {
    blocked = true;
    const currentExperiments = await Experiments.find({
      status: EXPERIMENT_STATUS.INITIALAZING,
    });

    for (let i = 0; i < currentExperiments.length; i++) {
      try {
        await generateChunks(currentExperiments[i]);
      } catch (error) {
        console.log(error);
      }
    }
    blocked = false;
  }
};

const LookForFinishedExperiments = async () => {
  const currentExperiments = await Experiments.find({
    status: EXPERIMENT_STATUS.PROGRESS,
  });

  for (const experiment of currentExperiments) {
    const remainingChunks = await Chunks.find({
      experiment: experiment,
      status: EXPERIMENT_STATUS.DONE,
    });

    if (remainingChunks.length === experiment.splits) {
      await Experiments.findByIdAndUpdate(experiment._id, {
        status: EXPERIMENT_STATUS.DONE,
        end: new Date().toISOString(),
      });
    }
  }
};

const LookForDoneExperiments = async () => {};

module.exports = { RunExperiments, LookForFinishedExperiments };
