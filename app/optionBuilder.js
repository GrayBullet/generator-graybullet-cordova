'use strict';

var _ = require('underscore');

/**
 * Delegated option builder of Yeoman generator.
 * @constructor
 * @param {Generator} current Current running Yeoman generator.
 * @param {Generator} base Delegated Yeoman generator.
 */
var OptionBuilder = function (current, base) {
  this.current = current;
  this.base = base;

  this.delegatedDefines = _.chain(this.base._options)
    .omit(_.keys(this.current._options))
    .value();
};

/**
 * Get delegated option defines from base Yeoman generator.
 * @return {object} Yeoman generator option defines object.
 */
OptionBuilder.prototype.getDelegatedDefines = function () {
  return this.delegatedDefines;
};

/**
 * Copy delegated option defines from base Yeoman generator
 * to current Yeoman generator.
 */
OptionBuilder.prototype.copyDelegatedDefines = function () {
  // Set options from generator-webapp.
  _.each(this.getDelegatedDefines(), function (value, key) {
    this.current.option(key, value);
  }, this);
};

/**
 * Get delegated option values from current Yeoman generator.
 * @return {object} Yeoman generator option values object.
 */
OptionBuilder.prototype.getDelegatedValues = function () {
  var args = [
    'skip-install',
    'skip-install-message',
    'skip-welcome-message',
    'skipInstall',
    'skipInstallMessage',
    'skipWelcomeMessage'
  ];

  var optionNames = _.chain(this.getDelegatedDefines())
    .keys()
    .concat(args)
    .value();

  return _.chain(this.current.options).pick(optionNames).value();
};

module.exports = OptionBuilder;
