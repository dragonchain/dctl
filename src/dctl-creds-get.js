const program = require('commander');
const util = require('./util');

program
  .description('Update a dragonchain HMAC Credential nickname.')
  .arguments('<keyId>')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [keyId] = program.args;
  const options = { keyId };
  const response = await client.getApiKey(options);
  console.log(JSON.stringify(response, null, 2));
});