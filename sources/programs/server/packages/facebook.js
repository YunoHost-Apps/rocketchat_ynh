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
var Facebook;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/facebook/facebook_server.js                                                           //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
Facebook = {};                                                                                    // 1
                                                                                                  // 2
var querystring = Npm.require('querystring');                                                     // 3
                                                                                                  // 4
                                                                                                  // 5
OAuth.registerService('facebook', 2, null, function(query) {                                      // 6
                                                                                                  // 7
  var response = getTokenResponse(query);                                                         // 8
  var accessToken = response.accessToken;                                                         // 9
                                                                                                  // 10
  // include all fields from facebook                                                             // 11
  // http://developers.facebook.com/docs/reference/login/public-profile-and-friend-list/          // 12
  var whitelisted = ['id', 'email', 'name', 'first_name',                                         // 13
      'last_name', 'link', 'gender', 'locale', 'age_range'];                                      // 14
                                                                                                  // 15
  var identity = getIdentity(accessToken, whitelisted);                                           // 16
                                                                                                  // 17
  var serviceData = {                                                                             // 18
    accessToken: accessToken,                                                                     // 19
    expiresAt: (+new Date) + (1000 * response.expiresIn)                                          // 20
  };                                                                                              // 21
                                                                                                  // 22
                                                                                                  // 23
  var fields = _.pick(identity, whitelisted);                                                     // 24
  _.extend(serviceData, fields);                                                                  // 25
                                                                                                  // 26
  return {                                                                                        // 27
    serviceData: serviceData,                                                                     // 28
    options: {profile: {name: identity.name}}                                                     // 29
  };                                                                                              // 30
});                                                                                               // 31
                                                                                                  // 32
// checks whether a string parses as JSON                                                         // 33
var isJSON = function (str) {                                                                     // 34
  try {                                                                                           // 35
    JSON.parse(str);                                                                              // 36
    return true;                                                                                  // 37
  } catch (e) {                                                                                   // 38
    return false;                                                                                 // 39
  }                                                                                               // 40
};                                                                                                // 41
                                                                                                  // 42
// returns an object containing:                                                                  // 43
// - accessToken                                                                                  // 44
// - expiresIn: lifetime of token in seconds                                                      // 45
var getTokenResponse = function (query) {                                                         // 46
  var config = ServiceConfiguration.configurations.findOne({service: 'facebook'});                // 47
  if (!config)                                                                                    // 48
    throw new ServiceConfiguration.ConfigError();                                                 // 49
                                                                                                  // 50
  var responseContent;                                                                            // 51
  try {                                                                                           // 52
    // Request an access token                                                                    // 53
    responseContent = HTTP.get(                                                                   // 54
      "https://graph.facebook.com/v2.2/oauth/access_token", {                                     // 55
        params: {                                                                                 // 56
          client_id: config.appId,                                                                // 57
          redirect_uri: OAuth._redirectUri('facebook', config),                                   // 58
          client_secret: OAuth.openSecret(config.secret),                                         // 59
          code: query.code                                                                        // 60
        }                                                                                         // 61
      }).content;                                                                                 // 62
  } catch (err) {                                                                                 // 63
    throw _.extend(new Error("Failed to complete OAuth handshake with Facebook. " + err.message),
                   {response: err.response});                                                     // 65
  }                                                                                               // 66
                                                                                                  // 67
  // If 'responseContent' parses as JSON, it is an error.                                         // 68
  // XXX which facebook error causes this behvaior?                                               // 69
  if (isJSON(responseContent)) {                                                                  // 70
    throw new Error("Failed to complete OAuth handshake with Facebook. " + responseContent);      // 71
  }                                                                                               // 72
                                                                                                  // 73
  // Success!  Extract the facebook access token and expiration                                   // 74
  // time from the response                                                                       // 75
  var parsedResponse = querystring.parse(responseContent);                                        // 76
  var fbAccessToken = parsedResponse.access_token;                                                // 77
  var fbExpires = parsedResponse.expires;                                                         // 78
                                                                                                  // 79
  if (!fbAccessToken) {                                                                           // 80
    throw new Error("Failed to complete OAuth handshake with facebook " +                         // 81
                    "-- can't find access token in HTTP response. " + responseContent);           // 82
  }                                                                                               // 83
  return {                                                                                        // 84
    accessToken: fbAccessToken,                                                                   // 85
    expiresIn: fbExpires                                                                          // 86
  };                                                                                              // 87
};                                                                                                // 88
                                                                                                  // 89
var getIdentity = function (accessToken, fields) {                                                // 90
  try {                                                                                           // 91
    return HTTP.get("https://graph.facebook.com/v2.4/me", {                                       // 92
      params: {                                                                                   // 93
        access_token: accessToken,                                                                // 94
        fields: fields                                                                            // 95
      }                                                                                           // 96
    }).data;                                                                                      // 97
  } catch (err) {                                                                                 // 98
    throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),           // 99
                   {response: err.response});                                                     // 100
  }                                                                                               // 101
};                                                                                                // 102
                                                                                                  // 103
Facebook.retrieveCredential = function(credentialToken, credentialSecret) {                       // 104
  return OAuth.retrieveCredential(credentialToken, credentialSecret);                             // 105
};                                                                                                // 106
                                                                                                  // 107
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.facebook = {
  Facebook: Facebook
};

})();

//# sourceMappingURL=facebook.js.map
