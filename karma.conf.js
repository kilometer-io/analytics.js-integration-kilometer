/* eslint-env node */
'use strict';

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // frameworks to use
    frameworks: ['browserify', 'jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // {pattern: 'bower_components/**/*.js', included: false},
      // {pattern: 'lib/**/*.js', included: true},
      // { pattern: 'test/**/*.test.js', included: true }
      'test/**/*.test.js'
      // {pattern: 'tests/**/*Spec.js', included: true}
    ],

    // list of files to exclude
    exclude: [
    ],

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karka-ie-launcher`)
    // browsers: ['Firefox', 'PhantomJS', 'chrome_without_security'],
    browsers: ['PhantomJS'],

    customLaunchers: {
      chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    },

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_INFO
    logLevel: config.LOG_INFO,

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage', 'spec'
    reporters: ['spec', 'coverage'],

    preprocessors: {
      'test/**/*.js': 'browserify'
    },

    /*
    client: {
      mocha: {
        grep: process.env.GREP
      }
    },
    */

    browserify: {
      debug: true
      // FIXME(ndhoule): IE7/8 choke on coverage instrumentation; enable after
      // dropping support for those browsers
      // transform: [
      //   [
      //     'browserify-istanbul',
      //     {
      //       instrumenterConfig: {
      //         embedSource: true
      //       }
      //     }
      //   ]
      // ]
    }

    // coverageReporter: {
    //   reporters: [
    //     { type: 'text' },
    //     { type: 'html' },
    //     { type: 'json' }
    //   ]
    // }
  });
};
