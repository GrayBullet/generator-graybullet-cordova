'use strict';

var semver = require('semver');

/**
 * Yeoman generator utility.
 * @param {Object} generator Yeoman generator.
 * @constructor
 */
var GeneratorUtil = function (generator) {
  this.generator = generator;
};

/**
 * Like Yeoman generator 'composeWith' function.
 * @param {string} namespace Yeoman generator name.
 * @param {object} options generator options.
 * @return {Object} new Yeoman generator with running.
 */
GeneratorUtil.prototype.composeWith = function (namespace, options) {
  return this.generator.env.create(namespace, options)
    .run();
};

/**
 * Get post filter factory with delegated generator.
 * @param {String} namespace Namespace.
 * @param {Function} callback Callback function.
 */
GeneratorUtil.prototype.getFilterFactory = function (namespace, callback) {
  var factoryName;
  if (namespace === 'webapp') {
    factoryName = 'webappFilterFactory';
  } else if (namespace === 'angular') {
    factoryName = 'angularFilterFactory';
  }

  var generator = this.generator;

  require('./generatorInfo.js').getInfo(namespace, function (info) {
    var filterVersion = '';
    if (info && info.namespace === 'webapp:app' &&
        semver.gte(info.version, '1.0.0')) {
      filterVersion = '.100';
    }

    var filterPath = './filters/' + factoryName + filterVersion + '.js';
    var FilterFactory = require(filterPath);
    var factory = new FilterFactory(generator);

    callback(factory);
  });
};

module.exports = GeneratorUtil;
