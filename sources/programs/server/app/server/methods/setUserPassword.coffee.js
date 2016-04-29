(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/setUserPassword.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  setUserPassword: function(password) {                                // 2
    var user;                                                          // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('invalid-user', '[methods] setUserPassword -> Invalid user');
    }                                                                  //
    user = RocketChat.models.Users.findOneById(Meteor.userId());       // 3
    if (user && user.requirePasswordChange !== true) {                 // 7
      throw new Meteor.Error('not-authorized', '[methods] setUserPassword -> Not authorized');
    }                                                                  //
    Accounts.setPassword(Meteor.userId(), password, {                  // 3
      logout: false                                                    // 10
    });                                                                //
    return RocketChat.models.Users.unsetRequirePasswordChange(Meteor.userId());
    return true;                                                       // 13
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=setUserPassword.coffee.js.map
