const program = require('commander');
const util = require('./util');

program
  .description('List SmartContract Objects by prefix', {
    prefixKey: "Path to list in. If not provided, lists at the heap's root"
  })
  .arguments('[prefixKey]')
  .option('-c, --smartContractId [smartContractId]', '(required if not running in a smart contract) Which contract heap to list from')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [prefixKey] = program.args;
  const { smartContractId } = program;
  const result = JSON.stringify(await client.listSmartContractObjects(util.removeUndefined({ prefixKey, smartContractId })), null, 2);
  console.log(result);
});
