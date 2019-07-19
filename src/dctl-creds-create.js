#!/usr/bin/env node

const program = require('commander');
const util = require('./util');

program
.description('Use your current HMAC key to generate a new HMAC Key.')
.option('-n, --nickname <nickname>', '(optional) Nickname to give your new HMAC key')
.parse(process.argv);

util.wrapper(program, async client => {
  const options = {};
  if (program.nickname) options['nickname'] = program.nickname;
  const configPath = util.getConfigFilePath();
  const response = await client.createApiKey(options);
  console.log(JSON.stringify(response, null, 2));
  console.log(`Success. New Credentials written to ${configPath}`);
});
