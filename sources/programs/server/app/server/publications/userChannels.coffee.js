(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/userChannels.coffee.js                          //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('userChannels', function(userId) {                      // 1
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  if (RocketChat.authz.hasPermission(this.userId, 'view-other-user-channels') !== true) {
    return this.ready();                                               // 6
  }                                                                    //
  return RocketChat.models.Subscriptions.findByUserId(userId, {        //
    fields: {                                                          // 9
      rid: 1,                                                          // 10
      name: 1,                                                         // 10
      t: 1,                                                            // 10
      u: 1                                                             // 10
    },                                                                 //
    sort: {                                                            // 9
      t: 1,                                                            // 14
      name: 1                                                          // 14
    }                                                                  //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=userChannels.coffee.js.map
