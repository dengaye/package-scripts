'use strict';

const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { getDefaultRuleConfig, getDefaultPluginsConfig, getDefaultTsConfig, getStyleLintConfig } = require('./default');
const { getAppPath } = require('../utils/util');

const DEV = process.env.NODE_ENV === 'development';

const setWebpackConfig = (defaultrcConfig = {}) => {
  const {
    appEnter,
    appPath = 'src',
    useStylelint,
    appOutputRoot = 'dist',
    useDefaultTsConfig,
    stylelintConfig,
    appExtensions = {}
  } = defaultrcConfig;
  const getSplitConfig = DEV ? require('./dev.config') : require('./prod.config');
  const defaultResolvePlugins = [];
  const defaultrcPlugins = [];
  const SplitConfig = getSplitConfig(defaultrcConfig);

  if (useDefaultTsConfig) {
    const defaultTsConfig = getDefaultTsConfig();
    defaultResolvePlugins.push(defaultTsConfig.plugins)
  }

  if (useStylelint) {
    const defaultStyleLintConfig = getStyleLintConfig(stylelintConfig, appPath);
    defaultrcPlugins.push(defaultStyleLintConfig.plugins)
  }

  return {
    entry: appEnter || getAppPath(`./${appPath}/index.js`),
    output: {
      ...SplitConfig.output,
      path: getAppPath(`./${appOutputRoot}`),
    },
    mode: SplitConfig.mode,
    devtool: SplitConfig.devtool,
    optimization: SplitConfig.optimization,
    devServer: SplitConfig.devServer,
    module: {
      rules: [].concat(getDefaultRuleConfig(appPath)),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      modules: ['node_modules', getAppPath(appPath)],
      plugins: [...defaultResolvePlugins],
      symlinks: false,
    },
    plugins: [
      ...getDefaultPluginsConfig(appPath),
      ...SplitConfig.plugins,
      ...defaultrcPlugins,
    ],
    externals: {
      ...appExtensions,
    },
  };
};

module.exports = setWebpackConfig;