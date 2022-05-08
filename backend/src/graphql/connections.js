const Connections = require("../collections/Connections");
const Users = require("../collections/Users");

const resolvers = {
  Query: {
    getConnections: async (obj, args, context) => {
      return await Connections.find({});
    },
  },
  Connection: {
    async user(connection) {
      return await Users.findById(connection.user);
    },
  },
};

module.exports = resolvers;
