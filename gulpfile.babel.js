import gulp from 'gulp';
import gutil from 'gulp-util';
import html2pug from 'gulp-html2pug';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import nodemon from  'gulp-nodemon';
import Cache from 'gulp-file-cache';
import pug from 'gulp-pug';
import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import del from 'del';

let cache = new Cache();
const DIR = {
  SRC : ["src/public","src/views" ,"conversion"],
  DEST : ["dist/public","dist/views","result"]
}
const SRC = {
  SERVER : 'src/app.js',
  JS : `${DIR.SRC[0]}/js/*.js`,
  CSS : `${DIR.SRC[0]}/css/*.css`,
  IMG : `${DIR.SRC[0]}/images/**`,
  FONT : `${DIR.SRC[0]}/fonts/**`,
  PUG : `${DIR.SRC[1]}/**/*.pug`,
  CONVERSION : `${DIR.SRC[2]}/`
}
const DEST = {
  SERVER : 'dist/',
  JS : `${DIR.DEST[0]}/js/`,
  CSS : `${DIR.DEST[0]}/css/`,
  IMG : `${DIR.DEST[0]}/images/`,
  FONT : `${DIR.DEST[0]}/fonts/`,
  HTML : `${DIR.DEST[1]}/`,
  RESULT : `${DIR.DEST[2]}/`,
}
gulp.task('server', () => {
  return gulp.src(SRC.SERVER)
        .pipe(cache.filter())
        .pipe(babel({
            presets:['es2015']
        }))
        .pipe(cache.cache())
        .pipe(uglify())
        .pipe(gulp.dest(DEST.SERVER));
})
gulp.task('js', () => {
  return gulp.src(SRC.JS)
        .pipe(uglify())
        .pipe(gulp.dest(DEST.JS));
})
gulp.task('css', () => {
  return gulp.src(SRC.CSS)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(DEST.CSS));
})
gulp.task('html2Pug', () => {
  gulp.src(SRC.CONVERSION+"*.html")
    .pipe(html2pug())
    .pipe(gulp.dest(DIR.SRC[1]+"/"))
})
gulp.task('pug',["html2Pug"], () => {
  return gulp.src(SRC.PUG)
        .pipe(pug())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(DEST.HTML));
})
gulp.task('img', () => {
  return gulp.src(SRC.IMG)
        .pipe(imagemin())
        .pipe(gulp.dest(DEST.IMG));
})
gulp.task('font', () => {
  return gulp.src(SRC.FONT)
        .pipe(gulp.dest(DEST.FONT));
})
gulp.task('start',['server'], () => {
  return nodemon({
    script: DEST.SERVER + 'app.js',
    watch: DEST.SERVER
  })
})
gulp.task('watch', () => {
  let watcher = {
    server: gulp.watch(SRC.SERVER,['server']),
    js: gulp.watch(SRC.JS,['js']),
    conversion: gulp.watch(SRC.CONVERSION,['html2Pug']),
    pug: gulp.watch(SRC.PUG,['pug']),
    css: gulp.watch(SRC.CSS,['css']),
    img: gulp.watch(SRC.IMG,['img']),
    font: gulp.watch(SRC.FONT,['font'])
  }
  let notify = (event) => {
    gutil.log(`File ${gutil.colors.yellow(event.path)} was ${gutil.colors.red(event.type)}`) 
  }
  for(let key in watcher) watcher[key].on('change', notify);
})
gulp.task('clean', ['pug'], () => {
  return del.sync([`${SRC.CONVERSION}*.html`,`${DIR.DEST}`]);
})
gulp.task('dev', ['js','css','img','font'])
gulp.task("default", ['dev', 'start','clean','watch'], () => {
  gutil.log("running ls gulp");
})