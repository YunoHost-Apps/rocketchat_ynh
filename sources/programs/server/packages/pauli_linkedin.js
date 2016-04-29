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
var LinkedIn;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/pauli_linkedin/linkedin_common.js                                                //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
if (typeof LinkedIn === 'undefined') {                                                       // 1
  LinkedIn = {};                                                                             // 2
}                                                                                            // 3
                                                                                             // 4
///////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/pauli_linkedin/linkedin_server.js                                                //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
var OAuth = Package.oauth.OAuth;                                                             // 1
                                                                                             // 2
OAuth.registerService('linkedin', 2, null, function(query) {                                 // 3
                                                                                             // 4
  var response = getTokenResponse(query);                                                    // 5
  var accessToken = response.accessToken;                                                    // 6
  var identity = getIdentity(accessToken);                                                   // 7
                                                                                             // 8
  var id = identity.id;                                                                      // 9
  if (!id) {                                                                                 // 10
    throw new Error("LinkedIn did not provide an id");                                       // 11
  }                                                                                          // 12
  var serviceData = {                                                                        // 13
    id: id,                                                                                  // 14
    accessToken: accessToken,                                                                // 15
    expiresAt: (+new Date) + (1000 * response.expiresIn)                                     // 16
  };                                                                                         // 17
                                                                                             // 18
  var whiteListed = ['firstName', 'headline', 'lastName'];                                   // 19
                                                                                             // 20
  // include all fields from linkedin                                                        // 21
  // https://developer.linkedin.com/documents/authentication                                 // 22
  var fields = _.pick(identity, whiteListed);                                                // 23
                                                                                             // 24
  // list of extra fields                                                                    // 25
  // http://developer.linkedin.com/documents/profile-fields                                  // 26
  var extraFields = 'email-address,location:(name),num-connections,picture-url,public-profile-url,skills,languages,three-current-positions,recommendations-received';
                                                                                             // 28
  // remove the whitespaces which could break the request                                    // 29
  extraFields = extraFields.replace(/\s+/g, '');                                             // 30
                                                                                             // 31
  fields = getExtraData(accessToken, extraFields, fields);                                   // 32
                                                                                             // 33
  _.extend(serviceData, fields);                                                             // 34
                                                                                             // 35
  return {                                                                                   // 36
    serviceData: serviceData,                                                                // 37
    options: {                                                                               // 38
      profile: fields                                                                        // 39
    }                                                                                        // 40
  };                                                                                         // 41
});                                                                                          // 42
                                                                                             // 43
var getExtraData = function(accessToken, extraFields, fields) {                              // 44
  var url = 'https://api.linkedin.com/v1/people/~:(' + extraFields + ')';                    // 45
  var response = Meteor.http.get(url, {                                                      // 46
    params: {                                                                                // 47
      oauth2_access_token: accessToken,                                                      // 48
      format: 'json'                                                                         // 49
    }                                                                                        // 50
  }).data;                                                                                   // 51
  return _.extend(fields, response);                                                         // 52
}                                                                                            // 53
                                                                                             // 54
// checks whether a string parses as JSON                                                    // 55
var isJSON = function (str) {                                                                // 56
  try {                                                                                      // 57
    JSON.parse(str);                                                                         // 58
    return true;                                                                             // 59
  } catch (e) {                                                                              // 60
    return false;                                                                            // 61
  }                                                                                          // 62
}                                                                                            // 63
                                                                                             // 64
// returns an object containing:                                                             // 65
// - accessToken                                                                             // 66
// - expiresIn: lifetime of token in seconds                                                 // 67
var getTokenResponse = function (query) {                                                    // 68
  var config = ServiceConfiguration.configurations.findOne({service: 'linkedin'});           // 69
  if (!config)                                                                               // 70
    throw new ServiceConfiguration.ConfigError("Service not configured");                    // 71
                                                                                             // 72
  var responseContent;                                                                       // 73
  try {                                                                                      // 74
    //Request an access token                                                                // 75
    responseContent = Meteor.http.post(                                                      // 76
       "https://api.linkedin.com/uas/oauth2/accessToken", {                                  // 77
         params: {                                                                           // 78
           grant_type: 'authorization_code',                                                 // 79
           client_id: config.clientId,                                                       // 80
           client_secret: OAuth.openSecret(config.secret),                                   // 81
           code: query.code,                                                                 // 82
           redirect_uri: OAuth._redirectUri('linkedin', config)                              // 83
         }                                                                                   // 84
       }).content;                                                                           // 85
  } catch (err) {                                                                            // 86
    throw new Error("Failed to complete OAuth handshake with LinkedIn. " + err.message);     // 87
  }                                                                                          // 88
                                                                                             // 89
  // If 'responseContent' does not parse as JSON, it is an error.                            // 90
  if (!isJSON(responseContent)) {                                                            // 91
    throw new Error("Failed to complete OAuth handshake with LinkedIn. " + responseContent);
  }                                                                                          // 93
                                                                                             // 94
  // Success! Extract access token and expiration                                            // 95
  var parsedResponse = JSON.parse(responseContent);                                          // 96
  var accessToken = parsedResponse.access_token;                                             // 97
  var expiresIn = parsedResponse.expires_in;                                                 // 98
                                                                                             // 99
  if (!accessToken) {                                                                        // 100
    throw new Error("Failed to complete OAuth handshake with LinkedIn " +                    // 101
      "-- can't find access token in HTTP response. " + responseContent);                    // 102
  }                                                                                          // 103
                                                                                             // 104
  return {                                                                                   // 105
    accessToken: accessToken,                                                                // 106
    expiresIn: expiresIn                                                                     // 107
  };                                                                                         // 108
};                                                                                           // 109
                                                                                             // 110
var getIdentity = function (accessToken) {                                                   // 111
  try {                                                                                      // 112
    return Meteor.http.get("https://www.linkedin.com/v1/people/~", {                         // 113
      params: {oauth2_access_token: accessToken, format: 'json'}}).data;                     // 114
  } catch (err) {                                                                            // 115
    throw new Error("Failed to fetch identity from LinkedIn. " + err.message);               // 116
  }                                                                                          // 117
};                                                                                           // 118
                                                                                             // 119
LinkedIn.retrieveCredential = function(credentialToken, credentialSecret) {                  // 120
  return OAuth.retrieveCredential(credentialToken, credentialSecret);                        // 121
};                                                                                           // 122
                                                                                             // 123
///////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['pauli:linkedin'] = {
  LinkedIn: LinkedIn
};

})();

//# sourceMappingURL=pauli_linkedin.js.map
