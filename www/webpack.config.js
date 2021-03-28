const path = require('path');

module.exports = {
    mode: 'development',
    target: 'web',
    entry:  path.resolve(__dirname, './src/preview.ts'),
    output: {
        path: path.resolve(__dirname, './static/tests'),
        filename: 'preview.js'
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ }
        ]
    }
};
