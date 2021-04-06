#!/usr/bin/env node

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

import chalk from "chalk";
import spawn from "cross-spawn";
import { createRequire } from "module";

//等同于 CommonJS  require.resolve，
// ps: 为这里指定了 module type 为 ES6 module，不支持 CommonJS 的 require
const require = createRequire(import.meta.url);
const log = console.log;
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
    if (result.signal === "SIGKILL") {
      log(`The build failed because the process exited too early. 
      This probably means the system ran out of memory or someone called 
      'kill -9' on the process.`);
    } else if (result.signal === "SIGTERM") {
      log(`The build failed because the process exited too early. 
      Someone might have called 'kill' or 'killall', or the system could 
      be shutting down."
      `);
    }
    process.exit(1);
  }
  process.exit(result.status);
} else {
  log(chalk.red(`Unknow script: "${args[0]}"`));
}
