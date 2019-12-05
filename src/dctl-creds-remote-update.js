const program = require('commander');
const util = require('./util');

program
  .description('Update a dragonchain HMAC Credential nickname', {
    keyId: 'The id of the hmac key to update'
  })
  .arguments('<keyId>')
  .option('-n, --nickname <nickname>', 'Updated nickname for the given key')
  .option('-p, --permissionsDocument <permissionsDocument>', '(optional) new JSON permissions document to assign to this key')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [keyId] = program.args;
  const { nickname, permissionsDocument } = program;
  let permissionDocumentJSON = undefined;
  if (permissionsDocument) permissionDocumentJSON = JSON.parse(permissionsDocument);
  const response = await client.updateApiKey({ keyId, nickname, permissionsDocument: permissionDocumentJSON });
  console.log(JSON.stringify(response, null, 2));
});
