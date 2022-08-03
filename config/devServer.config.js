const { getAppPath } = require('../utils/util');

const host = process.env.HOST;
const port = process.env.PORT;
const sockHost = process.env.SOCK_HOST;
const sockPort = process.env.SOCK_PORT;

// https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md
module.exports = () => {
  return {
    host,
    port,

    allowedHosts: 'all',
    historyApiFallback: true,
    hot: true, // 会自定设置  new webpack.HotModuleReplacementPlugin()，无需用户自己添加

    headers: {
      'Access-Control-Allow-Origin': '*',
    },

    devMiddleware: {
      publicPath: process.env.PUBLIC_PATH || '/',
    },

    client: {
      webSocketURL: {
        hostname: sockHost,
        port: sockPort,
        pathname: 'ws',
      }
    },

    // static: {
    //   directory: getAppPath(appOutputRoot),
    //   watch: true,
    // }
  }
}