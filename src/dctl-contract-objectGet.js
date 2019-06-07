#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("Get SmartContract Object from storage.", { key: "(string) Object key" })
  .arguments("<key>")
  .option("-c, --smartContractId <smartContractId>", "(required if not in ENV.CONTRACT_ID) Contract Id.")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);

util.wrapper(program, async client => {
  try {
    const [key] = program.args;
    const { smartContractId } = program;
    const params = util.removeUndefined({ key, smartContractId });
    const result = JSON.stringify(await client.getSmartContractObject(params), null, 2);
    console.log(result);
  } catch (e) {
    console.error(e.message);
  }
});
