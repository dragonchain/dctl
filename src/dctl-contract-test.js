const program = require('commander');

program
  .description('Contract test methods')
  .alias('i')
  .command('run', 'Run a test for a given smart contract')
  .alias('r')

  .parse(process.argv);
