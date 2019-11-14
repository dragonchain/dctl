const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('add', 'Add an already existing HMAC key to this local machine')
  .command('ls', 'List configured HMAC keys on this local machine')
  .command('rm', 'Remove a configured HMAC key on this local machine')
  .command('default', 'Change the default HMAC key for this local machine')
  .parse(process.argv);
