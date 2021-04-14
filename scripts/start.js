"use strict";

process.env.NODE_ENV = "development";

require('dotenv').config();

const chalk = require('chalk');
const url = require('url');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { setDefaultEnv, log, clearConsole } = require('../utils/util.js');
const { createCompiler } = require('../utils/webpackUtils');
const isPortTaken = require('../utils/isPortTaken.js');
const webpackConfig = require('../config/index.js');

setDefaultEnv();

const isInteractive = process.stdout.isTTY;

const getLocalUrls = (protocol, hostname, port, pathname) =>
  url.format({
    protocol,
    hostname,
    port: chalk.bold(port),
    pathname,
  });

const start = () => {
  Promise.resolve().then(async () => {
    const { HOST, PORT } = process.env;
    try {
      await isPortTaken(PORT, HOST);
    } catch (error) {
      log(chalk.red(error));
      process.exit();
    }

    const compiler = createCompiler(
      webpack,
      webpackConfig,
      getLocalUrls('http', HOST, PORT, '/')
    );
    const devServerOptions = Object.assign(
      {},
      webpackConfig.devServer,
      { open: false }
    );
    const devServer = new WebpackDevServer(compiler, devServerOptions);

    devServer.listen(PORT, HOST, err => {
      if (err) {
        return console.error(err);
      }
  
      if (isInteractive) {
        clearConsole();
      }

      log(chalk.cyan('Starting the development server...\n'));
    });

    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
      process.on(sig, function () {
        devServer.close();
        process.exit();
      });
    });

    if (isInteractive) {
      process.stdin.on('end', function () {
        devServer.close();
        process.exit();
      });
      process.stdin.resume();
    }
  }).catch(error => {
    if (error && error.message) {
      console.error(error.message);
    }
    process.exit(1);
  })
  
};

start();
