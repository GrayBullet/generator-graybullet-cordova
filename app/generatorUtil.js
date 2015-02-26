'use strict';

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
 * Get post filter factory with delegated generator
 * @return {Object} post filter.
 */
GeneratorUtil.prototype.getFilterFactory = function (namespace) {
  var factoryName;
  if (namespace === 'webapp') {
    factoryName = 'webappFilterFactory';
  } else if (namespace === 'angular') {
    factoryName = 'angularFilterFactory';
  }

  var FilterFactory = require('./filters/' + factoryName + '.js');

  return new FilterFactory(this.generator);
};

module.exports = GeneratorUtil;
