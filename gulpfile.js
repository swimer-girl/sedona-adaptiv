import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import webp from 'gulp-webp';
import svgo from 'gulp-svgmin';
import {stacksvg} from 'gulp-stacksvg';
import del from 'del';
import browser from 'browser-sync';
import ghPages from 'gulp-gh-pages';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))

    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML
const html = () => {
  return gulp.src('source/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('build'));
}

// Scripts

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(terser())
    .pipe(gulp.dest("build/js"))
}

// Images

const optimizeImages = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(squoosh())
    .pipe(gulp.dest("build/img"))
}

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(gulp.dest("build/img"))
}

// WebP

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}

// SVG

const svg = () =>
  gulp.src(['source/img/*.svg', '!source/img/icons'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));

const stack = () => {
  return gulp.src(['source/img/icons/*.svg'])
    .pipe(svgo())
    .pipe(stacksvg({ output: `stack` }))
    .pipe(gulp.dest('build/img'))
}

// Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.svg",
    "!source/img/icons/*.svg",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

// Clean

const clean = () => {
  return del("build");
};

// Server

export const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = () => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

//Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    stack,
    createWebp
  ),
);

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    stack,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));

//Deploy

// const paths = {
//   scripts: (
//     src: 'source',
//     dest: 'build',
//   )
// }

function deploy(cb) {
  ghPages.publish(path.join(process.cwd(), './build'), cb);
}
exports.deploy = deploy;