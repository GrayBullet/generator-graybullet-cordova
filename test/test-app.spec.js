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
      run: function (callback) {
        helpers.run('generator-webapp')
          .inDir(path.join(os.tmpdir(), './temp-webapp/temp-test'))
          .withOptions({'skip-install': true})
          .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']])
          .withPrompt({features: ['includeBootstrap']})
          .on('end', callback);
      },

      copy: function () {
        var source = path.join(os.tmpdir(), './temp-webapp/temp-test');
        var destination = path.join(os.tmpdir(), './temp-test');

        util.copyRecursiveSync(source, destination);
      }
    };

    var target = {
      run: function (callback) {
        helpers.run(path.join(__dirname, '../app'))
          .inDir(path.join(os.tmpdir(), './temp-test'))
          .withOptions({'skip-install': true})
          .withPrompt({
            id: 'com.example.hogeApp',
            name: 'HogeApp'
          })
          .withGenerators([[function () { webapp.copy(); }, 'webapp:app']])
          .on('end', callback);
      }
    };

    webapp.run(target.run.bind(target, done));
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
