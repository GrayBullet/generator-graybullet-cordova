'use strict';

var ProjectFiles = require('../projectFiles.js');
var cordova = new (require('../cordovaAdapter.js'))('cordova');

var gruntfileJs = {
  appendCordovaRoot: function (directory) {
    this.replace_(/(yeoman: appConfig,)/,
                  '$1\n' +
                  '\n' +
                  '    cordova: {\n' +
                  '      options: {\n' +
                  '        projectRoot: \'' + directory + '\'\n' +
                  '      }\n' +
                  '    },\n');

    return this;
  },
  appendConnectRoot: function (directory) {
    return this.replace_(/(connect\.static\(appConfig\.app\))/g,
                         '$1,\n              connect.static(\'' + directory + '\')');
  }
};

var mainJs = {
  appendModule: function (name) {
    return this.replace_(/(\.module[^\)]*)(\n  \])/, '$1,\n    \'' + name + '\'$2');
  }
};

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

    files.loadBowerJson()
      .appendToDependencies('ngCordova', '')
      .commit();

    files.loadGruntfileJs(gruntfileJs)
      .changeDistDirectory('cordova/www')
      .appendCordovaRoot('./cordova')
      .appendConnectRoot('./fake')
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

    files.loadMainJs('app/scripts/app.js', mainJs)
      .appendToLast('var deviceready = function () {\n' +
                    '  console.log(\'deviceready\');\n' +
                    '};\n' +
                    '\n' +
                    'if (document.addEventListener) {\n' +
                    '  document.addEventListener(\'deviceready\', deviceready, false);\n' +
                    '} else {\n' +
                    '  document.attachEvent(\'deviceready\', deviceready);\n' +
                    '}\n')
      .appendModule('ngCordova')
      .commit();

    files.loadGitIgnore()
      .replace(/^node_modules/, '/node_modules')
      .commit();
  };
};

module.exports = AngularFilterFactory;
