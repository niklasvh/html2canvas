'use strict';

const path = require('path');
const glob = require('glob');
const fs = require('fs');
const slash = require('slash');
const parseRefTest = require('./parse-reftest');
const outputPath = 'tests/reftests.js';

glob(
    '../tests/reftests/**/*.html',
    {
        cwd: __dirname,
        root: path.resolve(__dirname, '../../')
    },
    (err, files) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        const testList = files.reduce((acc, filename) => {
            const refTestFilename = path.resolve(__dirname, filename.replace(/\.html$/, '.txt'));
            console.log(refTestFilename);
            acc[`/${slash(path.relative('../', filename))}`] = fs.existsSync(refTestFilename)
                ? parseRefTest(fs.readFileSync(refTestFilename).toString())
                : null;

            return acc;
        }, {});
        fs.writeFileSync(
            path.resolve(__dirname, `../${outputPath}`),
            `module.exports = ${JSON.stringify(testList, null, 4)};`
        );

        console.log(`${outputPath} updated`);
    }
);
