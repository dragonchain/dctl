const program = require('commander');
const util = require('./util');

program
  .description('Update a divi interchain network', {
    name: 'The name of the interchain to update'
  })
  .arguments('<name>')
  .option('-p, --private-key [privateKey]', '(optional) Base64 or WIF divi private key to use with this interchain. Randomly generated if not provided')
  .option('-t, --testnet', '(optional) Sets this interchain to use the divi testnet. This value is automatically derived if providing private key as a WIF')
  .option('-m, --mainnet', '(optional) Sets this interchain to use the divi mainnet. This value is automatically derived if providing private key as a WIF')
  .option('-r, --rpc-address [rpcAddress]', '(optional) The address of the divi RPC node to use (will use a dragonchain-hosted node if not provided)')
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
  const { privateKey, rpcAddress, testnet, rpcAuthorization, utxoScan, mainnet } = program;
  if (!name) throw new Error("Parameter 'name' must be provided");
  let derivedTestnet = mainnet ? false : undefined;
  if (derivedTestnet === undefined) {
    derivedTestnet = testnet ? true : undefined;
  }
  const response = await client.updateDiviInterchain(
    util.removeUndefined({
      name,
      privateKey,
      rpcAddress,
      rpcAuthorization,
      testnet: derivedTestnet,
      utxoScan
    })
  );
  console.log(JSON.stringify(response, null, 2));
});
