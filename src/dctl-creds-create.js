#!/usr/bin/env node

var pjson = require("../package.json");
const program = require("commander");
const util = require("./util");

program.description("(Coming Soon) Use your current HMAC key to generate a new HMAC Key.").parse(process.argv);

try {
  util.wrapper(program, async client => {
    const response = await client.createApiKey();
    console.log(JSON.stringify(response, null, 2));
  });
  console.log(`Success. New Credentials written to ${configPath}`);
} catch (e) {
  console.error(e.message);
}
