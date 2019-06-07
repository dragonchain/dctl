#!/usr/bin/env node

const program = require("commander");
const wrapper = require("./util").wrapper;

program
  .arguments("<transactionId>")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);

const [transactionId] = program.args;
(async () => {
  await wrapper(program, async client => {
    try {
      if (!transactionId) throw new Error('Error: Missing Param "transactionId"');
      const result = await client.getTransaction({ transactionId });
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.error(e.message);
    }
  });
})();
