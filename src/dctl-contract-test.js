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

    async function main() {
      const testRoot = testDirectory || path.join('.', 'test');
      const localHeap = path.resolve(testRoot, 'heap');
      const localSecrets = path.resolve(path.join(testRoot, 'secrets'));
      const localEnv = path.resolve(path.join(testRoot, '.env'));
      const remoteHeap = '/dragonchain/smartcontract/heap';
      const remoteSecrets = '/dragonchain/smartcontract/secrets';
      if (payload === undefined) throw new Error(`(-p) --payload is not defined.`);
      if (!directoryExists(localHeap)) throw new Error(`Missing heap directory "${localHeap}". Try running 'dctl contract init --help'.`);
      if (!directoryExists(localSecrets)) throw new Error(`Missing secrets directory "${localSecrets}". Try running 'dctl contract init --help'.`);
      if (!fileExists(localEnv)) throw new Error(`Missing .env file ${localEnv}. Try running 'dctl contract init --help'.`);
      const config = JSON.parse(await fs.promises.readFile(path.join(testRoot, 'config.json'), 'utf-8'));
      console.log(`${config.webserverImage} ${config.webServerStartCommand}`)
      const webserverStartCommand = `docker run \
      -d \
      -l env=dragonchain_test_env \
      -p 38404:8080 \
      --env-file ${localEnv} \
      --entrypoint '' \
      ${config.webserverImage} ${config.webServerStartCommand}
      `;
      shell.exec(webserverStartCommand);
      console.log('Booting fake webserver pod');
      const command = `printf '${transaction(payload)}' | docker run -i \
      --rm \
      -v ${localHeap}:${remoteHeap} \
      -v ${localSecrets}:${remoteSecrets}:ro \
      --env-file ${localEnv} \
      --entrypoint '' \
      ${image} ${config.startCommand}`;
      const res = shell.exec(command);
      try {
        const obj = JSON.parse(res.stdout);
        if (obj.OUTPUT_TO_HEAP && obj.OUTPUT_TO_HEAP === false) {
          console.warn('warn: OUTPUT_TO_HEAP false. Not writing to heap state.');
        }
        await Promise.all(Object.entries(obj).map(([key, value]) => fs.promises.writeFile(path.join(localHeap, key), value)));
      } catch (err) {
        const raw = path.join(localHeap, 'rawResponse');
        console.warn(`warn: Contract output not valid JSON. Writing to "${raw}".`);
        await fs.promises.writeFile(raw, res.stdout);
      }
      // cleanup docker
      killWebserver();
    }

    // main with poor-man's error handler
    main().catch(e => console.error(`Error: ${e.message}`));
  })
  .parse(process.argv);

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
 * killWebserver
 * cleanup the webserver docker images after the tests were run
 */
function killWebserver() {
    const psCommand = 'docker ps --filter label=env=dragonchain_test_env --format "{{.ID}}"'; // returns only the ID from containers that match this label
    const imageIds = shell.exec(psCommand).trim().split('\n'); // array of docker image IDs
    if (imageIds.length > 0) imageIds.forEach(id => (shell.exec(`docker stop ${id} && docker rm ${id}`))); // remove said docker images
}
