(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v012.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 12,                                                         // 2
  up: function() {                                                     // 2
    var admin, oldestUser;                                             // 5
    admin = RocketChat.models.Users.findOneAdmin(true, {               // 5
      fields: {                                                        // 5
        _id: 1                                                         // 5
      }                                                                //
    });                                                                //
    if (!admin) {                                                      // 6
      oldestUser = RocketChat.models.Users.findOne({}, {               // 8
        fields: {                                                      // 8
          username: 1                                                  // 8
        },                                                             //
        sort: {                                                        // 8
          createdAt: 1                                                 // 8
        }                                                              //
      });                                                              //
      if (oldestUser) {                                                // 9
        Meteor.users.update({                                          // 10
          _id: oldestUser._id                                          // 10
        }, {                                                           //
          $set: {                                                      // 10
            admin: true                                                // 10
          }                                                            //
        });                                                            //
        return console.log("Set " + oldestUser.username + " as admin for being the oldest user");
      }                                                                //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v012.coffee.js.map
