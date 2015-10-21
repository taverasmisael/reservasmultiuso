/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var wiredep = require('wiredep').stream;
// Server Things
var http = require('http'),
    st = require('st');

var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function() {
    return gulp.src(['app/scripts/**/*.js'])
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
        .pipe($.livereload());
});

// Compile and automatically prefix stylesheets
gulp.task('styles', function() {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src([
            'app/styles/**/*.scss',
            'app/styles/**/*.css',
            'app/styles/**/*.sass'
        ])
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.changed('app/styles', {
            extension: '.css'
        }))
        .pipe($.sass({
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS
        }))
        .pipe($.sourcemaps.write())
        .pipe($.if('*.css', $.csso()))
        .pipe(gulp.dest('app/styles'))
        .pipe($.size({
            title: 'styles'
        }))
        .pipe($.livereload());
});

// My Own Wiredep Task for Bower Options
gulp.task('wiredep', function() {
  gulp.src('./app/index.html')
      .pipe(wiredep({
          ignorePath: /^(\.\.\/)+/
      }))
      .pipe(gulp.dest('./app'))
      .pipe($.plumber())
      .pipe($.livereload());
});

gulp.task('inject', function (){
  var sources = gulp.src(['scripts/**/*.js', 'styles/**/*.css'], {read: false, cwd: './app'});
  return gulp.src('./app/index.html')
              .pipe($.plumber())
              .pipe($.inject(sources))
              .pipe(gulp.dest('./app'))
              .pipe($.livereload());
});

gulp.task('watch', function() {
    $.livereload.listen({basePath: 'app'});
    gulp.watch(['./app/styles/**/*.sass', './app/styles/**/*.scss'], ['styles']);
    gulp.watch(['./app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['./app/index.html', './app/templates/**/*.html'], ['views']);
});

gulp.task('views', function (){
  return gulp.src(['./app/index.html', './app/templates/**/*.html'])
          .pipe($.plumber())
          .pipe($.livereload());
});

gulp.task('server', function() {
  http.createServer(
    st({ path: __dirname + '/app', index: 'index.html', cache: false})
  ).listen(8080, function () {
    console.log('Serving files on localhost:8080');
  });
});

// Build dist folder minifying files
gulp.task('html', function (){
  var assets = $.useref.assets();
  return gulp.src('app/index.html')
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});


gulp.task('default', function(cb) {
    runSequence('styles', ['wiredep', 'inject', 'jshint'], 'watch', 'server', cb);
});

function cb (taskname) {
  console.log('Calling: ', taskname);
  gulp.start(taskname);
}
