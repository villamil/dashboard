const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar JSONObject
  scalar FileUpload

  type Query {
    books: [Book]
    getProjects(data: JSONObject): [Project]

    getExperiments(data: JSONObject): [Experiment]

    getDatasets: [Dataset]

    getVolunteerConfig: VolunteerConfig

    getConnections: [Connection]

    getRankings: [Ranking]
  }

  type Mutation {
    createProject(data: JSONObject): Project

    createExperiment(data: JSONObject): Experiment
  }

  type Book {
    title: String
    author: String
  }

  type VolunteerConfig {
    minio_endpoint: String
    minio_port: String
    minio_access_key: String
    minio_secret_key: String
    agent_manager_url: String
    agent_manager_port: String
  }

  type User {
    _id: String
    name: String
    email: String
    password: String
  }

  type Experiment {
    _id: String
    name: String
    image: String
    epochs: Int
    splits: Int
    status: String
    dataset: Dataset
    project: Project
    user: User
    download: String
  }

  type Project {
    _id: String
    name: String
    description: String
    category: String
    user: User
    experiments: [Experiment]
    volunteers: [User]
  }

  type Dataset {
    _id: String
    name: String
    description: String
    rootFolder: String
    user: User
    ready: Boolean
  }

  type Connection {
    _id: String
    clientId: String
    status: String
    os: String
    user: User
  }

  type Ranking {
    rank: Int
    user: User
  }
`;

module.exports = typeDefs;
