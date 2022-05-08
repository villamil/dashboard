require("dotenv").config();

const resolvers = {
  Query: {
    getVolunteerConfig: async (obj, args, context) => {
      return {
        minio_endpoint: process.env.MINIO_ENDPOINT,
        minio_port: process.env.MINIO_PORT,
        minio_access_key: process.env.MINIO_ACCESS_KEY,
        minio_secret_key: process.env.MINIO_SECRET_KEY,
        agent_manager_url: process.env.AGENT_MANAGER_URL,
        agent_manager_port: process.env.AGENt_MANAGER_PORT,
      };
    },
  },
};

module.exports = resolvers;
