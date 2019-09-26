const program = require('commander');
const util = require('./util');
const fs = require('fs');
const ini = require('ini');

program.description('Get the current default chain ID').parse(process.argv);

util.errorHandler(() => {
  const currentConfig = ini.parse(fs.readFileSync(util.getConfigFilePath(), 'utf-8'));
  console.log(currentConfig.default.dragonchain_id);
});
