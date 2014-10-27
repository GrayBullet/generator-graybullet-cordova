/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('graybullet-cordova:app', function () {
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

        var fs = require('fs');
        ['Gruntfile.js', 'bower.json', 'package.json', '.editorconfig', '.jshintrc'].forEach(function (name) {
          fs.createReadStream(path.join(source, name)).pipe(fs.createWriteStream(path.join(destination, name)));
        });
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
