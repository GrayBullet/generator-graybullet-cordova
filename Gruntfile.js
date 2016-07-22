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

    jasmine_node: { // eslint-disable-line camelcase
      unit: ['test/'],
      integration: ['integration/']
    }
  });

  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', function () {
    var args = Array.prototype.slice.apply(arguments);
    args.unshift('jasmine_node');
    var name = args.join(':');

    grunt.task.run(name);
  });

  grunt.registerTask('fulltest', ['lint', 'test']);

  grunt.registerTask('default', ['fulltest']);
};
