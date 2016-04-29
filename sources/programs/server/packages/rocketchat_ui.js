(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Push = Package['raix:push'].Push;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                 //
// packages/rocketchat_ui/lib/getAvatarUrlFromUsername.coffee.js                                   //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.getAvatarUrlFromUsername = function(username) {                                               // 1
  var key, path, random;                                                                           // 2
  key = "avatar_random_" + username;                                                               // 2
  random = (typeof Session !== "undefined" && Session !== null ? Session.keys[key] : void 0) || 0;
  if (username == null) {                                                                          // 4
    return;                                                                                        // 5
  }                                                                                                //
  if (Meteor.isCordova) {                                                                          // 6
    path = Meteor.absoluteUrl().replace(/\/$/, '');                                                // 7
  } else {                                                                                         //
    path = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '';                                   // 9
  }                                                                                                //
  return path + "/avatar/" + (encodeURIComponent(username)) + ".jpg?_dc=" + random;                //
};                                                                                                 // 1
                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:ui'] = {};

})();

//# sourceMappingURL=rocketchat_ui.js.map
