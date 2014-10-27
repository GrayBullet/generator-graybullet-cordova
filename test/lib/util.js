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
        fs.createReadStream(sourcePath).pipe(fs.createWriteStream(destinationPath));
      }
    });
  }
};
