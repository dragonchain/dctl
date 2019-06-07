#!/usr/bin/env node

const program = require("commander");

program
  .description("Contract methods")
  .command("create", "Create a new contract")
  .alias("c")
  .command("update", "Update an existing contract")
  .alias("u")
  .command("rm", "Delete an existing contract")
  .alias("d")
  .command("get", "Get a SmartContract")
  .alias("g")
  .command("ls", "List smart conc utracts")
  .alias("l")
  .command("secret", "Get a SmartContract secret")
  .alias("s")
  .command("objectGet", "Get a SmartContract object from stateful storage")
  .alias("o")
  .command("objectList", "List SmartContract objects from stateful storage")
  .alias("ols")
  .parse(process.argv);
