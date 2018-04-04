// Defining requirements
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var buffer = require("vinyl-buffer");
var tsify = require("tsify");
var glob = require('glob');
var watch = require('gulp-watch');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var options = require('./package.json').options;

// Defining base paths
var basePaths = {
    bower: './bower_components/',
    node: './node_modules/',
    src: './src/',
    sass: './dev/sass/**/*.scss',
    sass_src: './src/**/**/*.scss',
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

var supported = [
    'last 4 versions',
    'safari >= 5',
    'ie >= 8',
    'ff >= 15',
    'ios >= 3',
    'opera >= 11',
    'android 4'
];

gulp.task('sass', function () {
    return gulp.src(basePaths.sass)
        .pipe(gulpif(options.sourcemaps, sourcemaps.init({
            loadMaps: true
        })))
        .pipe(sass())
        .pipe(gulpif(options.sourcemaps, sourcemaps.write(undefined, {
            sourceRoot: null
        })))
        .pipe(cssnano({
            autoprefixer: {
                browsers: supported,
                add: true
            },
            discardComments: {
                removeAll: true
            },
            zindex: false
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulpif(options.sourcemaps, sourcemaps.write(undefined, {
            sourceRoot: null
        })))
        .pipe(gulp.dest('./css'))
});

gulp.task("browserify", function () {
    return browserify({
            debug: true,
            entries: [basePaths.ts, basePaths.js],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.js']
        })
        .bundle()
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
        .pipe(gulp.dest("./js"));
});

gulp.task('dev', ['sass', 'browserify', 'browser-sync'], function () {
    gulp.watch([basePaths.sass, basePaths.sass_src], ['sass']);
    gulp.watch([basePaths.ts, basePaths.js, basePaths.js_src], ['browserify']);
});

gulp.task('browser-sync', function () {
    browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});

// Run:
// gulp copy-vendor.
// Copy all needed dependency files
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