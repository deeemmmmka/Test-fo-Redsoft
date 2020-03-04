var gulp = require('gulp'),
rename = require('gulp-rename'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
sourcemaps = require('gulp-sourcemaps'),
browserSync = require('browser-sync').create(),
rigger = require('gulp-rigger'),
gulpIf = require('gulp-if'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
env = require('gulp-env'),
minifyHTML = require('gulp-minify-html'),
connect = require('gulp-connect'),
reload = browserSync.reload;

function css_style(done){
  gulp.src('./scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errorLogToConsole: true,
      outputStyle: 'compressed'
    }))
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
      cascade: false
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe( gulp.dest('./final/css/') )
    .pipe(browserSync.stream());

  done();
}

function sync(done){
  browserSync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}
function browserReload(done){
  browserSync.reload();
  done();
}
function fonts_copy(done){
  gulp.src('./fonts/**/*.*')
    .pipe(gulp.dest('final/fonts/'))
}
function img_copy () {
    gulp.src('img/**/*.*')
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest('final/img/')) //И бросим в build
        .pipe(reload({stream: true}));
}
function watchSass(){
  gulp.watch("./scss/**/*", css_style);
}
function watchFiles(){
  gulp.watch("./scss/**/*", css_style);
  gulp.watch("./**/*.html", browserReload);
  gulp.watch("./**/*.php", browserReload);
  gulp.watch("./**/*.js", browserReload);
}


// gulp.task(css_style);
// gulp.task(print);

gulp.task('default', gulp.parallel(watchFiles, fonts_copy, img_copy, sync));
gulp.task(sync);
// exports.default = defaultSomeTask;
