#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const util = require('./util');
const ini = require('ini');

program
  .description('Set the current default chain ID', {
    chainId: '(string) The chain ID to set as default.'
  })
  .arguments('<chainId>')
  .parse(process.argv);

util.errorHandler(() => {
  const [chainId] = program.args;
  if (!chainId) throw new Error('Missing Param: chainId');
  const config = ini.parse(fs.readFileSync(util.getConfigFilePath(), 'utf-8'));
  if (!config[chainId]) throw new Error(`${chainId} has not been added yet. Try using the "dctl creds add" command.`);
  config.default = { dragonchain_id: chainId };
  fs.writeFileSync(util.getConfigFilePath(), ini.stringify(config));
  console.log(`Success. Default has been set to "${chainId}".`);
});
