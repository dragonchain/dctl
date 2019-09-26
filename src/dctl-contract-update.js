const program = require('commander');
const util = require('./util');

program
  .description('Update a running SmartContract', {
    smartContractId: 'The id of the smart contract to update'
  })
  .arguments('<smartContractId>')
  .option('-I, --image <image>', 'Docker image path')
  .option('-C, --cmd <cmd>', 'Docker CMD used as a docker entrypoint')
  .option(
    '-A, --containerArgs <containerArgs>',
    'Docker command args. Specify more than one for more args. ie -A arg1 -A arg2',
    (arg, containerArgs) => {
      containerArgs.push(arg);
      return containerArgs;
    },
    []
  )
  .option('-e, --environment-variables <environmentVariables>', 'JSON string of env vars for this SmartContract')
  .option('-S, --secrets <secrets>', 'Valid JSON string. {[Key:string]: Value:string}  of secrets to attach to this SmartContract')
  .option('-n, --schedule-interval-in-seconds <scheduleIntervalInSeconds>', 'Interval (in seconds) at which this contract will be auto-invoked')
  .option('-c, --cron-expression <cronExpression>', 'Invoke this contract on a cron schedule')
  .option('-o, --executionOrder <executionOrder>', "Execution Order. 'serial' or 'parallel'")
  .option('-d, --disable', 'Disable this SmartContract')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchain-id [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .option('-r, --registry-credentials [registryCredentials]', '(optional) Credentials to private docker registry')
  .option('--remove-schedule', '(opitonal) Set this flag to remove any existing schedule (cron or seconds) on the contract')
  .parse(process.argv);

util.wrapper(program, async client => {
  const {
    removeSchedule,
    image,
    cmd,
    executionOrder,
    disable,
    containerArgs,
    environmentVariables,
    secrets,
    scheduleIntervalInSeconds,
    cronExpression,
    registryCredentials
  } = program;
  const [smartContractId] = program.args;
  if (!smartContractId) throw new Error("Parameter 'smartContractId' must be defined");
  const params = util.removeUndefined({
    smartContractId,
    image,
    cmd,
    secrets: secrets ? JSON.parse(secrets) : undefined,
    cronExpression,
    executionOrder,
    registryCredentials,
    args: (Boolean(containerArgs.length) && containerArgs) || undefined,
    environmentVariables: environmentVariables ? JSON.parse(environmentVariables) : undefined,
    scheduleIntervalInSeconds: scheduleIntervalInSeconds && Number(scheduleIntervalInSeconds),
    enabled: !disable,
    disableSchedule: removeSchedule
  });
  const response = await client.updateSmartContract(params);
  console.log(JSON.stringify(response, null, 2));
});
