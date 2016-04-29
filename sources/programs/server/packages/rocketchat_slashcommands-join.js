(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/rocketchat_slashcommands-join/server.coffee.js                                                //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                          // 1
/*                                                                                                        // 1
 * Join is a named function that will replace /join commands                                              //
 * @param {Object} message - The message object                                                           //
 */                                                                                                       //
var Join;                                                                                                 // 1
                                                                                                          //
Join = (function() {                                                                                      // 1
  function Join(command, params, item) {                                                                  // 7
    var channel, room, user;                                                                              // 8
    if (command !== 'join' || !Match.test(params, String)) {                                              // 8
      return;                                                                                             // 9
    }                                                                                                     //
    channel = params.trim();                                                                              // 8
    if (channel === '') {                                                                                 // 12
      return;                                                                                             // 13
    }                                                                                                     //
    channel = channel.replace('#', '');                                                                   // 8
    user = Meteor.users.findOne(Meteor.userId());                                                         // 8
    room = RocketChat.models.Rooms.findOneByNameAndTypeNotContainigUsername(channel, 'c', user.username);
    if (room == null) {                                                                                   // 20
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                                   // 21
        _id: Random.id(),                                                                                 // 21
        rid: item.rid,                                                                                    // 21
        ts: new Date,                                                                                     // 21
        msg: TAPi18n.__('Channel_doesnt_exist', {                                                         // 21
          postProcess: 'sprintf',                                                                         // 25
          sprintf: [channel]                                                                              // 25
        }, user.language)                                                                                 //
      });                                                                                                 //
      return;                                                                                             // 27
    }                                                                                                     //
    Meteor.call('joinRoom', room._id);                                                                    // 8
  }                                                                                                       //
                                                                                                          //
  return Join;                                                                                            //
                                                                                                          //
})();                                                                                                     //
                                                                                                          //
RocketChat.slashCommands.add('join', Join);                                                               // 1
                                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-join'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-join.js.map
