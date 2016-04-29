(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var InjectData = Package['meteorhacks:inject-data'].InjectData;
var Picker = Package['meteorhacks:picker'].Picker;
var MeteorX = Package['meteorhacks:meteorx'].MeteorX;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var Random = Package.random.Random;

/* Package-scope variables */
var AddedToChanged, ApplyDDP, DeepExtend, FastRender, IsAppUrl, PublishContext, Context;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/meteorhacks_fast-render/lib/utils.js                                                                  //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
AddedToChanged = function(localCopy, added) {                                                                     // 1
  added.msg = "changed";                                                                                          // 2
  added.cleared = [];                                                                                             // 3
  added.fields = added.fields || {};                                                                              // 4
                                                                                                                  // 5
  _.each(localCopy, function(value, key) {                                                                        // 6
    if(key != '_id') {                                                                                            // 7
      if(typeof added.fields[key] == "undefined") {                                                               // 8
        added.cleared.push(key);                                                                                  // 9
      }                                                                                                           // 10
    }                                                                                                             // 11
  });                                                                                                             // 12
};                                                                                                                // 13
                                                                                                                  // 14
ApplyDDP = function(existing, message) {                                                                          // 15
  var newDoc = (!existing)? {}: _.clone(existing);                                                                // 16
  if(message.msg == 'added') {                                                                                    // 17
    _.each(message.fields, function(value, key) {                                                                 // 18
      newDoc[key] = value;                                                                                        // 19
    });                                                                                                           // 20
  } else if(message.msg == "changed") {                                                                           // 21
    _.each(message.fields, function(value, key) {                                                                 // 22
      newDoc[key] = value;                                                                                        // 23
    });                                                                                                           // 24
    _.each(message.cleared, function(key) {                                                                       // 25
      delete newDoc[key];                                                                                         // 26
    });                                                                                                           // 27
  } else if(message.msg == "removed") {                                                                           // 28
    newDoc = null;                                                                                                // 29
  }                                                                                                               // 30
                                                                                                                  // 31
  return newDoc;                                                                                                  // 32
};                                                                                                                // 33
                                                                                                                  // 34
// source: https://gist.github.com/kurtmilam/1868955                                                              // 35
//  modified a bit to not to expose this as an _ api                                                              // 36
DeepExtend = function deepExtend (obj) {                                                                          // 37
  var parentRE = /#{\s*?_\s*?}/,                                                                                  // 38
      slice = Array.prototype.slice,                                                                              // 39
      hasOwnProperty = Object.prototype.hasOwnProperty;                                                           // 40
                                                                                                                  // 41
  _.each(slice.call(arguments, 1), function(source) {                                                             // 42
    for (var prop in source) {                                                                                    // 43
      if (hasOwnProperty.call(source, prop)) {                                                                    // 44
        if (_.isNull(obj[prop]) || _.isUndefined(obj[prop]) || _.isFunction(obj[prop]) || _.isNull(source[prop]) || _.isDate(source[prop])) {
          obj[prop] = source[prop];                                                                               // 46
        }                                                                                                         // 47
        else if (_.isString(source[prop]) && parentRE.test(source[prop])) {                                       // 48
          if (_.isString(obj[prop])) {                                                                            // 49
            obj[prop] = source[prop].replace(parentRE, obj[prop]);                                                // 50
          }                                                                                                       // 51
        }                                                                                                         // 52
        else if (_.isArray(obj[prop]) || _.isArray(source[prop])){                                                // 53
          if (!_.isArray(obj[prop]) || !_.isArray(source[prop])){                                                 // 54
            throw 'Error: Trying to combine an array with a non-array (' + prop + ')';                            // 55
          } else {                                                                                                // 56
            obj[prop] = _.reject(DeepExtend(obj[prop], source[prop]), function (item) { return _.isNull(item);});
          }                                                                                                       // 58
        }                                                                                                         // 59
        else if (_.isObject(obj[prop]) || _.isObject(source[prop])){                                              // 60
          if (!_.isObject(obj[prop]) || !_.isObject(source[prop])){                                               // 61
            throw 'Error: Trying to combine an object with a non-object (' + prop + ')';                          // 62
          } else {                                                                                                // 63
            obj[prop] = DeepExtend(obj[prop], source[prop]);                                                      // 64
          }                                                                                                       // 65
        } else {                                                                                                  // 66
          obj[prop] = source[prop];                                                                               // 67
        }                                                                                                         // 68
      }                                                                                                           // 69
    }                                                                                                             // 70
  });                                                                                                             // 71
  return obj;                                                                                                     // 72
};                                                                                                                // 73
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/meteorhacks_fast-render/lib/server/namespace.js                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
FastRender = {                                                                                                    // 1
  _routes: [],                                                                                                    // 2
  _onAllRoutes: []                                                                                                // 3
};                                                                                                                // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/meteorhacks_fast-render/lib/server/utils.js                                                           //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
// meteor algorithm to check if this is a meteor serving http request or not                                      // 1
IsAppUrl = function (req) {                                                                                       // 2
  var url = req.url                                                                                               // 3
  if(url === '/favicon.ico' || url === '/robots.txt') {                                                           // 4
    return false;                                                                                                 // 5
  }                                                                                                               // 6
                                                                                                                  // 7
  // NOTE: app.manifest is not a web standard like favicon.ico and                                                // 8
  // robots.txt. It is a file name we have chosen to use for HTML5                                                // 9
  // appcache URLs. It is included here to prevent using an appcache                                              // 10
  // then removing it from poisoning an app permanently. Eventually,                                              // 11
  // once we have server side routing, this won't be needed as                                                    // 12
  // unknown URLs with return a 404 automatically.                                                                // 13
  if(url === '/app.manifest') {                                                                                   // 14
    return false;                                                                                                 // 15
  }                                                                                                               // 16
                                                                                                                  // 17
  // Avoid serving app HTML for declared routes such as /sockjs/.                                                 // 18
  if(RoutePolicy.classify(url)) {                                                                                 // 19
    return false;                                                                                                 // 20
  }                                                                                                               // 21
                                                                                                                  // 22
  // we only need to support HTML pages only                                                                      // 23
  // this is a check to do it                                                                                     // 24
  return /html/.test(req.headers['accept']);                                                                      // 25
};                                                                                                                // 26
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/meteorhacks_fast-render/lib/server/routes.js                                                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var Fiber = Npm.require('fibers');                                                                                // 1
FastRender._onAllRoutes = [];                                                                                     // 2
FastRender.frContext = new Meteor.EnvironmentVariable();                                                          // 3
                                                                                                                  // 4
var fastRenderRoutes = Picker.filter(function(req, res) {                                                         // 5
  return IsAppUrl(req);                                                                                           // 6
});                                                                                                               // 7
fastRenderRoutes.middleware(Npm.require('connect').cookieParser());                                               // 8
fastRenderRoutes.middleware(function(req, res, next) {                                                            // 9
  FastRender.handleOnAllRoutes(req, res, next);                                                                   // 10
});                                                                                                               // 11
                                                                                                                  // 12
// handling specific routes                                                                                       // 13
FastRender.route = function route(path, callback) {                                                               // 14
  if(path.indexOf('/') !== 0){                                                                                    // 15
    throw new Error('Error: path (' + path + ') must begin with a leading slash "/"')                             // 16
  }                                                                                                               // 17
  fastRenderRoutes.route(path, FastRender.handleRoute.bind(null, callback));                                      // 18
};                                                                                                                // 19
                                                                                                                  // 20
function setQueryDataCallback(res, next) {                                                                        // 21
  return function(queryData) {                                                                                    // 22
    if(!queryData) return next();                                                                                 // 23
                                                                                                                  // 24
    var existingPayload = InjectData.getData(res, "fast-render-data");                                            // 25
    if(!existingPayload) {                                                                                        // 26
      InjectData.pushData(res, "fast-render-data", queryData);                                                    // 27
    } else {                                                                                                      // 28
      // it's possible to execute this callback twice                                                             // 29
      // the we need to merge exisitng data with the new one                                                      // 30
      _.extend(existingPayload.subscriptions, queryData.subscriptions);                                           // 31
      _.each(queryData.collectionData, function(data, pubName) {                                                  // 32
        var existingData = existingPayload.collectionData[pubName]                                                // 33
        if(existingData) {                                                                                        // 34
          data = existingData.concat(data);                                                                       // 35
        }                                                                                                         // 36
                                                                                                                  // 37
        existingPayload.collectionData[pubName] = data;                                                           // 38
        InjectData.pushData(res, 'fast-render-data', existingPayload);                                            // 39
      });                                                                                                         // 40
    }                                                                                                             // 41
    next();                                                                                                       // 42
  };                                                                                                              // 43
}                                                                                                                 // 44
                                                                                                                  // 45
FastRender.handleRoute = function(processingCallback, params, req, res, next) {                                   // 46
  var afterProcessed = setQueryDataCallback(res, next);                                                           // 47
  FastRender._processRoutes(params, req, processingCallback, afterProcessed);                                     // 48
};                                                                                                                // 49
                                                                                                                  // 50
FastRender.handleOnAllRoutes = function(req, res, next) {                                                         // 51
  var afterProcessed = setQueryDataCallback(res, next);                                                           // 52
  FastRender._processAllRoutes(req, afterProcessed);                                                              // 53
};                                                                                                                // 54
                                                                                                                  // 55
FastRender.onAllRoutes = function onAllRoutes(callback) {                                                         // 56
  FastRender._onAllRoutes.push(callback);                                                                         // 57
};                                                                                                                // 58
                                                                                                                  // 59
FastRender._processRoutes =                                                                                       // 60
  function _processRoutes(params, req, routeCallback, callback) {                                                 // 61
  callback = callback || function() {};                                                                           // 62
                                                                                                                  // 63
  var path = req.url;                                                                                             // 64
  var loginToken = req.cookies['meteor_login_token'];                                                             // 65
  var headers = req.headers;                                                                                      // 66
                                                                                                                  // 67
  var context = new Context(loginToken, { headers: headers });                                                    // 68
                                                                                                                  // 69
  try {                                                                                                           // 70
    FastRender.frContext.withValue(context, function() {                                                          // 71
      routeCallback.call(context, params, path);                                                                  // 72
    });                                                                                                           // 73
                                                                                                                  // 74
    if(context.stop) {                                                                                            // 75
      return;                                                                                                     // 76
    }                                                                                                             // 77
                                                                                                                  // 78
    callback(context.getData());                                                                                  // 79
  } catch(err) {                                                                                                  // 80
    handleError(err, path, callback);                                                                             // 81
  }                                                                                                               // 82
};                                                                                                                // 83
                                                                                                                  // 84
FastRender._processAllRoutes =                                                                                    // 85
  function _processAllRoutes(req, callback) {                                                                     // 86
  callback = callback || function() {};                                                                           // 87
                                                                                                                  // 88
  var path = req.url;                                                                                             // 89
  var loginToken = req.cookies['meteor_login_token'];                                                             // 90
  var headers = req.headers;                                                                                      // 91
                                                                                                                  // 92
  new Fiber(function() {                                                                                          // 93
    var context = new Context(loginToken, { headers: headers });                                                  // 94
                                                                                                                  // 95
    try {                                                                                                         // 96
      FastRender._onAllRoutes.forEach(function(callback) {                                                        // 97
        callback.call(context, req.url);                                                                          // 98
      });                                                                                                         // 99
                                                                                                                  // 100
      callback(context.getData());                                                                                // 101
    } catch(err) {                                                                                                // 102
      handleError(err, path, callback);                                                                           // 103
    }                                                                                                             // 104
  }).run();                                                                                                       // 105
};                                                                                                                // 106
                                                                                                                  // 107
function handleError(err, path, callback) {                                                                       // 108
  var message =                                                                                                   // 109
    'error on fast-rendering path: ' +                                                                            // 110
    path +                                                                                                        // 111
    " ; error: " + err.stack;                                                                                     // 112
  console.error(message);                                                                                         // 113
  callback(null);                                                                                                 // 114
}                                                                                                                 // 115
                                                                                                                  // 116
// adding support for null publications                                                                           // 117
FastRender.onAllRoutes(function() {                                                                               // 118
  var context = this;                                                                                             // 119
  var nullHandlers = Meteor.default_server.universal_publish_handlers;                                            // 120
                                                                                                                  // 121
  if(nullHandlers) {                                                                                              // 122
    nullHandlers.forEach(function(publishHandler) {                                                               // 123
      // universal subs have subscription ID, params, and name undefined                                          // 124
      var publishContext = new PublishContext(context, publishHandler);                                           // 125
      context.processPublication(publishContext);                                                                 // 126
    });                                                                                                           // 127
  }                                                                                                               // 128
});                                                                                                               // 129
                                                                                                                  // 130
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/meteorhacks_fast-render/lib/server/publish_context.js                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
PublishContext = function PublishContext(context, handler, subscriptionId, params, name) {                        // 1
  var self = this;                                                                                                // 2
                                                                                                                  // 3
  // mock session                                                                                                 // 4
  var sessionId = Random.id();                                                                                    // 5
  var session = {                                                                                                 // 6
    id: sessionId,                                                                                                // 7
    userId: context.userId,                                                                                       // 8
    // not null                                                                                                   // 9
    inQueue: {},                                                                                                  // 10
    connectionHandle: {                                                                                           // 11
      id: sessionId,                                                                                              // 12
      close: function() {},                                                                                       // 13
      onClose: function() {},                                                                                     // 14
      clientAddress: "127.0.0.1",                                                                                 // 15
      httpHeaders: context.headers                                                                                // 16
    },                                                                                                            // 17
    added: function (subscriptionHandle, collectionName, strId, fields) {                                         // 18
      // Don't share state with the data passed in by the user.                                                   // 19
      var doc = EJSON.clone(fields);                                                                              // 20
      doc._id = self._idFilter.idParse(strId);                                                                    // 21
      Meteor._ensure(self._collectionData, collectionName)[strId] = doc;                                          // 22
    },                                                                                                            // 23
    changed: function (subscriptionHandle, collectionName, strId, fields) {                                       // 24
      var doc = self._collectionData[collectionName][strId];                                                      // 25
      if (!doc) throw new Error("Could not find element with id " + strId + " to change");                        // 26
      _.each(fields, function (value, key) {                                                                      // 27
        // Publish API ignores _id if present in fields.                                                          // 28
        if (key === "_id")                                                                                        // 29
          return;                                                                                                 // 30
                                                                                                                  // 31
        if (value === undefined) {                                                                                // 32
          delete doc[key];                                                                                        // 33
        }                                                                                                         // 34
        else {                                                                                                    // 35
          // Don't share state with the data passed in by the user.                                               // 36
          doc[key] = EJSON.clone(value);                                                                          // 37
        }                                                                                                         // 38
      });                                                                                                         // 39
    },                                                                                                            // 40
    removed: function (subscriptionHandle, collectionName, strId) {                                               // 41
      if (!(self._collectionData[collectionName] && self._collectionData[collectionName][strId]))                 // 42
        new Error("Removed nonexistent document " + strId);                                                       // 43
      delete self._collectionData[collectionName][strId];                                                         // 44
    },                                                                                                            // 45
    sendReady: function (subscriptionIds) {                                                                       // 46
      // this is called only for non-universal subscriptions                                                      // 47
      if (!self._subscriptionId) throw new Error("Assertion.");                                                   // 48
                                                                                                                  // 49
      // make the subscription be marked as ready                                                                 // 50
      if (!self._isDeactivated()) {                                                                               // 51
        self._context.completeSubscriptions(self._name, self._params);                                            // 52
      }                                                                                                           // 53
                                                                                                                  // 54
      // we just stop it                                                                                          // 55
      self.stop();                                                                                                // 56
    }                                                                                                             // 57
  };                                                                                                              // 58
                                                                                                                  // 59
  MeteorX.Subscription.call(self, session, handler, subscriptionId, params, name);                                // 60
                                                                                                                  // 61
  self.unblock = function() {};                                                                                   // 62
                                                                                                                  // 63
  self._context = context;                                                                                        // 64
  self._collectionData = {};                                                                                      // 65
};                                                                                                                // 66
                                                                                                                  // 67
PublishContext.prototype = Object.create(MeteorX.Subscription.prototype);                                         // 68
PublishContext.prototype.constructor = PublishContext;                                                            // 69
                                                                                                                  // 70
PublishContext.prototype.stop = function() {                                                                      // 71
  // our stop does not remove all documents (it just calls deactivate)                                            // 72
  // Meteor one removes documents for non-universal subscription                                                  // 73
  // we deactivate both for universal and named subscriptions                                                     // 74
  // hopefully this is right in our case                                                                          // 75
  // Meteor does it just for named subscriptions                                                                  // 76
  this._deactivate();                                                                                             // 77
};                                                                                                                // 78
                                                                                                                  // 79
PublishContext.prototype.error = function(error) {                                                                // 80
  // TODO: Should we pass the error to the subscription somehow?                                                  // 81
  console.warn('error caught on publication: ', this._name, ': ', (error.message || error));                      // 82
  this.stop();                                                                                                    // 83
};                                                                                                                // 84
                                                                                                                  // 85
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/meteorhacks_fast-render/lib/server/context.js                                                         //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var Fibers = Npm.require('fibers');                                                                               // 1
var Future = Npm.require('fibers/future');                                                                        // 2
                                                                                                                  // 3
Context = function Context(loginToken, otherParams) {                                                             // 4
  this._collectionData = {};                                                                                      // 5
  this._subscriptions = {};                                                                                       // 6
  this._loginToken = loginToken;                                                                                  // 7
                                                                                                                  // 8
  _.extend(this, otherParams);                                                                                    // 9
                                                                                                                  // 10
  // get the user                                                                                                 // 11
  if(Meteor.users) {                                                                                              // 12
    // check to make sure, we've the loginToken,                                                                  // 13
    // otherwise a random user will fetched from the db                                                           // 14
    if(loginToken) {                                                                                              // 15
      var hashedToken = loginToken && Accounts._hashLoginToken( loginToken );                                     // 16
      var query = {'services.resume.loginTokens.hashedToken': hashedToken };                                      // 17
      var options = {fields: {_id: 1}};                                                                           // 18
      var user = Meteor.users.findOne(query, options);                                                            // 19
    }                                                                                                             // 20
                                                                                                                  // 21
    // support for Meteor.user                                                                                    // 22
    Fibers.current._meteor_dynamics = {};                                                                         // 23
    Fibers.current._meteor_dynamics[DDP._CurrentInvocation.slot] = this;                                          // 24
                                                                                                                  // 25
    if(user) {                                                                                                    // 26
      this.userId = user._id;                                                                                     // 27
    }                                                                                                             // 28
  }                                                                                                               // 29
};                                                                                                                // 30
                                                                                                                  // 31
Context.prototype.subscribe = function(subName /*, params */) {                                                   // 32
  var self = this;                                                                                                // 33
                                                                                                                  // 34
  var publishHandler = Meteor.default_server.publish_handlers[subName];                                           // 35
  if(publishHandler) {                                                                                            // 36
    var params = Array.prototype.slice.call(arguments, 1);                                                        // 37
    // non-universal subs have subscription id                                                                    // 38
    var subscriptionId = Random.id();                                                                             // 39
    var publishContext = new PublishContext(this, publishHandler, subscriptionId, params, subName);               // 40
                                                                                                                  // 41
    return this.processPublication(publishContext);                                                               // 42
  } else {                                                                                                        // 43
    console.warn('There is no such publish handler named:', subName);                                             // 44
    return {};                                                                                                    // 45
  }                                                                                                               // 46
};                                                                                                                // 47
                                                                                                                  // 48
Context.prototype.processPublication = function(publishContext) {                                                 // 49
  var self = this;                                                                                                // 50
  var data = {};                                                                                                  // 51
  var ensureCollection = function(collectionName) {                                                               // 52
    self._ensureCollection(collectionName);                                                                       // 53
    if(!data[collectionName]) {                                                                                   // 54
      data[collectionName] = [];                                                                                  // 55
    }                                                                                                             // 56
  };                                                                                                              // 57
                                                                                                                  // 58
  var future = new Future();                                                                                      // 59
  // detect when the context is ready to be sent to the client                                                    // 60
  publishContext.onStop(function() {                                                                              // 61
    if(!future.isResolved()) {                                                                                    // 62
      future.return();                                                                                            // 63
    }                                                                                                             // 64
  });                                                                                                             // 65
                                                                                                                  // 66
  publishContext._runHandler();                                                                                   // 67
                                                                                                                  // 68
  if (!publishContext._subscriptionId) {                                                                          // 69
    // universal subscription, we stop it (same as marking it as ready) ourselves                                 // 70
    // they otherwise do not have ready or stopped state, but in our case they do                                 // 71
    publishContext.stop();                                                                                        // 72
  }                                                                                                               // 73
                                                                                                                  // 74
  if (!future.isResolved()) {                                                                                     // 75
    // don't wait forever for handler to fire ready()                                                             // 76
    Meteor.setTimeout(function() {                                                                                // 77
      if (!future.isResolved()) {                                                                                 // 78
        // publish handler failed to send ready signal in time                                                    // 79
        // maybe your non-universal publish handler is not calling this.ready()?                                  // 80
        // or maybe it is returning null to signal empty publish?                                                 // 81
        // it should still call this.ready() or return an empty array []                                          // 82
        var message =                                                                                             // 83
          'Publish handler for ' + publishContext._name +  ' sent no ready signal\n' +                            // 84
          ' This could be because this publication `return null`.\n' +                                            // 85
          ' Use `return this.ready()` instead.'                                                                   // 86
        console.warn();                                                                                           // 87
        future.return();                                                                                          // 88
      }                                                                                                           // 89
    }, 500);  // arbitrarially set timeout to 500ms, should probably be configurable                              // 90
                                                                                                                  // 91
    //  wait for the subscription became ready.                                                                   // 92
    future.wait();                                                                                                // 93
  }                                                                                                               // 94
                                                                                                                  // 95
  // stop any runaway subscription                                                                                // 96
  // this can happen if a publish handler never calls ready or stop, for example                                  // 97
  // it does not hurt to call it multiple times                                                                   // 98
  publishContext.stop();                                                                                          // 99
                                                                                                                  // 100
  // get the data                                                                                                 // 101
  _.each(publishContext._collectionData, function(collData, collectionName) {                                     // 102
    // making an array from a map                                                                                 // 103
    collData = _.values(collData);                                                                                // 104
                                                                                                                  // 105
    ensureCollection(collectionName);                                                                             // 106
    data[collectionName].push(collData);                                                                          // 107
                                                                                                                  // 108
    // copy the collection data in publish context into the FR context                                            // 109
    self._collectionData[collectionName].push(collData);                                                          // 110
  });                                                                                                             // 111
                                                                                                                  // 112
  return data;                                                                                                    // 113
};                                                                                                                // 114
                                                                                                                  // 115
Context.prototype.completeSubscriptions = function(name, params) {                                                // 116
  var subs = this._subscriptions[name];                                                                           // 117
  if(!subs) {                                                                                                     // 118
    subs = this._subscriptions[name] = {};                                                                        // 119
  }                                                                                                               // 120
                                                                                                                  // 121
  subs[EJSON.stringify(params)] = true;                                                                           // 122
};                                                                                                                // 123
                                                                                                                  // 124
Context.prototype._ensureCollection = function(collectionName) {                                                  // 125
  if(!this._collectionData[collectionName]) {                                                                     // 126
    this._collectionData[collectionName] = [];                                                                    // 127
  }                                                                                                               // 128
};                                                                                                                // 129
                                                                                                                  // 130
Context.prototype.getData = function() {                                                                          // 131
  return {                                                                                                        // 132
    collectionData: this._collectionData,                                                                         // 133
    subscriptions: this._subscriptions,                                                                           // 134
    loginToken: this._loginToken                                                                                  // 135
  };                                                                                                              // 136
};                                                                                                                // 137
                                                                                                                  // 138
FastRender._Context = Context;                                                                                    // 139
                                                                                                                  // 140
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/meteorhacks_fast-render/lib/server/iron_router_support.js                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
if(!Package['iron:router']) return;                                                                               // 1
                                                                                                                  // 2
var RouteController = Package['iron:router'].RouteController;                                                     // 3
var Router = Package['iron:router'].Router;                                                                       // 4
                                                                                                                  // 5
var currentSubscriptions = [];                                                                                    // 6
Meteor.subscribe = function(subscription) {                                                                       // 7
  currentSubscriptions.push(arguments);                                                                           // 8
};                                                                                                                // 9
                                                                                                                  // 10
//assuming, no runtime routes will be added                                                                       // 11
Meteor.startup(function() {                                                                                       // 12
  // this is trick to run the processRoutes at the                                                                // 13
  // end of all Meteor.startup callbacks                                                                          // 14
  Meteor.startup(processRoutes);                                                                                  // 15
});                                                                                                               // 16
                                                                                                                  // 17
function processRoutes() {                                                                                        // 18
  Router.routes.forEach(function(route) {                                                                         // 19
    route.options = route.options || {};                                                                          // 20
    if(route.options.fastRender) {                                                                                // 21
      handleRoute(route);                                                                                         // 22
    } else if(                                                                                                    // 23
        getController(route) &&                                                                                   // 24
        getController(route).prototype &&                                                                         // 25
        getController(route).prototype.fastRender                                                                 // 26
    ) {                                                                                                           // 27
      handleRoute(route);                                                                                         // 28
    }                                                                                                             // 29
  });                                                                                                             // 30
                                                                                                                  // 31
  // getting global waitOns                                                                                       // 32
  var globalWaitOns = [];                                                                                         // 33
  if(Router._globalHooks && Router._globalHooks.waitOn && Router._globalHooks.waitOn.length > 0) {                // 34
    Router._globalHooks.waitOn.forEach(function(waitOn) {                                                         // 35
      globalWaitOns.push(waitOn.hook);                                                                            // 36
    });                                                                                                           // 37
  }                                                                                                               // 38
                                                                                                                  // 39
  FastRender.onAllRoutes(function(path) {                                                                         // 40
    var self = this;                                                                                              // 41
                                                                                                                  // 42
    currentSubscriptions = [];                                                                                    // 43
    globalWaitOns.forEach(function(waitOn) {                                                                      // 44
      waitOn.call({path: path});                                                                                  // 45
    });                                                                                                           // 46
                                                                                                                  // 47
    currentSubscriptions.forEach(function(args) {                                                                 // 48
      self.subscribe.apply(self, args);                                                                           // 49
    });                                                                                                           // 50
  });                                                                                                             // 51
};                                                                                                                // 52
                                                                                                                  // 53
function handleRoute(route) {                                                                                     // 54
  var subscriptionFunctions = [];                                                                                 // 55
                                                                                                                  // 56
  // get potential subscription handlers from the route options                                                   // 57
  ['waitOn', 'subscriptions'].forEach(function(funcName) {                                                        // 58
    var handler = route.options[funcName];                                                                        // 59
    if(typeof handler == 'function') {                                                                            // 60
      subscriptionFunctions.push(handler);                                                                        // 61
    } else if (handler instanceof Array) {                                                                        // 62
      handler.forEach(function(func) {                                                                            // 63
        if(typeof func == 'function') {                                                                           // 64
          subscriptionFunctions.push(func);                                                                       // 65
        }                                                                                                         // 66
      });                                                                                                         // 67
    }                                                                                                             // 68
  });                                                                                                             // 69
                                                                                                                  // 70
  FastRender.route(getPath(route), onRoute);                                                                      // 71
                                                                                                                  // 72
  function onRoute(params, path) {                                                                                // 73
    var self = this;                                                                                              // 74
    var context = {                                                                                               // 75
      params: params,                                                                                             // 76
      path: path                                                                                                  // 77
    };                                                                                                            // 78
                                                                                                                  // 79
    //reset subscriptions;                                                                                        // 80
    currentSubscriptions = [];                                                                                    // 81
    subscriptionFunctions.forEach(function(func) {                                                                // 82
      func.call(context);                                                                                         // 83
    });                                                                                                           // 84
                                                                                                                  // 85
    // if there is a controller, try to initiate it and invoke potential                                          // 86
    // methods which could give us subscriptions                                                                  // 87
    var controller = getController(route);                                                                        // 88
    if(controller && controller.prototype) {                                                                      // 89
      if(typeof controller.prototype.lookupOption == 'function') {                                                // 90
        // for IR 1.0                                                                                             // 91
        // it is possible to create a controller invoke methods on it                                             // 92
        var controllerInstance = new controller();                                                                // 93
        controllerInstance.params = params;                                                                       // 94
        controllerInstance.path = path;                                                                           // 95
                                                                                                                  // 96
        ['waitOn', 'subscriptions'].forEach(function(funcName) {                                                  // 97
          if(controllerInstance[funcName]) {                                                                      // 98
            controllerInstance[funcName].call(controllerInstance);                                                // 99
          }                                                                                                       // 100
        });                                                                                                       // 101
      } else {                                                                                                    // 102
        // IR 0.9                                                                                                 // 103
        // hard to create a controller instance                                                                   // 104
        // so this is the option we can take                                                                      // 105
        var waitOn = controller.prototype.waitOn;                                                                 // 106
        if(waitOn) {                                                                                              // 107
          waitOn.call(context);                                                                                   // 108
        }                                                                                                         // 109
      }                                                                                                           // 110
    }                                                                                                             // 111
                                                                                                                  // 112
    currentSubscriptions.forEach(function(args) {                                                                 // 113
      self.subscribe.apply(self, args);                                                                           // 114
    });                                                                                                           // 115
  }                                                                                                               // 116
}                                                                                                                 // 117
                                                                                                                  // 118
function getPath(route) {                                                                                         // 119
  if(route._path) {                                                                                               // 120
    // for IR 1.0                                                                                                 // 121
    return route._path;                                                                                           // 122
  } else {                                                                                                        // 123
    // for IR 0.9                                                                                                 // 124
    var name = (route.name == "/")? "" : name;                                                                    // 125
    return route.options.path || ("/" + name);                                                                    // 126
  }                                                                                                               // 127
}                                                                                                                 // 128
                                                                                                                  // 129
function getController(route) {                                                                                   // 130
  if(route.findControllerConstructor) {                                                                           // 131
    // for IR 1.0                                                                                                 // 132
    return route.findControllerConstructor();                                                                     // 133
  } else if(route.findController) {                                                                               // 134
    // for IR 0.9                                                                                                 // 135
    return route.findController();                                                                                // 136
  } else {                                                                                                        // 137
    // unsupported version of IR                                                                                  // 138
    return null;                                                                                                  // 139
  }                                                                                                               // 140
}                                                                                                                 // 141
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteorhacks:fast-render'] = {
  FastRender: FastRender
};

})();

//# sourceMappingURL=meteorhacks_fast-render.js.map
