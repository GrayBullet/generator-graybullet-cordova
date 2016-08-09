'use strict';

var os = require('os');
var spawn = require('child_process').spawn;

/**
 * Run another Yeoman generator object.
 * @param {String} name generator name.
 */
function Kicker(name) {
  this.name_ = name;
}

/**
 * Invoke `yo generator`.
 * @param {Array} argv arguments. (Ex: ['--coffee', '--skip-install'])
 * @return {Promise.<Number>} return code.
 */
Kicker.prototype.invoke = function (argv) {
  var args = argv.slice();
  args.unshift(this.name_);

  return this.spawn_(Kicker.getYoCmd(), args);
};

Kicker.getYoCmd = function (optPlatform) {
  var platform = optPlatform || os.platform();

  return platform === 'win32' ? 'yo.cmd' : 'yo';
};

Kicker.prototype.spawn_ = function (command, argv) {
  var yo = spawn(command, argv, {
    env: process.env,
    stdio: 'inherit'
  });

  return new Promise(function (resolve, reject) {
    yo.on('close', function (code) {
      if (code) {
        reject(code);
      } else {
        resolve();
      }
    });
  });
};

Kicker.create = function (name) {
  return new Kicker(name);
};

Kicker.currentArgs = function (optArgv) {
  var argv = optArgv || process.argv;

  return argv.slice(3);
};

module.exports = Kicker;
