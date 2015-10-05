var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var plumber = require('gulp-plumber');
var ts = require('gulp-typescript');
var exec = require('gulp-exec');

gulp.task('clean', function (cb) {
    return del(['./built/**'], cb);
});

gulp.task('compile', function() {
    var tsProject = ts.createProject('tsconfig.json', {
        sortOutput: true,
        typescript: require('typescript')
    });
    return tsProject.src()
        .pipe(plumber())
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest('./built/es5'));
});

gulp.task('tsd', function() {
    return gulp.src('./')
        .pipe(exec('./node_modules/.bin/tsd install'))
        .pipe(exec('./node_modules/.bin/tsd rebundle'))
        .pipe(exec('./node_modules/.bin/tsd link'))
        .pipe(exec.reporter());
});

gulp.task('build-package-copy-src', function() {
    return gulp.src('./built/es5/src/**/*')
        .pipe(gulp.dest('./built/package'));
});

gulp.task('build-package-copy-package-files', function() {
    return gulp.src(['./package.json', 'README.md'])
        .pipe(gulp.dest('./built/package'));
});

gulp.task('build-package-generate-dts', function () {
    var fs = require('fs');
    function getFiles (dir, files){
        files = files || [];
        var filesInDir = fs.readdirSync(dir);
        for (var i in filesInDir){
            var name = dir + '/' + filesInDir[i];
            if (fs.statSync(name).isDirectory()){
                getFiles(name, files);
            } else {
                files.push(name);
            }
        }
        return files;
    }

    var dtsGenerator = require('dts-generator');
    var name = require('./package.json').name;
    var files = getFiles('./src');
    dtsGenerator.generate({
        name: name,
        baseDir: './src',
        files: files,
        out: './built/package/' + name + '.d.ts'
    });
});

gulp.task('build', function(cb) {
    return runSequence(
        'clean',
        'tsd',
        'compile',
        cb
    );
});

gulp.task('package', function(cb) {
    return runSequence(
        'build',
        ['build-package-copy-src', 'build-package-copy-package-files', 'build-package-generate-dts'],
        cb
    );
});

gulp.task('default', ['build']);