(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var LinkedIn = Package['pauli:linkedin'].LinkedIn;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/pauli_accounts-linkedin/linkedin_common.js                                     //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
// v0.6.5                                                                                  // 1
Accounts.oauth.registerService('linkedin');                                                // 2
                                                                                           // 3
if (!Accounts.linkedin) {                                                                  // 4
  Accounts.linkedin = {};                                                                  // 5
}                                                                                          // 6
                                                                                           // 7
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/pauli_accounts-linkedin/linkedin_server.js                                     //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
// v0.6.5                                                                                  // 1
// Accounts.oauth.registerService('linkedin');                                             // 2
                                                                                           // 3
Accounts.addAutopublishFields({                                                            // 4
  // publish all fields including access token, which can legitimately                     // 5
  // be used from the client (if transmitted over ssl or on                                // 6
  // localhost). https://developer.linkedin.com/documents/authentication                   // 7
  forLoggedInUser: ['services.linkedin'],                                                  // 8
  // forOtherUsers: [                                                                      // 9
  //   'services.linkedin.id', 'services.linkedin.firstName', 'services.linkedin.lastName'
  // ]                                                                                     // 11
});                                                                                        // 12
                                                                                           // 13
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['pauli:accounts-linkedin'] = {};

})();

//# sourceMappingURL=pauli_accounts-linkedin.js.map
