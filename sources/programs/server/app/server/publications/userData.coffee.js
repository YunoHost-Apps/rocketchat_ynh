(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/userData.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('userData', function() {                                // 1
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  return RocketChat.models.Users.find(this.userId, {                   //
    fields: {                                                          // 6
      name: 1,                                                         // 7
      username: 1,                                                     // 7
      status: 1,                                                       // 7
      statusDefault: 1,                                                // 7
      statusConnection: 1,                                             // 7
      avatarOrigin: 1,                                                 // 7
      utcOffset: 1,                                                    // 7
      language: 1,                                                     // 7
      settings: 1,                                                     // 7
      defaultRoom: 1,                                                  // 7
      'services.github': 1,                                            // 7
      'services.gitlab': 1,                                            // 7
      requirePasswordChange: 1,                                        // 7
      requirePasswordChangeReason: 1,                                  // 7
      'services.password.bcrypt': 1,                                   // 7
      statusLivechat: 1                                                // 7
    }                                                                  //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=userData.coffee.js.map
