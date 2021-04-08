#!/usr/bin/env node

const chalk = require('chalk');
const spawn = require('cross-spawn');
const { createRequire } = require('module');
const { log } = require('../utils/util');

/**
 * 捕捉未处理的 promise reject
 */
 process.on("unhandledRejection", (err) => {
  log(err);
  /***
   * 退出状态 code，回强制进行尽快退出，及时还有尚未完成的一步操作在等待
   * 默认 code 为 0 或 process.exitCode 的值（如果已设置）
   */
  process.exit(1);
});

/***
 * process.argv
 * 返回一个数组，其中包含当 Node.js 进程被启动时传入的命令参数
 * 第一个元素：process.execPath
 * 第二个元素：正在被执行的 JavaScript 文件的路径。
 * 其余的元素都是任何额外的命令后参数
 */
const args = process.argv.slice(2);
const scriptsMap = {
  start: "start",
  build: "build",
};
const script = scriptsMap[args[0]];

if (script) {
  const customArgs = args.slice(1);
  const customEnv = {};

  if (customArgs.length) {
    customArgs.forEach((arg) => {
      const [key, value] = arg.split("=");
      customEnv[key.trim()] = value.trim();
    });
  }

  const result = spawn.sync(
    "node",
    [].concat(require.resolve(`../scripts/${script}`)),
    {
      stdio: "inherit",
      env: { ...process.env, ...customEnv },
    } 
  );

  if (result.signal) {
    log(chalk.red(result.signal));
    process.exit(1);
  }
  process.exit(result.status);
} else {
  log(chalk.red(`Unknow script: "${args[0]}"`));
}
