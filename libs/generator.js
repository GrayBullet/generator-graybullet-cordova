'use strict';

var Kicker = require('./generator/kicker');
var Legacy = require('./generator/legacy');

/**
 * Yeoman child generator.
 * @param {String} name Yeoman generator name.
 */
function Generator(name) {
  this._name = name;
}

/**
 * Invoke `yo {child}`.
 * @return {Promise} Promise.
 */
Generator.prototype.invoke = function () {
  var kicker = new Kicker(this._name);

  return kicker.invoke(Kicker.currentArgs());
};

Generator.create = function (name, generator) {
  if (name === 'legacy') {
    return new Legacy(generator);
  }

  return new Generator(name);
};

module.exports = Generator;
