#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("List SmartContracts")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);

util.wrapper(program, async client => {
  const result = JSON.stringify(await client.querySmartContracts(), null, 2);
  console.log(result);
});
