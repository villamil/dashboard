const Datasets = require("../collections/Datasets");

const resolvers = {
  Query: {
    getDatasets: async (obj, args, context) => {
      console.log(context.user._id);
      return await Datasets.find({ user: context.user._id });
    },
  },
};

module.exports = resolvers;
