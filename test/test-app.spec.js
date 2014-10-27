/*global jasmine, describe, beforeEach, afterEach, it*/
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var util = require('./lib/util.js');

describe('graybullet-cordova:app', function () {
  var originalTimeout;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  beforeEach(function (done) {
    var webapp = {
      name: 'webapp:app',
      directory: path.join(os.tmpdir(), './temp-webapp/temp-test'),

      run: function (callback) {
        helpers.run('generator-webapp')
          .inDir(this.directory)
          .withOptions({'skip-install': true})
          .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']])
          .withPrompt({features: ['includeBootstrap']})
          .on('end', callback);
      },

      copy: function (destination) {
        util.copyRecursiveSync(this.directory, destination);
      }
    };

    var target = {
      subGenerator: undefined,

      run: function (callback) {
        this.subGenerator.run(this.run_.bind(this, callback));
      },

      run_: function (callback) {
        var directory = path.join(os.tmpdir(), './temp-test');

        var subGenerator = this.subGenerator;
        var dependencies = [
          [function () { subGenerator.copy(directory); }, subGenerator.name]
        ];

        helpers.run(path.join(__dirname, '../app'))
          .inDir(directory)
          .withOptions({'skip-install': true})
          .withPrompt({
            id: 'com.example.hogeApp',
            name: 'HogeApp'
          })
          .withGenerators(dependencies)
          .on('end', callback);
      }
    };

    target.subGenerator = webapp;
    target.run(done);
  });

  it('creates files', function () {
    assert.file([
      'bower.json',
      'package.json',
      '.editorconfig',
      '.jshintrc',
      'cordova/config.xml'
    ]);
  });
});
