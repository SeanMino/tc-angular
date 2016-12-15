'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');

var config = {
  app: require('./bower.json').appPath || 'app',
  dist: 'dist'
};

var paths = {
  scripts: [config.app + '/modules/**/*.js'],
  styles: [config.app + '/styles/*.css'],

  views: {
    main: config.app + '/index.html',
    files: [config.app + '/modules/**/*.html']
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

var styles = lazypipe()
  .pipe($.autoprefixer, 'last 1 version')
  .pipe(gulp.dest, '.tmp/styles');

///////////
// Tasks //
///////////

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(styles());
});

gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('clean:tmp', function (cb) {
  rimraf('./.tmp', cb);
});

gulp.task('start:client', ['start:server', 'styles'], function () {
  openURL('http://localhost:9000');
});

gulp.task('start:server', function() {
  $.connect.server({
    root: [config.app, '.'],
    livereload: true,
    // Change this to '0.0.0.0' to access the server from outside.
    port: 9000
  });
});


gulp.task('watch', function () {
  $.watch(paths.styles)
    .pipe($.plumber())
    .pipe(styles())
    .pipe($.connect.reload());

  $.watch(paths.views.files)
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe($.connect.reload());

  gulp.watch('bower.json', ['bower']);
});

gulp.task('serve', function (cb) {
  runSequence('clean:tmp',
    ['lint:scripts'],
    ['start:client'],
    'watch', cb);
});

gulp.task('serve:prod', function() {
  $.connect.server({
    root: [config.dist],
    livereload: true,
    port: 9000
  });
});



// inject bower components
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: './bower_components',
      ignorePath: '..'
    }))
  .pipe(gulp.dest(config.app));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('client:build', ['html', 'styles'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css',{ restore: true });
  var indexHtmlFilter = $.filter(['**/*','!**/*.html'], { restore: true });

  return gulp.src(paths.views.main)
    .pipe($.useref({searchPath: [config.app, '.tmp']}))
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss({cache: true}))
    .pipe(cssFilter.restore())
    .pipe(indexHtmlFilter)
    .pipe($.rev())
    .pipe(indexHtmlFilter.restore())
    .pipe($.revReplace())
    .pipe(gulp.dest(config.dist));
});

gulp.task('html', function () {
  return gulp.src(config.app + '/modules/**/*')
    .pipe(gulp.dest(config.dist + '/modules'));
});

gulp.task('images', function () {
  return gulp.src(config.app + '/images/**/*')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(config.dist + '/images'));
});

gulp.task('copy:extras', function () {
  return gulp.src([config.app + '/*/.*'])
    .pipe(gulp.dest(config.dist));
});

gulp.task('copy:fonts', function () {
  return gulp.src(config.app + '/fonts/**/*')
    .pipe(gulp.dest(config.dist + '/fonts'));
});

gulp.task('build', ['clean:dist'], function () {
  runSequence(['images', 'copy:extras', 'copy:fonts', 'client:build']);
});

gulp.task('default', ['build']);
