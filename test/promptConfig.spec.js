'use strict';

var promptConfig = require('../app/promptConfig.js');

describe('promptConfig', function () {
  describe('getPlatforms', function () {
    it('Get platforms (running on Linux)', function () {
      var result = promptConfig.getPlatforms([
        'amazon-fireos',
        'android',
        'blackberry10',
        'browser'
      ]);

      expect(result).toEqual({ // eslint-disable-line quote-props
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
      var result = promptConfig.getPlatforms([
        'amazon-fireos',
        'android',
        'blackberry10',
        'browser',
        'ios'
      ]);

      expect(result).toEqual({ // eslint-disable-line quote-props
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

  describe('getPlugins', function () {
    it('Get plugins', function () {
      /* eslint-disable max-len */
      var result = promptConfig.getPlugins([
        {name: 'org.apache.cordova.geolocation', description: 'Cordova Geolocation Plugin'},
        {name: 'org.apache.cordova.camera', description: 'Cordova Camera Plugin'},
        {name: 'org.apache.cordova.device', description: 'Cordova Device Plugin'},
        {name: 'org.apache.cordova.console', description: 'Cordova Console Plugin'}
      ]);

      expect(result).toEqual({ // eslint-disable-line quote-props
        type: 'checkbox',
        choices: [
          {name: 'Cordova Console Plugin', value: 'org.apache.cordova.console'},
          {name: 'Cordova Device Plugin', value: 'org.apache.cordova.device'},
          {name: 'Cordova Geolocation Plugin', value: 'org.apache.cordova.geolocation'},
          {name: 'Cordova Camera Plugin', value: 'org.apache.cordova.camera'}
        ],
        'default': [
          'org.apache.cordova.console',
          'org.apache.cordova.device'
        ]
      });
      /* eslint-enable max-len */
    });
  });
});
