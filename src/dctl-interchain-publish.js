const program = require('commander');
const util = require('./util');

program
  .description('Publish a signed interchain transaction on the public network', {
    blockchain: "The blockchain type to set (i.e. 'bitcoin', 'ethereum', etc)",
    name: 'The name of the configured interchain to set as default',
    signedTransaction: "The signed interchain transaction to publish (what is returned from `dctl interchain <blockchain> transaction`"
  })
  .arguments('<blockchain> <name> <signedTransaction>')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [blockchain, name, signedTransaction] = program.args;
  if (!blockchain) throw new Error("Parameter 'blockchain' must be provided");
  if (!name) throw new Error("Parameter 'name' must be provided");
  if (!signedTransaction) throw new Error("Parameter 'signedTransaction' must be provided");
  const response = await client.publishInterchainTransaction({
    blockchain,
    name,
    signedTransaction
  });
  console.log(JSON.stringify(response, null, 2));
});
