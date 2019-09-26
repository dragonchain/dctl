const program = require('commander');
const util = require('./util');

program
  .description('Get a specific transaction', {
    transactionId: 'The transaction id to get'
  })
  .arguments('<transactionId>')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [transactionId] = program.args;
  if (!transactionId) throw new Error('Error: Missing Param "transactionId"');
  const result = await client.getTransaction({ transactionId });
  console.log(JSON.stringify(result, null, 2));
});
