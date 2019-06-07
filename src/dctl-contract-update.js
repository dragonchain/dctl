#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("Update a running SmartContract")
  .arguments("<smartContractId>")
  .option("-I, --image <image>", "Docker image path")
  .option("-C, --cmd <cmd>", "Docker CMD used as a docker entrypoint")
  .option(
    "-A, --containerArgs <containerArgs>",
    "Docker command args.",
    (arg, containerArgs) => {
      containerArgs.push(arg);
      return containerArgs;
    },
    []
  )
  .option("-e, --environment-variables <environmentVariables>", "JSON string of env vars for this SmartContract.")
  .option("-s, --secrets <secrets>", "Valid JSON string. {[Key:string]: Value:string}  of secrets to attach to this SmartContract.")
  .option("-n, --schedule-interval-in-seconds <scheduleIntervalInSeconds>", "Interval (in seconds) at which this contract will be auto-invoked.")
  .option("-c, --cron-expression <cronExpression>", "Invoke this contract on a cron schedule.")
  .option("-o, --executionOrder <executionOrder>", "Execution Order. 'serial' or 'parallel'")
  .option("-d, --disable", "Disable this SmartContract")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchain-id [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);

const {
  image,
  cmd,
  executionOrder,
  disable,
  containerArgs,
  environmentVariables,
  secrets,
  scheduleIntervalInSeconds,
  cronExpression
} = program;
const [smartContractId] = program.args;

util.wrapper(program, async client => {
  try {
    const params = util.removeUndefined({
      smartContractId,
      image,
      cmd,
      secrets,
      cronExpression,
      executionOrder,
      args: Boolean(containerArgs.length) && containerArgs,
      environmentVariables: environmentVariables ? JSON.parse(environmentVariables) : undefined,
      scheduleIntervalInSeconds: scheduleIntervalInSeconds && Number(scheduleIntervalInSeconds),
      enabled: !disable
    });
    const response = await client.updateSmartContract(params);
    console.log(JSON.stringify(response, null, 2));
  } catch (e) {
    console.log(e);
  }
});
