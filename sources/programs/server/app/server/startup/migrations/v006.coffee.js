(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v006.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 6,                                                          // 2
  up: function() {                                                     // 2
    var room;                                                          // 5
    console.log('Changin _id of #general channel room from XXX to GENERAL');
    room = RocketChat.models.Rooms.findOneByName('general');           // 5
    if ((room != null ? room._id : void 0) === !'GENERAL') {           // 7
      RocketChat.models.Subscriptions.update({                         // 8
        'rid': room._id                                                // 8
      }, {                                                             //
        '$set': {                                                      // 8
          'rid': 'GENERAL'                                             // 8
        }                                                              //
      }, {                                                             //
        'multi': 1                                                     // 8
      });                                                              //
      RocketChat.models.Messages.update({                              // 8
        'rid': room._id                                                // 9
      }, {                                                             //
        '$set': {                                                      // 9
          'rid': 'GENERAL'                                             // 9
        }                                                              //
      }, {                                                             //
        'multi': 1                                                     // 9
      });                                                              //
      RocketChat.models.Rooms.removeById(room._id);                    // 8
      delete room._id;                                                 // 8
      RocketChat.models.Rooms.upsert({                                 // 8
        '_id': 'GENERAL'                                               // 12
      }, {                                                             //
        $set: room                                                     // 12
      });                                                              //
    }                                                                  //
    return console.log('End');                                         //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v006.coffee.js.map
