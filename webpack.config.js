const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')));

const banner =
`${pkg.title} ${pkg.version} <${pkg.homepage}>
Copyright (c) ${(new Date()).getFullYear()} ${pkg.author.name} <${pkg.author.url}>
Released under ${pkg.license} License`;

module.exports = {
    entry: './src/index.js',
    output: {
        filename: './dist/html2canvas.js',
        library: 'html2canvas',
        libraryTarget: 'umd'
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
            '__DEV__': true,
            '__VERSION__': JSON.stringify(pkg.version)
        }),
        new webpack.BannerPlugin(banner)
    ]
};
