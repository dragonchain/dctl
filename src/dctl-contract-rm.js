const program = require('commander');
const util = require('./util');

program
  .description('Delete a SmartContract by ID', {
    smartContractIds: 'The ID of the contract(s) you want to delete'
  })
  .arguments('<smartContractIds...>')
  .option('-t, --transactionType [transactionType]', '(mutually exclusive with smartContractId) Transaction type of the contract to delete')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const { transactionType } = program;
  if (program.args.length !== 0 && transactionType) throw new Error("Please provide only 1 of 'smartContractIds' or 'transactionType'");
  const results = [];
  if (program.args.length > 0) {
    await Promise.all(
      program.args.map(async smartContractId => {
        results.push(await client.deleteSmartContract({ smartContractId }));
      })
    );
  } else if (transactionType) {
    results.push(await client.deleteSmartContract({ transactionType }));
  } else {
    throw new Error("At least one of 'smartContractIds' or 'transactionType' must be provided");
  }
  console.log(JSON.stringify(results, null, 2));
});
