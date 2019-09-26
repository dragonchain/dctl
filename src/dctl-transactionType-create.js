const program = require('commander');
const util = require('./util');

program
  .description('Create a new Transaction Type', {
    transactionType: 'The name of the transaction type to create'
  })
  .arguments('<transactionType>')
  .option(
    '-c, --customIndexes [customIndexes]',
    `(optional) Json string array of custom indexes for this transaction type
           ex: '[{"fieldName":"aField","path":".thing","type":"text","options":{"sortable":true}}]'
           See here for syntax: https://node-sdk-docs.dragonchain.com/latest/interfaces/customtextfieldoptions.html`
  )
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [transactionType] = program.args;
  const { customIndexes } = program;
  const response = await client.createTransactionType(
    util.removeUndefined({
      transactionType,
      customIndexFields: customIndexes && JSON.parse(customIndexes)
    })
  );
  console.log(JSON.stringify(response, null, 2));
});
