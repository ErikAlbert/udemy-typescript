var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require("vinyl-buffer");
var gulpif = require('gulp-if');
var glob = require('glob');
var log = require('fancy-log');
var browserify = require('browserify');
var watchify = require('watchify');
var tsify = require("tsify");
var babelify = require('babelify');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var options = require('./package.json').options;


var basePaths = {
    node: './node_modules/',
    src: './src/',
    sass: './dev/sass/**/*.scss',
    sass_src: './src/**/**/*.scss',
    lib: './dev/ts/vendor/lib.ts',
    ts: glob.sync('./dev/ts/*.ts'),
    js: glob.sync('./dev/js/*.js'),
    js_src: glob.sync('./src/**/**/*.js'),
};

// browser-sync watched files
// automatically reloads the page when files changed
var browserSyncWatchFiles = [
    './css/**/*.css',
    './js/**/*.js',
    './*.html'
];

// browser-sync options
// see: https://www.browsersync.io/docs/options/
var browserSyncOptions = {
    proxy: "localhost/github/udemy-typescript/",
    notify: true
};

var bundleOpts = {
    debug: true,
    entries: [basePaths.ts, basePaths.js],
    cache: {},
    packageCache: {}
};

function buildBundle(bundle) {

    log('Compiling bundle...');

    bundle.bundle()
        .on('error', () => log.error.bind(log, 'Browserify Error'))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulpif(options.sourcemaps, sourcemaps.init({
            loadMaps: true
        })))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulpif(options.sourcemaps, sourcemaps.write(undefined, {
            sourceRoot: null
        })))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream({
            once: true
        }));
}

gulp.task('scripts', () => {
    let bundle = browserify(bundleOpts, watchify.args);
    bundle = watchify(bundle.plugin(tsify).transform('babelify', {
        presets: ['es2015'],
        extensions: ['.js']
    }));
    bundle.on('update', () => buildBundle(bundle));
    bundle.on('log', () => log.info);

    return buildBundle(bundle);
});

gulp.task('browser-sync', function () {
    browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});

gulp.task('dev', ['scripts', 'browser-sync']);