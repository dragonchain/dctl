#!/usr/bin/env node

// import {DragonchainClient} from 'dragonchain-sdk'
var pjson = require("../package.json");
const program = require("commander");

program
  .version(pjson.version)
  .command("create", "Create a new transaction")
  .alias("c")
  .command("bitcoin", "Create a new bitcoin transaction")
  .alias("btc")
  .command("ethereum", "Create a new ethereum transaction")
  .alias("eth")
  .command("ethereumClassic", "Create a new ethereum classic transaction")
  .alias("etc")
  .command("bulk", "Create a bulk transaction")
  .alias("b")
  .command("get", "Get a transaction by id")
  .alias("g")
  .command("query", "Get a transaction by query")
  .alias("q")
  .parse(process.argv);
