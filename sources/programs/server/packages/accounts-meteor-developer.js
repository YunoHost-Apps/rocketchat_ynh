(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Random = Package.random.Random;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var MeteorDeveloperAccounts = Package['meteor-developer'].MeteorDeveloperAccounts;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/accounts-meteor-developer/meteor-developer.js                                  //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
Accounts.oauth.registerService("meteor-developer");                                        // 1
                                                                                           // 2
if (Meteor.isClient) {                                                                     // 3
  Meteor.loginWithMeteorDeveloperAccount = function (options, callback) {                  // 4
    // support a callback without options                                                  // 5
    if (! callback && typeof options === "function") {                                     // 6
      callback = options;                                                                  // 7
      options = null;                                                                      // 8
    }                                                                                      // 9
                                                                                           // 10
    var credentialRequestCompleteCallback =                                                // 11
          Accounts.oauth.credentialRequestCompleteHandler(callback);                       // 12
    MeteorDeveloperAccounts.requestCredential(options, credentialRequestCompleteCallback);
  };                                                                                       // 14
} else {                                                                                   // 15
  Accounts.addAutopublishFields({                                                          // 16
    // publish all fields including access token, which can legitimately be used           // 17
    // from the client (if transmitted over ssl or on localhost).                          // 18
    forLoggedInUser: ['services.meteor-developer'],                                        // 19
    forOtherUsers: [                                                                       // 20
      'services.meteor-developer.username',                                                // 21
      'services.meteor-developer.profile',                                                 // 22
      'services.meteor-developer.id'                                                       // 23
    ]                                                                                      // 24
  });                                                                                      // 25
}                                                                                          // 26
                                                                                           // 27
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-meteor-developer'] = {};

})();

//# sourceMappingURL=accounts-meteor-developer.js.map
