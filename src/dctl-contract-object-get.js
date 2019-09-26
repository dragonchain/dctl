const program = require('commander');
const util = require('./util');

program
  .description('Get SmartContract Object from storage', {
    key: 'Path (key) of the object to get'
  })
  .arguments('<key>')
  .option('-c, --smartContractId [smartContractId]', '(required if not running in a smart contract) Which contract heap to get from')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [key] = program.args;
  if (!key) throw new Error('Parameter "key" is required.');
  const { smartContractId } = program;
  const params = util.removeUndefined({ key, smartContractId });
  console.log(JSON.stringify(await client.getSmartContractObject(params), null, 2));
});
