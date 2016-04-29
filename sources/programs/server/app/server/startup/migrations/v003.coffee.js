(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v003.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 3,                                                          // 2
  up: function() {                                                     // 2
    RocketChat.models.Subscriptions.tryDropIndex('uid_1');             // 6
    RocketChat.models.Subscriptions.tryDropIndex('rid_1_uid_1');       // 6
    console.log('Fixing ChatSubscription uid');                        // 6
    RocketChat.models.Subscriptions.find({                             // 6
      uid: {                                                           // 11
        $exists: true                                                  // 11
      }                                                                //
    }, {                                                               //
      nonreactive: true                                                // 11
    }).forEach(function(sub) {                                         //
      var update, user;                                                // 12
      update = {};                                                     // 12
      user = RocketChat.models.Users.findOneById(sub.uid, {            // 12
        fields: {                                                      // 13
          username: 1                                                  // 13
        }                                                              //
      });                                                              //
      if (user != null) {                                              // 14
        if (update.$set == null) {                                     //
          update.$set = {};                                            //
        }                                                              //
        if (update.$unset == null) {                                   //
          update.$unset = {};                                          //
        }                                                              //
        update.$set['u._id'] = user._id;                               // 15
        update.$set['u.username'] = user.username;                     // 15
        update.$unset.uid = 1;                                         // 15
      }                                                                //
      if (Object.keys(update).length > 0) {                            // 21
        return RocketChat.models.Subscriptions.update(sub._id, update);
      }                                                                //
    });                                                                //
    console.log('Fixing ChatRoom uids');                               // 6
    RocketChat.models.Rooms.find({                                     // 6
      'uids.0': {                                                      // 26
        $exists: true                                                  // 26
      }                                                                //
    }, {                                                               //
      nonreactive: true                                                // 26
    }).forEach(function(room) {                                        //
      var k, oldId, ref, ref1, update, user, usernames, users, v;      // 27
      update = {};                                                     // 27
      users = RocketChat.models.Users.find({                           // 27
        _id: {                                                         // 28
          $in: room.uids                                               // 28
        },                                                             //
        username: {                                                    // 28
          $exists: true                                                // 28
        }                                                              //
      }, {                                                             //
        fields: {                                                      // 28
          username: 1                                                  // 28
        }                                                              //
      });                                                              //
      usernames = users.map(function(user) {                           // 27
        return user.username;                                          // 30
      });                                                              //
      if (update.$set == null) {                                       //
        update.$set = {};                                              //
      }                                                                //
      if (update.$unset == null) {                                     //
        update.$unset = {};                                            //
      }                                                                //
      update.$set.usernames = usernames;                               // 27
      update.$unset.uids = 1;                                          // 27
      user = RocketChat.models.Users.findOneById(room.uid, {           // 27
        fields: {                                                      // 37
          username: 1                                                  // 37
        }                                                              //
      });                                                              //
      if (user != null) {                                              // 38
        update.$set['u._id'] = user._id;                               // 39
        update.$set['u.username'] = user.username;                     // 39
        update.$unset.uid = 1;                                         // 39
      }                                                                //
      if (room.t === 'd' && usernames.length === 2) {                  // 43
        ref = update.$set;                                             // 44
        for (k in ref) {                                               // 44
          v = ref[k];                                                  //
          room[k] = v;                                                 // 45
        }                                                              // 44
        ref1 = update.$unset;                                          // 46
        for (k in ref1) {                                              // 46
          v = ref1[k];                                                 //
          delete room[k];                                              // 47
        }                                                              // 46
        oldId = room._id;                                              // 44
        room._id = usernames.sort().join(',');                         // 44
        RocketChat.models.Rooms.insert(room);                          // 44
        RocketChat.models.Rooms.removeById(oldId);                     // 44
        RocketChat.models.Subscriptions.update({                       // 44
          rid: oldId                                                   // 53
        }, {                                                           //
          $set: {                                                      // 53
            rid: room._id                                              // 53
          }                                                            //
        }, {                                                           //
          multi: true                                                  // 53
        });                                                            //
        return RocketChat.models.Messages.update({                     //
          rid: oldId                                                   // 54
        }, {                                                           //
          $set: {                                                      // 54
            rid: room._id                                              // 54
          }                                                            //
        }, {                                                           //
          multi: true                                                  // 54
        });                                                            //
      } else {                                                         //
        return RocketChat.models.Rooms.update(room._id, update);       //
      }                                                                //
    });                                                                //
    console.log('Fixing ChatMessage uid');                             // 6
    RocketChat.models.Messages.find({                                  // 6
      uid: {                                                           // 60
        $exists: true                                                  // 60
      }                                                                //
    }, {                                                               //
      nonreactive: true                                                // 60
    }).forEach(function(message) {                                     //
      var update, user;                                                // 61
      update = {};                                                     // 61
      user = RocketChat.models.Users.findOneById(message.uid, {        // 61
        fields: {                                                      // 62
          username: 1                                                  // 62
        }                                                              //
      });                                                              //
      if (user != null) {                                              // 63
        if (update.$set == null) {                                     //
          update.$set = {};                                            //
        }                                                              //
        if (update.$unset == null) {                                   //
          update.$unset = {};                                          //
        }                                                              //
        update.$set['u._id'] = user._id;                               // 64
        update.$set['u.username'] = user.username;                     // 64
        update.$unset.uid = 1;                                         // 64
      }                                                                //
      if (Object.keys(update).length > 0) {                            // 70
        return RocketChat.models.Messages.update(message._id, update);
      }                                                                //
    });                                                                //
    return console.log('End');                                         //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v003.coffee.js.map
