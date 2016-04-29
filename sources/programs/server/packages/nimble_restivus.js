(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;

/* Package-scope variables */
var __coffeescriptShare, ironRouterSendErrorToResponse, msg, Restivus;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/nimble_restivus/lib/auth.coffee.js                                                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var getUserQuerySelector, userValidator;                                                                             // 1
                                                                                                                     //
this.Auth || (this.Auth = {});                                                                                       // 1
                                                                                                                     //
                                                                                                                     // 3
/*                                                                                                                   // 3
  A valid user will have exactly one of the following identification fields: id, username, or email                  //
 */                                                                                                                  //
                                                                                                                     //
userValidator = Match.Where(function(user) {                                                                         // 1
  check(user, {                                                                                                      // 7
    id: Match.Optional(String),                                                                                      // 8
    username: Match.Optional(String),                                                                                // 8
    email: Match.Optional(String)                                                                                    // 8
  });                                                                                                                //
  if (_.keys(user).length === !1) {                                                                                  // 12
    throw new Match.Error('User must have exactly one identifier field');                                            // 13
  }                                                                                                                  //
  return true;                                                                                                       // 15
});                                                                                                                  // 6
                                                                                                                     //
                                                                                                                     // 18
/*                                                                                                                   // 18
  Return a MongoDB query selector for finding the given user                                                         //
 */                                                                                                                  //
                                                                                                                     //
getUserQuerySelector = function(user) {                                                                              // 1
  if (user.id) {                                                                                                     // 22
    return {                                                                                                         // 23
      '_id': user.id                                                                                                 // 23
    };                                                                                                               //
  } else if (user.username) {                                                                                        //
    return {                                                                                                         // 25
      'username': user.username                                                                                      // 25
    };                                                                                                               //
  } else if (user.email) {                                                                                           //
    return {                                                                                                         // 27
      'emails.address': user.email                                                                                   // 27
    };                                                                                                               //
  }                                                                                                                  //
  throw new Error('Cannot create selector from invalid user');                                                       // 30
};                                                                                                                   // 21
                                                                                                                     //
                                                                                                                     // 33
/*                                                                                                                   // 33
  Log a user in with their password                                                                                  //
 */                                                                                                                  //
                                                                                                                     //
this.Auth.loginWithPassword = function(user, password) {                                                             // 1
  var authToken, authenticatingUser, authenticatingUserSelector, hashedToken, passwordVerification, ref;             // 37
  if (!user || !password) {                                                                                          // 37
    throw new Meteor.Error(401, 'Unauthorized');                                                                     // 38
  }                                                                                                                  //
  check(user, userValidator);                                                                                        // 37
  check(password, String);                                                                                           // 37
  authenticatingUserSelector = getUserQuerySelector(user);                                                           // 37
  authenticatingUser = Meteor.users.findOne(authenticatingUserSelector);                                             // 37
  if (!authenticatingUser) {                                                                                         // 48
    throw new Meteor.Error(401, 'Unauthorized');                                                                     // 49
  }                                                                                                                  //
  if (!((ref = authenticatingUser.services) != null ? ref.password : void 0)) {                                      // 50
    throw new Meteor.Error(401, 'Unauthorized');                                                                     // 51
  }                                                                                                                  //
  passwordVerification = Accounts._checkPassword(authenticatingUser, password);                                      // 37
  if (passwordVerification.error) {                                                                                  // 55
    throw new Meteor.Error(401, 'Unauthorized');                                                                     // 56
  }                                                                                                                  //
  authToken = Accounts._generateStampedLoginToken();                                                                 // 37
  hashedToken = Accounts._hashLoginToken(authToken.token);                                                           // 37
  Accounts._insertHashedLoginToken(authenticatingUser._id, {                                                         // 37
    hashedToken: hashedToken                                                                                         // 61
  });                                                                                                                //
  return {                                                                                                           // 63
    authToken: authToken.token,                                                                                      // 63
    userId: authenticatingUser._id                                                                                   // 63
  };                                                                                                                 //
};                                                                                                                   // 36
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/nimble_restivus/lib/iron-router-error-to-response.js                                                     //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// We need a function that treats thrown errors exactly like Iron Router would.                                      // 1
// This file is written in JavaScript to enable copy-pasting Iron Router code.                                       // 2
                                                                                                                     // 3
// Taken from: https://github.com/iron-meteor/iron-router/blob/9c369499c98af9fd12ef9e68338dee3b1b1276aa/lib/router_server.js#L3
var env = process.env.NODE_ENV || 'development';                                                                     // 5
                                                                                                                     // 6
// Taken from: https://github.com/iron-meteor/iron-router/blob/9c369499c98af9fd12ef9e68338dee3b1b1276aa/lib/router_server.js#L47
ironRouterSendErrorToResponse = function (err, req, res) {                                                           // 8
  if (res.statusCode < 400)                                                                                          // 9
    res.statusCode = 500;                                                                                            // 10
                                                                                                                     // 11
  if (err.status)                                                                                                    // 12
    res.statusCode = err.status;                                                                                     // 13
                                                                                                                     // 14
  if (env === 'development')                                                                                         // 15
    msg = (err.stack || err.toString()) + '\n';                                                                      // 16
  else                                                                                                               // 17
    //XXX get this from standard dict of error messages?                                                             // 18
    msg = 'Server error.';                                                                                           // 19
                                                                                                                     // 20
  console.error(err.stack || err.toString());                                                                        // 21
                                                                                                                     // 22
  if (res.headersSent)                                                                                               // 23
    return req.socket.destroy();                                                                                     // 24
                                                                                                                     // 25
  res.setHeader('Content-Type', 'text/html');                                                                        // 26
  res.setHeader('Content-Length', Buffer.byteLength(msg));                                                           // 27
  if (req.method === 'HEAD')                                                                                         // 28
    return res.end();                                                                                                // 29
  res.end(msg);                                                                                                      // 30
  return;                                                                                                            // 31
}                                                                                                                    // 32
                                                                                                                     // 33
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/nimble_restivus/lib/route.coffee.js                                                                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
share.Route = (function() {                                                                                          // 1
  function Route(api, path, options, endpoints1) {                                                                   // 3
    this.api = api;                                                                                                  // 5
    this.path = path;                                                                                                // 5
    this.options = options;                                                                                          // 5
    this.endpoints = endpoints1;                                                                                     // 5
    if (!this.endpoints) {                                                                                           // 5
      this.endpoints = this.options;                                                                                 // 6
      this.options = {};                                                                                             // 6
    }                                                                                                                //
  }                                                                                                                  //
                                                                                                                     //
  Route.prototype.addToApi = (function() {                                                                           // 3
    var availableMethods;                                                                                            // 11
    availableMethods = ['get', 'post', 'put', 'patch', 'delete', 'options'];                                         // 11
    return function() {                                                                                              // 13
      var allowedMethods, fullPath, rejectedMethods, self;                                                           // 14
      self = this;                                                                                                   // 14
      if (_.contains(this.api._config.paths, this.path)) {                                                           // 18
        throw new Error("Cannot add a route at an existing path: " + this.path);                                     // 19
      }                                                                                                              //
      this.endpoints = _.extend({                                                                                    // 14
        options: this.api._config.defaultOptionsEndpoint                                                             // 22
      }, this.endpoints);                                                                                            //
      this._resolveEndpoints();                                                                                      // 14
      this._configureEndpoints();                                                                                    // 14
      this.api._config.paths.push(this.path);                                                                        // 14
      allowedMethods = _.filter(availableMethods, function(method) {                                                 // 14
        return _.contains(_.keys(self.endpoints), method);                                                           //
      });                                                                                                            //
      rejectedMethods = _.reject(availableMethods, function(method) {                                                // 14
        return _.contains(_.keys(self.endpoints), method);                                                           //
      });                                                                                                            //
      fullPath = this.api._config.apiPath + this.path;                                                               // 14
      _.each(allowedMethods, function(method) {                                                                      // 14
        var endpoint;                                                                                                // 39
        endpoint = self.endpoints[method];                                                                           // 39
        return JsonRoutes.add(method, fullPath, function(req, res) {                                                 //
          var doneFunc, endpointContext, error, responseData, responseInitiated;                                     // 42
          responseInitiated = false;                                                                                 // 42
          doneFunc = function() {                                                                                    // 42
            return responseInitiated = true;                                                                         //
          };                                                                                                         //
          endpointContext = {                                                                                        // 42
            urlParams: req.params,                                                                                   // 47
            queryParams: req.query,                                                                                  // 47
            bodyParams: req.body,                                                                                    // 47
            request: req,                                                                                            // 47
            response: res,                                                                                           // 47
            done: doneFunc                                                                                           // 47
          };                                                                                                         //
          _.extend(endpointContext, endpoint);                                                                       // 42
          responseData = null;                                                                                       // 42
          try {                                                                                                      // 58
            responseData = self._callEndpoint(endpointContext, endpoint);                                            // 59
            if (responseData === null || responseData === void 0) {                                                  // 60
              throw new Error("Cannot return null or undefined from an endpoint: " + method + " " + fullPath);       // 61
            }                                                                                                        //
            if (res.headersSent && !responseInitiated) {                                                             // 62
              throw new Error("Must call this.done() after handling endpoint response manually: " + method + " " + fullPath);
            }                                                                                                        //
          } catch (_error) {                                                                                         //
            error = _error;                                                                                          // 66
            ironRouterSendErrorToResponse(error, req, res);                                                          // 66
            return;                                                                                                  // 67
          }                                                                                                          //
          if (responseInitiated) {                                                                                   // 69
            res.end();                                                                                               // 71
            return;                                                                                                  // 72
          }                                                                                                          //
          if (responseData.body && (responseData.statusCode || responseData.headers)) {                              // 75
            return self._respond(res, responseData.body, responseData.statusCode, responseData.headers);             //
          } else {                                                                                                   //
            return self._respond(res, responseData);                                                                 //
          }                                                                                                          //
        });                                                                                                          //
      });                                                                                                            //
      return _.each(rejectedMethods, function(method) {                                                              //
        return JsonRoutes.add(method, fullPath, function(req, res) {                                                 //
          var headers, responseData;                                                                                 // 81
          responseData = {                                                                                           // 81
            status: 'error',                                                                                         // 81
            message: 'API endpoint does not exist'                                                                   // 81
          };                                                                                                         //
          headers = {                                                                                                // 81
            'Allow': allowedMethods.join(', ').toUpperCase()                                                         // 82
          };                                                                                                         //
          return self._respond(res, responseData, 405, headers);                                                     //
        });                                                                                                          //
      });                                                                                                            //
    };                                                                                                               //
  })();                                                                                                              //
                                                                                                                     //
                                                                                                                     // 86
  /*                                                                                                                 // 86
    Convert all endpoints on the given route into our expected endpoint object if it is a bare                       //
    function                                                                                                         //
                                                                                                                     //
    @param {Route} route The route the endpoints belong to                                                           //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._resolveEndpoints = function() {                                                                   // 3
    _.each(this.endpoints, function(endpoint, method, endpoints) {                                                   // 93
      if (_.isFunction(endpoint)) {                                                                                  // 94
        return endpoints[method] = {                                                                                 //
          action: endpoint                                                                                           // 95
        };                                                                                                           //
      }                                                                                                              //
    });                                                                                                              //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 99
  /*                                                                                                                 // 99
    Configure the authentication and role requirement on all endpoints (except OPTIONS, which must                   //
    be configured directly on the endpoint)                                                                          //
                                                                                                                     //
    Authentication can be required on an entire route or individual endpoints. If required on an                     //
    entire route, that serves as the default. If required in any individual endpoints, that will                     //
    override the default.                                                                                            //
                                                                                                                     //
    After the endpoint is configured, all authentication and role requirements of an endpoint can be                 //
    accessed at <code>endpoint.authRequired</code> and <code>endpoint.roleRequired</code>,                           //
    respectively.                                                                                                    //
                                                                                                                     //
    @param {Route} route The route the endpoints belong to                                                           //
    @param {Endpoint} endpoint The endpoint to configure                                                             //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._configureEndpoints = function() {                                                                 // 3
    _.each(this.endpoints, function(endpoint, method) {                                                              // 115
      var ref, ref1;                                                                                                 // 116
      if (method !== 'options') {                                                                                    // 116
        if (!((ref = this.options) != null ? ref.roleRequired : void 0)) {                                           // 118
          this.options.roleRequired = [];                                                                            // 119
        }                                                                                                            //
        if (!endpoint.roleRequired) {                                                                                // 120
          endpoint.roleRequired = [];                                                                                // 121
        }                                                                                                            //
        endpoint.roleRequired = _.union(endpoint.roleRequired, this.options.roleRequired);                           // 118
        if (_.isEmpty(endpoint.roleRequired)) {                                                                      // 124
          endpoint.roleRequired = false;                                                                             // 125
        }                                                                                                            //
        if (endpoint.authRequired === void 0) {                                                                      // 128
          if (((ref1 = this.options) != null ? ref1.authRequired : void 0) || endpoint.roleRequired) {               // 129
            endpoint.authRequired = true;                                                                            // 130
          } else {                                                                                                   //
            endpoint.authRequired = false;                                                                           // 132
          }                                                                                                          //
        }                                                                                                            //
      }                                                                                                              //
    }, this);                                                                                                        //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 138
  /*                                                                                                                 // 138
    Authenticate an endpoint if required, and return the result of calling it                                        //
                                                                                                                     //
    @returns The endpoint response or a 401 if authentication fails                                                  //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._callEndpoint = function(endpointContext, endpoint) {                                              // 3
    if (this._authAccepted(endpointContext, endpoint)) {                                                             // 145
      if (this._roleAccepted(endpointContext, endpoint)) {                                                           // 146
        return endpoint.action.call(endpointContext);                                                                //
      } else {                                                                                                       //
        return {                                                                                                     //
          statusCode: 403,                                                                                           // 149
          body: {                                                                                                    // 149
            status: 'error',                                                                                         // 150
            message: 'You do not have permission to do this.'                                                        // 150
          }                                                                                                          //
        };                                                                                                           //
      }                                                                                                              //
    } else {                                                                                                         //
      return {                                                                                                       //
        statusCode: 401,                                                                                             // 152
        body: {                                                                                                      // 152
          status: 'error',                                                                                           // 153
          message: 'You must be logged in to do this.'                                                               // 153
        }                                                                                                            //
      };                                                                                                             //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 156
  /*                                                                                                                 // 156
    Authenticate the given endpoint if required                                                                      //
                                                                                                                     //
    Once it's globally configured in the API, authentication can be required on an entire route or                   //
    individual endpoints. If required on an entire endpoint, that serves as the default. If required                 //
    in any individual endpoints, that will override the default.                                                     //
                                                                                                                     //
    @returns False if authentication fails, and true otherwise                                                       //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._authAccepted = function(endpointContext, endpoint) {                                              // 3
    if (endpoint.authRequired) {                                                                                     // 166
      return this._authenticate(endpointContext);                                                                    //
    } else {                                                                                                         //
      return true;                                                                                                   //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 171
  /*                                                                                                                 // 171
    Verify the request is being made by an actively logged in user                                                   //
                                                                                                                     //
    If verified, attach the authenticated user to the context.                                                       //
                                                                                                                     //
    @returns {Boolean} True if the authentication was successful                                                     //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._authenticate = function(endpointContext) {                                                        // 3
    var auth, userSelector;                                                                                          // 180
    auth = this.api._config.auth.user.call(endpointContext);                                                         // 180
    if ((auth != null ? auth.userId : void 0) && (auth != null ? auth.token : void 0) && !(auth != null ? auth.user : void 0)) {
      userSelector = {};                                                                                             // 184
      userSelector._id = auth.userId;                                                                                // 184
      userSelector[this.api._config.auth.token] = auth.token;                                                        // 184
      auth.user = Meteor.users.findOne(userSelector);                                                                // 184
    }                                                                                                                //
    if (auth != null ? auth.user : void 0) {                                                                         // 190
      endpointContext.user = auth.user;                                                                              // 191
      endpointContext.userId = auth.user._id;                                                                        // 191
      return true;                                                                                                   //
    } else {                                                                                                         //
      return false;                                                                                                  //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 197
  /*                                                                                                                 // 197
    Authenticate the user role if required                                                                           //
                                                                                                                     //
    Must be called after _authAccepted().                                                                            //
                                                                                                                     //
    @returns True if the authenticated user belongs to <i>any</i> of the acceptable roles on the                     //
             endpoint                                                                                                //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._roleAccepted = function(endpointContext, endpoint) {                                              // 3
    if (endpoint.roleRequired) {                                                                                     // 206
      if (_.isEmpty(_.intersection(endpoint.roleRequired, endpointContext.user.roles))) {                            // 207
        return false;                                                                                                // 208
      }                                                                                                              //
    }                                                                                                                //
    return true;                                                                                                     //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 212
  /*                                                                                                                 // 212
    Respond to an HTTP request                                                                                       //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._respond = function(response, body, statusCode, headers) {                                         // 3
    var defaultHeaders, delayInMilliseconds, minimumDelayInMilliseconds, randomMultiplierBetweenOneAndTwo, sendResponse;
    if (statusCode == null) {                                                                                        //
      statusCode = 200;                                                                                              //
    }                                                                                                                //
    if (headers == null) {                                                                                           //
      headers = {};                                                                                                  //
    }                                                                                                                //
    defaultHeaders = this._lowerCaseKeys(this.api._config.defaultHeaders);                                           // 218
    headers = this._lowerCaseKeys(headers);                                                                          // 218
    headers = _.extend(defaultHeaders, headers);                                                                     // 218
    if (headers['content-type'].match(/json|javascript/) !== null) {                                                 // 223
      if (this.api._config.prettyJson) {                                                                             // 224
        body = JSON.stringify(body, void 0, 2);                                                                      // 225
      } else {                                                                                                       //
        body = JSON.stringify(body);                                                                                 // 227
      }                                                                                                              //
    }                                                                                                                //
    sendResponse = function() {                                                                                      // 218
      response.writeHead(statusCode, headers);                                                                       // 231
      response.write(body);                                                                                          // 231
      return response.end();                                                                                         //
    };                                                                                                               //
    if (statusCode === 401 || statusCode === 403) {                                                                  // 234
      minimumDelayInMilliseconds = 500;                                                                              // 241
      randomMultiplierBetweenOneAndTwo = 1 + Math.random();                                                          // 241
      delayInMilliseconds = minimumDelayInMilliseconds * randomMultiplierBetweenOneAndTwo;                           // 241
      return Meteor.setTimeout(sendResponse, delayInMilliseconds);                                                   //
    } else {                                                                                                         //
      return sendResponse();                                                                                         //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 248
  /*                                                                                                                 // 248
    Return the object with all of the keys converted to lowercase                                                    //
   */                                                                                                                //
                                                                                                                     //
  Route.prototype._lowerCaseKeys = function(object) {                                                                // 3
    return _.chain(object).pairs().map(function(attr) {                                                              //
      return [attr[0].toLowerCase(), attr[1]];                                                                       //
    }).object().value();                                                                                             //
  };                                                                                                                 //
                                                                                                                     //
  return Route;                                                                                                      //
                                                                                                                     //
})();                                                                                                                //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/nimble_restivus/lib/restivus.coffee.js                                                                   //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var                                                                                                                  // 1
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                     //
this.Restivus = (function() {                                                                                        // 1
  function Restivus(options) {                                                                                       // 3
    var corsHeaders;                                                                                                 // 4
    this._routes = [];                                                                                               // 4
    this._config = {                                                                                                 // 4
      paths: [],                                                                                                     // 6
      useDefaultAuth: false,                                                                                         // 6
      apiPath: 'api/',                                                                                               // 6
      version: null,                                                                                                 // 6
      prettyJson: false,                                                                                             // 6
      auth: {                                                                                                        // 6
        token: 'services.resume.loginTokens.hashedToken',                                                            // 12
        user: function() {                                                                                           // 12
          var token;                                                                                                 // 14
          if (this.request.headers['x-auth-token']) {                                                                // 14
            token = Accounts._hashLoginToken(this.request.headers['x-auth-token']);                                  // 15
          }                                                                                                          //
          return {                                                                                                   //
            userId: this.request.headers['x-user-id'],                                                               // 16
            token: token                                                                                             // 16
          };                                                                                                         //
        }                                                                                                            //
      },                                                                                                             //
      defaultHeaders: {                                                                                              // 6
        'Content-Type': 'application/json'                                                                           // 19
      },                                                                                                             //
      enableCors: true                                                                                               // 6
    };                                                                                                               //
    _.extend(this._config, options);                                                                                 // 4
    if (this._config.enableCors) {                                                                                   // 25
      corsHeaders = {                                                                                                // 26
        'Access-Control-Allow-Origin': '*',                                                                          // 27
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'                             // 27
      };                                                                                                             //
      if (this._config.useDefaultAuth) {                                                                             // 30
        corsHeaders['Access-Control-Allow-Headers'] += ', X-User-Id, X-Auth-Token';                                  // 31
      }                                                                                                              //
      _.extend(this._config.defaultHeaders, corsHeaders);                                                            // 26
      if (!this._config.defaultOptionsEndpoint) {                                                                    // 36
        this._config.defaultOptionsEndpoint = function() {                                                           // 37
          this.response.writeHead(200, corsHeaders);                                                                 // 38
          return this.done();                                                                                        //
        };                                                                                                           //
      }                                                                                                              //
    }                                                                                                                //
    if (this._config.apiPath[0] === '/') {                                                                           // 42
      this._config.apiPath = this._config.apiPath.slice(1);                                                          // 43
    }                                                                                                                //
    if (_.last(this._config.apiPath) !== '/') {                                                                      // 44
      this._config.apiPath = this._config.apiPath + '/';                                                             // 45
    }                                                                                                                //
    if (this._config.version) {                                                                                      // 49
      this._config.apiPath += this._config.version + '/';                                                            // 50
    }                                                                                                                //
    if (this._config.useDefaultAuth) {                                                                               // 53
      this._initAuth();                                                                                              // 54
    } else if (this._config.useAuth) {                                                                               //
      this._initAuth();                                                                                              // 56
      console.warn('Warning: useAuth API config option will be removed in Restivus v1.0 ' + '\n    Use the useDefaultAuth option instead');
    }                                                                                                                //
    return this;                                                                                                     // 60
  }                                                                                                                  //
                                                                                                                     //
                                                                                                                     // 63
  /**                                                                                                                // 63
    Add endpoints for the given HTTP methods at the given path                                                       //
                                                                                                                     //
    @param path {String} The extended URL path (will be appended to base path of the API)                            //
    @param options {Object} Route configuration options                                                              //
    @param options.authRequired {Boolean} The default auth requirement for each endpoint on the route                //
    @param options.roleRequired {String or String[]} The default role required for each endpoint on the route        //
    @param endpoints {Object} A set of endpoints available on the new route (get, post, put, patch, delete, options)
    @param endpoints.<method> {Function or Object} If a function is provided, all default route                      //
        configuration options will be applied to the endpoint. Otherwise an object with an `action`                  //
        and all other route config options available. An `action` must be provided with the object.                  //
   */                                                                                                                //
                                                                                                                     //
  Restivus.prototype.addRoute = function(path, options, endpoints) {                                                 // 3
    var route;                                                                                                       // 77
    route = new share.Route(this, path, options, endpoints);                                                         // 77
    this._routes.push(route);                                                                                        // 77
    route.addToApi();                                                                                                // 77
    return this;                                                                                                     // 82
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 85
  /**                                                                                                                // 85
    Generate routes for the Meteor Collection with the given name                                                    //
   */                                                                                                                //
                                                                                                                     //
  Restivus.prototype.addCollection = function(collection, options) {                                                 // 3
    var collectionEndpoints, collectionRouteEndpoints, endpointsAwaitingConfiguration, entityRouteEndpoints, excludedEndpoints, methods, methodsOnCollection, path, routeOptions;
    if (options == null) {                                                                                           //
      options = {};                                                                                                  //
    }                                                                                                                //
    methods = ['get', 'post', 'put', 'delete', 'getAll'];                                                            // 89
    methodsOnCollection = ['post', 'getAll'];                                                                        // 89
    if (collection === Meteor.users) {                                                                               // 93
      collectionEndpoints = this._userCollectionEndpoints;                                                           // 94
    } else {                                                                                                         //
      collectionEndpoints = this._collectionEndpoints;                                                               // 96
    }                                                                                                                //
    endpointsAwaitingConfiguration = options.endpoints || {};                                                        // 89
    routeOptions = options.routeOptions || {};                                                                       // 89
    excludedEndpoints = options.excludedEndpoints || [];                                                             // 89
    path = options.path || collection._name;                                                                         // 89
    collectionRouteEndpoints = {};                                                                                   // 89
    entityRouteEndpoints = {};                                                                                       // 89
    if (_.isEmpty(endpointsAwaitingConfiguration) && _.isEmpty(excludedEndpoints)) {                                 // 109
      _.each(methods, function(method) {                                                                             // 111
        if (indexOf.call(methodsOnCollection, method) >= 0) {                                                        // 113
          _.extend(collectionRouteEndpoints, collectionEndpoints[method].call(this, collection));                    // 114
        } else {                                                                                                     //
          _.extend(entityRouteEndpoints, collectionEndpoints[method].call(this, collection));                        // 115
        }                                                                                                            //
      }, this);                                                                                                      //
    } else {                                                                                                         //
      _.each(methods, function(method) {                                                                             // 120
        var configuredEndpoint, endpointOptions;                                                                     // 121
        if (indexOf.call(excludedEndpoints, method) < 0 && endpointsAwaitingConfiguration[method] !== false) {       // 121
          endpointOptions = endpointsAwaitingConfiguration[method];                                                  // 124
          configuredEndpoint = {};                                                                                   // 124
          _.each(collectionEndpoints[method].call(this, collection), function(action, methodType) {                  // 124
            return configuredEndpoint[methodType] = _.chain(action).clone().extend(endpointOptions).value();         //
          });                                                                                                        //
          if (indexOf.call(methodsOnCollection, method) >= 0) {                                                      // 133
            _.extend(collectionRouteEndpoints, configuredEndpoint);                                                  // 134
          } else {                                                                                                   //
            _.extend(entityRouteEndpoints, configuredEndpoint);                                                      // 135
          }                                                                                                          //
        }                                                                                                            //
      }, this);                                                                                                      //
    }                                                                                                                //
    this.addRoute(path, routeOptions, collectionRouteEndpoints);                                                     // 89
    this.addRoute(path + "/:id", routeOptions, entityRouteEndpoints);                                                // 89
    return this;                                                                                                     // 143
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 146
  /**                                                                                                                // 146
    A set of endpoints that can be applied to a Collection Route                                                     //
   */                                                                                                                //
                                                                                                                     //
  Restivus.prototype._collectionEndpoints = {                                                                        // 3
    get: function(collection) {                                                                                      // 150
      return {                                                                                                       //
        get: {                                                                                                       // 151
          action: function() {                                                                                       // 152
            var entity;                                                                                              // 153
            entity = collection.findOne(this.urlParams.id);                                                          // 153
            if (entity) {                                                                                            // 154
              return {                                                                                               //
                status: 'success',                                                                                   // 155
                data: entity                                                                                         // 155
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 157
                body: {                                                                                              // 157
                  status: 'fail',                                                                                    // 158
                  message: 'Item not found'                                                                          // 158
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    put: function(collection) {                                                                                      // 150
      return {                                                                                                       //
        put: {                                                                                                       // 160
          action: function() {                                                                                       // 161
            var entity, entityIsUpdated;                                                                             // 162
            entityIsUpdated = collection.update(this.urlParams.id, this.bodyParams);                                 // 162
            if (entityIsUpdated) {                                                                                   // 163
              entity = collection.findOne(this.urlParams.id);                                                        // 164
              return {                                                                                               //
                status: 'success',                                                                                   // 165
                data: entity                                                                                         // 165
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 167
                body: {                                                                                              // 167
                  status: 'fail',                                                                                    // 168
                  message: 'Item not found'                                                                          // 168
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    "delete": function(collection) {                                                                                 // 150
      return {                                                                                                       //
        "delete": {                                                                                                  // 170
          action: function() {                                                                                       // 171
            if (collection.remove(this.urlParams.id)) {                                                              // 172
              return {                                                                                               //
                status: 'success',                                                                                   // 173
                data: {                                                                                              // 173
                  message: 'Item removed'                                                                            // 173
                }                                                                                                    //
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 175
                body: {                                                                                              // 175
                  status: 'fail',                                                                                    // 176
                  message: 'Item not found'                                                                          // 176
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    post: function(collection) {                                                                                     // 150
      return {                                                                                                       //
        post: {                                                                                                      // 178
          action: function() {                                                                                       // 179
            var entity, entityId;                                                                                    // 180
            entityId = collection.insert(this.bodyParams);                                                           // 180
            entity = collection.findOne(entityId);                                                                   // 180
            if (entity) {                                                                                            // 182
              return {                                                                                               //
                statusCode: 201,                                                                                     // 183
                body: {                                                                                              // 183
                  status: 'success',                                                                                 // 184
                  data: entity                                                                                       // 184
                }                                                                                                    //
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 400,                                                                                     // 186
                body: {                                                                                              // 186
                  status: 'fail',                                                                                    // 187
                  message: 'No item added'                                                                           // 187
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    getAll: function(collection) {                                                                                   // 150
      return {                                                                                                       //
        get: {                                                                                                       // 189
          action: function() {                                                                                       // 190
            var entities;                                                                                            // 191
            entities = collection.find().fetch();                                                                    // 191
            if (entities) {                                                                                          // 192
              return {                                                                                               //
                status: 'success',                                                                                   // 193
                data: entities                                                                                       // 193
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 195
                body: {                                                                                              // 195
                  status: 'fail',                                                                                    // 196
                  message: 'Unable to retrieve items from collection'                                                // 196
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 199
  /**                                                                                                                // 199
    A set of endpoints that can be applied to a Meteor.users Collection Route                                        //
   */                                                                                                                //
                                                                                                                     //
  Restivus.prototype._userCollectionEndpoints = {                                                                    // 3
    get: function(collection) {                                                                                      // 203
      return {                                                                                                       //
        get: {                                                                                                       // 204
          action: function() {                                                                                       // 205
            var entity;                                                                                              // 206
            entity = collection.findOne(this.urlParams.id, {                                                         // 206
              fields: {                                                                                              // 206
                profile: 1                                                                                           // 206
              }                                                                                                      //
            });                                                                                                      //
            if (entity) {                                                                                            // 207
              return {                                                                                               //
                status: 'success',                                                                                   // 208
                data: entity                                                                                         // 208
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 210
                body: {                                                                                              // 210
                  status: 'fail',                                                                                    // 211
                  message: 'User not found'                                                                          // 211
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    put: function(collection) {                                                                                      // 203
      return {                                                                                                       //
        put: {                                                                                                       // 213
          action: function() {                                                                                       // 214
            var entity, entityIsUpdated;                                                                             // 215
            entityIsUpdated = collection.update(this.urlParams.id, {                                                 // 215
              $set: {                                                                                                // 215
                profile: this.bodyParams                                                                             // 215
              }                                                                                                      //
            });                                                                                                      //
            if (entityIsUpdated) {                                                                                   // 216
              entity = collection.findOne(this.urlParams.id, {                                                       // 217
                fields: {                                                                                            // 217
                  profile: 1                                                                                         // 217
                }                                                                                                    //
              });                                                                                                    //
              return {                                                                                               //
                status: "success",                                                                                   // 218
                data: entity                                                                                         // 218
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 220
                body: {                                                                                              // 220
                  status: 'fail',                                                                                    // 221
                  message: 'User not found'                                                                          // 221
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    "delete": function(collection) {                                                                                 // 203
      return {                                                                                                       //
        "delete": {                                                                                                  // 223
          action: function() {                                                                                       // 224
            if (collection.remove(this.urlParams.id)) {                                                              // 225
              return {                                                                                               //
                status: 'success',                                                                                   // 226
                data: {                                                                                              // 226
                  message: 'User removed'                                                                            // 226
                }                                                                                                    //
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 228
                body: {                                                                                              // 228
                  status: 'fail',                                                                                    // 229
                  message: 'User not found'                                                                          // 229
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    post: function(collection) {                                                                                     // 203
      return {                                                                                                       //
        post: {                                                                                                      // 231
          action: function() {                                                                                       // 232
            var entity, entityId;                                                                                    // 234
            entityId = Accounts.createUser(this.bodyParams);                                                         // 234
            entity = collection.findOne(entityId, {                                                                  // 234
              fields: {                                                                                              // 235
                profile: 1                                                                                           // 235
              }                                                                                                      //
            });                                                                                                      //
            if (entity) {                                                                                            // 236
              return {                                                                                               //
                statusCode: 201,                                                                                     // 237
                body: {                                                                                              // 237
                  status: 'success',                                                                                 // 238
                  data: entity                                                                                       // 238
                }                                                                                                    //
              };                                                                                                     //
            } else {                                                                                                 //
              ({                                                                                                     // 240
                statusCode: 400                                                                                      // 240
              });                                                                                                    //
              return {                                                                                               //
                status: 'fail',                                                                                      // 241
                message: 'No user added'                                                                             // 241
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    },                                                                                                               //
    getAll: function(collection) {                                                                                   // 203
      return {                                                                                                       //
        get: {                                                                                                       // 243
          action: function() {                                                                                       // 244
            var entities;                                                                                            // 245
            entities = collection.find({}, {                                                                         // 245
              fields: {                                                                                              // 245
                profile: 1                                                                                           // 245
              }                                                                                                      //
            }).fetch();                                                                                              //
            if (entities) {                                                                                          // 246
              return {                                                                                               //
                status: 'success',                                                                                   // 247
                data: entities                                                                                       // 247
              };                                                                                                     //
            } else {                                                                                                 //
              return {                                                                                               //
                statusCode: 404,                                                                                     // 249
                body: {                                                                                              // 249
                  status: 'fail',                                                                                    // 250
                  message: 'Unable to retrieve users'                                                                // 250
                }                                                                                                    //
              };                                                                                                     //
            }                                                                                                        //
          }                                                                                                          //
        }                                                                                                            //
      };                                                                                                             //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
                                                                                                                     // 253
  /*                                                                                                                 // 253
    Add /login and /logout endpoints to the API                                                                      //
   */                                                                                                                //
                                                                                                                     //
  Restivus.prototype._initAuth = function() {                                                                        // 3
    var logout, self;                                                                                                // 257
    self = this;                                                                                                     // 257
                                                                                                                     // 258
    /*                                                                                                               // 258
      Add a login endpoint to the API                                                                                //
                                                                                                                     //
      After the user is logged in, the onLoggedIn hook is called (see Restfully.configure() for                      //
      adding hook).                                                                                                  //
     */                                                                                                              //
    this.addRoute('login', {                                                                                         // 257
      authRequired: false                                                                                            // 264
    }, {                                                                                                             //
      post: function() {                                                                                             // 265
        var auth, e, extraData, ref, ref1, response, searchQuery, user;                                              // 267
        user = {};                                                                                                   // 267
        if (this.bodyParams.user) {                                                                                  // 268
          if (this.bodyParams.user.indexOf('@') === -1) {                                                            // 269
            user.username = this.bodyParams.user;                                                                    // 270
          } else {                                                                                                   //
            user.email = this.bodyParams.user;                                                                       // 272
          }                                                                                                          //
        } else if (this.bodyParams.username) {                                                                       //
          user.username = this.bodyParams.username;                                                                  // 274
        } else if (this.bodyParams.email) {                                                                          //
          user.email = this.bodyParams.email;                                                                        // 276
        }                                                                                                            //
        try {                                                                                                        // 279
          auth = Auth.loginWithPassword(user, this.bodyParams.password);                                             // 280
        } catch (_error) {                                                                                           //
          e = _error;                                                                                                // 282
          return {                                                                                                   // 282
            statusCode: e.error,                                                                                     // 283
            body: {                                                                                                  // 283
              status: 'error',                                                                                       // 284
              message: e.reason                                                                                      // 284
            }                                                                                                        //
          };                                                                                                         //
        }                                                                                                            //
        if (auth.userId && auth.authToken) {                                                                         // 288
          searchQuery = {};                                                                                          // 289
          searchQuery[self._config.auth.token] = Accounts._hashLoginToken(auth.authToken);                           // 289
          this.user = Meteor.users.findOne({                                                                         // 289
            '_id': auth.userId                                                                                       // 292
          }, searchQuery);                                                                                           //
          this.userId = (ref = this.user) != null ? ref._id : void 0;                                                // 289
        }                                                                                                            //
        response = {                                                                                                 // 267
          status: 'success',                                                                                         // 296
          data: auth                                                                                                 // 296
        };                                                                                                           //
        extraData = (ref1 = self._config.onLoggedIn) != null ? ref1.call(this) : void 0;                             // 267
        if (extraData != null) {                                                                                     // 300
          _.extend(response.data, {                                                                                  // 301
            extra: extraData                                                                                         // 301
          });                                                                                                        //
        }                                                                                                            //
        return response;                                                                                             //
      }                                                                                                              //
    });                                                                                                              //
    logout = function() {                                                                                            // 257
      var authToken, extraData, hashedToken, index, ref, response, tokenFieldName, tokenLocation, tokenPath, tokenRemovalQuery, tokenToRemove;
      authToken = this.request.headers['x-auth-token'];                                                              // 307
      hashedToken = Accounts._hashLoginToken(authToken);                                                             // 307
      tokenLocation = self._config.auth.token;                                                                       // 307
      index = tokenLocation.lastIndexOf('.');                                                                        // 307
      tokenPath = tokenLocation.substring(0, index);                                                                 // 307
      tokenFieldName = tokenLocation.substring(index + 1);                                                           // 307
      tokenToRemove = {};                                                                                            // 307
      tokenToRemove[tokenFieldName] = hashedToken;                                                                   // 307
      tokenRemovalQuery = {};                                                                                        // 307
      tokenRemovalQuery[tokenPath] = tokenToRemove;                                                                  // 307
      Meteor.users.update(this.user._id, {                                                                           // 307
        $pull: tokenRemovalQuery                                                                                     // 317
      });                                                                                                            //
      response = {                                                                                                   // 307
        status: 'success',                                                                                           // 319
        data: {                                                                                                      // 319
          message: 'You\'ve been logged out!'                                                                        // 319
        }                                                                                                            //
      };                                                                                                             //
      extraData = (ref = self._config.onLoggedOut) != null ? ref.call(this) : void 0;                                // 307
      if (extraData != null) {                                                                                       // 323
        _.extend(response.data, {                                                                                    // 324
          extra: extraData                                                                                           // 324
        });                                                                                                          //
      }                                                                                                              //
      return response;                                                                                               //
    };                                                                                                               //
                                                                                                                     // 328
    /*                                                                                                               // 328
      Add a logout endpoint to the API                                                                               //
                                                                                                                     //
      After the user is logged out, the onLoggedOut hook is called (see Restfully.configure() for                    //
      adding hook).                                                                                                  //
     */                                                                                                              //
    return this.addRoute('logout', {                                                                                 //
      authRequired: true                                                                                             // 334
    }, {                                                                                                             //
      get: function() {                                                                                              // 335
        console.warn("Warning: Default logout via GET will be removed in Restivus v1.0. Use POST instead.");         // 336
        console.warn("    See https://github.com/kahmali/meteor-restivus/issues/100");                               // 336
        return logout.call(this);                                                                                    // 338
      },                                                                                                             //
      post: logout                                                                                                   // 335
    });                                                                                                              //
  };                                                                                                                 //
                                                                                                                     //
  return Restivus;                                                                                                   //
                                                                                                                     //
})();                                                                                                                //
                                                                                                                     //
Restivus = this.Restivus;                                                                                            // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['nimble:restivus'] = {
  Restivus: Restivus
};

})();

//# sourceMappingURL=nimble_restivus.js.map
