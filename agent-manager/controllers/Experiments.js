const Connections = require("../collections/Connections");
const Projects = require("../collections/Projects");
const Experiments = require("../collections/Experiments");
const { EXPERIMENT_STATUS } = require("../constants");
const { generateChunks } = require("./Chunks");
const Chunks = require("../collections/Chunks");

let blocked = false;

const RunExperiments = async () => {
  console.log(blocked);
  if (!blocked) {
    blocked = true;
    const currentExperiments = await Experiments.find({
      status: EXPERIMENT_STATUS.INITIALAZING,
    });
    console.log(currentExperiments);
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
      status: EXPERIMENT_STATUS.PROGRESS,
    });
    if (remainingChunks.length === 0) {
      await Experiments.findByIdAndUpdate(experiment._id, {
        status: EXPERIMENT_STATUS.DONE,
      });
    }
  }
};

const LookForDoneExperiments = async () => {};

module.exports = { RunExperiments, LookForFinishedExperiments };
