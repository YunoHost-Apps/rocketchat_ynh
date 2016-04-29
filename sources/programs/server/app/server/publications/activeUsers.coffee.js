(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/activeUsers.coffee.js                           //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('activeUsers', function() {                             // 1
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  return RocketChat.models.Users.findUsersNotOffline({                 //
    fields: {                                                          // 6
      username: 1,                                                     // 7
      status: 1,                                                       // 7
      utcOffset: 1                                                     // 7
    }                                                                  //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=activeUsers.coffee.js.map
