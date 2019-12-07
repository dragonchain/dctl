const program = require('commander');
const util = require('./util');

program
  .description('Open the explorer for your chain')
  .arguments('<transactionId>')
  .option('-v, --verbose', '(optional) Enable STDOUT logger in your Dragonchain SDK')
  .option('-i, --dragonchainId [dragonchainID]', '(optional) Override the default dragonchain ID for this command')
  .parse(process.argv);

util.wrapper(program, async client => {
  const [transactionId] = program.args;

  async function getEternalReport() {
    const transaction = await client.getTransaction({ transactionId });
    if (transaction && !transaction.ok) throw new Error('Error fetching transaction');

    const block = await client.getBlock({ blockId: getL1BlockId(transaction) });
    const verifications = await client.getVerifications({ blockId: getL1BlockId(transaction) });
    return generateReport(transaction, block, verifications);
  }

  console.log(JSON.stringify(await getEternalReport(), null, 2));
});

function appendTransaction(report, transaction) {
  report.l1Transaction = transaction && transaction.response;
}

function appendVerifications(report, verifications) {
  report.l2Verifications = verifications && verifications.response && verifications.response['2'];
  report.l3Verifications = verifications && verifications.response && verifications.response['3'];
  report.l4Verifications = verifications && verifications.response && verifications.response['4'];
  report.l5Verifications = verifications && verifications.response && verifications.response['5'];
}

function appendBlock(report, block) {
  report.l1Block = block && block.response;
}

function getL1BlockId(transaction) {
  return transaction && transaction.response && transaction.response.header && transaction.response.header.block_id;
}

function generateReport(transaction, block, verifications) {
  const report = {};
  appendTransaction(report, transaction);
  appendBlock(report, block);
  appendVerifications(report, verifications);
  return report;
}
