const MiniCssExtactPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safeParser = require('postcss-safe-parser');
const { staticJsResPath, staticStyleResPath } = require('../utils/contants');

module.exports = (defaultrcConfig) => {
  return {
    output: {
      filename: `${staticJsResPath}/[name]-[chunkhash:8].js`,
      chunkFilename: `${staticJsResPath}/[name]-[chunkhash:8].js`,
      publicPath: process.env.PUBLIC_PATH || '/',
    },
    mode: 'production',
    devtool: false,
    plugins: [
      new MiniCssExtactPlugin({
        filename: `${staticStyleResPath}/[name]-[chunkhash:8].css`,
        chunkFilename: `${staticStyleResPath}/[name]-[chunkhash:8].css`,
        ignoreOrder: true,
      }),
    ],
    optimization: {
      moduleIds: 'hashed',
      minimizer: [
        new TerserPlugin({
          // 是否将注释剥离到单独的文件中，默认情况下，仅剥离 /^\**!|@preserve|@license|@cc_on/i 正则表达式匹配的注释
          extractComments: false,
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safeParser,
            discardComments: {
              removeAll: true,
            },
          },
        }),
      ],
      // 会为每个入口添加一个只含有 runtime 的额外 chunk
      // runtime:  主要是指在浏览器运行过程中，webpack 用来链接模块化应用程序所需的所有代码。
      // 它包含：1. 在模块交互时，链接模块所需的加载和解析逻辑。2. 已经加载到浏览中的链接模块逻辑，以及尚未加载模块的延迟加载逻辑。
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
      splitChunks: {
        chunks: 'all',
        // webpack 4+ 中，如果 chunk 的大小不超过 30 kB，就会忽略
        // https://webpack.js.org/plugins/split-chunks-plugin/#defaults
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
