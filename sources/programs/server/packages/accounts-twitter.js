(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var Twitter = Package.twitter.Twitter;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/accounts-twitter/twitter.js                                                                //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
Accounts.oauth.registerService('twitter');                                                             // 1
                                                                                                       // 2
if (Meteor.isClient) {                                                                                 // 3
  Meteor.loginWithTwitter = function(options, callback) {                                              // 4
    // support a callback without options                                                              // 5
    if (! callback && typeof options === "function") {                                                 // 6
      callback = options;                                                                              // 7
      options = null;                                                                                  // 8
    }                                                                                                  // 9
                                                                                                       // 10
    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Twitter.requestCredential(options, credentialRequestCompleteCallback);                             // 12
  };                                                                                                   // 13
} else {                                                                                               // 14
  var autopublishedFields = _.map(                                                                     // 15
    // don't send access token. https://dev.twitter.com/discussions/5025                               // 16
    Twitter.whitelistedFields.concat(['id', 'screenName']),                                            // 17
    function (subfield) { return 'services.twitter.' + subfield; });                                   // 18
                                                                                                       // 19
  Accounts.addAutopublishFields({                                                                      // 20
    forLoggedInUser: autopublishedFields,                                                              // 21
    forOtherUsers: autopublishedFields                                                                 // 22
  });                                                                                                  // 23
}                                                                                                      // 24
                                                                                                       // 25
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-twitter'] = {};

})();

//# sourceMappingURL=accounts-twitter.js.map
