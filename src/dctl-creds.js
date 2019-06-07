#!/usr/bin/env node

var pjson = require("../package.json");
const program = require("commander");

program
  .version(pjson.version)
  .command("add", "Add new dragonchain configuration")
  .command("ls", "List all dragonchain configurations available on this machine")
  .command("rm", "Remove a specific (or many) dragonchain configuration(s)")
  .command("default", "Add or remove default configured dragonchain")
  .command("create", "Use your current HMAC keys to generate new HMAC keys on the current default dragonchain.")
  .parse(process.argv);
