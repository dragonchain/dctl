#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("Get a SmartContract by ID", { smartContractId: "The ID of the contract you want to get." })
  .arguments("<smartContractId>")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .action(smartContractId => {
    util.wrapper(program, async client => {
      const response = await client.getSmartContract({ smartContractId });
      console.log(JSON.stringify(response, null, 2));
    });
  })
  .parse(process.argv);
