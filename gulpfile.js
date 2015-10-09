// dependencies
var gulp = require('gulp');
var path = require('path');
var util = require('gulp-util');
 
// dev server
var connect = require('connect');
//var compression = require('compression');
//var modRewrite = require('connect-modrewrite');
var serveStatic = require('serve-static');
var livereload = require('gulp-livereload');
 
// plugins
//var bower = require('gulp-bower');
var concat = require('gulp-concat');
var deploy = require('gulp-gh-pages');
//var less = require('gulp-less');
//var sass = require('gulp-sass');
//var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
//var ngAnnotate = require('gulp-ng-annotate');
//var templateCache = require('gulp-angular-templatecache');
   
  
 
 
 
/*
* js
*/
var js = [
  'index.js'
];

gulp.task('js', function(){
	gulp.src(js)
		.pipe(concat('ng-resize.js'))
		.pipe(gulp.dest('dist'))
		.pipe(uglify().on('error', util.log))
		.pipe(concat('ng-resize.min.js'))
		.pipe(gulp.dest('dist'));
});


var demo = [
	'demo/**/*'
];

gulp.task('demo', function(){
	gulp.src(demo)
		.pipe(gulp.dest('build'));
	gulp.src(['dist/**/*'])
		.pipe(gulp.dest('build/dist'))
});
 
 
 
 

 
 
/*
* build
*/
gulp.task('build', ['js', 'demo']);
 
 
/*
* deploy
*/
gulp.task('deploy', ['build'], function(){
	return gulp.src('build/**/*.*').pipe(deploy({cacheDir:'pages'}));
});
 
 
/*
* server
*/
gulp.task('server', ['build'], function(next){
	var server = connect();
	//server.use(compression());
	//server.use(modRewrite([
	//	'!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.ico|\\.gif|\\.eot|\\.otf|\\.ttf|\\.woff|\\.mp4$ /index.html'
	//]));
	server.use(serveStatic('build'));
	server.listen(3000, next);
});
//gulp.task('server-rest', function(){
//	var exec = require('child_process').exec;
//	exec('node server\index.js', function(err, stdout, stderr){
//		if(err){
//			
//		} else {
//			console.log(stdout);
//			console.log(stderr);
//		}
//	});
//});
 
 
/*
* watch
*/
gulp.task('watch', ['server'], function(){
	livereload.listen();

	//gulp.watch(partials, ['partials']);
	//gulp.watch(files, ['files']);
	//gulp.watch(img, ['img']);
	//gulp.watch('app/less/**/*.scss', ['css']);
	gulp.watch(js, ['js']);
	gulp.watch(demo, ['demo']);
	//gulp.watch(fonts, ['fonts']);
	//gulp.watch(bower_css, ['bower_css']);
	//gulp.watch(bower_js, ['bower_js']);
	//gulp.watch(bower_fonts, ['bower_fonts']);

	gulp.watch(['build/**/*'], function(file){
		livereload.changed(file.path);
	});
	
//	gulp.watch('server/**/*', ['server-rest'], function(file){
//		console.log('rest server file changed', file.path);
//	});
});
 
 
/*
* default
*/
gulp.task('default', ['watch']);