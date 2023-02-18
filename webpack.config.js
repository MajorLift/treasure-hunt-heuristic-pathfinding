const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        solution: './src/main/Stacker.ts',
        challenge: './src/challenge.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[fullhash:8].js',
        sourceMapFilename: '[name].[fullhash:8].map',
        assetModuleFilename: 'images/[name][ext]',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'swc-loader',
            },
            {
                test: /\.png/,
                type: 'asset',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            template: path.resolve(__dirname, './src/challenge.ejs'),
        }),
    ],
}
