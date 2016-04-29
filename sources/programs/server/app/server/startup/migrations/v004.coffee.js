(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v004.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 4,                                                          // 2
  up: function() {                                                     // 2
    RocketChat.models.Messages.tryDropIndex('rid_1');                  // 5
    RocketChat.models.Subscriptions.tryDropIndex('u._id_1');           // 5
    console.log('Rename rn to name');                                  // 5
    RocketChat.models.Subscriptions.update({                           // 5
      rn: {                                                            // 10
        $exists: true                                                  // 10
      }                                                                //
    }, {                                                               //
      $rename: {                                                       // 10
        rn: 'name'                                                     // 10
      }                                                                //
    }, {                                                               //
      multi: true                                                      // 10
    });                                                                //
    console.log('Adding names to rooms without name');                 // 5
    RocketChat.models.Rooms.find({                                     // 5
      name: ''                                                         // 14
    }).forEach(function(item) {                                        //
      var name;                                                        // 15
      name = Random.id().toLowerCase();                                // 15
      RocketChat.models.Rooms.setNameById(item._id, name);             // 15
      return RocketChat.models.Subscriptions.update({                  //
        rid: item._id                                                  // 17
      }, {                                                             //
        $set: {                                                        // 17
          name: name                                                   // 17
        }                                                              //
      }, {                                                             //
        multi: true                                                    // 17
      });                                                              //
    });                                                                //
    console.log('Making room names unique');                           // 5
    RocketChat.models.Rooms.find().forEach(function(room) {            // 5
      return RocketChat.models.Rooms.find({                            //
        name: room.name,                                               // 22
        _id: {                                                         // 22
          $ne: room._id                                                // 22
        }                                                              //
      }).forEach(function(item) {                                      //
        var name;                                                      // 23
        name = room.name + '-' + Random.id(2).toLowerCase();           // 23
        RocketChat.models.Rooms.setNameById(item._id, name);           // 23
        return RocketChat.models.Subscriptions.update({                //
          rid: item._id                                                // 25
        }, {                                                           //
          $set: {                                                      // 25
            name: name                                                 // 25
          }                                                            //
        }, {                                                           //
          multi: true                                                  // 25
        });                                                            //
      });                                                              //
    });                                                                //
    return console.log('End');                                         //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v004.coffee.js.map
