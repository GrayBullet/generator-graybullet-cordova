/* global jasmine, describe, beforeEach, afterEach, it, expect */
'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var _ = require('underscore');
var util = require('./lib/util.js');

var makeStubGenerator = function (testGeneratorName, options, settings) {
  options = _.defaults(options, {'skip-install': true});
  settings = _.defaults(settings || {}, {
    platforms: ['android'],
    plugins: ['org.apache.cordova.camera']
  });

  var webapp = {
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

  target.subGenerator = webapp;

  return target;
};

describe('graybullet-cordova:app', function () {
  var originalTimeout;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  describe('no options', function () {
    beforeEach(function (done) {
      makeStubGenerator('mocha:app').run(done);
    });

    it('Generate project', function (done) {
      // File created?
      (function () {
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
      })();

      // Valid .bowerrc created?
      (function () {
        assert.file('.bowerrc', /directory/);
      })();

      // Valid Gruntfile.js created?
      (function () {
        assert.fileContent('Gruntfile.js', /dist: 'cordova\/www'/);
        assert.fileContent('Gruntfile.js', /grunt.loadNpmTasks\('grunt-cordova-ng'\);/);
        assert.fileContent('Gruntfile.js', /cordova: \{\n\s+options: \{\n\s+projectRoot: '\.\/cordova'\n\s+\}\n\s+\}/);
        assert.fileContent('Gruntfile.js', /connect.static\('\.\/fake'\)/);
        assert.fileContent('Gruntfile.js', /grunt.registerTask\('buildweb'/);
        assert.fileContent('Gruntfile.js', /grunt.registerTask\('cordova-build', \['cordova:package\'\]\)/);
        assert.fileContent('Gruntfile.js', /grunt.registerTask\('cordova-emulate', \['cordova:emulate\'\]\)/);
        assert.fileContent('Gruntfile.js', /grunt.registerTask\('cordova-run', \['cordova:run\'\]\)/);
        assert.fileContent('Gruntfile.js', /grunt.registerTask\('cordova-compile', \['cordova:compile\'\]\)/);
        assert.fileContent('Gruntfile.js', /grunt.registerTask\('cordova-prepare', \['cordova:prepare\'\]\)/);
        assert.fileContent('Gruntfile.js', /grunt.registerTask\('build', \['buildweb\', \'cordova-build\'\]\)/);
        assert.fileContent('Gruntfile.js', /grunt.registerTask\('emulate', \['buildweb', 'cordova-emulate'\]\)/);
        assert.fileContent('Gruntfile.js', /grunt.registerTask\('run', \['buildweb', 'cordova-run'\]\)/);
        assert.fileContent('Gruntfile.js', /grunt.registerTask\('compile', \['buildweb', 'cordova-compile'\]\)/);
        assert.fileContent('Gruntfile.js', /grunt.registerTask\('prepare', \['buildweb', 'cordova-prepare'\]\)/);
      })();

      // Valid index.html created?
      (function () {
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
      })();

      // Valid main.js created?
      (function () {
        var content = new RegExp('\\$\\(document\\).on\\(\'deviceready\', function \\(\\) {\n' + // jshint ignore:line
                                 '  \'use strict\';\n' +
                                 '\n' +
                                 '  console.log\\(\'deviceready\'\\);\n\\}\\);'); // jshint ignore:line

        assert.fileContent('app/scripts/main.js', content);
      })();

      // Valid after_platform_add_android.js created?
      (function () {
        assert.fileContent('cordova/hooks/after_platform_add/after_platform_add_android.js', /\.gitkeep/);
      })();

      // Valid .gitignore created?
      (function () {
        assert.fileContent('.gitignore', /^\/node_modules/);
      })();

      // Valid package.json created?
      (function () {
        var packageJson = util.readPackageJson();
        var cordova = new (require('../app/cordovaAdapter.js'))('cordova');

        expect(packageJson.devDependencies['grunt-cordova-ng']).toEqual('^0.2.0');
        cordova.getVersion(function (version) {
          expect(packageJson.devDependencies.cordova).toEqual(version);
          done();
        });
      })();

      // resources/android/config and resources/ios/config copied?
      (function () {
        assert.fileContent('resources/android/config', /^#KEYSTORE=/m);
        assert.fileContent('resources/android/config', /^#KEYALIAS=/m);
        assert.fileContent('resources/ios/config', /^#CODE_SIGN_IDENTITY=/m);
        assert.fileContent('resources/ios/config', /^#MOBILEPROVISION=/m);
      })();
    });
  });

  describe('Cordova options', function () {
    it('no plugin', function (done) {
      makeStubGenerator('mocha:app', {}, {plugins: []}).run(done);
    });

    it('no platform', function  (done) {
      makeStubGenerator('mocha:app', {}, {platforms: []}).run(done);
    });
  });

  describe('--test-framework=jasmine', function () {
    beforeEach(function (done) {
      makeStubGenerator('jasmine:app', {'test-framework': 'jasmine'}).run(done);
    });

    it('Generate project with jasmine', function () {
      assert.fileContent('Gruntfile.js', /jasmine:/);
    });
  });
});
