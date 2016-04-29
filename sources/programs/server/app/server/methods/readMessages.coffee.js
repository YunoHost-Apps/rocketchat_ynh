(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/readMessages.coffee.js                               //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  readMessages: function(rid) {                                        // 2
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('invalid-user', '[methods] readMessages -> Invalid user');
    }                                                                  //
    return RocketChat.models.Subscriptions.setAsReadByRoomIdAndUserId(rid, Meteor.userId());
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=readMessages.coffee.js.map
