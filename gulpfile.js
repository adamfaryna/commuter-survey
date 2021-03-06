'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');
var _ = require('underscore');
var browserSync = require('browser-sync').create();
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var del = require('del');

var paths = {
  lint: ['*.js', './public/app/**/*.js'],
  less: './client/less/*.less',
  html_template: './client/index.html',
  html: 'index.html',
  bower: './public/bower_components',
  css: './public/css/style.css'
};

gulp.task('nodemon', function(cb) {
  var started = false;

  return $.nodemon({
    script: 'app.js'
  })
  .on('start', function() {
    // to avoid nodemon being started multiple times
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('lint', function() {
  return gulp.src(paths.lint)
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'));
});

// Compile less into CSS & auto-inject into browsers
gulp.task('less', function() {
  return gulp.src(paths.less)
    .pipe($.less())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream()); 
});

gulp.task('inject', function() {
  var inject_res = gulp.src(['./public/app/**/*.js', './public/css/**/*.css'], {read: false});

  return gulp.src('./public/index.html')
    .pipe($.inject(inject_res, { addRootSlash: false, read: false, relative: true }))
    .pipe(wiredep({
      src: './public/index.html',
      directory: './public/bower_components'
    }))
    .pipe(gulp.dest('./public'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['less', 'inject', 'nodemon'], function() {
    browserSync.init(null, {
      proxy: "http://localhost:" + process.env.PORT,
      files: ['public/**/*.*'],
      browser: ['firefox'],
      port: 5000
    });

    gulp.watch(paths.less, ['less']);
    gulp.watch([paths.html, './public/app/**/*']).on('change', browserSync.reload);
});

gulp.task('start', ['less'], function() {});

gulp.task('default', ['serve']);
