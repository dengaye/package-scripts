const fs = require('fs');
const path = require('path');

const clearConsole = () => {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
};

const setDefaultEnv = () => {
  if (!process.env.HOST) {
    process.env.HOST = '0.0.0.0';
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
  clearConsole,
};
