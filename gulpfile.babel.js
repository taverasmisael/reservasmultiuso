/**
 *
 *
 *  Misael Taveras Starter gulpfile.babel (ECMACS6)
 *        For help run `gulp help`
 * See More at: https://github.com/taverasmisael/Angular-MaterialDesign-Boilerplate
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

'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import gulpHelp from 'gulp-help';
import runSequence from 'run-sequence';

import del from 'del';
import wiredep from 'wiredep';
import opn from 'opn';

import config from './config';

// Browserify Stuffs
import { default as source } from 'vinyl-source-stream';
import { default as buffer } from 'vinyl-buffer';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';

/*jshint -W079 */
const $ = gulpLoadPlugins();
const WIREDEP = wiredep.stream;
// Use `GULP` for task with 2nd parameter as 'String' for `gulp help` command
// use `gulp` for any other gulp related calls.
const GULP = gulpHelp(gulp);

// Lint our JS code with ESLint'
GULP.task('lint', ()=>{
    return gulp.src(config.paths.scripts)
                .pipe($.eslint())
                .pipe($.eslint.format());
});

// Transform ES6 Scripts to normla ES5 And wathc the files
GULP.task('babelize:watch', 'Transform ES6 Scripts to normal ES5: watching', ()=> makeBundle(true))

// Transform ES6 Scripts to normla ES5
GULP.task('babelize', 'Transform ES6 Scripts to normla ES5', ()=>  makeBundle(false));

// Run JSHint on scripts and then babelize them
GULP.task('scripts', (cb)=> { return runSequence('lint', 'babelize', cb); });

// Compile Our Css
GULP.task('styles', `Compile all our '*.{sass,scss}' files`, ()=> {
  return gulp.src(config.paths.styles)
              .pipe($.plumber())
              .pipe($.sourcemaps.init())
              .pipe($.sass(config.options.styles))
              .pipe($.autoprefixer(config.options.autoprefixer))
              .pipe($.sourcemaps.write('.'))
              .pipe($.if('*.css', $.csso()))
              .pipe(gulp.dest(config.temp.styles))
              .pipe($.size({
                title: 'Styles'
              }))
              .pipe($.connect.reload());
});


// Bower Dependencies Injection
GULP.task('wiredep', `Inject Bower components to the 'index.html'`, ()=> {
  return gulp.src(config.index)
              .pipe(WIREDEP(config.options.wiredep))
              .pipe(gulp.dest(config.output.basedir))
              .pipe($.plumber())
              .pipe($.size({
                title: 'Wiredep'
              }));
});

// Reload Server on `*.html` changes
GULP.task('reload', `Reload Server on '*.html' change`, ()=> {
  return gulp.src(config.paths.html)
              .pipe($.plumber())
              .pipe($.connect.reload());
});

// Run our Server
GULP.task('serve', `Start our main HTTP server with Livereload`, ()=> {
  return $.connect.server(config.options.connect);
});

// Copy 'html' partials
GULP.task('partials', `Copy & Minify all Views and HTML partials`, ()=> {
  return gulp.src(config.paths.views)
              .pipe($.minifyHtml())
              .pipe($.size({
                title: 'Partials'
              }))
              .pipe(gulp.dest(config.output.views));
});

// Minify and Copy all Images
GULP.task('images', `Minify and Copy Images`, ()=> {
  return gulp.src(config.paths.images)
              //.pipe($.imagemin())
              .pipe($.size({
                title: 'Images'
              }))
              .pipe(gulp.dest(config.output.images))
              .pipe($.connect.reload());
});

// Clean output directory
GULP.task('clean', `Remove Files from 'dist'`, (cb)=> {
  return del(config.paths.clean, {dot: true}, cb)
          .then((paths)=>{
            if (paths.length) {
              console.log(`Deleted Files/folders (${paths.length}):\n ${paths.join('\n')}`);
            }
          });
});

GULP.task('open', `Simplies open http://localhost:${config.options.connect.port}`, () => opn(`http://localhost:${config.options.connect.port}`));

GULP.task('default', `runSequence('clean', 'styles', 'scripts', 'watch', 'serve', cb)`, (cb)=> {
   return runSequence('clean', 'styles', 'scripts', 'watch', 'reload', 'serve', 'open', cb);
});

// Watch All Files
GULP.task('watch', `Watch All Files and Run his Respective Task`, ()=> {
  gulp.watch(config.paths.styles ,['styles']);
  gulp.watch(config.paths.scripts ,['scripts']);
  gulp.watch(config.paths.html ,['reload']);
  gulp.watch(config.paths.bower ,['wiredep']);
});

function makeBundle (isWatching) {
    let browserifyBundler = browserify(config.options.browserify).transform(babelify);
    let watchifyBundler = watchify(browserifyBundler);
    let bundler = isWatching ? watchifyBundler : browserifyBundler;

    function rebundle () {
      console.log(`[${isWatching}]: Rebundleing ${config.output.build} \n`);
        return bundler.bundle()
                .on('error', err => {
                    if (err instanceof SyntaxError) {
                      $.util.log($.util.colors.red('Syntax Error'))
                      console.log(err.message);
                      console.log(err.filename+":"+err.loc.line);
                      console.log(err.codeFrame);
                      } else {
                        $.util.log($.util.colors.red('Error'), err.message);
                      }
                  })
                .pipe(source(config.output.build))
                .pipe(buffer())
                .pipe($.sourcemaps.init({loadMaps: true}))
                .pipe($.sourcemaps.write())
                .pipe(gulp.dest(config.temp.scripts))
                .pipe($.connect.reload())
                .pipe($.size({
                    title: 'Bundle'
                    }));
    }

    if (isWatching)  {
        bundler.on('update', rebundle);
    }

    rebundle();
}
