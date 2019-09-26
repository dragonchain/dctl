#!/usr/bin/env node

const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('status', 'Get the status of your chain')
  .alias('s')
  .command('transaction', 'Commands for interfacing with transactions')
  .alias('t')
  .command('transactionType', 'Commands for interfacing with transaction types')
  .alias('tt')
  .command('contract', 'Commands for interfacing with contracts')
  .alias('c')
  .command('block', 'Commands for interfacing with blocks')
  .alias('b')
  .command('creds', 'Manage dragonchain credentials on this machine')
  .alias('k')
  .command('interchain', 'Manage interchains configured for a dragonchain')
  .alias('i')
  .parse(process.argv);
