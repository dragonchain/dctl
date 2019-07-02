#!/usr/bin/env node

const program = require('commander');
const { wrapper, removeUndefined } = require('./util');

program
  .arguments('<transactionType> <payload>')
  .option('-c, --callbackUrl <callbackUrl>', '(optional) The http address you want called after processing.')
  .option('-t, --tag <tag>', '(optional) Tag you want to add to this transaction.')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK.')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command.')
  .parse(process.argv);

(async () => {
  await wrapper(program, async client => {
    const { tag, callbackURL } = program;
    let [transactionType, payload] = program.args;
    if (!transactionType) throw new Error('Error: Missing Param "transactionType"');
    if (!payload) throw new Error('Error: Missing Param "payload"');
    try {
      payload = JSON.parse(payload);
    } catch (e) {
      console.warn('Could not parse JSON for payload, sending raw data instead...');
    }
    const result = await client.createTransaction(removeUndefined({ transactionType, payload, tag, callbackURL }));
    console.log(JSON.stringify(result, null, 2));
  });
})();
