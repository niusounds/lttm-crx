var Octokat, clean, coffee, download, fs, gulp, paths, sass, zip;

gulp = require('gulp');

clean = require('gulp-clean');

zip = require('gulp-zip');

download = require('gulp-download');

Octokat = require('octokat');

fs = require('fs');

paths = {
  lib: 'lib/**/*.*',
  js: 'src/js/**/*.js',
  css: 'src/css/**/*.css'
};

gulp.task('copy', function () {
  return gulp.src(paths.lib).pipe(gulp.dest('build/'));
});

gulp.task('download:misawa', function () {
  return download('http://horesase.github.io/horesase-boys/meigens.json').pipe(gulp.dest("lib/config"));
});

gulp.task('download:irasutoya', function () {
  return download('https://june29.github.io/irasutoya-data/irasutoya.json').pipe(gulp.dest("lib/config"));
});

gulp.task('download:decomoji', function (done) {
  var images, octo, promises, ref, repo, types;
  octo = new Octokat();
  repo = octo.repos('decomoji', 'slack-reaction-decomoji');
  images = [];
  ref = "4.12.0";
  types = ['basic', 'extra'];
  promises = types.map(function (type) {
    return repo.contents(`decomoji-${type}.md`).read({
      ref: ref
    });
  });
  return Promise.all(promises).then(function (contents) {
    var content, i, j, len, len1, match, matches;
    for (i = 0, len = contents.length; i < len; i++) {
      content = contents[i];
      matches = content.match(/decomoji\/[a-z]+\/[0-9a-z-_]+\.png/g);
      for (j = 0, len1 = matches.length; j < len1; j++) {
        match = matches[j];
        images.push({
          url: `https://raw.githubusercontent.com/decomoji/slack-reaction-decomoji/${ref}/${match}`,
          keywords: [match.replace(/.*\/|\.png/g, '')]
        });
      }
    }
    return fs.writeFileSync("lib/config/decomoji.json", JSON.stringify(images));
  });
});

gulp.task('download:sushidot', function (done) {
  var images, octo, repo;
  octo = new Octokat();
  repo = octo.repos('fukayatsu', 'lttm-crx');
  images = [];
  return repo.contents('vendor/sushidot').fetch(function (err, contents) {
    var content, i, len, ref1;
    ref1 = contents.items;
    for (i = 0, len = ref1.length; i < len; i++) {
      content = ref1[i];
      images.push({
        url: content.downloadUrl,
        keywords: [content.name.split('.')[0]]
      });
    }
    fs.writeFileSync("lib/config/sushidot.json", JSON.stringify(images));
    return done();
  });
});

gulp.task('coffee', function () {
  return gulp.src(paths.js).pipe(gulp.dest('build/js/'));
});

gulp.task('sass', function () {
  return gulp.src(paths.css).pipe(gulp.dest('build/css/'));
});

gulp.task('watch', function () {
  gulp.watch(paths.lib, gulp.task('copy'));
  gulp.watch(paths.js, gulp.task('coffee'));
  return gulp.watch(paths.css, gulp.task('sass'));
});

gulp.task('clean', function () {
  return gulp.src(['build', 'build.zip'], {
    read: false,
    allowEmpty: true
  }).pipe(clean());
});

gulp.task('zip', function () {
  return gulp.src('build/**/*.*').pipe(zip('build.zip')).pipe(gulp.dest('./'));
});

gulp.task('download', gulp.parallel('download:misawa', 'download:irasutoya', 'download:decomoji', 'download:sushidot'));

gulp.task('build', gulp.parallel('copy', 'download', 'coffee', 'sass'));

gulp.task('rebuild', gulp.series('clean', 'build'));

gulp.task('release', gulp.series('clean', 'build', 'zip'));

gulp.task('default', gulp.series('clean', 'build', 'watch'));
