(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/loadMissedMessages.coffee.js                         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  loadMissedMessages: function(rid, start) {                           // 2
    var fromId, options;                                               // 3
    fromId = Meteor.userId();                                          // 3
    if (!Meteor.call('canAccessRoom', rid, fromId)) {                  // 4
      return false;                                                    // 5
    }                                                                  //
    options = {                                                        // 3
      sort: {                                                          // 8
        ts: -1                                                         // 9
      }                                                                //
    };                                                                 //
    if (!RocketChat.settings.get('Message_ShowEditedStatus')) {        // 11
      options.fields = {                                               // 12
        'editedAt': 0                                                  // 12
      };                                                               //
    }                                                                  //
    return RocketChat.models.Messages.findVisibleByRoomIdAfterTimestamp(rid, start, options).fetch();
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=loadMissedMessages.coffee.js.map
