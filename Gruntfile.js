'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jasmine-nodejs');

  var config = {
    javascripts: [
      'Gruntfile.js',
      'app/**/*.js',
      'test/**/*.js'
    ]
  };

  grunt.initConfig({
    eslint: {
      target: config.javascripts
    },

    jasmine_nodejs: { // eslint-disable-line camelcase
      unit: {
        specs: ['test/**']
      },
      integration: {
        specs: ['integration/']
      }
    }
  });

  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', function () {
    var args = Array.prototype.slice.apply(arguments);
    args.unshift('jasmine_nodejs');
    var name = args.join(':');

    grunt.task.run(name);
  });

  grunt.registerTask('fulltest', ['lint', 'test']);

  grunt.registerTask('default', ['fulltest']);
};
