'use strict';

function Kicker(name) {
}

Kicker.prototype.invoke = function (argv) {
  throw new Error('Not Implement');
};

Kicker.create = function (name) {
  return new Kicker();
};

module.exports = Kicker;
