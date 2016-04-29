(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var __coffeescriptShare, OAuth2Server;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_oauth2-server/model.coffee.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var AccessTokens, AuthCodes, Clients, Model, RefreshTokens, debug;                                                    // 1
                                                                                                                      //
AccessTokens = void 0;                                                                                                // 1
                                                                                                                      //
RefreshTokens = void 0;                                                                                               // 1
                                                                                                                      //
Clients = void 0;                                                                                                     // 1
                                                                                                                      //
AuthCodes = void 0;                                                                                                   // 1
                                                                                                                      //
debug = void 0;                                                                                                       // 1
                                                                                                                      //
this.Model = Model = (function() {                                                                                    // 1
  function Model(config) {                                                                                            // 8
    if (config == null) {                                                                                             //
      config = {};                                                                                                    //
    }                                                                                                                 //
    if (config.accessTokensCollectionName == null) {                                                                  //
      config.accessTokensCollectionName = 'oauth_access_tokens';                                                      //
    }                                                                                                                 //
    if (config.refreshTokensCollectionName == null) {                                                                 //
      config.refreshTokensCollectionName = 'oauth_refresh_tokens';                                                    //
    }                                                                                                                 //
    if (config.clientsCollectionName == null) {                                                                       //
      config.clientsCollectionName = 'oauth_clients';                                                                 //
    }                                                                                                                 //
    if (config.authCodesCollectionName == null) {                                                                     //
      config.authCodesCollectionName = 'oauth_auth_codes';                                                            //
    }                                                                                                                 //
    this.debug = debug = config.debug;                                                                                // 9
    this.AccessTokens = AccessTokens = config.accessTokensCollection || new Meteor.Collection(config.accessTokensCollectionName);
    this.RefreshTokens = RefreshTokens = config.refreshTokensCollection || new Meteor.Collection(config.refreshTokensCollectionName);
    this.Clients = Clients = config.clientsCollection || new Meteor.Collection(config.clientsCollectionName);         // 9
    this.AuthCodes = AuthCodes = config.authCodesCollection || new Meteor.Collection(config.authCodesCollectionName);
  }                                                                                                                   //
                                                                                                                      //
  Model.prototype.getAccessToken = Meteor.bindEnvironment(function(bearerToken, callback) {                           // 8
    var e, token;                                                                                                     // 23
    if (debug === true) {                                                                                             // 23
      console.log('[OAuth2Server]', 'in getAccessToken (bearerToken:', bearerToken, ')');                             // 24
    }                                                                                                                 //
    try {                                                                                                             // 26
      token = AccessTokens.findOne({                                                                                  // 27
        accessToken: bearerToken                                                                                      // 27
      });                                                                                                             //
      return callback(null, token);                                                                                   //
    } catch (_error) {                                                                                                //
      e = _error;                                                                                                     // 30
      return callback(e);                                                                                             //
    }                                                                                                                 //
  });                                                                                                                 //
                                                                                                                      //
  Model.prototype.getClient = Meteor.bindEnvironment(function(clientId, clientSecret, callback) {                     // 8
    var client, e;                                                                                                    // 34
    if (debug === true) {                                                                                             // 34
      console.log('[OAuth2Server]', 'in getClient (clientId:', clientId, ', clientSecret:', clientSecret, ')');       // 35
    }                                                                                                                 //
    try {                                                                                                             // 37
      if (clientSecret == null) {                                                                                     // 38
        client = Clients.findOne({                                                                                    // 39
          active: true,                                                                                               // 39
          clientId: clientId                                                                                          // 39
        });                                                                                                           //
      } else {                                                                                                        //
        client = Clients.findOne({                                                                                    // 41
          active: true,                                                                                               // 41
          clientId: clientId,                                                                                         // 41
          clientSecret: clientSecret                                                                                  // 41
        });                                                                                                           //
      }                                                                                                               //
      return callback(null, client);                                                                                  //
    } catch (_error) {                                                                                                //
      e = _error;                                                                                                     // 44
      return callback(e);                                                                                             //
    }                                                                                                                 //
  });                                                                                                                 //
                                                                                                                      //
  Model.prototype.grantTypeAllowed = function(clientId, grantType, callback) {                                        // 8
    if (debug === true) {                                                                                             // 48
      console.log('[OAuth2Server]', 'in grantTypeAllowed (clientId:', clientId, ', grantType:', grantType + ')');     // 49
    }                                                                                                                 //
    return callback(false, grantType === 'authorization_code');                                                       // 51
  };                                                                                                                  //
                                                                                                                      //
  Model.prototype.saveAccessToken = Meteor.bindEnvironment(function(token, clientId, expires, user, callback) {       // 8
    var e, tokenId;                                                                                                   // 55
    if (debug === true) {                                                                                             // 55
      console.log('[OAuth2Server]', 'in saveAccessToken (token:', token, ', clientId:', clientId, ', user:', user, ', expires:', expires, ')');
    }                                                                                                                 //
    try {                                                                                                             // 58
      tokenId = AccessTokens.insert({                                                                                 // 59
        accessToken: token,                                                                                           // 60
        clientId: clientId,                                                                                           // 60
        userId: user.id,                                                                                              // 60
        expires: expires                                                                                              // 60
      });                                                                                                             //
      return callback(null, tokenId);                                                                                 //
    } catch (_error) {                                                                                                //
      e = _error;                                                                                                     // 67
      return callback(e);                                                                                             //
    }                                                                                                                 //
  });                                                                                                                 //
                                                                                                                      //
  Model.prototype.getAuthCode = Meteor.bindEnvironment(function(authCode, callback) {                                 // 8
    var code, e;                                                                                                      // 71
    if (debug === true) {                                                                                             // 71
      console.log('[OAuth2Server]', 'in getAuthCode (authCode: ' + authCode + ')');                                   // 72
    }                                                                                                                 //
    try {                                                                                                             // 74
      code = AuthCodes.findOne({                                                                                      // 75
        authCode: authCode                                                                                            // 75
      });                                                                                                             //
      return callback(null, code);                                                                                    //
    } catch (_error) {                                                                                                //
      e = _error;                                                                                                     // 78
      return callback(e);                                                                                             //
    }                                                                                                                 //
  });                                                                                                                 //
                                                                                                                      //
  Model.prototype.saveAuthCode = Meteor.bindEnvironment(function(code, clientId, expires, user, callback) {           // 8
    var codeId, e;                                                                                                    // 82
    if (debug === true) {                                                                                             // 82
      console.log('[OAuth2Server]', 'in saveAuthCode (code:', code, ', clientId:', clientId, ', expires:', expires, ', user:', user, ')');
    }                                                                                                                 //
    try {                                                                                                             // 85
      codeId = AuthCodes.upsert({                                                                                     // 86
        authCode: code                                                                                                // 87
      }, {                                                                                                            //
        authCode: code,                                                                                               // 89
        clientId: clientId,                                                                                           // 89
        userId: user.id,                                                                                              // 89
        expires: expires                                                                                              // 89
      });                                                                                                             //
      return callback(null, codeId);                                                                                  //
    } catch (_error) {                                                                                                //
      e = _error;                                                                                                     // 96
      return callback(e);                                                                                             //
    }                                                                                                                 //
  });                                                                                                                 //
                                                                                                                      //
  Model.prototype.saveRefreshToken = Meteor.bindEnvironment(function(token, clientId, expires, user, callback) {      // 8
    var e, tokenId;                                                                                                   // 100
    if (debug === true) {                                                                                             // 100
      console.log('[OAuth2Server]', 'in saveRefreshToken (token:', token, ', clientId:', clientId, ', user:', user, ', expires:', expires, ')');
    }                                                                                                                 //
    try {                                                                                                             // 103
      return tokenId = RefreshTokens.insert({                                                                         //
        refreshToken: token,                                                                                          // 105
        clientId: clientId,                                                                                           // 105
        userId: user.id,                                                                                              // 105
        expires: expires                                                                                              // 105
      }, callback(null, tokenId));                                                                                    //
    } catch (_error) {                                                                                                //
      e = _error;                                                                                                     // 112
      return callback(e);                                                                                             //
    }                                                                                                                 //
  });                                                                                                                 //
                                                                                                                      //
  Model.prototype.getRefreshToken = Meteor.bindEnvironment(function(refreshToken, callback) {                         // 8
    var e, token;                                                                                                     // 116
    if (debug === true) {                                                                                             // 116
      console.log('[OAuth2Server]', 'in getRefreshToken (refreshToken: ' + refreshToken + ')');                       // 117
    }                                                                                                                 //
    try {                                                                                                             // 119
      token = RefreshTokens.findOne({                                                                                 // 120
        refreshToken: refreshToken                                                                                    // 120
      });                                                                                                             //
      return callback(null, token);                                                                                   //
    } catch (_error) {                                                                                                //
      e = _error;                                                                                                     // 123
      return callback(e);                                                                                             //
    }                                                                                                                 //
  });                                                                                                                 //
                                                                                                                      //
  return Model;                                                                                                       //
                                                                                                                      //
})();                                                                                                                 //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_oauth2-server/oauth.coffee.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var express, oauthserver;                                                                                             // 1
                                                                                                                      //
oauthserver = Npm.require('oauth2-server');                                                                           // 1
                                                                                                                      //
express = Npm.require('express');                                                                                     // 1
                                                                                                                      //
OAuth2Server = (function() {                                                                                          // 1
  function OAuth2Server(config) {                                                                                     // 9
    this.config = config != null ? config : {};                                                                       // 10
    this.app = express();                                                                                             // 10
    this.routes = express();                                                                                          // 10
    this.model = new Model(this.config);                                                                              // 10
    this.oauth = oauthserver({                                                                                        // 10
      model: this.model,                                                                                              // 17
      grants: ['authorization_code', 'refresh_token'],                                                                // 17
      debug: this.config.debug                                                                                        // 17
    });                                                                                                               //
    this.publishAuhorizedClients();                                                                                   // 10
    this.initRoutes();                                                                                                // 10
    return this;                                                                                                      // 24
  }                                                                                                                   //
                                                                                                                      //
  OAuth2Server.prototype.publishAuhorizedClients = function() {                                                       // 9
    return Meteor.publish('authorizedOAuth', function() {                                                             //
      if (this.userId == null) {                                                                                      // 29
        return this.ready();                                                                                          // 30
      }                                                                                                               //
      return Meteor.users.find({                                                                                      // 32
        _id: this.userId                                                                                              // 33
      }, {                                                                                                            //
        fields: {                                                                                                     // 35
          'oauth.athorizedClients': 1                                                                                 // 36
        }                                                                                                             //
      });                                                                                                             //
      return typeof user !== "undefined" && user !== null;                                                            // 38
    });                                                                                                               //
  };                                                                                                                  //
                                                                                                                      //
  OAuth2Server.prototype.initRoutes = function() {                                                                    // 9
    var debugMiddleware, self;                                                                                        // 42
    self = this;                                                                                                      // 42
    debugMiddleware = function(req, res, next) {                                                                      // 42
      if (self.config.debug === true) {                                                                               // 44
        console.log('[OAuth2Server]', req.method, req.url);                                                           // 45
      }                                                                                                               //
      return next();                                                                                                  //
    };                                                                                                                //
    this.app.all('/oauth/token', debugMiddleware, this.oauth.grant());                                                // 42
    this.app.get('/oauth/authorize', debugMiddleware, Meteor.bindEnvironment(function(req, res, next) {               // 42
      var client;                                                                                                     // 51
      client = self.model.Clients.findOne({                                                                           // 51
        active: true,                                                                                                 // 51
        clientId: req.query.client_id                                                                                 // 51
      });                                                                                                             //
      if (client == null) {                                                                                           // 52
        return res.redirect('/oauth/error/404');                                                                      // 53
      }                                                                                                               //
      if (client.redirectUri !== req.query.redirect_uri) {                                                            // 55
        return res.redirect('/oauth/error/invalid_redirect_uri');                                                     // 56
      }                                                                                                               //
      return next();                                                                                                  //
    }));                                                                                                              //
    this.app.post('/oauth/authorize', debugMiddleware, Meteor.bindEnvironment(function(req, res, next) {              // 42
      var user;                                                                                                       // 61
      if (req.body.token == null) {                                                                                   // 61
        return res.sendStatus(401).send('No token');                                                                  // 62
      }                                                                                                               //
      user = Meteor.users.findOne({                                                                                   // 61
        'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(req.body.token)                           // 65
      });                                                                                                             //
      if (user == null) {                                                                                             // 67
        return res.sendStatus(401).send('Invalid token');                                                             // 68
      }                                                                                                               //
      req.user = {                                                                                                    // 61
        id: user._id                                                                                                  // 71
      };                                                                                                              //
      return next();                                                                                                  //
    }));                                                                                                              //
    this.app.post('/oauth/authorize', debugMiddleware, this.oauth.authCodeGrant(function(req, next) {                 // 42
      if (req.body.allow === 'yes') {                                                                                 // 77
        Meteor.users.update(req.user.id, {                                                                            // 78
          $addToSet: {                                                                                                // 78
            'oauth.athorizedClients': this.clientId                                                                   // 78
          }                                                                                                           //
        });                                                                                                           //
      }                                                                                                               //
      return next(null, req.body.allow === 'yes', req.user);                                                          //
    }));                                                                                                              //
    this.app.use(this.routes);                                                                                        // 42
    return this.app.all('/oauth/*', this.oauth.errorHandler());                                                       //
  };                                                                                                                  //
                                                                                                                      //
  return OAuth2Server;                                                                                                //
                                                                                                                      //
})();                                                                                                                 //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:oauth2-server'] = {
  OAuth2Server: OAuth2Server
};

})();

//# sourceMappingURL=rocketchat_oauth2-server.js.map
