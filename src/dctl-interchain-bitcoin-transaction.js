const program = require('commander');
const util = require('./util');

program
  .description('Create/sign a bitcoin transaction using a configured interchain', {
    name: 'The name of the interchain to use in order to create this transaction'
  })
  .arguments('<name>')
  .option('-s, --satoshis-per-byte [satoshisPerByte]', '(optional) The desired fee to use in satoshis/byte. Must be an integer')
  .option('-d, --data [data]', '(optional) Any string data to embed in this transaction')
  .option('-c, --change [change]', '(optional) The change address to use for this transaction. If not supplied, this will be the source address')
  .option(
    '-o, --outputs [outputs]',
    '(optional) JSON string array of bitcoin transaction outputs for this transaction. i.e. \'[{"to":"1PGvDzfUUcCFp9cKNFMd5A1aPvnA2iswDD","value":0.0035}]\''
  )
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [name] = program.args;
  const { satoshisPerByte, data, change, outputs } = program;
  if (!name) throw new Error("Parameter 'name' must be provided");
  const response = await client.signBitcoinTransaction(
    util.removeUndefined({
      name,
      data,
      changeAddress: change,
      satoshisPerByte: satoshisPerByte && Number(satoshisPerByte),
      outputs: outputs && JSON.parse(outputs)
    })
  );
  console.log(JSON.stringify(response, null, 2));
});
