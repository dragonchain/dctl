const { createClient, setLogger } = require("dragonchain-sdk");
const path = require("path");

const wrapper = async function wrapper(program, cb) {
  try {
    if (program.verbose) setLogger(console);
    let client;
    if (program.dragonchainId) client = await createClient({ dragonchainId: program.dragonchainId });
    else client = await createClient();
    cb(client);
  } catch (e) {
    console.error(e.message);
  }
};

const removeUndefined = obj => {
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  return obj;
};

const getConfigFilePath = () => {
  const home = require("os").homedir();
  if (process.platform === "win32") {
    return path.join(home, "dragonchain", "credentials");
  }
  return path.join(home, ".dragonchain", "credentials");
};

const getConfigDirPath = () => {
  const home = require("os").homedir();
  if (process.platform === "win32") {
    return path.join(home, "dragonchain");
  }
  return path.join(home, ".dragonchain");
};
module.exports = { wrapper, getConfigFilePath, getConfigDirPath, removeUndefined };
