var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('to-js', function () {
    return tsProject.src()
        .pipe(tsProject()).js
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify', ['to-js'], function () {
    return gulp.src('./dist/app-download-boot.js')
        .pipe(rename('app-download-boot.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('./src/*.ts', ['uglify']);
})

gulp.task('default', ['uglify', 'watch']);