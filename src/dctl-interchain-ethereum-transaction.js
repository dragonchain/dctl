const program = require('commander');
const util = require('./util');

program
  .description('Create/sign an ethereum transaction using a configured interchain', {
    name: 'The name of the interchain to use in order to create this transaction'
  })
  .arguments('<name>')
  .option('-t, --to <to>', 'The (hex-encoded) address to send this transaction to')
  .option('-v, --value <value>', 'The (hex-encoded) number of wei to send with this transaction')
  .option('-d, --data [data]', '(optional) The (hex-encoded) string of extra data to include with this transaction')
  .option('-p, --gas-price [gasPrice]', '(optional) The (hex-encoded) gas price in gwei to pay. If not supplied, it will be estimated automatically')
  .option('-g, --gas [gas]', '(optional) The (hex-encoded) gas limit for this transaction')
  .option('-n, --nonce [nonce]', '(optional) The (hex-encoded) nonce for this transaction. If not supplied, it will be fetched automatically')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [name] = program.args;
  const { to, value, data, gasPrice, gas, nonce } = program;
  if (!name) throw new Error("Parameter 'name' must be provided");
  if (!to) throw new Error("Parameter 'to' must be provided");
  if (!value) throw new Error("Parameter 'value' must be provided");
  const response = await client.signEthereumTransaction(
    util.removeUndefined({
      name,
      to,
      data,
      value,
      gasPrice,
      gas,
      nonce
    })
  );
  console.log(JSON.stringify(response, null, 2));
});
