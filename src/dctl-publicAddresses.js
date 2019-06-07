#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("Get your chain's public network addresses.")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);

util.wrapper(program, async client => {
  const response = await client.getPublicBlockchainAddresses();
  console.log(JSON.stringify(response, null, 2));
});
