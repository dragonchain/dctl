const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('get', "Get an object ina smart contract's heap")
  .alias('g')
  .command('list', "List objects in a smart contract's heap")
  .alias('ls')
  .parse(process.argv);
