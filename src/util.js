const { createClient, setLogger } = require('dragonchain-sdk');
const { platform, homedir } = require('os');
const path = require('path');

const wrapper = async function wrapper(program, cb) {
  try {
    if (program.verbose) setLogger(console);
    let client;
    if (program.dragonchainId) client = await createClient({ dragonchainId: program.dragonchainId });
    else client = await createClient();
    errorHandler(() => cb(client));
  } catch (e) {
    console.error(e.message);
  }
};

const errorHandler = async callback => {
  try {
    await callback();
  } catch (e) {
    console.error(e.message);
  }
};

const removeUndefined = obj => {
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  return obj;
};

const getConfigFilePath = () => {
  return path.join(getConfigDirPath(), 'credentials');
};

const getConfigDirPath = () => {
  if (platform() === 'win32') {
    return path.join(process.env.LOCALAPPDATA, 'dragonchain');
  }
  return path.join(homedir(), '.dragonchain');
};

module.exports = {
  wrapper,
  getConfigFilePath,
  getConfigDirPath,
  removeUndefined,
  errorHandler
};
