(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/getTotalChannels.coffee.js                           //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  getTotalChannels: function() {                                       // 2
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('invalid-user', '[methods] getTotalChannels -> Invalid user');
    }                                                                  //
    return RocketChat.models.Rooms.find({                              // 6
      t: 'c'                                                           // 6
    }).count();                                                        //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=getTotalChannels.coffee.js.map
