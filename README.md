# GrayBullet Cordova Web app generator
[Yeoman](http://yeoman.io) generator that scaffolds out a front-end Apache Cordova web app, Like [Webapp](https://github.com/yeoman/generator-webapp).


## Features
* Create Apache Cordova project with [web app](https://github.com/yeoman/generator-webapp)
* Include [grunt tasks for Apache Cordova](https://github.com/GrayBullet/grunt-cordova-ng)

For more information on what `generator-graybullet-cordova` can do for you, take look at then [generator-webapp](https://github.com/yeoman/generator-webapp) and [grunt-cordova-ng](https://github.com/GrayBullet/grunt-cordova-ng).


## Getting Started
* Install: npm install -g generator-graybullet-cordova cordova@4.0.0
* Run: yo graybullet-cordova
* Run `grunt` for building and `grunt serve` for PC browser preview.


### Build Apache Cordova app for generator-webapp@<2.0.0
* Debug build: `grunt build`
* Debug build (Android only): `grunt build --cordova-platforms=android`
* Release build: `grunt build --cordova-build=release`
* Run emulator: `grunt emulate`
* Run machine: `grunt run`

For more option, take look at then [grunt-cordova-ng](https://github.com/GrayBullet/grunt-cordova-ng).


### Build Apache Cordova app for generator-webapp@>=2.0.0
* Debug build: `gulp build`
* Run emulator: `gulp emulate`
* Run machine: `gulp run`


## Options for generator-webapp@<2.0.0
Please look at the [generator-webapps's Option section](https://github.com/yeoman/generator-webapp#options).


## Create AngularJS project
[Experimental] Create project with `--webapp=angular' option, [generator-angular](https://github.com/yeoman/generator-angular) project.

```
npm install -g generator-angular
yo graybullet-cordova --webapp=angular
```

## Supported
* Apache Cordova
  - 4.0.0
  - 4.1.2
  - 4.2.0
  - 4.3.0
  - 5.0.0
  - 5.1.1
  - 5.2.0
  - 5.3.3
  - 5.4.1
  - 6.2.0
  - 6.3.0
* generator-webapp
  - 0.5.1
  - 1.1.0
  - 2.1.0
* generator-angular
  - 0.12.1 (Experimental)

You must use cordova@5.4.1, if you use npm@3.


## License

[MIT License](LICENSE)
