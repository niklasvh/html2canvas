'use strict';

const path = require('path');
const glob = require('glob');
const fs = require('fs');
const slash = require('slash');
const parseRefTest = require('./parse-reftest');
const outputPath = 'tests/reftests.js';

const ignoredTests = [
    '/tests/reftests/background/radial-gradient.html',
    '/tests/reftests/text/chinese.html'
];

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
            const name = `/${slash(path.relative('../', filename))}`;
            if (ignoredTests.indexOf(name) === -1) {
                console.log(name);
                acc[name] = fs.existsSync(refTestFilename)
                    ? parseRefTest(fs.readFileSync(refTestFilename).toString())
                    : null;
            } else {
                console.log(`IGNORED: ${name}`);
            }


            return acc;
        }, {});
        fs.writeFileSync(
            path.resolve(__dirname, `../${outputPath}`),
            `module.exports = ${JSON.stringify(testList, null, 4)};`
        );

        console.log(`${outputPath} updated`);
    }
);
