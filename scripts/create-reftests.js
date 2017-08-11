const {Chromeless} = require('chromeless');
const path = require('path');
const fs = require('fs');
const express = require('express');
const reftests = require('../tests/reftests');

const app = express();
app.use('/', express.static(path.resolve(__dirname, '../')));

const listener = app.listen(0, () => {
    async function run() {
        const chromeless = new Chromeless();
        const tests = Object.keys(reftests.testList);
        let i = 0;
        while (tests[i]) {
            const filename = tests[i];
            i++;
            const reftest = await chromeless
                .goto(`http://localhost:${listener.address().port}${filename}?reftest&run=false`)
                .evaluate(() =>
                    html2canvas(document.documentElement, {
                        windowWidth: 800,
                        windowHeight: 600,
                        target: new RefTestRenderer()
                    })
                );
            fs.writeFileSync(
                path.resolve(__dirname, `..${filename.replace(/\.html$/i, '.txt')}`),
                reftest
            );
        }

        await chromeless.end();
    }

    run().catch(console.error.bind(console)).then(() => process.exit(0));
});
