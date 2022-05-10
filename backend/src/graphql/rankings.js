const Connections = require("../collections/Connections");
const Users = require("../collections/Users");
const Chunks = require("../collections/Chunks");
const { EXPERIMENT_STATUS } = require("../constants");

const resolvers = {
  Query: {
    getRankings: async (obj, args, context) => {
      return await Chunks.aggregate([
        {
          $match: {
            status: EXPERIMENT_STATUS.DONE,
          },
        },
        {
          $group: {
            _id: "$assignedTo",
            rank: {
              $sum: 1,
            },
          },
        },
      ]);
    },
  },
  Ranking: {
    async user(ranking) {
      const connection = await Connections.findById(ranking._id);
      return await Users.findById(connection.user);
    },
  },
};

module.exports = resolvers;
