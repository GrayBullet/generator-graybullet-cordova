#!/usr/bin/env node

'use strict';

var path = require('path');
var fs = require('fs');

var getPlatforms = function () {
  var env = process.env['CORDOVA_PLATFORMS']; // jshint ignore:line
  return env.split(',');
};

var platforms = getPlatforms();

if (platforms.some(function (platform) { return platform === 'android'; })) {
  var current = process.cwd();
  var androidPath = path.join(current, 'platforms', 'android');
  var resXmlPath = path.join(androidPath, 'res/xml');

  fs.writeFileSync(path.join(resXmlPath, '.gitkeep'), '', 'utf-8');
}
