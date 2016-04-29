(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var OAuth2Server = Package['rocketchat:oauth2-server'].OAuth2Server;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_oauth2-server-config/server/models/OAuthApps.coffee.js                                   //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                  //
                                                                                                                //
RocketChat.models.OAuthApps = new ((function(superClass) {                                                      // 1
  extend(_Class, superClass);                                                                                   // 2
                                                                                                                //
  function _Class() {                                                                                           // 2
    this._initModel('oauth_apps');                                                                              // 3
  }                                                                                                             //
                                                                                                                //
  return _Class;                                                                                                //
                                                                                                                //
})(RocketChat.models._Base));                                                                                   //
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_oauth2-server-config/oauth/server/oauth2-server.coffee.js                                //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var oauth2server;                                                                                               // 1
                                                                                                                //
oauth2server = new OAuth2Server({                                                                               // 1
  accessTokensCollectionName: 'rocketchat_oauth_access_tokens',                                                 // 2
  refreshTokensCollectionName: 'rocketchat_oauth_refresh_tokens',                                               // 2
  authCodesCollectionName: 'rocketchat_oauth_auth_codes',                                                       // 2
  clientsCollection: RocketChat.models.OAuthApps.model,                                                         // 2
  debug: true                                                                                                   // 2
});                                                                                                             //
                                                                                                                //
WebApp.connectHandlers.use(oauth2server.app);                                                                   // 1
                                                                                                                //
Meteor.publish('oauthClient', function(clientId) {                                                              // 1
  if (!this.userId) {                                                                                           // 13
    return this.ready();                                                                                        // 14
  }                                                                                                             //
  return RocketChat.models.OAuthApps.find({                                                                     // 16
    clientId: clientId,                                                                                         // 16
    active: true                                                                                                // 16
  }, {                                                                                                          //
    fields: {                                                                                                   // 17
      name: 1                                                                                                   // 18
    }                                                                                                           //
  });                                                                                                           //
});                                                                                                             // 12
                                                                                                                //
RocketChat.API.v1.addAuthMethod(function() {                                                                    // 1
  var accessToken, bearerToken, getAccessToken, getToken, headerToken, matches, user;                           // 22
  console.log(this.request.method, this.request.url);                                                           // 22
  headerToken = this.request.headers['authorization'];                                                          // 22
  getToken = this.request.query.access_token;                                                                   // 22
  if (headerToken != null) {                                                                                    // 27
    if (matches = headerToken.match(/Bearer\s(\S+)/)) {                                                         // 28
      headerToken = matches[1];                                                                                 // 29
    } else {                                                                                                    //
      headerToken = void 0;                                                                                     // 31
    }                                                                                                           //
  }                                                                                                             //
  bearerToken = headerToken || getToken;                                                                        // 22
  if (bearerToken == null) {                                                                                    // 35
    return;                                                                                                     // 37
  }                                                                                                             //
  getAccessToken = Meteor.wrapAsync(oauth2server.oauth.model.getAccessToken, oauth2server.oauth.model);         // 22
  accessToken = getAccessToken(bearerToken);                                                                    // 22
  if (accessToken == null) {                                                                                    // 44
    return;                                                                                                     // 46
  }                                                                                                             //
  if ((accessToken.expires != null) && accessToken.expires !== 0 && accessToken.expires < new Date()) {         // 48
    return;                                                                                                     // 50
  }                                                                                                             //
  user = RocketChat.models.Users.findOne(accessToken.userId);                                                   // 22
  if (user == null) {                                                                                           // 53
    return;                                                                                                     // 55
  }                                                                                                             //
  return {                                                                                                      // 57
    user: user                                                                                                  // 57
  };                                                                                                            //
});                                                                                                             // 21
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_oauth2-server-config/oauth/server/default-services.coffee.js                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (!RocketChat.models.OAuthApps.findOne('zapier')) {                                                           // 1
  RocketChat.models.OAuthApps.insert({                                                                          // 2
    _id: 'zapier',                                                                                              // 3
    name: 'Zapier',                                                                                             // 3
    active: false,                                                                                              // 3
    clientId: 'zapier',                                                                                         // 3
    clientSecret: 'RTK6TlndaCIolhQhZ7_KHIGOKj41RnlaOq_o-7JKwLr',                                                // 3
    redirectUri: 'https://zapier.com/dashboard/auth/oauth/return/AppIDAPI/',                                    // 3
    _createdAt: new Date,                                                                                       // 3
    _createdBy: {                                                                                               // 3
      _id: 'system',                                                                                            // 11
      username: 'system'                                                                                        // 11
    }                                                                                                           //
  });                                                                                                           //
}                                                                                                               //
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_oauth2-server-config/oauth/client/stylesheets/load.coffee.js                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.theme.addPackageAsset(function() {                                                                   // 1
  return Assets.getText('oauth/client/stylesheets/oauth2.less');                                                // 2
});                                                                                                             // 1
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_oauth2-server-config/admin/server/publications/oauthApps.coffee.js                       //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('oauthApps', function() {                                                                        // 1
  if (!this.userId) {                                                                                           // 2
    return this.ready();                                                                                        // 3
  }                                                                                                             //
  if (!RocketChat.authz.hasPermission(this.userId, 'manage-oauth-apps')) {                                      // 5
    throw new Meteor.Error("not-authorized");                                                                   // 6
  }                                                                                                             //
  return RocketChat.models.OAuthApps.find();                                                                    // 8
});                                                                                                             // 1
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_oauth2-server-config/admin/server/methods/addOAuthApp.coffee.js                          //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                // 1
  addOAuthApp: function(application) {                                                                          // 2
    if (!RocketChat.authz.hasPermission(this.userId, 'manage-oauth-apps')) {                                    // 3
      throw new Meteor.Error('not_authorized');                                                                 // 4
    }                                                                                                           //
    if (!_.isString(application.name)) {                                                                        // 6
      throw new Meteor.Error('invalid_name', '[methods] addOAuthApp -> name must be string');                   // 7
    }                                                                                                           //
    if (application.name.trim() === '') {                                                                       // 9
      throw new Meteor.Error('invalid_name', '[methods] addOAuthApp -> name can\'t be empty');                  // 10
    }                                                                                                           //
    if (!_.isString(application.redirectUri)) {                                                                 // 12
      throw new Meteor.Error('invalid_redirectUri', '[methods] addOAuthApp -> redirectUri must be string');     // 13
    }                                                                                                           //
    if (application.redirectUri.trim() === '') {                                                                // 15
      throw new Meteor.Error('invalid_redirectUri', '[methods] addOAuthApp -> redirectUri can\'t be empty');    // 16
    }                                                                                                           //
    if (!_.isBoolean(application.active)) {                                                                     // 18
      throw new Meteor.Error('invalid_active', '[methods] addOAuthApp -> active must be boolean');              // 19
    }                                                                                                           //
    application.clientId = Random.id();                                                                         // 3
    application.clientSecret = Random.secret();                                                                 // 3
    application._createdAt = new Date;                                                                          // 3
    application._createdBy = RocketChat.models.Users.findOne(this.userId, {                                     // 3
      fields: {                                                                                                 // 24
        username: 1                                                                                             // 24
      }                                                                                                         //
    });                                                                                                         //
    application._id = RocketChat.models.OAuthApps.insert(application);                                          // 3
    return application;                                                                                         // 28
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_oauth2-server-config/admin/server/methods/updateOAuthApp.coffee.js                       //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                // 1
  updateOAuthApp: function(applicationId, application) {                                                        // 2
    var currentApplication;                                                                                     // 3
    if (!RocketChat.authz.hasPermission(this.userId, 'manage-oauth-apps')) {                                    // 3
      throw new Meteor.Error('not_authorized');                                                                 // 4
    }                                                                                                           //
    if (!_.isString(application.name)) {                                                                        // 6
      throw new Meteor.Error('invalid_name', '[methods] updateOAuthApp -> name must be string');                // 7
    }                                                                                                           //
    if (application.name.trim() === '') {                                                                       // 9
      throw new Meteor.Error('invalid_name', '[methods] updateOAuthApp -> name can\'t be empty');               // 10
    }                                                                                                           //
    if (!_.isString(application.redirectUri)) {                                                                 // 12
      throw new Meteor.Error('invalid_redirectUri', '[methods] updateOAuthApp -> redirectUri must be string');  // 13
    }                                                                                                           //
    if (application.redirectUri.trim() === '') {                                                                // 15
      throw new Meteor.Error('invalid_redirectUri', '[methods] updateOAuthApp -> redirectUri can\'t be empty');
    }                                                                                                           //
    if (!_.isBoolean(application.active)) {                                                                     // 18
      throw new Meteor.Error('invalid_active', '[methods] updateOAuthApp -> active must be boolean');           // 19
    }                                                                                                           //
    currentApplication = RocketChat.models.OAuthApps.findOne(applicationId);                                    // 3
    if (currentApplication == null) {                                                                           // 22
      throw new Meteor.Error('invalid_application', '[methods] updateOAuthApp -> application not found');       // 23
    }                                                                                                           //
    RocketChat.models.OAuthApps.update(applicationId, {                                                         // 3
      $set: {                                                                                                   // 26
        name: application.name,                                                                                 // 27
        active: application.active,                                                                             // 27
        redirectUri: application.redirectUri,                                                                   // 27
        _updatedAt: new Date,                                                                                   // 27
        _updatedBy: RocketChat.models.Users.findOne(this.userId, {                                              // 27
          fields: {                                                                                             // 31
            username: 1                                                                                         // 31
          }                                                                                                     //
        })                                                                                                      //
      }                                                                                                         //
    });                                                                                                         //
    return RocketChat.models.OAuthApps.findOne(applicationId);                                                  // 33
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_oauth2-server-config/admin/server/methods/deleteOAuthApp.coffee.js                       //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                // 1
  deleteOAuthApp: function(applicationId) {                                                                     // 2
    var application;                                                                                            // 3
    if (!RocketChat.authz.hasPermission(this.userId, 'manage-oauth-apps')) {                                    // 3
      throw new Meteor.Error('not_authorized');                                                                 // 4
    }                                                                                                           //
    application = RocketChat.models.OAuthApps.findOne(applicationId);                                           // 3
    if (application == null) {                                                                                  // 8
      throw new Meteor.Error('invalid_application', '[methods] deleteOAuthApp -> application not found');       // 9
    }                                                                                                           //
    RocketChat.models.OAuthApps.remove({                                                                        // 3
      _id: applicationId                                                                                        // 11
    });                                                                                                         //
    return true;                                                                                                // 13
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:oauth2-server-config'] = {};

})();

//# sourceMappingURL=rocketchat_oauth2-server-config.js.map
