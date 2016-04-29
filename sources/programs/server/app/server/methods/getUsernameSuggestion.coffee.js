(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/getUsernameSuggestion.coffee.js                      //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var slug, usernameIsAvaliable;                                         // 1
                                                                       //
slug = function(text) {                                                // 1
  text = slugify(text, '.');                                           // 2
  return text.replace(/[^0-9a-z-_.]/g, '');                            // 3
};                                                                     // 1
                                                                       //
usernameIsAvaliable = function(username) {                             // 1
  if (username.length < 1) {                                           // 6
    return false;                                                      // 7
  }                                                                    //
  if (username === 'all') {                                            // 9
    return false;                                                      // 10
  }                                                                    //
  return !RocketChat.models.Users.findOneByUsername({                  // 12
    $regex: new RegExp("^" + username + "$", "i")                      // 12
  });                                                                  //
};                                                                     // 5
                                                                       //
this.generateSuggestion = function(user) {                             // 1
  var email, first, i, index, item, j, k, last, len, len1, len2, nameParts, ref, ref1, ref2, ref3, ref4, ref5, service, serviceName, username, usernames;
  usernames = [];                                                      // 15
  username = void 0;                                                   // 15
  if (Meteor.settings["public"].sandstorm) {                           // 18
    usernames.push(user.services.sandstorm.preferredHandle);           // 19
  }                                                                    //
  if (RocketChat.settings.get('UTF8_Names_Slugify')) {                 // 21
    usernames.push(slug(user.name));                                   // 22
  } else {                                                             //
    usernames.push(user.name);                                         // 24
  }                                                                    //
  nameParts = user != null ? (ref = user.name) != null ? ref.split(' ') : void 0 : void 0;
  if (nameParts.length > 1) {                                          // 27
    first = nameParts[0];                                              // 28
    last = nameParts[nameParts.length - 1];                            // 28
    if (RocketChat.settings.get('UTF8_Names_Slugify')) {               // 31
      usernames.push(slug(first[0] + last));                           // 32
      usernames.push(slug(first + last[0]));                           // 32
    } else {                                                           //
      usernames.push(first[0] + last);                                 // 35
      usernames.push(first + last[0]);                                 // 35
    }                                                                  //
  }                                                                    //
  if (((ref1 = user.profile) != null ? ref1.name : void 0) != null) {  // 38
    if (RocketChat.settings.get('UTF8_Names_Slugify')) {               // 39
      usernames.push(slug(user.profile.name));                         // 40
    } else {                                                           //
      usernames.push(user.profile.name);                               // 42
    }                                                                  //
  }                                                                    //
  if (user.services != null) {                                         // 44
    ref2 = user.services;                                              // 45
    for (serviceName in ref2) {                                        // 45
      service = ref2[serviceName];                                     //
      if (service.name != null) {                                      // 46
        if (RocketChat.settings.get('UTF8_Names_Slugify')) {           // 47
          usernames.push(slug(service.name));                          // 48
        } else {                                                       //
          usernames.push(service.name);                                // 50
        }                                                              //
      } else if (service.username != null) {                           //
        if (RocketChat.settings.get('UTF8_Names_Slugify')) {           // 52
          usernames.push(slug(service.username));                      // 53
        } else {                                                       //
          usernames.push(service.username);                            // 55
        }                                                              //
      }                                                                //
    }                                                                  // 45
  }                                                                    //
  if (((ref3 = user.emails) != null ? ref3.length : void 0) > 0) {     // 57
    ref4 = user.emails;                                                // 58
    for (i = 0, len = ref4.length; i < len; i++) {                     // 58
      email = ref4[i];                                                 //
      if ((email.address != null) && email.verified === true) {        //
        usernames.push(slug(email.address.replace(/@.+$/, '')));       // 59
      }                                                                //
    }                                                                  // 58
    ref5 = user.emails;                                                // 61
    for (j = 0, len1 = ref5.length; j < len1; j++) {                   // 61
      email = ref5[j];                                                 //
      if ((email.address != null) && email.verified === true) {        //
        usernames.push(slug(email.address.replace(/(.+)@(\w+).+/, '$1.$2')));
      }                                                                //
    }                                                                  // 61
  }                                                                    //
  for (k = 0, len2 = usernames.length; k < len2; k++) {                // 64
    item = usernames[k];                                               //
    if (usernameIsAvaliable(item)) {                                   // 65
      username = item;                                                 // 66
      break;                                                           // 67
    }                                                                  //
  }                                                                    // 64
  if ((usernames[0] != null) && usernames[0].length > 0) {             // 69
    index = 0;                                                         // 70
    while (username == null) {                                         // 71
      index++;                                                         // 72
      if (usernameIsAvaliable(usernames[0] + '-' + index)) {           // 73
        username = usernames[0] + '-' + index;                         // 74
      }                                                                //
    }                                                                  //
  }                                                                    //
  if (usernameIsAvaliable(username)) {                                 // 76
    return username;                                                   // 77
  }                                                                    //
  return void 0;                                                       // 79
};                                                                     // 14
                                                                       //
RocketChat.generateUsernameSuggestion = generateSuggestion;            // 1
                                                                       //
Meteor.methods({                                                       // 1
  getUsernameSuggestion: function() {                                  // 83
    var user;                                                          // 84
    if (!Meteor.userId()) {                                            // 84
      throw new Meteor.Error(403, "[methods] getUsernameSuggestion -> Invalid user");
    }                                                                  //
    user = Meteor.user();                                              // 84
    return generateSuggestion(user);                                   // 88
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=getUsernameSuggestion.coffee.js.map
