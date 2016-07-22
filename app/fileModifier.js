'use strict';

var fs = require('fs');

/**
 * File modifier.
 * @constructor
 * @param {String} path target file path.
 */
var FileModifier = function (path) {
  this.data_ = fs.readFileSync(path, 'utf-8');
  this.path_ = path;
};

/**
 * Replace text.
 * @private
 * @param {RegExp} regexp RegExp object.
 * @param {String} replace replace text.
 * @return {FileModifier} this.
 */
FileModifier.prototype.replace = function (regexp, replace) {
  this.data_ = this.data_.replace(regexp, replace);

  return this;
};

/**
 * Save all changes.
 */
FileModifier.prototype.commit = function () {
  fs.writeFileSync(this.path_, this.data_, 'utf-8');
};

module.exports = FileModifier;
