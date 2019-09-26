const program = require('commander');
const fs = require('fs');
const util = require('./util');
const ini = require('ini');
const readlineSync = require('readline-sync');

program
  .description('Add (or overwrite) a dragonchain HMAC Credential locally', {
    chainId: 'The Dragonchain Id to add (or overwrite).'
  })
  .arguments('<chainId>')
  .option('-e, --endpoint <endpoint>', '(optional) Override endpoint which would be otherwise looked-up in dragonnet')
  .option('-d, --dont-set-default', '(optional) Do not change the currently set default dragonchain id')
  .parse(process.argv);

util.errorHandler(() => {
  const [dragonchain_id] = program.args;
  const auth_key_id = readlineSync.question(`HMAC KEY ID: `);
  const auth_key = readlineSync.question(`HMAC KEY: `, { hideEchoBack: true });
  const { endpoint } = program;
  if (!dragonchain_id) throw new Error('Missing Param: chainId');
  const configPath = util.getConfigFilePath();
  const dirPath = util.getConfigDirPath();
  if (!fs.existsSync(dirPath)) {
    console.log(dirPath, 'does not exist. Creating.');
    fs.mkdirSync(dirPath);
  }
  if (!fs.existsSync(configPath)) {
    console.log(configPath, 'does not exist. Creating.');
    fs.writeFileSync(configPath, '');
  }
  const config = ini.parse(fs.readFileSync(configPath, 'utf-8'));
  config[dragonchain_id] = { auth_key, auth_key_id, endpoint };
  if (!program.dontSetDefault) config.default = { dragonchain_id };
  fs.writeFileSync(configPath, ini.stringify(config));
  if (!program.dontSetDefault) console.log(`Default Dragonchain set to ${dragonchain_id}.`);
  console.log(`Success. New Credentials written to ${configPath}`);
});
