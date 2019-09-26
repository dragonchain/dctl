const program = require('commander');
const util = require('./util');
const getStdin = require('get-stdin');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile).bind(fs);

program
  .description('Create many transactions at once')
  .option('-f, --filePath <filePath>', '(one-of-these-is-required) Read bulk transaction payload from a file.')
  .option('-j, --jsonInput <jsonInput>', "(one-of-these-is-required) String of valid json. ex. '[{transactionType: string, tag: string, payload: string }]'")
  .option('-I, --stdIn', '(one-of-these-is-required) Read json payload from stdIn.')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK.')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command.')
  .parse(process.argv);

util.wrapper(program, async client => {
  const { filePath, jsonInput, stdIn } = program;
  let transactionList;
  if (stdIn) transactionList = await getStdin();
  else if (filePath) transactionList = (await readFile(filePath)).toString('utf8');
  else if (jsonInput) transactionList = jsonInput;
  if (!transactionList) throw new Error('Missing transaction list.');
  const result = await client.createBulkTransaction({
    transactionList: JSON.parse(transactionList)
  });
  console.log(JSON.stringify(result, null, 2));
});
