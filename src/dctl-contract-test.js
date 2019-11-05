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
      const command = `printf '${transaction(payload)}' | docker run -i \
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
