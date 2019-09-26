const program = require('commander');
const util = require('./util');

program
  .description('Create an ethereum interchain network', {
    name: 'The name to set for this interchain'
  })
  .arguments('<name>')
  .option('-p, --private-key [privateKey]', '(optional) Base64 or hex-encoded ethereum private key to use with this interchain. Randomly generated if not provided')
  .option('-r, --rpc-address [rpcAddress]', '(optional) The address of the ethereum RPC to node to use (will use a dragonchain-hosted node if not provided)')
  .option('-c, --chain-id [chainId]', '(optional) The ethereum chain id to use. Required if not providing rpc-adress. 1=ETH Mainnet|3=ETH Ropsten|61=ETC Mainnet|62=ETC Morden')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [name] = program.args;
  const { privateKey, rpcAddress, chainId } = program;
  if (!name) throw new Error("Parameter 'name' must be provided");
  const response = await client.createEthereumInterchain(
    util.removeUndefined({
      name,
      privateKey,
      rpcAddress,
      chainId: chainId && Number(chainId)
    })
  );
  console.log(JSON.stringify(response, null, 2));
});
