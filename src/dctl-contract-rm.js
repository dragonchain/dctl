#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("Delete a SmartContract by ID", { smartContractId: "The ID of the contract you want to delete." })
  .arguments("<smartContractIds...>")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .action(smartContractIds => {
    util.wrapper(program, async client => {
      smartContractIds.forEach(async smartContractId => {
        const response = await client.deleteSmartContract({ smartContractId });
        console.log(JSON.stringify(response, null, 2));
      });
    });
  })
  .parse(process.argv);
