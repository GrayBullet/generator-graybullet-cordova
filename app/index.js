'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var cordova = new (require('./cordovaAdapter.js'))('cordova');
var _ = require('underscore');
var OptionBuilder = require('./optionBuilder.js');
var promptConfig = require('./promptConfig.js');
var ProjectFiles = require('./projectFiles.js');

var GraybulletCordovaGenerator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    // Delegate options from generator-webapp.
    this.optionBuilder = new OptionBuilder(this, this.env.create('webapp'));
    this.optionBuilder.copyDelegatedDefines();
  },

  initializing: function () {
    this.pkg = require('../package.json');

    this.projectOptions = {};
  },

  prompting: {
    /**
     * Prompting project information.
     */
    promptingProject: function () {
      var done = this.async();

      this.log(yosay('Welcome to the Apache Cordova generator!'));

      var prompts = [
        {
          name: 'name',
          message: 'What is the name of Apache Cordova App?',
          'default': 'HelloCordova'
        }, {
          name: 'id',
          message: 'What is the ID of Apache Cordova App?',
          'default': 'io.cordova.hellocordova'
        }
      ];

      this.prompt(prompts, function (props) {
        this.projectOptions.name = props.appName;
        this.projectOptions.id = props.id;

        done();
      }.bind(this));
    },

    /**
     * Create Apache Cordova project to 'cordova' directory.
     */
    createCordovaProject: function () {
      var done = this.async();

      cordova.create(this.projectOptions.id, this.projectOptions.name, done);
    },

    /**
     * Prompting adding platforms.
     */
    promptingAddPlatforms: function () {
      var done = this.async();

      var prompt = function (platforms) {
        var prompts = [
          _.extend(promptConfig.getPlatforms(platforms), {
            name: 'platforms',
            message: 'What app of the platform to be created?'
          })
        ];

        this.prompt(prompts, function (props) {
          this.projectOptions.platforms = props.platforms;

          done();
        }.bind(this));
      }.bind(this);

      cordova.getAvailablePlatforms(prompt);
    },

    /**
     * Add Cordova Platforms to Apache Cordova Project.
     */
    addPlatforms: function () {
      if (this.projectOptions.platforms.length > 0) {
        var done = this.async();

        cordova.addPlatform(this.projectOptions.platforms, done);
      }
    },

    /**
     * Prompting adding plugins.
     */
    promptingAddPlugins: function () {
      var done = this.async();

      var prompt = function (plugins) {
        var prompts = [
          _.extend(promptConfig.getPlugins(plugins), {
            name: 'plugins',
            message: 'Are you sure you want to add any plugins?'
          })
        ];

        this.prompt(prompts, function (props) {
          this.projectOptions.plugins = props.plugins;

          done();
        }.bind(this));
      }.bind(this);

      cordova.searchPlugin('org.apache.cordova', prompt);
    },

    /**
     * Add plugins.
     */
    addPlugins: function () {
      var done = this.async();

      cordova.addPlugin(this.projectOptions.plugins, done);
    },

    /**
     * Run generator-webapp.
     */
    createWebappProject: function () {
      // Delegate options to generator-webapp.
      var options = this.optionBuilder.getDelegatedValues();

      var createReplaceFiles = function (generator) {
        var files = new ProjectFiles(generator);

        return function () {
          files.loadPackageJson()
            .appendToDevDependencies('cordova', '4.0.0')
            .appendToDevDependencies('grunt-cordova-ng', '^0.1.3')
            .commit();

          files.loadGruntfileJs()
            .changeDistDirectory('cordova/www')
            .appendLoadNpmTasks('grunt-cordova-ng')
            .appendCordovaRoot('./cordova')
            .appendConnectRoot('./fake')
            .renameTask('build', 'buildweb')
            .appendTask('cordova-build', ['cordova:build'])
            .appendTask('cordova-emulate', ['cordova:emulate'])
            .appendTask('cordova-run', ['cordova:run'])
            .appendTask('cordova-compile', ['cordova:compile'])
            .appendTask('cordova-prepare', ['cordova:prepare'])
            .appendTask('build', ['buildweb', 'cordova-build'])
            .appendTask('emulate', ['buildweb', 'cordova-emulate'])
            .appendTask('run', ['buildweb', 'cordova-run'])
            .appendTask('compile', ['buildweb', 'cordova-compile'])
            .appendTask('prepare', ['buildweb', 'cordova-prepare'])
            .commit();

          files.loadIndexHtml()
            .appendScript('cordova.js')
            .commit();
        };
      };

      var subGenerator = this.composeWith('webapp', {options: options});
      subGenerator.on('end', createReplaceFiles(subGenerator));
    }
  },

  writing: function () {
    this.dest.mkdir('fake');
    this.src.copy('cordova.js', 'fake/cordova.js');
  }
});

module.exports = GraybulletCordovaGenerator;
