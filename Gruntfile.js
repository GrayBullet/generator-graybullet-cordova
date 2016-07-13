'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jasmine-node');

  var config = {
    javascripts: [
      'app/**/*.js',
      'test/**/*.js'
    ]
  };

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: config.javascripts
    },

    jscs: {
      all: config.javascripts
    },

    eslint: {
      target: config.javascripts
    },

    jasmine_node: { // eslint-disable-line camelcase
      all: [
        'test/'
      ]
    }
  });

  grunt.registerTask('jscheck', ['jshint', 'jscs']);
  grunt.registerTask('test', ['jasmine_node']);

  grunt.registerTask('fulltest', ['jscheck', 'test']);

  grunt.registerTask('default', ['fulltest']);
};
