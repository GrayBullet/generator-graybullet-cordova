/* global document, window */

/**
 *
 * Cordova fake library with running PC browser.
 * Fire deviceready event.
 */

(function () {
  'use strict';

  var fireDeviceReady = (function () {
    if (document.createEvent) {
      return function () {
        var e = document.createEvent('Event');
        e.initEvent('deviceready', false, false);
        document.dispatchEvent(e);
      };
    } else {
      return document.fireEvent('ondeviceready');
    }
  })();

  if (window.addEventListener) {
    window.addEventListener('load', fireDeviceReady, false);
  } else if (window.attachEvent) {
    window.attachEvent('onload', fireDeviceReady);
  } else {
    window.onload = fireDeviceReady;
  }

  window.device = {
    available: true,
    platform: 'Fake',
    version: '0.0',
    uuid: undefined,
    cordova: '0.0.0'
  };
})();
