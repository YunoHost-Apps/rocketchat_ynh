(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Retry = Package.retry.Retry;
var IdMap = Package['id-map'].IdMap;
var DDPCommon = Package['ddp-common'].DDPCommon;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var MongoID = Package['mongo-id'].MongoID;

/* Package-scope variables */
var DDP, LivedataTest, MongoIDMap, toSockjsUrl, toWebsocketUrl, allConnections;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/namespace.js                                                                           //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/**                                                                                                           // 1
 * @namespace DDP                                                                                             // 2
 * @summary Namespace for DDP-related methods/classes.                                                        // 3
 */                                                                                                           // 4
DDP          = {};                                                                                            // 5
LivedataTest = {};                                                                                            // 6
                                                                                                              // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/id_map.js                                                                              //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
MongoIDMap = function () {                                                                                    // 1
  var self = this;                                                                                            // 2
  IdMap.call(self, MongoID.idStringify, MongoID.idParse);                                                     // 3
};                                                                                                            // 4
                                                                                                              // 5
Meteor._inherits(MongoIDMap, IdMap);                                                                          // 6
                                                                                                              // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/stream_client_nodejs.js                                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// @param endpoint {String} URL to Meteor app                                                                 // 1
//   "http://subdomain.meteor.com/" or "/" or                                                                 // 2
//   "ddp+sockjs://foo-**.meteor.com/sockjs"                                                                  // 3
//                                                                                                            // 4
// We do some rewriting of the URL to eventually make it "ws://" or "wss://",                                 // 5
// whatever was passed in.  At the very least, what Meteor.absoluteUrl() returns                              // 6
// us should work.                                                                                            // 7
//                                                                                                            // 8
// We don't do any heartbeating. (The logic that did this in sockjs was removed,                              // 9
// because it used a built-in sockjs mechanism. We could do it with WebSocket                                 // 10
// ping frames or with DDP-level messages.)                                                                   // 11
LivedataTest.ClientStream = function (endpoint, options) {                                                    // 12
  var self = this;                                                                                            // 13
  options = options || {};                                                                                    // 14
                                                                                                              // 15
  self.options = _.extend({                                                                                   // 16
    retry: true                                                                                               // 17
  }, options);                                                                                                // 18
                                                                                                              // 19
  self.client = null;  // created in _launchConnection                                                        // 20
  self.endpoint = endpoint;                                                                                   // 21
                                                                                                              // 22
  self.headers = self.options.headers || {};                                                                  // 23
                                                                                                              // 24
  self._initCommon(self.options);                                                                             // 25
                                                                                                              // 26
  //// Kickoff!                                                                                               // 27
  self._launchConnection();                                                                                   // 28
};                                                                                                            // 29
                                                                                                              // 30
_.extend(LivedataTest.ClientStream.prototype, {                                                               // 31
                                                                                                              // 32
  // data is a utf8 string. Data sent while not connected is dropped on                                       // 33
  // the floor, and it is up the user of this API to retransmit lost                                          // 34
  // messages on 'reset'                                                                                      // 35
  send: function (data) {                                                                                     // 36
    var self = this;                                                                                          // 37
    if (self.currentStatus.connected) {                                                                       // 38
      self.client.send(data);                                                                                 // 39
    }                                                                                                         // 40
  },                                                                                                          // 41
                                                                                                              // 42
  // Changes where this connection points                                                                     // 43
  _changeUrl: function (url) {                                                                                // 44
    var self = this;                                                                                          // 45
    self.endpoint = url;                                                                                      // 46
  },                                                                                                          // 47
                                                                                                              // 48
  _onConnect: function (client) {                                                                             // 49
    var self = this;                                                                                          // 50
                                                                                                              // 51
    if (client !== self.client) {                                                                             // 52
      // This connection is not from the last call to _launchConnection.                                      // 53
      // But _launchConnection calls _cleanup which closes previous connections.                              // 54
      // It's our belief that this stifles future 'open' events, but maybe                                    // 55
      // we are wrong?                                                                                        // 56
      throw new Error("Got open from inactive client " + !!self.client);                                      // 57
    }                                                                                                         // 58
                                                                                                              // 59
    if (self._forcedToDisconnect) {                                                                           // 60
      // We were asked to disconnect between trying to open the connection and                                // 61
      // actually opening it. Let's just pretend this never happened.                                         // 62
      self.client.close();                                                                                    // 63
      self.client = null;                                                                                     // 64
      return;                                                                                                 // 65
    }                                                                                                         // 66
                                                                                                              // 67
    if (self.currentStatus.connected) {                                                                       // 68
      // We already have a connection. It must have been the case that we                                     // 69
      // started two parallel connection attempts (because we wanted to                                       // 70
      // 'reconnect now' on a hanging connection and we had no way to cancel the                              // 71
      // connection attempt.) But this shouldn't happen (similarly to the client                              // 72
      // !== self.client check above).                                                                        // 73
      throw new Error("Two parallel connections?");                                                           // 74
    }                                                                                                         // 75
                                                                                                              // 76
    self._clearConnectionTimer();                                                                             // 77
                                                                                                              // 78
    // update status                                                                                          // 79
    self.currentStatus.status = "connected";                                                                  // 80
    self.currentStatus.connected = true;                                                                      // 81
    self.currentStatus.retryCount = 0;                                                                        // 82
    self.statusChanged();                                                                                     // 83
                                                                                                              // 84
    // fire resets. This must come after status change so that clients                                        // 85
    // can call send from within a reset callback.                                                            // 86
    _.each(self.eventCallbacks.reset, function (callback) { callback(); });                                   // 87
  },                                                                                                          // 88
                                                                                                              // 89
  _cleanup: function (maybeError) {                                                                           // 90
    var self = this;                                                                                          // 91
                                                                                                              // 92
    self._clearConnectionTimer();                                                                             // 93
    if (self.client) {                                                                                        // 94
      var client = self.client;                                                                               // 95
      self.client = null;                                                                                     // 96
      client.close();                                                                                         // 97
                                                                                                              // 98
      _.each(self.eventCallbacks.disconnect, function (callback) {                                            // 99
        callback(maybeError);                                                                                 // 100
      });                                                                                                     // 101
    }                                                                                                         // 102
  },                                                                                                          // 103
                                                                                                              // 104
  _clearConnectionTimer: function () {                                                                        // 105
    var self = this;                                                                                          // 106
                                                                                                              // 107
    if (self.connectionTimer) {                                                                               // 108
      clearTimeout(self.connectionTimer);                                                                     // 109
      self.connectionTimer = null;                                                                            // 110
    }                                                                                                         // 111
  },                                                                                                          // 112
                                                                                                              // 113
  _getProxyUrl: function (targetUrl) {                                                                        // 114
    var self = this;                                                                                          // 115
    // Similar to code in tools/http-helpers.js.                                                              // 116
    var proxy = process.env.HTTP_PROXY || process.env.http_proxy || null;                                     // 117
    // if we're going to a secure url, try the https_proxy env variable first.                                // 118
    if (targetUrl.match(/^wss:/)) {                                                                           // 119
      proxy = process.env.HTTPS_PROXY || process.env.https_proxy || proxy;                                    // 120
    }                                                                                                         // 121
    return proxy;                                                                                             // 122
  },                                                                                                          // 123
                                                                                                              // 124
  _launchConnection: function () {                                                                            // 125
    var self = this;                                                                                          // 126
    self._cleanup(); // cleanup the old socket, if there was one.                                             // 127
                                                                                                              // 128
    // Since server-to-server DDP is still an experimental feature, we only                                   // 129
    // require the module if we actually create a server-to-server                                            // 130
    // connection.                                                                                            // 131
    var FayeWebSocket = Npm.require('faye-websocket');                                                        // 132
    var deflate = Npm.require('permessage-deflate');                                                          // 133
                                                                                                              // 134
    var targetUrl = toWebsocketUrl(self.endpoint);                                                            // 135
    var fayeOptions = {                                                                                       // 136
      headers: self.headers,                                                                                  // 137
      extensions: [deflate]                                                                                   // 138
    };                                                                                                        // 139
    var proxyUrl = self._getProxyUrl(targetUrl);                                                              // 140
    if (proxyUrl) {                                                                                           // 141
      fayeOptions.proxy = { origin: proxyUrl };                                                               // 142
    };                                                                                                        // 143
                                                                                                              // 144
    // We would like to specify 'ddp' as the subprotocol here. The npm module we                              // 145
    // used to use as a client would fail the handshake if we ask for a                                       // 146
    // subprotocol and the server doesn't send one back (and sockjs doesn't).                                 // 147
    // Faye doesn't have that behavior; it's unclear from reading RFC 6455 if                                 // 148
    // Faye is erroneous or not.  So for now, we don't specify protocols.                                     // 149
    var subprotocols = [];                                                                                    // 150
                                                                                                              // 151
    var client = self.client = new FayeWebSocket.Client(                                                      // 152
      targetUrl, subprotocols, fayeOptions);                                                                  // 153
                                                                                                              // 154
    self._clearConnectionTimer();                                                                             // 155
    self.connectionTimer = Meteor.setTimeout(                                                                 // 156
      function () {                                                                                           // 157
        self._lostConnection(                                                                                 // 158
          new DDP.ConnectionError("DDP connection timed out"));                                               // 159
      },                                                                                                      // 160
      self.CONNECT_TIMEOUT);                                                                                  // 161
                                                                                                              // 162
    self.client.on('open', Meteor.bindEnvironment(function () {                                               // 163
      return self._onConnect(client);                                                                         // 164
    }, "stream connect callback"));                                                                           // 165
                                                                                                              // 166
    var clientOnIfCurrent = function (event, description, f) {                                                // 167
      self.client.on(event, Meteor.bindEnvironment(function () {                                              // 168
        // Ignore events from any connection we've already cleaned up.                                        // 169
        if (client !== self.client)                                                                           // 170
          return;                                                                                             // 171
        f.apply(this, arguments);                                                                             // 172
      }, description));                                                                                       // 173
    };                                                                                                        // 174
                                                                                                              // 175
    clientOnIfCurrent('error', 'stream error callback', function (error) {                                    // 176
      if (!self.options._dontPrintErrors)                                                                     // 177
        Meteor._debug("stream error", error.message);                                                         // 178
                                                                                                              // 179
      // Faye's 'error' object is not a JS error (and among other things,                                     // 180
      // doesn't stringify well). Convert it to one.                                                          // 181
      self._lostConnection(new DDP.ConnectionError(error.message));                                           // 182
    });                                                                                                       // 183
                                                                                                              // 184
                                                                                                              // 185
    clientOnIfCurrent('close', 'stream close callback', function () {                                         // 186
      self._lostConnection();                                                                                 // 187
    });                                                                                                       // 188
                                                                                                              // 189
                                                                                                              // 190
    clientOnIfCurrent('message', 'stream message callback', function (message) {                              // 191
      // Ignore binary frames, where message.data is a Buffer                                                 // 192
      if (typeof message.data !== "string")                                                                   // 193
        return;                                                                                               // 194
                                                                                                              // 195
      _.each(self.eventCallbacks.message, function (callback) {                                               // 196
        callback(message.data);                                                                               // 197
      });                                                                                                     // 198
    });                                                                                                       // 199
  }                                                                                                           // 200
});                                                                                                           // 201
                                                                                                              // 202
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/stream_client_common.js                                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// XXX from Underscore.String (http://epeli.github.com/underscore.string/)                                    // 1
var startsWith = function(str, starts) {                                                                      // 2
  return str.length >= starts.length &&                                                                       // 3
    str.substring(0, starts.length) === starts;                                                               // 4
};                                                                                                            // 5
var endsWith = function(str, ends) {                                                                          // 6
  return str.length >= ends.length &&                                                                         // 7
    str.substring(str.length - ends.length) === ends;                                                         // 8
};                                                                                                            // 9
                                                                                                              // 10
// @param url {String} URL to Meteor app, eg:                                                                 // 11
//   "/" or "madewith.meteor.com" or "https://foo.meteor.com"                                                 // 12
//   or "ddp+sockjs://ddp--****-foo.meteor.com/sockjs"                                                        // 13
// @returns {String} URL to the endpoint with the specific scheme and subPath, e.g.                           // 14
// for scheme "http" and subPath "sockjs"                                                                     // 15
//   "http://subdomain.meteor.com/sockjs" or "/sockjs"                                                        // 16
//   or "https://ddp--1234-foo.meteor.com/sockjs"                                                             // 17
var translateUrl =  function(url, newSchemeBase, subPath) {                                                   // 18
  if (! newSchemeBase) {                                                                                      // 19
    newSchemeBase = "http";                                                                                   // 20
  }                                                                                                           // 21
                                                                                                              // 22
  var ddpUrlMatch = url.match(/^ddp(i?)\+sockjs:\/\//);                                                       // 23
  var httpUrlMatch = url.match(/^http(s?):\/\//);                                                             // 24
  var newScheme;                                                                                              // 25
  if (ddpUrlMatch) {                                                                                          // 26
    // Remove scheme and split off the host.                                                                  // 27
    var urlAfterDDP = url.substr(ddpUrlMatch[0].length);                                                      // 28
    newScheme = ddpUrlMatch[1] === "i" ? newSchemeBase : newSchemeBase + "s";                                 // 29
    var slashPos = urlAfterDDP.indexOf('/');                                                                  // 30
    var host =                                                                                                // 31
          slashPos === -1 ? urlAfterDDP : urlAfterDDP.substr(0, slashPos);                                    // 32
    var rest = slashPos === -1 ? '' : urlAfterDDP.substr(slashPos);                                           // 33
                                                                                                              // 34
    // In the host (ONLY!), change '*' characters into random digits. This                                    // 35
    // allows different stream connections to connect to different hostnames                                  // 36
    // and avoid browser per-hostname connection limits.                                                      // 37
    host = host.replace(/\*/g, function () {                                                                  // 38
      return Math.floor(Random.fraction()*10);                                                                // 39
    });                                                                                                       // 40
                                                                                                              // 41
    return newScheme + '://' + host + rest;                                                                   // 42
  } else if (httpUrlMatch) {                                                                                  // 43
    newScheme = !httpUrlMatch[1] ? newSchemeBase : newSchemeBase + "s";                                       // 44
    var urlAfterHttp = url.substr(httpUrlMatch[0].length);                                                    // 45
    url = newScheme + "://" + urlAfterHttp;                                                                   // 46
  }                                                                                                           // 47
                                                                                                              // 48
  // Prefix FQDNs but not relative URLs                                                                       // 49
  if (url.indexOf("://") === -1 && !startsWith(url, "/")) {                                                   // 50
    url = newSchemeBase + "://" + url;                                                                        // 51
  }                                                                                                           // 52
                                                                                                              // 53
  // XXX This is not what we should be doing: if I have a site                                                // 54
  // deployed at "/foo", then DDP.connect("/") should actually connect                                        // 55
  // to "/", not to "/foo". "/" is an absolute path. (Contrast: if                                            // 56
  // deployed at "/foo", it would be reasonable for DDP.connect("bar")                                        // 57
  // to connect to "/foo/bar").                                                                               // 58
  //                                                                                                          // 59
  // We should make this properly honor absolute paths rather than                                            // 60
  // forcing the path to be relative to the site root. Simultaneously,                                        // 61
  // we should set DDP_DEFAULT_CONNECTION_URL to include the site                                             // 62
  // root. See also client_convenience.js #RationalizingRelativeDDPURLs                                       // 63
  url = Meteor._relativeToSiteRootUrl(url);                                                                   // 64
                                                                                                              // 65
  if (endsWith(url, "/"))                                                                                     // 66
    return url + subPath;                                                                                     // 67
  else                                                                                                        // 68
    return url + "/" + subPath;                                                                               // 69
};                                                                                                            // 70
                                                                                                              // 71
toSockjsUrl = function (url) {                                                                                // 72
  return translateUrl(url, "http", "sockjs");                                                                 // 73
};                                                                                                            // 74
                                                                                                              // 75
toWebsocketUrl = function (url) {                                                                             // 76
  var ret = translateUrl(url, "ws", "websocket");                                                             // 77
  return ret;                                                                                                 // 78
};                                                                                                            // 79
                                                                                                              // 80
LivedataTest.toSockjsUrl = toSockjsUrl;                                                                       // 81
                                                                                                              // 82
                                                                                                              // 83
_.extend(LivedataTest.ClientStream.prototype, {                                                               // 84
                                                                                                              // 85
  // Register for callbacks.                                                                                  // 86
  on: function (name, callback) {                                                                             // 87
    var self = this;                                                                                          // 88
                                                                                                              // 89
    if (name !== 'message' && name !== 'reset' && name !== 'disconnect')                                      // 90
      throw new Error("unknown event type: " + name);                                                         // 91
                                                                                                              // 92
    if (!self.eventCallbacks[name])                                                                           // 93
      self.eventCallbacks[name] = [];                                                                         // 94
    self.eventCallbacks[name].push(callback);                                                                 // 95
  },                                                                                                          // 96
                                                                                                              // 97
                                                                                                              // 98
  _initCommon: function (options) {                                                                           // 99
    var self = this;                                                                                          // 100
    options = options || {};                                                                                  // 101
                                                                                                              // 102
    //// Constants                                                                                            // 103
                                                                                                              // 104
    // how long to wait until we declare the connection attempt                                               // 105
    // failed.                                                                                                // 106
    self.CONNECT_TIMEOUT = options.connectTimeoutMs || 10000;                                                 // 107
                                                                                                              // 108
    self.eventCallbacks = {}; // name -> [callback]                                                           // 109
                                                                                                              // 110
    self._forcedToDisconnect = false;                                                                         // 111
                                                                                                              // 112
    //// Reactive status                                                                                      // 113
    self.currentStatus = {                                                                                    // 114
      status: "connecting",                                                                                   // 115
      connected: false,                                                                                       // 116
      retryCount: 0                                                                                           // 117
    };                                                                                                        // 118
                                                                                                              // 119
                                                                                                              // 120
    self.statusListeners = typeof Tracker !== 'undefined' && new Tracker.Dependency;                          // 121
    self.statusChanged = function () {                                                                        // 122
      if (self.statusListeners)                                                                               // 123
        self.statusListeners.changed();                                                                       // 124
    };                                                                                                        // 125
                                                                                                              // 126
    //// Retry logic                                                                                          // 127
    self._retry = new Retry;                                                                                  // 128
    self.connectionTimer = null;                                                                              // 129
                                                                                                              // 130
  },                                                                                                          // 131
                                                                                                              // 132
  // Trigger a reconnect.                                                                                     // 133
  reconnect: function (options) {                                                                             // 134
    var self = this;                                                                                          // 135
    options = options || {};                                                                                  // 136
                                                                                                              // 137
    if (options.url) {                                                                                        // 138
      self._changeUrl(options.url);                                                                           // 139
    }                                                                                                         // 140
                                                                                                              // 141
    if (options._sockjsOptions) {                                                                             // 142
      self.options._sockjsOptions = options._sockjsOptions;                                                   // 143
    }                                                                                                         // 144
                                                                                                              // 145
    if (self.currentStatus.connected) {                                                                       // 146
      if (options._force || options.url) {                                                                    // 147
        // force reconnect.                                                                                   // 148
        self._lostConnection(new DDP.ForcedReconnectError);                                                   // 149
      } // else, noop.                                                                                        // 150
      return;                                                                                                 // 151
    }                                                                                                         // 152
                                                                                                              // 153
    // if we're mid-connection, stop it.                                                                      // 154
    if (self.currentStatus.status === "connecting") {                                                         // 155
      // Pretend it's a clean close.                                                                          // 156
      self._lostConnection();                                                                                 // 157
    }                                                                                                         // 158
                                                                                                              // 159
    self._retry.clear();                                                                                      // 160
    self.currentStatus.retryCount -= 1; // don't count manual retries                                         // 161
    self._retryNow();                                                                                         // 162
  },                                                                                                          // 163
                                                                                                              // 164
  disconnect: function (options) {                                                                            // 165
    var self = this;                                                                                          // 166
    options = options || {};                                                                                  // 167
                                                                                                              // 168
    // Failed is permanent. If we're failed, don't let people go back                                         // 169
    // online by calling 'disconnect' then 'reconnect'.                                                       // 170
    if (self._forcedToDisconnect)                                                                             // 171
      return;                                                                                                 // 172
                                                                                                              // 173
    // If _permanent is set, permanently disconnect a stream. Once a stream                                   // 174
    // is forced to disconnect, it can never reconnect. This is for                                           // 175
    // error cases such as ddp version mismatch, where trying again                                           // 176
    // won't fix the problem.                                                                                 // 177
    if (options._permanent) {                                                                                 // 178
      self._forcedToDisconnect = true;                                                                        // 179
    }                                                                                                         // 180
                                                                                                              // 181
    self._cleanup();                                                                                          // 182
    self._retry.clear();                                                                                      // 183
                                                                                                              // 184
    self.currentStatus = {                                                                                    // 185
      status: (options._permanent ? "failed" : "offline"),                                                    // 186
      connected: false,                                                                                       // 187
      retryCount: 0                                                                                           // 188
    };                                                                                                        // 189
                                                                                                              // 190
    if (options._permanent && options._error)                                                                 // 191
      self.currentStatus.reason = options._error;                                                             // 192
                                                                                                              // 193
    self.statusChanged();                                                                                     // 194
  },                                                                                                          // 195
                                                                                                              // 196
  // maybeError is set unless it's a clean protocol-level close.                                              // 197
  _lostConnection: function (maybeError) {                                                                    // 198
    var self = this;                                                                                          // 199
                                                                                                              // 200
    self._cleanup(maybeError);                                                                                // 201
    self._retryLater(maybeError); // sets status. no need to do it here.                                      // 202
  },                                                                                                          // 203
                                                                                                              // 204
  // fired when we detect that we've gone online. try to reconnect                                            // 205
  // immediately.                                                                                             // 206
  _online: function () {                                                                                      // 207
    // if we've requested to be offline by disconnecting, don't reconnect.                                    // 208
    if (this.currentStatus.status != "offline")                                                               // 209
      this.reconnect();                                                                                       // 210
  },                                                                                                          // 211
                                                                                                              // 212
  _retryLater: function (maybeError) {                                                                        // 213
    var self = this;                                                                                          // 214
                                                                                                              // 215
    var timeout = 0;                                                                                          // 216
    if (self.options.retry ||                                                                                 // 217
        (maybeError && maybeError.errorType === "DDP.ForcedReconnectError")) {                                // 218
      timeout = self._retry.retryLater(                                                                       // 219
        self.currentStatus.retryCount,                                                                        // 220
        _.bind(self._retryNow, self)                                                                          // 221
      );                                                                                                      // 222
      self.currentStatus.status = "waiting";                                                                  // 223
      self.currentStatus.retryTime = (new Date()).getTime() + timeout;                                        // 224
    } else {                                                                                                  // 225
      self.currentStatus.status = "failed";                                                                   // 226
      delete self.currentStatus.retryTime;                                                                    // 227
    }                                                                                                         // 228
                                                                                                              // 229
    self.currentStatus.connected = false;                                                                     // 230
    self.statusChanged();                                                                                     // 231
  },                                                                                                          // 232
                                                                                                              // 233
  _retryNow: function () {                                                                                    // 234
    var self = this;                                                                                          // 235
                                                                                                              // 236
    if (self._forcedToDisconnect)                                                                             // 237
      return;                                                                                                 // 238
                                                                                                              // 239
    self.currentStatus.retryCount += 1;                                                                       // 240
    self.currentStatus.status = "connecting";                                                                 // 241
    self.currentStatus.connected = false;                                                                     // 242
    delete self.currentStatus.retryTime;                                                                      // 243
    self.statusChanged();                                                                                     // 244
                                                                                                              // 245
    self._launchConnection();                                                                                 // 246
  },                                                                                                          // 247
                                                                                                              // 248
                                                                                                              // 249
  // Get current status. Reactive.                                                                            // 250
  status: function () {                                                                                       // 251
    var self = this;                                                                                          // 252
    if (self.statusListeners)                                                                                 // 253
      self.statusListeners.depend();                                                                          // 254
    return self.currentStatus;                                                                                // 255
  }                                                                                                           // 256
});                                                                                                           // 257
                                                                                                              // 258
DDP.ConnectionError = Meteor.makeErrorType(                                                                   // 259
  "DDP.ConnectionError", function (message) {                                                                 // 260
    var self = this;                                                                                          // 261
    self.message = message;                                                                                   // 262
});                                                                                                           // 263
                                                                                                              // 264
DDP.ForcedReconnectError = Meteor.makeErrorType(                                                              // 265
  "DDP.ForcedReconnectError", function () {});                                                                // 266
                                                                                                              // 267
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/livedata_common.js                                                                     //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
LivedataTest.SUPPORTED_DDP_VERSIONS = DDPCommon.SUPPORTED_DDP_VERSIONS;                                       // 1
                                                                                                              // 2
// This is private but it's used in a few places. accounts-base uses                                          // 3
// it to get the current user. Meteor.setTimeout and friends clear                                            // 4
// it. We can probably find a better way to factor this.                                                      // 5
DDP._CurrentInvocation = new Meteor.EnvironmentVariable;                                                      // 6
                                                                                                              // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/random_stream.js                                                                       //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// Returns the named sequence of pseudo-random values.                                                        // 1
// The scope will be DDP._CurrentInvocation.get(), so the stream will produce                                 // 2
// consistent values for method calls on the client and server.                                               // 3
DDP.randomStream = function (name) {                                                                          // 4
  var scope = DDP._CurrentInvocation.get();                                                                   // 5
  return DDPCommon.RandomStream.get(scope, name);                                                             // 6
};                                                                                                            // 7
                                                                                                              // 8
                                                                                                              // 9
                                                                                                              // 10
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ddp-client/livedata_connection.js                                                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
if (Meteor.isServer) {                                                                                        // 1
  var path = Npm.require('path');                                                                             // 2
  var Fiber = Npm.require('fibers');                                                                          // 3
  var Future = Npm.require(path.join('fibers', 'future'));                                                    // 4
}                                                                                                             // 5
                                                                                                              // 6
// @param url {String|Object} URL to Meteor app,                                                              // 7
//   or an object as a test hook (see code)                                                                   // 8
// Options:                                                                                                   // 9
//   reloadWithOutstanding: is it OK to reload if there are outstanding methods?                              // 10
//   headers: extra headers to send on the websockets connection, for                                         // 11
//     server-to-server DDP only                                                                              // 12
//   _sockjsOptions: Specifies options to pass through to the sockjs client                                   // 13
//   onDDPNegotiationVersionFailure: callback when version negotiation fails.                                 // 14
//                                                                                                            // 15
// XXX There should be a way to destroy a DDP connection, causing all                                         // 16
// outstanding method calls to fail.                                                                          // 17
//                                                                                                            // 18
// XXX Our current way of handling failure and reconnection is great                                          // 19
// for an app (where we want to tolerate being disconnected as an                                             // 20
// expect state, and keep trying forever to reconnect) but cumbersome                                         // 21
// for something like a command line tool that wants to make a                                                // 22
// connection, call a method, and print an error if connection                                                // 23
// fails. We should have better usability in the latter case (while                                           // 24
// still transparently reconnecting if it's just a transient failure                                          // 25
// or the server migrating us).                                                                               // 26
var Connection = function (url, options) {                                                                    // 27
  var self = this;                                                                                            // 28
  options = _.extend({                                                                                        // 29
    onConnected: function () {},                                                                              // 30
    onDDPVersionNegotiationFailure: function (description) {                                                  // 31
      Meteor._debug(description);                                                                             // 32
    },                                                                                                        // 33
    heartbeatInterval: 17500,                                                                                 // 34
    heartbeatTimeout: 15000,                                                                                  // 35
    // These options are only for testing.                                                                    // 36
    reloadWithOutstanding: false,                                                                             // 37
    supportedDDPVersions: DDPCommon.SUPPORTED_DDP_VERSIONS,                                                   // 38
    retry: true,                                                                                              // 39
    respondToPings: true                                                                                      // 40
  }, options);                                                                                                // 41
                                                                                                              // 42
  // If set, called when we reconnect, queuing method calls _before_ the                                      // 43
  // existing outstanding ones. This is the only data member that is part of the                              // 44
  // public API!                                                                                              // 45
  self.onReconnect = null;                                                                                    // 46
                                                                                                              // 47
  // as a test hook, allow passing a stream instead of a url.                                                 // 48
  if (typeof url === "object") {                                                                              // 49
    self._stream = url;                                                                                       // 50
  } else {                                                                                                    // 51
    self._stream = new LivedataTest.ClientStream(url, {                                                       // 52
      retry: options.retry,                                                                                   // 53
      headers: options.headers,                                                                               // 54
      _sockjsOptions: options._sockjsOptions,                                                                 // 55
      // Used to keep some tests quiet, or for other cases in which                                           // 56
      // the right thing to do with connection errors is to silently                                          // 57
      // fail (e.g. sending package usage stats). At some point we                                            // 58
      // should have a real API for handling client-stream-level                                              // 59
      // errors.                                                                                              // 60
      _dontPrintErrors: options._dontPrintErrors,                                                             // 61
      connectTimeoutMs: options.connectTimeoutMs                                                              // 62
    });                                                                                                       // 63
  }                                                                                                           // 64
                                                                                                              // 65
  self._lastSessionId = null;                                                                                 // 66
  self._versionSuggestion = null;  // The last proposed DDP version.                                          // 67
  self._version = null;   // The DDP version agreed on by client and server.                                  // 68
  self._stores = {}; // name -> object with methods                                                           // 69
  self._methodHandlers = {}; // name -> func                                                                  // 70
  self._nextMethodId = 1;                                                                                     // 71
  self._supportedDDPVersions = options.supportedDDPVersions;                                                  // 72
                                                                                                              // 73
  self._heartbeatInterval = options.heartbeatInterval;                                                        // 74
  self._heartbeatTimeout = options.heartbeatTimeout;                                                          // 75
                                                                                                              // 76
  // Tracks methods which the user has tried to call but which have not yet                                   // 77
  // called their user callback (ie, they are waiting on their result or for all                              // 78
  // of their writes to be written to the local cache). Map from method ID to                                 // 79
  // MethodInvoker object.                                                                                    // 80
  self._methodInvokers = {};                                                                                  // 81
                                                                                                              // 82
  // Tracks methods which the user has called but whose result messages have not                              // 83
  // arrived yet.                                                                                             // 84
  //                                                                                                          // 85
  // _outstandingMethodBlocks is an array of blocks of methods. Each block                                    // 86
  // represents a set of methods that can run at the same time. The first block                               // 87
  // represents the methods which are currently in flight; subsequent blocks                                  // 88
  // must wait for previous blocks to be fully finished before they can be sent                               // 89
  // to the server.                                                                                           // 90
  //                                                                                                          // 91
  // Each block is an object with the following fields:                                                       // 92
  // - methods: a list of MethodInvoker objects                                                               // 93
  // - wait: a boolean; if true, this block had a single method invoked with                                  // 94
  //         the "wait" option                                                                                // 95
  //                                                                                                          // 96
  // There will never be adjacent blocks with wait=false, because the only thing                              // 97
  // that makes methods need to be serialized is a wait method.                                               // 98
  //                                                                                                          // 99
  // Methods are removed from the first block when their "result" is                                          // 100
  // received. The entire first block is only removed when all of the in-flight                               // 101
  // methods have received their results (so the "methods" list is empty) *AND*                               // 102
  // all of the data written by those methods are visible in the local cache. So                              // 103
  // it is possible for the first block's methods list to be empty, if we are                                 // 104
  // still waiting for some objects to quiesce.                                                               // 105
  //                                                                                                          // 106
  // Example:                                                                                                 // 107
  //  _outstandingMethodBlocks = [                                                                            // 108
  //    {wait: false, methods: []},                                                                           // 109
  //    {wait: true, methods: [<MethodInvoker for 'login'>]},                                                 // 110
  //    {wait: false, methods: [<MethodInvoker for 'foo'>,                                                    // 111
  //                            <MethodInvoker for 'bar'>]}]                                                  // 112
  // This means that there were some methods which were sent to the server and                                // 113
  // which have returned their results, but some of the data written by                                       // 114
  // the methods may not be visible in the local cache. Once all that data is                                 // 115
  // visible, we will send a 'login' method. Once the login method has returned                               // 116
  // and all the data is visible (including re-running subs if userId changes),                               // 117
  // we will send the 'foo' and 'bar' methods in parallel.                                                    // 118
  self._outstandingMethodBlocks = [];                                                                         // 119
                                                                                                              // 120
  // method ID -> array of objects with keys 'collection' and 'id', listing                                   // 121
  // documents written by a given method's stub. keys are associated with                                     // 122
  // methods whose stub wrote at least one document, and whose data-done message                              // 123
  // has not yet been received.                                                                               // 124
  self._documentsWrittenByStub = {};                                                                          // 125
  // collection -> IdMap of "server document" object. A "server document" has:                                // 126
  // - "document": the version of the document according the                                                  // 127
  //   server (ie, the snapshot before a stub wrote it, amended by any changes                                // 128
  //   received from the server)                                                                              // 129
  //   It is undefined if we think the document does not exist                                                // 130
  // - "writtenByStubs": a set of method IDs whose stubs wrote to the document                                // 131
  //   whose "data done" messages have not yet been processed                                                 // 132
  self._serverDocuments = {};                                                                                 // 133
                                                                                                              // 134
  // Array of callbacks to be called after the next update of the local                                       // 135
  // cache. Used for:                                                                                         // 136
  //  - Calling methodInvoker.dataVisible and sub ready callbacks after                                       // 137
  //    the relevant data is flushed.                                                                         // 138
  //  - Invoking the callbacks of "half-finished" methods after reconnect                                     // 139
  //    quiescence. Specifically, methods whose result was received over the old                              // 140
  //    connection (so we don't re-send it) but whose data had not been made                                  // 141
  //    visible.                                                                                              // 142
  self._afterUpdateCallbacks = [];                                                                            // 143
                                                                                                              // 144
  // In two contexts, we buffer all incoming data messages and then process them                              // 145
  // all at once in a single update:                                                                          // 146
  //   - During reconnect, we buffer all data messages until all subs that had                                // 147
  //     been ready before reconnect are ready again, and all methods that are                                // 148
  //     active have returned their "data done message"; then                                                 // 149
  //   - During the execution of a "wait" method, we buffer all data messages                                 // 150
  //     until the wait method gets its "data done" message. (If the wait method                              // 151
  //     occurs during reconnect, it doesn't get any special handling.)                                       // 152
  // all data messages are processed in one update.                                                           // 153
  //                                                                                                          // 154
  // The following fields are used for this "quiescence" process.                                             // 155
                                                                                                              // 156
  // This buffers the messages that aren't being processed yet.                                               // 157
  self._messagesBufferedUntilQuiescence = [];                                                                 // 158
  // Map from method ID -> true. Methods are removed from this when their                                     // 159
  // "data done" message is received, and we will not quiesce until it is                                     // 160
  // empty.                                                                                                   // 161
  self._methodsBlockingQuiescence = {};                                                                       // 162
  // map from sub ID -> true for subs that were ready (ie, called the sub                                     // 163
  // ready callback) before reconnect but haven't become ready again yet                                      // 164
  self._subsBeingRevived = {}; // map from sub._id -> true                                                    // 165
  // if true, the next data update should reset all stores. (set during                                       // 166
  // reconnect.)                                                                                              // 167
  self._resetStores = false;                                                                                  // 168
                                                                                                              // 169
  // name -> array of updates for (yet to be created) collections                                             // 170
  self._updatesForUnknownStores = {};                                                                         // 171
  // if we're blocking a migration, the retry func                                                            // 172
  self._retryMigrate = null;                                                                                  // 173
                                                                                                              // 174
  // metadata for subscriptions.  Map from sub ID to object with keys:                                        // 175
  //   - id                                                                                                   // 176
  //   - name                                                                                                 // 177
  //   - params                                                                                               // 178
  //   - inactive (if true, will be cleaned up if not reused in re-run)                                       // 179
  //   - ready (has the 'ready' message been received?)                                                       // 180
  //   - readyCallback (an optional callback to call when ready)                                              // 181
  //   - errorCallback (an optional callback to call if the sub terminates with                               // 182
  //                    an error, XXX COMPAT WITH 1.0.3.1)                                                    // 183
  //   - stopCallback (an optional callback to call when the sub terminates                                   // 184
  //     for any reason, with an error argument if an error triggered the stop)                               // 185
  self._subscriptions = {};                                                                                   // 186
                                                                                                              // 187
  // Reactive userId.                                                                                         // 188
  self._userId = null;                                                                                        // 189
  self._userIdDeps = new Tracker.Dependency;                                                                  // 190
                                                                                                              // 191
  // Block auto-reload while we're waiting for method responses.                                              // 192
  if (Meteor.isClient && Package.reload && !options.reloadWithOutstanding) {                                  // 193
    Package.reload.Reload._onMigrate(function (retry) {                                                       // 194
      if (!self._readyToMigrate()) {                                                                          // 195
        if (self._retryMigrate)                                                                               // 196
          throw new Error("Two migrations in progress?");                                                     // 197
        self._retryMigrate = retry;                                                                           // 198
        return false;                                                                                         // 199
      } else {                                                                                                // 200
        return [true];                                                                                        // 201
      }                                                                                                       // 202
    });                                                                                                       // 203
  }                                                                                                           // 204
                                                                                                              // 205
  var onMessage = function (raw_msg) {                                                                        // 206
    try {                                                                                                     // 207
      var msg = DDPCommon.parseDDP(raw_msg);                                                                  // 208
    } catch (e) {                                                                                             // 209
      Meteor._debug("Exception while parsing DDP", e);                                                        // 210
      return;                                                                                                 // 211
    }                                                                                                         // 212
                                                                                                              // 213
    // Any message counts as receiving a pong, as it demonstrates that                                        // 214
    // the server is still alive.                                                                             // 215
    if (self._heartbeat) {                                                                                    // 216
      self._heartbeat.messageReceived();                                                                      // 217
    }                                                                                                         // 218
                                                                                                              // 219
    if (msg === null || !msg.msg) {                                                                           // 220
      // XXX COMPAT WITH 0.6.6. ignore the old welcome message for back                                       // 221
      // compat.  Remove this 'if' once the server stops sending welcome                                      // 222
      // messages (stream_server.js).                                                                         // 223
      if (! (msg && msg.server_id))                                                                           // 224
        Meteor._debug("discarding invalid livedata message", msg);                                            // 225
      return;                                                                                                 // 226
    }                                                                                                         // 227
                                                                                                              // 228
    if (msg.msg === 'connected') {                                                                            // 229
      self._version = self._versionSuggestion;                                                                // 230
      self._livedata_connected(msg);                                                                          // 231
      options.onConnected();                                                                                  // 232
    }                                                                                                         // 233
    else if (msg.msg === 'failed') {                                                                          // 234
      if (_.contains(self._supportedDDPVersions, msg.version)) {                                              // 235
        self._versionSuggestion = msg.version;                                                                // 236
        self._stream.reconnect({_force: true});                                                               // 237
      } else {                                                                                                // 238
        var description =                                                                                     // 239
              "DDP version negotiation failed; server requested version " + msg.version;                      // 240
        self._stream.disconnect({_permanent: true, _error: description});                                     // 241
        options.onDDPVersionNegotiationFailure(description);                                                  // 242
      }                                                                                                       // 243
    }                                                                                                         // 244
    else if (msg.msg === 'ping' && options.respondToPings) {                                                  // 245
      self._send({msg: "pong", id: msg.id});                                                                  // 246
    }                                                                                                         // 247
    else if (msg.msg === 'pong') {                                                                            // 248
      // noop, as we assume everything's a pong                                                               // 249
    }                                                                                                         // 250
    else if (_.include(['added', 'changed', 'removed', 'ready', 'updated'], msg.msg))                         // 251
      self._livedata_data(msg);                                                                               // 252
    else if (msg.msg === 'nosub')                                                                             // 253
      self._livedata_nosub(msg);                                                                              // 254
    else if (msg.msg === 'result')                                                                            // 255
      self._livedata_result(msg);                                                                             // 256
    else if (msg.msg === 'error')                                                                             // 257
      self._livedata_error(msg);                                                                              // 258
    else                                                                                                      // 259
      Meteor._debug("discarding unknown livedata message type", msg);                                         // 260
  };                                                                                                          // 261
                                                                                                              // 262
  var onReset = function () {                                                                                 // 263
    // Send a connect message at the beginning of the stream.                                                 // 264
    // NOTE: reset is called even on the first connection, so this is                                         // 265
    // the only place we send this message.                                                                   // 266
    var msg = {msg: 'connect'};                                                                               // 267
    if (self._lastSessionId)                                                                                  // 268
      msg.session = self._lastSessionId;                                                                      // 269
    msg.version = self._versionSuggestion || self._supportedDDPVersions[0];                                   // 270
    self._versionSuggestion = msg.version;                                                                    // 271
    msg.support = self._supportedDDPVersions;                                                                 // 272
    self._send(msg);                                                                                          // 273
                                                                                                              // 274
    // Now, to minimize setup latency, go ahead and blast out all of                                          // 275
    // our pending methods ands subscriptions before we've even taken                                         // 276
    // the necessary RTT to know if we successfully reconnected. (1)                                          // 277
    // They're supposed to be idempotent; (2) even if we did                                                  // 278
    // reconnect, we're not sure what messages might have gotten lost                                         // 279
    // (in either direction) since we were disconnected (TCP being                                            // 280
    // sloppy about that.)                                                                                    // 281
                                                                                                              // 282
    // If the current block of methods all got their results (but didn't all get                              // 283
    // their data visible), discard the empty block now.                                                      // 284
    if (! _.isEmpty(self._outstandingMethodBlocks) &&                                                         // 285
        _.isEmpty(self._outstandingMethodBlocks[0].methods)) {                                                // 286
      self._outstandingMethodBlocks.shift();                                                                  // 287
    }                                                                                                         // 288
                                                                                                              // 289
    // Mark all messages as unsent, they have not yet been sent on this                                       // 290
    // connection.                                                                                            // 291
    _.each(self._methodInvokers, function (m) {                                                               // 292
      m.sentMessage = false;                                                                                  // 293
    });                                                                                                       // 294
                                                                                                              // 295
    // If an `onReconnect` handler is set, call it first. Go through                                          // 296
    // some hoops to ensure that methods that are called from within                                          // 297
    // `onReconnect` get executed _before_ ones that were originally                                          // 298
    // outstanding (since `onReconnect` is used to re-establish auth                                          // 299
    // certificates)                                                                                          // 300
    if (self.onReconnect)                                                                                     // 301
      self._callOnReconnectAndSendAppropriateOutstandingMethods();                                            // 302
    else                                                                                                      // 303
      self._sendOutstandingMethods();                                                                         // 304
                                                                                                              // 305
    // add new subscriptions at the end. this way they take effect after                                      // 306
    // the handlers and we don't see flicker.                                                                 // 307
    _.each(self._subscriptions, function (sub, id) {                                                          // 308
      self._send({                                                                                            // 309
        msg: 'sub',                                                                                           // 310
        id: id,                                                                                               // 311
        name: sub.name,                                                                                       // 312
        params: sub.params                                                                                    // 313
      });                                                                                                     // 314
    });                                                                                                       // 315
  };                                                                                                          // 316
                                                                                                              // 317
  var onDisconnect = function () {                                                                            // 318
    if (self._heartbeat) {                                                                                    // 319
      self._heartbeat.stop();                                                                                 // 320
      self._heartbeat = null;                                                                                 // 321
    }                                                                                                         // 322
  };                                                                                                          // 323
                                                                                                              // 324
  if (Meteor.isServer) {                                                                                      // 325
    self._stream.on('message', Meteor.bindEnvironment(onMessage, "handling DDP message"));                    // 326
    self._stream.on('reset', Meteor.bindEnvironment(onReset, "handling DDP reset"));                          // 327
    self._stream.on('disconnect', Meteor.bindEnvironment(onDisconnect, "handling DDP disconnect"));           // 328
  } else {                                                                                                    // 329
    self._stream.on('message', onMessage);                                                                    // 330
    self._stream.on('reset', onReset);                                                                        // 331
    self._stream.on('disconnect', onDisconnect);                                                              // 332
  }                                                                                                           // 333
};                                                                                                            // 334
                                                                                                              // 335
// A MethodInvoker manages sending a method to the server and calling the user's                              // 336
// callbacks. On construction, it registers itself in the connection's                                        // 337
// _methodInvokers map; it removes itself once the method is fully finished and                               // 338
// the callback is invoked. This occurs when it has both received a result,                                   // 339
// and the data written by it is fully visible.                                                               // 340
var MethodInvoker = function (options) {                                                                      // 341
  var self = this;                                                                                            // 342
                                                                                                              // 343
  // Public (within this file) fields.                                                                        // 344
  self.methodId = options.methodId;                                                                           // 345
  self.sentMessage = false;                                                                                   // 346
                                                                                                              // 347
  self._callback = options.callback;                                                                          // 348
  self._connection = options.connection;                                                                      // 349
  self._message = options.message;                                                                            // 350
  self._onResultReceived = options.onResultReceived || function () {};                                        // 351
  self._wait = options.wait;                                                                                  // 352
  self._methodResult = null;                                                                                  // 353
  self._dataVisible = false;                                                                                  // 354
                                                                                                              // 355
  // Register with the connection.                                                                            // 356
  self._connection._methodInvokers[self.methodId] = self;                                                     // 357
};                                                                                                            // 358
_.extend(MethodInvoker.prototype, {                                                                           // 359
  // Sends the method message to the server. May be called additional times if                                // 360
  // we lose the connection and reconnect before receiving a result.                                          // 361
  sendMessage: function () {                                                                                  // 362
    var self = this;                                                                                          // 363
    // This function is called before sending a method (including resending on                                // 364
    // reconnect). We should only (re)send methods where we don't already have a                              // 365
    // result!                                                                                                // 366
    if (self.gotResult())                                                                                     // 367
      throw new Error("sendingMethod is called on method with result");                                       // 368
                                                                                                              // 369
    // If we're re-sending it, it doesn't matter if data was written the first                                // 370
    // time.                                                                                                  // 371
    self._dataVisible = false;                                                                                // 372
                                                                                                              // 373
    self.sentMessage = true;                                                                                  // 374
                                                                                                              // 375
    // If this is a wait method, make all data messages be buffered until it is                               // 376
    // done.                                                                                                  // 377
    if (self._wait)                                                                                           // 378
      self._connection._methodsBlockingQuiescence[self.methodId] = true;                                      // 379
                                                                                                              // 380
    // Actually send the message.                                                                             // 381
    self._connection._send(self._message);                                                                    // 382
  },                                                                                                          // 383
  // Invoke the callback, if we have both a result and know that all data has                                 // 384
  // been written to the local cache.                                                                         // 385
  _maybeInvokeCallback: function () {                                                                         // 386
    var self = this;                                                                                          // 387
    if (self._methodResult && self._dataVisible) {                                                            // 388
      // Call the callback. (This won't throw: the callback was wrapped with                                  // 389
      // bindEnvironment.)                                                                                    // 390
      self._callback(self._methodResult[0], self._methodResult[1]);                                           // 391
                                                                                                              // 392
      // Forget about this method.                                                                            // 393
      delete self._connection._methodInvokers[self.methodId];                                                 // 394
                                                                                                              // 395
      // Let the connection know that this method is finished, so it can try to                               // 396
      // move on to the next block of methods.                                                                // 397
      self._connection._outstandingMethodFinished();                                                          // 398
    }                                                                                                         // 399
  },                                                                                                          // 400
  // Call with the result of the method from the server. Only may be called                                   // 401
  // once; once it is called, you should not call sendMessage again.                                          // 402
  // If the user provided an onResultReceived callback, call it immediately.                                  // 403
  // Then invoke the main callback if data is also visible.                                                   // 404
  receiveResult: function (err, result) {                                                                     // 405
    var self = this;                                                                                          // 406
    if (self.gotResult())                                                                                     // 407
      throw new Error("Methods should only receive results once");                                            // 408
    self._methodResult = [err, result];                                                                       // 409
    self._onResultReceived(err, result);                                                                      // 410
    self._maybeInvokeCallback();                                                                              // 411
  },                                                                                                          // 412
  // Call this when all data written by the method is visible. This means that                                // 413
  // the method has returns its "data is done" message *AND* all server                                       // 414
  // documents that are buffered at that time have been written to the local                                  // 415
  // cache. Invokes the main callback if the result has been received.                                        // 416
  dataVisible: function () {                                                                                  // 417
    var self = this;                                                                                          // 418
    self._dataVisible = true;                                                                                 // 419
    self._maybeInvokeCallback();                                                                              // 420
  },                                                                                                          // 421
  // True if receiveResult has been called.                                                                   // 422
  gotResult: function () {                                                                                    // 423
    var self = this;                                                                                          // 424
    return !!self._methodResult;                                                                              // 425
  }                                                                                                           // 426
});                                                                                                           // 427
                                                                                                              // 428
_.extend(Connection.prototype, {                                                                              // 429
  // 'name' is the name of the data on the wire that should go in the                                         // 430
  // store. 'wrappedStore' should be an object with methods beginUpdate, update,                              // 431
  // endUpdate, saveOriginals, retrieveOriginals. see Collection for an example.                              // 432
  registerStore: function (name, wrappedStore) {                                                              // 433
    var self = this;                                                                                          // 434
                                                                                                              // 435
    if (name in self._stores)                                                                                 // 436
      return false;                                                                                           // 437
                                                                                                              // 438
    // Wrap the input object in an object which makes any store method not                                    // 439
    // implemented by 'store' into a no-op.                                                                   // 440
    var store = {};                                                                                           // 441
    _.each(['update', 'beginUpdate', 'endUpdate', 'saveOriginals',                                            // 442
            'retrieveOriginals', 'getDoc'], function (method) {                                               // 443
              store[method] = function () {                                                                   // 444
                return (wrappedStore[method]                                                                  // 445
                        ? wrappedStore[method].apply(wrappedStore, arguments)                                 // 446
                        : undefined);                                                                         // 447
              };                                                                                              // 448
            });                                                                                               // 449
                                                                                                              // 450
    self._stores[name] = store;                                                                               // 451
                                                                                                              // 452
    var queued = self._updatesForUnknownStores[name];                                                         // 453
    if (queued) {                                                                                             // 454
      store.beginUpdate(queued.length, false);                                                                // 455
      _.each(queued, function (msg) {                                                                         // 456
        store.update(msg);                                                                                    // 457
      });                                                                                                     // 458
      store.endUpdate();                                                                                      // 459
      delete self._updatesForUnknownStores[name];                                                             // 460
    }                                                                                                         // 461
                                                                                                              // 462
    return true;                                                                                              // 463
  },                                                                                                          // 464
                                                                                                              // 465
  /**                                                                                                         // 466
   * @memberOf Meteor                                                                                         // 467
   * @summary Subscribe to a record set.  Returns a handle that provides                                      // 468
   * `stop()` and `ready()` methods.                                                                          // 469
   * @locus Client                                                                                            // 470
   * @param {String} name Name of the subscription.  Matches the name of the                                  // 471
   * server's `publish()` call.                                                                               // 472
   * @param {Any} [arg1,arg2...] Optional arguments passed to publisher                                       // 473
   * function on server.                                                                                      // 474
   * @param {Function|Object} [callbacks] Optional. May include `onStop`                                      // 475
   * and `onReady` callbacks. If there is an error, it is passed as an                                        // 476
   * argument to `onStop`. If a function is passed instead of an object, it                                   // 477
   * is interpreted as an `onReady` callback.                                                                 // 478
   */                                                                                                         // 479
  subscribe: function (name /* .. [arguments] .. (callback|callbacks) */) {                                   // 480
    var self = this;                                                                                          // 481
                                                                                                              // 482
    var params = Array.prototype.slice.call(arguments, 1);                                                    // 483
    var callbacks = {};                                                                                       // 484
    if (params.length) {                                                                                      // 485
      var lastParam = params[params.length - 1];                                                              // 486
      if (_.isFunction(lastParam)) {                                                                          // 487
        callbacks.onReady = params.pop();                                                                     // 488
      } else if (lastParam &&                                                                                 // 489
        // XXX COMPAT WITH 1.0.3.1 onError used to exist, but now we use                                      // 490
        // onStop with an error callback instead.                                                             // 491
        _.any([lastParam.onReady, lastParam.onError, lastParam.onStop],                                       // 492
          _.isFunction)) {                                                                                    // 493
        callbacks = params.pop();                                                                             // 494
      }                                                                                                       // 495
    }                                                                                                         // 496
                                                                                                              // 497
    // Is there an existing sub with the same name and param, run in an                                       // 498
    // invalidated Computation? This will happen if we are rerunning an                                       // 499
    // existing computation.                                                                                  // 500
    //                                                                                                        // 501
    // For example, consider a rerun of:                                                                      // 502
    //                                                                                                        // 503
    //     Tracker.autorun(function () {                                                                      // 504
    //       Meteor.subscribe("foo", Session.get("foo"));                                                     // 505
    //       Meteor.subscribe("bar", Session.get("bar"));                                                     // 506
    //     });                                                                                                // 507
    //                                                                                                        // 508
    // If "foo" has changed but "bar" has not, we will match the "bar"                                        // 509
    // subcribe to an existing inactive subscription in order to not                                          // 510
    // unsub and resub the subscription unnecessarily.                                                        // 511
    //                                                                                                        // 512
    // We only look for one such sub; if there are N apparently-identical subs                                // 513
    // being invalidated, we will require N matching subscribe calls to keep                                  // 514
    // them all active.                                                                                       // 515
    var existing = _.find(self._subscriptions, function (sub) {                                               // 516
      return sub.inactive && sub.name === name &&                                                             // 517
        EJSON.equals(sub.params, params);                                                                     // 518
    });                                                                                                       // 519
                                                                                                              // 520
    var id;                                                                                                   // 521
    if (existing) {                                                                                           // 522
      id = existing.id;                                                                                       // 523
      existing.inactive = false; // reactivate                                                                // 524
                                                                                                              // 525
      if (callbacks.onReady) {                                                                                // 526
        // If the sub is not already ready, replace any ready callback with the                               // 527
        // one provided now. (It's not really clear what users would expect for                               // 528
        // an onReady callback inside an autorun; the semantics we provide is                                 // 529
        // that at the time the sub first becomes ready, we call the last                                     // 530
        // onReady callback provided, if any.)                                                                // 531
        if (!existing.ready)                                                                                  // 532
          existing.readyCallback = callbacks.onReady;                                                         // 533
      }                                                                                                       // 534
                                                                                                              // 535
      // XXX COMPAT WITH 1.0.3.1 we used to have onError but now we call                                      // 536
      // onStop with an optional error argument                                                               // 537
      if (callbacks.onError) {                                                                                // 538
        // Replace existing callback if any, so that errors aren't                                            // 539
        // double-reported.                                                                                   // 540
        existing.errorCallback = callbacks.onError;                                                           // 541
      }                                                                                                       // 542
                                                                                                              // 543
      if (callbacks.onStop) {                                                                                 // 544
        existing.stopCallback = callbacks.onStop;                                                             // 545
      }                                                                                                       // 546
    } else {                                                                                                  // 547
      // New sub! Generate an id, save it locally, and send message.                                          // 548
      id = Random.id();                                                                                       // 549
      self._subscriptions[id] = {                                                                             // 550
        id: id,                                                                                               // 551
        name: name,                                                                                           // 552
        params: EJSON.clone(params),                                                                          // 553
        inactive: false,                                                                                      // 554
        ready: false,                                                                                         // 555
        readyDeps: new Tracker.Dependency,                                                                    // 556
        readyCallback: callbacks.onReady,                                                                     // 557
        // XXX COMPAT WITH 1.0.3.1 #errorCallback                                                             // 558
        errorCallback: callbacks.onError,                                                                     // 559
        stopCallback: callbacks.onStop,                                                                       // 560
        connection: self,                                                                                     // 561
        remove: function() {                                                                                  // 562
          delete this.connection._subscriptions[this.id];                                                     // 563
          this.ready && this.readyDeps.changed();                                                             // 564
        },                                                                                                    // 565
        stop: function() {                                                                                    // 566
          this.connection._send({msg: 'unsub', id: id});                                                      // 567
          this.remove();                                                                                      // 568
                                                                                                              // 569
          if (callbacks.onStop) {                                                                             // 570
            callbacks.onStop();                                                                               // 571
          }                                                                                                   // 572
        }                                                                                                     // 573
      };                                                                                                      // 574
      self._send({msg: 'sub', id: id, name: name, params: params});                                           // 575
    }                                                                                                         // 576
                                                                                                              // 577
    // return a handle to the application.                                                                    // 578
    var handle = {                                                                                            // 579
      stop: function () {                                                                                     // 580
        if (!_.has(self._subscriptions, id))                                                                  // 581
          return;                                                                                             // 582
                                                                                                              // 583
        self._subscriptions[id].stop();                                                                       // 584
      },                                                                                                      // 585
      ready: function () {                                                                                    // 586
        // return false if we've unsubscribed.                                                                // 587
        if (!_.has(self._subscriptions, id))                                                                  // 588
          return false;                                                                                       // 589
        var record = self._subscriptions[id];                                                                 // 590
        record.readyDeps.depend();                                                                            // 591
        return record.ready;                                                                                  // 592
      },                                                                                                      // 593
      subscriptionId: id                                                                                      // 594
    };                                                                                                        // 595
                                                                                                              // 596
    if (Tracker.active) {                                                                                     // 597
      // We're in a reactive computation, so we'd like to unsubscribe when the                                // 598
      // computation is invalidated... but not if the rerun just re-subscribes                                // 599
      // to the same subscription!  When a rerun happens, we use onInvalidate                                 // 600
      // as a change to mark the subscription "inactive" so that it can                                       // 601
      // be reused from the rerun.  If it isn't reused, it's killed from                                      // 602
      // an afterFlush.                                                                                       // 603
      Tracker.onInvalidate(function (c) {                                                                     // 604
        if (_.has(self._subscriptions, id))                                                                   // 605
          self._subscriptions[id].inactive = true;                                                            // 606
                                                                                                              // 607
        Tracker.afterFlush(function () {                                                                      // 608
          if (_.has(self._subscriptions, id) &&                                                               // 609
              self._subscriptions[id].inactive)                                                               // 610
            handle.stop();                                                                                    // 611
        });                                                                                                   // 612
      });                                                                                                     // 613
    }                                                                                                         // 614
                                                                                                              // 615
    return handle;                                                                                            // 616
  },                                                                                                          // 617
                                                                                                              // 618
  // options:                                                                                                 // 619
  // - onLateError {Function(error)} called if an error was received after the ready event.                   // 620
  //     (errors received before ready cause an error to be thrown)                                           // 621
  _subscribeAndWait: function (name, args, options) {                                                         // 622
    var self = this;                                                                                          // 623
    var f = new Future();                                                                                     // 624
    var ready = false;                                                                                        // 625
    var handle;                                                                                               // 626
    args = args || [];                                                                                        // 627
    args.push({                                                                                               // 628
      onReady: function () {                                                                                  // 629
        ready = true;                                                                                         // 630
        f['return']();                                                                                        // 631
      },                                                                                                      // 632
      onError: function (e) {                                                                                 // 633
        if (!ready)                                                                                           // 634
          f['throw'](e);                                                                                      // 635
        else                                                                                                  // 636
          options && options.onLateError && options.onLateError(e);                                           // 637
      }                                                                                                       // 638
    });                                                                                                       // 639
                                                                                                              // 640
    handle = self.subscribe.apply(self, [name].concat(args));                                                 // 641
    f.wait();                                                                                                 // 642
    return handle;                                                                                            // 643
  },                                                                                                          // 644
                                                                                                              // 645
  methods: function (methods) {                                                                               // 646
    var self = this;                                                                                          // 647
    _.each(methods, function (func, name) {                                                                   // 648
      if (typeof func !== 'function')                                                                         // 649
        throw new Error("Method '" + name + "' must be a function");                                          // 650
      if (self._methodHandlers[name])                                                                         // 651
        throw new Error("A method named '" + name + "' is already defined");                                  // 652
      self._methodHandlers[name] = func;                                                                      // 653
    });                                                                                                       // 654
  },                                                                                                          // 655
                                                                                                              // 656
  /**                                                                                                         // 657
   * @memberOf Meteor                                                                                         // 658
   * @summary Invokes a method passing any number of arguments.                                               // 659
   * @locus Anywhere                                                                                          // 660
   * @param {String} name Name of method to invoke                                                            // 661
   * @param {EJSONable} [arg1,arg2...] Optional method arguments                                              // 662
   * @param {Function} [asyncCallback] Optional callback, which is called asynchronously with the error or result after the method is complete. If not provided, the method runs synchronously if possible (see below).
   */                                                                                                         // 664
  call: function (name /* .. [arguments] .. callback */) {                                                    // 665
    // if it's a function, the last argument is the result callback,                                          // 666
    // not a parameter to the remote method.                                                                  // 667
    var args = Array.prototype.slice.call(arguments, 1);                                                      // 668
    if (args.length && typeof args[args.length - 1] === "function")                                           // 669
      var callback = args.pop();                                                                              // 670
    return this.apply(name, args, callback);                                                                  // 671
  },                                                                                                          // 672
                                                                                                              // 673
  // @param options {Optional Object}                                                                         // 674
  //   wait: Boolean - Should we wait to call this until all current methods                                  // 675
  //                   are fully finished, and block subsequent method calls                                  // 676
  //                   until this method is fully finished?                                                   // 677
  //                   (does not affect methods called from within this method)                               // 678
  //   onResultReceived: Function - a callback to call as soon as the method                                  // 679
  //                                result is received. the data written by                                   // 680
  //                                the method may not yet be in the cache!                                   // 681
  //   returnStubValue: Boolean - If true then in cases where we would have                                   // 682
  //                              otherwise discarded the stub's return value                                 // 683
  //                              and returned undefined, instead we go ahead                                 // 684
  //                              and return it.  Specifically, this is any                                   // 685
  //                              time other than when (a) we are already                                     // 686
  //                              inside a stub or (b) we are in Node and no                                  // 687
  //                              callback was provided.  Currently we require                                // 688
  //                              this flag to be explicitly passed to reduce                                 // 689
  //                              the likelihood that stub return values will                                 // 690
  //                              be confused with server return values; we                                   // 691
  //                              may improve this in future.                                                 // 692
  // @param callback {Optional Function}                                                                      // 693
                                                                                                              // 694
  /**                                                                                                         // 695
   * @memberOf Meteor                                                                                         // 696
   * @summary Invoke a method passing an array of arguments.                                                  // 697
   * @locus Anywhere                                                                                          // 698
   * @param {String} name Name of method to invoke                                                            // 699
   * @param {EJSONable[]} args Method arguments                                                               // 700
   * @param {Object} [options]                                                                                // 701
   * @param {Boolean} options.wait (Client only) If true, don't send this method until all previous method calls have completed, and don't send any subsequent method calls until this one is completed.
   * @param {Function} options.onResultReceived (Client only) This callback is invoked with the error or result of the method (just like `asyncCallback`) as soon as the error or result is available. The local cache may not yet reflect the writes performed by the method.
   * @param {Function} [asyncCallback] Optional callback; same semantics as in [`Meteor.call`](#meteor_call).
   */                                                                                                         // 705
  apply: function (name, args, options, callback) {                                                           // 706
    var self = this;                                                                                          // 707
                                                                                                              // 708
    // We were passed 3 arguments. They may be either (name, args, options)                                   // 709
    // or (name, args, callback)                                                                              // 710
    if (!callback && typeof options === 'function') {                                                         // 711
      callback = options;                                                                                     // 712
      options = {};                                                                                           // 713
    }                                                                                                         // 714
    options = options || {};                                                                                  // 715
                                                                                                              // 716
    if (callback) {                                                                                           // 717
      // XXX would it be better form to do the binding in stream.on,                                          // 718
      // or caller, instead of here?                                                                          // 719
      // XXX improve error message (and how we report it)                                                     // 720
      callback = Meteor.bindEnvironment(                                                                      // 721
        callback,                                                                                             // 722
        "delivering result of invoking '" + name + "'"                                                        // 723
      );                                                                                                      // 724
    }                                                                                                         // 725
                                                                                                              // 726
    // Keep our args safe from mutation (eg if we don't send the message for a                                // 727
    // while because of a wait method).                                                                       // 728
    args = EJSON.clone(args);                                                                                 // 729
                                                                                                              // 730
    // Lazily allocate method ID once we know that it'll be needed.                                           // 731
    var methodId = (function () {                                                                             // 732
      var id;                                                                                                 // 733
      return function () {                                                                                    // 734
        if (id === undefined)                                                                                 // 735
          id = '' + (self._nextMethodId++);                                                                   // 736
        return id;                                                                                            // 737
      };                                                                                                      // 738
    })();                                                                                                     // 739
                                                                                                              // 740
    var enclosing = DDP._CurrentInvocation.get();                                                             // 741
    var alreadyInSimulation = enclosing && enclosing.isSimulation;                                            // 742
                                                                                                              // 743
    // Lazily generate a randomSeed, only if it is requested by the stub.                                     // 744
    // The random streams only have utility if they're used on both the client                                // 745
    // and the server; if the client doesn't generate any 'random' values                                     // 746
    // then we don't expect the server to generate any either.                                                // 747
    // Less commonly, the server may perform different actions from the client,                               // 748
    // and may in fact generate values where the client did not, but we don't                                 // 749
    // have any client-side values to match, so even here we may as well just                                 // 750
    // use a random seed on the server.  In that case, we don't pass the                                      // 751
    // randomSeed to save bandwidth, and we don't even generate it to save a                                  // 752
    // bit of CPU and to avoid consuming entropy.                                                             // 753
    var randomSeed = null;                                                                                    // 754
    var randomSeedGenerator = function () {                                                                   // 755
      if (randomSeed === null) {                                                                              // 756
        randomSeed = DDPCommon.makeRpcSeed(enclosing, name);                                                  // 757
      }                                                                                                       // 758
      return randomSeed;                                                                                      // 759
    };                                                                                                        // 760
                                                                                                              // 761
    // Run the stub, if we have one. The stub is supposed to make some                                        // 762
    // temporary writes to the database to give the user a smooth experience                                  // 763
    // until the actual result of executing the method comes back from the                                    // 764
    // server (whereupon the temporary writes to the database will be reversed                                // 765
    // during the beginUpdate/endUpdate process.)                                                             // 766
    //                                                                                                        // 767
    // Normally, we ignore the return value of the stub (even if it is an                                     // 768
    // exception), in favor of the real return value from the server. The                                     // 769
    // exception is if the *caller* is a stub. In that case, we're not going                                  // 770
    // to do a RPC, so we use the return value of the stub as our return                                      // 771
    // value.                                                                                                 // 772
                                                                                                              // 773
    var stub = self._methodHandlers[name];                                                                    // 774
    if (stub) {                                                                                               // 775
      var setUserId = function(userId) {                                                                      // 776
        self.setUserId(userId);                                                                               // 777
      };                                                                                                      // 778
                                                                                                              // 779
      var invocation = new DDPCommon.MethodInvocation({                                                       // 780
        isSimulation: true,                                                                                   // 781
        userId: self.userId(),                                                                                // 782
        setUserId: setUserId,                                                                                 // 783
        randomSeed: function () { return randomSeedGenerator(); }                                             // 784
      });                                                                                                     // 785
                                                                                                              // 786
      if (!alreadyInSimulation)                                                                               // 787
        self._saveOriginals();                                                                                // 788
                                                                                                              // 789
      try {                                                                                                   // 790
        // Note that unlike in the corresponding server code, we never audit                                  // 791
        // that stubs check() their arguments.                                                                // 792
        var stubReturnValue = DDP._CurrentInvocation.withValue(invocation, function () {                      // 793
          if (Meteor.isServer) {                                                                              // 794
            // Because saveOriginals and retrieveOriginals aren't reentrant,                                  // 795
            // don't allow stubs to yield.                                                                    // 796
            return Meteor._noYieldsAllowed(function () {                                                      // 797
              // re-clone, so that the stub can't affect our caller's values                                  // 798
              return stub.apply(invocation, EJSON.clone(args));                                               // 799
            });                                                                                               // 800
          } else {                                                                                            // 801
            return stub.apply(invocation, EJSON.clone(args));                                                 // 802
          }                                                                                                   // 803
        });                                                                                                   // 804
      }                                                                                                       // 805
      catch (e) {                                                                                             // 806
        var exception = e;                                                                                    // 807
      }                                                                                                       // 808
                                                                                                              // 809
      if (!alreadyInSimulation)                                                                               // 810
        self._retrieveAndStoreOriginals(methodId());                                                          // 811
    }                                                                                                         // 812
                                                                                                              // 813
    // If we're in a simulation, stop and return the result we have,                                          // 814
    // rather than going on to do an RPC. If there was no stub,                                               // 815
    // we'll end up returning undefined.                                                                      // 816
    if (alreadyInSimulation) {                                                                                // 817
      if (callback) {                                                                                         // 818
        callback(exception, stubReturnValue);                                                                 // 819
        return undefined;                                                                                     // 820
      }                                                                                                       // 821
      if (exception)                                                                                          // 822
        throw exception;                                                                                      // 823
      return stubReturnValue;                                                                                 // 824
    }                                                                                                         // 825
                                                                                                              // 826
    // If an exception occurred in a stub, and we're ignoring it                                              // 827
    // because we're doing an RPC and want to use what the server                                             // 828
    // returns instead, log it so the developer knows                                                         // 829
    // (unless they explicitly ask to see the error).                                                         // 830
    //                                                                                                        // 831
    // Tests can set the 'expected' flag on an exception so it won't                                          // 832
    // go to log.                                                                                             // 833
    if (exception) {                                                                                          // 834
      if (options.throwStubExceptions) {                                                                      // 835
        throw exception;                                                                                      // 836
      } else if (!exception.expected) {                                                                       // 837
        Meteor._debug("Exception while simulating the effect of invoking '" +                                 // 838
          name + "'", exception, exception.stack);                                                            // 839
      }                                                                                                       // 840
    }                                                                                                         // 841
                                                                                                              // 842
                                                                                                              // 843
    // At this point we're definitely doing an RPC, and we're going to                                        // 844
    // return the value of the RPC to the caller.                                                             // 845
                                                                                                              // 846
    // If the caller didn't give a callback, decide what to do.                                               // 847
    if (!callback) {                                                                                          // 848
      if (Meteor.isClient) {                                                                                  // 849
        // On the client, we don't have fibers, so we can't block. The                                        // 850
        // only thing we can do is to return undefined and discard the                                        // 851
        // result of the RPC. If an error occurred then print the error                                       // 852
        // to the console.                                                                                    // 853
        callback = function (err) {                                                                           // 854
          err && Meteor._debug("Error invoking Method '" + name + "':",                                       // 855
                               err.message);                                                                  // 856
        };                                                                                                    // 857
      } else {                                                                                                // 858
        // On the server, make the function synchronous. Throw on                                             // 859
        // errors, return on success.                                                                         // 860
        var future = new Future;                                                                              // 861
        callback = future.resolver();                                                                         // 862
      }                                                                                                       // 863
    }                                                                                                         // 864
    // Send the RPC. Note that on the client, it is important that the                                        // 865
    // stub have finished before we send the RPC, so that we know we have                                     // 866
    // a complete list of which local documents the stub wrote.                                               // 867
    var message = {                                                                                           // 868
      msg: 'method',                                                                                          // 869
      method: name,                                                                                           // 870
      params: args,                                                                                           // 871
      id: methodId()                                                                                          // 872
    };                                                                                                        // 873
                                                                                                              // 874
    // Send the randomSeed only if we used it                                                                 // 875
    if (randomSeed !== null) {                                                                                // 876
      message.randomSeed = randomSeed;                                                                        // 877
    }                                                                                                         // 878
                                                                                                              // 879
    var methodInvoker = new MethodInvoker({                                                                   // 880
      methodId: methodId(),                                                                                   // 881
      callback: callback,                                                                                     // 882
      connection: self,                                                                                       // 883
      onResultReceived: options.onResultReceived,                                                             // 884
      wait: !!options.wait,                                                                                   // 885
      message: message                                                                                        // 886
    });                                                                                                       // 887
                                                                                                              // 888
    if (options.wait) {                                                                                       // 889
      // It's a wait method! Wait methods go in their own block.                                              // 890
      self._outstandingMethodBlocks.push(                                                                     // 891
        {wait: true, methods: [methodInvoker]});                                                              // 892
    } else {                                                                                                  // 893
      // Not a wait method. Start a new block if the previous block was a wait                                // 894
      // block, and add it to the last block of methods.                                                      // 895
      if (_.isEmpty(self._outstandingMethodBlocks) ||                                                         // 896
          _.last(self._outstandingMethodBlocks).wait)                                                         // 897
        self._outstandingMethodBlocks.push({wait: false, methods: []});                                       // 898
      _.last(self._outstandingMethodBlocks).methods.push(methodInvoker);                                      // 899
    }                                                                                                         // 900
                                                                                                              // 901
    // If we added it to the first block, send it out now.                                                    // 902
    if (self._outstandingMethodBlocks.length === 1)                                                           // 903
      methodInvoker.sendMessage();                                                                            // 904
                                                                                                              // 905
    // If we're using the default callback on the server,                                                     // 906
    // block waiting for the result.                                                                          // 907
    if (future) {                                                                                             // 908
      return future.wait();                                                                                   // 909
    }                                                                                                         // 910
    return options.returnStubValue ? stubReturnValue : undefined;                                             // 911
  },                                                                                                          // 912
                                                                                                              // 913
  // Before calling a method stub, prepare all stores to track changes and allow                              // 914
  // _retrieveAndStoreOriginals to get the original versions of changed                                       // 915
  // documents.                                                                                               // 916
  _saveOriginals: function () {                                                                               // 917
    var self = this;                                                                                          // 918
    _.each(self._stores, function (s) {                                                                       // 919
      s.saveOriginals();                                                                                      // 920
    });                                                                                                       // 921
  },                                                                                                          // 922
  // Retrieves the original versions of all documents modified by the stub for                                // 923
  // method 'methodId' from all stores and saves them to _serverDocuments (keyed                              // 924
  // by document) and _documentsWrittenByStub (keyed by method ID).                                           // 925
  _retrieveAndStoreOriginals: function (methodId) {                                                           // 926
    var self = this;                                                                                          // 927
    if (self._documentsWrittenByStub[methodId])                                                               // 928
      throw new Error("Duplicate methodId in _retrieveAndStoreOriginals");                                    // 929
                                                                                                              // 930
    var docsWritten = [];                                                                                     // 931
    _.each(self._stores, function (s, collection) {                                                           // 932
      var originals = s.retrieveOriginals();                                                                  // 933
      // not all stores define retrieveOriginals                                                              // 934
      if (!originals)                                                                                         // 935
        return;                                                                                               // 936
      originals.forEach(function (doc, id) {                                                                  // 937
        docsWritten.push({collection: collection, id: id});                                                   // 938
        if (!_.has(self._serverDocuments, collection))                                                        // 939
          self._serverDocuments[collection] = new MongoIDMap;                                                 // 940
        var serverDoc = self._serverDocuments[collection].setDefault(id, {});                                 // 941
        if (serverDoc.writtenByStubs) {                                                                       // 942
          // We're not the first stub to write this doc. Just add our method ID                               // 943
          // to the record.                                                                                   // 944
          serverDoc.writtenByStubs[methodId] = true;                                                          // 945
        } else {                                                                                              // 946
          // First stub! Save the original value and our method ID.                                           // 947
          serverDoc.document = doc;                                                                           // 948
          serverDoc.flushCallbacks = [];                                                                      // 949
          serverDoc.writtenByStubs = {};                                                                      // 950
          serverDoc.writtenByStubs[methodId] = true;                                                          // 951
        }                                                                                                     // 952
      });                                                                                                     // 953
    });                                                                                                       // 954
    if (!_.isEmpty(docsWritten)) {                                                                            // 955
      self._documentsWrittenByStub[methodId] = docsWritten;                                                   // 956
    }                                                                                                         // 957
  },                                                                                                          // 958
                                                                                                              // 959
  // This is very much a private function we use to make the tests                                            // 960
  // take up fewer server resources after they complete.                                                      // 961
  _unsubscribeAll: function () {                                                                              // 962
    var self = this;                                                                                          // 963
    _.each(_.clone(self._subscriptions), function (sub, id) {                                                 // 964
      // Avoid killing the autoupdate subscription so that developers                                         // 965
      // still get hot code pushes when writing tests.                                                        // 966
      //                                                                                                      // 967
      // XXX it's a hack to encode knowledge about autoupdate here,                                           // 968
      // but it doesn't seem worth it yet to have a special API for                                           // 969
      // subscriptions to preserve after unit tests.                                                          // 970
      if (sub.name !== 'meteor_autoupdate_clientVersions') {                                                  // 971
        self._subscriptions[id].stop();                                                                       // 972
      }                                                                                                       // 973
    });                                                                                                       // 974
  },                                                                                                          // 975
                                                                                                              // 976
  // Sends the DDP stringification of the given message object                                                // 977
  _send: function (obj) {                                                                                     // 978
    var self = this;                                                                                          // 979
    self._stream.send(DDPCommon.stringifyDDP(obj));                                                           // 980
  },                                                                                                          // 981
                                                                                                              // 982
  // We detected via DDP-level heartbeats that we've lost the                                                 // 983
  // connection.  Unlike `disconnect` or `close`, a lost connection                                           // 984
  // will be automatically retried.                                                                           // 985
  _lostConnection: function (error) {                                                                         // 986
    var self = this;                                                                                          // 987
    self._stream._lostConnection(error);                                                                      // 988
  },                                                                                                          // 989
                                                                                                              // 990
  /**                                                                                                         // 991
   * @summary Get the current connection status. A reactive data source.                                      // 992
   * @locus Client                                                                                            // 993
   * @memberOf Meteor                                                                                         // 994
   */                                                                                                         // 995
  status: function (/*passthrough args*/) {                                                                   // 996
    var self = this;                                                                                          // 997
    return self._stream.status.apply(self._stream, arguments);                                                // 998
  },                                                                                                          // 999
                                                                                                              // 1000
  /**                                                                                                         // 1001
   * @summary Force an immediate reconnection attempt if the client is not connected to the server.           // 1002
                                                                                                              // 1003
  This method does nothing if the client is already connected.                                                // 1004
   * @locus Client                                                                                            // 1005
   * @memberOf Meteor                                                                                         // 1006
   */                                                                                                         // 1007
  reconnect: function (/*passthrough args*/) {                                                                // 1008
    var self = this;                                                                                          // 1009
    return self._stream.reconnect.apply(self._stream, arguments);                                             // 1010
  },                                                                                                          // 1011
                                                                                                              // 1012
  /**                                                                                                         // 1013
   * @summary Disconnect the client from the server.                                                          // 1014
   * @locus Client                                                                                            // 1015
   * @memberOf Meteor                                                                                         // 1016
   */                                                                                                         // 1017
  disconnect: function (/*passthrough args*/) {                                                               // 1018
    var self = this;                                                                                          // 1019
    return self._stream.disconnect.apply(self._stream, arguments);                                            // 1020
  },                                                                                                          // 1021
                                                                                                              // 1022
  close: function () {                                                                                        // 1023
    var self = this;                                                                                          // 1024
    return self._stream.disconnect({_permanent: true});                                                       // 1025
  },                                                                                                          // 1026
                                                                                                              // 1027
  ///                                                                                                         // 1028
  /// Reactive user system                                                                                    // 1029
  ///                                                                                                         // 1030
  userId: function () {                                                                                       // 1031
    var self = this;                                                                                          // 1032
    if (self._userIdDeps)                                                                                     // 1033
      self._userIdDeps.depend();                                                                              // 1034
    return self._userId;                                                                                      // 1035
  },                                                                                                          // 1036
                                                                                                              // 1037
  setUserId: function (userId) {                                                                              // 1038
    var self = this;                                                                                          // 1039
    // Avoid invalidating dependents if setUserId is called with current value.                               // 1040
    if (self._userId === userId)                                                                              // 1041
      return;                                                                                                 // 1042
    self._userId = userId;                                                                                    // 1043
    if (self._userIdDeps)                                                                                     // 1044
      self._userIdDeps.changed();                                                                             // 1045
  },                                                                                                          // 1046
                                                                                                              // 1047
  // Returns true if we are in a state after reconnect of waiting for subs to be                              // 1048
  // revived or early methods to finish their data, or we are waiting for a                                   // 1049
  // "wait" method to finish.                                                                                 // 1050
  _waitingForQuiescence: function () {                                                                        // 1051
    var self = this;                                                                                          // 1052
    return (! _.isEmpty(self._subsBeingRevived) ||                                                            // 1053
            ! _.isEmpty(self._methodsBlockingQuiescence));                                                    // 1054
  },                                                                                                          // 1055
                                                                                                              // 1056
  // Returns true if any method whose message has been sent to the server has                                 // 1057
  // not yet invoked its user callback.                                                                       // 1058
  _anyMethodsAreOutstanding: function () {                                                                    // 1059
    var self = this;                                                                                          // 1060
    return _.any(_.pluck(self._methodInvokers, 'sentMessage'));                                               // 1061
  },                                                                                                          // 1062
                                                                                                              // 1063
  _livedata_connected: function (msg) {                                                                       // 1064
    var self = this;                                                                                          // 1065
                                                                                                              // 1066
    if (self._version !== 'pre1' && self._heartbeatInterval !== 0) {                                          // 1067
      self._heartbeat = new DDPCommon.Heartbeat({                                                             // 1068
        heartbeatInterval: self._heartbeatInterval,                                                           // 1069
        heartbeatTimeout: self._heartbeatTimeout,                                                             // 1070
        onTimeout: function () {                                                                              // 1071
          self._lostConnection(                                                                               // 1072
            new DDP.ConnectionError("DDP heartbeat timed out"));                                              // 1073
        },                                                                                                    // 1074
        sendPing: function () {                                                                               // 1075
          self._send({msg: 'ping'});                                                                          // 1076
        }                                                                                                     // 1077
      });                                                                                                     // 1078
      self._heartbeat.start();                                                                                // 1079
    }                                                                                                         // 1080
                                                                                                              // 1081
    // If this is a reconnect, we'll have to reset all stores.                                                // 1082
    if (self._lastSessionId)                                                                                  // 1083
      self._resetStores = true;                                                                               // 1084
                                                                                                              // 1085
    if (typeof (msg.session) === "string") {                                                                  // 1086
      var reconnectedToPreviousSession = (self._lastSessionId === msg.session);                               // 1087
      self._lastSessionId = msg.session;                                                                      // 1088
    }                                                                                                         // 1089
                                                                                                              // 1090
    if (reconnectedToPreviousSession) {                                                                       // 1091
      // Successful reconnection -- pick up where we left off.  Note that right                               // 1092
      // now, this never happens: the server never connects us to a previous                                  // 1093
      // session, because DDP doesn't provide enough data for the server to know                              // 1094
      // what messages the client has processed. We need to improve DDP to make                               // 1095
      // this possible, at which point we'll probably need more code here.                                    // 1096
      return;                                                                                                 // 1097
    }                                                                                                         // 1098
                                                                                                              // 1099
    // Server doesn't have our data any more. Re-sync a new session.                                          // 1100
                                                                                                              // 1101
    // Forget about messages we were buffering for unknown collections. They'll                               // 1102
    // be resent if still relevant.                                                                           // 1103
    self._updatesForUnknownStores = {};                                                                       // 1104
                                                                                                              // 1105
    if (self._resetStores) {                                                                                  // 1106
      // Forget about the effects of stubs. We'll be resetting all collections                                // 1107
      // anyway.                                                                                              // 1108
      self._documentsWrittenByStub = {};                                                                      // 1109
      self._serverDocuments = {};                                                                             // 1110
    }                                                                                                         // 1111
                                                                                                              // 1112
    // Clear _afterUpdateCallbacks.                                                                           // 1113
    self._afterUpdateCallbacks = [];                                                                          // 1114
                                                                                                              // 1115
    // Mark all named subscriptions which are ready (ie, we already called the                                // 1116
    // ready callback) as needing to be revived.                                                              // 1117
    // XXX We should also block reconnect quiescence until unnamed subscriptions                              // 1118
    //     (eg, autopublish) are done re-publishing to avoid flicker!                                         // 1119
    self._subsBeingRevived = {};                                                                              // 1120
    _.each(self._subscriptions, function (sub, id) {                                                          // 1121
      if (sub.ready)                                                                                          // 1122
        self._subsBeingRevived[id] = true;                                                                    // 1123
    });                                                                                                       // 1124
                                                                                                              // 1125
    // Arrange for "half-finished" methods to have their callbacks run, and                                   // 1126
    // track methods that were sent on this connection so that we don't                                       // 1127
    // quiesce until they are all done.                                                                       // 1128
    //                                                                                                        // 1129
    // Start by clearing _methodsBlockingQuiescence: methods sent before                                      // 1130
    // reconnect don't matter, and any "wait" methods sent on the new connection                              // 1131
    // that we drop here will be restored by the loop below.                                                  // 1132
    self._methodsBlockingQuiescence = {};                                                                     // 1133
    if (self._resetStores) {                                                                                  // 1134
      _.each(self._methodInvokers, function (invoker) {                                                       // 1135
        if (invoker.gotResult()) {                                                                            // 1136
          // This method already got its result, but it didn't call its callback                              // 1137
          // because its data didn't become visible. We did not resend the                                    // 1138
          // method RPC. We'll call its callback when we get a full quiesce,                                  // 1139
          // since that's as close as we'll get to "data must be visible".                                    // 1140
          self._afterUpdateCallbacks.push(_.bind(invoker.dataVisible, invoker));                              // 1141
        } else if (invoker.sentMessage) {                                                                     // 1142
          // This method has been sent on this connection (maybe as a resend                                  // 1143
          // from the last connection, maybe from onReconnect, maybe just very                                // 1144
          // quickly before processing the connected message).                                                // 1145
          //                                                                                                  // 1146
          // We don't need to do anything special to ensure its callbacks get                                 // 1147
          // called, but we'll count it as a method which is preventing                                       // 1148
          // reconnect quiescence. (eg, it might be a login method that was run                               // 1149
          // from onReconnect, and we don't want to see flicker by seeing a                                   // 1150
          // logged-out state.)                                                                               // 1151
          self._methodsBlockingQuiescence[invoker.methodId] = true;                                           // 1152
        }                                                                                                     // 1153
      });                                                                                                     // 1154
    }                                                                                                         // 1155
                                                                                                              // 1156
    self._messagesBufferedUntilQuiescence = [];                                                               // 1157
                                                                                                              // 1158
    // If we're not waiting on any methods or subs, we can reset the stores and                               // 1159
    // call the callbacks immediately.                                                                        // 1160
    if (!self._waitingForQuiescence()) {                                                                      // 1161
      if (self._resetStores) {                                                                                // 1162
        _.each(self._stores, function (s) {                                                                   // 1163
          s.beginUpdate(0, true);                                                                             // 1164
          s.endUpdate();                                                                                      // 1165
        });                                                                                                   // 1166
        self._resetStores = false;                                                                            // 1167
      }                                                                                                       // 1168
      self._runAfterUpdateCallbacks();                                                                        // 1169
    }                                                                                                         // 1170
  },                                                                                                          // 1171
                                                                                                              // 1172
                                                                                                              // 1173
  _processOneDataMessage: function (msg, updates) {                                                           // 1174
    var self = this;                                                                                          // 1175
    // Using underscore here so as not to need to capitalize.                                                 // 1176
    self['_process_' + msg.msg](msg, updates);                                                                // 1177
  },                                                                                                          // 1178
                                                                                                              // 1179
                                                                                                              // 1180
  _livedata_data: function (msg) {                                                                            // 1181
    var self = this;                                                                                          // 1182
                                                                                                              // 1183
    // collection name -> array of messages                                                                   // 1184
    var updates = {};                                                                                         // 1185
                                                                                                              // 1186
    if (self._waitingForQuiescence()) {                                                                       // 1187
      self._messagesBufferedUntilQuiescence.push(msg);                                                        // 1188
                                                                                                              // 1189
      if (msg.msg === "nosub")                                                                                // 1190
        delete self._subsBeingRevived[msg.id];                                                                // 1191
                                                                                                              // 1192
      _.each(msg.subs || [], function (subId) {                                                               // 1193
        delete self._subsBeingRevived[subId];                                                                 // 1194
      });                                                                                                     // 1195
      _.each(msg.methods || [], function (methodId) {                                                         // 1196
        delete self._methodsBlockingQuiescence[methodId];                                                     // 1197
      });                                                                                                     // 1198
                                                                                                              // 1199
      if (self._waitingForQuiescence())                                                                       // 1200
        return;                                                                                               // 1201
                                                                                                              // 1202
      // No methods or subs are blocking quiescence!                                                          // 1203
      // We'll now process and all of our buffered messages, reset all stores,                                // 1204
      // and apply them all at once.                                                                          // 1205
      _.each(self._messagesBufferedUntilQuiescence, function (bufferedMsg) {                                  // 1206
        self._processOneDataMessage(bufferedMsg, updates);                                                    // 1207
      });                                                                                                     // 1208
      self._messagesBufferedUntilQuiescence = [];                                                             // 1209
    } else {                                                                                                  // 1210
      self._processOneDataMessage(msg, updates);                                                              // 1211
    }                                                                                                         // 1212
                                                                                                              // 1213
    if (self._resetStores || !_.isEmpty(updates)) {                                                           // 1214
      // Begin a transactional update of each store.                                                          // 1215
      _.each(self._stores, function (s, storeName) {                                                          // 1216
        s.beginUpdate(_.has(updates, storeName) ? updates[storeName].length : 0,                              // 1217
                      self._resetStores);                                                                     // 1218
      });                                                                                                     // 1219
      self._resetStores = false;                                                                              // 1220
                                                                                                              // 1221
      _.each(updates, function (updateMessages, storeName) {                                                  // 1222
        var store = self._stores[storeName];                                                                  // 1223
        if (store) {                                                                                          // 1224
          _.each(updateMessages, function (updateMessage) {                                                   // 1225
            store.update(updateMessage);                                                                      // 1226
          });                                                                                                 // 1227
        } else {                                                                                              // 1228
          // Nobody's listening for this data. Queue it up until                                              // 1229
          // someone wants it.                                                                                // 1230
          // XXX memory use will grow without bound if you forget to                                          // 1231
          // create a collection or just don't care about it... going                                         // 1232
          // to have to do something about that.                                                              // 1233
          if (!_.has(self._updatesForUnknownStores, storeName))                                               // 1234
            self._updatesForUnknownStores[storeName] = [];                                                    // 1235
          Array.prototype.push.apply(self._updatesForUnknownStores[storeName],                                // 1236
                                     updateMessages);                                                         // 1237
        }                                                                                                     // 1238
      });                                                                                                     // 1239
                                                                                                              // 1240
      // End update transaction.                                                                              // 1241
      _.each(self._stores, function (s) { s.endUpdate(); });                                                  // 1242
    }                                                                                                         // 1243
                                                                                                              // 1244
    self._runAfterUpdateCallbacks();                                                                          // 1245
  },                                                                                                          // 1246
                                                                                                              // 1247
  // Call any callbacks deferred with _runWhenAllServerDocsAreFlushed whose                                   // 1248
  // relevant docs have been flushed, as well as dataVisible callbacks at                                     // 1249
  // reconnect-quiescence time.                                                                               // 1250
  _runAfterUpdateCallbacks: function () {                                                                     // 1251
    var self = this;                                                                                          // 1252
    var callbacks = self._afterUpdateCallbacks;                                                               // 1253
    self._afterUpdateCallbacks = [];                                                                          // 1254
    _.each(callbacks, function (c) {                                                                          // 1255
      c();                                                                                                    // 1256
    });                                                                                                       // 1257
  },                                                                                                          // 1258
                                                                                                              // 1259
  _pushUpdate: function (updates, collection, msg) {                                                          // 1260
    var self = this;                                                                                          // 1261
    if (!_.has(updates, collection)) {                                                                        // 1262
      updates[collection] = [];                                                                               // 1263
    }                                                                                                         // 1264
    updates[collection].push(msg);                                                                            // 1265
  },                                                                                                          // 1266
                                                                                                              // 1267
  _getServerDoc: function (collection, id) {                                                                  // 1268
    var self = this;                                                                                          // 1269
    if (!_.has(self._serverDocuments, collection))                                                            // 1270
      return null;                                                                                            // 1271
    var serverDocsForCollection = self._serverDocuments[collection];                                          // 1272
    return serverDocsForCollection.get(id) || null;                                                           // 1273
  },                                                                                                          // 1274
                                                                                                              // 1275
  _process_added: function (msg, updates) {                                                                   // 1276
    var self = this;                                                                                          // 1277
    var id = MongoID.idParse(msg.id);                                                                         // 1278
    var serverDoc = self._getServerDoc(msg.collection, id);                                                   // 1279
    if (serverDoc) {                                                                                          // 1280
      // Some outstanding stub wrote here.                                                                    // 1281
      var isExisting = (serverDoc.document !== undefined);                                                    // 1282
                                                                                                              // 1283
      serverDoc.document = msg.fields || {};                                                                  // 1284
      serverDoc.document._id = id;                                                                            // 1285
                                                                                                              // 1286
      if (self._resetStores) {                                                                                // 1287
        // During reconnect the server is sending adds for existing ids.                                      // 1288
        // Always push an update so that document stays in the store after                                    // 1289
        // reset. Use current version of the document for this update, so                                     // 1290
        // that stub-written values are preserved.                                                            // 1291
        var currentDoc = self._stores[msg.collection].getDoc(msg.id);                                         // 1292
        if (currentDoc !== undefined)                                                                         // 1293
          msg.fields = currentDoc;                                                                            // 1294
                                                                                                              // 1295
        self._pushUpdate(updates, msg.collection, msg);                                                       // 1296
      } else if (isExisting) {                                                                                // 1297
        throw new Error("Server sent add for existing id: " + msg.id);                                        // 1298
      }                                                                                                       // 1299
    } else {                                                                                                  // 1300
      self._pushUpdate(updates, msg.collection, msg);                                                         // 1301
    }                                                                                                         // 1302
  },                                                                                                          // 1303
                                                                                                              // 1304
  _process_changed: function (msg, updates) {                                                                 // 1305
    var self = this;                                                                                          // 1306
    var serverDoc = self._getServerDoc(                                                                       // 1307
      msg.collection, MongoID.idParse(msg.id));                                                               // 1308
    if (serverDoc) {                                                                                          // 1309
      if (serverDoc.document === undefined)                                                                   // 1310
        throw new Error("Server sent changed for nonexisting id: " + msg.id);                                 // 1311
      DiffSequence.applyChanges(serverDoc.document, msg.fields);                                              // 1312
    } else {                                                                                                  // 1313
      self._pushUpdate(updates, msg.collection, msg);                                                         // 1314
    }                                                                                                         // 1315
  },                                                                                                          // 1316
                                                                                                              // 1317
  _process_removed: function (msg, updates) {                                                                 // 1318
    var self = this;                                                                                          // 1319
    var serverDoc = self._getServerDoc(                                                                       // 1320
      msg.collection, MongoID.idParse(msg.id));                                                               // 1321
    if (serverDoc) {                                                                                          // 1322
      // Some outstanding stub wrote here.                                                                    // 1323
      if (serverDoc.document === undefined)                                                                   // 1324
        throw new Error("Server sent removed for nonexisting id:" + msg.id);                                  // 1325
      serverDoc.document = undefined;                                                                         // 1326
    } else {                                                                                                  // 1327
      self._pushUpdate(updates, msg.collection, {                                                             // 1328
        msg: 'removed',                                                                                       // 1329
        collection: msg.collection,                                                                           // 1330
        id: msg.id                                                                                            // 1331
      });                                                                                                     // 1332
    }                                                                                                         // 1333
  },                                                                                                          // 1334
                                                                                                              // 1335
  _process_updated: function (msg, updates) {                                                                 // 1336
    var self = this;                                                                                          // 1337
    // Process "method done" messages.                                                                        // 1338
    _.each(msg.methods, function (methodId) {                                                                 // 1339
      _.each(self._documentsWrittenByStub[methodId], function (written) {                                     // 1340
        var serverDoc = self._getServerDoc(written.collection, written.id);                                   // 1341
        if (!serverDoc)                                                                                       // 1342
          throw new Error("Lost serverDoc for " + JSON.stringify(written));                                   // 1343
        if (!serverDoc.writtenByStubs[methodId])                                                              // 1344
          throw new Error("Doc " + JSON.stringify(written) +                                                  // 1345
                          " not written by  method " + methodId);                                             // 1346
        delete serverDoc.writtenByStubs[methodId];                                                            // 1347
        if (_.isEmpty(serverDoc.writtenByStubs)) {                                                            // 1348
          // All methods whose stubs wrote this method have completed! We can                                 // 1349
          // now copy the saved document to the database (reverting the stub's                                // 1350
          // change if the server did not write to this object, or applying the                               // 1351
          // server's writes if it did).                                                                      // 1352
                                                                                                              // 1353
          // This is a fake ddp 'replace' message.  It's just for talking                                     // 1354
          // between livedata connections and minimongo.  (We have to stringify                               // 1355
          // the ID because it's supposed to look like a wire message.)                                       // 1356
          self._pushUpdate(updates, written.collection, {                                                     // 1357
            msg: 'replace',                                                                                   // 1358
            id: MongoID.idStringify(written.id),                                                              // 1359
            replace: serverDoc.document                                                                       // 1360
          });                                                                                                 // 1361
          // Call all flush callbacks.                                                                        // 1362
          _.each(serverDoc.flushCallbacks, function (c) {                                                     // 1363
            c();                                                                                              // 1364
          });                                                                                                 // 1365
                                                                                                              // 1366
          // Delete this completed serverDocument. Don't bother to GC empty                                   // 1367
          // IdMaps inside self._serverDocuments, since there probably aren't                                 // 1368
          // many collections and they'll be written repeatedly.                                              // 1369
          self._serverDocuments[written.collection].remove(written.id);                                       // 1370
        }                                                                                                     // 1371
      });                                                                                                     // 1372
      delete self._documentsWrittenByStub[methodId];                                                          // 1373
                                                                                                              // 1374
      // We want to call the data-written callback, but we can't do so until all                              // 1375
      // currently buffered messages are flushed.                                                             // 1376
      var callbackInvoker = self._methodInvokers[methodId];                                                   // 1377
      if (!callbackInvoker)                                                                                   // 1378
        throw new Error("No callback invoker for method " + methodId);                                        // 1379
      self._runWhenAllServerDocsAreFlushed(                                                                   // 1380
        _.bind(callbackInvoker.dataVisible, callbackInvoker));                                                // 1381
    });                                                                                                       // 1382
  },                                                                                                          // 1383
                                                                                                              // 1384
  _process_ready: function (msg, updates) {                                                                   // 1385
    var self = this;                                                                                          // 1386
    // Process "sub ready" messages. "sub ready" messages don't take effect                                   // 1387
    // until all current server documents have been flushed to the local                                      // 1388
    // database. We can use a write fence to implement this.                                                  // 1389
    _.each(msg.subs, function (subId) {                                                                       // 1390
      self._runWhenAllServerDocsAreFlushed(function () {                                                      // 1391
        var subRecord = self._subscriptions[subId];                                                           // 1392
        // Did we already unsubscribe?                                                                        // 1393
        if (!subRecord)                                                                                       // 1394
          return;                                                                                             // 1395
        // Did we already receive a ready message? (Oops!)                                                    // 1396
        if (subRecord.ready)                                                                                  // 1397
          return;                                                                                             // 1398
        subRecord.ready = true;                                                                               // 1399
        subRecord.readyCallback && subRecord.readyCallback();                                                 // 1400
        subRecord.readyDeps.changed();                                                                        // 1401
      });                                                                                                     // 1402
    });                                                                                                       // 1403
  },                                                                                                          // 1404
                                                                                                              // 1405
  // Ensures that "f" will be called after all documents currently in                                         // 1406
  // _serverDocuments have been written to the local cache. f will not be called                              // 1407
  // if the connection is lost before then!                                                                   // 1408
  _runWhenAllServerDocsAreFlushed: function (f) {                                                             // 1409
    var self = this;                                                                                          // 1410
    var runFAfterUpdates = function () {                                                                      // 1411
      self._afterUpdateCallbacks.push(f);                                                                     // 1412
    };                                                                                                        // 1413
    var unflushedServerDocCount = 0;                                                                          // 1414
    var onServerDocFlush = function () {                                                                      // 1415
      --unflushedServerDocCount;                                                                              // 1416
      if (unflushedServerDocCount === 0) {                                                                    // 1417
        // This was the last doc to flush! Arrange to run f after the updates                                 // 1418
        // have been applied.                                                                                 // 1419
        runFAfterUpdates();                                                                                   // 1420
      }                                                                                                       // 1421
    };                                                                                                        // 1422
    _.each(self._serverDocuments, function (collectionDocs) {                                                 // 1423
      collectionDocs.forEach(function (serverDoc) {                                                           // 1424
        var writtenByStubForAMethodWithSentMessage = _.any(                                                   // 1425
          serverDoc.writtenByStubs, function (dummy, methodId) {                                              // 1426
            var invoker = self._methodInvokers[methodId];                                                     // 1427
            return invoker && invoker.sentMessage;                                                            // 1428
          });                                                                                                 // 1429
        if (writtenByStubForAMethodWithSentMessage) {                                                         // 1430
          ++unflushedServerDocCount;                                                                          // 1431
          serverDoc.flushCallbacks.push(onServerDocFlush);                                                    // 1432
        }                                                                                                     // 1433
      });                                                                                                     // 1434
    });                                                                                                       // 1435
    if (unflushedServerDocCount === 0) {                                                                      // 1436
      // There aren't any buffered docs --- we can call f as soon as the current                              // 1437
      // round of updates is applied!                                                                         // 1438
      runFAfterUpdates();                                                                                     // 1439
    }                                                                                                         // 1440
  },                                                                                                          // 1441
                                                                                                              // 1442
  _livedata_nosub: function (msg) {                                                                           // 1443
    var self = this;                                                                                          // 1444
                                                                                                              // 1445
    // First pass it through _livedata_data, which only uses it to help get                                   // 1446
    // towards quiescence.                                                                                    // 1447
    self._livedata_data(msg);                                                                                 // 1448
                                                                                                              // 1449
    // Do the rest of our processing immediately, with no                                                     // 1450
    // buffering-until-quiescence.                                                                            // 1451
                                                                                                              // 1452
    // we weren't subbed anyway, or we initiated the unsub.                                                   // 1453
    if (!_.has(self._subscriptions, msg.id))                                                                  // 1454
      return;                                                                                                 // 1455
                                                                                                              // 1456
    // XXX COMPAT WITH 1.0.3.1 #errorCallback                                                                 // 1457
    var errorCallback = self._subscriptions[msg.id].errorCallback;                                            // 1458
    var stopCallback = self._subscriptions[msg.id].stopCallback;                                              // 1459
                                                                                                              // 1460
    self._subscriptions[msg.id].remove();                                                                     // 1461
                                                                                                              // 1462
    var meteorErrorFromMsg = function (msgArg) {                                                              // 1463
      return msgArg && msgArg.error && new Meteor.Error(                                                      // 1464
        msgArg.error.error, msgArg.error.reason, msgArg.error.details);                                       // 1465
    }                                                                                                         // 1466
                                                                                                              // 1467
    // XXX COMPAT WITH 1.0.3.1 #errorCallback                                                                 // 1468
    if (errorCallback && msg.error) {                                                                         // 1469
      errorCallback(meteorErrorFromMsg(msg));                                                                 // 1470
    }                                                                                                         // 1471
                                                                                                              // 1472
    if (stopCallback) {                                                                                       // 1473
      stopCallback(meteorErrorFromMsg(msg));                                                                  // 1474
    }                                                                                                         // 1475
  },                                                                                                          // 1476
                                                                                                              // 1477
  _process_nosub: function () {                                                                               // 1478
    // This is called as part of the "buffer until quiescence" process, but                                   // 1479
    // nosub's effect is always immediate. It only goes in the buffer at all                                  // 1480
    // because it's possible for a nosub to be the thing that triggers                                        // 1481
    // quiescence, if we were waiting for a sub to be revived and it dies                                     // 1482
    // instead.                                                                                               // 1483
  },                                                                                                          // 1484
                                                                                                              // 1485
  _livedata_result: function (msg) {                                                                          // 1486
    // id, result or error. error has error (code), reason, details                                           // 1487
                                                                                                              // 1488
    var self = this;                                                                                          // 1489
                                                                                                              // 1490
    // find the outstanding request                                                                           // 1491
    // should be O(1) in nearly all realistic use cases                                                       // 1492
    if (_.isEmpty(self._outstandingMethodBlocks)) {                                                           // 1493
      Meteor._debug("Received method result but no methods outstanding");                                     // 1494
      return;                                                                                                 // 1495
    }                                                                                                         // 1496
    var currentMethodBlock = self._outstandingMethodBlocks[0].methods;                                        // 1497
    var m;                                                                                                    // 1498
    for (var i = 0; i < currentMethodBlock.length; i++) {                                                     // 1499
      m = currentMethodBlock[i];                                                                              // 1500
      if (m.methodId === msg.id)                                                                              // 1501
        break;                                                                                                // 1502
    }                                                                                                         // 1503
                                                                                                              // 1504
    if (!m) {                                                                                                 // 1505
      Meteor._debug("Can't match method response to original method call", msg);                              // 1506
      return;                                                                                                 // 1507
    }                                                                                                         // 1508
                                                                                                              // 1509
    // Remove from current method block. This may leave the block empty, but we                               // 1510
    // don't move on to the next block until the callback has been delivered, in                              // 1511
    // _outstandingMethodFinished.                                                                            // 1512
    currentMethodBlock.splice(i, 1);                                                                          // 1513
                                                                                                              // 1514
    if (_.has(msg, 'error')) {                                                                                // 1515
      m.receiveResult(new Meteor.Error(                                                                       // 1516
        msg.error.error, msg.error.reason,                                                                    // 1517
        msg.error.details));                                                                                  // 1518
    } else {                                                                                                  // 1519
      // msg.result may be undefined if the method didn't return a                                            // 1520
      // value                                                                                                // 1521
      m.receiveResult(undefined, msg.result);                                                                 // 1522
    }                                                                                                         // 1523
  },                                                                                                          // 1524
                                                                                                              // 1525
  // Called by MethodInvoker after a method's callback is invoked.  If this was                               // 1526
  // the last outstanding method in the current block, runs the next block. If                                // 1527
  // there are no more methods, consider accepting a hot code push.                                           // 1528
  _outstandingMethodFinished: function () {                                                                   // 1529
    var self = this;                                                                                          // 1530
    if (self._anyMethodsAreOutstanding())                                                                     // 1531
      return;                                                                                                 // 1532
                                                                                                              // 1533
    // No methods are outstanding. This should mean that the first block of                                   // 1534
    // methods is empty. (Or it might not exist, if this was a method that                                    // 1535
    // half-finished before disconnect/reconnect.)                                                            // 1536
    if (! _.isEmpty(self._outstandingMethodBlocks)) {                                                         // 1537
      var firstBlock = self._outstandingMethodBlocks.shift();                                                 // 1538
      if (! _.isEmpty(firstBlock.methods))                                                                    // 1539
        throw new Error("No methods outstanding but nonempty block: " +                                       // 1540
                        JSON.stringify(firstBlock));                                                          // 1541
                                                                                                              // 1542
      // Send the outstanding methods now in the first block.                                                 // 1543
      if (!_.isEmpty(self._outstandingMethodBlocks))                                                          // 1544
        self._sendOutstandingMethods();                                                                       // 1545
    }                                                                                                         // 1546
                                                                                                              // 1547
    // Maybe accept a hot code push.                                                                          // 1548
    self._maybeMigrate();                                                                                     // 1549
  },                                                                                                          // 1550
                                                                                                              // 1551
  // Sends messages for all the methods in the first block in                                                 // 1552
  // _outstandingMethodBlocks.                                                                                // 1553
  _sendOutstandingMethods: function() {                                                                       // 1554
    var self = this;                                                                                          // 1555
    if (_.isEmpty(self._outstandingMethodBlocks))                                                             // 1556
      return;                                                                                                 // 1557
    _.each(self._outstandingMethodBlocks[0].methods, function (m) {                                           // 1558
      m.sendMessage();                                                                                        // 1559
    });                                                                                                       // 1560
  },                                                                                                          // 1561
                                                                                                              // 1562
  _livedata_error: function (msg) {                                                                           // 1563
    Meteor._debug("Received error from server: ", msg.reason);                                                // 1564
    if (msg.offendingMessage)                                                                                 // 1565
      Meteor._debug("For: ", msg.offendingMessage);                                                           // 1566
  },                                                                                                          // 1567
                                                                                                              // 1568
  _callOnReconnectAndSendAppropriateOutstandingMethods: function() {                                          // 1569
    var self = this;                                                                                          // 1570
    var oldOutstandingMethodBlocks = self._outstandingMethodBlocks;                                           // 1571
    self._outstandingMethodBlocks = [];                                                                       // 1572
                                                                                                              // 1573
    self.onReconnect();                                                                                       // 1574
                                                                                                              // 1575
    if (_.isEmpty(oldOutstandingMethodBlocks))                                                                // 1576
      return;                                                                                                 // 1577
                                                                                                              // 1578
    // We have at least one block worth of old outstanding methods to try                                     // 1579
    // again. First: did onReconnect actually send anything? If not, we just                                  // 1580
    // restore all outstanding methods and run the first block.                                               // 1581
    if (_.isEmpty(self._outstandingMethodBlocks)) {                                                           // 1582
      self._outstandingMethodBlocks = oldOutstandingMethodBlocks;                                             // 1583
      self._sendOutstandingMethods();                                                                         // 1584
      return;                                                                                                 // 1585
    }                                                                                                         // 1586
                                                                                                              // 1587
    // OK, there are blocks on both sides. Special case: merge the last block of                              // 1588
    // the reconnect methods with the first block of the original methods, if                                 // 1589
    // neither of them are "wait" blocks.                                                                     // 1590
    if (!_.last(self._outstandingMethodBlocks).wait &&                                                        // 1591
        !oldOutstandingMethodBlocks[0].wait) {                                                                // 1592
      _.each(oldOutstandingMethodBlocks[0].methods, function (m) {                                            // 1593
        _.last(self._outstandingMethodBlocks).methods.push(m);                                                // 1594
                                                                                                              // 1595
        // If this "last block" is also the first block, send the message.                                    // 1596
        if (self._outstandingMethodBlocks.length === 1)                                                       // 1597
          m.sendMessage();                                                                                    // 1598
      });                                                                                                     // 1599
                                                                                                              // 1600
      oldOutstandingMethodBlocks.shift();                                                                     // 1601
    }                                                                                                         // 1602
                                                                                                              // 1603
    // Now add the rest of the original blocks on.                                                            // 1604
    _.each(oldOutstandingMethodBlocks, function (block) {                                                     // 1605
      self._outstandingMethodBlocks.push(block);                                                              // 1606
    });                                                                                                       // 1607
  },                                                                                                          // 1608
                                                                                                              // 1609
  // We can accept a hot code push if there are no methods in flight.                                         // 1610
  _readyToMigrate: function() {                                                                               // 1611
    var self = this;                                                                                          // 1612
    return _.isEmpty(self._methodInvokers);                                                                   // 1613
  },                                                                                                          // 1614
                                                                                                              // 1615
  // If we were blocking a migration, see if it's now possible to continue.                                   // 1616
  // Call whenever the set of outstanding/blocked methods shrinks.                                            // 1617
  _maybeMigrate: function () {                                                                                // 1618
    var self = this;                                                                                          // 1619
    if (self._retryMigrate && self._readyToMigrate()) {                                                       // 1620
      self._retryMigrate();                                                                                   // 1621
      self._retryMigrate = null;                                                                              // 1622
    }                                                                                                         // 1623
  }                                                                                                           // 1624
});                                                                                                           // 1625
                                                                                                              // 1626
LivedataTest.Connection = Connection;                                                                         // 1627
                                                                                                              // 1628
// @param url {String} URL to Meteor app,                                                                     // 1629
//     e.g.:                                                                                                  // 1630
//     "subdomain.meteor.com",                                                                                // 1631
//     "http://subdomain.meteor.com",                                                                         // 1632
//     "/",                                                                                                   // 1633
//     "ddp+sockjs://ddp--****-foo.meteor.com/sockjs"                                                         // 1634
                                                                                                              // 1635
/**                                                                                                           // 1636
 * @summary Connect to the server of a different Meteor application to subscribe to its document sets and invoke its remote methods.
 * @locus Anywhere                                                                                            // 1638
 * @param {String} url The URL of another Meteor application.                                                 // 1639
 */                                                                                                           // 1640
DDP.connect = function (url, options) {                                                                       // 1641
  var ret = new Connection(url, options);                                                                     // 1642
  allConnections.push(ret); // hack. see below.                                                               // 1643
  return ret;                                                                                                 // 1644
};                                                                                                            // 1645
                                                                                                              // 1646
// Hack for `spiderable` package: a way to see if the page is done                                            // 1647
// loading all the data it needs.                                                                             // 1648
//                                                                                                            // 1649
allConnections = [];                                                                                          // 1650
DDP._allSubscriptionsReady = function () {                                                                    // 1651
  return _.all(allConnections, function (conn) {                                                              // 1652
    return _.all(conn._subscriptions, function (sub) {                                                        // 1653
      return sub.ready;                                                                                       // 1654
    });                                                                                                       // 1655
  });                                                                                                         // 1656
};                                                                                                            // 1657
                                                                                                              // 1658
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ddp-client'] = {
  DDP: DDP,
  LivedataTest: LivedataTest
};

})();

//# sourceMappingURL=ddp-client.js.map
