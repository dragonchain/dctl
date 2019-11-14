const program = require('commander');
const util = require('./util');

program
  .description('Create/sign a binance transaction using a configured interchain', {
    name: 'The name of the interchain to use in order to create this transaction'
  })
  .arguments('<name>')
  .option('-a, --amount <amount>', 'The (integer) amount of tokens to send with this transaction')
  .option('-t --to <to>', 'The (hex-encoded) address to send this transaction to')
  .option('-s, --symbol [symbol]', '(optional) The symbol for the token being sent')
  .option('-m, --memo [memo]', '(optional) Any string of extra data to embed in this transaction')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [name] = program.args;
  const { amount, to, symbol, memo } = program;
  if (!name) throw new Error("Parameter 'name' must be provided");
  if (!amount) throw new Error("Parameter 'amount' must be provided");
  if (!to) throw new Error("Parameter 'to' must be provided");
  const response = await client.signBinanceTransaction(
    util.removeUndefined({
      name,
      amount: amount && Number(amount),
      toAddress: to,
      symbol,
      memo
    })
  );
  console.log(JSON.stringify(response, null, 2));
});
