(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/roomSubscriptionsByRole.coffee.js               //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('roomSubscriptionsByRole', function(rid, role) {        // 1
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  if (RocketChat.authz.hasPermission(this.userId, 'view-other-user-channels') !== true) {
    return this.ready();                                               // 6
  }                                                                    //
  return RocketChat.models.Subscriptions.findByRoomIdAndRoles(rid, role, {
    fields: {                                                          // 9
      rid: 1,                                                          // 10
      name: 1,                                                         // 10
      roles: 1,                                                        // 10
      u: 1                                                             // 10
    },                                                                 //
    sort: {                                                            // 9
      name: 1                                                          // 14
    }                                                                  //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=roomSubscriptionsByRole.coffee.js.map
