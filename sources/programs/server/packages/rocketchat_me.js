(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_me/me.coffee.js                               //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                     // 1
/*                                                                   // 1
 * Me is a named function that will replace /me commands             //
 * @param {Object} message - The message object                      //
 */                                                                  //
var Me;                                                              // 1
                                                                     //
Me = (function() {                                                   // 1
  function Me(command, params, item) {                               // 7
    var msg;                                                         // 8
    if (command === "me") {                                          // 8
      if (_.trim(params)) {                                          // 9
        msg = item;                                                  // 10
        msg.msg = '_' + params + '_';                                // 10
        Meteor.call('sendMessage', msg);                             // 10
      }                                                              //
    }                                                                //
  }                                                                  //
                                                                     //
  return Me;                                                         //
                                                                     //
})();                                                                //
                                                                     //
RocketChat.slashCommands.add('me', Me, {                             // 1
  description: 'Displays_action_text',                               // 15
  params: 'your message'                                             // 15
});                                                                  //
                                                                     //
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:me'] = {};

})();

//# sourceMappingURL=rocketchat_me.js.map
