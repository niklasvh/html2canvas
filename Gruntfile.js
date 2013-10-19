/*global module:false*/
module.exports = function(grunt) {

  var meta = {
    banner: '/*\n  <%= pkg.title || pkg.name %> <%= pkg.version %>' +
      '<%= pkg.homepage ? " <" + pkg.homepage + ">" : "" %>' + '\n' +
      '  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
      '\n\n  Released under <%= _.pluck(pkg.licenses, "type").join(", ") %> License\n*/',
    pre: '\n(function(window, document, undefined){\n\n',
    post: '\n})(window,document);'
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
          'src/Core.js',
          'src/Font.js',
          'src/Generate.js',
          'src/Queue.js',
          'src/Parse.js',
          'src/Preload.js',
          'src/Renderer.js',
          'src/Support.js',
          'src/Util.js',
          'src/renderers/Canvas.js'
        ],
        dest: 'build/<%= pkg.name %>.js'
      },
      options:{
        banner: meta.banner + meta.pre,
        footer: meta.post
      }
    },
    uglify: {
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: 'build/<%= pkg.name %>.min.js'
      },
      options: {
        banner: meta.banner
      }
    },
    watch: {
      files: '<%= lint.files %>',
      tasks: 'jshint qunit'
    },
    jshint: {
      all: ['<%= concat.dist.dest %>'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      }
    }
  });

  var selenium = require("./tests/selenium.js");
  grunt.registerTask('webdriver', 'Browser render tests', function(arg1) {

    var done = this.async();

    if (arguments.length === 0) {
      selenium.tests();
    } else {
      selenium[arg1].apply(null, arguments);
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  // Default task.
  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('default', ['jshint', 'concat', 'qunit', 'uglify', 'webdriver']);

};
