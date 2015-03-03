'use strict';

var path = require('path');
var os = require('os');
var helpers = require('yeoman-generator').test;

module.exports = function (subGenerator, options, settings) {
  return {
    subGenerator: subGenerator,

    run: function (callback) {
      this.subGenerator.run(this.run_.bind(this, callback));
    },

    run_: function (callback) {
      var directory = path.join(os.tmpdir(), './temp-test');

      var subGenerator = this.subGenerator;
      var dependencies = [
        [function () { subGenerator.copy(directory); }, subGenerator.name]
      ];

      helpers.run(path.join(__dirname, '../../app'))
        .inDir(directory)
        .withOptions(options)
        .withPrompt({
          id: 'com.example.hogeApp',
          name: 'HogeApp',
          platforms: settings.platforms,
          plugins: settings.plugins
        })
        .withGenerators(dependencies)
        .on('end', callback);
    }
  };
};
