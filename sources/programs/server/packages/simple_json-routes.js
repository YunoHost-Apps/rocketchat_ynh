(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

/* Package-scope variables */
var JsonRoutes, RestMiddleware;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/simple_json-routes/json-routes.js                                                       //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
/* global JsonRoutes:true */                                                                        // 1
                                                                                                    // 2
var Fiber = Npm.require('fibers');                                                                  // 3
var connect = Npm.require('connect');                                                               // 4
var connectRoute = Npm.require('connect-route');                                                    // 5
                                                                                                    // 6
JsonRoutes = {};                                                                                    // 7
                                                                                                    // 8
WebApp.connectHandlers.use(connect.urlencoded({limit: '50mb'})); //Override default request size    // 9
WebApp.connectHandlers.use(connect.json({limit: '50mb'})); //Override default request size          // 10
WebApp.connectHandlers.use(connect.query());                                                        // 11
                                                                                                    // 12
// Handler for adding middleware before an endpoint (JsonRoutes.middleWare                          // 13
// is just for legacy reasons). Also serves as a namespace for middleware                           // 14
// packages to declare their middleware functions.                                                  // 15
JsonRoutes.Middleware = JsonRoutes.middleWare = connect();                                          // 16
WebApp.connectHandlers.use(JsonRoutes.Middleware);                                                  // 17
                                                                                                    // 18
// List of all defined JSON API endpoints                                                           // 19
JsonRoutes.routes = [];                                                                             // 20
                                                                                                    // 21
// Save reference to router for later                                                               // 22
var connectRouter;                                                                                  // 23
                                                                                                    // 24
// Register as a middleware                                                                         // 25
WebApp.connectHandlers.use(Meteor.bindEnvironment(connectRoute(function (router) {                  // 26
  connectRouter = router;                                                                           // 27
})));                                                                                               // 28
                                                                                                    // 29
// Error middleware must be added last, to catch errors from prior middleware.                      // 30
// That's why we cache them and then add after startup.                                             // 31
var errorMiddlewares = [];                                                                          // 32
JsonRoutes.ErrorMiddleware = {                                                                      // 33
  use: function () {                                                                                // 34
    errorMiddlewares.push(arguments);                                                               // 35
  },                                                                                                // 36
};                                                                                                  // 37
                                                                                                    // 38
Meteor.startup(function () {                                                                        // 39
  _.each(errorMiddlewares, function (errorMiddleware) {                                             // 40
    errorMiddleware = _.map(errorMiddleware, function (maybeFn) {                                   // 41
      if (_.isFunction(maybeFn)) {                                                                  // 42
        // A connect error middleware needs exactly 4 arguments because they use fn.length === 4 to
        // decide if something is an error middleware.                                              // 44
        return function (a, b, c, d) {                                                              // 45
          Meteor.bindEnvironment(maybeFn)(a, b, c, d);                                              // 46
        }                                                                                           // 47
      }                                                                                             // 48
                                                                                                    // 49
      return maybeFn;                                                                               // 50
    });                                                                                             // 51
                                                                                                    // 52
    WebApp.connectHandlers.use.apply(WebApp.connectHandlers, errorMiddleware);                      // 53
  });                                                                                               // 54
                                                                                                    // 55
  errorMiddlewares = [];                                                                            // 56
});                                                                                                 // 57
                                                                                                    // 58
JsonRoutes.add = function (method, path, handler) {                                                 // 59
  // Make sure path starts with a slash                                                             // 60
  if (path[0] !== '/') {                                                                            // 61
    path = '/' + path;                                                                              // 62
  }                                                                                                 // 63
                                                                                                    // 64
  // Add to list of known endpoints                                                                 // 65
  JsonRoutes.routes.push({                                                                          // 66
    method: method,                                                                                 // 67
    path: path,                                                                                     // 68
  });                                                                                               // 69
                                                                                                    // 70
  connectRouter[method.toLowerCase()](path, function (req, res, next) {                             // 71
    // Set headers on response                                                                      // 72
    setHeaders(res, responseHeaders);                                                               // 73
    Fiber(function () {                                                                             // 74
      try {                                                                                         // 75
        handler(req, res, next);                                                                    // 76
      } catch (error) {                                                                             // 77
        next(error);                                                                                // 78
      }                                                                                             // 79
    }).run();                                                                                       // 80
  });                                                                                               // 81
};                                                                                                  // 82
                                                                                                    // 83
var responseHeaders = {                                                                             // 84
  'Cache-Control': 'no-store',                                                                      // 85
  Pragma: 'no-cache',                                                                               // 86
};                                                                                                  // 87
                                                                                                    // 88
JsonRoutes.setResponseHeaders = function (headers) {                                                // 89
  responseHeaders = headers;                                                                        // 90
};                                                                                                  // 91
                                                                                                    // 92
/**                                                                                                 // 93
 * Sets the response headers, status code, and body, and ends it.                                   // 94
 * The JSON response will be pretty printed if NODE_ENV is `development`.                           // 95
 *                                                                                                  // 96
 * @param {Object} res Response object                                                              // 97
 * @param {Object} [options]                                                                        // 98
 * @param {Number} [options.code] HTTP status code. Default is 200.                                 // 99
 * @param {Object} [options.headers] Dictionary of headers.                                         // 100
 * @param {Object|Array|null|undefined} [options.data] The object to                                // 101
 *   stringify as the response. If `null`, the response will be "null".                             // 102
 *   If `undefined`, there will be no response body.                                                // 103
 */                                                                                                 // 104
JsonRoutes.sendResult = function (res, options) {                                                   // 105
  options = options || {};                                                                          // 106
                                                                                                    // 107
  // We've already set global headers on response, but if they                                      // 108
  // pass in more here, we set those.                                                               // 109
  if (options.headers) setHeaders(res, options.headers);                                            // 110
                                                                                                    // 111
  // Set status code on response                                                                    // 112
  res.statusCode = options.code || 200;                                                             // 113
                                                                                                    // 114
  // Set response body                                                                              // 115
  writeJsonToBody(res, options.data);                                                               // 116
                                                                                                    // 117
  // Send the response                                                                              // 118
  res.end();                                                                                        // 119
};                                                                                                  // 120
                                                                                                    // 121
function setHeaders(res, headers) {                                                                 // 122
  _.each(headers, function (value, key) {                                                           // 123
    res.setHeader(key, value);                                                                      // 124
  });                                                                                               // 125
}                                                                                                   // 126
                                                                                                    // 127
function writeJsonToBody(res, json) {                                                               // 128
  if (json !== undefined) {                                                                         // 129
    var shouldPrettyPrint = (process.env.NODE_ENV === 'development');                               // 130
    var spacer = shouldPrettyPrint ? 2 : null;                                                      // 131
    res.setHeader('Content-type', 'application/json');                                              // 132
    res.write(JSON.stringify(json, null, spacer));                                                  // 133
  }                                                                                                 // 134
}                                                                                                   // 135
                                                                                                    // 136
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/simple_json-routes/middleware.js                                                        //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
/* global RestMiddleware:true */                                                                    // 1
                                                                                                    // 2
RestMiddleware = {};                                                                                // 3
                                                                                                    // 4
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['simple:json-routes'] = {
  JsonRoutes: JsonRoutes,
  RestMiddleware: RestMiddleware
};

})();

//# sourceMappingURL=simple_json-routes.js.map
