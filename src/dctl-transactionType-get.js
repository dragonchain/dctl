#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("Get a Transaction Type.")
  .arguments("<transactionType>")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);
util.wrapper(program, async client => {
  const [transactionType] = program.args;
  const response = await client.getTransactionType({
    transactionType
  });
  console.log(JSON.stringify(response, null, 2));
});
