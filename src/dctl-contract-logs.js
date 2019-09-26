const program = require('commander');
const util = require('./util');

program
  .description('Get the logs from a smart contract', {
    smartContractId: 'The id of the smart contract to fetch logs for'
  })
  .arguments('<smartContractId>')
  .option('-t, --tail [tail]', '(optional) Maximum lines of logs to return')
  .option('-s, --since [since]', '(optional) Returns logs since this RFC3339 timestamp string')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [smartContractId] = program.args;
  if (!smartContractId) throw new Error('Parameter "smartContractId" is required');
  const { tail, since } = program;
  const params = util.removeUndefined({ smartContractId, tail: (tail && Number(tail)) || undefined, since });
  console.log(params);
  const result = JSON.stringify(await client.getSmartContractLogs(params), null, 2);
  console.log(result);
});
