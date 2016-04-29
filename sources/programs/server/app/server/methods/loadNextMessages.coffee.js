(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/loadNextMessages.coffee.js                           //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  loadNextMessages: function(rid, end, limit) {                        // 2
    var fromId, messages, options, records;                            // 3
    if (limit == null) {                                               //
      limit = 20;                                                      //
    }                                                                  //
    fromId = Meteor.userId();                                          // 3
    if (!Meteor.call('canAccessRoom', rid, fromId)) {                  // 5
      return false;                                                    // 6
    }                                                                  //
    options = {                                                        // 3
      sort: {                                                          // 9
        ts: 1                                                          // 10
      },                                                               //
      limit: limit                                                     // 9
    };                                                                 //
    if (!RocketChat.settings.get('Message_ShowEditedStatus')) {        // 13
      options.fields = {                                               // 14
        'editedAt': 0                                                  // 14
      };                                                               //
    }                                                                  //
    if (end != null) {                                                 // 16
      records = RocketChat.models.Messages.findVisibleByRoomIdAfterTimestamp(rid, end, options).fetch();
    } else {                                                           //
      records = RocketChat.models.Messages.findVisibleByRoomId(rid, options).fetch();
    }                                                                  //
    messages = _.map(records, function(message) {                      // 3
      message.starred = _.findWhere(message.starred, {                 // 22
        _id: fromId                                                    // 22
      });                                                              //
      return message;                                                  // 23
    });                                                                //
    return {                                                           // 25
      messages: messages                                               // 25
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=loadNextMessages.coffee.js.map
