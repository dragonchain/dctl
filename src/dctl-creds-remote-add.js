const program = require('commander');
const util = require('./util');

program
  .description('Use your current HMAC key to generate a new HMAC Key')
  .option('-n, --nickname <nickname>', '(optional) Nickname to give your new HMAC key')
  .option('-p, --permissionsDocument <permissionsDocument>', '(optional) JSON permissions document to use with this new key')
  .parse(process.argv);

util.wrapper(program, async client => {
  const { nickname, permissionsDocument } = program;
  let permissionDocumentJSON = undefined;
  if (permissionsDocument) permissionDocumentJSON = JSON.parse(permissionsDocument);
  const response = await client.createApiKey(util.removeUndefined({ nickname, permissionsDocument: permissionDocumentJSON }));
  console.log(JSON.stringify(response, null, 2));
});
