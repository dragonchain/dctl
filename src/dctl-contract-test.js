const program = require('commander');
const fs = require('fs');
const shell = require('shelljs');
const path = require('path');

program
  .description('Test a smart contract as it would be executed on an  L1 Dragonchain.', {
    image: 'The docker image for this smart contract',
    cmd: 'The command to run on this docker container',
    containerArgs: '(optional) The arguments to pass in with the command for this smart contract'
  })
  .arguments('<image>')
  .option('-p, --payload <payload>', 'The payload which you want to pass to your contract.')
  .option('-d, --test-directory <testDirectory>', 'The folder which contains testing configuration files. Default: "./test"')
  .option('-t, --tag <tag>', 'The tag you expect attached to the transaction')
  .action((image, options) => {
    const { payload, testDirectory } = options || {};

    main()
      .catch(e => console.error(`Error: ${e.message}`))
      .then(killWebserver);

    async function main() {
      const { testRoot, localEnv, localHeap, localSecrets } = getPaths(testDirectory);
      if (payload === undefined) throw new Error(`(-p) --payload is not defined.`);
      const networkName = 'dragonchain-webserver';
      const config = await getConfig(testRoot);
      createDockerNetwork(networkName);
      startWebserver(localEnv, networkName, localHeap);
      const contractRunShell = await runContract(image, payload, networkName, config.startCommand, localEnv, localSecrets);
      await handleContractOutput(contractRunShell.stdout, localHeap);
    }
  })
  .parse(process.argv);

/**
 * handleContractOutput
 * @param {string} stdout
 * @param {string} localHeap
 */
async function handleContractOutput(stdout, localHeap) {
  try {
    const obj = JSON.parse(stdout);
    if (obj.OUTPUT_TO_HEAP && obj.OUTPUT_TO_HEAP === false) {
      console.warn('warn: OUTPUT_TO_HEAP false. Not writing to heap state.');
    }
    await Promise.all(Object.entries(obj).map(([key, value]) => fs.promises.writeFile(path.join(localHeap, key), value)));
  } catch (err) {
    const raw = path.join(localHeap, 'rawResponse');
    console.warn(`warn: Contract output not valid JSON. Writing to "${raw}".`);
    await fs.promises.writeFile(raw, stdout);
  }
}

function createDockerNetwork(networkName) {
  shell.exec(`docker network create ${networkName}`, { silent: true });
}

async function getConfig(testRoot) {
  return JSON.parse(await fs.promises.readFile(path.join(testRoot, 'config.json'), 'utf-8'));
}

async function runContract(image, payload, network, startCommand, localEnv, localSecrets) {
  const arrOfSecretFiles = await fs.promises.readdir('./test/secrets');
  const arrOfMountScripts = arrOfSecretFiles.map(fileName => `-v ${path.join(localSecrets, fileName)}:/var/openfaas/secrets/sc-dummy-value-${fileName}:ro`);
  const command = `docker run -i \
  --name dragonchain-contract \
  -l env=dragonchain_test_env \
  --network ${network} \
  --rm \
  ${arrOfMountScripts.join(' ')} \
  --env-file ${localEnv} \
  --entrypoint '' \
  ${image} ${startCommand}`;
  return shell.echo(transaction(payload)).exec(command);
}

/**
 * startWebserver
 * @param {string} localEnv
 * @param {string} webserverImage
 * @param {string} networkName
 * @param {string} localHeap
 * @param {string} localSecrets
 */
function startWebserver(localEnv, networkName, localHeap) {
  const remoteHeap = '/dragonchain/heap';
  const command = `docker run \
    --name dragonchain-webserver \
    --network ${networkName} \
    -d \
    -v ${localHeap}:${remoteHeap} \
    -l env=dragonchain_test_env \
    -p 8080:8080 \
    --env-file ${localEnv} \
    docker.io/dragonchain/dragonchain_mock_webserver:0.0.1`;

  shell.exec(command, { silent: true });
}
/**
 * killWebserver
 * cleanup the webserver docker images after the tests were run
 */
function killWebserver() {
  shell.exec('docker rm -f dragonchain-webserver', { silent: true });
}

/**
 * getPaths
 * @param {string} testDirectory
 */
function getPaths(testDirectory) {
  const testRoot = testDirectory || path.join('.', 'test');
  const localHeap = path.resolve(testRoot, 'heap');
  const localSecrets = path.resolve(path.join(testRoot, 'secrets'));
  const localEnv = path.resolve(path.join(testRoot, '.env'));
  if (!directoryExists(localHeap)) throw new Error(`Missing heap directory "${localHeap}". Try running 'dctl contract init --help'.`);
  if (!directoryExists(localSecrets)) throw new Error(`Missing secrets directory "${localSecrets}". Try running 'dctl contract init --help'.`);
  if (!fileExists(localEnv)) throw new Error(`Missing .env file ${localEnv}. Try running 'dctl contract init --help'.`);
  return {
    localEnv,
    localHeap,
    localSecrets,
    testRoot
  };
}

/**
 * fileExists
 * Check if a file exists and return boolean.
 * @param {string} filePath
 * @returns {boolean}
 */
async function fileExists(filePath) {
  try {
    const status = await fs.promises.stat(filePath);
    return status.isFile();
  } catch (e) {
    return false;
  }
}
/**
 * directoryExists
 * Check if a directory exists and return boolean.
 * @param {string} dirPath
 * @returns {boolean}
 */
async function directoryExists(dirPath) {
  try {
    const status = await fs.promises.stat(dirPath);
    return status.isDirectory();
  } catch (e) {
    return false;
  }
}

/**
 *
 * @param {string} payload
 * @param {string} tag
 */
function transaction(payload, tag) {
  return JSON.stringify({
    version: '2',
    dcrn: 'Transaction::L1::FullTransaction',
    header: {
      txn_type: 'test-txn-type',
      dc_id: 'test-dcid',
      txn_id: 'test-txn-id',
      block_id: null,
      timestamp: Math.floor(new Date().getTime() / 1000),
      tag: tag || '',
      invoker: ''
    },
    payload,
    proof: {
      full: null,
      stripped: null
    }
  });
}
