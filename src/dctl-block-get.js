const program = require('commander');
const util = require('./util');

program
  .description('Get a Block by ID', {
    blockId: 'The ID of the block you want to get'
  })
  .arguments('<blockId>')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [blockId] = program.args;
  const response = await client.getBlock({ blockId });
  console.log(JSON.stringify(response, null, 2));
});
