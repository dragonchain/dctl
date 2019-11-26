const program = require('commander');
const util = require('./util');

program
  .description('Update a binance interchain network', {
    name: 'The name of the interchain to update'
  })
  .arguments('<name>')
  .option('-p, --private-key [privateKey]', '(optional) Base64 or hex-encoded binance private key (or mnemonic) to use with this interchain. Randomly generated if not provided')
  .option('-t, --testnet', '(optional) Sets this interchain to use the binance testnet.')
  .option('-m, --mainnet', '(optional) Sets this interchain to use the binance mainnet.')
  .option('-n, --node-url [nodeURL]', '(optional) The address of the binance node to use (will use a dragonchain-hosted node if not provided')
  .option('-r, --rpc-port [rpcPort]', '(optional) The port used for the RPC endpoints.  Required if providing node-url.')
  .option('-a, --api-port [apiPort]', '(optional) The port used for the API endpoints.  Required if providing node-url.')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [name] = program.args;
  const { privateKey, testnet, mainnet, nodeURL, rpcPort, apiPort } = program;
  if (!name) throw new Error("Parameter 'name' must be provided");
  let derivedTestnet = mainnet ? false : undefined;
  if (derivedTestnet === undefined) {
    derivedTestnet = testnet ? true : undefined;
  }
  const response = await client.updateBinanceInterchain(
    util.removeUndefined({
      name,
      privateKey,
      testnet: derivedTestnet,
      nodeURL,
      rpcPort: rpcPort && Number(rpcPort),
      apiPort: apiPort && Number(apiPort)
    })
  );
  console.log(JSON.stringify(response, null, 2));
});
