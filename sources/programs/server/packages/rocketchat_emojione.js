(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var emojione = Package['emojione:emojione'].emojione;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var renderMessageBody = Package['rocketchat:ui-message'].renderMessageBody;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ECMAScript = Package.ecmascript.ECMAScript;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_emojione/emojione.coffee.js                                                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                                // 1
/*                                                                                                              // 1
 * Emojione is a named function that will replace emojis                                                        //
 * @param {Object} message - The message object                                                                 //
 */                                                                                                             //
var Emojione;                                                                                                   // 1
                                                                                                                //
Emojione = (function() {                                                                                        // 1
  function Emojione(message) {                                                                                  // 7
    if (_.trim(message.html)) {                                                                                 // 8
      message.html = emojione.toImage(message.html);                                                            // 9
    }                                                                                                           //
    return message;                                                                                             // 11
  }                                                                                                             //
                                                                                                                //
  return Emojione;                                                                                              //
                                                                                                                //
})();                                                                                                           //
                                                                                                                //
RocketChat.callbacks.add('renderMessage', Emojione, RocketChat.callbacks.priority.LOW, 'emoji');                // 1
                                                                                                                //
if (Meteor.isClient) {                                                                                          // 15
  Meteor.startup(function() {                                                                                   // 16
    return Tracker.autorun(function() {                                                                         //
      var ref, ref1, ref2, ref3, ref4, ref5;                                                                    // 18
      if (((ref = Meteor.user()) != null ? (ref1 = ref.settings) != null ? (ref2 = ref1.preferences) != null ? ref2.useEmojis : void 0 : void 0 : void 0) || (((ref3 = Meteor.user()) != null ? (ref4 = ref3.settings) != null ? (ref5 = ref4.preferences) != null ? ref5.useEmojis : void 0 : void 0 : void 0) == null)) {
        return RocketChat.callbacks.add('renderMessage', Emojione, RocketChat.callbacks.priority.LOW, 'emoji');
      } else {                                                                                                  //
        return RocketChat.callbacks.remove('renderMessage', 'emoji');                                           //
      }                                                                                                         //
    });                                                                                                         //
  });                                                                                                           //
}                                                                                                               //
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_emojione/loadStylesheet.js                                                               //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
RocketChat.theme.addPackageAsset(function () {                                                                  // 1
	return Assets.getText('emojiPicker.less');                                                                     // 2
});                                                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:emojione'] = {};

})();

//# sourceMappingURL=rocketchat_emojione.js.map
