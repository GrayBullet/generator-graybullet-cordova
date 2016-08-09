'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var environment = require('yeoman-environment').createEnv();

module.exports = {
  getInfo: function (namespace, callback) {
    var makeInfo = _.bind(function () {
      var meta = environment.getGeneratorsMeta()[namespace + ':app'];
      callback(this.makeInfo(meta));
    }, this);
    environment.lookup(makeInfo);
  },
  makeInfo: function (meta) {
    var info = _.clone(meta);

    info.path = this.getGeneratorPath(info.resolved);
    info.version = this.getVersion(info.path);

    return info;
  },
  getGeneratorPath: function (resolved) {
    var directories = path.normalize(resolved).split(path.sep);

    while (true) { // eslint-disable-line no-constant-condition
      var name = directories.pop();
      if (name.match(/^generator-.*/)) {
        directories.push(name);
        break;
      }
    }

    var generatorPath = path.join.apply(path, directories);
    if (!path.isAbsolute(generatorPath)) {
      generatorPath = path.sep + generatorPath;
    }
    return generatorPath;
  },
  getVersion: function (directory) {
    var packageJsonPath = path.join(directory, 'package.json');
    var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  }
};
