const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        popup: './src/popup.ts',
        background: './src/scripts/background.ts',
        content_script: './src/scripts/content_script.ts',
        injected: './src/scripts/injected.ts',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader"
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['popup'],
            filename: "popup.html"
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "src/*.json",
                    to: "[name][ext]"
                },
            ],
        }),],
}
