/* global describe, beforeEach, it, expect */

'use strict';

describe('generatorInfo', function () {
  var generatorInfo;

  beforeEach(function () {
    generatorInfo = require('../app/generatorInfo.js');
  });

  describe('getGeneratorPath', function () {
    it('Get generator path.', function () {
      var indexPath = '/usr/lib/node_modules/generator-webapp/app/index.js';
      var result = generatorInfo.getGeneratorPath(indexPath);

      expect(result).toEqual('/usr/lib/node_modules/generator-webapp');
    });
  });
});
