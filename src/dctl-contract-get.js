const program = require('commander');
const util = require('./util');

program
  .description('Get a SmartContract by ID or transaction type', {
    smartContractId: '(optional) The ID of the contract you want to get. (use -t if you want to get by transaction type)'
  })
  .arguments('[smartContractId]')
  .option('-t, --transactionType [transactionType]', '(mutually exclusive with smartContractId) Transaction type of the contract to get')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [smartContractId] = program.args;
  const { transactionType } = program;
  if (smartContractId && transactionType) throw new Error("Please provide only 1 of 'smartContractId' or 'transactionType'");
  let response = '';
  if (smartContractId) {
    response = await client.getSmartContract({ smartContractId });
  } else if (transactionType) {
    response = await client.getSmartContract({ transactionType });
  } else {
    throw new Error("At least one of 'smartContractId' or 'transactionType' must be provided");
  }
  console.log(JSON.stringify(response, null, 2));
});
