const program = require('commander');
const util = require('./util');

program
  .description("Get a block's pending verifications", { blockId: 'The ID of the block to get pending verifications for' })
  .arguments('<blockId>')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [blockId] = program.args;
  if (!blockId) throw new Error("Missing required parameter 'blockId'");
  const response = await client.getPendingVerifications({ blockId });
  console.log(JSON.stringify(response, null, 2));
});
