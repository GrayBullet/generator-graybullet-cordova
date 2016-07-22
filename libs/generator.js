'use strict';

var Kicker = require('./generator/kicker');

/**
 * Yeoman child generator.
 * @param {String} name Yeoman generator name.
 */
function Generator(name) {
  this._name = name;
}

Generator.prototype.invoke = function () {
  var kicker = new Kicker(this._name);

  return kicker.invoke(Generator.getCurrentArgs());
};

Generator.create = function (name) {
  return new Generator(name);
};

Generator.getCurrentArgs = function() {
  throw new Error('Not Implement');
};

module.exports = Generator;
