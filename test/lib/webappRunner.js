'use strict';

var path = require('path');
var os = require('os');
var helpers = require('yeoman-generator').test;
var util = require('./util.js');

module.exports = function (testGeneratorName, options) {
  return {
    name: 'webapp:app',
    directory: path.join(os.tmpdir(), './temp-webapp/temp-test'),

    run: function (callback) {
      helpers.run('generator-webapp')
        .inDir(this.directory)
        .withOptions(options)
        .withGenerators([[helpers.createDummyGenerator(), testGeneratorName]])
        .withPrompt({
          features: ['includeBootstrap']
        })
        .on('end', callback);
    },

    copy: function (destination) {
      util.copyRecursiveSync(this.directory, destination);
    }
  };
};
