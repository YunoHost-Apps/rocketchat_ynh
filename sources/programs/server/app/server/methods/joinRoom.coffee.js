(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/joinRoom.coffee.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  joinRoom: function(rid) {                                            // 2
    var now, room, subscription, user;                                 // 4
    room = RocketChat.models.Rooms.findOneById(rid);                   // 4
    if (room == null) {                                                // 6
      throw new Meteor.Error(500, 'No channel with this id');          // 7
    }                                                                  //
    if (room.t !== 'c' || RocketChat.authz.hasPermission(Meteor.userId(), 'view-c-room') !== true) {
      throw new Meteor.Error(403, '[methods] joinRoom -> Not allowed');
    }                                                                  //
    now = new Date();                                                  // 4
    subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, Meteor.userId());
    if (subscription != null) {                                        // 16
      return;                                                          // 17
    }                                                                  //
    user = RocketChat.models.Users.findOneById(Meteor.userId());       // 4
    RocketChat.callbacks.run('beforeJoinRoom', user, room);            // 4
    RocketChat.models.Rooms.addUsernameById(rid, user.username);       // 4
    RocketChat.models.Subscriptions.createWithRoomAndUser(room, user, {
      ts: now,                                                         // 26
      open: true,                                                      // 26
      alert: true,                                                     // 26
      unread: 1                                                        // 26
    });                                                                //
    RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(rid, user, {
      ts: now                                                          // 32
    });                                                                //
    Meteor.defer(function() {                                          // 4
      return RocketChat.callbacks.run('afterJoinRoom', user, room);    //
    });                                                                //
    return true;                                                       // 37
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=joinRoom.coffee.js.map
