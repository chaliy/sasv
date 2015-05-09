var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var robocopy = require('robocopy');

var report = function(err){
  gutil.log(
        gutil.colors.red('Browserify compile error:'),
        err.message
    );
    this.emit('end');
}

var vendorLibs = [
  'es6-shim',
  'react',
  'react-router',
  'react-bootstrap',
  'underscore',
  'griddle-react'
];

gulp.task('default', ['build']);

gulp.task('css', function () {
  return gulp
        .src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(concat('fx.css'))
        .pipe(gulp.dest('./public/stylesheets/'));

});

gulp.task('jsx', function () {

  return browserify('./client/app.js')
    .external(vendorLibs)
    .transform(reactify)
    .bundle()
    .on('error', report)
    .pipe(source('client.js'))
    .pipe(gulp.dest('./public/javascripts/'));

});

gulp.task('js', function () {

  browserify({
      require: vendorLibs,
      //exposeAll: true
      expose: vendorLibs
    })
    .bundle()
    .on('error', report)
    .pipe(source('fx.js'))
    .pipe(gulp.dest('./public/javascripts/'));

  return gulp
        .src(['node_modules/react/dist/react.min.js', 'node_modules/react-bootstrap/dist/react-bootstrap.min.js'])
        .pipe(concat('fx.js'))
        .pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('build', ['jsx', 'css', 'js']);

gulp.task('test', function () {
  return gulp.src('specs/**/*-spec.js')
      .pipe(jasmine());
});

gulp.task('dev', function () {
  gulp
    .watch('client/**/*.js', ['jsx', 'test']);
});
