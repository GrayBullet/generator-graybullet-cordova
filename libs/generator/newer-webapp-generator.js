var path = require('path');
var fs = require('fs');
var Kicker = require('./kicker');
var ProjectFiles = require('../../app/projectFiles');
var FileModifier = require('../../app/fileModifier');

function NewerWebappGenerator(generator) {
  this._parent = generator;
}

NewerWebappGenerator.prototype.invoke = function () {
  var kicker = new Kicker('webapp');
  var parent = this._parent;

  return kicker.invoke(Kicker.currentArgs())
    .then(function () {

      var files = new ProjectFiles();

      files.loadPackageJson()
        .appendToDevDependencies('cordova', parent.projectOptions.version)
        .appendToDevDependencies('cordova-cli-lib', '^0.6.0')
        .commit();

      files.loadIndexHtml()
        .appendScript('cordova.js')
        .setMetas(getMetasFromIndexHtml()) // Copy meta informations.
        .commit();

      NewerWebappGenerator.modifyGulpfileJs(files)
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
    });
};

NewerWebappGenerator.modifyGulpfileJs = function (files, file) {
  return new GulpfileJs(file)
    .changeDistDirectory('cordova/www')
    .appendBaseDir('./fake')
    .registerRequire('', './gulp-cordova-tasks')
    .renameTask('build', 'buildweb')
    .appendCordovaTask('build', ['buildweb'], 'cordova:build')
    .appendCordovaTask('emulate', ['buildweb'], 'cordova:emulate')
    .appendCordovaTask('run', ['buildweb'], 'cordova:run');
};

function getMetasFromIndexHtml() {
  var regexp = '<meta name="([^"]*)" content="([^"]*)';
  var indexHtmlPath = path.join('cordova', 'www', 'index.html');

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
}

NewerWebappGenerator.prototype.getPlugins = function (plugins) {
  plugins.unshift({
    name: 'cordova-plugin-package',
    description: 'Cordova Package Plugin'
  });

  return plugins;
};

NewerWebappGenerator.prototype.getDefaultPlugins = function (selects) {
  selects.unshift('cordova-plugin-package');

  return selects;
};

NewerWebappGenerator.prototype.installDependencies = function () {
  var parent = this._parent;

  parent.npmInstall();
};

NewerWebappGenerator.prototype.writing = function () {
  this._parent.src.copy('gulp-cordova-tasks.js', 'gulp-cordova-tasks.js');
  this._parent.src.copy('_cordova-clirc', '.cordova-clirc');
};

function GulpfileJs(file) {
  this.modifier_ = new FileModifier(file || 'gulpfile.js');
}

GulpfileJs.prototype.commit = function () {
  this.modifier_.commit();
};

GulpfileJs.prototype.getData = function () {
  return this.modifier_.getData();
};

GulpfileJs.prototype.replace_ = function (regexp, replace) {
  this.modifier_.replace(regexp, replace);

  return this;
};

GulpfileJs.prototype.changeDistDirectory = function () {
  this.replace_(/gulp\.dest\('dist/g, 'gulp.dest(\'cordova/www');
  this.replace_(/gulp\.src\('dist/g, 'gulp.src(\'cordova/www');
  this.replace_(/del.bind\(null, \['\.tmp', 'dist']/, 'del.bind(null, [\'.tmp\', \'dist\', \'cordova/www\']');
  this.replace_(/baseDir: \[\'dist\'/, 'baseDir: [\'cordova/www\'');

  return this;
};

GulpfileJs.prototype.appendBaseDir = function () {
  this.replace_(/baseDir: \[(.*)]/g, 'baseDir: [$1, \'fake\']');

  return this;
};

GulpfileJs.prototype.registerRequire = function (variable, lib) {
  var line = '';
  if (variable) {
    line += 'const ' + variable + ' = ';
  } else {
    line += '\n';
  }
  line += 'require(\'' + lib + '\');';

  this.replace_(/require\('wiredep'\)\.stream;/, 'require(\'wiredep\').stream;\n' + line);

  return this;
};

GulpfileJs.prototype.renameTask = function () {
  this.replace_(/gulp.task\('build'/, 'gulp.task(\'buildweb\'');

  return this;
};

function makeArrayString(elements) {
  return '[' + elements
      .map(function (element) {
        return '\'' + element + '\'';
      })
      .join(', ') + ']';
}

GulpfileJs.prototype.appendCordovaTask = function (taskName, depends, startTask) {
  var task =
    'gulp.task(\'' + taskName + '\', ' + makeArrayString(depends) + ', () => {\n' +
    '  return gulp.start(\'' + startTask + '\');\n' +
    '});\n' +
    '\n';

  this.replace_(/(gulp.task\('default')/, task + '$1');

  return this;
};

module.exports = NewerWebappGenerator;
