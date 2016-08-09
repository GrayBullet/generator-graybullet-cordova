'use strict';

var os = require('os');
var _ = require('underscore');

var cordovaCmd = os.platform() === 'win32' ? 'cordova.cmd' : 'cordova';

describe('CordovaAdapter', function () {
  var CordovaAdapter;
  var cordova;

  var createProjectRoot;
  var execFile_;

  var callbackArguments;

  beforeEach(function () {
    CordovaAdapter = require('../app/cordovaAdapter.js');
    cordova = new CordovaAdapter('cordova');

    callbackArguments = [];

    execFile_ = spyOn(cordova, 'execFile_')
      .and.callFake(function () {
        arguments[3].apply(null, callbackArguments);
      });
    createProjectRoot = spyOn(cordova, 'createProjectRoot');
  });

  describe('create', function () {
    it('Create project', function (done) {
      cordova.create('com.example.apps.sampleApp', 'SampleApp', function () {
        expect(createProjectRoot).toHaveBeenCalled();

        expect(_.initial(execFile_.calls.mostRecent().args))
          .toEqual([
            cordovaCmd,
            ['create', '.', 'com.example.apps.sampleApp', 'SampleApp'],
            {cwd: 'cordova'}
          ]);

        done();
      });
    });
  });

  describe('addPlatforms', function () {
    it('Add single platform', function (done) {
      cordova.addPlatforms('android', function () {
        expect(_.initial(cordova.execFile_.calls.mostRecent().args))
          .toEqual([cordovaCmd, ['platform', 'add', 'android'], {cwd: 'cordova'}]);

        done();
      });
    });

    it('Add one platform', function (done) {
      cordova.addPlatforms(['ios'], function () {
        expect(_.initial(cordova.execFile_.calls.mostRecent().args))
          .toEqual([cordovaCmd,
                    ['platform', 'add', 'ios'],
                    {cwd: 'cordova'}]);

        done();
      });
    });

    it('Add two platforms', function (done) {
      cordova.addPlatforms(['android', 'ios'], function () {
        expect(_.initial(cordova.execFile_.calls.mostRecent().args))
          .toEqual([cordovaCmd,
                    ['platform', 'add', 'android', 'ios'],
                    {cwd: 'cordova'}]);

        done();
      });
    });
  });

  describe('getAvailablePlatforms', function () {
    it('Get available platforms', function (done) {
      callbackArguments = [
        undefined,
        'Installed platforms: android 3.6.3, ios 3.6.3\n' +
          'Available platforms: amazon-fireos, blackberry10, browser, firefoxos, ubuntu'
      ];

      cordova.getAvailablePlatforms(function (platforms) {
        expect(_.initial(cordova.execFile_.calls.mostRecent().args))
          .toEqual([cordovaCmd, ['platform', 'list'], {cwd: 'cordova'}]);

        expect(platforms).toEqual([
          'amazon-fireos',
          'blackberry10',
          'browser',
          'firefoxos',
          'ubuntu'
        ]);

        done();
      });
    });

    it('Get available platforms (greater than cordova@6.1.0)', function (done) {
      callbackArguments = [
        undefined,
        'Installed platforms: android 3.6.3, ios 3.6.3\n' +
          'Available platforms: \n' +
          '  amazon-fireos ~3.6.3 (deprecated)\n' +
          '  blackberry10 ~3.8.0\n' +
          '  browser ~4.1.0\n' +
          '  firefoxos ~3.6.3\n' +
          '  ubuntu ~ 3.7.0'
      ];

      cordova.getAvailablePlatforms(function (platforms) {
        expect(_.initial(cordova.execFile_.calls.mostRecent().args))
          .toEqual([cordovaCmd, ['platform', 'list'], {cwd: 'cordova'}]);

        expect(platforms).toEqual([
          'blackberry10',
          'browser',
          'firefoxos',
          'ubuntu'
        ]);

        done();
      });
    });

    describe('addPlugin', function () {
      it('Add plugins', function (done) {
        var plugins = [
          'org.apache.cordova.camera',
          'org.apache.cordova.console',
          'org.apache.cordova.device'
        ];

        cordova.addPlugin(plugins, function () { // eslint-disable-line max-nested-callbacks
          expect(_.initial(cordova.execFile_.calls.mostRecent().args))
          .toEqual([
            cordovaCmd,
            [
              'plugin',
              'add',
              'org.apache.cordova.camera',
              'org.apache.cordova.console',
              'org.apache.cordova.device'
            ],
            {cwd: 'cordova'}
          ]);

          done();
        });
      });
    });

    describe('getVersion', function () {
      it('Get version', function (done) {
        callbackArguments = [
          undefined,
          '4.1.2\n'
        ];

        cordova.getVersion(function (version) { // eslint-disable-line max-nested-callbacks
          expect(version).toEqual('4.1.2');
          done();
        });
      });
    });
  });

  describe('getCordovaCommand', function () {
    it('Get cordova command for Windows.', function () {
      expect(CordovaAdapter.getCordovaCommand('win32')).toEqual('cordova.cmd');
    });

    ['linux', 'darwin', 'unknown'].forEach(function (platform) {
      it('Get cordova command for ' + platform, function () {
        expect(CordovaAdapter.getCordovaCommand(platform)).toEqual('cordova');
      });
    });
  });
});
