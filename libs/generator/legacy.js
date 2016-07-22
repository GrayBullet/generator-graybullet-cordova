'use strict';

var GeneratorUtil = require('../../app/generatorUtil');

/**
 * Legacy style Generator.
 * @param {Object} generator parent generator.
 */
function Legacy(generator) {
  this.generator_ = generator;
}

/**
 * Invoke `yo {child}`.
 * @return {Promise} Promise.
 */
Legacy.prototype.invoke = function () {
  return Promise.resolve()
    .then(this.getFilter.bind(this))
    .then(this.createWebappProject.bind(this));
};

Legacy.prototype.getFilter = function () {
  var generator = this.generator_;

  var util = new GeneratorUtil(generator);

  return new Promise(function (resolve) {
    util.getFilterFactory(generator.options.webapp, function (factory) {
      generator.filter = factory.getFilter();

      resolve();
    });
  });
};

Legacy.prototype.createWebappProject = function () {
  var generator = this.generator_;

  // Delegate options to generator-webapp.
  var options = generator.optionBuilder.getDelegatedValues();
  var util = new GeneratorUtil(generator);

  return new Promise(function (resolve) {
    // Run delegated webapp generator;
    util
      .composeWith(generator.options.webapp, {options: options})
      .on('end', function () {
        generator.filter();
        generator.installDependencies(options);

        resolve();
      });
  });
};

module.exports = Legacy;
