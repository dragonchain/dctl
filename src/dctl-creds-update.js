const program = require('commander');
const util = require('./util');

program
  .description('Update a dragonchain HMAC Credential nickname.')
  .arguments('<keyId>')
  .option('-n, --nickname <nickname>', 'Updated nickname for the given key')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [keyId] = program.args;
  if (!program.nickname) return console.error('You must provide a nickname to update this HMAC key to');
  const options = { keyId, nickname: program.nickname };
  const response = await client.updateApiKey(options);
  console.log(JSON.stringify(response, null, 2));
});