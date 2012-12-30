/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*\n  <%= pkg.title || pkg.name %> <%= pkg.version %>' +
      '<%= pkg.homepage ? " <" + pkg.homepage + ">\n" : "" %>' +
      '  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
      '\n\n  Released under <%= _.pluck(pkg.licenses, "type").join(", ") %> License\n*/',
      pre: '(function(window, document, undefined){',
      post: '})(window,document);'
    },
    lint: {
      files: ['build/<%= pkg.name %>.js']
    },
    qunit: {
      files: ['tests/qunit/index.html']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<banner:meta.pre>','src/*.js', 'src/renderers/Canvas.js', '<banner:meta.post>'],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
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
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
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

  // Default task.
  grunt.registerTask('default', 'concat lint qunit webdriver min');

};
