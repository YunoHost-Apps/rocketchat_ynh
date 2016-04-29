(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/updateMessage.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  updateMessage: function(message) {                                   // 2
    var blockEditInMinutes, currentTsDiff, editAllowed, editOwn, hasPermission, me, msgTs, originalMessage, ref, room, tempid, urls;
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('invalid-user', "[methods] updateMessage -> Invalid user");
    }                                                                  //
    originalMessage = RocketChat.models.Messages.findOneById(message._id);
    if ((originalMessage != null ? originalMessage._id : void 0) == null) {
      return;                                                          // 9
    }                                                                  //
    hasPermission = RocketChat.authz.hasPermission(Meteor.userId(), 'edit-message', message.rid);
    editAllowed = RocketChat.settings.get('Message_AllowEditing');     // 3
    editOwn = (originalMessage != null ? (ref = originalMessage.u) != null ? ref._id : void 0 : void 0) === Meteor.userId();
    me = RocketChat.models.Users.findOneById(Meteor.userId());         // 3
    if (!(hasPermission || (editAllowed && editOwn))) {                // 17
      throw new Meteor.Error('message-editing-not-allowed', "[methods] updateMessage -> Message editing not allowed");
    }                                                                  //
    blockEditInMinutes = RocketChat.settings.get('Message_AllowEditing_BlockEditInMinutes');
    if ((blockEditInMinutes != null) && blockEditInMinutes !== 0) {    // 21
      if (originalMessage.ts != null) {                                // 22
        msgTs = moment(originalMessage.ts);                            // 22
      }                                                                //
      if (msgTs != null) {                                             // 23
        currentTsDiff = moment().diff(msgTs, 'minutes');               // 23
      }                                                                //
      if (currentTsDiff > blockEditInMinutes) {                        // 24
        throw new Meteor.Error('message-editing-blocked');             // 25
      }                                                                //
    }                                                                  //
    if (RocketChat.settings.get('Message_KeepHistory')) {              // 28
      RocketChat.models.Messages.cloneAndSaveAsHistoryById(originalMessage._id);
    }                                                                  //
    message.editedAt = new Date();                                     // 3
    message.editedBy = {                                               // 3
      _id: Meteor.userId(),                                            // 33
      username: me.username                                            // 33
    };                                                                 //
    if (urls = message.msg.match(/([A-Za-z]{3,9}):\/\/([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((\/[-\+=!:~%\/\.@\,\w]*)?\??([-\+=&!:;%@\/\.\,\w]+)?(?:#([^\s\)]+))?)?/g)) {
      message.urls = urls.map(function(url) {                          // 37
        return {                                                       //
          url: url                                                     // 37
        };                                                             //
      });                                                              //
    }                                                                  //
    message = RocketChat.callbacks.run('beforeSaveMessage', message);  // 3
    tempid = message._id;                                              // 3
    delete message._id;                                                // 3
    RocketChat.models.Messages.update({                                // 3
      _id: tempid                                                      // 45
    }, {                                                               //
      $set: message                                                    // 47
    });                                                                //
    room = RocketChat.models.Rooms.findOneById(message.rid);           // 3
    return Meteor.defer(function() {                                   //
      return RocketChat.callbacks.run('afterSaveMessage', RocketChat.models.Messages.findOneById(tempid), room);
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=updateMessage.coffee.js.map
