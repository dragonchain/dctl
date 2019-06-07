#!/usr/bin/env node

// import {DragonchainClient} from 'dragonchain-sdk'
var pjson = require("../package.json");
const program = require("commander");

program
  .version(pjson.version)
  .command("create", "Create a new Transaction Type")
  .alias("c")
  .command("get", "Get a Transaction Type by name")
  .alias("g")
  .command("ls", "List all Transaction types")
  .alias("l")
  .command("rm", "Delete a Transaction Type")
  .alias("d")
  .command("update", "Update a Transaction Type")
  .alias("u")
  .parse(process.argv);
