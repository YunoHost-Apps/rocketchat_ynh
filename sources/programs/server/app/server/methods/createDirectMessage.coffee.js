(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/createDirectMessage.coffee.js                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  createDirectMessage: function(username) {                            // 2
    var me, now, rid, to;                                              // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('invalid-user', "[methods] createDirectMessage -> Invalid user");
    }                                                                  //
    me = Meteor.user();                                                // 3
    if (!me.username) {                                                // 8
      throw new Meteor.Error('invalid-user', '[methods] createDirectMessage -> Invalid user');
    }                                                                  //
    if (me.username === username) {                                    // 11
      throw new Meteor.Error('invalid-user', "[methods] createDirectMessage -> Invalid target user");
    }                                                                  //
    to = RocketChat.models.Users.findOneByUsername(username);          // 3
    if (!to) {                                                         // 16
      throw new Meteor.Error('invalid-user', "[methods] createDirectMessage -> Invalid target user");
    }                                                                  //
    rid = [me._id, to._id].sort().join('');                            // 3
    now = new Date();                                                  // 3
    RocketChat.models.Rooms.upsert({                                   // 3
      _id: rid                                                         // 25
    }, {                                                               //
      $set: {                                                          // 27
        usernames: [me.username, to.username]                          // 28
      },                                                               //
      $setOnInsert: {                                                  // 27
        t: 'd',                                                        // 30
        msgs: 0,                                                       // 30
        ts: now                                                        // 30
      }                                                                //
    });                                                                //
    RocketChat.models.Subscriptions.upsert({                           // 3
      rid: rid,                                                        // 36
      $and: [                                                          // 36
        {                                                              //
          'u._id': me._id                                              // 37
        }                                                              //
      ]                                                                //
    }, {                                                               //
      $set: {                                                          // 39
        ts: now,                                                       // 40
        ls: now,                                                       // 40
        open: true                                                     // 40
      },                                                               //
      $setOnInsert: {                                                  // 39
        name: to.username,                                             // 44
        t: 'd',                                                        // 44
        alert: false,                                                  // 44
        unread: 0,                                                     // 44
        u: {                                                           // 44
          _id: me._id,                                                 // 49
          username: me.username                                        // 49
        }                                                              //
      }                                                                //
    });                                                                //
    RocketChat.models.Subscriptions.upsert({                           // 3
      rid: rid,                                                        // 54
      $and: [                                                          // 54
        {                                                              //
          'u._id': to._id                                              // 55
        }                                                              //
      ]                                                                //
    }, {                                                               //
      $setOnInsert: {                                                  // 57
        name: me.username,                                             // 58
        t: 'd',                                                        // 58
        open: false,                                                   // 58
        alert: false,                                                  // 58
        unread: 0,                                                     // 58
        u: {                                                           // 58
          _id: to._id,                                                 // 64
          username: to.username                                        // 64
        }                                                              //
      }                                                                //
    });                                                                //
    return {                                                           // 67
      rid: rid                                                         // 67
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=createDirectMessage.coffee.js.map
