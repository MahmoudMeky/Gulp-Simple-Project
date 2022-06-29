const { watch,src, dest, parallel, series } = require("gulp");

const htmlmin = require('gulp-htmlmin');

var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');

var browserSync = require('browser-sync').create();

const processhtml = require('gulp-processhtml');



function jsTask() {
    // Minify JS Files
    return src("./js/*.js").pipe(jsmin()).pipe(rename({ suffix: ".min" })).pipe(dest("dist/js"));
}
function htmlTask() {
    // Minify HTML Files
    return src("./index.html").pipe(processhtml({
        "css":"style.min.css"
    })).pipe(htmlmin({ collapseWhitespace: true })).pipe(dest("dist"))
}
function cssTask() {
    // Minify Css Files
    return src("./css/*.css",{sourcemaps:true}).pipe(concat("style.css")).pipe(cssmin()).pipe(rename({ suffix: ".min" })).pipe(dest("dist",{sourcemaps:"."}))
}

function imgTask() {
    // Minify Images
    return src("./images/**/*").pipe(imagemin(
        [
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
        ]
    )).pipe(dest("dist/images"))
}

function watchDist(){
    watch("./*.html",series(htmlTask,reload))
    watch("./css/*.css",series(cssTask,reload))
    watch("./js/*.js",series(jsTask,reload))
}
function serve(cb){
    browserSync.init({
        server:{baseDir:"./dist"}
    })
    cb();
}
function reload(cb){
    browserSync.reload();
    cb();
}

const options={

}



// exports.default = parallel(htmlTask, cssTask, jsTask,imgTask);
exports.default=series(parallel(htmlTask, cssTask, jsTask),serve,watchDist)
