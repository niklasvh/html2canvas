// Karma configuration
// Generated on Sat Aug 05 2017 23:42:26 GMT+0800 (Malay Peninsula Standard Time)

const path = require('path');
const simctl = require('node-simctl');
const iosSimulator = require('appium-ios-simulator');
const port = 9876;

const exec = require('child_process').exec;
const log = require('karma/lib/logger').create('launcher:MobileSafari');

if (process.env.TARGET_BROWSER === 'Safari_IOS') {

}

module.exports = function(config) {
    const launchers = {
        Safari_IOS: {
            base: 'MobileSafari'
        },
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
        SauceLabs_Edge18: {
            base: 'SauceLabs',
            browserName: 'MicrosoftEdge',
            version: '18.17763',
            platform: 'Windows 10'
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
        IE_9: {
            base: 'IE',
            'x-ua-compatible': 'IE=EmulateIE9',
            flags: ['-extoff']
        },
        IE_10: {
            base: 'IE',
            'x-ua-compatible': 'IE=EmulateIE10',
            flags: ['-extoff']
        },
        IE_11: {
            base: 'IE',
            flags: ['-extoff']
        },
        Safari_Stable: {
            base: 'Safari'
        },
        Chrome_Stable: {
            base: 'Chrome'
        },
        Firefox_Stable: {
            base: 'Firefox'
        }
    };

    const ciLauncher = launchers[process.env.TARGET_BROWSER];

    const customLaunchers = ciLauncher ? {target_browser: ciLauncher} : {
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

    const MobileSafari = function(baseBrowserDecorator) {
        if(process.platform !== "darwin"){
            log.error("This launcher only works in MacOS.");
            this._process.kill();
            return;
        }
        baseBrowserDecorator(this);
        this.on = (event) => {
            console.log('got event', event)
            console.log('starting with url 2 ', url);
            simctl.getDevices().then(devices => {
                console.log('devices: ', devices);
                const d = devices['11.4'].find(d => {
                    return d.name === 'iPhone 8 Plus';
                });

                console.log('found: ', d);
                return iosSimulator.getSimulator(d.udid).then(device => {
                    console.log('device', device);
                    return device.waitForBoot(120 * 1000).then(d => {
                        console.log('booted, d');
                        return device.openUrl(url);
                    });
                });
            }).catch(e => {
                console.log('err,', e);
            });
        };
        this._start = function(url) {
            console.log('starting with url ', url);
            simctl.getDevices().then(devices => {
                console.log('devices: ', devices);
                const d = devices['11.4'].find(d => {
                    return d.name === 'iPhone 8 Plus';
                });

                console.log('found: ', d);
                return iosSimulator.getSimulator(d.udid).then(device => {
                    console.log('device', device);
                    return device.waitForBoot(120 * 1000).then(d => {
                        console.log('booted, d');
                        return device.openUrl(url);
                    });
                });
            }).catch(e => {
                console.log('err,', e);
            });

        };
    };

    MobileSafari.prototype = {
        name: 'MobileSafari',
        DEFAULT_CMD: {
            darwin: '/Applications/Xcode.app/Contents/Developer/Applications/Simulator.app/Contents/MacOS/Simulator',
        },
        ENV_CMD: null,
    };

    MobileSafari.$inject = ['baseBrowserDecorator'];

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'inline-mocha-fix'],

        // list of files / patterns to load in the browser
        files: [
            'build/testrunner.js',
            'build/RefTestRenderer.js',
            { pattern: './tests/**/*', 'watched': true, 'included': false, 'served': true},
            { pattern: './dist/**/*', 'watched': true, 'included': false, 'served': true},
            { pattern: './node_modules/**/*', 'watched': true, 'included': false, 'served': true},
        ],

        plugins: [
            'karma-*',
            {
                'framework:inline-mocha-fix': ['factory', injectTypedArrayPolyfills]
            },
            {
                'launcher:MobileSafari': ['type', MobileSafari]
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
        reporters: ['dots', 'junit'],

        junitReporter: {
            outputDir: 'tmp/junit/'
        },

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
