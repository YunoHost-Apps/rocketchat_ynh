(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;

/* Package-scope variables */
var MeteorDeveloperAccounts;

(function(){

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/meteor-developer/meteor_developer_common.js                          //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
MeteorDeveloperAccounts = {};                                                    // 1
                                                                                 // 2
MeteorDeveloperAccounts._server = "https://www.meteor.com";                      // 3
                                                                                 // 4
// Options are:                                                                  // 5
//  - developerAccountsServer: defaults to "https://www.meteor.com"              // 6
MeteorDeveloperAccounts._config = function (options) {                           // 7
  if (options.developerAccountsServer) {                                         // 8
    MeteorDeveloperAccounts._server = options.developerAccountsServer;           // 9
  }                                                                              // 10
};                                                                               // 11
                                                                                 // 12
///////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/meteor-developer/meteor_developer_server.js                          //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
OAuth.registerService("meteor-developer", 2, null, function (query) {            // 1
  var response = getTokens(query);                                               // 2
  var accessToken = response.accessToken;                                        // 3
  var identity = getIdentity(accessToken);                                       // 4
                                                                                 // 5
  var serviceData = {                                                            // 6
    accessToken: OAuth.sealSecret(accessToken),                                  // 7
    expiresAt: (+new Date) + (1000 * response.expiresIn)                         // 8
  };                                                                             // 9
                                                                                 // 10
  _.extend(serviceData, identity);                                               // 11
                                                                                 // 12
  // only set the token in serviceData if it's there. this ensures               // 13
  // that we don't lose old ones (since we only get this on the first            // 14
  // log in attempt)                                                             // 15
  if (response.refreshToken)                                                     // 16
    serviceData.refreshToken = OAuth.sealSecret(response.refreshToken);          // 17
                                                                                 // 18
  return {                                                                       // 19
    serviceData: serviceData,                                                    // 20
    options: {profile: {name: serviceData.username}}                             // 21
    // XXX use username for name until meteor accounts has a profile with a name
  };                                                                             // 23
});                                                                              // 24
                                                                                 // 25
// returns an object containing:                                                 // 26
// - accessToken                                                                 // 27
// - expiresIn: lifetime of token in seconds                                     // 28
// - refreshToken, if this is the first authorization request and we got a       // 29
//   refresh token from the server                                               // 30
var getTokens = function (query) {                                               // 31
  var config = ServiceConfiguration.configurations.findOne({                     // 32
    service: 'meteor-developer'                                                  // 33
  });                                                                            // 34
  if (!config)                                                                   // 35
    throw new ServiceConfiguration.ConfigError();                                // 36
                                                                                 // 37
  var response;                                                                  // 38
  try {                                                                          // 39
    response = HTTP.post(                                                        // 40
      MeteorDeveloperAccounts._server + "/oauth2/token", {                       // 41
        params: {                                                                // 42
          grant_type: "authorization_code",                                      // 43
          code: query.code,                                                      // 44
          client_id: config.clientId,                                            // 45
          client_secret: OAuth.openSecret(config.secret),                        // 46
          redirect_uri: OAuth._redirectUri('meteor-developer', config)           // 47
        }                                                                        // 48
      }                                                                          // 49
    );                                                                           // 50
  } catch (err) {                                                                // 51
    throw _.extend(                                                              // 52
      new Error(                                                                 // 53
        "Failed to complete OAuth handshake with Meteor developer accounts. "    // 54
          + err.message                                                          // 55
      ),                                                                         // 56
      {response: err.response}                                                   // 57
    );                                                                           // 58
  }                                                                              // 59
                                                                                 // 60
  if (! response.data || response.data.error) {                                  // 61
    // if the http response was a json object with an error attribute            // 62
    throw new Error(                                                             // 63
      "Failed to complete OAuth handshake with Meteor developer accounts. " +    // 64
        (response.data ? response.data.error :                                   // 65
         "No response data")                                                     // 66
    );                                                                           // 67
  } else {                                                                       // 68
    return {                                                                     // 69
      accessToken: response.data.access_token,                                   // 70
      refreshToken: response.data.refresh_token,                                 // 71
      expiresIn: response.data.expires_in                                        // 72
    };                                                                           // 73
  }                                                                              // 74
};                                                                               // 75
                                                                                 // 76
var getIdentity = function (accessToken) {                                       // 77
  try {                                                                          // 78
    return HTTP.get(                                                             // 79
      MeteorDeveloperAccounts._server + "/api/v1/identity",                      // 80
      {                                                                          // 81
        headers: { Authorization: "Bearer " + accessToken }                      // 82
      }                                                                          // 83
    ).data;                                                                      // 84
  } catch (err) {                                                                // 85
    throw _.extend(                                                              // 86
      new Error("Failed to fetch identity from Meteor developer accounts. " +    // 87
                err.message),                                                    // 88
      {response: err.response}                                                   // 89
    );                                                                           // 90
  }                                                                              // 91
};                                                                               // 92
                                                                                 // 93
MeteorDeveloperAccounts.retrieveCredential = function (credentialToken,          // 94
                                                       credentialSecret) {       // 95
  return OAuth.retrieveCredential(credentialToken, credentialSecret);            // 96
};                                                                               // 97
                                                                                 // 98
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteor-developer'] = {
  MeteorDeveloperAccounts: MeteorDeveloperAccounts
};

})();

//# sourceMappingURL=meteor-developer.js.map
