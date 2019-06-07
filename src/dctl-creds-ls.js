#!/usr/bin/env node

const program = require("commander");
const fs = require("fs");
const util = require("./util");
const ini = require("ini");

program
  .description("List all credentials")
  .option("-k, --show-keys", "Print the sensitive detals about the keys along with other data")
  .parse(process.argv);

try {
  const currentConfig = ini.parse(fs.readFileSync(util.getConfigFilePath(), "utf-8"));
  let configString = JSON.stringify(currentConfig, null, 2);
  if (!program.showKeys) configString = configString.replace(/auth_key": "(.*?)"/g, 'auth_key": "<hidden>"');
  console.log(configString);
} catch (e) {
  console.error(e.message);
}
