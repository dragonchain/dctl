#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("Get Block Verifications", { blockId: "The ID of a block." })
  .arguments("<blockId>")
  .option("-l, --level <level>", "(int, optional) Verification level. (2-5)")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);
const { level } = program.opts();
const [blockId] = program.args;
util.wrapper(program, async client => {
  const params = util.removeUndefined({ level, blockId });
  const response = await client.getVerifications(params);
  console.log(JSON.stringify(response, null, 2));
});
