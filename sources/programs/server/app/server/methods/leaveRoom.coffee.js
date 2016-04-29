(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/leaveRoom.coffee.js                                  //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  leaveRoom: function(rid) {                                           // 2
    var fromId, numOwners, removedUser, room, user;                    // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error(403, "[methods] leaveRoom -> Invalid user");
    }                                                                  //
    this.unblock();                                                    // 3
    fromId = Meteor.userId();                                          // 3
    room = RocketChat.models.Rooms.findOneById(rid);                   // 3
    user = Meteor.user();                                              // 3
    if (RocketChat.authz.hasRole(user._id, 'owner', room._id)) {       // 13
      numOwners = RocketChat.authz.getUsersInRole('owner', room._id).fetch().length;
      if (numOwners === 1) {                                           // 15
        throw new Meteor.Error('last-owner', 'You_are_the_last_owner_Please_set_new_owner_before_leaving_the_room');
      }                                                                //
    }                                                                  //
    RocketChat.callbacks.run('beforeLeaveRoom', user, room);           // 3
    RocketChat.models.Rooms.removeUsernameById(rid, user.username);    // 3
    if (room.usernames.indexOf(user.username) !== -1) {                // 22
      removedUser = user;                                              // 23
      RocketChat.models.Messages.createUserLeaveWithRoomIdAndUser(rid, removedUser);
    }                                                                  //
    if (room.t === 'l') {                                              // 26
      RocketChat.models.Messages.createCommandWithRoomIdAndUser('survey', rid, user);
    }                                                                  //
    RocketChat.models.Subscriptions.removeByRoomIdAndUserId(rid, Meteor.userId());
    return Meteor.defer(function() {                                   //
      return RocketChat.callbacks.run('afterLeaveRoom', user, room);   //
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=leaveRoom.coffee.js.map
