/*global module:false*/
var _ =  require('lodash'), path = require('path');

module.exports = function(grunt) {

    var meta = {
        banner: '/*\n  <%= pkg.title || pkg.name %> <%= pkg.version %>' +
            '<%= pkg.homepage ? " <" + pkg.homepage + ">" : "" %>' + '\n' +
            '  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
            '\n\n  Released under <%= _.pluck(pkg.licenses, "type").join(", ") %> License\n*/\n',
        pre: '\n(function(window, document, undefined){\n\n',
        post: '\n})(window, document);'
    };

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        qunit: {
            files: ['tests/qunit/index.html']
        },
        concat: {
            dist: {
                src: [
                    'src/promise.js', 'src/fallback.js', 'src/*.js', 'src/renderers/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.js',
                options:{
                    banner: meta.banner + meta.pre,
                    footer: meta.post
                }
            },
            svg: {
                src: [
                    'src/fabric/dist/fabric.js'
                ],
                dest: 'dist/<%= pkg.name %>.svg.js',
                options:{
                    banner: meta.banner + '\n(function(window, document, exports, undefined){\n\n',
                    footer: '\n})(window, document, html2canvas);'
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
            cors: {
                options: {
                    port: 8081,
                    base: './',
                    keepalive: false,
                    middleware: function(connect, options, middlwares) {
                        return [
                            function(req, res, next) {
                                if (req.url !== '/tests/assets/image2.jpg') {
                                    next();
                                    return;
                                }
                                res.setHeader("Access-Control-Allow-Origin", "*");
                                res.end(require("fs").readFileSync('tests/assets/image2.jpg'));
                            },
                            connect.static(options.base[0])
                        ];
                    }
                }
            },
            ci: {
                options: {
                    port: 8080,
                    base: './',
                    keepalive: false
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
                src: ['<%= concat.dist.dest %>'],
                dest: 'dist/<%= pkg.name %>.min.js'
            },
            svg: {
                src: ['<%= concat.svg.dest %>'],
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
            all: ['src/*.js', 'src/renderers/*.js',  '!src/promise.js'],
            options: grunt.file.readJSON('./.jshintrc')
        },
        webdriver: {
            chrome: {
                browserName: "chrome",
                platform: "Windows 7",
                version: "34"
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
            safari6: {
                browserName: "safari",
                version: "6",
                platform: "OS X 10.8"
            },
            safari7:{
                browserName: "safari",
                platform: "OS X 10.9",
                version: "7"
            },
            chromeOSX:{
                browserName: "chrome",
                platform: "OS X 10.8",
                version: "34"
            }
        }
    });

    grunt.registerTask('webdriver', 'Browser render tests', function(browser, test) {
        var selenium = require("./tests/selenium.js");
        var done = this.async();
        var browsers = (browser) ? [grunt.config.get(this.name + "." + browser)] : _.values(grunt.config.get(this.name));
        selenium.tests(browsers, test).onValue(done);
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-execute');

    grunt.registerTask('server', ['connect:cors', 'connect']);
    grunt.registerTask('build', ['execute', 'concat', 'uglify']);
    grunt.registerTask('default', ['jshint', 'build', 'qunit']);
    grunt.registerTask('travis', ['jshint', 'build','qunit', 'connect:ci', 'connect:cors', 'webdriver']);

};
