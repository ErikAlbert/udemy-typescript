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
        presets: ['env'],
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

gulp.task('copy-vendor', function () {

    ////////////////// All Bootstrap 4 Vendor Files /////////////////////////
    // Copy all Bootstrap JS files
    gulp.src(basePaths.node + 'bootstrap/dist/js/**/bootstrap.min.js')
        .pipe(gulp.dest(basePaths.src + '/js/bootstrap'));

    // Copy all Bootstrap SCSS files
    gulp.src(basePaths.node + 'bootstrap/scss/**/*.scss')
        .pipe(gulp.dest(basePaths.src + '/sass/bootstrap4'));
    ////////////////// End Bootstrap 4 Vendor Files /////////////////////////

    ////////////////// All Bourbon Assets /////////////////////////
    gulp.src(basePaths.node + 'bourbon/core/*.scss')
        .pipe(gulp.dest(basePaths.src + '/sass/bourbon'));

    gulp.src(basePaths.node + 'bourbon/core/bourbon/helpers/*.scss')
        .pipe(gulp.dest(basePaths.src + '/sass/bourbon/helpers'));

    gulp.src(basePaths.node + 'bourbon/core/bourbon/library/*.scss')
        .pipe(gulp.dest(basePaths.src + '/sass/bourbon/library'));

    gulp.src(basePaths.node + 'bourbon/core/bourbon/settings/*.scss')
        .pipe(gulp.dest(basePaths.src + '/sass/bourbon/settings'));

    gulp.src(basePaths.node + 'bourbon/core/bourbon/utilities/*.scss')
        .pipe(gulp.dest(basePaths.src + '/sass/bourbon/utilities'));

    gulp.src(basePaths.node + 'bourbon/core/bourbon/validators/*.scss')
        .pipe(gulp.dest(basePaths.src + '/sass/bourbon/validators'));

    ////////////////// End Bourbon Assets /////////////////////////

    // Copy all Font Awesome Fonts
    gulp.src(basePaths.node + 'font-awesome/fonts/**/*.{ttf,woff,woff2,eof,svg}')
        .pipe(gulp.dest('./fonts/fontawesome'));

    // Copy all Font Awesome SCSS files
    gulp.src(basePaths.node + 'font-awesome/scss/*.scss')
        .pipe(gulp.dest(basePaths.src + '/sass/fontawesome'));

    // Copy jQuery
    gulp.src(basePaths.node + 'jquery/dist/jquery.min.js')
        .pipe(gulp.dest(basePaths.src + '/js/jquery/'));

    gulp.src(basePaths.node + 'jquery-migrate/dist/jquery-migrate.min.js')
        .pipe(gulp.dest(basePaths.src + '/js/jquery/'));

    gulp.src(basePaths.node + 'jquery-validation/dist/**/*.js')
        .pipe(gulp.dest(basePaths.src + '/js/jquery/jquery-validation'));

    // Copy Tether JS files
    gulp.src(basePaths.node + 'tether/dist/js/tether.min.js')
        .pipe(gulp.dest(basePaths.src + '/js/bootstrap'));

    // Copy Popper JS files
    gulp.src(basePaths.node + 'popper.js/dist/umd/popper.min.js')
        .pipe(gulp.dest(basePaths.src + '/js/bootstrap'));

    // Copy Sweet Alert files
    gulp.src(basePaths.node + 'sweetalert2/src/*.scss')
        .pipe(gulp.dest(basePaths.src + '/sass/sweetalert2'));

    gulp.src(basePaths.node + 'sweetalert2/dist/sweetalert2.min.js')
        .pipe(gulp.dest(basePaths.src + '/js/sweetalert2'));
});