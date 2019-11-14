const program = require('commander');
const util = require('./util');

program
  .description('Get a dragonchain HMAC Credential information by ID')
  .parse(process.argv);

util.wrapper(program, async client => {
  const response = await client.listApiKeys();
  console.log(JSON.stringify(response, null, 2));
});
