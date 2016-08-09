'use strict';

var os = require('os');
var Kicker = require('../../../libs/generator/kicker');

var yoCmd = os.platform() === 'win32' ? 'yo.cmd' : 'yo';

describe('Kicker', function () {
  describe('invoke', function () {
    it('Invoke `yo generator`', function (done) {
      var kicker = Kicker.create('hoge');
      var spawn_ = spyOn(kicker, 'spawn_').and.callFake(function () {
        return Promise.resolve(0);
      });

      kicker.invoke(['--coffee', '--skip-install'])
        .then(function () {
          expect(spawn_.calls.mostRecent().args).toEqual([
            yoCmd,
            ['hoge', '--coffee', '--skip-install']
          ]);
        })
        .then(done);
    });
  });

  describe('currentArgs', function () {
    it('Get current generator arguments', function () {
      var result = Kicker.currentArgs(['node', 'yo', 'webapp', '--coffee']);

      expect(result).toEqual(['--coffee']);
    });

    it('Get current generator arguments from empty arguments', function () {
      var result = Kicker.currentArgs(['node', 'yo', 'webapp']);

      expect(result).toEqual([]);
    });
  });

  describe('getYoCmd', function () {
    it('Command is `yo` if platform is linux', function () {
      var result = Kicker.getYoCmd('linux');

      expect(result).toEqual('yo');
    });

    it('Command is `yo` if platform is darwin', function () {
      var result = Kicker.getYoCmd('darwin');

      expect(result).toEqual('yo');
    });

    it('Command is `yo.cmd` if platform is win32', function () {
      var result = Kicker.getYoCmd('win32');

      expect(result).toEqual('yo.cmd');
    });
  });
});
