const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('set', 'Set a chain as default')
  .command('get', 'Get default chain id')
  .parse(process.argv);
