(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/registerUser.coffee.js                               //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  registerUser: function(formData) {                                   // 2
    var userData, userId;                                              // 3
    if (RocketChat.settings.get('Accounts_RegistrationForm') === 'Disabled') {
      throw new Meteor.Error('registration-disabled', 'User registration is disabled');
    } else if (RocketChat.settings.get('Accounts_RegistrationForm') === 'Secret URL' && (!formData.secretURL || formData.secretURL !== RocketChat.settings.get('Accounts_RegistrationForm_SecretURL'))) {
      throw new Meteor.Error('registration-disabled', 'User registration is only allowed via Secret URL');
    }                                                                  //
    RocketChat.validateEmailDomain(formData.email);                    // 3
    userData = {                                                       // 3
      email: s.trim(formData.email),                                   // 12
      password: formData.pass                                          // 12
    };                                                                 //
    userId = Accounts.createUser(userData);                            // 3
    RocketChat.models.Users.setName(userId, s.trim(formData.name));    // 3
    if (userData.email) {                                              // 19
      Accounts.sendVerificationEmail(userId, userData.email);          // 20
    }                                                                  //
    return userId;                                                     // 22
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=registerUser.coffee.js.map
