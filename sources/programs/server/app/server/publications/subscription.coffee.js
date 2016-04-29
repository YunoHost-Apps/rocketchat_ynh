(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/subscription.coffee.js                          //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('subscription', function() {                            // 1
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  return RocketChat.models.Subscriptions.findByUserId(this.userId, {   //
    fields: {                                                          // 6
      t: 1,                                                            // 7
      ts: 1,                                                           // 7
      ls: 1,                                                           // 7
      name: 1,                                                         // 7
      rid: 1,                                                          // 7
      f: 1,                                                            // 7
      open: 1,                                                         // 7
      alert: 1,                                                        // 7
      unread: 1,                                                       // 7
      archived: 1,                                                     // 7
      desktopNotifications: 1,                                         // 7
      mobilePushNotifications: 1,                                      // 7
      emailNotifications: 1                                            // 7
    }                                                                  //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=subscription.coffee.js.map
