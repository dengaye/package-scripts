'use strict';

const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { defaultRuleConfig, defaultPluginsConfig } = require('./default');
const { getAppPath } = require('../utils/util');

const DEV = process.env.NODE_ENV === 'development';
const SplitConfig = DEV ? require('./dev.config') : require('./prod.config');

module.exports = {
  entry: getAppPath('./src/index.tsx'),
  output: {
    ...SplitConfig.output,
    path: getAppPath('dist'),
  },
  mode: SplitConfig.mode,
  devServer: SplitConfig.devServer,
  module: {
    rules: [].concat(defaultRuleConfig),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: ['node_modules', getAppPath('src')],
    plugins: [
      new TsConfigPathsPlugin({
        configFile: getAppPath('./tsconfig.json'),
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        logLevel: 'INFO',
        baseUrl: getAppPath('.'),
        mainFields: ['browser', 'main'],
      }),
    ],
  },
  plugins: [
    ...defaultPluginsConfig,
    ...SplitConfig.plugins,
  ],
};
