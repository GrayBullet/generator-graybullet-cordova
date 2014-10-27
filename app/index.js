'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var cordova = new (require('./cordovaAdapter.js'))('cordova');

var GraybulletCordovaGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');

    this.projectOptions = {};
  },

  prompting: {
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

    createCordovaProject: function () {
      var done = this.async();

      cordova.create(this.projectOptions.id, this.projectOptions.name, done);
    },

    createWebappProject: function () {
      this.composeWith('webapp', {'skip-install': true});
    }
  },

  end: function () {
//    this.installDependencies();
  }
});

module.exports = GraybulletCordovaGenerator;
