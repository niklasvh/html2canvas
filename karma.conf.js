// Karma configuration
// Generated on Sat Aug 05 2017 23:42:26 GMT+0800 (Malay Peninsula Standard Time)

const port = 9876;
module.exports = function(config) {
    const slLaunchers = (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) ? {} : {
        sl_beta_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 10',
            version: 'beta'
        },
        sl_ie9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '9.0',
            platform: 'Windows 7'
        },
        sl_ie10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '10.0',
            platform: 'Windows 7'
        },
        sl_ie11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11.0',
            platform: 'Windows 7'
        },
        sl_edge_15: {
            base: 'SauceLabs',
            browserName: 'MicrosoftEdge',
            version: '15.15063',
            platform: 'Windows 10'
        },
        sl_edge_14: {
            base: 'SauceLabs',
            browserName: 'MicrosoftEdge',
            version: '14.14393',
            platform: 'Windows 10'
        },
        sl_safari: {
            base: 'SauceLabs',
            browserName: 'safari',
            version: '10.1',
            platform: 'macOS 10.12'
        },
        'sl_android_4.4': {
            base: 'SauceLabs',
            browserName: 'Browser',
            platform: 'Android',
            version: '4.4',
            device: 'Android Emulator',
        },
        'sl_ios_10.3_safari': {
            base: 'SauceLabs',
            browserName: 'Safari',
            platform: 'iOS',
            version: '10.3',
            device: 'iPhone 7 Plus Simulator'
        },
        'sl_ios_9.3_safari': {
            base: 'SauceLabs',
            browserName: 'Safari',
            platform: 'iOS',
            version: '9.3',
            device: 'iPhone 6 Plus Simulator'
        }
    };

    const customLaunchers = Object.assign({}, slLaunchers, {
        stable_chrome: {
            base: 'Chrome'
        },
        stable_firefox: {
            base: 'Firefox'
        }
    });

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],


        // list of files / patterns to load in the browser
        files: [
            'build/testrunner.js',
            { pattern: './tests/**/*', 'watched': true, 'included': false, 'served': true},
            { pattern: './dist/**/*', 'watched': true, 'included': false, 'served': true},
            { pattern: './node_modules/**/*', 'watched': true, 'included': false, 'served': true}
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'saucelabs'],

        // web server port
        port,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: Object.keys(customLaunchers),


        customLaunchers,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: 5,

        proxies: {
            '/dist': `http://localhost:${port}/base/dist`,
            '/node_modules': `http://localhost:${port}/base/node_modules`,
            '/tests': `http://localhost:${port}/base/tests`,
            '/assets': `http://localhost:${port}/base/tests/assets`
        },

        client: {
            mocha: {
                // change Karma's debug.html to the mocha web reporter
                reporter: 'html'
            }
        },

        captureTimeout: 300000,

        browserDisconnectTimeout: 60000,

        browserNoActivityTimeout: 1200000
    })
};
