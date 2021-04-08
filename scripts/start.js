"use strict";

process.env.NODE_ENV = "development";

require('dotenv').config();

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { setDefaultEnv, log } = require('../utils/util.js');
const isPortTaken = require('../utils/isPortTaken.js');
const webpackConfig = require('../config/index.js');

setDefaultEnv();

const start = () => {
  Promise.resolve().then(async () => {
    const { HOST, PORT } = process.env;
    try {
      await isPortTaken(PORT, HOST);
    } catch (error) {
      log(chalk.red(error));
      process.exit();
    }

    const compiler = webpack(webpackConfig);
    const devServerOptions = Object.assign({}, webpackConfig.devServer, {
      open: false,
    });
    const server = new WebpackDevServer(compiler, devServerOptions);

    server.listen(PORT, HOST, (err) => {
      if (err) {
        return console.error(err);
      }
      log(chalk.green(`Starting server on http://${HOST}:${PORT}`));
    })
  }).catch(error => {
    if (error && error.message) {
      console.error(error.message);
    }
    process.exit(1);
  })
  
};

start();
