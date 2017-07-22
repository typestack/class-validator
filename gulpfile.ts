import {Gulpclass, Task, SequenceTask, MergedTask} from "gulpclass";
import * as gulp from "gulp";

const del = require("del");
const shell = require("gulp-shell");
const replace = require("gulp-replace");
const mocha = require("gulp-mocha");
const chai = require("chai");
const tslint = require("gulp-tslint");
const stylish = require("tslint-stylish");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const istanbul = require("gulp-istanbul");
const remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");

@Gulpclass()
export class Gulpfile {

    // -------------------------------------------------------------------------
    // General tasks
    // -------------------------------------------------------------------------

    /**
     * Cleans build folder.
     */
    @Task()
    clean(cb: Function) {
        return del([
            "build/**",
            "!build",
            "!build/package",
            "!build/package/node_modules",
            "!build/package/node_modules/**"
        ], cb);
    }

    /**
     * Runs typescript files compilation.
     */
    @Task()
    compile() {
        return gulp.src("*.ts", { read: false })
            .pipe(shell(["tsc"]));
    }

    // -------------------------------------------------------------------------
    // Packaging and Publishing tasks
    // -------------------------------------------------------------------------

    /**
     * Publishes a package to npm from ./build/package directory.
     */
    @Task()
    npmPublish() {
        return gulp.src("*.js", { read: false })
            .pipe(shell([
                "cd ./build/package && npm publish"
            ]));
    }

    /**
     * Copies all sources to the package directory.
     */
    @MergedTask()
    packageCompile() {
        const tsProject = ts.createProject("tsconfig.json");
        const tsResult = gulp.src(["./src/**/*.ts"])
            .pipe(sourcemaps.init())
            .pipe(tsProject());

        return [
            tsResult.dts.pipe(gulp.dest("./build/package")),
            tsResult.js
                .pipe(sourcemaps.write(".", { sourceRoot: "", includeContent: true }))
                .pipe(gulp.dest("./build/package"))
        ];
    }

    /**
     * Moves all compiled files to the final package directory.
     */
    @Task()
    packageMoveCompiledFiles() {
        return gulp.src("./build/package/src/**/*")
            .pipe(gulp.dest("./build/package"));
    }

    /**
     * Moves all compiled files to the final package directory.
     */
    @Task()
    packageClearCompileDirectory(cb: Function) {
        return del([
            "build/package/src/**"
        ], cb);
    }

    /**
     * Change the "private" state of the packaged package.json file to public.
     */
    @Task()
    packagePreparePackageFile() {
        return gulp.src("./package.json")
            .pipe(replace("\"private\": true,", "\"private\": false,"))
            .pipe(gulp.dest("./build/package"));
    }

    /**
     * This task will replace all typescript code blocks in the README (since npm does not support typescript syntax
     * highlighting) and copy this README file into the package folder.
     */
    @Task()
    packageReadmeFile() {
        return gulp.src("./README.md")
            .pipe(replace(/```typescript([\s\S]*?)```/g, "```javascript$1```"))
            .pipe(gulp.dest("./build/package"));
    }

    /**
     * Creates a package that can be published to npm.
     */
    @SequenceTask()
    package() {
        return [
            "clean",
            "packageCompile",
            "packageMoveCompiledFiles",
            "packageClearCompileDirectory",
            ["packagePreparePackageFile", "packageReadmeFile"]
        ];
    }

    /**
     * Creates a package and publishes it to npm.
     */
    @SequenceTask()
    publish() {
        return ["package", "npmPublish"];
    }

    // -------------------------------------------------------------------------
    // Run tests tasks
    // -------------------------------------------------------------------------

    /**
     * Runs ts linting to validate source code.
     */
    @Task()
    tslint() {
        return gulp.src(["./src/**/*.ts", "./test/**/*.ts", "./sample/**/*.ts"])
            .pipe(tslint())
            .pipe(tslint.report(stylish, {
                emitError: true,
                sort: true,
                bell: true
            }));
    }

    /**
     * Runs unit-tests.
     */
    @Task()
    unit() {
        chai.should();
        chai.use(require("sinon-chai"));
        chai.use(require("chai-as-promised"));
        return gulp.src("./build/compiled/test/**/*.js")
            .pipe(mocha());
    }

    /**
     * Runs before test coverage, required step to perform a test coverage.
     */
    @Task()
    coveragePre() {
        return gulp.src(["./build/compiled/src/**/*.js"])
            .pipe(istanbul())
            .pipe(istanbul.hookRequire());
    }

    /**
     * Runs post coverage operations.
     */
    @Task("coveragePost", ["coveragePre"])
    coveragePost() {
        chai.should();
        chai.use(require("sinon-chai"));
        chai.use(require("chai-as-promised"));

        return gulp.src(["./build/compiled/test/**/*.js"])
            .pipe(mocha())
            .pipe(istanbul.writeReports());
    }

    @Task()
    coverageRemap() {
        return gulp.src("./coverage/coverage-final.json")
            .pipe(remapIstanbul())
            .pipe(gulp.dest("./coverage"));
    }

    /**
     * Compiles the code and runs tests.
     */
    @SequenceTask()
    tests() {
        return ["compile", "tslint", "coveragePost", "coverageRemap"];
    }

}
