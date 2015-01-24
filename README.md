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


### Build Apache Cordova app
* Debug build: `grunt build`
* Debug build (Android only): `grunt build --cordova-platforms=android`
* Release build: `grunt build --cordova-build=release`
* Run emulator: `grunt emulate`
* Run machine: `grunt run`

For more option, take look at then [grunt-cordova-ng](https://github.com/GrayBullet/grunt-cordova-ng).


## Options
Please look at the [generator-webapps's Option section](https://github.com/yeoman/generator-webapp#options).


## Supported Apache Cordova
- 4.0.0
- 4.1.2
- 4.2.0


## License

[MIT License](LICENSE)
