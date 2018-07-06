'use strict';

const fs = require('fs');
const path = require('path');
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')));

const banner =
    `/*
${pkg.title} ${pkg.version} <${pkg.homepage}>
Copyright (c) ${(new Date()).getFullYear()} ${pkg.author.name} <${pkg.author.url}>
Released under ${pkg.license} License
*/`;

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: './src/index.js',
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        }),
        commonjs({
            namedExports: {
                'node_modules/css-line-break/dist/index.js': ['toCodePoints', 'fromCodePoint', 'LineBreaker']
            }
        })
    ],
    output: {
        file: './dist/html2canvas.js',
        name: 'html2canvas',
        format: 'umd',
        banner
    }
};
