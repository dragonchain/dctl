const program = require('commander');
const util = require('./util');

program
  .description('Get a SmartContract secret (only works while in a running smart contract)', {
    secretName: 'Name of the secret to fetch'
  })
  .arguments('<secretName>')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchain-id [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [secretName] = program.args;
  const response = await client.getSmartContractSecret({
    secretName
  });
  console.log(JSON.stringify(response, null, 2));
});
