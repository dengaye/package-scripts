const fs = require('fs');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { getAppPath } = require('../utils/util');

let defaultrcBabelrcPath = getAppPath('.babelrc');

try {
  defaultrcBabelrcPath = fs.existsSync(defaultrcBabelrcPath) ? defaultrcBabelrcPath  : false;
} catch(err) {
  throw err;
}

const miniCssLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    hmr: process.env.NODE_ENV === 'development',
  },
};

const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        [
          'postcss-flexbugs-fixes', {}
        ],
        [
          'postcss-preset-env',
          {
            flexbox: 'no-2009',
          }
        ],
      ]
    }
  }
}

const getDefaultRuleConfig = (appPath) => [
  {
    test: /\.(tsx?|d.ts)$/,
    include: [getAppPath(`./${appPath}`)],
    use: [
      {
        loader: 'awesome-typescript-loader',
        options: {
          transpileOnly: false,
          fix: true,
        },
      },
    ],
    exclude: /node_modules/,
  },
  {
    test: /\.(js|jsx|mjs)$/,
    include: [getAppPath(`./${appPath}`)],
    use: [
      'thread-loader',
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: getAppPath('./.cache/.babel'),
          cacheCompression: false,
          compact: false,
          configFile: defaultrcBabelrcPath,
        },
      },
    ],
    exclude: /node_modules/,
  },
  {
    test: /\.scss$/,
    include: [getAppPath(`./${appPath}`)],
    use: [
      miniCssLoader,
      {
        loader: 'css-loader',
        options: {
            modules: {
                localIdentName: '[local]-[hash:base64:10]',
            },
            localsConvention: 'camelCase',
            importLoaders: 2,
        },
      },
      postCssLoader,
      {
        loader: 'sass-loader',
      },
    ]
  },
  {
    test: /\.css$/,
    include: [getAppPath(`./${appPath}`)],
    use: [
      miniCssLoader,
      {
        loader: 'css-loader',
      },
      postCssLoader,
    ],
  },
  {
    test: /\.(png|jpg|svg|gif)$/,
    include: [getAppPath(`./${appPath}`)],
    use: ['file-loader'],
  },
]

const getDefaultPluginsConfig = (appPath) => [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: getAppPath(`./${appPath}/index.html`),
  }),
]

const getDefaultTsConfig = () => {
  return {
    plugins: new TsConfigPathsPlugin({
      configFile: getAppPath('./tsconfig.json'),
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      logLevel: 'INFO',
      baseUrl: getAppPath('.'),
      mainFields: ['browser', 'main'],
    }),
  }
}

const getStyleLintConfig = (stylelintConfigPath, appPath) => {
  return {
    plugins: new StyleLintPlugin({
      configFile: getAppPath(stylelintConfigPath || `./stylelint.config.js`),
      context: getAppPath(`./${appPath}`, ''),
      failOnError: true,
      quiet: false,
    })
  }
}

module.exports = {
  getDefaultPluginsConfig,
  getDefaultTsConfig,
  getStyleLintConfig,
  getDefaultRuleConfig,
}