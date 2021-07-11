import {readdirSync, readFileSync, writeFileSync} from 'fs';
import {resolve} from 'path';

if (process.argv.length <= 2) {
    console.log('No metadata path provided');
    process.exit(1);
}

if (process.argv.length <= 3) {
    console.log('No output file given');
    process.exit(1);
}

const path = resolve(__dirname, '../', process.argv[2]);
const files = readdirSync(path);

interface RefTestMetadata {}

interface RefTestSingleMetadata extends RefTestMetadata {
    test?: string;
}

interface RefTestResults {
    [key: string]: Array<RefTestMetadata>;
}

const result: RefTestResults = files.reduce((result: RefTestResults, file) => {
    const json: RefTestSingleMetadata = JSON.parse(readFileSync(resolve(__dirname, path, file)).toString());
    if (json.test) {
        if (!result[json.test]) {
            result[json.test] = [];
        }

        result[json.test].push(json);
        delete json.test;
    }

    return result;
}, {});

const output = resolve(__dirname, '../', process.argv[3]);
writeFileSync(output, JSON.stringify(result));

console.log(`Wrote file ${output}`);
