import * as express from 'express';
const cors = require('cors');
const path = require('path');
const serveIndex = require('serve-index');
const proxy = require('html2canvas-proxy');
import yargs from 'yargs';
import {ScreenshotRequest} from './types';
const fs = require('fs');
const bodyParser = require('body-parser');
const filenamifyUrl = require('filenamify-url');
const mkdirp = require('mkdirp');

export const app = express();
app.use('/', serveIndex(path.resolve(__dirname, '../'), {icons: true}));
app.use([/^\/src($|\/)/, '/'], express.static(path.resolve(__dirname, '../')));

export const corsApp = express();
corsApp.use('/proxy', proxy());
corsApp.use('/cors', cors(), express.static(path.resolve(__dirname, '../')));
corsApp.use('/', express.static(path.resolve(__dirname, '.')));

export const screenshotApp = express();
screenshotApp.use(cors());
screenshotApp.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
    // IE9 doesn't set headers for cross-domain ajax requests
    if (typeof req.headers['content-type'] === 'undefined') {
        req.headers['content-type'] = 'application/json';
    }
    next();
});
screenshotApp.use(
    bodyParser.json({
        limit: '15mb',
        type: '*/*'
    })
);

const prefix = 'data:image/png;base64,';
const screenshotFolder = '../tmp/reftests';
const metadataFolder = '../tmp/reftests/metadata';

mkdirp.sync(path.resolve(__dirname, screenshotFolder));
mkdirp.sync(path.resolve(__dirname, metadataFolder));

const writeScreenshot = (buffer: Buffer, body: ScreenshotRequest) => {
    const filename = `${filenamifyUrl(body.test.replace(/^\/tests\/reftests\//, '').replace(/\.html$/, ''), {
        replacement: '-'
    })}!${[process.env.TARGET_BROWSER, body.platform.name, body.platform.version].join('-')}`;

    fs.writeFileSync(path.resolve(__dirname, screenshotFolder, `${filename}.png`), buffer);
    return filename;
};

screenshotApp.post('/screenshot', (req: express.Request<{}, void, ScreenshotRequest>, res: express.Response) => {
    if (!req.body || !req.body.screenshot) {
        return res.sendStatus(400);
    }

    const buffer = Buffer.from(req.body.screenshot.substring(prefix.length), 'base64');
    const filename = writeScreenshot(buffer, req.body);
    fs.writeFileSync(
        path.resolve(__dirname, metadataFolder, `${filename}.json`),
        JSON.stringify({
            windowWidth: req.body.windowWidth,
            windowHeight: req.body.windowHeight,
            platform: req.body.platform,
            devicePixelRatio: req.body.devicePixelRatio,
            test: req.body.test,
            id: process.env.TARGET_BROWSER,
            screenshot: filename
        })
    );
    return res.sendStatus(200);
});

screenshotApp.use((error: Error, _req: express.Request, _res: express.Response, next: express.NextFunction) => {
    console.error(error);
    next();
});

const args = yargs(process.argv.slice(2)).number(['port', 'cors']).argv;

if (args.port) {
    app.listen(args.port, () => {
        console.log(`Server running on port ${args.port}`);
    });
}

if (args.cors) {
    corsApp.listen(args.cors, () => {
        console.log(`CORS server running on port ${args.cors}`);
    });
}
