'use strict';

var Analytics = require('@segment/analytics.js-core').constructor;
var each = require('component-each');
var integration = require('@segment/analytics.js-integration');
var sandbox = require('@segment/clear-env');
var tester = require('@segment/analytics.js-integration-tester');
var KilometerIntegration = require('../lib/');

describe('Kilometer.io', function() {
  var kilometerIntegration;
  var analytics;
  var options = {
    app_id: 'abcdefghi1234567890'
  };

  beforeEach(function() {
    analytics = new Analytics();
    kilometerIntegration = new KilometerIntegration(options);
    analytics.use(KilometerIntegration);
    analytics.use(tester);
    analytics.add(kilometerIntegration);
  });

  afterEach(function() {
    analytics.restore();
    analytics.reset();
    kilometerIntegration.reset();
    sandbox();
  });

  it('should have the right settings', function() {
    analytics.compare(KilometerIntegration, integration('Kilometer.io')
        .global('KilometerIntegration')
        .option('app_id', '')
        .tag('<script src="//static.kilometer.io/js/events-api-client2.js">'));
  });

  describe('before loading', function() {
    beforeEach(function() {
      analytics.stub(KilometerIntegration, 'load');
    });

    describe('#initialize', function() {
      it('should create window.Kilometer', function() {
        analytics.assert(!window.Kilometer);
        analytics.initialize();
        analytics.assert(window.Kilometer);
      });


      it('should stub window.kilometerIntegration with the right methods', function() {
        // transmitEvent identify addUser setUserProperties increaseUserProperty decreaseUserProperty
        var methods = ['track', 'initialize', 'identify', 'loaded'];
        analytics.assert(!window.KilometerIntegration);
        analytics.initialize();
        each(methods, function(method) {
          analytics.assert(window.KilometerIntegration[method]);
        });
      });


      it('should stub window.Kilometer with the right methods', function() {
        // transmitEvent identify addUser setUserProperties increaseUserProperty decreaseUserProperty
        var methods = ['transmitEvent', 'identify', 'addUser', 'setUserProperties', 'increaseUserProperty', 'decreaseUserProperty'];
        analytics.assert(!window.Kilometer);
        analytics.initialize();
        each(methods, function(method) {
          analytics.assert(window.Kilometer[method]);
        });
      });

      it('should set window.Kilometer.app_id', function() {
        analytics.assert(!window.Kilometer);
        analytics.initialize();
        analytics.assert(window.Kilometer.app_id === options.app_id);
      });

      it('should call #load', function() {
        analytics.initialize();
        analytics.called(kilometerIntegration.load);
      });
    });
  });

  describe('loading', function() {
    it('should load', function(done) {
      analytics.load(kilometerIntegration, done);
    });
  });

  describe('after loading', function() {
    beforeEach(function(done) {
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    describe('#identify', function() {
      beforeEach(function() {
        analytics.stub(window.Kilometer, 'identify');
        analytics.stub(window.Kilometer, 'setUserProperties');
      });

      it('should send traits', function() {
        analytics.identify({ trait: true, number: 1 });
        analytics.called(window.Kilometer.setUserProperties, { trait: true, number: 1 });
      });

      /*
      it('should alias email to _email', function() {
        analytics.identify({ trait: true, email: 'email@email.org' });
        analytics.called(window.Kilometer.setUserProperties, { trait: true, _email: 'email@email.org' });
      });
      */

      it('should send id as handle', function() {
        analytics.identify('id');
        analytics.called(window.Kilometer.identify, 'id');
      });

      it('should send id as handle and traits', function() {
        analytics.identify('id', { trait: 'trait' });
        analytics.called(window.Kilometer.identify, 'id');
        analytics.called(window.Kilometer.setUserProperties, { trait: 'trait' });
      });

      it('should flatten nested objects and arrays', function() {
        analytics.identify('id', {
          email: 'teemo@teemo.com',
          property: 3,
          foo: {
            bar: {
              hello: 'teemo'
            },
            cheese: ['1', 2, 'cheers'],
            products: [
              { A: 'Jello' },
              { B: 'Peanut' }
            ]
          }
        });
        analytics.called(window.Kilometer.identify, 'id');
        analytics.called(window.Kilometer.setUserProperties, {
          custom_properties: 3,
          'foo.bar.hello': 'teemo',
          'foo.cheese': '[\"1\",2,\"cheers\"]',
          'foo.products': '[{\"A\":\"Jello\"},{\"B\":\"Peanut\"}]'
        });
      });

      it('should send date traits as ISOStrings', function() {
        var date = new Date('2016');
        analytics.identify('id', { date: date });
        analytics.called(window.Kilometer.identify, 'id');
        analytics.called(window.Kilometer.setUserProperties, { date: '2016-01-01T00:00:00.000Z' });
      });
    });

    describe('#track', function() {
      beforeEach(function() {
        analytics.stub(window.kilometerIntegration, 'track');
      });

      it('should send an event', function() {
        analytics.track('event');
        analytics.called(window.kilometerIntegration.track, 'event');
      });

      it('should send an event and properties', function() {
        analytics.track('event', { property: true });
        analytics.called(window.kilometerIntegration.track, 'event', { property: true });
      });

      it('should flatten nested objects and arrays', function() {
        analytics.track('event', {
          property: 3,
          foo: {
            bar: {
              hello: 'teemo'
            },
            cheese: ['1', 2, 'cheers'],
            products: [
              { A: 'Jello' },
              { B: 'Peanut' }
            ]
          }
        });
        analytics.called(window.kilometerIntegration.track, 'event', {
          property: 3,
          'foo.bar.hello': 'teemo',
          'foo.cheese': '[\"1\",2,\"cheers\"]',
          'foo.products': '[{\"A\":\"Jello\"},{\"B\":\"Peanut\"}]'
        });
      });
    });
  });
});