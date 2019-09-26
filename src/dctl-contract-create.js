const program = require('commander');
const util = require('./util');

program
  .description('Create a SmartContract', {
    transactionType: 'The transaction type to give this smart contract',
    image: 'The docker image for this smart contract',
    cmd: 'The command to run on this docker container',
    containerArgs: '(optional) The arguments to pass in with the command for this smart contract'
  })
  .arguments('<transactionType> <image> <cmd> [containerArgs...]')
  .option('-e, --environment-variables <environmentVariables>', 'JSON string of env vars for this SmartContract')
  .option('-S, --secrets <secrets>', 'Valid JSON string. {[Key:string]: Value:string}  of secrets to attach to this SmartContract')
  .option('-n, --schedule-interval-in-seconds <scheduleIntervalInSeconds>', 'Interval (in seconds) at which this contract will be auto-invoked')
  .option('-c, --cron-expression <cronExpression>', 'Invoke this contract on a cron schedule')
  .option('-s, --serial', 'Serial execution only. (parallel execution OK when omitted)')
  .option('-r, --registry-credentials [registryCredentials]', '(optional) Credentials to private docker registry')
  .option(
    '--customIndexes [customIndexes]',
    `(optional) Json string array of custom indexes for this transaction type
           ex: '[{"fieldName":"aField","path":".thing","type":"text","options":{"sortable":true}}]'
           See here for syntax: https://node-sdk-docs.dragonchain.com/latest/interfaces/customtextfieldoptions.html`
  )
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .action((transactionType, image, cmd, containerArgs, options) => {
    const { customIndexes, serial, environmentVariables, secrets, scheduleIntervalInSeconds, cronExpression, registryCredentials } = options;
    util.wrapper(program, async client => {
      const params = util.removeUndefined({
        transactionType,
        image,
        cmd,
        secrets: secrets ? JSON.parse(secrets) : undefined,
        registryCredentials,
        cronExpression,
        args: containerArgs,
        scheduleIntervalInSeconds: scheduleIntervalInSeconds && Number(scheduleIntervalInSeconds),
        environmentVariables: environmentVariables && JSON.parse(environmentVariables),
        executionOrder: serial ? 'serial' : 'parallel',
        customIndexFields: customIndexes && JSON.parse(customIndexes)
      });
      const response = await client.createSmartContract(params);
      console.log(JSON.stringify(response, null, 2));
    });
  })
  .parse(process.argv);
