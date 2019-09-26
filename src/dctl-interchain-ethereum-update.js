const program = require('commander');
const util = require('./util');

program
  .description('Update an ethereum interchain network', {
    name: 'The name of the interchain to update'
  })
  .arguments('<name>')
  .option('-p, --private-key [privateKey]', '(optional) Base64 or hex-encoded ethereum private key to use with this interchain. Randomly generated if not provided')
  .option('-r, --rpc-address [rpcAddress]', '(optional) The address of the ethereum RPC to node to use (will use a dragonchain-hosted node if not provided)')
  .option('-c, --chain-id [chainId]', '(optional) The ethereum chain id to use. Must match what is returned by the rpc node')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [name] = program.args;
  const { privateKey, rpcAddress, chainId } = program;
  if (!name) throw new Error("Parameter 'name' must be provided");
  const response = await client.updateEthereumInterchain(
    util.removeUndefined({
      name,
      privateKey,
      rpcAddress,
      chainId: chainId && Number(chainId)
    })
  );
  console.log(JSON.stringify(response, null, 2));
});
