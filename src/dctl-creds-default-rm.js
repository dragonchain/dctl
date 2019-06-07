#!/usr/bin/env node

const program = require("commander");
const fs = require("fs");
const util = require("./util");
const ini = require("ini");

program.description("Unset the current default chain ID").parse(process.argv);

try {
  const currentConfig = ini.parse(fs.readFileSync(util.getConfigFilePath(), "utf-8"));
  if (currentConfig.default) delete currentConfig.default;
  fs.writeFileSync(util.getConfigFilePath(), ini.stringify(currentConfig));
  console.log(`Success. Default has been unset.`);
} catch (e) {
  console.error(e.message);
}
