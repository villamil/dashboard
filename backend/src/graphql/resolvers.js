const ProjectsResolvers = require("./projects");
const ExperimentsResolvers = require("./experiments");
const DatasetsResolvers = require("./datasets");
const VolunteerConfig = require("./volunteers");
const ConnectionsResolver = require("./connections");

const rootResolver = [
  ProjectsResolvers,
  ExperimentsResolvers,
  DatasetsResolvers,
  VolunteerConfig,
  ConnectionsResolver,
];

module.exports = rootResolver;
