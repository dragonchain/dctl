const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('bitcoin', 'Bitcoin interchain operations')
  .alias('b')
  .command('ethereum', 'Ethereum interchain operations')
  .alias('e')
  .command('binance', 'Binance interchain operations')
  .alias('bn')
  .command('divi', 'Divi interchain operations')
  .alias('d')
  .command('rm', 'Remove a configured interchain')
  .command('ls', 'List interchain networks')
  .command('get', 'Get a specific interchain network')
  .alias('g')
  .command('default', 'Operations for getting/setting default interchains (l5 only)')
  .alias('d')
  .command('publish', 'Publish a signed interchain transaction')
  .alias('p')
  .parse(process.argv);
