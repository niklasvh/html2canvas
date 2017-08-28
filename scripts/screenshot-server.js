const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const filenamifyUrl = require('filenamify-url');

const app = express();
app.use(
    bodyParser.json({
        limit: '15mb',
        type: '*/*'
    })
);

const prefix = 'data:image/png;base64,';

const writeScreenshot = (buffer, body) => {
    const filename = `${filenamifyUrl(
        body.test.replace(/^\/tests\/reftests\//, '').replace(/\.html$/, ''),
        {replacement: '-'}
    )}!${body.platform.name}-${body.platform.version}.png`;

    fs.writeFileSync(path.resolve(__dirname, '../tests/results/', filename), buffer);
};

app.post('/screenshot', (req, res) => {
    if (!req.body || !req.body.screenshot) {
        return res.sendStatus(400);
    }

    const buffer = new Buffer(req.body.screenshot.substring(prefix.length), 'base64');
    writeScreenshot(buffer, req.body);
    return res.sendStatus(200);
});

const chunks = {};

app.post('/screenshot/chunk', (req, res) => {
    if (!req.body || !req.body.screenshot) {
        return res.sendStatus(400);
    }

    const key = `${req.body.platform.name}-${req.body.platform.version}-${req.body.test
        .replace(/^\/tests\/reftests\//, '')
        .replace(/\.html$/, '')}`;
    if (!Array.isArray(chunks[key])) {
        chunks[key] = Array.from(Array(req.body.totalCount));
    }

    chunks[key][req.body.part] = req.body.screenshot;

    if (chunks[key].every(s => typeof s === 'string')) {
        const str = chunks[key].reduce((acc, s) => acc + s, '');
        const buffer = new Buffer(str.substring(prefix.length), 'base64');
        delete chunks[key];
        writeScreenshot(buffer, req.body);
    }

    return res.sendStatus(200);
});

app.use((error, req, res, next) => {
    console.error(error);
    next();
});

const listener = app.listen(8081, () => {
    console.log(listener.address().port);
});
