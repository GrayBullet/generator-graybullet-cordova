'use strict';

var fs = require('fs');
var execFile = require('child_process').execFile;

(function () {
  var parseAvailablePlatformResults = function (s) {
    // $ cordova platform list
    // Installed platforms: android 3.6.3, ios 3.6.3
    // Available platforms: amazon-fireos, blackberry10, browser, firefoxos, ubuntu
    //
    //   |
    //   V
    //
    // ['amazon-fireos', 'blackberry10', 'browser', 'firefoxos', 'ubuntu']

    return s
      .match(/Available platforms: ([\w, -]*)/)[1]
      .split(/,/)
      .map(function (platform) { return platform.trim(); });
  };

  var parsePluginResults = function (s) {
    // $ cordova plugin search org.apache.cordova
    // org.apache.cordova.battery-status - Cordova Battery Plugin
    // org.apache.cordova.camera - Cordova Camera Plugin
    // org.apache.cordova.console - Cordova Console Plugin
    // ...
    //
    //   |
    //   V
    //
    // [
    //   {name: 'org.apache.cordova.battery-status', description: 'Cordova Battery Plugin'},
    //   {name: 'org.apache.cordova.camera', description: 'Cordova Camera Plugin'},
    //   {name: 'org.apache.cordova.console', description: 'Cordova Console Plugin'},
    //   ...
    // ]

    return s
      .split(/\n/)
      .filter(function (line) { return line; })
      .map(function (line) {
        var data = line.split(' - ');
        return {name: data[0], description: data[1]};
      });
  };

  var CordovaAdapter = function (projectRoot) {
    this.options = {};

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

  CordovaAdapter.prototype.addPlatform = function (platform, callback) {
    this.execute(['platform', 'add', platform], callback);
  };

  CordovaAdapter.prototype.getAvailablePlatforms = function (callback) {
    this.execute(['platform', 'list'],  function (error, stdout) {
      callback(parseAvailablePlatformResults(stdout));
    });
  };

  CordovaAdapter.prototype.searchPlugin = function (keywords, callback) {
    this.execute(['plugin', 'search'].concat(keywords), function (error, stdout) {
      callback(parsePluginResults(stdout));
    });
  };

  CordovaAdapter.prototype.addPlugin = function (plugins, callback) {
    this.execute(['plugin', 'add'].concat(plugins), callback);
  };

  CordovaAdapter.prototype.execute = function (args, callback) {
    this.execFile_('cordova', args, this.getExecFileOptions(), callback);
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

  CordovaAdapter.prototype.createProjectRoot = function () {
    if (!fs.existsSync(this.options.projectRoot)) {
      fs.mkdirSync(this.options.projectRoot);
    }
  };

  module.exports = CordovaAdapter;
})();
