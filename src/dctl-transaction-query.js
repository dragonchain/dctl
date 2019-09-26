const program = require('commander');
const util = require('./util');

program
  .description('Query transactions on a chain', {
    transactionType: 'The transaction type to query',
    redisearchQuery: 'The redisearch query to perform'
  })
  .arguments('<transactionType> <redisearchQuery>')
  .option('-i, --idsOnly', '(optional) only get the transaction ids, not the whole transactions')
  .option('-l, --limit [limit]', '(optional) Limit result set size')
  .option('-o, --offset [offset]', '(optional) Offset results by n results')
  .option('-s, --sortBy [sortBy]', '(optional) name of the indexed field to sort by')
  .option('-d, --sortDescending [sortDescending]', '(optional) order the results from sortBy in descending order. Defaults to ascending')
  .option('--verbatim', "(optional) Perform this query verbatim (don't do any English stemming)")
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [transactionType, redisearchQuery] = program.args;
  if (!transactionType) throw new Error("Missing parameter 'transactionType'");
  if (!redisearchQuery) throw new Error("Missing parameter 'redisearchQuery'");
  const { idsOnly, offset, limit, sortBy, sortDescending, verbatim } = program.opts();
  const result = await client.queryTransactions(
    util.removeUndefined({ verbatim, sortBy, sortAscending: !sortDescending, idsOnly, offset, limit, redisearchQuery, transactionType })
  );
  console.log(JSON.stringify(result, null, 2));
});
