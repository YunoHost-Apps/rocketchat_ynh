(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var s = Package['underscorestring:underscore.string'].s;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;

/* Package-scope variables */
var __coffeescriptShare, CustomOAuth;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// packages/rocketchat_custom-oauth/custom_oauth_server.coffee.js                              //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Services;                                                                                  // 1
                                                                                               //
Services = {};                                                                                 // 1
                                                                                               //
CustomOAuth = (function() {                                                                    // 1
  function CustomOAuth(name, options) {                                                        // 4
    this.name = name;                                                                          // 5
    if (!Match.test(this.name, String)) {                                                      // 5
      throw new Meteor.Error('CustomOAuth: Name is required and must be String');              // 6
    }                                                                                          //
    if (Services[this.name] != null) {                                                         // 8
      Services[this.name].configure(options);                                                  // 9
      return;                                                                                  // 10
    }                                                                                          //
    Services[this.name] = this;                                                                // 5
    this.configure(options);                                                                   // 5
    this.userAgent = "Meteor";                                                                 // 5
    if (Meteor.release) {                                                                      // 17
      this.userAgent += '/' + Meteor.release;                                                  // 18
    }                                                                                          //
    Accounts.oauth.registerService(this.name);                                                 // 5
    this.registerService();                                                                    // 5
  }                                                                                            //
                                                                                               //
  CustomOAuth.prototype.configure = function(options) {                                        // 4
    if (!Match.test(options, Object)) {                                                        // 24
      throw new Meteor.Error('CustomOAuth: Options is required and must be Object');           // 25
    }                                                                                          //
    if (!Match.test(options.serverURL, String)) {                                              // 27
      throw new Meteor.Error('CustomOAuth: Options.serverURL is required and must be String');
    }                                                                                          //
    if (!Match.test(options.tokenPath, String)) {                                              // 30
      options.tokenPath = '/oauth/token';                                                      // 31
    }                                                                                          //
    if (!Match.test(options.identityPath, String)) {                                           // 33
      options.identityPath = '/me';                                                            // 34
    }                                                                                          //
    this.serverURL = options.serverURL;                                                        // 24
    this.tokenPath = options.tokenPath;                                                        // 24
    this.identityPath = options.identityPath;                                                  // 24
    this.tokenSentVia = options.tokenSentVia;                                                  // 24
    if (!/^https?:\/\/.+/.test(this.tokenPath)) {                                              // 41
      this.tokenPath = this.serverURL + this.tokenPath;                                        // 42
    }                                                                                          //
    if (!/^https?:\/\/.+/.test(this.identityPath)) {                                           // 44
      this.identityPath = this.serverURL + this.identityPath;                                  // 45
    }                                                                                          //
    if (Match.test(options.addAutopublishFields, Object)) {                                    // 47
      return Accounts.addAutopublishFields(options.addAutopublishFields);                      //
    }                                                                                          //
  };                                                                                           //
                                                                                               //
  CustomOAuth.prototype.getAccessToken = function(query) {                                     // 4
    var config, err, error, response;                                                          // 51
    config = ServiceConfiguration.configurations.findOne({                                     // 51
      service: this.name                                                                       // 51
    });                                                                                        //
    if (config == null) {                                                                      // 52
      throw new ServiceConfiguration.ConfigError();                                            // 53
    }                                                                                          //
    response = void 0;                                                                         // 51
    try {                                                                                      // 56
      response = HTTP.post(this.tokenPath, {                                                   // 57
        auth: config.clientId + ':' + OAuth.openSecret(config.secret),                         // 58
        headers: {                                                                             // 58
          Accept: 'application/json',                                                          // 60
          'User-Agent': this.userAgent                                                         // 60
        },                                                                                     //
        params: {                                                                              // 58
          code: query.code,                                                                    // 63
          client_id: config.clientId,                                                          // 63
          client_secret: OAuth.openSecret(config.secret),                                      // 63
          redirect_uri: OAuth._redirectUri(this.name, config),                                 // 63
          grant_type: 'authorization_code',                                                    // 63
          state: query.state                                                                   // 63
        }                                                                                      //
      });                                                                                      //
    } catch (_error) {                                                                         //
      err = _error;                                                                            // 71
      error = new Error(("Failed to complete OAuth handshake with " + this.name + " at " + this.tokenPath + ". ") + err.message);
      throw _.extend(error, {                                                                  // 72
        response: err.response                                                                 // 72
      });                                                                                      //
    }                                                                                          //
    if (response.data.error) {                                                                 // 74
      throw new Error(("Failed to complete OAuth handshake with " + this.name + " at " + this.tokenPath + ". ") + response.data.error);
    } else {                                                                                   //
      return response.data.access_token;                                                       // 77
    }                                                                                          //
  };                                                                                           //
                                                                                               //
  CustomOAuth.prototype.getIdentity = function(accessToken) {                                  // 4
    var err, error, headers, params, response;                                                 // 80
    params = {};                                                                               // 80
    headers = {                                                                                // 80
      'User-Agent': this.userAgent                                                             // 82
    };                                                                                         //
    if (this.tokenSentVia === 'header') {                                                      // 84
      headers['Authorization'] = 'Bearer ' + accessToken;                                      // 85
    } else {                                                                                   //
      params['access_token'] = accessToken;                                                    // 87
    }                                                                                          //
    try {                                                                                      // 89
      response = HTTP.get(this.identityPath, {                                                 // 90
        headers: headers,                                                                      // 91
        params: params                                                                         // 91
      });                                                                                      //
      if (response.data) {                                                                     // 94
        return response.data;                                                                  // 95
      } else {                                                                                 //
        return JSON.parse(response.content);                                                   // 97
      }                                                                                        //
    } catch (_error) {                                                                         //
      err = _error;                                                                            // 100
      error = new Error(("Failed to fetch identity from " + this.name + " at " + this.identityPath + ". ") + err.message);
      throw _.extend(error, {                                                                  // 101
        response: err.response                                                                 // 101
      });                                                                                      //
    }                                                                                          //
  };                                                                                           //
                                                                                               //
  CustomOAuth.prototype.registerService = function() {                                         // 4
    var self;                                                                                  // 104
    self = this;                                                                               // 104
    return OAuth.registerService(this.name, 2, null, function(query) {                         //
      var accessToken, data, identity, serviceData;                                            // 106
      accessToken = self.getAccessToken(query);                                                // 106
      console.log('at:', accessToken);                                                         // 106
      identity = self.getIdentity(accessToken);                                                // 106
      if (identity != null ? identity.result : void 0) {                                       // 112
        identity = identity.result;                                                            // 113
      }                                                                                        //
      if ((identity != null ? identity.ID : void 0) && !identity.id) {                         // 116
        identity.id = identity.ID;                                                             // 117
      }                                                                                        //
      if ((identity != null ? identity.user_id : void 0) && !identity.id) {                    // 120
        identity.id = identity.user_id;                                                        // 121
      }                                                                                        //
      console.log('id:', JSON.stringify(identity, null, '  '));                                // 106
      serviceData = {                                                                          // 106
        _OAuthCustom: true,                                                                    // 126
        accessToken: accessToken                                                               // 126
      };                                                                                       //
      _.extend(serviceData, identity);                                                         // 106
      data = {                                                                                 // 106
        serviceData: serviceData,                                                              // 132
        options: {                                                                             // 132
          profile: {                                                                           // 134
            name: identity.name || identity.username || identity.nickname                      // 135
          }                                                                                    //
        }                                                                                      //
      };                                                                                       //
      console.log(data);                                                                       // 106
      return data;                                                                             // 139
    });                                                                                        //
  };                                                                                           //
                                                                                               //
  CustomOAuth.prototype.retrieveCredential = function(credentialToken, credentialSecret) {     // 4
    return OAuth.retrieveCredential(credentialToken, credentialSecret);                        // 142
  };                                                                                           //
                                                                                               //
  return CustomOAuth;                                                                          //
                                                                                               //
})();                                                                                          //
                                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:custom-oauth'] = {
  CustomOAuth: CustomOAuth
};

})();

//# sourceMappingURL=rocketchat_custom-oauth.js.map
