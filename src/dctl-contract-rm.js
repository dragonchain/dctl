const program = require('commander');
const util = require('./util');

program
  .description('Delete a SmartContract by ID', {
    smartContractIds: 'The ID of the contract(s) you want to delete'
  })
  .arguments('<smartContractIds...>')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const results = [];
  await Promise.all(
    program.args.map(async smartContractId => {
      results.push(await client.deleteSmartContract({ smartContractId }));
    })
  );
  console.log(JSON.stringify(results, null, 2));
});
