(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// packages/rocketchat_autolinker/settings.coffee.js                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                            // 1
  RocketChat.settings.add('AutoLinker_StripPrefix', false, {           // 2
    type: 'boolean',                                                   // 2
    group: 'Message',                                                  // 2
    section: 'AutoLinker',                                             // 2
    "public": true,                                                    // 2
    i18nDescription: 'AutoLinker_StripPrefix_Description'              // 2
  });                                                                  //
  RocketChat.settings.add('AutoLinker_Urls', true, {                   // 2
    type: 'boolean',                                                   // 3
    group: 'Message',                                                  // 3
    section: 'AutoLinker',                                             // 3
    "public": true                                                     // 3
  });                                                                  //
  RocketChat.settings.add('AutoLinker_UrlsRegExp', '(://|www\\.).+', {
    type: 'string',                                                    // 4
    group: 'Message',                                                  // 4
    section: 'AutoLinker',                                             // 4
    "public": true                                                     // 4
  });                                                                  //
  RocketChat.settings.add('AutoLinker_Email', true, {                  // 2
    type: 'boolean',                                                   // 5
    group: 'Message',                                                  // 5
    section: 'AutoLinker',                                             // 5
    "public": true                                                     // 5
  });                                                                  //
  return RocketChat.settings.add('AutoLinker_Phone', true, {           //
    type: 'boolean',                                                   // 6
    group: 'Message',                                                  // 6
    section: 'AutoLinker',                                             // 6
    "public": true,                                                    // 6
    i18nDescription: 'AutoLinker_Phone_Description'                    // 6
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:autolinker'] = {};

})();

//# sourceMappingURL=rocketchat_autolinker.js.map
