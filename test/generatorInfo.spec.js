/* global describe, beforeEach, it, expect */

'use strict';

describe('generatorInfo', function () {
  var generatorInfo;

  beforeEach(function () {
    generatorInfo = require('../app/generatorInfo.js');
  });

  describe('getGeneratorPath', function () {
    it('Get generator path.', function () {
      var result = generatorInfo.getGeneratorPath('/usr/lib/node_modules/generator-webapp/app/index.js');

      expect(result).toEqual('/usr/lib/node_modules/generator-webapp');
    });
  });
});
