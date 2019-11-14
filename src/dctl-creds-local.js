const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('add', 'Add an already existing HMAC key')
  .command('ls', 'List configured HMAC keys')
  .command('rm', 'Remove a configured HMAC key')
  .command('default', 'Change the default HMAC key')
  .parse(process.argv);
