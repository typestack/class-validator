import { resolve } from "path";
import { Gulpclass, Task, SequenceTask } from "gulpclass";
import * as gulp from "gulp";
import * as del from "del";
import * as shell from "gulp-shell";
import * as replace from "gulp-replace";
import * as ts from "gulp-typescript";
import * as sourcemaps from "gulp-sourcemaps";
import { rollup, RollupOptions, Plugin } from "rollup";
import { terser as rollupTerser } from "rollup-plugin-terser";
import * as childProcess from "child_process";

const pkg = require("./package.json");

const rollupSourceMaps = require("rollup-plugin-sourcemaps");
const rollupCommonjs = require("rollup-plugin-commonjs");
const rollupJson = require("rollup-plugin-json");
const rollupNodeResolve = require("rollup-plugin-node-resolve");
const rollupUglify = require("rollup-plugin-uglify");


const conventionalChangelog = require("gulp-conventional-changelog");

@Gulpclass()
export class Gulpfile {

    rollupExternal = [
        ...Object.keys(pkg.peerDependencies || {}),
        ...Object.keys(pkg.dependencies || {})
    ];
    rollupCommonPlugins: Plugin[] = [
        // Allow json resolution
        rollupJson(),
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        rollupCommonjs(),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        rollupNodeResolve(),
        // Resolve source maps to the original source
        rollupSourceMaps(),
    ];
    rollupCommonOptions: RollupOptions = {
        inlineDynamicImports: true,
        // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
        external: this.rollupExternal,
    };



    // -------------------------------------------------------------------------
    // General tasks
    // -------------------------------------------------------------------------

    /**
     * Cleans build folder.
     */
    @Task()
    clean() {
        return del([
            "dist/**",
            "build/**",
        ]);
    }

    /**
     * Runs typescript files compilation.
     */
    @Task()
    runTests() {
        return childProcess.spawn("npx jest --coverage", {
            stdio: 'inherit',
            shell: true
        });
    }

    // -------------------------------------------------------------------------
    // Packaging and Publishing tasks
    // -------------------------------------------------------------------------

    @Task()
    changelog() {
        return gulp.src("CHANGELOG.md")
            .pipe(conventionalChangelog({
                // conventional-changelog options go here
                preset: "angular"
            }, {
                // context goes here
            }, {
                // git-raw-commits options go here
            }, {
                // conventional-commits-parser options go here
            }, {
                // conventional-changelog-writer options go here
            }))
            .pipe(gulp.dest("./"));
    }

    /**
     * Publishes a package to npm from ./build/package directory.
     */
    @Task()
    npmPublish() {
        return gulp.src("*.js", { read: false })
            .pipe(shell([
                "cd ./dist/ && npm publish"
            ]));
    }

    @Task()
    packageCompileEsm5() {
        const tsProjectEsm5 = ts.createProject("tsconfig.json", { module: "esnext", target: "es5" });
        const tsResultEsm5 = gulp.src(["./src/**/*.ts"])
            .pipe(sourcemaps.init())
            .pipe(tsProjectEsm5());

        return tsResultEsm5.js
            .pipe(sourcemaps.write(".", { sourceRoot: "", includeContent: true }))
            .pipe(gulp.dest("dist/esm5"));
    }

    @Task()
    packageCompileEsm2015() {
        const tsProjectEsm2015 = ts.createProject("tsconfig.json", { module: "esnext", target: "es2018" });
        const tsResultEsm2015 = gulp.src(["./src/**/*.ts"])
            .pipe(sourcemaps.init())
            .pipe(tsProjectEsm2015());

        return tsResultEsm2015.js
            .pipe(sourcemaps.write(".", { sourceRoot: "", includeContent: true }))
            .pipe(gulp.dest("dist/esm2015"));
    }

    @Task()
    packageCompileTypes() {
        const tsProject = ts.createProject("tsconfig.json", { module: "esnext" });
        const tsResult = gulp.src(["./src/**/*.ts"])
            .pipe(sourcemaps.init())
            .pipe(tsProject());

        return tsResult.dts.pipe(gulp.dest("dist/types"));
    }


    /**
     * Copies all sources to the package directory.
     */
    @SequenceTask()
    packageCompile() {
        return [
            ["packageCompileEsm5", "packageCompileEsm2015", "packageCompileTypes"]
        ];
    }

    @Task()
    packageBundleEsm5() {
        return Promise.all([
            this._rollupPackageBundleEsm5(true),
            this._rollupPackageBundleEsm5(false),
        ]);
    }

    @Task()
    packageBundleEsm2015() {
        return Promise.all([
            this._rollupPackageBundleEsm2015(true),
            this._rollupPackageBundleEsm2015(false),
        ]);
    }

    @SequenceTask()
    packageBundle() {
        return [
            ["packageBundleEsm5", "packageBundleEsm2015"]
        ];
    }

    /**
     * Change the "private" state of the packaged package.json file to public.
     */
    @Task()
    packagePreparePackageFile() {
        return gulp.src("./package.json")
            .pipe(replace("\"private\": true,", "\"private\": false,"))
            .pipe(gulp.dest("./dist"));
    }

    /**
     * This task will replace all typescript code blocks in the README (since npm does not support typescript syntax
     * highlighting) and copy this README file into the package folder.
     */
    @Task()
    packageReadmeFile() {
        return gulp.src("./README.md")
            .pipe(replace(/```typescript([\s\S]*?)```/g, "```javascript$1```"))
            .pipe(gulp.dest("./dist"));
    }

    /**
     * Creates a package that can be published to npm.
     */
    @SequenceTask()
    package() {
        return [
            "clean",
            "packageCompile",
            "packageBundle",
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
     * Runs es linting to validate source code.
     */
    @Task()
    eslint() {
        return childProcess.spawn("npx eslint --config ./.eslintrc.js --ext .ts ./src ./test", {
            stdio: 'inherit',
            shell: true
        });
    }

    /**
     * Compiles the code and runs tests.
     */
    @SequenceTask()
    tests() {
        return ["clean", "eslint", "runTests"];
    }

    private _rollupPackageBundleEsm5(isMin: boolean) {
        return rollup({
            ...this.rollupCommonOptions,
            plugins: [
                ...this.rollupCommonPlugins,
                ...(isMin ? [rollupUglify.uglify()] : []),
            ],
            input: resolve(__dirname, "dist/esm5/index.js"),
        }).then(bundle => {
            return bundle.write({
                file: this._getOutputFileName(resolve(__dirname, "dist/bundles/index.umd.js"), isMin),
                format: "umd",
                name: this._pascalCase(this._normalizePackageName(pkg.name)),
                sourcemap: true,
            });
        });
    }

    private _rollupPackageBundleEsm2015(isMin: boolean) {
        return rollup({
            ...this.rollupCommonOptions,
            plugins: [
                ...this.rollupCommonPlugins,
                ...(isMin ? [rollupTerser()] : []),
            ],
            input: resolve(__dirname, "dist/esm2015/index.js"),
        }).then(bundle => {
            return bundle.write({
                file: this._getOutputFileName(resolve(__dirname, "dist/bundles/index.esm.js"), isMin),
                format: "es",
                sourcemap: true,
            });
        });
    }

    private _dashToCamelCase(myStr: string) {
        return myStr.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }

    private _toUpperCase(myStr: string) {
        return `${myStr.charAt(0).toUpperCase()}${myStr.substr(1)}`;
    }

    private _pascalCase(myStr: string) {
        return this._toUpperCase(this._dashToCamelCase(myStr));
    }

    private _normalizePackageName(rawPackageName: string) {
        const scopeEnd = rawPackageName.indexOf("/") + 1;
        return rawPackageName.substring(scopeEnd);
    }

    private _getOutputFileName(fileName: string, isMin = false) {
        return isMin ? fileName.replace(/\.js$/, ".min.js") : fileName;
    }

}
