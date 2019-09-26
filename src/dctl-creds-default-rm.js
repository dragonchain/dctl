const program = require('commander');
const util = require('./util');
const fs = require('fs');
const ini = require('ini');

program.description('Unset the current default chain ID').parse(process.argv);

util.errorHandler(() => {
  const currentConfig = ini.parse(fs.readFileSync(util.getConfigFilePath(), 'utf-8'));
  if (currentConfig.default) delete currentConfig.default;
  fs.writeFileSync(util.getConfigFilePath(), ini.stringify(currentConfig));
  console.log(`Success. Default has been unset.`);
});
