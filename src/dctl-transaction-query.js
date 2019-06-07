#!/usr/bin/env node

const program = require("commander");
const util = require("./util");

program
  .option("-q, --luceneQuery <luceneQuery>", "(optional) luceneQuery")
  .option("-s, --sort [sort]", "(optional) sort either ASC or DESC")
  .option("-o, --offset [offset]", "(optional) Offset results by n results.")
  .option("-l, --limit [limit]", "(optional) Limit result set size.")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);

(async () => {
  await util.wrapper(program, async client => {
    try {
      const { sort, offset, limit, luceneQuery } = program.opts();
      const result = await client.queryTransactions(util.removeUndefined({ luceneQuery, offset, sort, limit }));
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.error(e.message);
    }
  });
})();
