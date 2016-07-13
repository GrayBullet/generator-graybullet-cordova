'use strict';

var _ = require('underscore');

module.exports = function (testGeneratorName,
                           webappGeneratorName,
                           options,
                           settings) {
  options = _.defaults(options, {skipInstall: true});
  settings = _.defaults(settings || {}, {
    platforms: ['android'],
    plugins: ['org.apache.cordova.camera']
  });

  var name = './' + webappGeneratorName + 'Runner.js';
  var webapp = require(name)(testGeneratorName, options);

  return require('./testTarget.js')(webapp, options, settings);
};
