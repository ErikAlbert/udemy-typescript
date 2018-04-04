var gulp = require('gulp');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var watchify = require('watchify');
var exorcist = require('exorcist');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var glob = require('glob');
var log = require('fancy-log');
var typescript = require('gulp-typescript');
var tsify = require("tsify");
var buffer = require("vinyl-buffer");
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var options = require('./package.json').options;

// Defining base paths
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

function build(bundle) {

    log('Compiling bundle...');
    bundle.bundle()
        .on('error', (err) => {
            browserSync.notify("Browserify Error!");
            this.emit("end");
            console.error(err)
        })
        .pipe(exorcist('./js/main.min.js.map'))
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

// gulp.task('lib', () => {
//     let b = browserify({
//         //debug: true,
//         entries: [basePaths.lib],
//         cache: {},
//         packageCache: {}
//     });
//     watchify.args.debug = true;
//     b = watchify(b.plugin(tsify).transform('babelify', {
//         presets: ['es2015'],
//         extensions: ['.js']
//     }), watchify.args)
//     b.on('update', () => buildBundle(b, 'lib.js'));

//     return buildBundle(b, 'lib.js')
// });

gulp.task('scripts', () => {
    let bundle = browserify({
        debug: true,
        entries: [basePaths.ts, basePaths.js],
        cache: {},
        packageCache: {}
    }).watchify(b.plugin(tsify).transform('babelify', {
        presets: ['es2015'],
        extensions: ['.js']
    })).on('update', () => buildBundle(b));

    return build(bundle);
});

gulp.task('browser-sync', function () {
    browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});

gulp.task('dev', ['scripts', 'browser-sync'], function () {
    //browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});