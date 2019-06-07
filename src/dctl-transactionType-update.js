#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("Update a Transaction Type.")
  .arguments("<transactionType>")
  .option("-c, --custom-indexes <customIndexes>", 'Custom Indexes for this transaction type. ex. [{"key":"a","path":"/"}]')
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);
util.wrapper(program, async client => {
  const [transactionType] = program.args;
  const { customIndexes } = program;
  const response = await client.updateTransactionType({
    transactionType,
    customIndexes: JSON.parse(customIndexes)
  });
  console.log(JSON.stringify(response, null, 2));
});
