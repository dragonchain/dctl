#!/usr/bin/env node

const program = require("commander");
const util = require("./util");

program
  .description("Update a running SmartContract", { smartContractId: "(string) Contract ID", secretName: "(string) Secret Name" })
  .arguments("<smartContractId> <secretName>")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchain-id [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);
const [smartContractId, secretName] = program.args;

util.wrapper(program, async client => {
  try {
    const response = await client.getSmartContractSecret({ smartContractId, secretName });
    console.log(JSON.stringify(response, null, 2));
  } catch (e) {
    console.error(
      `
    Error when getting secret.
    Are you running this from within a SmartContract?
    `,
      JSON.stringify(e.message)
    );
  }
});
