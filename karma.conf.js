'use strict';

/**
 * Karma config.
 */

module.exports = function(config) {
  config.set({
    files: [
      'test/index.js'
    ],

    frameworks: ['browserify', 'mocha'],

    reporters: ['spec'],

    preprocessors: {
      'test/**/*.js': 'browserify'
    },

    browserify: {
      debug: true
    }
  });
};
