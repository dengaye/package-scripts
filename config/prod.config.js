const MiniCssExtactPlugin = require('mini-css-extract-plugin');

module.exports = (defaultrcConfig) => {
  return {
    output: {
      filename: '[name]-[chunkhash:8].js',
      chunkFilename: '[name]-[chunkhash:8].js',
      publicPath: process.env.PUBLIC_PATH || '/',
    },
    mode: 'production',
    devtool: false,
    plugins: [
      new MiniCssExtactPlugin({
        filename: '[name]-[chunkhash:8].css',
        chunkFilename: '[name]-[chunkhash:8].css',
        ignoreOrder: true,
      }),
    ],
  };
}
