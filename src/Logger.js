/* @flow */
'use strict';

export default class Logger {
    start: number;

    constructor() {
        this.start = Date.now();
    }

    // eslint-disable-next-line flowtype/no-weak-types
    log(...args: any) {
        Function.prototype.bind
            .call(window.console.log, window.console)
            .apply(
                window.console,
                [Date.now() - this.start + 'ms', 'html2canvas:'].concat([].slice.call(args, 0))
            );
    }
}
