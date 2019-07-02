#!/usr/bin/env node

const program = require('commander');
const util = require('./util');

program
  .description('Update a running SmartContract', {
    smartContractId: '(string) Contract ID',
    secretName: '(string) Secret Name'
  })
  .arguments('<smartContractId> <secretName>')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK.')
  .option('-i, --dragonchain-id [dragonchainID]', '(optional) Override the default dragonchain ID for this command.')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [smartContractId, secretName] = program.args;
  const response = await client.getSmartContractSecret({
    smartContractId,
    secretName
  });
  console.log(JSON.stringify(response, null, 2));
});
