const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('remote', 'Manage remotely stored HMAC keys on a Dragonchain node')
  .command('local', 'Manage locally stored HMAC keys on this machine')
  .parse(process.argv);
