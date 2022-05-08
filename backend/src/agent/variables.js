import fs from "fs";
import { toJson } from "plain-text-data-to-json";

export let variables;

export const setVariables = () => {
  const configPath = process.argv[2];
  console.log("Config Path", configPath);
  const doc = fs.readFileSync(configPath, "utf8");
  variables = toJson(doc);
  console.log(variables);
};
