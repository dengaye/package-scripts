'use strict';

process.env.NODE_ENV = 'production';

const chalk = require('chalk');
const webpack = require('webpack');
const { log } = require('../utils/util');
const webpackConfig = require('../config/index');

const build = async () => {
  log(chalk.green('Creating an optimized production build...'));

  // https://www.webpackjs.com/api/node/ Node.js 下执行 webpack
  const compiler = webpack(webpackConfig);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        const error = err.details || err.stack || err;
        reject(error);
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        reject(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
      resolve('Compiled successfully.')
    })
  })
};

build().then(msg => {
  log(chalk.green(`${msg}`));
}).catch(error => {
  log(chalk.red(`${error}`));
});
