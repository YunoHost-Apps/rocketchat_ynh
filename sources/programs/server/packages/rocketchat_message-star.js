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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_message-star/server/settings.coffee.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                            // 1
  return RocketChat.settings.add('Message_AllowStarring', true, {                                                      //
    type: 'boolean',                                                                                                   // 2
    group: 'Message',                                                                                                  // 2
    "public": true                                                                                                     // 2
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_message-star/server/starMessage.coffee.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  starMessage: function(message) {                                                                                     // 2
    if (!Meteor.userId()) {                                                                                            // 3
      throw new Meteor.Error('invalid-user', "[methods] starMessage -> Invalid user");                                 // 4
    }                                                                                                                  //
    if (!RocketChat.settings.get('Message_AllowStarring')) {                                                           // 6
      throw new Meteor.Error('message-starring-not-allowed', "[methods] starMessage -> Message starring not allowed");
    }                                                                                                                  //
    return RocketChat.models.Messages.updateUserStarById(message._id, Meteor.userId(), message.starred);               //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_message-star/server/publications/starredMessages.coffee.js                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('starredMessages', function(rid, limit) {                                                               // 1
  var cursorHandle, publication, user;                                                                                 // 2
  if (limit == null) {                                                                                                 //
    limit = 50;                                                                                                        //
  }                                                                                                                    //
  if (!this.userId) {                                                                                                  // 2
    return this.ready();                                                                                               // 3
  }                                                                                                                    //
  publication = this;                                                                                                  // 2
  user = RocketChat.models.Users.findOneById(this.userId);                                                             // 2
  if (!user) {                                                                                                         // 8
    return this.ready();                                                                                               // 9
  }                                                                                                                    //
  cursorHandle = RocketChat.models.Messages.findStarredByUserAtRoom(this.userId, rid, {                                // 2
    sort: {                                                                                                            // 11
      ts: -1                                                                                                           // 11
    },                                                                                                                 //
    limit: limit                                                                                                       // 11
  }).observeChanges({                                                                                                  //
    added: function(_id, record) {                                                                                     // 12
      return publication.added('rocketchat_starred_message', _id, record);                                             //
    },                                                                                                                 //
    changed: function(_id, record) {                                                                                   // 12
      return publication.changed('rocketchat_starred_message', _id, record);                                           //
    },                                                                                                                 //
    removed: function(_id) {                                                                                           // 12
      return publication.removed('rocketchat_starred_message', _id);                                                   //
    }                                                                                                                  //
  });                                                                                                                  //
  this.ready();                                                                                                        // 2
  return this.onStop(function() {                                                                                      //
    return cursorHandle.stop();                                                                                        //
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_message-star/server/startup/indexes.coffee.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                            // 1
  return Meteor.defer(function() {                                                                                     //
    return RocketChat.models.Messages.tryEnsureIndex({                                                                 //
      'starred._id': 1                                                                                                 // 3
    }, {                                                                                                               //
      sparse: 1                                                                                                        // 3
    });                                                                                                                //
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:message-star'] = {};

})();

//# sourceMappingURL=rocketchat_message-star.js.map
