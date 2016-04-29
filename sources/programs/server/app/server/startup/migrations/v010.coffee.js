(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v010.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 10,                                                         // 2
  up: function() {                                                     // 2
                                                                       // 4
    /*                                                                 // 4
    		 * Remove duplicated usernames from rooms                        //
     */                                                                //
    var count;                                                         // 4
    count = 0;                                                         // 4
    RocketChat.models.Rooms.find({                                     // 4
      'usernames.0': {                                                 // 9
        $exists: true                                                  // 9
      }                                                                //
    }, {                                                               //
      fields: {                                                        // 9
        usernames: 1                                                   // 9
      }                                                                //
    }).forEach(function(room) {                                        //
      var newUsernames;                                                // 10
      newUsernames = _.uniq(room.usernames);                           // 10
      if (newUsernames.length !== room.usernames.length) {             // 11
        count++;                                                       // 12
        return RocketChat.models.Rooms.update({                        //
          _id: room._id                                                // 13
        }, {                                                           //
          $set: {                                                      // 13
            usernames: newUsernames                                    // 13
          }                                                            //
        });                                                            //
      }                                                                //
    });                                                                //
    return console.log("Removed duplicated usernames from " + count + " rooms");
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v010.coffee.js.map
