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

//////////////////////////////////////////////////////////////////////////
//                                                                      //
// packages/rocketchat_slashcommands-mute/server/mute.coffee.js         //
//                                                                      //
//////////////////////////////////////////////////////////////////////////
                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                        // 1
/*                                                                      // 1
 * Mute is a named function that will replace /mute commands            //
 */                                                                     //
var Mute,                                                               // 1
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                        //
Mute = (function() {                                                    // 1
  function Mute(command, params, item) {                                // 6
    var mutedUser, room, user, username;                                // 7
    if (command !== 'mute' || !Match.test(params, String)) {            // 7
      return;                                                           // 8
    }                                                                   //
    username = params.trim();                                           // 7
    if (username === '') {                                              // 11
      return;                                                           // 12
    }                                                                   //
    username = username.replace('@', '');                               // 7
    user = Meteor.users.findOne(Meteor.userId());                       // 7
    mutedUser = RocketChat.models.Users.findOneByUsername(username);    // 7
    room = RocketChat.models.Rooms.findOneById(item.rid);               // 7
    if (mutedUser == null) {                                            // 20
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
        _id: Random.id(),                                               // 21
        rid: item.rid,                                                  // 21
        ts: new Date,                                                   // 21
        msg: TAPi18n.__('Username_doesnt_exist', {                      // 21
          postProcess: 'sprintf',                                       // 25
          sprintf: [username]                                           // 25
        }, user.language)                                               //
      });                                                               //
      return;                                                           // 27
    }                                                                   //
    if (indexOf.call(room.usernames || [], username) < 0) {             // 29
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
        _id: Random.id(),                                               // 30
        rid: item.rid,                                                  // 30
        ts: new Date,                                                   // 30
        msg: TAPi18n.__('Username_is_not_in_this_room', {               // 30
          postProcess: 'sprintf',                                       // 34
          sprintf: [username]                                           // 34
        }, user.language)                                               //
      });                                                               //
      return;                                                           // 36
    }                                                                   //
    Meteor.call('muteUserInRoom', {                                     // 7
      rid: item.rid,                                                    // 38
      username: username                                                // 38
    });                                                                 //
  }                                                                     //
                                                                        //
  return Mute;                                                          //
                                                                        //
})();                                                                   //
                                                                        //
RocketChat.slashCommands.add('mute', Mute);                             // 1
                                                                        //
//////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////
//                                                                      //
// packages/rocketchat_slashcommands-mute/server/unmute.coffee.js       //
//                                                                      //
//////////////////////////////////////////////////////////////////////////
                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                        // 1
/*                                                                      // 1
 * Unmute is a named function that will replace /unmute commands        //
 */                                                                     //
var Unmute,                                                             // 1
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                        //
Unmute = (function() {                                                  // 1
  function Unmute(command, params, item) {                              // 6
    var room, unmutedUser, user, username;                              // 7
    if (command !== 'unmute' || !Match.test(params, String)) {          // 7
      return;                                                           // 8
    }                                                                   //
    username = params.trim();                                           // 7
    if (username === '') {                                              // 11
      return;                                                           // 12
    }                                                                   //
    username = username.replace('@', '');                               // 7
    user = Meteor.users.findOne(Meteor.userId());                       // 7
    unmutedUser = RocketChat.models.Users.findOneByUsername(username);  // 7
    room = RocketChat.models.Rooms.findOneById(item.rid);               // 7
    if (unmutedUser == null) {                                          // 20
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
        _id: Random.id(),                                               // 21
        rid: item.rid,                                                  // 21
        ts: new Date,                                                   // 21
        msg: TAPi18n.__('Username_doesnt_exist', {                      // 21
          postProcess: 'sprintf',                                       // 25
          sprintf: [username]                                           // 25
        }, user.language)                                               //
      });                                                               //
      return;                                                           // 27
    }                                                                   //
    if (indexOf.call(room.usernames || [], username) < 0) {             // 29
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
        _id: Random.id(),                                               // 30
        rid: item.rid,                                                  // 30
        ts: new Date,                                                   // 30
        msg: TAPi18n.__('Username_is_not_in_this_room', {               // 30
          postProcess: 'sprintf',                                       // 34
          sprintf: [username]                                           // 34
        }, user.language)                                               //
      });                                                               //
      return;                                                           // 36
    }                                                                   //
    Meteor.call('unmuteUserInRoom', {                                   // 7
      rid: item.rid,                                                    // 38
      username: username                                                // 38
    });                                                                 //
  }                                                                     //
                                                                        //
  return Unmute;                                                        //
                                                                        //
})();                                                                   //
                                                                        //
RocketChat.slashCommands.add('unmute', Unmute);                         // 1
                                                                        //
//////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-mute'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-mute.js.map
