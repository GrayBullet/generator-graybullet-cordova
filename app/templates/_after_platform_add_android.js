#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var platform = process.env['CORDOVA_PLATFORMS']; // jshint ignore:line

if (platform === 'android') {
  var current = process.cwd();
  var androidPath = path.join(current, 'platforms', platform);
  var resXmlPath = path.join(androidPath, 'res/xml');

  fs.writeFileSync(path.join(resXmlPath, '.gitkeep'), '', 'utf-8');
}
