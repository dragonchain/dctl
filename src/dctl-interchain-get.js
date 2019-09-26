const program = require('commander');
const util = require('./util');

program
  .description('Get a configured interchain network', {
    blockchain: "The blockchain type to set (i.e. 'bitcoin', 'ethereum', etc)",
    name: 'The name of the configured interchain to set as default'
  })
  .arguments('<blockchain> <name>')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [blockchain, name] = program.args;
  if (!blockchain) throw new Error("Parameter 'blockchain' must be provided");
  if (!name) throw new Error("Parameter 'name' must be provided");
  const response = await client.getInterchainNetwork({
    blockchain,
    name
  });
  console.log(JSON.stringify(response, null, 2));
});
