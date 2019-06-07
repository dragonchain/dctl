#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("Query blocks")
  .option("-q, --luceneQuery <luceneQuery>", "(optional) luceneQuery")
  .option("-s, --sort [sort]", "(optional) sort either ASC or DESC")
  .option("-o, --offset [offset]", "(optional) Offset results by n results.")
  .option("-l, --limit [limit]", "(optional) Limit result set size.")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);
const { sort, offset, limit, luceneQuery } = program.opts();
util.wrapper(program, async client => {
  const params = util.removeUndefined({ luceneQuery, sort, offset, limit });
  const response = await client.queryBlocks(params);
  console.log(JSON.stringify(response, null, 2));
});
