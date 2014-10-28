'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');

module.exports = {
  copyRecursiveSync: function (source, destination) {
    var files = glob.sync('**/*', {cwd: source, dot: true});
    files.forEach(function (file) {
      var sourcePath = path.join(source, file);
      var destinationPath = path.join(destination, file);

      if (fs.statSync(sourcePath).isDirectory()) {
        // Copy directory.
        fs.mkdirSync(destinationPath);
      } else {
        // Copy file.
        var data = fs.readFileSync(sourcePath);
        fs.writeFileSync(destinationPath, data);
      }
    });
  },

  readPackageJson: function () {
    return JSON.parse(this.readText('package.json'));
  },

  readText: function (path) {
    return fs.readFileSync(path, 'utf-8');
  }
};
