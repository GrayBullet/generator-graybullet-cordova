'use strict';

var fs = require('fs');
var path = require('path');
var NewerWebappGenerator = require('../../../libs/generator/newer-webapp-generator');

describe('NewerWebappGenerator', function () {
  describe('modifyGuplfileJs', function () {
    it('Modify gulpfile.js.webapp.txt', function () {
      var result = NewerWebappGenerator.modifyGulpfileJs(undefined, path.join(__dirname, 'gulpfile.js.webapp.txt'))
        .getData();

      expect(result).toEqual(fs.readFileSync(path.join(__dirname, 'gulpfile.js.webapp.actual.txt'), 'utf8'));
    });
  });
});
