// Karma configuration
// Generated on Sat Aug 05 2017 23:42:26 GMT+0800 (Malay Peninsula Standard Time)

const path = require('path');
const port = 9876;
module.exports = function(config) {
    const launchers = {
        SauceLabs_IE9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '9.0',
            platform: 'Windows 7'
        },
        SauceLabs_IE10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '10.0',
            platform: 'Windows 7'
        },
        SauceLabs_IE11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11.0',
            platform: 'Windows 7'
        },
        SauceLabs_Edge15: {
            base: 'SauceLabs',
            browserName: 'MicrosoftEdge',
            version: '15.15063',
            platform: 'Windows 10'
        },
        SauceLabs_Edge14: {
            base: 'SauceLabs',
            browserName: 'MicrosoftEdge',
            version: '14.14393',
            platform: 'Windows 10'
        },
        SauceLabs_Safari10: {
            base: 'SauceLabs',
            browserName: 'safari',
            version: '10.1',
            platform: 'macOS 10.12'
        },
        SauceLabs_Android4: {
            base: 'SauceLabs',
            browserName: 'Browser',
            platform: 'Android',
            version: '4.4',
            device: 'Android Emulator',
        },
        SauceLabs_iOS10_3: {
            base: 'SauceLabs',
            browserName: 'Safari',
            platform: 'iOS',
            version: '10.3',
            device: 'iPhone 7 Plus Simulator'
        },
        SauceLabs_iOS9_3: {
            base: 'SauceLabs',
            browserName: 'Safari',
            platform: 'iOS',
            version: '9.3',
            device: 'iPhone 6 Plus Simulator'
        },
        Chrome_Stable: {
            base: 'Chrome'
        },
        Firefox_Stable: {
            base: 'Firefox'
        }
    };

    const ciLauncher = launchers[process.env.TARGET_BROWSER];

    const customLaunchers = ciLauncher ? ciLauncher : {
        stable_chrome: {
            base: 'Chrome'
        },
        stable_firefox: {
            base: 'Firefox'
        }
    };

    const injectTypedArrayPolyfills = function(files) {
        files.unshift({
            pattern: path.resolve(__dirname, './node_modules/js-polyfills/typedarray.js'),
            included: true,
            served: true,
            watched: false
        });
    };

    injectTypedArrayPolyfills.$inject = ['config.files'];

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'inline-mocha-fix'],

        // list of files / patterns to load in the browser
        files: [
            'build/testrunner.js',
            { pattern: './tests/**/*', 'watched': true, 'included': false, 'served': true},
            { pattern: './dist/**/*', 'watched': true, 'included': false, 'served': true},
            { pattern: './node_modules/**/*', 'watched': true, 'included': false, 'served': true},
        ],

        plugins: [
            'karma-*',
            {
                'framework:inline-mocha-fix': ['factory', injectTypedArrayPolyfills]
            }
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
