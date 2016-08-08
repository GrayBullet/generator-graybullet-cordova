'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var cordova = require('./cordovaAdapter.js').create('cordova');
var _ = require('underscore');
var OptionBuilder = require('./optionBuilder.js');
var promptConfig = require('./promptConfig.js');
var Generator = require('../libs/generator');
var generatorInfo = require('./generatorInfo');

var projectBuilder = {
  create: _.bind(cordova.create, cordova),
  getAvailablePlatforms: function (callback) {
    return cordova.getAvailablePlatforms(callback);
  },
  addPlatforms: function (platforms, callback) {
    if (platforms && platforms.length > 0) {
      cordova.addPlatforms(platforms, callback);
    } else {
      callback();
    }
  },
  searchOfficialPlugins: function (callback) {
    return cordova.searchPlugin('org.apache.cordova', function (plugins) {
      callback(plugins);
    });
  },
  addPlugins: function (plugins, callback) {
    if (plugins && plugins.length > 0) {
      cordova.addPlugin(plugins, callback);
    } else {
      callback();
    }
  }
};

// noinspection JSUnusedGlobalSymbols
var GraybulletCordovaGenerator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.option('webapp', {
      defaults: 'webapp',
      type: String,
      desc: '[Experimental] Webapp yeoman generator ("webapp" or "angular")'
    });

    // Delegate options from generator-webapp.
    var delegated = this.env.create(this.options.webapp);
    this.optionBuilder = new OptionBuilder(this, delegated);
    this.optionBuilder.copyDelegatedDefines();
  },

  initializing: function () {
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
          default: 'HelloCordova'
        }, {
          name: 'id',
          message: 'What is the ID of Apache Cordova App?',
          default: 'io.cordova.hellocordova'
        }
      ];

      this.prompt(prompts, function (props) {
        this.projectOptions.name = props.name;
        this.projectOptions.id = props.id;

        done();
      }.bind(this));
    },

    /**
     * Create Apache Cordova project to 'cordova' directory.
     */
    createCordovaProject: function () {
      projectBuilder.create(this.projectOptions.id,
                            this.projectOptions.name,
                            this.async());
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

      projectBuilder.getAvailablePlatforms(prompt);
    },

    /**
     * Before add Cordova Platforms.
     */
    beforeAddPlatforms: function () {
      var path = require('path');
      var fs = require('fs');

      var source = path.join(this.sourceRoot(),
                             '_after_platform_add_android.js');
      var destination = path.join(this.destinationRoot(),
                                  'cordova/hooks/after_platform_add/after_platform_add_android.js');

      // copy file.
      fs.mkdirSync(path.dirname(destination));
      var data = fs.readFileSync(source);
      fs.writeFileSync(destination, data);

      // syncronize stats and modification times.
      var stats = fs.statSync(source);
      fs.chmodSync(destination, stats.mode);
      fs.utimesSync(destination, stats.atime, stats.mtime);
    },

    /**
     * Add Cordova Platforms to Apache Cordova Project.
     */
    addPlatforms: function () {
      projectBuilder.addPlatforms(this.projectOptions.platforms, this.async());
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

      projectBuilder.searchOfficialPlugins(prompt);
    },

    /**
     * Add plugins.
     */
    addPlugins: function () {
      projectBuilder.addPlugins(this.projectOptions.plugins, this.async());
    },

    /**
     * Get version.
     */
    getVersion: function () {
      var done = this.async();

      cordova.getVersion(function (version) {
        this.projectOptions.version = version;

        done();
      }.bind(this));
    },

    getWebapp: function () {
      var done = this.async();
      var options = this.options;
      var that = this;

      var name = options.webapp;
      generatorInfo.getInfo(name, function (info) {
        options.webappInfo = info;

        options.child = Generator.create(options.webapp, info.version, that);

        done();
      });
    },

    /**
     * Run generator-webapp or another.
     */
    createChildProject: function () {
      var done = this.async();

      var child = this.options.child;

      child.invoke().then(done);
    }
  },

  writing: function () {
    this.src.copy('_gitignore-cordova-external', 'cordova/.gitignore');
    this.src.copy('cordova.js', 'fake/cordova.js');
    this.src.copy('android_config', 'resources/android/config');
    this.src.copy('ios_config', 'resources/ios/config');
    this.src.copy('_cordova-clirc',('.cordova-clirc'));
    this.dest.write('cordova/www/.gitkeep', '');
  },

  installDependencies: function () {
    var options = this.options;
    var child =this.options.child;

    if (!options.skipInstall && child.installDependencies)
    {
      child.installDependencies();
    }
  }
});

module.exports = GraybulletCordovaGenerator;
