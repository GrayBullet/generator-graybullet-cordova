'use strict';

var _ = require('underscore');

module.exports = function (testGeneratorName, webappGeneratorName, options, settings) {
  options = _.defaults(options, {'skipInstall': true});
  settings = _.defaults(settings || {}, {
    platforms: ['android'],
    plugins: ['org.apache.cordova.camera']
  });

  var webapp = require('./' + webappGeneratorName + 'Runner.js')(testGeneratorName, options);

  return require('./testTarget.js')(webapp, options, settings);
};
