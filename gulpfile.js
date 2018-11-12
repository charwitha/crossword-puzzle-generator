/*** Created by Ranveer on 3/23/2017.*/

'use strict';

var gulp = require('gulp'),
plugins = require('gulp-load-plugins')({
    DEBUG: true,
    rename: {

    }
}),
del = require('del'),
path = require('path'),
runSequence = require('run-sequence'),
jshintStylish = require('jshint-stylish'),
scssCompiler = require('gulp-scss');

var src = './src/';
var dest = './public/';
var server = plugins.liveServer.static(dest, 8888);

gulp.task('clean', function(cb) {
    return del([dest], cb);
});

gulp.task('scss', function () {
    return gulp.src([src + 'scss/custom.scss'])
    .pipe(scssCompiler())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(plugins.concat('styles.css'))
    .pipe(plugins.cssmin())
    .pipe(plugins.rename({
        suffix: '.min'
    }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(dest + 'css'));
});

gulp.task('js', function () {
    return gulp.src([src + 'js/**/*.js'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(jshintStylish, {beep: true}))
    .pipe(gulp.dest(dest + 'js'));
});

gulp.task('copy-html', function () {
    return gulp.src([src + '/**/*.html', src + '/**/*.htm'])
    .pipe(gulp.dest(dest));
});

gulp.task('copy-img', function(){
 return gulp.src([src + 'images/**/*.*'])
 .pipe(gulp.dest(dest + 'images'));
});

gulp.task('copy-fonts', function(){
    return gulp.src([src + 'fonts/**/*.otf', src + 'fonts/**/*.ttf', src + 'fonts/**/*.eot', src + 'fonts/**/*.svg', src + 'fonts/**/*.woff', src + 'fonts/**/*.woff2'])
    .pipe(gulp.dest(dest +'fonts'));
});

gulp.task('copy-data', function(){
    return gulp.src([src + 'data/**/*.*'])
    .pipe(gulp.dest(dest + 'data'));
});

gulp.task('copy-dependencies', function(){
    return gulp.src([src + 'dependencies/*.*'])
    .pipe(gulp.dest(dest + 'dependencies'));
});

gulp.task('build', function(){
    return runSequence( 'clean', ['scss', 'js'], ['copy-html', 'copy-img', 'copy-fonts', 'copy-data', 'copy-dependencies'], function(){
       console.log('build complete...');
   });
});

gulp.task('serve', function() {

    runSequence( 'build', function(){

        server.start();

        gulp.watch([src + '/**/*.html'], function (file) {
            runSequence('copy-html', function(){
                console.log('HTML modified...!!! UPDATING...');
                server.notify.apply(server, [file]);
            });
        });

        gulp.watch([src + 'scss/**/*.scss'], function(file){
            runSequence('scss', function(){
                console.log('SCSS modified...!!! UPDATING...');
                server.notify.apply(server, [file]);
            });
        });

        gulp.watch([src + 'js/**/*.js'], function(file){
            runSequence('js', function(){
                console.log('JavaScript file modified...!!! UPDATING...');
                server.notify.apply(server, [file]);
            });
        })
    });
});

gulp.task('default', ['serve']);

