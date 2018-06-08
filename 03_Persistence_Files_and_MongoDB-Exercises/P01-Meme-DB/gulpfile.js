const GULP = require('gulp');
const MINIFY_CSS = require('gulp-clean-css');
const MINIFY_HTML = require('gulp-htmlmin');
const RENAME = require('gulp-rename');

GULP.task('minify-css', () => {
    GULP.src('public/css/*.css')
        .pipe(MINIFY_CSS())
        .pipe(RENAME({
            suffix: '.min'
        }))
        .pipe(GULP.dest('public/css/'));
});

GULP.task('minify-html', () => {
    GULP.src('views/*.html')
        .pipe((MINIFY_HTML({ collapseWhitespace: true })))
        .pipe(RENAME({
            suffix: '.min'
        }))
        .pipe(GULP.dest('views/'));
});

GULP.task('default', ['minify-css', 'minify-html']);