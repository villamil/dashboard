const fs = require("fs");
const toJson = require("./plain-text-to-json");
let variables;

const setVariables = () => {
  const configPath = process.argv[2];
  console.log("Config Path", configPath);
  let doc;
  try {
    doc = fs.readFileSync(configPath, "utf8");
  } catch (error) {
    console.log(error);
  }
  variables = toJson(doc);
  console.log(variables);
};

module.exports = {
  variables,
  setVariables,
};
