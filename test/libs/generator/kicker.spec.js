'use strict';

var Kicker = require('../../../libs/generator/kicker');

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
            'yo',
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
});
