'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.initConfig({
    'jasmine_node': {
      all: [
        'test/'
      ]
    }
  });

  grunt.registerTask('test', ['jasmine_node']);
};
