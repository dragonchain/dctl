const program = require('commander');
const util = require('./util');
const fs = require('fs');

program
  .description('Create a transaction', {
    transactionType: 'The transaction type to create a transaction for',
    payload: 'The payload of the transaction, either as json or a raw string'
  })
  .arguments('<transactionType> <payload>')
  .option('-c, --callbackUrl <callbackUrl>', '(optional) The http address you want called after processing')
  .option('-t, --tag <tag>', '(optional) Tag you want to add to this transaction')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .option('-f, --file', '(optional) Pass in a JSON file path as payload instead of a raw string')
  .parse(process.argv);

util.wrapper(program, async client => {
  const { tag, callbackURL } = program;
  let [transactionType, payload] = program.args;
  if (!transactionType) throw new Error('Error: Missing Param "transactionType"');
  if (!payload) throw new Error('Error: Missing Param "payload"');

  if (program.file) {
    try {
      payload = JSON.parse(fs.readFileSync(payload, 'utf8'));
    } catch (e) {
      throw new Error('Error: Payload file must be valid JSON');
    }
  } else {
    try {
      payload = JSON.parse(payload);
    } catch (e) {
      console.warn('Could not parse JSON for payload, sending raw data instead...');
    }
  }

  const result = await client.createTransaction(util.removeUndefined({ transactionType, payload, tag, callbackURL }));
  console.log(JSON.stringify(result, null, 2));
});
