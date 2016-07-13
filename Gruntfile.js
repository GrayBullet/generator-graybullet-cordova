'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jasmine-node');

  var config = {
    javascripts: [
      'app/**/*.js',
      'test/**/*.js'
    ]
  };

  grunt.initConfig({
    eslint: {
      target: config.javascripts
    },

    jasmine_node: { // eslint-disable-line camelcase
      all: [
        'test/'
      ]
    }
  });

  grunt.registerTask('jscheck', ['eslint']);
  grunt.registerTask('test', ['jasmine_node']);

  grunt.registerTask('fulltest', ['jscheck', 'test']);

  grunt.registerTask('default', ['fulltest']);
};
