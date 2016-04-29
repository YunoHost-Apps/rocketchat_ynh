(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/sendConfirmationEmail.coffee.js                      //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  sendConfirmationEmail: function(email) {                             // 2
    var user;                                                          // 3
    user = RocketChat.models.Users.findOneByEmailAddress(s.trim(email));
    if (user != null) {                                                // 5
      Accounts.sendVerificationEmail(user._id, s.trim(email));         // 6
      return true;                                                     // 7
    }                                                                  //
    return false;                                                      // 8
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=sendConfirmationEmail.coffee.js.map
