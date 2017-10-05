/*global module:false*/
var _ =  require('lodash'), path = require('path');
var proxy = require('html2canvas-proxy');

module.exports = function(grunt) {

    var meta = {
        banner: '/*\n  <%= pkg.title || pkg.name %> <%= pkg.version %>' +
            '<%= pkg.homepage ? " <" + pkg.homepage + ">" : "" %>' + '\n' +
            '  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
            '\n\n  Released under <%= _.pluck(pkg.licenses, "type").join(", ") %> License\n*/\n'
    };

    var browsers = {
        chrome: {
            browserName: "chrome",
            platform: "Windows 7",
            version: "39"
        },
        firefox: {
            browserName: "firefox",
            version: "15",
            platform: "Windows 7"
        },
        ie9: {
            browserName: "internet explorer",
            version: "9",
            platform: "Windows 7"
        },
        ie10: {
            browserName: "internet explorer",
            version: "10",
            platform: "Windows 8"
        },
        ie11: {
            browserName: "internet explorer",
            version: "11",
            platform: "Windows 8.1"
        },
        chromeOSX:{
            browserName: "chrome",
            platform: "OS X 10.8",
            version: "39"
        }
    };
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            dist: {
                src: ['src/core.js'],
                dest: 'dist/<%= pkg.name %>.js',
                options: {
                    browserifyOptions: {
                        standalone: 'html2canvas'
                    },
                    banner: meta.banner,
                    plugin: [
                        [ "browserify-derequire" ]
                    ]
                }
            },
            svg: {
                src: [
                    'src/fabric/dist/fabric.js'
                ],
                dest: 'dist/<%= pkg.name %>.svg.js',
                options:{
                    browserifyOptions: {
                        standalone: 'html2canvas.svg'
                    },
                    banner: meta.banner,
                    plugin: [
                        [ "browserify-derequire" ]
                    ]
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: './',
                    keepalive: true
                }
            },
            altServer: {
                options: {
                    port: 8083,
                    base: './'
                }
            },
            cors: {
                options: {
                    port: 8081,
                    base: './',
                    middleware:  function(connect, options) {
                        return [
                            function(req, res, next) {
                                if (req.url !== '/tests/assets/image2.jpg') {
                                    next();
                                    return;
                                }
                                res.setHeader("Access-Control-Allow-Origin", "*");
                                res.end(require("fs").readFileSync('tests/assets/image2.jpg'));
                            }
                        ];
                    }
                }
            },
            proxy: {
                options: {
                    port: 8082,
                    middleware:  function(connect, options) {
                        return [
                            function(req, res, next) {
                                res.jsonp = function(content) {
                                    res.end(req.query.callback +  "(" + JSON.stringify(content) + ")");
                                };
                                next();
                            },
                            proxy()
                        ];
                    }
                }
            },
            ci: {
                options: {
                    port: 8080,
                    base: './'
                }
            }
        },
        execute: {
            fabric: {
                options: {
                    args: ['modules=' + ['text','serialization',
                        'parser', 'gradient', 'pattern', 'shadow', 'freedrawing',
                        'image_filters', 'serialization'].join(","), 'no-es5-compat', 'dest=' + path.resolve(__dirname, 'src/fabric/dist/') + '/']
                },
                src: ['src/fabric/build.js']
            }
        },
        uglify: {
            dist: {
                src: ['<%= browserify.dist.dest %>'],
                dest: 'dist/<%= pkg.name %>.min.js'
            },
            svg: {
                src: ['<%= browserify.svg.dest %>'],
                dest: 'dist/<%= pkg.name %>.svg.min.js'
            },
            options: {
                banner: meta.banner
            }
        },
        watch: {
            files: ['src/**/*', '!src/fabric/**/*'],
            tasks: ['jshint', 'build']
        },
        jshint: {
            all: ['src/*.js', 'src/renderers/*.js'],
            options: grunt.file.readJSON('./.jshintrc')
        },
        mochacli: {
            options: {
                reporter: 'spec'
            },
            all: ['tests/node/*.js']
        },
        mocha_phantomjs: {
            all: ['tests/mocha/**/*.html']
        },
        mocha_webdriver: browsers,
        webdriver: browsers
    });

    grunt.registerTask('webdriver', 'Browser render tests', function(browser, test) {
        var selenium = require("./tests/selenium.js");
        var done = this.async();
        var browsers = (browser) ? [grunt.config.get(this.name + "." + browser)] : _.values(grunt.config.get(this.name));
        selenium.tests(browsers, test).catch(function() {
            done(false);
        }).finally(function() {
            console.log("Done");
            done();
        });
    });

    grunt.registerTask('mocha_webdriver', 'Browser mocha tests', function(browser, test) {
        var selenium = require("./tests/mocha/selenium.js");
        var done = this.async();
        var browsers = (browser) ? [grunt.config.get(this.name + "." + browser)] : _.values(grunt.config.get(this.name));
        selenium.tests(browsers, test).catch(function() {
            done(false);
        }).finally(function() {
            done();
        });
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-mocha-cli');

    grunt.registerTask('server', ['connect:cors', 'connect:proxy', 'connect:altServer', 'connect:server']);
    grunt.registerTask('build', ['execute', 'browserify', 'uglify']);
    grunt.registerTask('default', ['jshint', 'build', 'mochacli', 'connect:altServer', 'mocha_phantomjs']);
    grunt.registerTask('travis', ['jshint', 'build', 'connect:altServer', 'connect:ci', 'connect:proxy', 'connect:cors', 'mocha_phantomjs', 'webdriver']);

};
