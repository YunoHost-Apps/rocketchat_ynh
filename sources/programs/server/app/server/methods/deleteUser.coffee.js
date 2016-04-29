(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/deleteUser.coffee.js                                 //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  deleteUser: function(userId) {                                       // 2
    var user;                                                          // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('invalid-user', "[methods] deleteUser -> Invalid user");
    }                                                                  //
    user = RocketChat.models.Users.findOneById(Meteor.userId());       // 3
    if (RocketChat.authz.hasPermission(Meteor.userId(), 'delete-user') !== true) {
      throw new Meteor.Error('not-authorized', '[methods] deleteUser -> Not authorized');
    }                                                                  //
    user = RocketChat.models.Users.findOneById(userId);                // 3
    if (user == null) {                                                // 12
      throw new Meteor.Error('not-found', '[methods] deleteUser -> User not found');
    }                                                                  //
    RocketChat.deleteUser(userId);                                     // 3
    return true;                                                       // 17
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=deleteUser.coffee.js.map
