import {screenshotApp, corsApp} from './server';
import {Server} from 'http';
import {config as KarmaConfig, Server as KarmaServer, TestResults} from 'karma';
import * as path from 'path';

const karmaTestRunner = (): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        const karmaConfig = KarmaConfig.parseConfig(path.resolve(__dirname, '../karma.conf.js'), {});
        const server = new KarmaServer(karmaConfig, (exitCode: number) => {
            if (exitCode > 0) {
                reject(`Karma has exited with ${exitCode}`);
            } else {
                resolve();
            }
        });
        server.on('run_complete', (_browsers: any, _results: TestResults) => {
            server.stop();
        });
        server.start();
    });
const servers: Server[] = [];

servers.push(screenshotApp.listen(8000));
servers.push(corsApp.listen(8081));

karmaTestRunner()
    .then(() => {
        servers.forEach((server) => server.close());
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
