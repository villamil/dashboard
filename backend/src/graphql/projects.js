const Projects = require("../collections/Projects");
const Users = require("../collections/Users");

const resolvers = {
  Query: {
    getProjects: async (obj, args, context) => {
      const { self = false } = args?.data || {};
      if (self) {
        return Projects.find({ user: context.user._id });
      }
      return await Projects.find({});
    },
  },
  Mutation: {
    async createProject(obj, args, context) {
      const project = await Projects.create({
        ...args?.data,
        user: context.user._id,
      });

      return project;
    },
  },
  Project: {
    async user(project) {
      const projectUser = await Users.findById(project.user);
      return projectUser;
    },
  },
};

module.exports = resolvers;
