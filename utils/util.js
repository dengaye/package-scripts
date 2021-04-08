const fs = require('fs');
const path = require('path');

const setDefaultEnv = () => {
  if (!process.env.HOST) {
    process.env.HOST = "0.0.0.0";
  }
  if (!process.env.PORT) {
    process.env.PORT = 4090;
  }
};

const log = console.log;

const getAppRootPath = () => fs.realpathSync(process.cwd());

const getAppPath = (pathname) => path.join(getAppRootPath(), pathname || '');

module.exports = {
  setDefaultEnv,
  log,
  getAppRootPath,
  getAppPath,
}