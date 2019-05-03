"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
if (process.argv.length <= 2) {
    console.log('No metadata path provided');
    process.exit(1);
}
if (process.argv.length <= 3) {
    console.log('No output file given');
    process.exit(1);
}
var path = path_1.resolve(__dirname, '../', process.argv[2]);
var files = fs_1.readdirSync(path);
var result = files.reduce(function (result, file) {
    var json = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, path, file)).toString());
    if (!result[json.test]) {
        result[json.test] = [];
    }
    result[json.test].push(json);
    delete json.test;
    return result;
}, {});
var output = path_1.resolve(__dirname, '../', process.argv[3]);
fs_1.writeFileSync(output, JSON.stringify(result));
console.log("Wrote file " + output);
