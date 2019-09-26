const program = require('commander');

program
  .description('Contract methods')
  .command('create', 'Create a new contract')
  .alias('c')
  .command('update', 'Update an existing contract')
  .alias('u')
  .command('rm', 'Delete an existing contract')
  .alias('d')
  .command('get', 'Get a SmartContract')
  .alias('g')
  .command('ls', 'List smart contracts')
  .alias('l')
  .command('secret', 'Get a SmartContract secret')
  .alias('s')
  .command('object', 'Commands for interacting with the a smart contract heap')
  .alias('o')
  .command('logs', 'Get the logs of a smart contract')
  .parse(process.argv);
