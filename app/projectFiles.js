'use strict';

var fs = require('fs');
var _ = require('underscore');
var FileModifier = require('./fileModifier.js');

/**
 * 'main.js' file builder.
 * @constructor
 */
var MainJs = function () {
  this.modifier_ = new FileModifier('app/scripts/main.js');
};

/**
 * Save all changes.
 */
MainJs.prototype.commit = function () {
  this.modifier_.commit();
};

/**
 * Replace text.
 * @private
 * @param {RegExp} regexp RegExp object.
 * @param {String} replace replace text.
 * @param {Object} return this.
 */
MainJs.prototype.replace_ = function (regexp, replace) {
  this.modifier_.replace(regexp, replace);

  return this;
};

/**
 * Append script code to last.
 * @param {String} script script.
 */
MainJs.prototype.appendToLast = function (script) {
  return this.replace_(/(\n?)$/, '\n\n' + script + '$1');
};

/**
 * 'index.html' file builder.
 * @constructor
 */
var IndexHtml = function () {
  this.modifier_ = new FileModifier('app/index.html');
};

/**
 * Save all changes.
 */
IndexHtml.prototype.commit = function () {
  this.modifier_.commit();
};

/**
 * Replace text.
 * @private
 * @param {RegExp} regexp RegExp object.
 * @param {String} replace replace text.
 * @param {Object} return this.
 */
IndexHtml.prototype.replace_ = function (regexp, replace) {
  this.modifier_.replace(regexp, replace);

  return this;
};

/**
 * Append <script> element before </body>.
 * @param {String} path Script path.
 * @desc   <script src="hoge.js"></script> <!-- Add this line. -->
 *       </body>
 */
IndexHtml.prototype.appendScript = function (path) {
  return this.replace_(/^(\s*<\/body>)/m, '\n    <script src="' + path + '"></script>\n$1');
};

IndexHtml.prototype.setMeta = function (name, content) {
  // Remove old meta element.
  this.replace_(new RegExp('(^|\n)\\s*<meta\\s+name="' + name + '"[^\n]*'), '');

  // Add new meta element.
  return this.replace_(/(<\/title>\n)/, '$1    <meta name="' + name + '" content="' + content + '">\n');
};

IndexHtml.prototype.setMetas = function (metas) {
  _.chain(metas)
    .reverse()
    .forEach(function (meta) {
      this.setMeta(meta.name, meta.content);
    }, this);

  return this;
};

/**
 * 'package.json' file builder.
 * @constructor
 */
var PackageJson = function () {
  this.data_ = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
};

/**
 * Save all changes.
 */
PackageJson.prototype.commit = function () {
  fs.writeFileSync('package.json', JSON.stringify(this.data_, null, '  '), 'utf-8');
};

/**
 * Append to devDependencies section.
 * @param {String} name Module name.
 * @param {String} version Module version.
 */
PackageJson.prototype.appendToDevDependencies = function (name, version) {
  this.data_.devDependencies[name] = version;

  return this;
};

/**
 * 'Gruntfile.js' file builder.
 * @Constructor
 */
var GruntfileJs = function () {
  this.modifier_ = new FileModifier('Gruntfile.js');
};

/**
 * Save all changes.
 */
GruntfileJs.prototype.commit = function () {
  this.modifier_.commit();
};

/**
 * Replace text.
 * @private
 * @param {RegExp} regexp RegExp object.
 * @param {String} replace replace text.
 * @return {Object} returnt this.
 */
GruntfileJs.prototype.replace_ = function (regexp, replace) {
  this.modifier_.replace(regexp, replace);

  return this;
};

/**
 * Change dist directory.
 * @param {String} directory New dist directory.
 * @return {Object} return this.
 * @desc var config = {
 *         app: 'app',
 *         dist: 'dist' // <- Change this.
 *       }
 */
GruntfileJs.prototype.changeDistDirectory = function (directory) {
  return this.replace_(/dist: 'dist'/,
                       'dist: \'' + directory + '\'');
};

/**
 * Append LoadNpmTasks.
 * @param {String} name Npm tasks module name.
 * @return {Object} return this.
 * @desc grunt.loadNpmTasks('grunt-cordova-ng'); // <- Add this line.
 */
GruntfileJs.prototype.appendLoadNpmTasks = function (name) {
  return this.replace_(/(require\('load-grunt-tasks'\)\(grunt\);)/,
                       '$1\n  grunt.loadNpmTasks(\'' + name + '\');');
};

/**
 * Append cordova root settings.
 * @param {String} directory Apache Cordova project directory.
 * @return {Object} return this.
 * @desc grunt.initConfig({
 *         // ...
 *         cordova: { // <- Add this settings.
 *           options: {
 *             projectRoot: './cordova'
 *           }
 *        },
 */
GruntfileJs.prototype.appendCordovaRoot = function (directory) {
  return this.replace_(/(config: config,)/,
                       '$1\n' +
                       '\n' +
                       '    cordova: {\n' +
                       '      options: {\n' +
                       '        projectRoot: \'' + directory + '\'\n' +
                       '      }\n' +
                       '    },\n');
};

/**
 * Append connect root directory.
 * @param {String} directory Append connect root directory.
 * @return {Object} return this.
 * @desc connect.static(config.app),
 *       connect.static('./fake') // <- Add this line.
 */
GruntfileJs.prototype.appendConnectRoot = function (directory) {
  return this.replace_(/(connect\.static\(config\.app\))/g,
                       '$1,\n              connect.static(\'' + directory + '\')');
};

/**
 * Rename task.
 * @param {String} oldName Target task name.
 * @param {String} newName New task name.
 */
GruntfileJs.prototype.renameTask = function (oldName, newName) {
  var regexp = new RegExp('registerTask\\(\'' + oldName + '\'');
  return this.replace_(regexp,
                       'registerTask(\'' + newName + '\'');
};

/**
 * Append task.
 * @param {String} name Adding task name.
 * @param {Array} tasks Child's tasks.
 * @desc grunt.registerTasks('cordova-build', ['cordova:build']); // <- Add this line.
 */
GruntfileJs.prototype.appendTask = function (name, tasks) {
  var taskTexts = tasks
    .map(function (task) { return '\'' + task + '\''; })
    .join(', ');

  return this.replace_(/^(};)/m,
                       '\n  grunt.registerTask(\'' + name + '\', [' + taskTexts + ']);\n$1');
};

/**
 * Project files builder container.
 * @constructor
 */
var ProjectFiles = function () {};

/**
 * Load 'main.js' builder.
 * @return {MainJs} 'index.html' builder.
 */
ProjectFiles.prototype.loadMainJs = function () {
  return new MainJs();
};

/**
 * Load 'index.html' builder.
 * @return {IndexHtml} 'index.html' builder.
 */
ProjectFiles.prototype.loadIndexHtml = function () {
  return new IndexHtml();
};

/**
 * Load 'package.json' builder.
 * @return {PackageJson} 'package.json' builder.
 */
ProjectFiles.prototype.loadPackageJson = function () {
  return new PackageJson();
};

/**
 * Load 'Gruntfile.js' builder.
 * @return {GruntfileJs} 'Gruntfile.js' builder.
 */
ProjectFiles.prototype.loadGruntfileJs = function () {
  return new GruntfileJs();
};

module.exports = ProjectFiles;
