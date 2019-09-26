const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('create', 'Create a bitcoin interchain')
  .alias('c')
  .command('update', 'Update a bitcoin interchain')
  .alias('u')
  .command('transaction', 'Create/sign a bitcoin transaction using a configured interchain')
  .alias('t')
  .parse(process.argv);
