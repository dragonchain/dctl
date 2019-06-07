#!/usr/bin/env node

const program = require("commander");
const util = require("./util");
program
  .description("Create a new Ethereum Classic transaction using your dragonchain's private keys.", { to: "(Hex encoded string) Ethereum address to which this transaction will be addressed.", value: "(Hex encoded number) Amount of ETH to send." })
  .arguments("<to> <value>")
  .option("-t, --testNet", "(optional) Use Ethereum testnet (ETC_MORDEN)")
  .option("-p, --gasPrice <gasPrice>", "(Hex encodedstring, optional) Gas Price.")
  .option("-d, --data <data>", "(Hex encoded string, optional) Data to add to the transaction")
  .option("-g, --gas <gas>", "(Hex encoded string, optional) Gas.")
  .option("-v, --verbose", "(optional) Enable STDOUT logger in your Dragonchain SDK.")
  .option("-i, --dragonchainId [dragonchainID]", "(optional) Override the default dragonchain ID for this command.")
  .parse(process.argv);

util.wrapper(program, async client => {
  try {
    const { testNet, gasPrice, data, gas } = program;
    const [to, value] = program.args;
    const network = Boolean(testNet) ? "ETC_MORDEN" : "ETC_MAINNET";
    const params = util.removeUndefined({ network, gasPrice, data, value, gas, to });
    const response = await client.createEthereumTransaction(params);
    console.log(JSON.stringify(response, null, 2));
  } catch (e) {
    console.error(e.message);
  }
});
