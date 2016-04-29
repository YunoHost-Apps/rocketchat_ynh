(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/rocketchat_cors/cors.coffee.js                                                                //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _staticFilesMiddleware, httpServer, oldHttpServerListeners, url;                                      // 4
                                                                                                          //
WebApp.rawConnectHandlers.use(function(req, res, next) {                                                  // 4
  var buf, ref;                                                                                           // 5
  if (req._body) {                                                                                        // 5
    return next();                                                                                        // 6
  }                                                                                                       //
  if (req.headers['transfer-encoding'] === void 0 && isNaN(req.headers['content-length'])) {              // 8
    return next();                                                                                        // 9
  }                                                                                                       //
  if ((ref = req.headers['content-type']) !== '' && ref !== (void 0)) {                                   // 11
    return next();                                                                                        // 12
  }                                                                                                       //
  buf = '';                                                                                               // 5
  req.setEncoding('utf8');                                                                                // 5
  req.on('data', function(chunk) {                                                                        // 5
    return buf += chunk;                                                                                  //
  });                                                                                                     //
  return req.on('end', function() {                                                                       //
    var err;                                                                                              // 18
    if (((typeof RocketChat !== "undefined" && RocketChat !== null ? RocketChat.debugLevel : void 0) != null) && RocketChat.debugLevel === 'debug') {
      console.log('[request]'.green, req.method, req.url, '\nheaders ->', req.headers, '\nbody ->', buf);
    }                                                                                                     //
    try {                                                                                                 // 21
      req.body = JSON.parse(buf);                                                                         // 22
    } catch (_error) {                                                                                    //
      err = _error;                                                                                       // 24
      req.body = buf;                                                                                     // 24
    }                                                                                                     //
    req._body = true;                                                                                     // 18
    return next();                                                                                        //
  });                                                                                                     //
});                                                                                                       // 4
                                                                                                          //
WebApp.rawConnectHandlers.use(function(req, res, next) {                                                  // 4
  var setHeader;                                                                                          // 31
  if (/^\/(api|_timesync|sockjs|tap-i18n)(\/|$)/.test(req.url)) {                                         // 31
    res.setHeader("Access-Control-Allow-Origin", "*");                                                    // 32
  }                                                                                                       //
  setHeader = res.setHeader;                                                                              // 31
  res.setHeader = function(key, val) {                                                                    // 31
    if (key.toLowerCase() === 'access-control-allow-origin' && val === 'http://meteor.local') {           // 37
      return;                                                                                             // 38
    }                                                                                                     //
    return setHeader.apply(this, arguments);                                                              // 39
  };                                                                                                      //
  return next();                                                                                          // 41
});                                                                                                       // 30
                                                                                                          //
_staticFilesMiddleware = WebAppInternals.staticFilesMiddleware;                                           // 4
                                                                                                          //
WebAppInternals._staticFilesMiddleware = function(staticFiles, req, res, next) {                          // 4
  res.setHeader("Access-Control-Allow-Origin", "*");                                                      // 45
  return _staticFilesMiddleware(staticFiles, req, res, next);                                             //
};                                                                                                        // 44
                                                                                                          //
url = Npm.require("url");                                                                                 // 4
                                                                                                          //
httpServer = WebApp.httpServer;                                                                           // 4
                                                                                                          //
oldHttpServerListeners = httpServer.listeners('request').slice(0);                                        // 4
                                                                                                          //
httpServer.removeAllListeners('request');                                                                 // 4
                                                                                                          //
httpServer.addListener('request', function(req, res) {                                                    // 4
  var args, host, isLocal, isSsl, localhostRegexp, localhostTest, next, remoteAddress;                    // 56
  args = arguments;                                                                                       // 56
  next = function() {                                                                                     // 56
    var i, len, oldListener, results;                                                                     // 58
    results = [];                                                                                         // 58
    for (i = 0, len = oldHttpServerListeners.length; i < len; i++) {                                      //
      oldListener = oldHttpServerListeners[i];                                                            //
      results.push(oldListener.apply(httpServer, args));                                                  // 59
    }                                                                                                     // 58
    return results;                                                                                       //
  };                                                                                                      //
  if (RocketChat.settings.get('Force_SSL') !== true) {                                                    // 61
    next();                                                                                               // 62
    return;                                                                                               // 63
  }                                                                                                       //
  remoteAddress = req.connection.remoteAddress || req.socket.remoteAddress;                               // 56
  localhostRegexp = /^\s*(127\.0\.0\.1|::1)\s*$/;                                                         // 56
  localhostTest = function(x) {                                                                           // 56
    return localhostRegexp.test(x);                                                                       // 69
  };                                                                                                      //
  isLocal = localhostRegexp.test(remoteAddress) && (!req.headers['x-forwarded-for'] || _.all(req.headers['x-forwarded-for'].split(','), localhostTest));
  isSsl = req.connection.pair || (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'].indexOf('https') !== -1);
  if (((typeof RocketChat !== "undefined" && RocketChat !== null ? RocketChat.debugLevel : void 0) != null) && RocketChat.debugLevel === 'debug') {
    console.log('req.url', req.url);                                                                      // 76
    console.log('remoteAddress', remoteAddress);                                                          // 76
    console.log('isLocal', isLocal);                                                                      // 76
    console.log('isSsl', isSsl);                                                                          // 76
    console.log('req.headers', req.headers);                                                              // 76
  }                                                                                                       //
  if (!isLocal && !isSsl) {                                                                               // 82
    host = req.headers['host'] || url.parse(Meteor.absoluteUrl()).hostname;                               // 83
    host = host.replace(/:\d+$/, '');                                                                     // 83
    res.writeHead(302, {                                                                                  // 83
      'Location': 'https://' + host + req.url                                                             // 88
    });                                                                                                   //
    res.end();                                                                                            // 83
    return;                                                                                               // 90
  }                                                                                                       //
  return next();                                                                                          //
});                                                                                                       // 55
                                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/rocketchat_cors/common.coffee.js                                                              //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                               // 1
  return RocketChat.settings.onload('Force_SSL', function(key, value) {                                   //
    return Meteor.absoluteUrl.defaultOptions.secure = value;                                              //
  });                                                                                                     //
});                                                                                                       // 1
                                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:cors'] = {};

})();

//# sourceMappingURL=rocketchat_cors.js.map
