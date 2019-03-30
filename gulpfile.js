'use strict'
//引入gulp及各种组件;
const gulp = require('gulp');
const browserSync = require('browser-sync').create();

// 创建本地服务器，并实时更新页面
gulp.task('serve', function() {

    browserSync.init({
        // https: 'https',
        port: 3000,
        // browser: ["google chrome"],
        server: {
            baseDir: './',
            index: 'examples/index.html'
        }
    });

});

gulp.task('default', gulp.series('serve'));