#!/usr/bin/env node

const program = require("commander");
const fs = require("fs");
const util = require("./util");
const ini = require("ini");
const readlineSync = require("readline-sync");

program
  .description("Remove credentials", { chainId: "The ID of the chain to be removed from your config." })
  .arguments("<chainId>")
  .parse(process.argv);

try {
  const [chainId] = program.args;
  const currentConfig = ini.parse(fs.readFileSync(util.getConfigFilePath(), "utf-8"));
  if (!currentConfig[chainId]) throw new Error(`ERROR: Could not find chain ID "${chainId}". Nothing has been changed.`);
  delete currentConfig[chainId];
  if (currentConfig.default && currentConfig.default.dragonchain_id && currentConfig.default.dragonchain_id === chainId) {
    const unsetDefault = readlineSync.question(`${chainId} is currently set as default. Unset? (Y/n) `, { defaultInput: "y" });
    if (unsetDefault.toLowerCase() === "y") {
      delete currentConfig.default;
      console.log("Default has been unset");
    }
  }
  fs.writeFileSync(util.getConfigFilePath(), ini.stringify(currentConfig));
  console.log(`${chainId} credentials have been deleted on this machine.`);
} catch (e) {
  console.error(e.message);
}
