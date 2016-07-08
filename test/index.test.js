'use strict';

var Analytics = require('@segment/analytics.js-core').constructor;
// var each = require('component-each');
var integration = require('@segment/analytics.js-integration');
var sandbox = require('@segment/clear-env');
var tester = require('@segment/analytics.js-integration-tester');
var KilometerIntegration = require('../lib/');

describe('Kilometer.io', function() {
  var kilometerIntegration;
  var analytics;
  var options = {
    app_id: 'fakeId',
    endPoint: 'events.stage.kilometer.io',
    webUrl: 'app.stage.kilometer.io/events/save/'
  };

  beforeEach(function() {
    console.log('Entered test Kilometer.io > beforeEach()');
    analytics = new Analytics();
    kilometerIntegration = new KilometerIntegration(options);
    analytics.use(KilometerIntegration);
    analytics.use(tester);
    analytics.add(kilometerIntegration);
  });

  afterEach(function() {
    console.log('Entered test Kilometer.io > afterEach()');
    analytics.restore();
    analytics.reset();
    kilometerIntegration.reset();
    sandbox();
  });

  it('should have the right settings', function() {
    console.log('Entered test Kilometer.io > it(should have the right settings)');
    analytics.compare(KilometerIntegration, integration('Kilometer.io')
        .global('kilometerIntegration')
        .option('app_id', '')
        .tag('<script src="//static.kilometer.io/staging/js/events-api-client2.js.js">'));
  });

  describe('before loading', function() {
    beforeEach(function() {
      console.log('Entered test Kilometer.io > before loading > beforeEach()');
      analytics.stub(kilometerIntegration, 'load');
    });

    afterEach(function() {
      console.log('Entered test Kilometer.io > before loading > afterEach()');
      if (typeof window.Kilometer !== 'undefined' || window.Kilometer !== null) {
        window.Kilometer = null;
      }
    });

    describe('#initialize', function() {
      it('should create window.Kilometer', function() {
        console.log('Entered test Kilometer.io > before loading > #initialize > it(should create window.Kilometer)');
        analytics.assert(!window.Kilometer);
        analytics.initialize();
        analytics.assert(window.Kilometer);
      });

      it('should stub window.Kilometer with the right methods', function() {
        console.log('Entered test Kilometer.io > before loading > #initialize > it(should stub window.Kilometer with the right methods)');
        // transmitEvent identify addUser setUserProperties increaseUserProperty decreaseUserProperty
        var methods = ['transmitEvent', 'identify', 'addUser', 'setUserProperties', 'increaseUserProperty', 'decreaseUserProperty'];
        analytics.assert(!window.Kilometer);
        analytics.initialize();
        analytics.assert(window.Kilometer);

        /*
        // Print Kilometer object's fields
        for (var key in window.Kilometer) {
          if (key) {
            console.log('Entered test Kilometer.io > before loading > #initialize > it(should stub window.Kilometer with the right methods) : Kilometer.' + key + ' = ' + window.Kilometer[key]);
          }
        }
        */

        // Print Kilometer object's fields
        /*
        for (var key in analytics) {
          // var keys = ['Integrations', 'options', '_user', 'spy', 'stub', 'restore', 'spies', 'called', 'load', 'loaded', 'integration', '']

          if (key) {
            console.log('Entered test Kilometer.io > before loading > #initialize > it(should stub window.Kilometer with the right methods) : analytics.' + key + ' = ' + analytics[key]);
          }
        }
        */

        /*
        var integration = analytics.integration('Kilometer.io');
        console.log('Entered test Kilometer.io > before loading > #initialize > it(should stub window.Kilometer with the right methods) : analytics.integration[Kilometer.io] = ' + integration);
        for (var m in integration) {
          if (m) {
            console.log('Entered test Kilometer.io > before loading > #initialize > it(should stub window.Kilometer with the right methods) : analytics.integration[Kilometer.io].' + m + ' = ' + integration[m]);
          }
        }
        */

        /*
        var Integrations = analytics.Integrations;
        for (var _i in Integrations) {
          if (_i) {
            console.log('Entered test Kilometer.io > before loading > #initialize > it(should stub window.Kilometer with the right methods) : analytics.Integrations.' + _i + ' = ' + Integrations[_i]);
          }
        }
        */

        methods.forEach(function(method) {
          analytics.assert(window.Kilometer[method]);
        });
      });

      it('should set window.Kilometer.app_id', function() {
        console.log('Entered test Kilometer.io > before loading > #initialize > it(should set window.Kilometer.app_id)');
        analytics.assert(!window.Kilometer);
        analytics.initialize();
        analytics.assert(window.Kilometer.app_id === options.app_id);
      });

      it('should call #load', function() {
        console.log('Entered test Kilometer.io > before loading > #initialize > it(should call #load)');
        analytics.initialize();
        analytics.called(kilometerIntegration.load);
      });
    });
  });

  describe('loading', function() {
    it('should load', function(done) {
      console.log('Entered test Kilometer.io > loading > it(should load)');
      // console.log('Entered test Kilometer.io > loading > it(should load) : analytics.load = ' + analytics['load']);
      // console.log('Entered test Kilometer.io > loading > it(should load) : analytics.load = ' + analytics['load']);
      analytics.load(kilometerIntegration, done);
    });
  });


  describe('after loading', function() {
    beforeEach(function(done) {
      sandbox();
      analytics.once('ready', done);
      analytics.initialize();
      analytics.page();
    });

    afterEach(function() {
      console.log('Entered test Kilometer.io > after loading > afterEach()');
      //  if (typeof window.Kilometer !== 'undefined' || window.Kilometer !== null) {
      //  window.Kilometer = null;
      // }
      // sandbox();
    });


    describe('#identify', function() {
      beforeEach(function() {
        sandbox();
        analytics.stub(window.Kilometer, 'identify');
        analytics.stub(window.Kilometer, 'setUserProperties');
      });

      // afterEach(function() {
      //  sandbox();
      //  analytics = null;
      //  window.Kilometer = null;
      // });

      it('if no user id is specified - do not do anything', function() {
        analytics.identify({ trait: true, number: 1 });
        analytics.didNotCall(window.Kilometer.identify);
        analytics.didNotCall(window.Kilometer.setUserProperties);
      });

      it('should send traits', function() {
        sandbox();
        analytics.identify('vasya2', { trait: true, number: 1 });
        analytics.called(window.Kilometer.setUserProperties, { trait: true, number: 1 });
      });


      it('should send id as handle', function() {
        analytics.identify('id');
        analytics.called(window.Kilometer.identify, 'id');
      });

      it('should send id as handle and traits', function() {
        sandbox();
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
          email: 'teemo@teemo.com',
          property: 3,
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
        analytics.stub(window.Kilometer, 'transmitEvent');
      });

      it('should send an event', function() {
        analytics.track('event');
        analytics.called(window.Kilometer.transmitEvent, 'event');
      });

      it('should send an event and properties', function() {
        analytics.track('event', { property: true });
        analytics.called(window.Kilometer.transmitEvent, 'event', { property: true });
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
        analytics.called(window.Kilometer.transmitEvent, 'event', {
          property: 3,
          'foo.bar.hello': 'teemo',
          'foo.cheese': '[\"1\",2,\"cheers\"]',
          'foo.products': '[{\"A\":\"Jello\"},{\"B\":\"Peanut\"}]'
        });
      });
    });
  });
});
