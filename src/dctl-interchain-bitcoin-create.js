const program = require('commander');
const util = require('./util');

program
  .description('Create a bitcoin interchain network', {
    name: 'The name to set for this interchain'
  })
  .arguments('<name>')
  .option('-p, --private-key [privateKey]', '(optional) Base64 or WIF bitcoin private key to use with this interchain. Randomly generated if not provided')
  .option(
    '-t, --testnet',
    '(optional) Sets this interchain to use the bitcoin testnet (defaults to mainnet). This value is automatically derived if providing private key as a WIF'
  )
  .option('-r, --rpc-address [rpcAddress]', '(optional) The address of the bitcoin RPC to node to use (will use a dragonchain-hosted node if not provided)')
  .option(
    '-c, --rpc-authorization [rpcAuthorization]',
    '(optional) The base64-encoded username:password for a secured rpc node. For example, user: a pass: b would be \'YTpi\' (base64("a:b"))'
  )
  .option('-u, --utxo-scan', '(optional) Whether or not to force a utxo-rescan for this address. This is required if using a key to an address with existing transactions')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [name] = program.args;
  const { privateKey, rpcAddress, testnet, rpcAuthorization, utxoScan } = program;
  if (!name) throw new Error("Parameter 'name' must be provided");
  const response = await client.createBitcoinInterchain(
    util.removeUndefined({
      name,
      privateKey,
      rpcAddress,
      rpcAuthorization,
      testnet: testnet || false,
      utxoScan
    })
  );
  console.log(JSON.stringify(response, null, 2));
});
