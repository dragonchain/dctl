#!/usr/bin/env node

const program = require("commander");
const fs = require("fs");
const util = require("./util");
const ini = require("ini");

program
  .description("Set the current default chain ID", { chainId: "(string) The chain ID to set as default." })
  .arguments("<chainId>")
  .parse(process.argv);

try {
  const [chainId] = program.args;
  if (!chainId) throw new Error("Missing Param: chainId");
  const currentConfig = ini.parse(fs.readFileSync(util.getConfigFilePath(), "utf-8"));
  if (!currentConfig[chainId]) throw new Error(`${chainId} has not been added yet. Try using the "dctl creds add" command.`);
  const newConfig = {
    ...currentConfig,
    default: { dragonchain_id: chainId }
  };
  fs.writeFileSync(util.getConfigFilePath(), ini.stringify(newConfig));
  console.log(`Success. Default has been set to "${chainId}".`);
} catch (e) {
  console.error(e.message);
}
