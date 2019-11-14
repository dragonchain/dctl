const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('create', 'Create a binance interchain')
  .alias('c')
  .command('update', 'Update a binance interchain')
  .alias('u')
  .command('transaction', 'Create/sign a binance transaction using a configured interchain')
  .alias('t')
  .parse(process.argv);
