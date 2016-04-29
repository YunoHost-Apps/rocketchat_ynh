(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/getAvatarSuggestion.coffee.js                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.getAvatarSuggestionForUser = function(user) {                     // 1
  var avatar, avatars, blob, e, email, i, j, k, len, len1, len2, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, result, validAvatars;
  avatars = [];                                                        // 2
  if ((((ref = user.services.facebook) != null ? ref.id : void 0) != null) && RocketChat.settings.get('Accounts_OAuth_Facebook')) {
    avatars.push({                                                     // 5
      service: 'facebook',                                             // 6
      url: "https://graph.facebook.com/" + user.services.facebook.id + "/picture?type=large"
    });                                                                //
  }                                                                    //
  if ((((ref1 = user.services.google) != null ? ref1.picture : void 0) != null) && user.services.google.picture !== "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg" && RocketChat.settings.get('Accounts_OAuth_Google')) {
    avatars.push({                                                     // 10
      service: 'google',                                               // 11
      url: user.services.google.picture                                // 11
    });                                                                //
  }                                                                    //
  if ((((ref2 = user.services.github) != null ? ref2.username : void 0) != null) && RocketChat.settings.get('Accounts_OAuth_Github')) {
    avatars.push({                                                     // 15
      service: 'github',                                               // 16
      url: "https://avatars.githubusercontent.com/" + user.services.github.username + "?s=200"
    });                                                                //
  }                                                                    //
  if ((((ref3 = user.services.linkedin) != null ? ref3.pictureUrl : void 0) != null) && RocketChat.settings.get('Accounts_OAuth_Linkedin')) {
    avatars.push({                                                     // 20
      service: 'linkedin',                                             // 21
      url: user.services.linkedin.pictureUrl                           // 21
    });                                                                //
  }                                                                    //
  if ((((ref4 = user.services.twitter) != null ? ref4.profile_image_url_https : void 0) != null) && RocketChat.settings.get('Accounts_OAuth_Twitter')) {
    avatars.push({                                                     // 25
      service: 'twitter',                                              // 26
      url: user.services.twitter.profile_image_url_https               // 26
    });                                                                //
  }                                                                    //
  if ((((ref5 = user.services.gitlab) != null ? ref5.avatar_url : void 0) != null) && RocketChat.settings.get('Accounts_OAuth_Gitlab')) {
    avatars.push({                                                     // 30
      service: 'gitlab',                                               // 31
      url: user.services.gitlab.avatar_url                             // 31
    });                                                                //
  }                                                                    //
  if ((((ref6 = user.services.sandstorm) != null ? ref6.picture : void 0) != null) && Meteor.settings["public"].sandstorm) {
    avatars.push({                                                     // 35
      service: 'sandstorm',                                            // 36
      url: user.services.sandstorm.picture                             // 36
    });                                                                //
  }                                                                    //
  if (((ref7 = user.emails) != null ? ref7.length : void 0) > 0) {     // 39
    ref8 = user.emails;                                                // 40
    for (i = 0, len = ref8.length; i < len; i++) {                     // 40
      email = ref8[i];                                                 //
      if (email.verified === true) {                                   //
        avatars.push({                                                 // 41
          service: 'gravatar',                                         // 42
          url: Gravatar.imageUrl(email.address, {                      // 42
            "default": '404',                                          // 43
            size: 200,                                                 // 43
            secure: true                                               // 43
          })                                                           //
        });                                                            //
      }                                                                //
    }                                                                  // 40
    ref9 = user.emails;                                                // 45
    for (j = 0, len1 = ref9.length; j < len1; j++) {                   // 45
      email = ref9[j];                                                 //
      if (email.verified !== true) {                                   //
        avatars.push({                                                 // 46
          service: 'gravatar',                                         // 47
          url: Gravatar.imageUrl(email.address, {                      // 47
            "default": '404',                                          // 48
            size: 200,                                                 // 48
            secure: true                                               // 48
          })                                                           //
        });                                                            //
      }                                                                //
    }                                                                  // 45
  }                                                                    //
  validAvatars = {};                                                   // 2
  for (k = 0, len2 = avatars.length; k < len2; k++) {                  // 51
    avatar = avatars[k];                                               //
    try {                                                              // 52
      result = HTTP.get(avatar.url, {                                  // 53
        npmRequestOptions: {                                           // 53
          encoding: 'binary'                                           // 53
        }                                                              //
      });                                                              //
      if (result.statusCode === 200) {                                 // 54
        blob = "data:" + result.headers['content-type'] + ";base64,";  // 55
        blob += Buffer(result.content, 'binary').toString('base64');   // 55
        avatar.blob = blob;                                            // 55
        avatar.contentType = result.headers['content-type'];           // 55
        validAvatars[avatar.service] = avatar;                         // 55
      }                                                                //
    } catch (_error) {                                                 //
      e = _error;                                                      // 60
    }                                                                  //
  }                                                                    // 51
  return validAvatars;                                                 // 63
};                                                                     // 1
                                                                       //
Meteor.methods({                                                       // 1
  getAvatarSuggestion: function() {                                    // 67
    var user;                                                          // 68
    if (!Meteor.userId()) {                                            // 68
      throw new Meteor.Error(203, '[methods] getAvatarSuggestion -> Usuário não logado');
    }                                                                  //
    this.unblock();                                                    // 68
    user = Meteor.user();                                              // 68
    return getAvatarSuggestionForUser(user);                           //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=getAvatarSuggestion.coffee.js.map
