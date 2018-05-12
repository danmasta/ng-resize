var path = require('path');
var gulp = require('gulp');
var express = require('express');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var deploy = require('gulp-gh-pages');
var uglify = require('gulp-uglify');
var annotate = require('gulp-ng-annotate');

gulp.task('js', function(){
    return gulp.src('./index.js')
        .pipe(annotate())
        .pipe(concat('ng-resize.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('js:min', function(){
    return gulp.src('./index.js')
        .pipe(annotate())
        .pipe(uglify())
        .pipe(concat('ng-resize.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['js', 'js:min']);

gulp.task('deploy', ['build'], function(){
    return gulp.src(['dist/**/*', 'demo/**/*']).pipe(deploy({ cacheDir:'pages' }));
});

gulp.task('server', ['build'], function(done){

    var app = express();

    app.use(express.static('demo'));
    app.use(express.static('dist'));

    console.log('[development] server listening on: 8080');

    app.listen(8080, done);

});

gulp.task('watch', ['server'], function(){

    livereload.listen();

    gulp.watch('./index.js', ['js', 'js:min']);

    gulp.watch(['demo/**/*', 'dist/**/*'], function(file){
        livereload.changed(file.path);
    });

});

gulp.task('default', ['watch']);
