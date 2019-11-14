const program = require('commander');
const util = require('./util');
const fs = require('fs');
const ini = require('ini');

program
  .description('List all credentials stored locally')
  .option('-k, --show-keys', 'Print the sensitive detals about the keys along with other data')
  .parse(process.argv);

util.errorHandler(() => {
  const currentConfig = ini.parse(fs.readFileSync(util.getConfigFilePath(), 'utf-8'));
  let configString = JSON.stringify(currentConfig, null, 2);
  if (!program.showKeys) configString = configString.replace(/auth_key": "(.*?)"/g, 'auth_key": "<hidden>"');
  console.log(configString);
});
