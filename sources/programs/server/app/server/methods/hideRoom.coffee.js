(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/hideRoom.coffee.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  hideRoom: function(rid) {                                            // 2
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('invalid-user', '[methods] hideRoom -> Invalid user');
    }                                                                  //
    return RocketChat.models.Subscriptions.hideByRoomIdAndUserId(rid, Meteor.userId());
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=hideRoom.coffee.js.map
