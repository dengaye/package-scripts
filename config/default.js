const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { getAppPath } = require('../utils/util');

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

const defaultRuleConfig = [
  {
    test: /\.(tsx?|d.ts)$/,
    include: [getAppPath('src')],
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
    include: [getAppPath('src')],
    use: [
      'thread-loader',
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: getAppPath('./.cache/.babel'),
          cacheCompression: false,
          compact: false,
          configFile: getAppPath('.babelrc'),
          fix: true,
        },
      },
    ],
    exclude: /node_modules/,
  },
  {
    test: /\.scss$/,
    include: [getAppPath('./src')],
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
    include: [getAppPath('src')],
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
    include: [getAppPath('src')],
    use: ['file-loader'],
  },
]

const defaultPluginsConfig = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: getAppPath('./src/index.html'),
  }),
]


module.exports = {
  defaultRuleConfig,
  defaultPluginsConfig,
}