const gulp = require('gulp');
const cordova = require('cordova-cli-lib').gulp();

gulp.task('cordova:build', function () {
  return cordova.run('build');
});

gulp.task('cordova:emulate', function () {
  return cordova.run('emulate');
});

gulp.task('cordova:run', function () {
  return cordova.run('run');
});
