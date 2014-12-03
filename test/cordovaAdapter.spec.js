/* global describe, beforeEach, it, expect, spyOn */

'use strict';

var _ = require('underscore');

describe('CordovaAdapter', function () {
  var CordovaAdapter;
  var cordova;
  var executeArguments;
  var callbackArguments;

  beforeEach(function () {
    CordovaAdapter = require('../app/cordovaAdapter.js');
    cordova = new CordovaAdapter('cordova');

    executeArguments = [];
    callbackArguments = [];

    spyOn(cordova, 'execFile_')
      .andCallFake(function () { arguments[3].apply(null, callbackArguments); });
    spyOn(cordova, 'createProjectRoot');
  });

  describe('create', function () {
    it('Create project', function (done) {
      cordova.create('com.example.apps.sampleApp', 'SampleApp', function () {

        expect(cordova.createProjectRoot).toHaveBeenCalled();

        expect(_.initial(cordova.execFile_.mostRecentCall.args))
          .toEqual([
            'cordova',
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
        expect(_.initial(cordova.execFile_.mostRecentCall.args))
          .toEqual(['cordova', ['platform', 'add', 'android'], {cwd: 'cordova'}]);

        done();
      });
    });

    it('Add one platform', function (done) {
      cordova.addPlatforms(['ios'], function () {
        expect(_.initial(cordova.execFile_.mostRecentCall.args))
          .toEqual(['cordova',
                    ['platform', 'add', 'ios'],
                    {cwd: 'cordova'}]);

        done();
      });
    });

    it('Add two platforms', function (done) {
      cordova.addPlatforms(['android', 'ios'], function () {
        expect(_.initial(cordova.execFile_.mostRecentCall.args))
          .toEqual(['cordova',
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
        expect(_.initial(cordova.execFile_.mostRecentCall.args))
          .toEqual(['cordova', ['platform', 'list'], {cwd: 'cordova'}]);

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

    describe('searchPlugin', function () {
      it('Search plugins', function (done) {
        callbackArguments = [
          undefined,
          'org.apache.cordova.camera - Cordova Camera Plugin\n' +
            'org.apache.cordova.console - Cordova Console Plugin\n' +
            'org.apache.cordova.device - Cordova Device Plugin\n'
        ];

        cordova.searchPlugin(['org.apache.cordova'], function (plugins) {
          expect(_.initial(cordova.execFile_.mostRecentCall.args))
            .toEqual(['cordova', ['plugin', 'search', 'org.apache.cordova'], {cwd: 'cordova'}]);

          expect(plugins).toEqual([
            {name: 'org.apache.cordova.camera', description: 'Cordova Camera Plugin'},
            {name: 'org.apache.cordova.console', description: 'Cordova Console Plugin'},
            {name: 'org.apache.cordova.device', description: 'Cordova Device Plugin'}
          ]);

          done();
        });
      });
    });

    describe('addPlugin', function () {
      it('Add plugins', function (done) {
        var plugins = [
          'org.apache.cordova.camera',
          'org.apache.cordova.console',
          'org.apache.cordova.device'
        ];

        cordova.addPlugin(plugins, function () {
          expect(_.initial(cordova.execFile_.mostRecentCall.args))
          .toEqual([
            'cordova',
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

        cordova.getVersion(function (version) {
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
      it('Get cordova command for ' + platform , function () {
        expect(CordovaAdapter.getCordovaCommand(platform)).toEqual('cordova');
      });
    });
  });
});
