/* global describe, it, expect */

'use strict';

var promptConfig = require('../app/promptConfig.js');

describe('promptConfig', function () {
  describe('getPlatforms', function () {
    it('Get platforms (running on Linux)', function () {
      var result = promptConfig.getPlatforms(['amazon-fireos', 'android', 'blackberry10', 'browser']);

      expect(result).toEqual({
        type: 'checkbox',
        choices: [
          {name: 'android', value: 'android'},
          {name: 'amazon-fireos', value: 'amazon-fireos'},
          {name: 'blackberry10', value: 'blackberry10'},
          {name: 'browser', value: 'browser'}
        ],
        'default': ['android']
      });
    });

    it('Get platforms (running on OS X)', function () {
      var result = promptConfig.getPlatforms(['amazon-fireos', 'android', 'blackberry10', 'browser', 'ios']);

      expect(result).toEqual({
        type: 'checkbox',
        choices: [
          {name: 'ios', value: 'ios'},
          {name: 'android', value: 'android'},
          {name: 'amazon-fireos', value: 'amazon-fireos'},
          {name: 'blackberry10', value: 'blackberry10'},
          {name: 'browser', value: 'browser'}
        ],
        'default': ['ios']
      });
    });
  });
});
