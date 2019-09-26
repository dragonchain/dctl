const program = require('commander');
const util = require('./util');

program
  .description("Get a block's verifications", { blockId: 'The ID of a block' })
  .arguments('<blockId>')
  .option('-l, --level <level>', '(int, optional) Verification level. (2-5)')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [blockId] = program.args;
  const { level } = program;
  const params = util.removeUndefined({ level, blockId });
  const response = await client.getVerifications(params);
  console.log(JSON.stringify(response, null, 2));
});
