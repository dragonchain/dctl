const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('create', 'Create a divi interchain')
  .alias('c')
  .command('update', 'Update a divi interchain')
  .alias('u')
  .command('transaction', 'Create/sign a divi transaction using a configured interchain')
  .alias('t')
  .parse(process.argv);
