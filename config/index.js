'use strict';

const fs = require('fs');
const setWebpackConfig = require('./setWebpackConfig');
const { getAppPath } = require('../utils/util');

let defaultrcConfig = {};
const defaultrcConfigPath = getAppPath('.defaultrc.json');

try {
  defaultrcConfig = fs.existsSync(defaultrcConfigPath) ? require(defaultrcConfigPath) : {};
} catch(err) {
  throw err;
}
  
const webapckConfig = setWebpackConfig(defaultrcConfig);

module.exports = webapckConfig;
