'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['app/**/*.js', 'test/**/*.js']
    },

    'jasmine_node': {
      all: [
        'test/'
      ]
    }
  });

  grunt.registerTask('test', ['jasmine_node']);
};
