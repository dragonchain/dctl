const fs = require('fs');
const path = require('path');
const program = require('commander');
const readline = require('readline');
const shell = require('shelljs');
const del = require('del');

const languages = ['python', 'node', 'go', 'cpp', 'c', 'csharp', 'bash'];

program
  .description('Initialize a new contract test environment for a smart contract.')
  .option('-l, --language <language>', `(requires git) Clone an official starter template into "dir". Values: ${languages.join(', ')}.`)
  .option('-d, --dir <dir>', 'The directory into which the test env files will be written.')
  .option('-e, --environment-variables <environmentVariables>', 'Valid JSON string. {[Key:string]: Value:string} of env vars for this SmartContract.')
  .option('-y, --yes', 'Auto-answer "yes" to any prompts')
  .option('-S, --secrets <secrets>', 'Valid JSON string. {[Key:string]: Value:string} of secrets to attach to this SmartContract.')
  .option('-H, --https', 'Perform git clone operation via HTTPS. Default = ssh.')
  .parse(process.argv);

const { environmentVariables, secrets, language, https, yes } = program || {};

async function main() {
  hasGitInstalledOrFail();
  console.log(`Creating new local contract environment...`);
  const { tempDirectory, testDirectory, heapDirectory, srcDirectory, secretsDirectory } = await getAllPaths();
  await createDirectoryOrFail(heapDirectory);
  await createDirectoryOrFail(secretsDirectory);
  if (environmentVariables) await writeEnvFile(testDirectory, environmentVariables);
  if (secrets) await writeSecretFiles(secretsDirectory, secrets);
  if (language) {
    if (!languages.includes(language)) {
      throw new Error(`Error: Language ${language} is not yet supported. Consider adding a starter package here https://github.com/dragonchain/smart-contract-templates`);
    }
    await createDirectoryOrFail(tempDirectory);
    exec(`git clone ${clonePath(https)} ${tempDirectory} --depth 1`);
    await fs.promises.rename(path.join(tempDirectory, `${language}_contract`), srcDirectory);
    await del(tempDirectory);
  } else {
    console.log(
      `NOTE: Consider using (--language) to install a starter-kit for rapid development. Or build a new one for your langauge! https://github.com/dragonchain/smart-contract-templates`
    );
  }
  console.log('Done');
}

main();

/**
 * getAllPaths
 * @returns {{ root, tempDirectory, testDirectory, heapDirectory, srcDirectory, secretsDirectory }} all paths used by this module
 */
async function getAllPaths() {
  const root = await determineRootPath(program.dir);
  const tempDirectory = path.join(root, 'tmp');
  const testDirectory = path.join(root, 'test');
  const srcDirectory = path.join(root, 'src');
  const heapDirectory = path.join(testDirectory, 'heap');
  const secretsDirectory = path.join(testDirectory, 'secrets');
  return { root, tempDirectory, testDirectory, heapDirectory, srcDirectory, secretsDirectory };
}

/**
 * clonePath
 * @param {boolean} https use HTTPS vs default SSH
 * @returns {string} fully qualified path to clone smart-contract-templates
 */
function clonePath(https) {
  return https ? 'https://github.com/dragonchain/smart-contract-templates.git' : 'git@github.com:dragonchain/smart-contract-templates.git';
}

/**
 * writeWithLog
 * Write to disk while logging actions to stdout.
 * @param {string} place
 * @param {string} thing
 */
async function writeWithLog(place, thing) {
  console.log(`Writing: ${place}`);
  await fs.promises.writeFile(place, thing);
}

/**
 * determineRootPath
 * Create a directory or ask if it's cool we install files in CWD
 * @param {string} dir (optional) users recommended filepath
 * @returns {string} the path at which the root of all files should now be created.
 */
async function determineRootPath(dir) {
  if (dir !== undefined) {
    await createDirectoryOrFail(dir);
    return dir;
  }
  const answer = await confirmPrompt(`No directory specified. Write test env files to current directory? [Y/N] `);
  if (!answer) throw new Error('Process exited.');
  return '.';
}

/**
 * dirExists
 * Check if a directory exists and return boolean.
 * @param {string} filePath
 * @returns {boolean}
 */
async function dirExists(filePath) {
  try {
    const status = await fs.promises.stat(filePath);
    return status.isDirectory();
  } catch (e) {
    return false;
  }
}

/**
 * createDirectoryOrFail
 * Create a new directory or fail
 * @param {string} filePath
 */
async function createDirectoryOrFail(filePath) {
  const exists = await dirExists(filePath);
  if (exists) throw new Error(`Error: Directory "${filePath}" already exists.`);
  await fs.promises.mkdir(filePath, { recursive: true });
}

/**
 * confirmPrompt
 * Ask the user for something, and return boolean if they respond with Y or y
 * @param {string} text
 * @returns {boolean}
 */
async function confirmPrompt(text) {
  if (yes) return true;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(text, answer => {
      rl.close();
      resolve(answer.trim().match(/^[Yy]/));
    });
  });
}

/**
 * perJsonKey
 * Parse and loop thru valid json and execute a function passing (key, value)
 * @param {string} json
 * @param {function} fn
 * @returns {Promise<any[]>}
 */
async function perJsonKey(json, fn) {
  const promises = [];
  for (let [key, value] of Object.entries(JSON.parse(json))) {
    promises.push(fn(key, value));
  }
  return Promise.all(promises);
}

/**
 * writeEnvFile
 * Parse and write valid JSON the .env file
 * @param {string} dir
 * @param {string} json
 * @returns {undefined}
 */
async function writeEnvFile(dir, json) {
  let envLines = await perJsonKey(json, async (envName, value) => `${envName}=${value}`);
  const changeMe = '"Change this value if you need to talk to a real dragonchain"';
  const envPath = path.join(dir, '.env');
  envLines = envLines.concat([`DRAGONCHAIN_ID=${changeMe}`, `AUTH_KEY=${changeMe}`, `AUTH_KEY_ID=${changeMe}`, `DRAGONCHAIN_ENDPOINT=${changeMe}`]);
  writeWithLog(envPath, envLines.join('\n'));
}

/**
 * writeSecretFiles
 * Write secrets from json into a file
 * @param {string} directory
 * @param {string} json
 * @returns {undefined}
 */
async function writeSecretFiles(directory, json) {
  await perJsonKey(json, async (filename, value) => writeWithLog(path.join(directory, filename), value));
}

/**
 * hasGitInstalledOrFail
 * Check if git is installed and throw if not.
 * @returns {undefined}
 * @throws {Error} if git is not installed
 */
function hasGitInstalledOrFail() {
  if (!shell.which('git')) {
    throw new Error('Sorry, this script requires git. Install git to continue.');
  }
}

/**
 * exec
 * Drop to shell and run a command
 * @param {string} command command to execute in current shell
 * @returns {undefined}
 * @throws {Error} if git is not installed
 */
function exec(command) {
  if (shell.exec(command).code !== 0) {
    shell.echo(`Command failed. ${shell.error}`);
    shell.exit(1);
  }
}
