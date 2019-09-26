const program = require('commander');
const util = require('./util');

program
  .description('Get the default interchain of an L5')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const response = await client.getDefaultInterchainNetwork();
  console.log(JSON.stringify(response, null, 2));
});
