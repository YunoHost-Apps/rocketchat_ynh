(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/canAccessRoom.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  canAccessRoom: function(rid, userId) {                               // 2
    var canAccess, room, user;                                         // 3
    user = RocketChat.models.Users.findOneById(userId, {               // 3
      fields: {                                                        // 3
        username: 1                                                    // 3
      }                                                                //
    });                                                                //
    if (!(user != null ? user.username : void 0)) {                    // 5
      throw new Meteor.Error('not-logged-user', "[methods] canAccessRoom -> User doesn't have enough permissions");
    }                                                                  //
    if (!rid) {                                                        // 8
      throw new Meteor.Error('invalid-room', '[methods] canAccessRoom -> Cannot access empty room');
    }                                                                  //
    room = RocketChat.models.Rooms.findOneById(rid, {                  // 3
      fields: {                                                        // 11
        usernames: 1,                                                  // 11
        t: 1,                                                          // 11
        name: 1,                                                       // 11
        muted: 1                                                       // 11
      }                                                                //
    });                                                                //
    if (room) {                                                        // 13
      if (room.usernames.indexOf(user.username) !== -1) {              // 14
        canAccess = true;                                              // 15
      } else if (room.t === 'c') {                                     //
        canAccess = RocketChat.authz.hasPermission(userId, 'view-c-room');
      }                                                                //
      if (canAccess !== true) {                                        // 19
        return false;                                                  // 20
      } else {                                                         //
        return _.pick(room, ['_id', 't', 'name', 'usernames', 'muted']);
      }                                                                //
    } else {                                                           //
      throw new Meteor.Error('invalid-room', '[methods] canAccessRoom -> Room ID is invalid');
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=canAccessRoom.coffee.js.map
