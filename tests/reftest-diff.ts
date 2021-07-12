import {sync} from 'glob';
import {resolve, basename} from 'path';
import {existsSync, promises} from 'fs';
import {toMatchImageSnapshot} from 'jest-image-snapshot';

const resultsDir = resolve(__dirname, '../results');
const customSnapshotsDir = resolve(__dirname, '../tmp/snapshots');
const customDiffDir = resolve(__dirname, '../tmp/snapshot-diffs');

expect.extend({toMatchImageSnapshot});

describe('Image diff', () => {
    const files: string[] = sync('../tmp/reftests/**/*.png', {
        cwd: __dirname,
        root: resolve(__dirname, '../../')
    }).filter((path) => existsSync(resolve(resultsDir, basename(path))));

    it.each(files.map((path) => basename(path)))('%s', async (filename) => {
        const previous = resolve(resultsDir, filename);
        const previousSnap = resolve(customSnapshotsDir, `${filename}-snap.png`);
        await promises.copyFile(previous, previousSnap);
        const updated = resolve(__dirname, '../tmp/reftests/', filename);
        const buffer = await promises.readFile(updated);

        // @ts-ignore
        expect(buffer).toMatchImageSnapshot({
            customSnapshotsDir,
            customSnapshotIdentifier: () => filename,
            customDiffDir
        });
    });
});
