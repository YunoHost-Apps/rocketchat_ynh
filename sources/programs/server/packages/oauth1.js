(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Random = Package.random.Random;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var OAuth1Binding, OAuth1Test;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/oauth1/oauth1_binding.js                                                                   //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var crypto = Npm.require("crypto");                                                                    // 1
var querystring = Npm.require("querystring");                                                          // 2
var urlModule = Npm.require("url");                                                                    // 3
                                                                                                       // 4
// An OAuth1 wrapper around http calls which helps get tokens and                                      // 5
// takes care of HTTP headers                                                                          // 6
//                                                                                                     // 7
// @param config {Object}                                                                              // 8
//   - consumerKey (String): oauth consumer key                                                        // 9
//   - secret (String): oauth consumer secret                                                          // 10
// @param urls {Object}                                                                                // 11
//   - requestToken (String): url                                                                      // 12
//   - authorize (String): url                                                                         // 13
//   - accessToken (String): url                                                                       // 14
//   - authenticate (String): url                                                                      // 15
OAuth1Binding = function(config, urls) {                                                               // 16
  this._config = config;                                                                               // 17
  this._urls = urls;                                                                                   // 18
};                                                                                                     // 19
                                                                                                       // 20
OAuth1Binding.prototype.prepareRequestToken = function(callbackUrl) {                                  // 21
  var self = this;                                                                                     // 22
                                                                                                       // 23
  var headers = self._buildHeader({                                                                    // 24
    oauth_callback: callbackUrl                                                                        // 25
  });                                                                                                  // 26
                                                                                                       // 27
  var response = self._call('POST', self._urls.requestToken, headers);                                 // 28
  var tokens = querystring.parse(response.content);                                                    // 29
                                                                                                       // 30
  if (! tokens.oauth_callback_confirmed)                                                               // 31
    throw _.extend(new Error("oauth_callback_confirmed false when requesting oauth1 token"),           // 32
                             {response: response});                                                    // 33
                                                                                                       // 34
  self.requestToken = tokens.oauth_token;                                                              // 35
  self.requestTokenSecret = tokens.oauth_token_secret;                                                 // 36
};                                                                                                     // 37
                                                                                                       // 38
OAuth1Binding.prototype.prepareAccessToken = function(query, requestTokenSecret) {                     // 39
  var self = this;                                                                                     // 40
                                                                                                       // 41
  // support implementations that use request token secrets. This is                                   // 42
  // read by self._call.                                                                               // 43
  //                                                                                                   // 44
  // XXX make it a param to call, not something stashed on self? It's                                  // 45
  // kinda confusing right now, everything except this is passed as                                    // 46
  // arguments, but this is stored.                                                                    // 47
  if (requestTokenSecret)                                                                              // 48
    self.accessTokenSecret = requestTokenSecret;                                                       // 49
                                                                                                       // 50
  var headers = self._buildHeader({                                                                    // 51
    oauth_token: query.oauth_token,                                                                    // 52
    oauth_verifier: query.oauth_verifier                                                               // 53
  });                                                                                                  // 54
                                                                                                       // 55
  var response = self._call('POST', self._urls.accessToken, headers);                                  // 56
  var tokens = querystring.parse(response.content);                                                    // 57
                                                                                                       // 58
  if (! tokens.oauth_token || ! tokens.oauth_token_secret) {                                           // 59
    var error = new Error("missing oauth token or secret");                                            // 60
    // We provide response only if no token is available, we do not want to leak any tokens            // 61
    if (! tokens.oauth_token && ! tokens.oauth_token_secret) {                                         // 62
      _.extend(error, {response: response});                                                           // 63
    }                                                                                                  // 64
    throw error;                                                                                       // 65
  }                                                                                                    // 66
                                                                                                       // 67
  self.accessToken = tokens.oauth_token;                                                               // 68
  self.accessTokenSecret = tokens.oauth_token_secret;                                                  // 69
};                                                                                                     // 70
                                                                                                       // 71
OAuth1Binding.prototype.call = function(method, url, params, callback) {                               // 72
  var self = this;                                                                                     // 73
                                                                                                       // 74
  var headers = self._buildHeader({                                                                    // 75
    oauth_token: self.accessToken                                                                      // 76
  });                                                                                                  // 77
                                                                                                       // 78
  if(! params) {                                                                                       // 79
    params = {};                                                                                       // 80
  }                                                                                                    // 81
                                                                                                       // 82
  return self._call(method, url, headers, params, callback);                                           // 83
};                                                                                                     // 84
                                                                                                       // 85
OAuth1Binding.prototype.get = function(url, params, callback) {                                        // 86
  return this.call('GET', url, params, callback);                                                      // 87
};                                                                                                     // 88
                                                                                                       // 89
OAuth1Binding.prototype.post = function(url, params, callback) {                                       // 90
  return this.call('POST', url, params, callback);                                                     // 91
};                                                                                                     // 92
                                                                                                       // 93
OAuth1Binding.prototype._buildHeader = function(headers) {                                             // 94
  var self = this;                                                                                     // 95
  return _.extend({                                                                                    // 96
    oauth_consumer_key: self._config.consumerKey,                                                      // 97
    oauth_nonce: Random.secret().replace(/\W/g, ''),                                                   // 98
    oauth_signature_method: 'HMAC-SHA1',                                                               // 99
    oauth_timestamp: (new Date().valueOf()/1000).toFixed().toString(),                                 // 100
    oauth_version: '1.0'                                                                               // 101
  }, headers);                                                                                         // 102
};                                                                                                     // 103
                                                                                                       // 104
OAuth1Binding.prototype._getSignature = function(method, url, rawHeaders, accessTokenSecret, params) {
  var self = this;                                                                                     // 106
  var headers = self._encodeHeader(_.extend({}, rawHeaders, params));                                  // 107
                                                                                                       // 108
  var parameters = _.map(headers, function(val, key) {                                                 // 109
    return key + '=' + val;                                                                            // 110
  }).sort().join('&');                                                                                 // 111
                                                                                                       // 112
  var signatureBase = [                                                                                // 113
    method,                                                                                            // 114
    self._encodeString(url),                                                                           // 115
    self._encodeString(parameters)                                                                     // 116
  ].join('&');                                                                                         // 117
                                                                                                       // 118
  var secret = OAuth.openSecret(self._config.secret);                                                  // 119
                                                                                                       // 120
  var signingKey = self._encodeString(secret) + '&';                                                   // 121
  if (accessTokenSecret)                                                                               // 122
    signingKey += self._encodeString(accessTokenSecret);                                               // 123
                                                                                                       // 124
  return crypto.createHmac('SHA1', signingKey).update(signatureBase).digest('base64');                 // 125
};                                                                                                     // 126
                                                                                                       // 127
OAuth1Binding.prototype._call = function(method, url, headers, params, callback) {                     // 128
  var self = this;                                                                                     // 129
                                                                                                       // 130
  // all URLs to be functions to support parameters/customization                                      // 131
  if(typeof url === "function") {                                                                      // 132
    url = url(self);                                                                                   // 133
  }                                                                                                    // 134
                                                                                                       // 135
  headers = headers || {};                                                                             // 136
  params = params || {};                                                                               // 137
                                                                                                       // 138
  // Extract all query string parameters from the provided URL                                         // 139
  var parsedUrl = urlModule.parse(url, true);                                                          // 140
  // Merge them in a way that params given to the method call have precedence                          // 141
  params = _.extend({}, parsedUrl.query, params);                                                      // 142
                                                                                                       // 143
  // Reconstruct the URL back without any query string parameters                                      // 144
  // (they are now in params)                                                                          // 145
  parsedUrl.query = {};                                                                                // 146
  parsedUrl.search = '';                                                                               // 147
  url = urlModule.format(parsedUrl);                                                                   // 148
                                                                                                       // 149
  // Get the signature                                                                                 // 150
  headers.oauth_signature =                                                                            // 151
    self._getSignature(method, url, headers, self.accessTokenSecret, params);                          // 152
                                                                                                       // 153
  // Make a authorization string according to oauth1 spec                                              // 154
  var authString = self._getAuthHeaderString(headers);                                                 // 155
                                                                                                       // 156
  // Make signed request                                                                               // 157
  try {                                                                                                // 158
    var response = HTTP.call(method, url, {                                                            // 159
      params: params,                                                                                  // 160
      headers: {                                                                                       // 161
        Authorization: authString                                                                      // 162
      }                                                                                                // 163
    }, callback && function (error, response) {                                                        // 164
      if (! error) {                                                                                   // 165
        response.nonce = headers.oauth_nonce;                                                          // 166
      }                                                                                                // 167
      callback(error, response);                                                                       // 168
    });                                                                                                // 169
    // We store nonce so that JWTs can be validated                                                    // 170
    if (response)                                                                                      // 171
      response.nonce = headers.oauth_nonce;                                                            // 172
    return response;                                                                                   // 173
  } catch (err) {                                                                                      // 174
    throw _.extend(new Error("Failed to send OAuth1 request to " + url + ". " + err.message),          // 175
                   {response: err.response});                                                          // 176
  }                                                                                                    // 177
};                                                                                                     // 178
                                                                                                       // 179
OAuth1Binding.prototype._encodeHeader = function(header) {                                             // 180
  var self = this;                                                                                     // 181
  return _.reduce(header, function(memo, val, key) {                                                   // 182
    memo[self._encodeString(key)] = self._encodeString(val);                                           // 183
    return memo;                                                                                       // 184
  }, {});                                                                                              // 185
};                                                                                                     // 186
                                                                                                       // 187
OAuth1Binding.prototype._encodeString = function(str) {                                                // 188
  return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");                     // 189
};                                                                                                     // 190
                                                                                                       // 191
OAuth1Binding.prototype._getAuthHeaderString = function(headers) {                                     // 192
  var self = this;                                                                                     // 193
  return 'OAuth ' +  _.map(headers, function(val, key) {                                               // 194
    return self._encodeString(key) + '="' + self._encodeString(val) + '"';                             // 195
  }).sort().join(', ');                                                                                // 196
};                                                                                                     // 197
                                                                                                       // 198
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/oauth1/oauth1_server.js                                                                    //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var url = Npm.require("url");                                                                          // 1
                                                                                                       // 2
// connect middleware                                                                                  // 3
OAuth._requestHandlers['1'] = function (service, query, res) {                                         // 4
  var config = ServiceConfiguration.configurations.findOne({service: service.serviceName});            // 5
  if (! config) {                                                                                      // 6
    throw new ServiceConfiguration.ConfigError(service.serviceName);                                   // 7
  }                                                                                                    // 8
                                                                                                       // 9
  var urls = service.urls;                                                                             // 10
  var oauthBinding = new OAuth1Binding(config, urls);                                                  // 11
                                                                                                       // 12
  var credentialSecret;                                                                                // 13
                                                                                                       // 14
  if (query.requestTokenAndRedirect) {                                                                 // 15
    // step 1 - get and store a request token                                                          // 16
    var callbackUrl = OAuth._redirectUri(service.serviceName, config, {                                // 17
      state: query.state,                                                                              // 18
      cordova: (query.cordova === "true"),                                                             // 19
      android: (query.android === "true")                                                              // 20
    });                                                                                                // 21
                                                                                                       // 22
    // Get a request token to start auth process                                                       // 23
    oauthBinding.prepareRequestToken(callbackUrl);                                                     // 24
                                                                                                       // 25
    // Keep track of request token so we can verify it on the next step                                // 26
    OAuth._storeRequestToken(                                                                          // 27
      OAuth._credentialTokenFromQuery(query),                                                          // 28
      oauthBinding.requestToken,                                                                       // 29
      oauthBinding.requestTokenSecret);                                                                // 30
                                                                                                       // 31
    // support for scope/name parameters                                                               // 32
    var redirectUrl = undefined;                                                                       // 33
    if(typeof urls.authenticate === "function") {                                                      // 34
      redirectUrl = urls.authenticate(oauthBinding, {                                                  // 35
        query: query                                                                                   // 36
      });                                                                                              // 37
    } else {                                                                                           // 38
      // Parse the URL to support additional query parameters in urls.authenticate                     // 39
      var redirectUrlObj = url.parse(urls.authenticate, true);                                         // 40
      redirectUrlObj.query = redirectUrlObj.query || {};                                               // 41
      redirectUrlObj.query.oauth_token = oauthBinding.requestToken;                                    // 42
      redirectUrlObj.search = '';                                                                      // 43
      // Reconstruct the URL back with provided query parameters merged with oauth_token               // 44
      redirectUrl = url.format(redirectUrlObj);                                                        // 45
    }                                                                                                  // 46
                                                                                                       // 47
    // redirect to provider login, which will redirect back to "step 2" below                          // 48
                                                                                                       // 49
    res.writeHead(302, {'Location': redirectUrl});                                                     // 50
    res.end();                                                                                         // 51
  } else {                                                                                             // 52
    // step 2, redirected from provider login - store the result                                       // 53
    // and close the window to allow the login handler to proceed                                      // 54
                                                                                                       // 55
    // Get the user's request token so we can verify it and clear it                                   // 56
    var requestTokenInfo = OAuth._retrieveRequestToken(                                                // 57
      OAuth._credentialTokenFromQuery(query));                                                         // 58
                                                                                                       // 59
    if (! requestTokenInfo) {                                                                          // 60
      throw new Error("Unable to retrieve request token");                                             // 61
    }                                                                                                  // 62
                                                                                                       // 63
    // Verify user authorized access and the oauth_token matches                                       // 64
    // the requestToken from previous step                                                             // 65
    if (query.oauth_token && query.oauth_token === requestTokenInfo.requestToken) {                    // 66
                                                                                                       // 67
      // Prepare the login results before returning.  This way the                                     // 68
      // subsequent call to the `login` method will be immediate.                                      // 69
                                                                                                       // 70
      // Get the access token for signing requests                                                     // 71
      oauthBinding.prepareAccessToken(query, requestTokenInfo.requestTokenSecret);                     // 72
                                                                                                       // 73
      // Run service-specific handler.                                                                 // 74
      var oauthResult = service.handleOauthRequest(                                                    // 75
        oauthBinding, { query: query });                                                               // 76
                                                                                                       // 77
      var credentialToken = OAuth._credentialTokenFromQuery(query);                                    // 78
      credentialSecret = Random.secret();                                                              // 79
                                                                                                       // 80
      // Store the login result so it can be retrieved in another                                      // 81
      // browser tab by the result handler                                                             // 82
      OAuth._storePendingCredential(credentialToken, {                                                 // 83
        serviceName: service.serviceName,                                                              // 84
        serviceData: oauthResult.serviceData,                                                          // 85
        options: oauthResult.options                                                                   // 86
      }, credentialSecret);                                                                            // 87
    }                                                                                                  // 88
                                                                                                       // 89
    // Either close the window, redirect, or render nothing                                            // 90
    // if all else fails                                                                               // 91
    OAuth._renderOauthResults(res, query, credentialSecret);                                           // 92
  }                                                                                                    // 93
};                                                                                                     // 94
                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/oauth1/oauth1_pending_request_tokens.js                                                    //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
//                                                                                                     // 1
// _pendingRequestTokens are request tokens that have been received                                    // 2
// but not yet fully authorized (processed).                                                           // 3
//                                                                                                     // 4
// During the oauth1 authorization process, the Meteor App opens                                       // 5
// a pop-up, requests a request token from the oauth1 service, and                                     // 6
// redirects the browser to the oauth1 service for the user                                            // 7
// to grant authorization.  The user is then returned to the                                           // 8
// Meteor Apps' callback url and the request token is verified.                                        // 9
//                                                                                                     // 10
// When Meteor Apps run on multiple servers, it's possible that                                        // 11
// 2 different servers may be used to generate the request token                                       // 12
// and to verify it in the callback once the user has authorized.                                      // 13
//                                                                                                     // 14
// For this reason, the _pendingRequestTokens are stored in the database                               // 15
// so they can be shared across Meteor App servers.                                                    // 16
//                                                                                                     // 17
// XXX This code is fairly similar to oauth/pending_credentials.js --                                  // 18
// maybe we can combine them somehow.                                                                  // 19
                                                                                                       // 20
// Collection containing pending request tokens                                                        // 21
// Has key, requestToken, requestTokenSecret, and createdAt fields.                                    // 22
OAuth._pendingRequestTokens = new Mongo.Collection(                                                    // 23
  "meteor_oauth_pendingRequestTokens", {                                                               // 24
    _preventAutopublish: true                                                                          // 25
  });                                                                                                  // 26
                                                                                                       // 27
OAuth._pendingRequestTokens._ensureIndex('key', {unique: 1});                                          // 28
OAuth._pendingRequestTokens._ensureIndex('createdAt');                                                 // 29
                                                                                                       // 30
                                                                                                       // 31
                                                                                                       // 32
// Periodically clear old entries that never got completed                                             // 33
var _cleanStaleResults = function() {                                                                  // 34
  // Remove request tokens older than 5 minute                                                         // 35
  var timeCutoff = new Date();                                                                         // 36
  timeCutoff.setMinutes(timeCutoff.getMinutes() - 5);                                                  // 37
  OAuth._pendingRequestTokens.remove({ createdAt: { $lt: timeCutoff } });                              // 38
};                                                                                                     // 39
var _cleanupHandle = Meteor.setInterval(_cleanStaleResults, 60 * 1000);                                // 40
                                                                                                       // 41
                                                                                                       // 42
// Stores the key and request token in the _pendingRequestTokens collection.                           // 43
// Will throw an exception if `key` is not a string.                                                   // 44
//                                                                                                     // 45
// @param key {string}                                                                                 // 46
// @param requestToken {string}                                                                        // 47
// @param requestTokenSecret {string}                                                                  // 48
//                                                                                                     // 49
OAuth._storeRequestToken = function (key, requestToken, requestTokenSecret) {                          // 50
  check(key, String);                                                                                  // 51
                                                                                                       // 52
  // We do an upsert here instead of an insert in case the user happens                                // 53
  // to somehow send the same `state` parameter twice during an OAuth                                  // 54
  // login; we don't want a duplicate key error.                                                       // 55
  OAuth._pendingRequestTokens.upsert({                                                                 // 56
    key: key                                                                                           // 57
  }, {                                                                                                 // 58
    key: key,                                                                                          // 59
    requestToken: OAuth.sealSecret(requestToken),                                                      // 60
    requestTokenSecret: OAuth.sealSecret(requestTokenSecret),                                          // 61
    createdAt: new Date()                                                                              // 62
  });                                                                                                  // 63
};                                                                                                     // 64
                                                                                                       // 65
                                                                                                       // 66
// Retrieves and removes a request token from the _pendingRequestTokens collection                     // 67
// Returns an object containing requestToken and requestTokenSecret properties                         // 68
//                                                                                                     // 69
// @param key {string}                                                                                 // 70
//                                                                                                     // 71
OAuth._retrieveRequestToken = function (key) {                                                         // 72
  check(key, String);                                                                                  // 73
                                                                                                       // 74
  var pendingRequestToken = OAuth._pendingRequestTokens.findOne({ key: key });                         // 75
  if (pendingRequestToken) {                                                                           // 76
    OAuth._pendingRequestTokens.remove({ _id: pendingRequestToken._id });                              // 77
    return {                                                                                           // 78
      requestToken: OAuth.openSecret(pendingRequestToken.requestToken),                                // 79
      requestTokenSecret: OAuth.openSecret(                                                            // 80
        pendingRequestToken.requestTokenSecret)                                                        // 81
    };                                                                                                 // 82
  } else {                                                                                             // 83
    return undefined;                                                                                  // 84
  }                                                                                                    // 85
};                                                                                                     // 86
                                                                                                       // 87
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.oauth1 = {
  OAuth1Binding: OAuth1Binding,
  OAuth1Test: OAuth1Test
};

})();

//# sourceMappingURL=oauth1.js.map
