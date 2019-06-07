#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("Create a new Bicoin transaction using your dragonchain's private keys.")
  .option("-t, --testNet", "Sign transaction for use on BTC_TESTNET3")
  .option("-s, --satoshisPerByte <satoshisPerByte>", "(float, optional) Satoshis Per Byte.")
  .option("-d, --data <data>", "(string, optional) Data to add to the transaction")
  .option("-c, --changeAddress <changeAddress>", "(string, optional) Change Address.")
  .option("-o, --outputs <outputs>", "({scriptPubKey:string value:number}[], optional) Outputs.")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);

util.wrapper(program, async client => {
  const { testNet, satoshisPerByte, data, changeAddress, outputs } = program;
  const network = Boolean(testNet) ? "BTC_TESTNET3" : "BTC_MAINNET";
  const params = util.removeUndefined({ network, satoshisPerByte, data, changeAddress, outputs });

  const response = await client.createBitcoinTransaction(params);
  console.log(JSON.stringify(response, null, 2));
});
