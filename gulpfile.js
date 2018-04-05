var gulp = require("gulp");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var gulpif = require("gulp-if");
var glob = require("glob");
var log = require("fancy-log");
var browserify = require("browserify");
var watchify = require("watchify");
var tsify = require("tsify");
var babelify = require("babelify");
var browserSync = require("browser-sync").create();
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var cssnano = require("gulp-cssnano");
var sourcemaps = require("gulp-sourcemaps");
var options = require("./package.json").options;

var basePaths = {
  node: "./node_modules/",
  dist: "./dist",
  dev: {
    sass: "./dev/sass/**/*.scss",
    ts: glob.sync("./dev/ts/*.ts"),
    js: glob.sync("./dev/js/*.js")
  }
};

var browserSyncWatchFiles = [
  "./dist/css/**/*.css",
  "./dist/js/**/*.js",
  "./*.html"
];

var browserSyncOptions = {
  proxy: "localhost/github/udemy-typescript/",
  notify: true
};

var bundleOpts = {
  debug: true,
  entries: [basePaths.dev.ts, basePaths.dev.js],
  cache: {},
  packageCache: {}
};

var supportedBrowsers = [
  "last 4 versions",
  "safari >= 5",
  "ie >= 8",
  "ff >= 15",
  "ios >= 3",
  "opera >= 11",
  "android 4"
];

function buildBundle(bundle) {

  log("Compiling bundle...");

  bundle
    .bundle()
    .on("error", () => log.error.bind(log, "Browserify Error"))
    .pipe(source("main.js"))
    .pipe(buffer())
    .pipe(gulpif(
      options.sourcemaps,
      sourcemaps.init({
        loadMaps: true
      })))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulpif(
      options.sourcemaps,
      sourcemaps.write(undefined, {
        sourceRoot: null
      })))
    .pipe(gulp.dest("./dist/js"))
    .pipe(
      browserSync.stream({
        once: true
      })
    );
}

gulp.task("scripts", () => {
  let bundle = browserify(bundleOpts, watchify.args);
  bundle = watchify(
    bundle.plugin(tsify).transform("babelify", {
      presets: ["env"],
      extensions: [".js"]
    })
  );
  bundle.on("update", () => buildBundle(bundle));
  bundle.on("log", () => log.info);

  return buildBundle(bundle);
});

gulp.task('sass', function () {
  return gulp.src(basePaths.dev.sass)
    .pipe(gulpif(options.sourcemaps, sourcemaps.init({
      loadMaps: true
    })))
    .pipe(sass({
      includePaths: [basePaths.node],
      outputStyle: "compressed"
    }))
    .pipe(gulpif(options.sourcemaps, sourcemaps.write(undefined, {
      sourceRoot: null
    })))
    .pipe(cssnano({
      autoprefixer: {
        browsers: supportedBrowsers,
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
    .pipe(gulp.dest('./dist/css'))
});

gulp.task("browser-sync", function () {
  browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});

gulp.task("dev", ["scripts", "sass", "browser-sync"], function () {
  gulp.watch(basePaths.dev.sass, ["sass"]);
});