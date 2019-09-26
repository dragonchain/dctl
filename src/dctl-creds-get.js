const program = require('commander');
const util = require('./util');

program
  .description('Get a dragonchain HMAC Credential information by ID', {
    keyId: 'ID of the hmac key to get'
  })
  .arguments('<keyId>')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [keyId] = program.args;
  const response = await client.getApiKey({ keyId });
  console.log(JSON.stringify(response, null, 2));
});
