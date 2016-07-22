'use strict';

var _ = require('underscore');

var pickup = function (list, targets, optConvert) {
  var convert = optConvert || function (item) {
    return item;
  };

  return targets
    .map(function (target) {
      return _.find(list, function (item) {
        return convert(item) === target;
      });
    })
    .filter(function (item) {
      return item;
    });
};

var reject = function (list, targets, optConvert) {
  var convert = optConvert || function (item) {
    return item;
  };

  return _.reject(list, function (item) {
    return _.contains(targets, convert(item));
  });
};

var createChoices = function (list, targets, optConvert) {
  var convert = optConvert || function (item) {
    return item;
  };

  var tops = pickup(list, targets, convert);
  var others = reject(list, targets, convert);

  return {
    tops: tops,
    others: others,
    all: tops.concat(others)
  };
};

module.exports = {
  getPlatforms: function (platforms, prompts) {
    var preferenties = ['ios', 'android'];

    var choices = createChoices(platforms, preferenties);
    // Linux case:
    // {
    //   tops: ['android'],
    //   others: ['amazon-fireos', 'blackbery10', 'browser', ...],
    //   all: [tops + others]
    // }
    //
    // OS X case:
    // {
    //   tops: ['ios', 'android'],
    //   others: ['ios', 'amazon-fireos', 'blackbery10', 'browser', ...],
    //   all: [tops + others]
    // }

    var temp = {
      type: 'checkbox',
      choices: choices.all.map(function (platform) {
        return {name: platform, value: platform};
      }),
      // Select first.
      default: choices.all.slice(0, 1)
    };

    return _.extend({}, prompts, temp);
  },

  getPlugins: function (plugins, prompts) {
    var preferenties = [
      'org.apache.cordova.console',
      'org.apache.cordova.device',
      'cordova-plugin-console',
      'cordova-plugin-device'
    ];

    var choices = createChoices(plugins,
                                preferenties,
                                function (item) {
                                  return item.name;
                                });
    // {
    //   tops: [
    //     {name: 'org.apache.cordova.console', description: '...'},
    //     {name: 'org.apache.cordova.device', description: '...'}
    //   ],
    //   others: [
    //     {name: 'org.apache.cordova.geolocation', description: '...'},
    //     {name: 'org.apache.cordova.camera', description: '...'}
    //     ...
    //   ],
    //   all: [tops + others]
    // }

    var temp = {
      type: 'checkbox',
      choices: choices.all.map(function (plugin) {
        return {name: plugin.description, value: plugin.name};
      }),
      default: _.pluck(choices.tops, 'name')
    };

    return _.extend({}, prompts, temp);
  }
};
