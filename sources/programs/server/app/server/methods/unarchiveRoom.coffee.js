(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/unarchiveRoom.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  unarchiveRoom: function(rid) {                                       // 2
    var i, len, member, ref, results, room, username;                  // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'unarchiveRoom'                                        // 4
      });                                                              //
    }                                                                  //
    room = RocketChat.models.Rooms.findOneById(rid);                   // 3
    if (!room) {                                                       // 8
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {   // 9
        method: 'unarchiveRoom'                                        // 9
      });                                                              //
    }                                                                  //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'unarchive-room', room._id)) {
      throw new Meteor.Error('error-not-authorized', 'Not authorized', {
        method: 'unarchiveRoom'                                        // 12
      });                                                              //
    }                                                                  //
    RocketChat.models.Rooms.unarchiveById(rid);                        // 3
    ref = room.usernames;                                              // 16
    results = [];                                                      // 16
    for (i = 0, len = ref.length; i < len; i++) {                      //
      username = ref[i];                                               //
      member = RocketChat.models.Users.findOneByUsername(username, {   // 17
        fields: {                                                      // 17
          username: 1                                                  // 17
        }                                                              //
      });                                                              //
      if (member == null) {                                            // 18
        continue;                                                      // 19
      }                                                                //
      results.push(RocketChat.models.Subscriptions.unarchiveByRoomIdAndUserId(rid, member._id));
    }                                                                  // 16
    return results;                                                    //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=unarchiveRoom.coffee.js.map
