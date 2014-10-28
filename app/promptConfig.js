'use strict';

var _ = require('underscore');

module.exports = {
  getPlatforms: function (platforms, prompt) {
    var preferenties = ['ios', 'android'];

    // Linux: ['android'] # Android first.
    // OS X: ['iOS', 'android'] iOS and Android fisrt.
    var tops = preferenties.filter(_.contains.bind(_, platforms));

    // ['amazon-fireos', 'blackberry10', 'browser', ...]
    var others = _.reject(platforms, _.contains.bind(_, preferenties));

    var targets = tops.concat(others);

    var temp = {
      type: 'checkbox',
      choices: targets.map(function (platform) {
        return {name: platform, value: platform};
      }),
      // Select first.
      'default': targets.slice(0, 1)
    };

    return _.extend({}, prompt, temp);
  }
};
