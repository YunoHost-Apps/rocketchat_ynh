(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/mizzao_timesync/timesync-server.js                                  //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
// Use rawConnectHandlers so we get a response as quickly as possible           // 1
// https://github.com/meteor/meteor/blob/devel/packages/webapp/webapp_server.js
                                                                                // 3
WebApp.rawConnectHandlers.use("/_timesync",                                     // 4
  function(req, res, next) {                                                    // 5
    // Never ever cache this, otherwise weird times are shown on reload         // 6
    // http://stackoverflow.com/q/18811286/586086                               // 7
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");      // 8
    res.setHeader("Pragma", "no-cache");                                        // 9
    res.setHeader("Expires", 0);                                                // 10
                                                                                // 11
    // Avoid MIME type warnings in browsers                                     // 12
    res.setHeader("Content-Type", "text/plain");                                // 13
                                                                                // 14
    // Cordova lives in meteor.local, so it does CORS                           // 15
    if (req.headers && req.headers.origin === 'http://meteor.local') {          // 16
      res.setHeader('Access-Control-Allow-Origin', 'http://meteor.local');      // 17
    }                                                                           // 18
                                                                                // 19
    res.end(Date.now().toString());                                             // 20
  }                                                                             // 21
);                                                                              // 22
                                                                                // 23
//////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mizzao:timesync'] = {};

})();

//# sourceMappingURL=mizzao_timesync.js.map
