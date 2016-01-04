'use strict';
const AUTOPREFIXER_BROWSERS = [
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

let config = {
    index: './app/index.html',
    paths: {
        bower: ['./bower.json', './.bowerrc'],
        clean: ['.tmp', 'dist/*', '!dist/.git'],
        html: ['./app/index.html', './app/templates/**/*.html'],
        images: ['./app/images/'],
        scripts: ['./app/scripts/**/*.js'],
        styles: ['./app/styles/**/*.{sass,scss}'],
        views: ['./app/templates/**/*.html']
    },
    folders: {
        sass: './app/styles'
    },
    options: {
        autoprefixer: {
            browsers: AUTOPREFIXER_BROWSERS
        },
        connect: {
            root: './app/',
            livereload: true,
            fallback: './app/index.html'
        },
        inject: {
            read: false,
            cwd: './app'
        },
        wiredep: {
            ignorePath: /^(\.\.\/)+/
        }
    },
    output: {
        basedir: './app',
        images: './dist/images/',
        styles: './app/styles/',
        views: './dist/views/'
    }
};

export default config;
