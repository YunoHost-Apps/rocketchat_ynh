(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/removeRoomOwner.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  removeRoomOwner: function(rid, userId) {                             // 2
    var fromUser, numOwners, subscription, user;                       // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'removeRoomOwner'                                      // 4
      });                                                              //
    }                                                                  //
    check(rid, String);                                                // 3
    check(userId, String);                                             // 3
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'set-owner', rid)) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 10
        method: 'removeRoomOwner'                                      // 10
      });                                                              //
    }                                                                  //
    subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, userId);
    if (subscription == null) {                                        // 13
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {   // 14
        method: 'removeRoomOwner'                                      // 14
      });                                                              //
    }                                                                  //
    numOwners = RocketChat.authz.getUsersInRole('owner', rid).count();
    if (numOwners === 1) {                                             // 17
      throw new Meteor.Error('error-remove-last-owner', 'This is the last owner. Please set a new owner before removing this one.', {
        method: 'removeRoomOwner'                                      // 18
      });                                                              //
    }                                                                  //
    RocketChat.models.Subscriptions.removeRoleById(subscription._id, 'owner');
    user = RocketChat.models.Users.findOneById(userId);                // 3
    fromUser = RocketChat.models.Users.findOneById(Meteor.userId());   // 3
    RocketChat.models.Messages.createSubscriptionRoleRemovedWithRoomIdAndUser(rid, user, {
      u: {                                                             // 25
        _id: fromUser._id,                                             // 26
        username: fromUser.username                                    // 26
      },                                                               //
      role: 'owner'                                                    // 25
    });                                                                //
    RocketChat.Notifications.notifyAll('roles-change', {               // 3
      type: 'removed',                                                 // 30
      _id: 'owner',                                                    // 30
      u: {                                                             // 30
        _id: user._id,                                                 // 30
        username: user.username                                        // 30
      },                                                               //
      scope: rid                                                       // 30
    });                                                                //
    return true;                                                       // 32
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=removeRoomOwner.coffee.js.map
