'use strict';

var semver = require('semver');
var Kicker = require('./generator/kicker');
var Legacy = require('./generator/legacy');
var NewerWebappGenerator = require('./generator/newer-webapp-generator');

/**
 * Yeoman child generator.
 * @param {String} name Yeoman generator name.
 */
function Generator(name) {
  this._name = name;
}

// noinspection JSValidateJSDoc
/**
 * Invoke `yo {child}`.
 * @return {Promise} Promise.
 */
Generator.prototype.invoke = function () {
  var kicker = new Kicker(this._name);

  return kicker.invoke(Kicker.currentArgs());
};

Generator.create = function (name, version, generator) {
  if (name === 'legacy') {
    return new Legacy(generator);
  }

  if (name === 'webapp') {
    return semver.lt(version, '2.0.0') ?  new Legacy(generator) : new NewerWebappGenerator();
  }
  if (name === 'webapp' && semver.lt(version, '2.0.0')) {
    return new Legacy(generator);
  }

  if (name === 'angular' && semver.lt(version, '0.13.0')) {
    return new Legacy(generator);
  }

  return new Generator(name);
};

module.exports = Generator;
