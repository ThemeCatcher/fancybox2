/* jshint node: true */
/* global $: true */
"use strict";

const { dest, parallel, series, src, watch } = require("gulp");
const $ = require("gulp-load-plugins")();

const config = {
    js: [
        "lib/jquery.mousewheel.pack.js",
        "source/jquery.fancybox.js",
        "source/helpers/jquery.fancybox-buttons.js",
        "source/helpers/jquery.fancybox-thumbs.js",
        "source/helpers/jquery.fancybox-media.js"
    ],
    css: [
        "source/jquery.fancybox.css",
        "source/helpers/jquery.fancybox-buttons.css",
        "source/helpers/jquery.fancybox-thumbs.css"
    ],
    images: [
        "source/helpers/**/*.{jpg,png,svg,gif,webp,ico}",
        "source/*.{jpg,png,svg,gif,webp,ico}"
    ]
};

const dist = {
    images: "dist/images/fancybox",
    css: "dist/css",
    js: "dist/js"
};

/*
 - |--------------------------------------------------------------------------
 - | Gulp Front Tasks
 - |--------------------------------------------------------------------------
 - |
 + *
 + *
 */

function watcher(cb) {
    watch('source/**/*.{jpg,png,svg,gif,webp,ico}', images);
    watch('source/**/*.css', styles);
    watch('source/**/*.js', scripts);
    cb();
}

function images(cb) {
    src(config.images)
        .pipe(dest(dist.images));
    
    cb();
}

function styles(cb) {
    src(config.css)
        .pipe($.plumberNotifier())
        .pipe($.concat("jquery.fancybox.min.css"))
        .pipe($.autoprefixer("last 5 version"))
        .pipe($.replace(/url\('?(.*)'?\)/g, "url('../images/fancybox/$1')"))
        .pipe($.replace("''", "'"))
        .pipe($.cleanCss({compatibility: 'ie8'}))
        .pipe(dest(dist.css));

    cb();
}

function scripts(cb) {
    src(config.js)
        .pipe($.plumberNotifier())
        .pipe($.concat("jquery.fancybox.min.js"))
        .pipe($.uglify())
        .pipe(dest(dist.js));

    cb();
}

exports.watch = watcher;
exports.default = series(parallel(images, styles, scripts), watcher);
