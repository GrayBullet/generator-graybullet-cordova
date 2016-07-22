'use strict';

var fs = require('fs');
var path = require('path');
var execFile = require('child_process').execFile;
var execFileSync = require('child_process').execFileSync;

(function () {
  var parseAvailablePlatformResults = function (s) {
    // # lesser than 6.1.0
    // $ cordova platform list
    // Installed platforms: android 3.6.3, ios 3.6.3
    // Available platforms: amazon-fireos, blackberry10, browser, firefoxos, ubuntu
    //
    //   |
    //   V
    //
    // ['amazon-fireos', 'blackberry10', 'browser', 'firefoxos', 'ubuntu']

    // # greater or equal than 6.1.0
    // $ cordova platform list
    // Installed platforms:
    //   android 5.1.1
    // Available platforms:
    //   amazon-fireos ~3.6.3 (deprecated)
    //   blackberry10 ~3.8.0
    //   browser ~4.1.0
    //   firefoxos ~3.6.3
    //   ubuntu ~4.3.3
    //   webos ~3.7.0
    //
    //
    //   |
    //   V
    //
    // ['blackberry10', 'browser', 'firefoxos', 'ubuntu']
    //
    return s
      .replace('\r\n', '\n')
      .match(/Available platforms: ([\n\w, ~\\.()-]*)/)[1]
      .split(/[,\n]/)
      .filter(function (platform) {
        return !platform.match(/\(deprecated\)/);
      })
      .map(function (platform) {
        return platform.replace(/ ~.*/, '');
      })
      .map(function (platform) {
        return platform.trim();
      })
      .filter(function (platform) {
        return platform;
      });
  };

  var CordovaAdapter = function (projectRoot) {
    this.options = {};
    this.cordovaCommand_ = CordovaAdapter.getCordovaCommand();

    if (projectRoot) {
      this.options.projectRoot = projectRoot;
    }
  };

  CordovaAdapter.prototype.create = function (id, name, callback) {
    // Create project root directory.
    this.createProjectRoot();

    // Create cordova project.
    this.execute(['create', '.', id, name], callback);
  };

  CordovaAdapter.prototype.addPlatforms = function (platforms, callback) {
    var array = Array.isArray(platforms) ? platforms : [platforms];

    this.execute(['platform', 'add'].concat(array), callback);
  };

  CordovaAdapter.prototype.getAvailablePlatforms = function (callback) {
    this.execute(['platform', 'list'], function (error, stdout) {
      callback(parseAvailablePlatformResults(stdout));
    });
  };

  CordovaAdapter.prototype.searchPlugin = function (keywords, callback) {
    callback(require('./plugins.js').greaterorequal);
  };

  CordovaAdapter.prototype.addPlugin = function (plugins, callback) {
    this.execute(['plugin', 'add'].concat(plugins), callback);
  };

  CordovaAdapter.prototype.getVersion = function (callback) {
    this.execute(['--version'], function (error, stdout) {
      callback(stdout.trim());
    });
  };

  CordovaAdapter.prototype.getVersionSync = function () {
    return this.executeSync(['--version']).toString().trim();
  };

  CordovaAdapter.prototype.execute = function (args, callback) {
    this.execFile_(this.cordovaCommand_, args, this.getExecFileOptions(), callback);
  };

  CordovaAdapter.prototype.executeSync = function (args) {
    return this.execFileSync_(this.cordovaCommand_, args, this.getExecFileOptions());
  };

  CordovaAdapter.prototype.getExecFileOptions = function () {
    var options = {};

    if (this.options.projectRoot) {
      options.cwd = this.options.projectRoot;
    }

    return options;
  };

  CordovaAdapter.prototype.execFile_ = function (file, optArgs, optOptions, optCallback) {
    execFile(file, optArgs, optOptions, optCallback);
  };

  CordovaAdapter.prototype.execFileSync_ = function (file, optArgs, optOptions) {
    return execFileSync(file, optArgs, optOptions);
  };

  CordovaAdapter.prototype.createProjectRoot = function () {
    if (!fs.existsSync(this.options.projectRoot)) {
      fs.mkdirSync(this.options.projectRoot);
    }
  };

  CordovaAdapter.prototype.getMetasFromIndexHtml = function () {
    var regexp = '<meta name="([^"]*)" content="([^"]*)';
    var indexHtmlPath = path.join(this.options.projectRoot, 'www/index.html');

    // return [
    //   {name: 'viewport', content: '...'},
    //   {name: 'msapplication-tap-highlight', content: '...'},
    //   {name: 'format-detection', content: '...'}
    // ]
    return fs.readFileSync(indexHtmlPath, 'utf-8')
      .match(new RegExp(regexp, 'mg'))
      .map(function (line) {
        var result = line.match(new RegExp(regexp));
        return {
          name: result[1],
          content: result[2]
        };
      });
  };

  CordovaAdapter.getCordovaCommand = function (optPlatform) {
    var platform = optPlatform || process.platform;
    return platform === 'win32' ? 'cordova.cmd' : 'cordova';
  };

  CordovaAdapter.create = function (projectRoot) {
    var version = (new CordovaAdapter('.')).getVersionSync();
    var cordova = new CordovaAdapter(projectRoot);

    if (version.split('.')[0] < 6) {
      // for stop registry.cordova.io

      cordova.searchPlugin = function (keywords, callback) {
        callback(require('./plugins.js').lesserthan600);
      };
    }

    return cordova;
  };

  module.exports = CordovaAdapter;
})();
