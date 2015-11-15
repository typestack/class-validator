import {Gulpclass, Task, SequenceTask} from "gulpclass/Decorators";
import * as gulp from "gulp";

const del: any = require('del');
const shell: any = require('gulp-shell');
const dtsGenerator: any = require('dts-generator').default;
const replace: any = require('gulp-replace');
const glob: any = require('glob');

@Gulpclass()
export class Gulpfile {

    /**
     * Cleans build folder.
     */
    @Task()
    clean(cb: Function) {
        return del(['./build/**', '!./build/es5/gulpfile.js'], cb);
    }

    /**
     * Publishes a package to npm from ./build/package directory.
     */
    @Task()
    npmPublish() {
        return gulp.src('*.js', { read: false })
            .pipe(shell([
                'cd ./build/package && npm publish'
            ]));
    }

    /**
     * Runs typescript files compilation.
     */
    @Task()
    compile() {
        return gulp.src('*.js', { read: false })
            .pipe(shell([
                './node_modules/.bin/tsc'
            ]));
    }

    /**
     * Copies all files that will be in a package.
     */
    @Task()
    packageFiles() {
        return gulp.src('./build/es5/src/**/*')
            .pipe(gulp.dest('./build/package'));
    }

    /**
     * Change the "private" state of the packaged package.json file to public.
     */
    @Task()
    packagePreparePackageFile() {
        return gulp.src('./package.json')
            .pipe(replace('"private": true,', '"private": false,'))
            .pipe(gulp.dest('./build/package'));
    }

    /**
     * This task will replace all typescript code blocks in the README (since npm does not support typescript syntax
     * highlighting) and copy this README file into the package folder.
     */
    @Task()
    packageReadmeFile() {
        return gulp.src('./README.md')
            .pipe(replace(/```typescript([\s\S]*?)```/g, '```javascript$1```'))
            .pipe(gulp.dest('./build/package'));
    }

    /**
     * Generates a .d.ts file that is needed for the npm package and will be imported by others.
     */
    @Task()
    packageGenerateDts(cb: Function) {
        glob('./src/**/*.ts', (err: any, files: string[]) => {
            const name = require(__dirname + '/../../package.json').name;
            dtsGenerator({
                name: name,
                baseDir: './src',
                files: files,
                out: './build/package/' + name + '.d.ts'
            });
            cb();
        });
    }

    /**
     * Creates a package that can be published to npm.
     */
    @SequenceTask()
    package() {
        return [
            'clean',
            'compile',
            ['packageFiles', 'packagePreparePackageFile', 'packageReadmeFile', 'packageGenerateDts']
        ];
    }

    /**
     * Creates a package and publishes it to npm.
     */
    @SequenceTask()
    publish() {
        return ['package', 'npmPublish'];
    }

}
