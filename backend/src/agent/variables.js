import fs from "fs";
import { toJson } from "plain-text-data-to-json";

export let variables;

export const setVariables = () => {
  const doc = fs.readFileSync("config.txt", "utf8");
  variables = toJson(doc);
};
