/* @flow */
'use strict';

export default class Logger {
    start: number;

    constructor() {
        this.start = Date.now();
    }

    log(...args: any) {
        Function.prototype.bind
            .call(window.console.log, window.console)
            .apply(
                window.console,
                [Date.now() - this.start + 'ms', 'html2canvas:'].concat([].slice.call(args, 0))
            );
    }
}
