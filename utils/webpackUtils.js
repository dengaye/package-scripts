'use strict';

const chalk = require('chalk');
const { log, clearConsole } = require('./util');
const formatWebpackMessages = require('./formatWebpackMessages');

const isInteractive = process.stdout.isTTY;

const printInstructions = (urls) => {
  log();

  log(`${chalk.bold('On Your Network:')}  ${urls}`);

  log();
  log('Note that the development build is not optimized.');
  log(`To create a production build, use ` + `${chalk.cyan('yarn build')}.`);
  log();
};

const createCompiler = (webpack, config, urls) => {
  let compiler;
  try {
    compiler = webpack(config);
  } catch (err) {
    log(chalk.red('Failed to compile. '));
    log();
    log(err.message || err);
    log();
    process.exit(1);
  }

  compiler.hooks.invalid.tap('invalid', () => {
    if (isInteractive) {
      clearConsole();
    }
    if (config.devServer && config.devServer.quiet === true) {
      log('Compiling...');
    }
  });

  let isFirstCompile = true;

  // done 事件在 webpack 完成重新编译 bundle 时触发
  // 无论是否有警告或错误，都将触发此事件
  compiler.hooks.done.tap('done', async stats => {
    if (isInteractive) {
      clearConsole();
    }

    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    });
    const messages = formatWebpackMessages(statsData);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
      log(chalk.green('Compiled successfully!'));
    }

    if (isSuccessful && (isInteractive || isFirstCompile)) {
      printInstructions(urls);
    }

    isFirstCompile = false;

    if (messages.errors.length) {
      // 有多条异常信息时，只展示首条
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      log(chalk.red('Failed to compile.\n'));
      log(messages.errors.join('\n\n'));
      return;
    }

    if (messages.warnings.length) {
      log(chalk.yellow('Compiled with warnings.\n'));
      log(messages.warnings.join('\n\n'));

      log(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.'
      );
      log(
        'To ignore, add ' +
          chalk.cyan('// eslint-disable-next-line') +
          ' to the line before.\n'
      );
    }
  });

  return compiler;
};

module.exports = {
  createCompiler,
};
