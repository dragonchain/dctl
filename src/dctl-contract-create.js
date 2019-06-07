#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("Create a SmartContract")
  .arguments("<transactionType> <image> <cmd> <containerArgs...>")
  .option("-e, --environment-variables <environmentVariables>", "JSON string of env vars for this SmartContract.")
  .option("-s, --secrets <secrets>", "Valid JSON string. {[Key:string]: Value:string}  of secrets to attach to this SmartContract.")
  .option("-n, --schedule-interval-in-seconds <scheduleIntervalInSeconds>", "Interval (in seconds) at which this contract will be auto-invoked.")
  .option("-c, --cron-expression <cronExpression>", "Invoke this contract on a cron schedule.")
  .option("-s, --serial", "Serial execution only. (parallel execution OK when omitted)")
  .option("-d, --disable", "Disable this SmartContract")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .action((transactionType, image, cmd, containerArgs, options) => {
    const { serial, disable, environmentVariables, secrets, scheduleIntervalInSeconds, cronExpression } = options;

    util.wrapper(program, async client => {
      const params = util.removeUndefined({
        transactionType,
        image,
        cmd,
        secrets,
        cronExpression,
        args: containerArgs,
        scheduleIntervalInSeconds: scheduleIntervalInSeconds && Number(scheduleIntervalInSeconds),
        environmentVariables: environmentVariables && JSON.parse(environmentVariables),
        enabled: !disable,
        executionOrder: serial ? "serial" : "parallel"
      });
      const response = await client.createSmartContract(params);
      console.log(JSON.stringify(response, null, 2));
    });
  })
  .parse(process.argv);
