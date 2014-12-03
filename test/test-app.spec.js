/* global jasmine, describe, beforeEach, afterEach, it, expect */
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var _ = require('underscore');
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
          .withPrompt({
            features: ['includeBootstrap']
          })
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
            name: 'HogeApp',
            platforms: ['android'],
            plugins: ['org.apache.cordova.camera']
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
      'cordova/config.xml',
      'cordova/platforms/android/AndroidManifest.xml',
      'cordova/plugins/org.apache.cordova.camera/plugin.xml',
      'cordova/.gitignore',
      'cordova/www/.gitkeep',
      'fake/cordova.js'
    ]);
  });

  it('create bowerrc', function () {
    assert.file('.bowerrc', /directory/);
  });

  it('validate package.json', function () {
    var packageJson = util.readPackageJson();

    expect(packageJson.devDependencies.cordova).toEqual('4.0.0');
    expect(packageJson.devDependencies['grunt-cordova-ng']).toEqual('^0.1.3');
  });

  it('validate Gruntfile.js', function () {
    assert.fileContent('Gruntfile.js', /dist: 'cordova\/www'/);
    assert.fileContent('Gruntfile.js', /grunt.loadNpmTasks\('grunt-cordova-ng'\);/);
    assert.fileContent('Gruntfile.js', /cordova: \{\n\s+options: \{\n\s+projectRoot: '\.\/cordova'\n\s+\}\n\s+\}/);
    assert.fileContent('Gruntfile.js', /connect.static\('\.\/fake'\)/);
    assert.fileContent('Gruntfile.js', /grunt.registerTask\('buildweb'/);
    assert.fileContent('Gruntfile.js', /grunt.registerTask\('cordova-build', \['cordova:build\'\]\)/);
    assert.fileContent('Gruntfile.js', /grunt.registerTask\('cordova-emulate', \['cordova:emulate\'\]\)/);
    assert.fileContent('Gruntfile.js', /grunt.registerTask\('cordova-run', \['cordova:run\'\]\)/);
    assert.fileContent('Gruntfile.js', /grunt.registerTask\('cordova-compile', \['cordova:compile\'\]\)/);
    assert.fileContent('Gruntfile.js', /grunt.registerTask\('cordova-prepare', \['cordova:prepare\'\]\)/);
    assert.fileContent('Gruntfile.js', /grunt.registerTask\('build', \['buildweb\', \'cordova-build\'\]\)/);
    assert.fileContent('Gruntfile.js', /grunt.registerTask\('emulate', \['buildweb', 'cordova-emulate'\]\)/);
    assert.fileContent('Gruntfile.js', /grunt.registerTask\('run', \['buildweb', 'cordova-run'\]\)/);
    assert.fileContent('Gruntfile.js', /grunt.registerTask\('compile', \['buildweb', 'cordova-compile'\]\)/);
    assert.fileContent('Gruntfile.js', /grunt.registerTask\('prepare', \['buildweb', 'cordova-prepare'\]\)/);
  });

  it('validate index.html', function () {
    var viewport = _.chain({
      'user-scalable': 'no',
      'initial-scale': 1,
      'maximum-scale': 1,
      'minimum-scale': 1,
      'width': 'device-width',
      'height': 'device-height',
      'target-densitydpi': 'device-dpi'
    })
      .pairs()
      .map(function (pair) { return pair[0] + '=' + pair[1]; })
      .value()
      .join(', ');

    var viewportActual = new RegExp('<meta name="viewport" content="' + viewport + '">');

    assert.fileContent('app/index.html', /<script src="cordova.js"><\/script>\n\s*<\/body>/);
    assert.noFileContent('app/index.html', /<meta name="viewport" content="width=device-width">/);
    assert.fileContent('app/index.html', viewportActual);
    assert.fileContent('app/index.html', /<meta name="format-detection" content="telephone=no">/);
    assert.fileContent('app/index.html', /<meta name="msapplication-tap-highlight" content="no">/);
  });

  it('validate main.js', function () {
    var content = new RegExp('\\$\\(document\\).on\\(\'deviceready\', function \\(\\) {\n' + // jshint ignore:line
                             '  \'use strict\';\n' +
                             '\n' +
                             '  console.log\\(\'deviceready\'\\);\n\\}\\);'); // jshint ignore:line

    assert.fileContent('app/scripts/main.js', content);
  });

  it('validate after_platform_add_android.js', function () {
    assert.fileContent('cordova/hooks/after_platform_add/after_platform_add_android.js', /\.gitkeep/);
  });

  it('validate .gitignore', function () {
    assert.fileContent('.gitignore', /^\/node_modules/);
  });
});
