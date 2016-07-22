'use strict';

var fs = require('fs');
var _ = require('underscore');
var FileModifier = require('./fileModifier.js');

/**
 * 'main.js' file builder.
 * @constructor
 * @param {String} filepath main.js file path.
 */
var MainJs = function (filepath) {
  this.modifier_ = new FileModifier(filepath || 'app/scripts/main.js');
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
 * @return {MainJs} this.
 */
MainJs.prototype.replace_ = function (regexp, replace) {
  this.modifier_.replace(regexp, replace);

  return this;
};

/**
 * Append script code to last.
 * @param {String} script script.
 * @return {MainJs} this.
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
 * @return {IndexHtml} this.
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
 * @return {IndexHtml} this.
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
 * @return {PackageJson} this.
 */
PackageJson.prototype.appendToDevDependencies = function (name, version) {
  this.data_.devDependencies[name] = version;

  return this;
};

/**
 * 'bower.json' file builder.
 * @constructor
 */
var BowerJson = function () {
  this.data_ = JSON.parse(fs.readFileSync('bower.json', 'utf-8'));
};

/**
 * Save all changes.
 */
BowerJson.prototype.commit = function () {
  fs.writeFileSync('bower.json', JSON.stringify(this.data_, null, '  '), 'utf-8');
};

/**
 * Append to devDependencies section.
 * @param {String} name Module name.
 * @param {String} version Module version.
 * @return {BowerJson} this.
 */
BowerJson.prototype.appendToDependencies = function (name, version) {
  this.data_.dependencies[name] = version;

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
 * @return {Object} this.
 */
GruntfileJs.prototype.replace_ = function (regexp, replace) {
  this.modifier_.replace(regexp, replace);

  return this;
};

/**
 * Change dist directory.
 * @param {String} directory New dist directory.
 * @return {Object} this.
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
 * Append cordova root settings.
 * @param {String} directory Apache Cordova project directory.
 * @return {Object} this.
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
 * @return {Object} this.
 * @desc connect.static(config.app),
 *       connect.static('./fake') // <- Add this line.
 */
GruntfileJs.prototype.appendConnectRoot = function (directory) {
  return this.replace_(/(connect\.static\(config\.app\))/g,
                       '$1,\n              connect.static(\'' + directory + '\')');
};

/**
 * Append baseDir.
 * @param {String} directory base directory.
 * @return {Gruntfilejs} this.
 */
GruntfileJs.prototype.appendBaseDir = function (directory) {
  return this.replace_(/(baseDir: \[)/,
                       '$1\'' + directory + '\', ');
};

/**
 * Register jit-grunt map.
 * @param {String} taskName task name.
 * @param {String} moduleName module name.
 * @return {Gruntfilejs} this.
 */
GruntfileJs.prototype.registerTaskMap = function (taskName, moduleName) {
  this.replace_(/( *)(useminPrepare: 'grunt-usemin')/,
                '$1$2,\n' +
                '$1' + taskName + ': \'' + moduleName + '\'');

  return this;
};

/**
 * Rename task.
 * @param {String} oldName Target task name.
 * @param {String} newName New task name.
 * @return {Gruntfilejs} this.
 */
GruntfileJs.prototype.renameTask = function (oldName, newName) {
  var registerTaskRegexp = new RegExp('registerTask\\(\'' + oldName + '\'');
  var runTaskRegexp = new RegExp('(task\\.run\\(\\[.*\')' + oldName + '\'');
  return this
    .replace_(registerTaskRegexp, 'registerTask(\'' + newName + '\'')
    .replace_(runTaskRegexp, '$1' + newName + '\'');
};

/**
 * Append task.
 * @param {String} name Adding task name.
 * @param {Array} tasks Child's tasks.
 * @desc grunt.registerTasks('cordova-build', ['cordova:build']); // <- Add this line.
 * @return {Gruntfilejs} this.
 */
GruntfileJs.prototype.appendTask = function (name, tasks) {
  var taskTexts = tasks
    .map(function (task) {
      return '\'' + task + '\'';
    })
    .join(', ');

  return this.replace_(/^(};)/m,
                       '\n  grunt.registerTask(\'' + name + '\', [' + taskTexts + ']);\n$1');
};

/**
 * '.gitignore' file builder.
 * @constructor
 */
var GitIgnore = function () {
  this.modifier_ = new FileModifier('.gitignore');
};

/**
 * Save all changes.
 */
GitIgnore.prototype.commit = function () {
  this.modifier_.commit();
};

/**
 * Replace text.
 * @private
 * @param {RegExp} regexp RegExp object.
 * @param {String} replace replace text.
 * @return {GitIgnore} this.
 */
GitIgnore.prototype.replace = function (regexp, replace) {
  this.modifier_.replace(regexp, replace);

  return this;
};

/**
 * Project files builder container.
 * @constructor
 */
var ProjectFiles = function () {};

/**
 * Load 'main.js' builder.
 * @param {String} filepath main.js file path.
 * @param {Object} overrides member object.
 * @return {GitIgnore} this.
 */
ProjectFiles.prototype.loadMainJs = function (filepath, overrides) {
  var modifier = new MainJs(filepath);
  return _.extend(modifier, overrides);
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
 * Load 'bower.json' builder.
 * @return {BowerJson} 'bower.json' builder.
 */
ProjectFiles.prototype.loadBowerJson = function () {
  return new BowerJson();
};

/**
 * Load 'Gruntfile.js' builder.
 * @param {Object} overrides member object.
 * @return {ProjectFiles} this.
 */
ProjectFiles.prototype.loadGruntfileJs = function (overrides) {
  var modifier = new GruntfileJs();
  return _.extend(modifier, overrides);
};

/**
 * Load '.gitignore' builder.
 * @return {GitIgnore} '.gitignore' builder.
 */
ProjectFiles.prototype.loadGitIgnore = function () {
  return new GitIgnore();
};

module.exports = ProjectFiles;
