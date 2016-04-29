(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/lib/accounts.coffee.js                                       //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var accountsConfig, resetPasswordText, verifyEmailText,                // 2
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                       //
accountsConfig = {                                                     // 2
  forbidClientAccountCreation: true,                                   // 2
  loginExpirationInDays: RocketChat.settings.get('Accounts_LoginExpiration')
};                                                                     //
                                                                       //
Accounts.config(accountsConfig);                                       // 2
                                                                       //
RocketChat.settings.get('Accounts_AllowedDomainsList', function(_id, value) {
  var domainWhiteList, restrictCreationByEmailDomain;                  // 6
  domainWhiteList = _.map(value.split(','), function(domain) {         // 6
    return domain.trim();                                              //
  });                                                                  //
  restrictCreationByEmailDomain = domainWhiteList.length === 1 ? domainWhiteList[0] : function(email) {
    var domain, i, len, ret;                                           // 8
    ret = false;                                                       // 8
    for (i = 0, len = domainWhiteList.length; i < len; i++) {          // 9
      domain = domainWhiteList[i];                                     //
      if (email.match('@' + RegExp.escape(domain) + '$')) {            // 10
        ret = true;                                                    // 11
        break;                                                         // 12
      }                                                                //
    }                                                                  // 9
    return ret;                                                        // 14
  };                                                                   //
  delete Accounts._options['restrictCreationByEmailDomain'];           // 6
  if (!_.isEmpty(value)) {                                             // 17
    return Accounts.config({                                           //
      restrictCreationByEmailDomain: restrictCreationByEmailDomain     // 18
    });                                                                //
  }                                                                    //
});                                                                    // 5
                                                                       //
Accounts.emailTemplates.siteName = RocketChat.settings.get('Site_Name');
                                                                       //
Accounts.emailTemplates.from = (RocketChat.settings.get('Site_Name')) + " <" + (RocketChat.settings.get('From_Email')) + ">";
                                                                       //
verifyEmailText = Accounts.emailTemplates.verifyEmail.text;            // 2
                                                                       //
Accounts.emailTemplates.verifyEmail.text = function(user, url) {       // 2
  url = url.replace(Meteor.absoluteUrl(), Meteor.absoluteUrl() + 'login/');
  return verifyEmailText(user, url);                                   //
};                                                                     // 24
                                                                       //
resetPasswordText = Accounts.emailTemplates.resetPassword.text;        // 2
                                                                       //
Accounts.emailTemplates.resetPassword.text = function(user, url) {     // 2
  url = url.replace(/\/#\//, '/');                                     // 30
  return resetPasswordText(user, url);                                 //
};                                                                     // 29
                                                                       //
if (RocketChat.settings.get('Accounts_Enrollment_Email')) {            // 33
  Accounts.emailTemplates.enrollAccount.text = function(user, url) {   // 34
    var ref, ref1, text;                                               // 35
    text = RocketChat.settings.get('Accounts_Enrollment_Email');       // 35
    text = text.replace(/\[name\]/g, user.name || '');                 // 35
    text = text.replace(/\[fname\]/g, _.strLeft(user.name, ' ') || '');
    text = text.replace(/\[lname\]/g, _.strRightBack(user.name, ' ') || '');
    text = text.replace(/\[email\]/g, ((ref = user.emails) != null ? (ref1 = ref[0]) != null ? ref1.address : void 0 : void 0) || '');
    return text;                                                       // 42
  };                                                                   //
}                                                                      //
                                                                       //
Accounts.onCreateUser(function(options, user) {                        // 2
  var ref, ref1, ref2, service, serviceName;                           // 49
  RocketChat.callbacks.run('beforeCreateUser', options, user);         // 49
  user.status = 'offline';                                             // 49
  user.active = !RocketChat.settings.get('Accounts_ManuallyApproveNewUsers');
  if (((user != null ? user.name : void 0) == null) || user.name === '') {
    if (((ref = options.profile) != null ? ref.name : void 0) != null) {
      user.name = (ref1 = options.profile) != null ? ref1.name : void 0;
    }                                                                  //
  }                                                                    //
  if (user.services != null) {                                         // 58
    ref2 = user.services;                                              // 59
    for (serviceName in ref2) {                                        // 59
      service = ref2[serviceName];                                     //
      if (((user != null ? user.name : void 0) == null) || user.name === '') {
        if (service.name != null) {                                    // 61
          user.name = service.name;                                    // 62
        } else if (service.username != null) {                         //
          user.name = service.username;                                // 64
        }                                                              //
      }                                                                //
      if ((user.emails == null) && (service.email != null)) {          // 66
        user.emails = [                                                // 67
          {                                                            //
            address: service.email,                                    // 68
            verified: true                                             // 68
          }                                                            //
        ];                                                             //
      }                                                                //
    }                                                                  // 59
  }                                                                    //
  return user;                                                         // 72
});                                                                    // 44
                                                                       //
Accounts.insertUserDoc = _.wrap(Accounts.insertUserDoc, function(insertUserDoc, options, user) {
  var _id, hasAdmin, roles;                                            // 76
  roles = [];                                                          // 76
  if (Match.test(user.globalRoles, [String]) && user.globalRoles.length > 0) {
    roles = roles.concat(user.globalRoles);                            // 78
  }                                                                    //
  delete user.globalRoles;                                             // 76
  if (user.type == null) {                                             //
    user.type = 'user';                                                //
  }                                                                    //
  _id = insertUserDoc.call(Accounts, options, user);                   // 76
  if (roles.length === 0) {                                            // 86
    hasAdmin = RocketChat.models.Users.findOne({                       // 88
      roles: 'admin'                                                   // 88
    }, {                                                               //
      fields: {                                                        // 88
        _id: 1                                                         // 88
      }                                                                //
    });                                                                //
    if (hasAdmin != null) {                                            // 89
      roles.push('user');                                              // 90
    } else {                                                           //
      roles.push('admin');                                             // 92
    }                                                                  //
  }                                                                    //
  RocketChat.authz.addUserRoles(_id, roles);                           // 76
  RocketChat.callbacks.run('afterCreateUser', options, user);          // 76
  return _id;                                                          // 97
});                                                                    // 75
                                                                       //
Accounts.validateLoginAttempt(function(login) {                        // 2
  var ref, ref1, validEmail;                                           // 100
  login = RocketChat.callbacks.run('beforeValidateLogin', login);      // 100
  if (login.allowed !== true) {                                        // 102
    return login.allowed;                                              // 103
  }                                                                    //
  if (!!((ref = login.user) != null ? ref.active : void 0) !== true) {
    throw new Meteor.Error('inactive-user', TAPi18n.__('User_is_not_activated'));
    return false;                                                      // 107
  }                                                                    //
  if (indexOf.call((ref1 = login.user) != null ? ref1.roles : void 0, 'admin') < 0 && login.type === 'password' && RocketChat.settings.get('Accounts_EmailVerification') === true) {
    validEmail = login.user.emails.filter(function(email) {            // 111
      return email.verified === true;                                  // 112
    });                                                                //
    if (validEmail.length === 0) {                                     // 114
      throw new Meteor.Error('no-valid-email');                        // 115
      return false;                                                    // 116
    }                                                                  //
  }                                                                    //
  RocketChat.models.Users.updateLastLoginById(login.user._id);         // 100
  Meteor.defer(function() {                                            // 100
    return RocketChat.callbacks.run('afterValidateLogin', login);      //
  });                                                                  //
  return true;                                                         // 123
});                                                                    // 99
                                                                       //
Accounts.validateNewUser(function(user) {                              // 2
  var ref;                                                             // 126
  if (RocketChat.settings.get('Accounts_Registration_AuthenticationServices_Enabled') === false && RocketChat.settings.get('LDAP_Enable') === false && (((ref = user.services) != null ? ref.password : void 0) == null)) {
    throw new Meteor.Error('registration-disabled-authentication-services', 'User registration is disabled for authentication services');
  }                                                                    //
  return true;                                                         // 128
});                                                                    // 125
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=accounts.coffee.js.map
