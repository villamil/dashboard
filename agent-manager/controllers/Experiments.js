const Connections = require("../collections/Connections");
const Projects = require("../collections/Projects");
const Experiments = require("../collections/Experiments");
const { EXPERIMENT_STATUS } = require("../constants");
const { generateChunks } = require("./Chunks");

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

const LookForDoneExperiments = async () => {};

module.exports = { RunExperiments };
