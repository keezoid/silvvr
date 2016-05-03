/**
 * buildsys/task/cachebust-css-urls
 * @author Keenan Staffieri
 * ------------------------------------
 * TASK: Generate Favicons
 * 'gulp cachebust-css-urls'
*/

var gutil = require('gulp-util');
var cssnano = require('gulp-cssnano');
var modifyCssUrls = require('gulp-modify-css-urls');


/* $ gulp cachebust-css-urls */

gulp.task('cachebust-css-urls', function (cb) {

    Logger.task('RUNNING TASK : cachebust-css-urls');

    var optimizeCSS = config.env[env].css.optimize;

    return gulp.src(`${config.buildDir.css}/**/*.css`)
        .pipe(CACHEBUST_HASH ? modifyCssUrls({
            append: '?v=' + CACHEBUST_HASH
        }) : gutil.noop())
        .pipe(optimizeCSS ? cssnano() : gutil.noop())
        .pipe(gulp.dest(config.buildDir.css))
        .on('end', function () { return Logger.taskComplete('FINISHED TASK : cachebust-css-urls'); });

});
