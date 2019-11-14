const program = require('commander');
const util = require('./util');

program
  .description('Use your current HMAC key to generate a new HMAC Key')
  .option('-n, --nickname <nickname>', '(optional) Nickname to give your new HMAC key')
  .parse(process.argv);

util.wrapper(program, async client => {
  const { nickname } = program;
  const response = await client.createApiKey(util.removeUndefined({ nickname }));
  console.log(JSON.stringify(response, null, 2));
});
