(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_message-pin/server/settings.coffee.js                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                         // 1
  RocketChat.settings.add('Message_AllowPinning', true, {                                                           // 2
    type: 'boolean',                                                                                                // 2
    group: 'Message',                                                                                               // 2
    "public": true                                                                                                  // 2
  });                                                                                                               //
  return RocketChat.models.Permissions.upsert('pin-message', {                                                      //
    $setOnInsert: {                                                                                                 // 3
      roles: ['owner', 'moderator', 'admin']                                                                        // 3
    }                                                                                                               //
  });                                                                                                               //
});                                                                                                                 // 1
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_message-pin/server/pinMessage.coffee.js                                                      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                    // 1
  pinMessage: function(message) {                                                                                   // 2
    var me;                                                                                                         // 3
    if (!Meteor.userId()) {                                                                                         // 3
      throw new Meteor.Error('invalid-user', "[methods] pinMessage -> Invalid user");                               // 4
    }                                                                                                               //
    if (!RocketChat.settings.get('Message_AllowPinning')) {                                                         // 6
      throw new Meteor.Error('message-pinning-not-allowed', '[methods] pinMessage -> Message pinning not allowed');
    }                                                                                                               //
    if (RocketChat.settings.get('Message_KeepHistory')) {                                                           // 10
      RocketChat.models.Messages.cloneAndSaveAsHistoryById(message._id);                                            // 11
    }                                                                                                               //
    me = RocketChat.models.Users.findOneById(Meteor.userId());                                                      // 3
    message.pinned = true;                                                                                          // 3
    message.pinnedAt = Date.now;                                                                                    // 3
    message.pinnedBy = {                                                                                            // 3
      _id: Meteor.userId(),                                                                                         // 18
      username: me.username                                                                                         // 18
    };                                                                                                              //
    message = RocketChat.callbacks.run('beforeSaveMessage', message);                                               // 3
    RocketChat.models.Messages.setPinnedByIdAndUserId(message._id, message.pinnedBy, message.pinned);               // 3
    return RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('message_pinned', message.rid, '', me, {   //
      attachments: [                                                                                                // 26
        {                                                                                                           //
          "text": message.msg,                                                                                      // 27
          "author_name": message.u.username,                                                                        // 27
          "author_icon": getAvatarUrlFromUsername(message.u.username)                                               // 27
        }                                                                                                           //
      ]                                                                                                             //
    });                                                                                                             //
  },                                                                                                                //
  unpinMessage: function(message) {                                                                                 // 2
    var me;                                                                                                         // 33
    if (!Meteor.userId()) {                                                                                         // 33
      throw new Meteor.Error('invalid-user', "[methods] unpinMessage -> Invalid user");                             // 34
    }                                                                                                               //
    if (!RocketChat.settings.get('Message_AllowPinning')) {                                                         // 36
      throw new Meteor.Error('message-pinning-not-allowed', '[methods] pinMessage -> Message pinning not allowed');
    }                                                                                                               //
    if (RocketChat.settings.get('Message_KeepHistory')) {                                                           // 40
      RocketChat.models.Messages.cloneAndSaveAsHistoryById(message._id);                                            // 41
    }                                                                                                               //
    me = RocketChat.models.Users.findOneById(Meteor.userId());                                                      // 33
    message.pinned = false;                                                                                         // 33
    message.pinnedBy = {                                                                                            // 33
      _id: Meteor.userId(),                                                                                         // 47
      username: me.username                                                                                         // 47
    };                                                                                                              //
    message = RocketChat.callbacks.run('beforeSaveMessage', message);                                               // 33
    return RocketChat.models.Messages.setPinnedByIdAndUserId(message._id, message.pinnedBy, message.pinned);        //
  }                                                                                                                 //
});                                                                                                                 //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_message-pin/server/publications/pinnedMessages.coffee.js                                     //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('pinnedMessages', function(rid, limit) {                                                             // 1
  var cursorHandle, publication, user;                                                                              // 2
  if (limit == null) {                                                                                              //
    limit = 50;                                                                                                     //
  }                                                                                                                 //
  if (!this.userId) {                                                                                               // 2
    return this.ready();                                                                                            // 3
  }                                                                                                                 //
  publication = this;                                                                                               // 2
  user = RocketChat.models.Users.findOneById(this.userId);                                                          // 2
  if (!user) {                                                                                                      // 8
    return this.ready();                                                                                            // 9
  }                                                                                                                 //
  cursorHandle = RocketChat.models.Messages.findPinnedByRoom(rid, {                                                 // 2
    sort: {                                                                                                         // 11
      ts: -1                                                                                                        // 11
    },                                                                                                              //
    limit: limit                                                                                                    // 11
  }).observeChanges({                                                                                               //
    added: function(_id, record) {                                                                                  // 12
      return publication.added('rocketchat_pinned_message', _id, record);                                           //
    },                                                                                                              //
    changed: function(_id, record) {                                                                                // 12
      return publication.changed('rocketchat_pinned_message', _id, record);                                         //
    },                                                                                                              //
    removed: function(_id) {                                                                                        // 12
      return publication.removed('rocketchat_pinned_message', _id);                                                 //
    }                                                                                                               //
  });                                                                                                               //
  this.ready();                                                                                                     // 2
  return this.onStop(function() {                                                                                   //
    return cursorHandle.stop();                                                                                     //
  });                                                                                                               //
});                                                                                                                 // 1
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_message-pin/server/startup/indexes.coffee.js                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                         // 1
  return Meteor.defer(function() {                                                                                  //
    return RocketChat.models.Messages.tryEnsureIndex({                                                              //
      'pinnedBy._id': 1                                                                                             // 3
    }, {                                                                                                            //
      sparse: 1                                                                                                     // 3
    });                                                                                                             //
  });                                                                                                               //
});                                                                                                                 // 1
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:message-pin'] = {};

})();

//# sourceMappingURL=rocketchat_message-pin.js.map
