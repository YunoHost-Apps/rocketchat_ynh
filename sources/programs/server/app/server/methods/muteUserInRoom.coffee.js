(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/muteUserInRoom.coffee.js                             //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                       //
Meteor.methods({                                                       // 1
  muteUserInRoom: function(data) {                                     // 2
    var fromId, fromUser, mutedUser, ref, ref1, room;                  // 3
    fromId = Meteor.userId();                                          // 3
    check(data, Match.ObjectIncluding({                                // 3
      rid: String,                                                     // 4
      username: String                                                 // 4
    }));                                                               //
    if (!RocketChat.authz.hasPermission(fromId, 'mute-user', data.rid)) {
      throw new Meteor.Error('not-allowed', '[methods] muteUserInRoom -> Not allowed');
    }                                                                  //
    room = RocketChat.models.Rooms.findOneById(data.rid);              // 3
    if (!room) {                                                       // 10
      throw new Meteor.Error('invalid-room', '[methods] muteUserInRoom -> Room ID is invalid');
    }                                                                  //
    if ((ref = room.t) !== 'c' && ref !== 'p') {                       // 13
      throw new Meteor.Error('invalid-room-type', '[methods] muteUserInRoom -> Invalid room type');
    }                                                                  //
    if (ref1 = data.username, indexOf.call((room != null ? room.usernames : void 0) || [], ref1) < 0) {
      throw new Meteor.Error('not-in-room', '[methods] muteUserInRoom -> User is not in this room');
    }                                                                  //
    mutedUser = RocketChat.models.Users.findOneByUsername(data.username);
    RocketChat.models.Rooms.muteUsernameByRoomId(data.rid, mutedUser.username);
    fromUser = RocketChat.models.Users.findOneById(fromId);            // 3
    RocketChat.models.Messages.createUserMutedWithRoomIdAndUser(data.rid, mutedUser, {
      u: {                                                             // 25
        _id: fromUser._id,                                             // 26
        username: fromUser.username                                    // 26
      }                                                                //
    });                                                                //
    return true;                                                       // 29
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=muteUserInRoom.coffee.js.map
