(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/loadSurroundingMessages.coffee.js                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  loadSurroundingMessages: function(message, limit) {                  // 2
    var afterMessages, fromId, messages, moreAfter, moreBefore, options, records;
    if (limit == null) {                                               //
      limit = 50;                                                      //
    }                                                                  //
    fromId = Meteor.userId();                                          // 3
    if (!message._id) {                                                // 5
      return false;                                                    // 6
    }                                                                  //
    message = RocketChat.models.Messages.findOneById(message._id);     // 3
    if (!(message != null ? message.rid : void 0)) {                   // 10
      return false;                                                    // 11
    }                                                                  //
    if (!Meteor.call('canAccessRoom', message.rid, fromId)) {          // 13
      return false;                                                    // 14
    }                                                                  //
    limit = limit - 1;                                                 // 3
    options = {                                                        // 3
      sort: {                                                          // 19
        ts: -1                                                         // 20
      },                                                               //
      limit: Math.ceil(limit / 2)                                      // 19
    };                                                                 //
    if (!RocketChat.settings.get('Message_ShowEditedStatus')) {        // 23
      options.fields = {                                               // 24
        'editedAt': 0                                                  // 24
      };                                                               //
    }                                                                  //
    records = RocketChat.models.Messages.findVisibleByRoomIdBeforeTimestamp(message.rid, message.ts, options).fetch();
    messages = _.map(records, function(message) {                      // 3
      message.starred = _.findWhere(message.starred, {                 // 28
        _id: fromId                                                    // 28
      });                                                              //
      return message;                                                  // 29
    });                                                                //
    moreBefore = messages.length === options.limit;                    // 3
    messages.push(message);                                            // 3
    options.sort = {                                                   // 3
      ts: 1                                                            // 35
    };                                                                 //
    options.limit = Math.floor(limit / 2);                             // 3
    records = RocketChat.models.Messages.findVisibleByRoomIdAfterTimestamp(message.rid, message.ts, options).fetch();
    afterMessages = _.map(records, function(message) {                 // 3
      message.starred = _.findWhere(message.starred, {                 // 40
        _id: fromId                                                    // 40
      });                                                              //
      return message;                                                  // 41
    });                                                                //
    moreAfter = afterMessages.length === options.limit;                // 3
    messages = messages.concat(afterMessages);                         // 3
    return {                                                           // 47
      messages: messages,                                              // 47
      moreBefore: moreBefore,                                          // 47
      moreAfter: moreAfter                                             // 47
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=loadSurroundingMessages.coffee.js.map
