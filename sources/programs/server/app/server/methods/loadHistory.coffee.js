(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/loadHistory.coffee.js                                //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  loadHistory: function(rid, end, limit, ls) {                         // 2
    var firstMessage, firstUnread, fromId, messages, options, records, unreadMessages, unreadNotLoaded;
    if (limit == null) {                                               //
      limit = 20;                                                      //
    }                                                                  //
    fromId = Meteor.userId();                                          // 3
    if (!Meteor.call('canAccessRoom', rid, fromId)) {                  // 4
      return false;                                                    // 5
    }                                                                  //
    options = {                                                        // 3
      sort: {                                                          // 8
        ts: -1                                                         // 9
      },                                                               //
      limit: limit                                                     // 8
    };                                                                 //
    if (!RocketChat.settings.get('Message_ShowEditedStatus')) {        // 12
      options.fields = {                                               // 13
        'editedAt': 0                                                  // 13
      };                                                               //
    }                                                                  //
    if (end != null) {                                                 // 15
      records = RocketChat.models.Messages.findVisibleByRoomIdBeforeTimestamp(rid, end, options).fetch();
    } else {                                                           //
      records = RocketChat.models.Messages.findVisibleByRoomId(rid, options).fetch();
    }                                                                  //
    messages = _.map(records, function(message) {                      // 3
      message.starred = _.findWhere(message.starred, {                 // 21
        _id: fromId                                                    // 21
      });                                                              //
      return message;                                                  // 22
    });                                                                //
    unreadNotLoaded = 0;                                               // 3
    if (ls != null) {                                                  // 26
      firstMessage = messages[messages.length - 1];                    // 27
      if ((firstMessage != null ? firstMessage.ts : void 0) > ls) {    // 28
        delete options.limit;                                          // 29
        unreadMessages = RocketChat.models.Messages.findVisibleByRoomIdBetweenTimestamps(rid, ls, firstMessage.ts, {
          limit: 1,                                                    // 30
          sort: {                                                      // 30
            ts: 1                                                      // 30
          }                                                            //
        });                                                            //
        firstUnread = unreadMessages.fetch()[0];                       // 29
        unreadNotLoaded = unreadMessages.count();                      // 29
      }                                                                //
    }                                                                  //
    return {                                                           // 34
      messages: messages,                                              // 34
      firstUnread: firstUnread,                                        // 34
      unreadNotLoaded: unreadNotLoaded                                 // 34
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=loadHistory.coffee.js.map
