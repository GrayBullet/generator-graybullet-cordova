'use strict';

var ProjectFiles = require('../projectFiles.js');
var cordova = new (require('../cordovaAdapter.js'))('cordova');

var AngularFilterFactory = function (generator) {
  this.generator = generator;
};

AngularFilterFactory.prototype.name = 'angular';

AngularFilterFactory.prototype.getFilter = function () {
  var generator = this.generator;

  return function () {
    var files = new ProjectFiles(this);
    files.loadPackageJson()
      .appendToDevDependencies('cordova', generator.projectOptions.version)
      .appendToDevDependencies('grunt-cordova-ng', '^0.2.0')
      .commit();

    files.loadGruntfileJs()
      .changeDistDirectory('cordova/www')
      .appendCordovaRoot('./cordova')
      .appendConnectRoot('./fake') // ToDo 追加されない
      .renameTask('build', 'buildweb') // ToDo Grunt serve で build -> buildweb がうまくいっていない
      .appendTask('cordova-build', ['cordova:package'])
      .appendTask('cordova-emulate', ['cordova:emulate'])
      .appendTask('cordova-run', ['cordova:run'])
      .appendTask('cordova-compile', ['cordova:compile'])
      .appendTask('cordova-prepare', ['cordova:prepare'])
      .appendTask('build', ['buildweb', 'cordova-build'])
      .appendTask('emulate', ['buildweb', 'cordova-emulate'])
      .appendTask('run', ['buildweb', 'cordova-run'])
      .appendTask('compile', ['buildweb', 'cordova-compile'])
      .appendTask('prepare', ['buildweb', 'cordova-prepare'])
      .commit();

    files.loadIndexHtml()
      .appendScript('cordova.js')
      .setMetas(cordova.getMetasFromIndexHtml()) // Copy meta informations.
      .commit();

    files.loadGitIgnore()
      .replace(/^node_modules/, '/node_modules')
      .commit();
  };
};

module.exports = AngularFilterFactory;
