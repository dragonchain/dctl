#!/usr/bin/env node
const fs = require("fs");
const ini = require("ini");
const util = require("./util");
try {
  const currentConfig = ini.parse(fs.readFileSync(util.getConfigFilePath(), "utf-8"));
  console.log(currentConfig["default"].dragonchain_id);
} catch (e) {
  console.error(null);
}
