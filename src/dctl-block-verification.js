const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('get', "Get a block' verifications")
  .alias('g')
  .command('pending', "Get a block's pending verifications")
  .alias('p')
  .parse(process.argv);
