const program = require('commander');
const util = require('./util');

program
  .description('Update a dragonchain HMAC Credential nickname', {
    keyId: 'The id of the hmac key to update'
  })
  .arguments('<keyId>')
  .option('-n, --nickname <nickname>', 'Updated nickname for the given key')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [keyId] = program.args;
  if (!program.nickname) throw new Error('You must provide a nickname for updating an hmac key');
  const response = await client.updateApiKey({ keyId, nickname: program.nickname });
  console.log(JSON.stringify(response, null, 2));
});
