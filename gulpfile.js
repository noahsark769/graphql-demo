var gulp = require("gulp");
var sass = require("gulp-sass");
var spawn = require("child_process").spawn;
var isThere = require("is-there");
var chalk = require("chalk");

// Define the tasks

/**
 * Task which watches our SCSS files and compiles them to CSS.
 */
var scssTask = function() {
    console.log("[* graphql-demo] --> Compiling scss...");
    gulp.src("graphql-demo/static/scss/**/*.scss")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(gulp.dest("graphql-demo/static/build/css/"));
};

/**
 * Task which watches our SCSS files for changes, compiling on save.
 */
var scssWatchTask = function(done) {
    console.log("[* graphql-demo] --> Watching graphql-demo/static/scss/* for changes...");
    scssTask();
    return gulp.watch("graphql-demo/static/scss/**/*.scss", ["scss"]).on("end", done);
};

/**
 * Task which runs the django development server as a subprocess.
 */
var djangoTask = function(command) {
    var task = function(done) {
        if (!isThere("venv/bin/python")) {
            console.log(chalk.red("[* graphql-demo] --> No venv found. Please see README.md to set up your venv."));
            return;
        }
        console.log("[* graphql-demo] --> Running python graphql-demo/manage.py " + command + "...");
        var runserver = spawn("venv/bin/python", ["graphql-demo/manage.py", command], { stdio: "inherit" })
        runserver.on("close", function(code) {
            if (code !== 0) {
                console.log(chalk.red("[* graphql-demo] --> python graphql-demo/manage.py " + command + " exited with code " + code));
            } else {
                console.log("[* graphql-demo] --> python graphql-demo/manage.py " + command + " stopped.");
            }
            done();
        });
        return runserver;
    };
    return task;
};

/**
 * Task which runs the webpack configuration as a subprocess. Because of
 * webpack.config.js, this will compile, then watch our JSX files and compile
 * them again on save.
 */
var webpack = function(watch, done) {
    if (!isThere("node_modules/.bin/webpack")) {
        console.log(chalk.red("[* graphql-demo] --> No webpack found found. You might need to `npm install`."));
        return;
    }
    console.log("[* graphql-demo] --> Running webpack...");
    if (watch) {
        console.log("[* graphql-demo] --> (watching graphql-demo/static/js/*.jsx for changes)...");
    }
    var args = [];
    if (watch) {
        args.push("--watch");
    }
    args.push("--display-error-details");
    var webpack = spawn("node_modules/.bin/webpack", args, { stdio: "inherit" })
    webpack.on("close", function(code) {
        if (code !== 0) {
            console.log(chalk.red("[* graphql-demo] --> webpack exited with code " + code));
        } else {
            console.log("[* graphql-demo] --> webpack stopped.");
        }
        done();
    });
    return webpack;
}

var webpackWatchTask = function(done) {
    return webpack(true, done);
};

var webpackTask = function(done) {
    return webpack(false, done);
}

var testTask = function(done) {
    if (!isThere("venv/bin/python")) {
        console.log(chalk.red("[* graphql-demo] --> No venv found. Please see README.md to set up your venv."));
        return;
    }
    console.log("[* graphql-demo] --> Running PYTHONPATH=./graphql-demo py.test -vv --cov=graphql-demo --cov-report html graphql-demo");
    var env = Object.create( process.env );
    env.PYTHONPATH = './graphql-demo';
    var runserver = spawn("py.test", ["-vv", "--cov=graphql-demo", "--cov-report",  "html", "graphql-demo"], { stdio: "inherit", env: env })
    runserver.on("close", function(code) {
        if (code !== 0) {
            console.log(chalk.red("[* graphql-demo] --> Process exited with code " + code));
        } else {
            console.log("[* graphql-demo] --> Process completed.");
        }
        done();
    });
    return runserver;
};

/**
 * Run SCSS watch, JSX watch, and django server at the same time.
 */
var defaultTask = function(callback) {
    console.log("[* graphql-demo] --> Starting up Django, Webpack, and SCSS watch tasks. This could take a few seconds. Wait until you see the Django and webpack system checks.");
    gulp.start("scss:watch", "webpack:watch", "runserver");
};

// Register the tasks

gulp.task("scss", scssTask);
gulp.task("scss:watch", scssWatchTask);
gulp.task("webpack", webpackTask);
gulp.task("webpack:watch", webpackWatchTask);
gulp.task("default", defaultTask);

gulp.task("runserver", djangoTask("runserver"));
gulp.task("r", djangoTask("runserver"));

gulp.task("shell", djangoTask("shell"));
gulp.task("s", djangoTask("shell"));

gulp.task("makemigrations", djangoTask("makemigrations"));
gulp.task("mm", djangoTask("makemigrations"));

gulp.task("migrate", djangoTask("migrate"));
gulp.task("m", djangoTask("migrate"));

gulp.task("test", testTask)