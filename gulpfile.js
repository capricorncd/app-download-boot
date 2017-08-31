const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

gulp.task('to-js', function () {
    return gulp.src('./src/app-download-boot.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify', ['to-js'], function () {
    return gulp.src('./dist/app-download-boot.js')
        .pipe(rename('app-download-boot.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('./src/*.js', ['uglify']);
})

gulp.task('default', ['uglify', 'watch']);