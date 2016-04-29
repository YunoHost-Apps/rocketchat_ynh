(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/eraseRoom.coffee.js                                  //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  eraseRoom: function(rid) {                                           // 2
    var fromId, ref, roomType;                                         // 3
    fromId = Meteor.userId();                                          // 3
    roomType = (ref = RocketChat.models.Rooms.findOneById(rid)) != null ? ref.t : void 0;
    if (RocketChat.authz.hasPermission(fromId, "delete-" + roomType, rid)) {
      RocketChat.models.Messages.removeByRoomId(rid);                  // 10
      RocketChat.models.Subscriptions.removeByRoomId(rid);             // 10
      return RocketChat.models.Rooms.removeById(rid);                  //
    } else {                                                           //
      throw new Meteor.Error('unauthorized');                          // 15
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=eraseRoom.coffee.js.map
