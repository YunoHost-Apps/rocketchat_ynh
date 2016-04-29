(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/saveUserProfile.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  saveUserProfile: function(settings) {                                // 2
    var passCheck, profile, ref, ref1, ref2, ref3, user;               // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'saveUserProfile'                                      // 4
      });                                                              //
    }                                                                  //
    user = RocketChat.models.Users.findOneById(Meteor.userId());       // 3
    if (s.trim(user != null ? (ref = user.services) != null ? (ref1 = ref.password) != null ? ref1.bcrypt : void 0 : void 0 : void 0) && !settings.currentPassword) {
      throw new Meteor.Error('error-invalid-password', 'Invalid password', {
        method: 'saveUserProfile'                                      // 9
      });                                                              //
    }                                                                  //
    if (!RocketChat.settings.get("Accounts_AllowUserProfileChange")) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 12
        method: 'saveUserProfile'                                      // 12
      });                                                              //
    }                                                                  //
    if (s.trim(user != null ? (ref2 = user.services) != null ? (ref3 = ref2.password) != null ? ref3.bcrypt : void 0 : void 0 : void 0)) {
      passCheck = Accounts._checkPassword(user, {                      // 15
        digest: settings.currentPassword,                              // 15
        algorithm: 'sha-256'                                           // 15
      });                                                              //
      if (passCheck.error) {                                           // 16
        throw new Meteor.Error('error-invalid-password', 'Invalid password', {
          method: 'saveUserProfile'                                    // 17
        });                                                            //
      }                                                                //
    }                                                                  //
    if (settings.newPassword != null) {                                // 19
      Accounts.setPassword(Meteor.userId(), settings.newPassword, {    // 20
        logout: false                                                  // 20
      });                                                              //
    }                                                                  //
    if (settings.realname != null) {                                   // 22
      Meteor.call('setRealName', settings.realname);                   // 23
    }                                                                  //
    if (settings.username != null) {                                   // 25
      Meteor.call('setUsername', settings.username);                   // 26
    }                                                                  //
    if (settings.email != null) {                                      // 28
      Meteor.call('setEmail', settings.email);                         // 29
    }                                                                  //
    profile = {};                                                      // 3
    RocketChat.models.Users.setProfile(Meteor.userId(), profile);      // 3
    return true;                                                       // 35
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=saveUserProfile.coffee.js.map
