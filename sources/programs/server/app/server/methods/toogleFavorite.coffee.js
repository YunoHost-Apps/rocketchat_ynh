(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/toogleFavorite.coffee.js                             //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  toggleFavorite: function(rid, f) {                                   // 2
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('invalid-user', "[methods] toggleFavorite -> Invalid user");
    }                                                                  //
    return RocketChat.models.Subscriptions.setFavoriteByRoomIdAndUserId(rid, Meteor.userId(), f);
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=toogleFavorite.coffee.js.map
