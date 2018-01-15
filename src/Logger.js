/* @flow */
'use strict';

export default class Logger {
    enabled: boolean;
    start: number;
    id: ?string;

    constructor(enabled: boolean, id: ?string, start: ?number) {
        this.enabled = enabled;
        this.start = start ? start : Date.now();
        this.id = id;
    }

    child(id: string) {
        return new Logger(this.enabled, id, this.start);
    }

    // eslint-disable-next-line flowtype/no-weak-types
    log(...args: any) {
        // eslint-disable-next-line no-console
        if (this.enabled && typeof console !== undefined && console.log) {
            Function.prototype.bind
                // eslint-disable-next-line no-console
                .call(console.log, console)
                .apply(
                    console,
                    [
                        Date.now() - this.start + 'ms',
                        this.id ? `html2canvas (${this.id}):` : 'html2canvas:'
                    ].concat([].slice.call(args, 0))
                );
        }
    }

    // eslint-disable-next-line flowtype/no-weak-types
    error(...args: any) {
        if (this.enabled && console && console.error) {
            Function.prototype.bind
                .call(console.error, console)
                .apply(
                    console,
                    [
                        Date.now() - this.start + 'ms',
                        this.id ? `html2canvas (${this.id}):` : 'html2canvas:'
                    ].concat([].slice.call(args, 0))
                );
        }
    }
}
