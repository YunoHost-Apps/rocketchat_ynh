(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/sendForgotPasswordEmail.coffee.js                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  sendForgotPasswordEmail: function(email) {                           // 2
    var user;                                                          // 3
    user = RocketChat.models.Users.findOneByEmailAddress(s.trim(email));
    if (user != null) {                                                // 5
      Accounts.sendResetPasswordEmail(user._id, s.trim(email));        // 6
      return true;                                                     // 7
    }                                                                  //
    return false;                                                      // 8
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=sendForgotPasswordEmail.coffee.js.map
