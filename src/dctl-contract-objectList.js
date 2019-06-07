#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("List SmartContract Objects by prefix.", { prefixKey: '(string) Object key. Must start with "/"' })
  .arguments("<prefixKey>")
  .option("-c, --smartContractId <smartContractId>", "(required if not in ENV.CONTRACT_ID) Contract Id.")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);

util.wrapper(program, async client => {
  try {
    const [prefixKey] = program.args;
    if (!prefixKey.startsWith("/")) throw Error('Prefix key must start with "/"');
    const { smartContractId } = program;
    const params = util.removeUndefined({ prefixKey, smartContractId });
    const result = JSON.stringify(await client.listSmartContractObjects(params), null, 2);
    console.log(result);
  } catch (e) {
    console.error(e.message);
  }
});
