#!/usr/bin/env node

const program = require('commander');
const util = require('./util');

program.description('(Coming Soon) Use your current HMAC key to generate a new HMAC Key.').parse(process.argv);

util.wrapper(program, async client => {
  const configPath = util.getConfigFilePath();
  const response = await client.createApiKey();
  console.log(JSON.stringify(response, null, 2));
  console.log(`Success. New Credentials written to ${configPath}`);
});
