const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: './dist/html2canvas.js',
        library: 'html2canvas'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            '__DEV__': true
        })
    ]
};
