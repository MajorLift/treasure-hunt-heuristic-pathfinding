const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    allowedHosts: 'all',
  },
  entry: {
    solution: path.resolve(__dirname, './src/main/models/Stacker.ts'),
    challenge: path.resolve(__dirname, './static/challenge.js'),
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[fullhash:8].js',
    sourceMapFilename: '[name].[fullhash:8].map',
    assetModuleFilename: 'images/[name][ext]',
    clean: true,
  },
  resolve: {
    alias: {
      static: path.resolve(__dirname, './static'),
    },
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'swc-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.png/,
        include: path.resolve(__dirname, './static'),
        type: 'asset',
      },
      {
        // Exposes jQuery for use outside Webpack build
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery'],
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      'window.$': 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(__dirname, './static/challenge.ejs'),
    }),
  ],
}
