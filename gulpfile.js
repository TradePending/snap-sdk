const {task, src, dest, series} = require('gulp');
const umd = require('gulp-umd');
const rename = require('gulp-rename');
const webpack = require('gulp-webpack');
const webpackOrig = require('webpack');
remoteSrc = require('gulp-remote-src');

const pluginUrlBase = 'https://cdnjs.tradepending.com/javascript/';
// const pluginUrlBase = 'http://localhost.tradepending.com:8080/javascript/';


const umdOptions = {
  exports: function(file) {
    return 'SNAP';
  },
  namespace: function(file) {
    return 'SNAP';
  },
  dependencies: function(file) {
    return [{
      name: 'jquery',
      amd: 'jquery',
      cjs: 'jquery',
      global: 'jQuery',
      param: 'jQuery'
    }];
  }
};

task('snap-typeahead', function() {
  return remoteSrc(['snap-typeahead-v4.js'], {
      base: pluginUrlBase
    }).pipe(rename(function(path) {
      path.basename = 'snap-typeahead';
    })).pipe(umd({
      exports: function(file) {
        return 'SNAP';
      },
      namespace: function(file) {
        return 'SNAP';
      },
      dependencies: function(file) {
        return [{
          name: 'jquery',
          amd: 'jquery',
          cjs: 'jquery',
          global: 'jQuery',
          param: 'jQuery'
        }];
      }
    })).pipe(dest('dist/'));
});

task('typeahead', function() {
  return remoteSrc(['typeahead.js'], {
      base: pluginUrlBase
    }).pipe(umd({
      exports: function(file) {
        return "{}";
      },
      dependencies: function(file) {
        return [{
          name: 'jquery',
          amd: 'jquery',
          cjs: 'jquery',
          global: 'jQuery',
          param: 'jQuery'
        }];
      }
    })).pipe(dest('dist/'));
});

task('snap-search', function() {
  return remoteSrc(['snap-search-v4.js'], {
      base: pluginUrlBase
    }).pipe(rename(function(path) {
      path.basename = 'snap-search';
    })).pipe(umd({
      exports: function(file) {
        return 'SNAPes';
      },
      namespace: function(file) {
        return 'SNAPes';
      }
    })).pipe(dest('dist/'));
});


task('webpack', function() {
  return src(['example/example_client.js', 'dist/typeahead.js'])
    .pipe(webpack({
      output: {
        filename: 'example_client_webpacked.js'
      },
      // externals: {
      // // For importing jQuery via a <script> tag instead of NPM.
      //   jquery: 'jQuery'
      // },
      plugins: [
        new webpackOrig.ProvidePlugin({
          jQuery: 'jquery',
          $: 'jquery'
        })
      ]
    }))
    .pipe(dest('example'));
});

task('build', series(task('snap-typeahead'), task('typeahead'), task('snap-search'), task('webpack')));
