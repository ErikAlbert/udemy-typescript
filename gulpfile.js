// Defining base paths
var basePaths = {
    bower: './bower_components/',
    node: './node_modules/',
    src: './src/',
    sass: './dev/sass/**/*.scss',
    sass_src: './src/**/**/*.scss',
    ts: './dev/ts/**/*.ts',
    js: './dev/js/**/*.js',
    js_src: './src/**/**/*.js'
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

// Defining requirements
var gulp = require('gulp');
var rmLines = require('gulp-rm-lines');
var sass = require('gulp-sass');
var typescript = require('gulp-typescript');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var gulpif = require('gulp-if');
var rimraf = require('gulp-rimraf');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var del = require('del');
var options = require('./package.json').options;

var supported = [
    'last 4 versions',
    'safari >= 5',
    'ie >= 8',
    'ff >= 15',
    'ios >= 3',
    'opera >= 11',
    'android 4'
];

gulp.task('sass-dev', function () {
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

gulp.task('ts-dev', function () {
    return gulp.src(basePaths.ts)
        .pipe(gulpif(options.sourcemaps, sourcemaps.init()))
        .pipe(typescript({
            module: 'amd',
            target: 'es5',
            removeComments: true,
            noImplicitAny: true,
            outFile: 'main.js' //This property can only be used with amd or system modules. It reunites all compiled files into one file.
        }))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulpif(options.sourcemaps, sourcemaps.write(undefined, {
            sourceRoot: null
        })))
        .pipe(gulp.dest('./js'))
});

// Run:
// gulp javascript
// Ufglifies and minifies all javascript files
gulp.task('js-dev', function () {
    return gulp.src(basePaths.js)
        .pipe(gulpif(options.sourcemaps, sourcemaps.init()))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulpif(options.sourcemaps, sourcemaps.write(undefined, {
            sourceRoot: null
        })))
        .pipe(gulp.dest('./js'))
});

gulp.task('dev', ['sass-dev', 'ts-dev', 'js-dev', 'browser-sync'], function () {
    gulp.watch([basePaths.sass, basePaths.sass_src], ['sass-dev']);
    gulp.watch(basePaths.ts, ['ts-dev']);
    gulp.watch([basePaths.js, basePaths.js_src], ['js-dev']);
});

// Run:
// gulp clean-source
// Delete any file inside the /src folder
gulp.task('clean-source', function () {
    return del(['src/**/*', ]);
});

// Run:
// gulp browser-sync
// Starts browser-sync task for starting the server.
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