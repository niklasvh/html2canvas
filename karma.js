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

const mkdirp = require('mkdirp');
const screenshotFolder = './tmp/reftests';
const metadataFolder = './tmp/reftests/metadata';

mkdirp.sync(path.resolve(__dirname, screenshotFolder));
mkdirp.sync(path.resolve(__dirname, metadataFolder));

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
    )}!${[process.env.TARGET_BROWSER, body.platform.name, body.platform.version].join('-')}`;

    fs.writeFileSync(path.resolve(__dirname, screenshotFolder, `${filename}.png`), buffer);
    return filename;
};

app.post('/screenshot', (req, res) => {
    if (!req.body || !req.body.screenshot) {
        return res.sendStatus(400);
    }

    const buffer = new Buffer(req.body.screenshot.substring(prefix.length), 'base64');
    const filename = writeScreenshot(buffer, req.body);
    fs.writeFileSync(path.resolve(__dirname, metadataFolder, `${filename}.json`), JSON.stringify({
        windowWidth: req.body.windowWidth,
        windowHeight: req.body.windowHeight,
        platform: req.body.platform,
        devicePixelRatio: req.body.devicePixelRatio,
        test: req.body.test,
        id: process.env.TARGET_BROWSER,
        screenshot: filename
    }));
    return res.sendStatus(200);
});

app.use((error, req, res, next) => {
    console.error(error);
    next();
});

const listener = app.listen(8000, () => {
    server.start();
});


