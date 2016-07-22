'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jasmine-node');

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

    'jasmine_node': {
      all: [
        'test/'
      ]
    }
  });

  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', ['jasmine_node']);

  grunt.registerTask('fulltest', ['lint', 'test']);

  grunt.registerTask('default', ['fulltest']);
};
