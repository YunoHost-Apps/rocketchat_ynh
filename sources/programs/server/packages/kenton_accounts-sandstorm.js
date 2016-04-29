(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Random = Package.random.Random;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

(function(){

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/kenton_accounts-sandstorm/server.js                                  //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
// Copyright (c) 2014 Sandstorm Development Group, Inc. and contributors         // 1
// Licensed under the MIT License:                                               // 2
//                                                                               // 3
// Permission is hereby granted, free of charge, to any person obtaining a copy  // 4
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights  // 6
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell     // 7
// copies of the Software, and to permit persons to whom the Software is         // 8
// furnished to do so, subject to the following conditions:                      // 9
//                                                                               // 10
// The above copyright notice and this permission notice shall be included in    // 11
// all copies or substantial portions of the Software.                           // 12
//                                                                               // 13
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR    // 14
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,      // 15
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE   // 16
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER        // 17
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN     // 19
// THE SOFTWARE.                                                                 // 20
                                                                                 // 21
WebApp.rawConnectHandlers.use(function (req, res, next) {                        // 22
  if (req.url === "/.sandstorm-credentials") {                                   // 23
    handleCredentials(req, res);                                                 // 24
    return;                                                                      // 25
  }                                                                              // 26
  return next();                                                                 // 27
});                                                                              // 28
                                                                                 // 29
var handleCredentials = Meteor.bindEnvironment(function (req, res) {             // 30
  try {                                                                          // 31
    var permissions = req.headers["x-sandstorm-permissions"];                    // 32
    if (permissions && permissions !== "") {                                     // 33
      permissions = permissions.split(",");                                      // 34
    } else {                                                                     // 35
      permissions = [];                                                          // 36
    }                                                                            // 37
                                                                                 // 38
    var credentials = {                                                          // 39
      sandstormId: req.headers["x-sandstorm-user-id"] || null,                   // 40
      name: decodeURI(req.headers["x-sandstorm-username"]),                      // 41
      permissions: permissions,                                                  // 42
      picture: req.headers["x-sandstorm-user-picture"] || null,                  // 43
      preferredHandle: req.headers["x-sandstorm-preferred-handle"] || null,      // 44
      pronouns: req.headers["x-sandstorm-user-pronouns"] || null                 // 45
    };                                                                           // 46
                                                                                 // 47
    if (credentials.sandstormId) {                                               // 48
      var login = Accounts.updateOrCreateUserFromExternalService(                // 49
          "sandstorm", {                                                         // 50
            id: credentials.sandstormId,                                         // 51
            name: credentials.name,                                              // 52
            permissions: permissions,                                            // 53
            picture: credentials.picture,                                        // 54
            preferredHandle: credentials.preferredHandle,                        // 55
            pronouns: credentials.pronouns                                       // 56
          }, { profile: { name: credentials.name } });                           // 57
      console.log(login);                                                        // 58
      credentials.meteorId = login.userId;                                       // 59
      var token = Accounts._generateStampedLoginToken();                         // 60
      credentials.token = token.token;                                           // 61
      Accounts._insertLoginToken(login.userId, token);                           // 62
    }                                                                            // 63
                                                                                 // 64
    var body = new Buffer(JSON.stringify(credentials));                          // 65
                                                                                 // 66
    res.writeHead(200, {                                                         // 67
      "Content-Type": "application/json",                                        // 68
      "Content-Length": body.length                                              // 69
    });                                                                          // 70
    res.end(body);                                                               // 71
  } catch (err) {                                                                // 72
    res.writeHead(500, {                                                         // 73
      "Content-Type": "text/plain"                                               // 74
    });                                                                          // 75
    res.end(err.stack);                                                          // 76
  }                                                                              // 77
});                                                                              // 78
                                                                                 // 79
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['kenton:accounts-sandstorm'] = {};

})();

//# sourceMappingURL=kenton_accounts-sandstorm.js.map
