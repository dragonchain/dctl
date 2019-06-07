#!/usr/bin/env node

var pjson = require("../package.json");
const program = require("commander");

program
  .version(pjson.version)
  .command("set", "Add new dragonchain configuration")
  .command("rm", "Remove a specific (or many) dragonchain configuration(s).")
  .command("ls", "list default chain")
  .parse(process.argv);
