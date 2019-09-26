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
  .parse(process.argv);
