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

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// packages/rocketchat_slashcommands-invite/server.coffee.js                                     //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                 // 1
/*                                                                                               // 1
 * Invite is a named function that will replace /invite commands                                 //
 * @param {Object} message - The message object                                                  //
 */                                                                                              //
var Invite;                                                                                      // 1
                                                                                                 //
Invite = (function() {                                                                           // 1
  function Invite(command, params, item) {                                                       // 7
    var currentUser, e, user, username;                                                          // 8
    if (command !== 'invite' || !Match.test(params, String)) {                                   // 8
      return;                                                                                    // 9
    }                                                                                            //
    username = params.trim();                                                                    // 8
    if (username === '') {                                                                       // 12
      return;                                                                                    // 13
    }                                                                                            //
    username = username.replace('@', '');                                                        // 8
    user = Meteor.users.findOne({                                                                // 8
      username: username                                                                         // 17
    });                                                                                          //
    currentUser = Meteor.users.findOne(Meteor.userId());                                         // 8
    if (user == null) {                                                                          // 20
      console.log('notify user_doesnt_exist');                                                   // 21
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                          // 21
        _id: Random.id(),                                                                        // 22
        rid: item.rid,                                                                           // 22
        ts: new Date,                                                                            // 22
        msg: TAPi18n.__('User_doesnt_exist', {                                                   // 22
          postProcess: 'sprintf',                                                                // 26
          sprintf: [username]                                                                    // 26
        }, currentUser.language)                                                                 //
      });                                                                                        //
      return;                                                                                    // 28
    }                                                                                            //
    if (RocketChat.models.Rooms.findOneByIdContainigUsername(item.rid, user.username) != null) {
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                          // 32
        _id: Random.id(),                                                                        // 32
        rid: item.rid,                                                                           // 32
        ts: new Date,                                                                            // 32
        msg: TAPi18n.__('Username_is_already_in_here', {                                         // 32
          postProcess: 'sprintf',                                                                // 36
          sprintf: [username]                                                                    // 36
        }, currentUser.language)                                                                 //
      });                                                                                        //
      return;                                                                                    // 38
    }                                                                                            //
    try {                                                                                        // 40
      Meteor.call('addUserToRoom', {                                                             // 41
        rid: item.rid,                                                                           // 42
        username: user.username                                                                  // 42
      });                                                                                        //
    } catch (_error) {                                                                           //
      e = _error;                                                                                // 45
      if (e.error === 'cant-invite-for-direct-room') {                                           // 45
        RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                        // 46
          _id: Random.id(),                                                                      // 46
          rid: item.rid,                                                                         // 46
          ts: new Date,                                                                          // 46
          msg: TAPi18n.__('Cannot_invite_users_to_direct_rooms', null, currentUser.language)     // 46
        });                                                                                      //
      } else {                                                                                   //
        RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                        // 53
          _id: Random.id(),                                                                      // 53
          rid: item.rid,                                                                         // 53
          ts: new Date,                                                                          // 53
          msg: e.error                                                                           // 53
        });                                                                                      //
      }                                                                                          //
      return;                                                                                    // 59
    }                                                                                            //
  }                                                                                              //
                                                                                                 //
  return Invite;                                                                                 //
                                                                                                 //
})();                                                                                            //
                                                                                                 //
RocketChat.slashCommands.add('invite', Invite);                                                  // 1
                                                                                                 //
///////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-invite'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-invite.js.map
