const path = require('path');

module.exports = {
    entry: './src/background/background.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.background.json"
                    }
                },
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: 'source-map',
    output: {
        filename: 'background.js',
        path: path.resolve(__dirname, '../build'),
    },
};
