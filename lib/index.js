'use strict';

/**
 * Module dependencies.
 */

var integration = require('@segment/analytics.js-integration');
var is = require('is');
var extend = require('@ndhoule/extend');

/**
 * Expose `KilometerIntegration` integration.
 */
var KilometerIntegration = module.exports = integration('Kilometer.io')
    .global('kilometerIntegration')
    .option('apiKey', '')
    .tag('<script src="//static.kilometer.io/events-api-client.js">');

/**
 * Initialize.
 *
 * https://kilometer.readme.io/
 *
 * @api public
 */

KilometerIntegration.prototype.initialize = function() {
  console.log('Entered KilometerIntegration.prototype.initialize()');

  // Where to get Events API client from
  var eventsApiClientUrl = window.kilometerEventsApiClientUrl || null;

  // Where to send direct Kilometer API calls
  var eventsApiUri = this.options.endPoint || window.kilometerEventsApiUrl || null;

  // Where to get Visualizer and its sources from
  var visualizerSourceUrl = this.options.visualizerSourceUrl || window.kilometerVisualizerSourceUrl || null;

  // Where to send Visualizer API calls
  var visualizerApiUrl = this.options.webUrl || this.options.endPoint || window.kilometerVisualizerApiUrl || null;

  /* eslint-disable */
  (function(e,t){if(!t.__SV){window.Kilometer=t;var n=e.createElement("script");n.type="text/javascript";
    n.src=eventsApiClientUrl||"http"+("https:"===e.location.protocol?"s":"")+'://static.kilometer.io/events-api-client.js';
    n.async=!0;var r=e.getElementsByTagName("script")[0];r.parentNode.insertBefore(n,r);
    t.init=function(k,e,w,x){t.app_id=k||null;t.endPoint=e||null;t.webUrl=w||null;t.visualizerSourceUrl=x||null;t._execQueue=[];
      var m="transmitEvent identify addUser setUserProperties increaseUserProperty decreaseUserProperty updateGroupProperties linkUserToGroup".split(" ");
      for(var n=0;n<m.length;n++){var f=function(){var r=m[n];var s=function(){t._execQueue.push({m:r,args:arguments})};
        var i=r.split(".");if(i.length==2){if(!t[i[0]]){t[i[0]]=[]}t[i[0]][i[1]]=s}else{t[r]=s}}();}};t.__SV=1}
  })(document,window.Kilometer||[]);
  /* eslint-enable */

  // var endPoint = this.options.endPoint || 'events.stage.kilometer.io';
  // var webUrl = this.options.webUrl || 'app.stage.kilometer.io/events/save/';
  window.Kilometer.init(this.options.apiKey, eventsApiUri, visualizerApiUrl, visualizerSourceUrl);
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @api private
 * @return {boolean}
 */

KilometerIntegration.prototype.loaded = function() {
  console.log('Entered KilometerIntegration.prototype.loaded()');
  return !!(window.Kilometer && window.Kilometer.app_id);
};

/**
 * Identify.
 *
 * https://kilometer.readme.io/
 *
 * @api public
 * @param {Identify} identify
 */
KilometerIntegration.prototype.identify = function(identify) {
  console.log('Entered KilometerIntegration.prototype.identify()');
  var identifiedUserID = identify.userId();
  console.log('Entered KilometerIntegration.prototype.identify() : identifiedUserID=(' + identifiedUserID + ')');
  if (identifiedUserID) {
    console.log('Entered KilometerIntegration.prototype.identify() : Calling window.Kilometer.identify(' + identifiedUserID + ')');
    window.Kilometer.identify(identifiedUserID);
    var traits = identify.traits();
    console.log('Entered KilometerIntegration.prototype.identify() : Calling window.Kilometer.setUserProperties(', traits ,')');

    /* eslint-disable */
    if (traits.hasOwnProperty('id') && traits['id'] === identifiedUserID) {
      delete traits['id'];
    }
    /* eslint-enable */

    if (Object.keys(traits).length > 0) {
      window.Kilometer.setUserProperties(clean(traits));
    }
  }
};

/**
 * Track.
 *
 * https://kilometer.readme.io/
 *
 * @api public
 * @param {Track} track
 */

KilometerIntegration.prototype.track = function(track) {
  console.log('Entered KilometerIntegration.prototype.track() : invoke Kilometer.transmitEvent(' , track.event() , ', ', clean(track.properties()) , ')');
  window.Kilometer.transmitEvent(track.event(), clean(track.properties()));
};

/**
 * Group.
 *
 * https://kilometer.readme.io/
 *
 * @api public
 * @param {Group} group
 */
KilometerIntegration.prototype.group = function(group) {
  console.log('Entered KilometerIntegration.prototype.group()');

  var user = this.analytics.user();
  var userId = user.id();
  var groupId = group.groupId();
  var traits = group.traits();
  console.log('Entered KilometerIntegration.prototype.group() : groupId=' + groupId + '; userId=' + userId + '; traits=', traits);

  if (userId) {
    console.log('Entered KilometerIntegration.prototype.group() : invoking Kilometer.linkUserToGroup(' + groupId + ', ' + userId + ')');
    window.Kilometer.linkUserToGroup(groupId, userId);
  }

  if (Object.keys(traits).length > 0) {
    /* eslint-disable */
    if (traits.hasOwnProperty('id') && traits['id'] === groupId) {
      delete traits['id'];
    }
    /* eslint-enable */

    if (Object.keys(traits).length > 0) {
      console.log('Entered KilometerIntegration.prototype.group() : invoking Kilometer.updateGroupProperties(' + groupId + ', ', clean(traits), ')');
      window.Kilometer.updateGroupProperties(groupId, clean(traits));
    }
  }
};


/**
 * Alias.
 *
 * https://kilometer.readme.io/
 *
 * @api public
 * @param {Alias} alias
 */
/* eslint-disable */
KilometerIntegration.prototype.alias = function(alias) {
  // Not supportd method - do nothing.
  return;
};
/* eslint-enable */


/**
 * Clean all nested objects and arrays.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function clean(obj) {
  var ret = {};

  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      var value = obj[k];
      if (value == null) {
        continue;
      }

      // date
      if (is.date(value)) {
        ret[k] = value.toISOString();
        continue;
      }

      // leave boolean as is
      if (typeof value === 'boolean') {
        ret[k] = value;
        continue;
      }

      // leave  numbers as is
      if (is.number(value)) {
        ret[k] = value;
        continue;
      }

      // non objects
      if (value.toString() !== '[object Object]') {
        ret[k] = value.toString();
        continue;
      }

      // json
      // must flatten including the name of the original trait/property
      var nestedObj = {};
      nestedObj[k] = value;
      var flattenedObj = flatten(nestedObj, { safe: true });

      // stringify arrays inside nested object to be consistent with top level behavior of arrays
      for (var key in flattenedObj) {
        if (is.array(flattenedObj[key])) flattenedObj[key] = window.JSON.stringify(flattenedObj[key]);
      }

      ret = extend(ret, flattenedObj);
      delete ret[k];
    }
  }

  return ret;
}

/**
 * Flatten nested objects
 * taken from https://www.npmjs.com/package/flat
 * @param {Object} obj
 * @return {Object} obj
 * @api public
 */

function flatten(target, opts) {
  opts = opts || {};

  var delimiter = opts.delimiter || '.';
  var maxDepth = opts.maxDepth;
  var currentDepth = 1;
  var output = {};

  function step(object, prev) {
    Object.keys(object).forEach(function(key) {
      var value = object[key];
      var isarray = opts.safe && Array.isArray(value);
      var type = Object.prototype.toString.call(value);
      var isobject = type === '[object Object]' || type === '[object Array]';

      var newKey = prev
          ? prev + delimiter + key
          : key;

      if (!opts.maxDepth) {
        maxDepth = currentDepth + 1;
      }

      if (!isarray && isobject && Object.keys(value).length && currentDepth < maxDepth) {
        ++currentDepth;
        return step(value, newKey);
      }

      output[newKey] = value;
    });
  }

  step(target);

  return output;
}

/**
 * Polyfill Object.keys
 * // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 * Note: Had to do this because for some reason, the above will not work properly without using Object.keys
 */

if (!Object.keys) {
  Object.keys = function(o) {
    if (o !== Object(o)) {
      throw new TypeError('Object.keys called on a non-object');
    }
    var k = [];
    var p;
    for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
    return k;
  };
}
