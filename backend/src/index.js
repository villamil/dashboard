const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const template = require("lodash/template");
const { connect } = require("mongoose");
const Auth = require("./routes");
const Agent = require("./routes/agent");
const Upload = require("./routes/upload");

const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { exec, spawn } = require("child_process");
const jwt = require("jsonwebtoken");
const { graphqlUploadExpress } = require("graphql-upload");

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/type-definitions");
const { jwtSecret } = require("./config");
const minioClient = require("./minio");

require("dotenv").config();

const createAgent = () => {
  console.log("CREATING AGENT");
  fs.writeFileSync(
    path.join(__dirname, "/agent/.env"),
    `MINIO_ENDPOINT=${process.env.MINIO_ENDPOINT}
MINIO_PORT=${process.env.MINIO_PORT}
MINIO_ACCESS_KEY=${process.env.MINIO_ACCESS_KEY}
MINIO_SECRET_KEY=${process.env.MINIO_SECRET_KEY}
  `
  );

  const agentPath = path.join(__dirname, "/agent");
  exec(`cd ${agentPath} && npm install `, (err, stdout, stderr) => {
    // ...
    console.log(err);
    console.log(stdout);
  });

  exec(`pkg ${agentPath}/index.js`, (err, stdout, stderr) => {
    // ...
    console.log(err);
    console.log(stdout);
  });
  console.log("finished building ? ");
};

(async function boot() {
  createAgent();
  const app = express();

  app.use("/api", cors());
  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);
    // Pass to next layer of middleware
    next();
  });

  app.use(bodyParser.json());

  const mongoUri = template(
    process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/db"
  );

  await connect(mongoUri({ env: process.env }), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const http = require("http");
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Note: This example uses the `req` argument to access headers,
      // but the arguments received by `context` vary by integration.
      // This means they vary for Express, Koa, Lambda, etc.
      //
      // To find out the correct arguments for a specific integration,
      // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

      // Get the user token from the headers.
      const token = req.headers.authorization || "";
      function parseToken(rawToken) {
        return jwt.verify(rawToken.split(" ")[1], jwtSecret);
      }
      // Try to retrieve a user with the token
      const user = parseToken(token);
      // Add the user to the context
      return { ...user };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  app.get("/clear-buckets", (req, res) => {
    res.send("cleaning...");
  });

  app.use("/api/auth", Auth);
  app.use("/api/agent", Agent);
  app.use("/api/upload", Upload);

  await server.start();
  server.applyMiddleware({ app });
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})();

// httpServer.listen(8080, () => {
//   console.log("listening on *:8080");
// });
