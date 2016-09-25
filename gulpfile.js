'use strict';

const gulp        = require('gulp'),
      sass        = require('gulp-sass'),
      clean       = require('gulp-clean'),
      babel       = require('gulp-babel'),
      inject      = require('gulp-inject'),
      uglify      = require('gulp-uglify'),
      concat      = require('gulp-concat'),
      sequence    = require('run-sequence'),
      htmlmin     = require('gulp-htmlmin'),
      imagemin    = require('gulp-imagemin'),
      browserSync = require('browser-sync').create(),
      tmplCache   = require('gulp-angular-templatecache');

const app = {
  dist   : './dist',
  module : 'adpAngular',
  index  : './src/index.html',
  scss   : [
    './src/scss/global.scss',
    './src/components/**/*.scss',
    './src/scss/**/*.scss'
  ],
  js     : [
    './src/app.js',
    './src/js/**/*.js',
    './src/components/**/*.js'
  ],
  html   : [
    './src/html/**/*.html',
    './src/components/**/*.html'
  ],
  img    : [
    './src/img/**/*.{gif,jpg,jpeg,png,svg}'
  ]
};

const vendor = {
  css : [
    './bower_components/bootstrap/dist/css/bootstrap.min.css'
  ],
  js  : [
    './bower_components/angular/angular.min.js',
    './bower_components/angular-animate/angular-animate.min.js',
    './bower_components/angular-sanitize/angular-sanitize.min.js',
    './bower_components/angular-ui-router/release/angular-ui-router.min.js'
  ]
};

const timestamp = (Date.now() / 1000 | 0);

/* UTILITY TASKS
------------------------------------------------------- */
gulp.task('util:clean', () => {
  return gulp.src(app.dist, {read:false}).pipe(clean());
});

gulp.task('util:browser:sync', function() {
  return browserSync.init({
    server: {
      baseDir: app.dist
    }
  });
});

gulp.task('util:browser:reload', function() {
  return browserSync.reload();
});

/* VENDOR TASKS
------------------------------------------------------- */
gulp.task('vendor:css', () => {
  return gulp.src(vendor.css)
    .pipe(concat('vendor.min.css'))
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(app.dist + '/css'));
});

gulp.task('vendor:js', () => {
  return gulp.src(vendor.js)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(app.dist + '/js'));
});

/* APP TASKS
------------------------------------------------------- */
gulp.task('app:scss', () => {
  return gulp.src([app.scss[0],app.scss[1]])
    .pipe(concat('app.min.css'))
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(app.dist + '/css'));
});

gulp.task('app:js', () => {
  return gulp.src(app.js)
    .pipe(babel({presets:['es2015']}))
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(app.dist + '/js'));
});

gulp.task('app:html', () => {
  return gulp.src(app.html)
    .pipe(htmlmin({caseSensitive:true, collapseWhitespace:true, removeComments:true, minifyJS:true, minifyCSS:true}))
    .pipe(tmplCache('templates.min.js', {module:app.module}))
    .pipe(uglify())
    .pipe(gulp.dest(app.dist + '/js'));
});

gulp.task('app:img', function() {
  return gulp.src(app.img)
    .pipe(imagemin())
    .pipe(gulp.dest(app.dist + '/img'));
});

gulp.task('app:global:css', () => {
  let sortedStream = [
    app.dist + '/**/vendor*.css',
    app.dist + '/**/app*.css'
  ];

  return gulp.src(sortedStream)
    .pipe(concat(app.module + '.min.css'))
    .pipe(gulp.dest(app.dist + '/css'));
});

gulp.task('app:global:js', () => {
  let sortedStream = [
    app.dist + '/**/vendor*.js',
    app.dist + '/**/app*.js',
    app.dist + '/**/templates*.js'
  ];

  return gulp.src(sortedStream)
    .pipe(concat(app.module + '.min.js'))
    .pipe(gulp.dest(app.dist + '/js'));
});

gulp.task('app:index:dev', () => {
  let sortedStream  = [
    app.dist + '/**/vendor*.{css,js}',
    app.dist + '/**/app*.{css,js}',
    app.dist + '/**/templates*.{css,js}'
  ];

  let filesToInject  = gulp.src(sortedStream, {read:false}),
      injectOptions  = {
        addRootSlash : false,
        ignorePath   : '/dist/'
      };

  return gulp.src(app.index)
    .pipe(inject(filesToInject, injectOptions))
    .pipe(gulp.dest(app.dist));
});

gulp.task('app:index:prod', () => {
  let stream = `${app.dist}/**/${app.module}*.{css,js}`;

  let filesToInject  = gulp.src(stream, {read:false}),
      injectOptions  = {
        addRootSlash : false,
        ignorePath   : '/dist/'
      };

  return gulp.src(app.index)
    .pipe(inject(filesToInject, injectOptions))
    .pipe(htmlmin({caseSensitive:true, collapseWhitespace:true, removeComments:true}))
    .pipe(gulp.dest(app.dist));
});

/* WATCH TASKS
------------------------------------------------------- */
gulp.task('watch', () => {
  function logEvent(e) {console.log(`${e.path} was ${e.type}`)}
  gulp.watch(app.scss).on('change', (e) => {
    logEvent(e), sequence('app:scss', 'util:browser:reload');
  });
  gulp.watch(app.js).on('change', (e) => {
    logEvent(e), sequence('app:js', 'util:browser:reload');
  });
  gulp.watch(app.html).on('change', (e) => {
    logEvent(e), sequence('app:html', 'util:browser:reload');
  });
  gulp.watch(app.index).on('change', (e) => {
    logEvent(e), sequence('app:index:dev', 'util:browser:reload');
  });
});

/* BUILD TASKS
------------------------------------------------------- */
gulp.task('build:prod', (cb) => {
  sequence('util:clean',['vendor:css','vendor:js'],['app:scss','app:js','app:html','app:img'],['app:global:css','app:global:js'],'app:index:prod',cb);
});

gulp.task('build:dev', (cb) => {
  sequence('util:clean',['vendor:css','vendor:js'],['app:scss','app:js','app:html','app:img'],'app:index:dev',cb);
});

gulp.task('default', (cb) => {
  sequence('build:dev','util:browser:sync','watch',cb);
});