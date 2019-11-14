const pjson = require('../package.json');
const program = require('commander');

program
  .version(pjson.version)
  .command('add', 'Create a new HMAC key on the server side')
  .command('ls', 'List HMAC key IDs that exist on the server side')
  .command('rm', 'Revoke an HMAC key on the server side')
  .command('update', 'Update nickname for a given HMAC key')
  .command('get', 'Get information for a given HMAC key ID')
  .parse(process.argv);
