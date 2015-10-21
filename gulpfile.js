/**
 *
 *
 *  Misael Taveras Starter GULPFILE (ECMACS5)
 *
 *  Based on (With several Modifications):
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


/**
 * For Help Run `gulp help`
 */
'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp-help')(require('gulp'));
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var del = require('del');
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
gulp.task('jshint', 'Lints All Js with "JSHINT"', function() {
    return gulp.src(['app/scripts/**/*.js'])
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
        .pipe($.livereload());
});

// Compile and automatically prefix stylesheets
gulp.task('styles','Compile all .sass, .scss files' , function() {
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
gulp.task('wiredep', 'Load Bower components to "index.html"', function() {
  gulp.src('./app/index.html')
      .pipe(wiredep({
          ignorePath: /^(\.\.\/)+/
      }))
      .pipe(gulp.dest('./app'))
      .pipe($.plumber())
      .pipe($.livereload());
});

gulp.task('inject', 'Injects your files into your "index.html"', function (){
  var sources = gulp.src(['scripts/**/*.js', 'styles/**/*.css'], {read: false, cwd: './app'});
  return gulp.src('./app/index.html')
              .pipe($.plumber())
              .pipe($.inject(sources))
              .pipe(gulp.dest('./app'))
              .pipe($.livereload());
});

gulp.task('watch', 'Watch your files and do his tasks with livereload', function() {
    $.livereload.listen({basePath: 'app'});
    gulp.watch(['./app/styles/**/*.sass', './app/styles/**/*.scss'], ['styles']);
    gulp.watch(['./app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['./app/index.html', './app/templates/**/*.html'], ['views']);
});

gulp.task('views', 'Reload server on "*.html" change', function (){
  return gulp.src(['./app/index.html', './app/templates/**/*.html'])
          .pipe($.plumber())
          .pipe($.livereload());
});

gulp.task('server', 'Start a HTTP server with livereload on "./app"', function() {
  http.createServer(
    st({ path: __dirname + '/app', index: 'index.html', cache: false})
  ).listen(8080, function () {
    console.log('Serving files on localhost:8080');
  });
});

// Clean output directory
gulp.task('clean', 'Remove Files from "dist". Prepare for production', function (cb){
    del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}, cb).then(function (paths) {
      if (paths.length) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
        } else {
          console.log('Nothing to see here');
        }
    });
});

gulp.task('concatify', 'Concatenate and minify files in "app". Prepare for production', function (){
  var assets = $.useref.assets();
  return gulp.src('app/index.html')
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});


// Build dist folder minifying files
gulp.task('production', 'Creates Dist folder with minified files ready to production' , ['clean', 'concatify']);


// Default Task
gulp.task('default', 'runSequence("styles", ["wiredep", "inject", "jshint"], "watch", "server", cb)' , function(cb) {
    runSequence('styles', ['wiredep', 'inject', 'jshint'], 'watch', 'server', cb);
});
