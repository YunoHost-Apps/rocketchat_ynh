(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v019.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 19,                                                         // 2
  up: function() {                                                     // 2
                                                                       // 4
    /*                                                                 // 4
    		 * Migrate existing admin users to Role based admin functionality
    		 * 'admin' role applies to global scope                          //
     */                                                                //
    var admins, rooms, usernames, users;                               // 4
    admins = Meteor.users.find({                                       // 4
      admin: true                                                      // 8
    }, {                                                               //
      fields: {                                                        // 8
        _id: 1,                                                        // 8
        username: 1                                                    // 8
      }                                                                //
    }).fetch();                                                        //
    RocketChat.authz.addUsersToRoles(_.pluck(admins, '_id'), ['admin']);
    Meteor.users.update({}, {                                          // 4
      $unset: {                                                        // 10
        admin: ''                                                      // 10
      }                                                                //
    }, {                                                               //
      multi: true                                                      // 10
    });                                                                //
    usernames = _.pluck(admins, 'username').join(', ');                // 4
    console.log(("Migrate " + usernames + " from admin field to 'admin' role").green);
    users = Meteor.users.find().fetch();                               // 4
    RocketChat.authz.addUsersToRoles(_.pluck(users, '_id'), ['user']);
    usernames = _.pluck(users, 'username').join(', ');                 // 4
    console.log(("Add " + usernames + " to 'user' role").green);       // 4
    rooms = RocketChat.models.Rooms.findByTypes(['c', 'p']).fetch();   // 4
    return _.each(rooms, function(room) {                              //
      var creator, ref;                                                // 23
      creator = room != null ? (ref = room.u) != null ? ref._id : void 0 : void 0;
      if (creator) {                                                   // 24
        if (Meteor.users.findOne({                                     // 25
          _id: creator                                                 // 25
        })) {                                                          //
          return RocketChat.authz.addUsersToRoles(creator, ['moderator'], room._id);
        } else {                                                       //
          RocketChat.models.Subscriptions.removeByRoomId(room._id);    // 28
          RocketChat.models.Messages.removeByRoomId(room._id);         // 28
          return RocketChat.models.Rooms.removeById(room._id);         //
        }                                                              //
      }                                                                //
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v019.coffee.js.map
