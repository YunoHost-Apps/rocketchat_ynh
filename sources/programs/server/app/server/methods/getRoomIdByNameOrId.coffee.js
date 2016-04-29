(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/getRoomIdByNameOrId.coffee.js                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  getRoomIdByNameOrId: function(rid) {                                 // 2
    var room;                                                          // 4
    room = RocketChat.models.Rooms.findOneById(rid);                   // 4
    if (room == null) {                                                // 6
      room = RocketChat.models.Rooms.findOneByName(rid);               // 7
    }                                                                  //
    if (room != null) {                                                // 9
      rid = room._id;                                                  // 10
    }                                                                  //
    return rid;                                                        // 12
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=getRoomIdByNameOrId.coffee.js.map
