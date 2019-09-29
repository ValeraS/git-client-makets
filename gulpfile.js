const gulp = require('gulp');
const posthtml = require('gulp-posthtml');
const concat = require('gulp-concat');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const fs = require('fs');
const liveServer = require('live-server');
const Bundler = require('parcel-bundler');
const Stream = require('stream');

const expressions = require('posthtml-expressions');

function buildBundle(bundleName) {
  const stream = new Stream.Writable({ objectMode: true });
  stream._write = function(file, _, cb) {
    const options = {
      outDir: './build',
      outFile: `${bundleName}.js`,
      global: bundleName,
      watch: false,
      // minify: true
    };
    const entryPoint = file.path;
    const bundler = new Bundler(entryPoint, options);
    bundler
      .bundle()
      .then(() => cb())
      .catch(err => cb(err));
  };
  return stream;
}

function appBundle() {
  return gulp.src('src/index.js', { read: false }).pipe(buildBundle('index'));
}

function html() {
  const data = {
    history: JSON.parse(fs.readFileSync('./src/data/history.json')),
    file: JSON.parse(fs.readFileSync('./src/data/file.json')),
    files: JSON.parse(fs.readFileSync('./src/data/files.json')),
    branches: JSON.parse(fs.readFileSync('./src/data/branches.json')),
    commit: JSON.parse(fs.readFileSync('./src/data/commit.json')),
  };

  const plugins = [
    require('posthtml-extend')(),
    require('posthtml-include')(),
    expressions({ locals: data }),
  ];
  const options = {};

  return gulp
    .src('src/pages/*.html')
    .pipe(posthtml(plugins, options))
    .pipe(gulp.dest('build/'));
}

function css() {
  return gulp
    .src('src/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer()]))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
}

function watch() {
  gulp.watch('src/**/*.css', css);
  gulp.watch('src/**/*.html', html);
  gulp.watch('src/**/*.js', appBundle);
}

function serve() {
  const params = {
    root: 'build',
    mount: [['/assets', 'assets']],
    port: 8888,
    wait: 1000,
  };
  liveServer.start(params);
}

exports.default = gulp.series(html, css, appBundle);
exports.watch = gulp.parallel(watch, serve);
