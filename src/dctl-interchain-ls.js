const program = require('commander');
const util = require('./util');

program
  .description('List the configured interchains for a chain', {
    blockchain: "The blockchain type to set (i.e. 'bitcoin', 'ethereum', etc)"
  })
  .arguments('<blockchain>')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [blockchain] = program.args;
  if (!blockchain) throw new Error("Parameter 'blockchain' must be provided");
  const response = await client.listInterchainNetworks({
    blockchain
  });
  console.log(JSON.stringify(response, null, 2));
});
