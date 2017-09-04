const Server = require('karma').Server;
const cfg = require('karma').config;
const path = require('path');
const proxy = require('html2canvas-proxy');
const karmaConfig = cfg.parseConfig(path.resolve('./karma.conf.js'));
const server = new Server(karmaConfig, (exitCode) => {
    console.log('Karma has exited with ' + exitCode);
    process.exit(exitCode)
});

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const filenamifyUrl = require('filenamify-url');

const CORS_PORT = 8081;
const corsApp = express();
corsApp.use('/proxy', proxy());
corsApp.use('/cors', cors(), express.static(path.resolve(__dirname)));
corsApp.use('/', express.static(path.resolve(__dirname, '/tests')));
corsApp.use((error, req, res, next) => {
    console.error(error);
    next();
});

process.on('uncaughtException', (err) => {
    if(err.errno === 'EADDRINUSE') {
        console.warn(err);
    } else {
        console.log(err);
        process.exit(1);
    }
});

corsApp.listen(CORS_PORT, () => {
    console.log(`CORS server running on port ${CORS_PORT}`);
});

const app = express();
app.use(cors());
app.use((req, res, next) => {
    // IE9 doesn't set headers for cross-domain ajax requests
    if(typeof(req.headers['content-type']) === 'undefined'){
        req.headers['content-type'] = "application/json";
    }
    next();
});
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

    fs.writeFileSync(path.resolve(__dirname, './tests/results/', filename), buffer);
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

const listener = app.listen(8000, () => {
    server.start();
});


