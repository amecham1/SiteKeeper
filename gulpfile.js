const gulp =require ('gulp');
const concat =require ('gulp-concat');
// const annotate =require ('gulp-ng-annotate');
const plumber =require ('gulp-plumber');
// const uglify =require ('gulp-uglify');
const watch =require ('gulp-watch');
const sass =require ('gulp-sass');
const path =require ('path');
const babel =require ('gulp-babel');
const sourcemaps =require ('gulp-sourcemaps');
// const browserSync = require('browser-sync').create();

// DECLARE FILE PATHS
// ============================================================
const paths = {
  jsSource: ['./frontend/app/**/*.js','./frontend/assets/js/*.js'],
  sassSource: ['./frontend/assets/scss/*.scss'],
  // serverSource: ['./server/*.js']
};
const sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded',
  paths: [ path.join(__dirname, 'styles') ]
};
// DEFINE TASKS
// ============================================================
gulp.task('js', () => {
  return gulp.src(paths.jsSource)
  .pipe(sourcemaps.init())
  .pipe(plumber())
  // .pipe(babel({
  //    presets: ["es2015"]
  // })) //comment out if not using ES6
  .pipe(concat('bundle.js'))
  // .pipe(annotate())
  //.pipe(uglify()) //Uncomment when code is production ready
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./frontend/public'));

});
// gulp.task('server', () => {
//   return gulp.src(paths.serverSource)
//   .pipe(plumber())
//   .pipe(babel({
//     presets: ["es2015"]
//   }))
//   .pipe(gulp.dest('./dist'));
//});
gulp.task('sass', () => {
  return gulp.src(paths.sassSource)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./frontend/public'));


});


// WATCH TASKS
// ============================================================

gulp.task('watch', () => {
  gulp.watch(paths.jsSource, ['js']);
  // gulp.watch(paths.serverSource, ['server']);
   gulp.watch(paths.sassSource, ['sass']);
});
// RUN DEFAULT TASK - first thing to run when gulp is called
// ============================================================
gulp.task('default', ['watch', 'js', 'sass']);
