const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('create', 'Create a new transaction')
  .alias('c')
  .command('bulk', 'Create a bulk transaction')
  .alias('b')
  .command('get', 'Get a transaction by id')
  .alias('g')
  .command('query', 'Get a transaction by query')
  .alias('q')
  .command('eternal', 'Get an eternal proof report for a transaction')
  .alias('e')
  .parse(process.argv);
