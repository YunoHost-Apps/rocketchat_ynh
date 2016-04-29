(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/stream/messages.coffee.js                                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var oldMsgStream;                                                      // 2
                                                                       //
oldMsgStream = new Meteor.Stream('messages');                          // 2
                                                                       //
oldMsgStream.permissions.write(function(eventName) {                   // 2
  return false;                                                        // 5
});                                                                    // 4
                                                                       //
oldMsgStream.permissions.read(function(eventName) {                    // 2
  var canAccess, e;                                                    // 8
  try {                                                                // 8
    canAccess = Meteor.call('canAccessRoom', eventName, this.userId);  // 9
    if (!canAccess) {                                                  // 11
      return false;                                                    // 11
    }                                                                  //
    return true;                                                       // 13
  } catch (_error) {                                                   //
    e = _error;                                                        // 15
    return false;                                                      // 15
  }                                                                    //
});                                                                    // 7
                                                                       //
this.msgStream = new Meteor.Streamer('room-messages');                 // 2
                                                                       //
msgStream.allowWrite('none');                                          // 2
                                                                       //
msgStream.allowRead(function(eventName) {                              // 2
  var canAccess, e;                                                    // 27
  try {                                                                // 27
    canAccess = Meteor.call('canAccessRoom', eventName, this.userId);  // 28
    if (!canAccess) {                                                  // 30
      return false;                                                    // 30
    }                                                                  //
    return true;                                                       // 32
  } catch (_error) {                                                   //
    e = _error;                                                        // 34
    return false;                                                      // 34
  }                                                                    //
});                                                                    // 23
                                                                       //
Meteor.startup(function() {                                            // 2
  var options;                                                         // 38
  options = {};                                                        // 38
  if (!RocketChat.settings.get('Message_ShowEditedStatus')) {          // 40
    options.fields = {                                                 // 41
      'editedAt': 0                                                    // 41
    };                                                                 //
  }                                                                    //
  return RocketChat.models.Messages.findVisibleCreatedOrEditedAfterTimestamp(new Date(), options).observe({
    added: function(record) {                                          // 44
      oldMsgStream.emit(record.rid, record);                           // 45
      return msgStream.emitWithoutBroadcast(record.rid, record);       //
    },                                                                 //
    changed: function(record) {                                        // 44
      oldMsgStream.emit(record.rid, record);                           // 49
      return msgStream.emitWithoutBroadcast(record.rid, record);       //
    }                                                                  //
  });                                                                  //
});                                                                    // 37
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=messages.coffee.js.map
