'use strict';

var ProjectFiles = require('../projectFiles.js');
var cordova = new (require('../cordovaAdapter.js'))('cordova');

/**
 * Create post filter factory with generator-webapp.
 * @constructor
 * @param {Object} generator generator.
 */
var WebappFilterFactory100 = function (generator) {
  this.generator = generator;
};

WebappFilterFactory100.prototype.name = 'webapp';

/**
 * Get post filter.
 * @return {Object} post filter.
 */
WebappFilterFactory100.prototype.getFilter = function () {
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
      .appendBaseDir('./fake')
      .registerTaskMap('cordova', 'grunt-cordova-ng')
      .renameTask('build', 'buildweb')
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

    files.loadMainJs()
      .appendToLast('$(document).on(\'deviceready\', function () {\n' +
                    '  \'use strict\';\n' +
                    '\n' +
                    '  console.log(\'deviceready\');\n' +
                    '});')
      .commit();

    files.loadGitIgnore()
      .replace(/^node_modules/, '/node_modules')
      .commit();
  };
};

module.exports = WebappFilterFactory100;
