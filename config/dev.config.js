const webpack = require('webpack');
const path = require('path');
const MiniCssExtactPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const { getAppPath } = require('../utils/util');
const createWebpackDevServerConfig = require('./devServer.config');

module.exports = (defaultrcConfig) => {
  const { appOutputRoot = 'dist' } = defaultrcConfig;
  const devServer = createWebpackDevServerConfig();
  return {
    output: {
      pathinfo: true,
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: process.env.PUBLIC_PATH || '/',
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer,
    plugins: [
      new MiniCssExtactPlugin({
        filename: '[name].css',
        chunkFilename: '[name].css',
        ignoreOrder: false,
      }),
      new AssetsPlugin({
        prettyPrint: true,
        filename: 'assets.json',
        path: getAppPath(appOutputRoot),
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            enforce: true,
            name: 'vendors',
          },
        },
      },
    },
  };
};
