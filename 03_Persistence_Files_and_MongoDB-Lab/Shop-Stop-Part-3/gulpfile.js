const GULP = require('gulp');
const MINIFY_CSS = require('gulp-clean-css');
const RENAME = require('gulp-rename');

GULP.task('minify-css', () => {
    GULP.src('content/styles/*.css')
        .pipe(MINIFY_CSS())
        .pipe(RENAME({
            suffix: '.min'
        }))
        .pipe(GULP.dest('content/styles'));
});

GULP.task('default', ['minify-css']);