(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/lib/cordova/facebook-login.coffee.js                         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var getIdentity;                                                       // 1
                                                                       //
Accounts.registerLoginHandler(function(loginRequest) {                 // 1
  var fields, identity, options, profileFields, serviceData, whitelisted;
  if (!loginRequest.cordova) {                                         // 2
    return void 0;                                                     // 3
  }                                                                    //
  loginRequest = loginRequest.authResponse;                            // 2
  identity = getIdentity(loginRequest.accessToken);                    // 2
  serviceData = {                                                      // 2
    accessToken: loginRequest.accessToken,                             // 9
    expiresAt: (+(new Date)) + (1000 * loginRequest.expiresIn)         // 9
  };                                                                   //
  whitelisted = ['id', 'email', 'name', 'first_name', 'last_name', 'link', 'username', 'gender', 'locale', 'age_range'];
  fields = _.pick(identity, whitelisted);                              // 2
  _.extend(serviceData, fields);                                       // 2
  options = {                                                          // 2
    profile: {}                                                        // 17
  };                                                                   //
  profileFields = _.pick(identity, whitelisted);                       // 2
  _.extend(options.profile, profileFields);                            // 2
  return Accounts.updateOrCreateUserFromExternalService("facebook", serviceData, options);
});                                                                    // 1
                                                                       //
getIdentity = function(accessToken) {                                  // 1
  var err;                                                             // 25
  try {                                                                // 25
    return HTTP.get("https://graph.facebook.com/me", {                 // 26
      params: {                                                        // 26
        access_token: accessToken                                      // 26
      }                                                                //
    }).data;                                                           //
  } catch (_error) {                                                   //
    err = _error;                                                      // 29
    throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message), {
      response: err.response                                           // 29
    });                                                                //
  }                                                                    //
};                                                                     // 24
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=facebook-login.coffee.js.map
