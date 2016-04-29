(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/addUserToRoom.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  addUserToRoom: function(data) {                                      // 2
    var fromId, fromUser, newUser, now, room;                          // 3
    fromId = Meteor.userId();                                          // 3
    if (!Match.test(data != null ? data.rid : void 0, String)) {       // 4
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {   // 5
        method: addUserToRoom                                          // 5
      });                                                              //
    }                                                                  //
    if (!Match.test(data != null ? data.username : void 0, String)) {  // 7
      throw new Meteor.Error('error-invalid-username', 'Invalid username', {
        method: addUserToRoom                                          // 8
      });                                                              //
    }                                                                  //
    room = RocketChat.models.Rooms.findOneById(data.rid);              // 3
    if (room.t === 'c' && !RocketChat.authz.hasPermission(fromId, 'add-user-to-room', room._id)) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 14
        method: addUserToRoom                                          // 14
      });                                                              //
    }                                                                  //
    if (room.t === 'd') {                                              // 16
      throw new Meteor.Error('error-cant-invite-for-direct-room', 'Can\'t invite user to direct rooms', {
        method: addUserToRoom                                          // 17
      });                                                              //
    }                                                                  //
    if (room.usernames.indexOf(data.username) !== -1) {                // 20
      return;                                                          // 21
    }                                                                  //
    newUser = RocketChat.models.Users.findOneByUsername(data.username);
    RocketChat.models.Rooms.addUsernameById(data.rid, data.username);  // 3
    now = new Date();                                                  // 3
    RocketChat.models.Subscriptions.createWithRoomAndUser(room, newUser, {
      ts: now,                                                         // 30
      open: true,                                                      // 30
      alert: true,                                                     // 30
      unread: 1                                                        // 30
    });                                                                //
    fromUser = RocketChat.models.Users.findOneById(fromId);            // 3
    RocketChat.models.Messages.createUserAddedWithRoomIdAndUser(data.rid, newUser, {
      ts: now,                                                         // 37
      u: {                                                             // 37
        _id: fromUser._id,                                             // 39
        username: fromUser.username                                    // 39
      }                                                                //
    });                                                                //
    return true;                                                       // 42
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=addUserToRoom.coffee.js.map
