const program = require('commander');
const util = require('./util');

program
  .description('Query blocks', {
    redisearchQuery: 'The redisearch query to perform'
  })
  .arguments('<redisearchQuery>')
  .option('-i, --idsOnly', '(optional) only get the block ids, not the whole blocks')
  .option('-l, --limit [limit]', '(optional) Limit result set size')
  .option('-o, --offset [offset]', '(optional) Offset results by n results')
  .option('-s, --sortBy [sortBy]', '(optional) name of the indexed field to sort by')
  .option('-d, --sortDescending [sortDescending]', '(optional) order the results from sortBy in descending order. Defaults to ascending')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [redisearchQuery] = program.args;
  if (!redisearchQuery) throw new Error("Missing parameter 'redisearchQuery'");
  const { sortBy, sortDescending, idsOnly, offset, limit } = program;
  const params = util.removeUndefined({ sortBy, sortAscending: !sortDescending, idsOnly, offset, limit, redisearchQuery });
  const response = await client.queryBlocks(params);
  console.log(JSON.stringify(response, null, 2));
});
