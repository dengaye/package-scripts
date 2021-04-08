const webpack = require('webpack');
const path = require('path');
const MiniCssExtactPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { getAppPath } = require('../utils/util');

module.exports = {
  output: {
    filename: '[name]-[chunkhash:8].js',
    chunkFilename: '[name]-[chunkhash:8].js',
    publicPath: process.env.PUBLIC_PATH || '/',
  },
  mode: 'production',
  devtool: false,
  plugins: [
    new StyleLintPlugin({
      configFile: getAppPath('./stylelint.config.js'),
      context: getAppPath('./src', ''),
      failOnError: true,
      quiet: false,
    }),
    new MiniCssExtactPlugin({
      filename: '[name]-[chunkhash:8].css',
      chunkFilename: '[name]-[chunkhash:8].css',
      ignoreOrder: true,
    }),
  ],
};
