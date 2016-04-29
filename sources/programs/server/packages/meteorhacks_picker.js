(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var _ = Package.underscore._;

/* Package-scope variables */
var PickerImp, Picker;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/meteorhacks_picker/packages/meteorhacks_picker.js                           //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
(function () {                                                                          // 1
                                                                                        // 2
///////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                               //     // 4
// packages/meteorhacks:picker/lib/implementation.js                             //     // 5
//                                                                               //     // 6
///////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                 //     // 8
var pathToRegexp = Npm.require('path-to-regexp');                                // 1   // 9
var Fiber = Npm.require('fibers');                                               // 2   // 10
var urlParse = Npm.require('url').parse;                                         // 3   // 11
                                                                                 // 4   // 12
PickerImp = function(filterFunction) {                                           // 5   // 13
  this.filterFunction = filterFunction;                                          // 6   // 14
  this.routes = [];                                                              // 7   // 15
  this.subRouters = [];                                                          // 8   // 16
  this.middlewares = [];                                                         // 9   // 17
}                                                                                // 10  // 18
                                                                                 // 11  // 19
PickerImp.prototype.middleware = function(callback) {                            // 12  // 20
  this.middlewares.push(callback);                                               // 13  // 21
};                                                                               // 14  // 22
                                                                                 // 15  // 23
PickerImp.prototype.route = function(path, callback) {                           // 16  // 24
  var regExp = pathToRegexp(path);                                               // 17  // 25
  regExp.callback = callback;                                                    // 18  // 26
  this.routes.push(regExp);                                                      // 19  // 27
  return this;                                                                   // 20  // 28
};                                                                               // 21  // 29
                                                                                 // 22  // 30
PickerImp.prototype.filter = function(callback) {                                // 23  // 31
  var subRouter = new PickerImp(callback);                                       // 24  // 32
  this.subRouters.push(subRouter);                                               // 25  // 33
  return subRouter;                                                              // 26  // 34
};                                                                               // 27  // 35
                                                                                 // 28  // 36
PickerImp.prototype._dispatch = function(req, res, bypass) {                     // 29  // 37
  var self = this;                                                               // 30  // 38
  var currentRoute = 0;                                                          // 31  // 39
  var currentSubRouter = 0;                                                      // 32  // 40
  var currentMiddleware = 0;                                                     // 33  // 41
                                                                                 // 34  // 42
  if(this.filterFunction) {                                                      // 35  // 43
    var result = this.filterFunction(req, res);                                  // 36  // 44
    if(!result) {                                                                // 37  // 45
      return bypass();                                                           // 38  // 46
    }                                                                            // 39  // 47
  }                                                                              // 40  // 48
                                                                                 // 41  // 49
  processNextMiddleware();                                                       // 42  // 50
  function processNextMiddleware () {                                            // 43  // 51
    var middleware = self.middlewares[currentMiddleware++];                      // 44  // 52
    if(middleware) {                                                             // 45  // 53
      self._processMiddleware(middleware, req, res, processNextMiddleware);      // 46  // 54
    } else {                                                                     // 47  // 55
      processNextRoute();                                                        // 48  // 56
    }                                                                            // 49  // 57
  }                                                                              // 50  // 58
                                                                                 // 51  // 59
  function processNextRoute () {                                                 // 52  // 60
    var route = self.routes[currentRoute++];                                     // 53  // 61
    if(route) {                                                                  // 54  // 62
      var uri = req.url.replace(/\?.*/, '');                                     // 55  // 63
      var m = uri.match(route);                                                  // 56  // 64
      if(m) {                                                                    // 57  // 65
        var params = self._buildParams(route.keys, m);                           // 58  // 66
        params.query = urlParse(req.url, true).query;                            // 59  // 67
        self._processRoute(route.callback, params, req, res, bypass);            // 60  // 68
      } else {                                                                   // 61  // 69
        processNextRoute();                                                      // 62  // 70
      }                                                                          // 63  // 71
    } else {                                                                     // 64  // 72
      processNextSubRouter();                                                    // 65  // 73
    }                                                                            // 66  // 74
  }                                                                              // 67  // 75
                                                                                 // 68  // 76
  function processNextSubRouter () {                                             // 69  // 77
    var subRouter = self.subRouters[currentSubRouter++];                         // 70  // 78
    if(subRouter) {                                                              // 71  // 79
      subRouter._dispatch(req, res, processNextSubRouter);                       // 72  // 80
    } else {                                                                     // 73  // 81
      bypass();                                                                  // 74  // 82
    }                                                                            // 75  // 83
  }                                                                              // 76  // 84
};                                                                               // 77  // 85
                                                                                 // 78  // 86
PickerImp.prototype._buildParams = function(keys, m) {                           // 79  // 87
  var params = {};                                                               // 80  // 88
  for(var lc=1; lc<m.length; lc++) {                                             // 81  // 89
    var key = keys[lc-1].name;                                                   // 82  // 90
    var value = m[lc];                                                           // 83  // 91
    params[key] = value;                                                         // 84  // 92
  }                                                                              // 85  // 93
                                                                                 // 86  // 94
  return params;                                                                 // 87  // 95
};                                                                               // 88  // 96
                                                                                 // 89  // 97
PickerImp.prototype._processRoute = function(callback, params, req, res, next) { // 90  // 98
  if(Fiber.current) {                                                            // 91  // 99
    doCall();                                                                    // 92  // 100
  } else {                                                                       // 93  // 101
    new Fiber(doCall).run();                                                     // 94  // 102
  }                                                                              // 95  // 103
                                                                                 // 96  // 104
  function doCall () {                                                           // 97  // 105
    callback.call(null, params, req, res, next);                                 // 98  // 106
  }                                                                              // 99  // 107
};                                                                               // 100
                                                                                 // 101
PickerImp.prototype._processMiddleware = function(middleware, req, res, next) {  // 102
  if(Fiber.current) {                                                            // 103
    doCall();                                                                    // 104
  } else {                                                                       // 105
    new Fiber(doCall).run();                                                     // 106
  }                                                                              // 107
                                                                                 // 108
  function doCall() {                                                            // 109
    middleware.call(null, req, res, next);                                       // 110
  }                                                                              // 111
};                                                                               // 112
///////////////////////////////////////////////////////////////////////////////////     // 121
                                                                                        // 122
}).call(this);                                                                          // 123
                                                                                        // 124
                                                                                        // 125
                                                                                        // 126
                                                                                        // 127
                                                                                        // 128
                                                                                        // 129
(function () {                                                                          // 130
                                                                                        // 131
///////////////////////////////////////////////////////////////////////////////////     // 132
//                                                                               //     // 133
// packages/meteorhacks:picker/lib/instance.js                                   //     // 134
//                                                                               //     // 135
///////////////////////////////////////////////////////////////////////////////////     // 136
                                                                                 //     // 137
Picker = new PickerImp();                                                        // 1   // 138
WebApp.rawConnectHandlers.use(function(req, res, next) {                         // 2   // 139
  Picker._dispatch(req, res, next);                                              // 3   // 140
});                                                                              // 4   // 141
                                                                                 // 5   // 142
///////////////////////////////////////////////////////////////////////////////////     // 143
                                                                                        // 144
}).call(this);                                                                          // 145
                                                                                        // 146
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteorhacks:picker'] = {
  Picker: Picker
};

})();

//# sourceMappingURL=meteorhacks_picker.js.map
