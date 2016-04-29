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

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/rocketchat_mentions-flextab/server/publications/mentionedMessages.coffee.js         //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('mentionedMessages', function(rid, limit) {                                      // 1
  var cursorHandle, publication, user;                                                          // 2
  if (limit == null) {                                                                          //
    limit = 50;                                                                                 //
  }                                                                                             //
  if (!this.userId) {                                                                           // 2
    return this.ready();                                                                        // 3
  }                                                                                             //
  publication = this;                                                                           // 2
  user = RocketChat.models.Users.findOneById(this.userId);                                      // 2
  if (!user) {                                                                                  // 8
    return this.ready();                                                                        // 9
  }                                                                                             //
  cursorHandle = RocketChat.models.Messages.findVisibleByMentionAndRoomId(user.username, rid, {
    sort: {                                                                                     // 11
      ts: -1                                                                                    // 11
    },                                                                                          //
    limit: limit                                                                                // 11
  }).observeChanges({                                                                           //
    added: function(_id, record) {                                                              // 12
      record.mentionedList = true;                                                              // 13
      return publication.added('rocketchat_mentioned_message', _id, record);                    //
    },                                                                                          //
    changed: function(_id, record) {                                                            // 12
      record.mentionedList = true;                                                              // 17
      return publication.changed('rocketchat_mentioned_message', _id, record);                  //
    },                                                                                          //
    removed: function(_id) {                                                                    // 12
      return publication.removed('rocketchat_mentioned_message', _id);                          //
    }                                                                                           //
  });                                                                                           //
  this.ready();                                                                                 // 2
  return this.onStop(function() {                                                               //
    return cursorHandle.stop();                                                                 //
  });                                                                                           //
});                                                                                             // 1
                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:mentions-flextab'] = {};

})();

//# sourceMappingURL=rocketchat_mentions-flextab.js.map
