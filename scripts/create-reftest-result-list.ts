import {readdirSync, readFileSync, writeFileSync} from 'fs';
import {resolve} from 'path';

if (process.argv.length <= 2){
    console.log('No metadata path provided');
    process.exit(1);
}

if (process.argv.length <= 3){
    console.log('No output file given');
    process.exit(1);
}

const path = resolve(__dirname, '../', process.argv[2]);
const files = readdirSync(path);

const result = files.reduce((result, file) => {
    const json = JSON.parse(readFileSync(resolve(__dirname, path, file)).toString());
    if (!result[json.test]) {
        result[json.test] = [];
    }

    result[json.test].push(json);
    delete json.test;

    return result;
}, {});

const output = resolve(__dirname, '../', process.argv[3]);
writeFileSync(output, JSON.stringify(result));

console.log(`Wrote file ${output}`);
