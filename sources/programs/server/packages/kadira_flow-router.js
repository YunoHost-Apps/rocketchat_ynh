(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var Router, Group, Route, FlowRouter, FastRender;

(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/kadira_flow-router/server/router.js                                     //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
var Qs = Npm.require('qs');                                                         // 1
                                                                                    // 2
Router = function () {                                                              // 3
  this._routes = [];                                                                // 4
  this._routesMap = {};                                                             // 5
  this.subscriptions = Function.prototype;                                          // 6
                                                                                    // 7
  // holds onRoute callbacks                                                        // 8
  this._onRouteCallbacks = [];                                                      // 9
};                                                                                  // 10
                                                                                    // 11
Router.prototype.route = function(pathDef, options) {                               // 12
  if (!/^\/.*/.test(pathDef)) {                                                     // 13
    var message = "route's path must start with '/'";                               // 14
    throw new Error(message);                                                       // 15
  }                                                                                 // 16
                                                                                    // 17
  options = options || {};                                                          // 18
  var route = new Route(this, pathDef, options);                                    // 19
  this._routes.push(route);                                                         // 20
                                                                                    // 21
  if (options.name) {                                                               // 22
    this._routesMap[options.name] = route;                                          // 23
  }                                                                                 // 24
                                                                                    // 25
  this._triggerRouteRegister(route);                                                // 26
  return route;                                                                     // 27
};                                                                                  // 28
                                                                                    // 29
Router.prototype.group = function(options) {                                        // 30
  return new Group(this, options);                                                  // 31
};                                                                                  // 32
                                                                                    // 33
Router.prototype.path = function(pathDef, fields, queryParams) {                    // 34
  if (this._routesMap[pathDef]) {                                                   // 35
    pathDef = this._routesMap[pathDef].path;                                        // 36
  }                                                                                 // 37
                                                                                    // 38
  fields = fields || {};                                                            // 39
  var regExp = /(:[\w\(\)\\\+\*\.\?]+)+/g;                                          // 40
  var path = pathDef.replace(regExp, function(key) {                                // 41
    var firstRegexpChar = key.indexOf("(");                                         // 42
    // get the content behind : and (\\d+/)                                         // 43
    key = key.substring(1, (firstRegexpChar > 0)? firstRegexpChar: undefined);      // 44
    // remove +?*                                                                   // 45
    key = key.replace(/[\+\*\?]+/g, "");                                            // 46
                                                                                    // 47
    return fields[key] || "";                                                       // 48
  });                                                                               // 49
                                                                                    // 50
  path = path.replace(/\/\/+/g, "/"); // Replace multiple slashes with single slash
                                                                                    // 52
  // remove trailing slash                                                          // 53
  // but keep the root slash if it's the only one                                   // 54
  path = path.match(/^\/{1}$/) ? path: path.replace(/\/$/, "");                     // 55
                                                                                    // 56
  var strQueryParams = Qs.stringify(queryParams || {});                             // 57
  if(strQueryParams) {                                                              // 58
    path += "?" + strQueryParams;                                                   // 59
  }                                                                                 // 60
                                                                                    // 61
  return path;                                                                      // 62
};                                                                                  // 63
                                                                                    // 64
Router.prototype.onRouteRegister = function(cb) {                                   // 65
  this._onRouteCallbacks.push(cb);                                                  // 66
};                                                                                  // 67
                                                                                    // 68
Router.prototype._triggerRouteRegister = function(currentRoute) {                   // 69
  // We should only need to send a safe set of fields on the route                  // 70
  // object.                                                                        // 71
  // This is not to hide what's inside the route object, but to show                // 72
  // these are the public APIs                                                      // 73
  var routePublicApi = _.pick(currentRoute, 'name', 'pathDef', 'path');             // 74
  var omittingOptionFields = [                                                      // 75
    'triggersEnter', 'triggersExit', 'action', 'subscriptions', 'name'              // 76
  ];                                                                                // 77
  routePublicApi.options = _.omit(currentRoute.options, omittingOptionFields);      // 78
                                                                                    // 79
  _.each(this._onRouteCallbacks, function(cb) {                                     // 80
    cb(routePublicApi);                                                             // 81
  });                                                                               // 82
};                                                                                  // 83
                                                                                    // 84
                                                                                    // 85
Router.prototype.go = function() {                                                  // 86
  // client only                                                                    // 87
};                                                                                  // 88
                                                                                    // 89
                                                                                    // 90
Router.prototype.current = function() {                                             // 91
  // client only                                                                    // 92
};                                                                                  // 93
                                                                                    // 94
                                                                                    // 95
Router.prototype.triggers = {                                                       // 96
  enter: function() {                                                               // 97
    // client only                                                                  // 98
  },                                                                                // 99
  exit: function() {                                                                // 100
    // client only                                                                  // 101
  }                                                                                 // 102
};                                                                                  // 103
                                                                                    // 104
Router.prototype.middleware = function() {                                          // 105
  // client only                                                                    // 106
};                                                                                  // 107
                                                                                    // 108
                                                                                    // 109
Router.prototype.getState = function() {                                            // 110
  // client only                                                                    // 111
};                                                                                  // 112
                                                                                    // 113
                                                                                    // 114
Router.prototype.getAllStates = function() {                                        // 115
  // client only                                                                    // 116
};                                                                                  // 117
                                                                                    // 118
                                                                                    // 119
Router.prototype.setState = function() {                                            // 120
  // client only                                                                    // 121
};                                                                                  // 122
                                                                                    // 123
                                                                                    // 124
Router.prototype.removeState = function() {                                         // 125
  // client only                                                                    // 126
};                                                                                  // 127
                                                                                    // 128
                                                                                    // 129
Router.prototype.clearStates = function() {                                         // 130
  // client only                                                                    // 131
};                                                                                  // 132
                                                                                    // 133
                                                                                    // 134
Router.prototype.ready = function() {                                               // 135
  // client only                                                                    // 136
};                                                                                  // 137
                                                                                    // 138
                                                                                    // 139
Router.prototype.initialize = function() {                                          // 140
  // client only                                                                    // 141
};                                                                                  // 142
                                                                                    // 143
Router.prototype.wait = function() {                                                // 144
  // client only                                                                    // 145
};                                                                                  // 146
                                                                                    // 147
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/kadira_flow-router/server/group.js                                      //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
Group = function(router, options) {                                                 // 1
  options = options || {};                                                          // 2
  this.prefix = options.prefix || '';                                               // 3
  this.options = options;                                                           // 4
  this._router = router;                                                            // 5
};                                                                                  // 6
                                                                                    // 7
Group.prototype.route = function(pathDef, options) {                                // 8
  pathDef = this.prefix + pathDef;                                                  // 9
  return this._router.route(pathDef, options);                                      // 10
};                                                                                  // 11
                                                                                    // 12
Group.prototype.group = function(options) {                                         // 13
  var group = new Group(this._router, options);                                     // 14
  group.parent = this;                                                              // 15
                                                                                    // 16
  return group;                                                                     // 17
};                                                                                  // 18
                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/kadira_flow-router/server/route.js                                      //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
Route = function(router, pathDef, options) {                                        // 1
  options = options || {};                                                          // 2
  this.options = options;                                                           // 3
  this.name = options.name;                                                         // 4
  this.pathDef = pathDef;                                                           // 5
                                                                                    // 6
  // Route.path is deprecated and will be removed in 3.0                            // 7
  this.path = pathDef;                                                              // 8
                                                                                    // 9
  this.action = options.action || Function.prototype;                               // 10
  this.subscriptions = options.subscriptions || Function.prototype;                 // 11
  this._subsMap = {};                                                               // 12
};                                                                                  // 13
                                                                                    // 14
                                                                                    // 15
Route.prototype.register = function(name, sub, options) {                           // 16
  this._subsMap[name] = sub;                                                        // 17
};                                                                                  // 18
                                                                                    // 19
                                                                                    // 20
Route.prototype.subscription = function(name) {                                     // 21
  return this._subsMap[name];                                                       // 22
};                                                                                  // 23
                                                                                    // 24
                                                                                    // 25
Route.prototype.middleware = function(middleware) {                                 // 26
                                                                                    // 27
};                                                                                  // 28
                                                                                    // 29
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/kadira_flow-router/server/_init.js                                      //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
// Export Router Instance                                                           // 1
FlowRouter = new Router();                                                          // 2
FlowRouter.Router = Router;                                                         // 3
FlowRouter.Route = Route;                                                           // 4
                                                                                    // 5
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/kadira_flow-router/server/plugins/fast_render.js                        //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
if(!Package['meteorhacks:fast-render']) {                                           // 1
  return;                                                                           // 2
}                                                                                   // 3
                                                                                    // 4
FastRender = Package['meteorhacks:fast-render'].FastRender;                         // 5
                                                                                    // 6
// hack to run after eveything else on startup                                      // 7
Meteor.startup(function () {                                                        // 8
  Meteor.startup(function () {                                                      // 9
    setupFastRender();                                                              // 10
  });                                                                               // 11
});                                                                                 // 12
                                                                                    // 13
function setupFastRender () {                                                       // 14
  _.each(FlowRouter._routes, function (route) {                                     // 15
    FastRender.route(route.pathDef, function (routeParams, path) {                  // 16
      var self = this;                                                              // 17
                                                                                    // 18
      // anyone using Meteor.subscribe for something else?                          // 19
      var original = Meteor.subscribe;                                              // 20
      Meteor.subscribe = function () {                                              // 21
        return _.toArray(arguments);                                                // 22
      };                                                                            // 23
                                                                                    // 24
      route._subsMap = {};                                                          // 25
      FlowRouter.subscriptions.call(route, path);                                   // 26
      if(route.subscriptions) {                                                     // 27
        var queryParams = routeParams.query;                                        // 28
        var params = _.omit(routeParams, 'query');                                  // 29
        route.subscriptions(params, queryParams);                                   // 30
      }                                                                             // 31
      _.each(route._subsMap, function (args) {                                      // 32
        self.subscribe.apply(self, args);                                           // 33
      });                                                                           // 34
                                                                                    // 35
      // restore Meteor.subscribe, ... on server side                               // 36
      Meteor.subscribe = original;                                                  // 37
    });                                                                             // 38
  });                                                                               // 39
}                                                                                   // 40
                                                                                    // 41
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/kadira_flow-router/lib/router.js                                        //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
Router.prototype.url = function() {                                                 // 1
  // We need to remove the leading base path, or "/", as it will be inserted        // 2
  // automatically by `Meteor.absoluteUrl` as documented in:                        // 3
  // http://docs.meteor.com/#/full/meteor_absoluteurl                               // 4
  var completePath = this.path.apply(this, arguments);                              // 5
  var basePath = this._basePath || '/';                                             // 6
  var pathWithoutBase = completePath.replace(new RegExp('^' + basePath), '');       // 7
  return Meteor.absoluteUrl(pathWithoutBase);                                       // 8
};                                                                                  // 9
                                                                                    // 10
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['kadira:flow-router'] = {
  FlowRouter: FlowRouter
};

})();

//# sourceMappingURL=kadira_flow-router.js.map
