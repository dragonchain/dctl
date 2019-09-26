const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('get', 'Get a block by ID')
  .alias('g')
  .command('query', 'Query blocks')
  .alias('q')
  .command('verification', 'Get Block Verifications')
  .alias('v')
  .parse(process.argv);
