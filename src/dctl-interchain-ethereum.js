const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('create', 'Create an ethereum interchain')
  .alias('c')
  .command('update', 'Update an ethereum interchain')
  .alias('u')
  .command('transaction', 'Create/sign an ethereum transaction using a configured interchain')
  .alias('t')
  .parse(process.argv);
