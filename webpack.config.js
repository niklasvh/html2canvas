const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')));

const banner =
`${pkg.title} ${pkg.version} <${pkg.homepage}>
Copyright (c) ${(new Date()).getFullYear()} ${pkg.author.name} <${pkg.author.url}>
Released under ${pkg.license} License`;

const plugins = [
    new webpack.DefinePlugin({
        '__DEV__': true,
        '__VERSION__': JSON.stringify(pkg.version)
    }),
    new webpack.BannerPlugin(banner)
];

const modules = {
    loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
    }]
};

module.exports = [
    {
        entry: './src/index.js',
        output: {
            filename: './dist/html2canvas.js',
            library: 'html2canvas',
            libraryTarget: 'umd'
        },
        module: modules,
        plugins
    },
    {
        entry: './src/index.js',
        output: {
            filename: './dist/html2canvas.min.js',
            library: 'html2canvas',
            libraryTarget: 'umd'
        },
        module: modules,
        plugins: [
            new webpack.DefinePlugin({
                '__DEV__': false,
                '__VERSION__': JSON.stringify(pkg.version)
            }),
            new UglifyJSPlugin(),
            new webpack.BannerPlugin(banner)
        ]
    },
    {
        entry: './src/renderer/RefTestRenderer.js',
        output: {
            filename: './dist/RefTestRenderer.js',
            library: 'RefTestRenderer',
            libraryTarget: 'umd'
        },
        module: modules,
        plugins
    },
    {
        entry: './tests/testrunner.js',
        output: {
            filename: './build/testrunner.js',
            library: 'testrunner',
            libraryTarget: 'umd'
        },
        module: modules,
        plugins
    }
];
