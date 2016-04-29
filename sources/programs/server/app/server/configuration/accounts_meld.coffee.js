(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/configuration/accounts_meld.coffee.js                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var orig_updateOrCreateUserFromExternalService;                        // 1
                                                                       //
orig_updateOrCreateUserFromExternalService = Accounts.updateOrCreateUserFromExternalService;
                                                                       //
Accounts.updateOrCreateUserFromExternalService = function(serviceName, serviceData, options) {
  var email, i, len, ref, user;                                        // 4
  if ((serviceName !== 'facebook' && serviceName !== 'github' && serviceName !== 'gitlab' && serviceName !== 'google' && serviceName !== 'meteor-developer' && serviceName !== 'linkedin' && serviceName !== 'twitter' && serviceName !== 'sandstorm') && serviceData._OAuthCustom !== true) {
    return;                                                            // 5
  }                                                                    //
  if (serviceName === 'meteor-developer') {                            // 7
    if (_.isArray(serviceData != null ? serviceData.emails : void 0)) {
      serviceData.emails.sort(function(a, b) {                         // 9
        return a.primary !== true;                                     // 10
      });                                                              //
      ref = serviceData.emails;                                        // 12
      for (i = 0, len = ref.length; i < len; i++) {                    // 12
        email = ref[i];                                                //
        if (email.verified === true) {                                 // 13
          serviceData.email = email.address;                           // 14
          break;                                                       // 15
        }                                                              //
      }                                                                // 12
    }                                                                  //
  }                                                                    //
  if (serviceName === 'linkedin') {                                    // 17
    serviceData.email = serviceData.emailAddress;                      // 18
  }                                                                    //
  if (serviceData.email) {                                             // 20
    user = RocketChat.models.Users.findOneByEmailAddress(serviceData.email);
    if (user != null) {                                                // 24
      if (!_.findWhere(user.emails, {                                  // 26
        address: serviceData.email,                                    // 26
        verified: true                                                 // 26
      })) {                                                            //
        RocketChat.models.Users.resetPasswordAndSetRequirePasswordChange(user._id, true, 'This_email_has_already_been_used_and_has_not_been_verified__Please_change_your_password');
      }                                                                //
      RocketChat.models.Users.setServiceId(user._id, serviceName, serviceData.id);
      RocketChat.models.Users.setEmailVerified(user._id, serviceData.email);
    }                                                                  //
  }                                                                    //
  return orig_updateOrCreateUserFromExternalService.apply(this, arguments);
};                                                                     // 2
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=accounts_meld.coffee.js.map
