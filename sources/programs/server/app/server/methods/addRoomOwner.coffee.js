(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/addRoomOwner.coffee.js                               //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  addRoomOwner: function(rid, userId) {                                // 2
    var fromUser, subscription, user;                                  // 3
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {   // 4
        method: 'addRoomOwner'                                         // 4
      });                                                              //
    }                                                                  //
    check(rid, String);                                                // 3
    check(userId, String);                                             // 3
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'set-owner', rid)) {
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {     // 10
        method: 'addRoomOwner'                                         // 10
      });                                                              //
    }                                                                  //
    subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, userId);
    if (subscription == null) {                                        // 13
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {   // 14
        method: 'addRoomOwner'                                         // 14
      });                                                              //
    }                                                                  //
    RocketChat.models.Subscriptions.addRoleById(subscription._id, 'owner');
    user = RocketChat.models.Users.findOneById(userId);                // 3
    fromUser = RocketChat.models.Users.findOneById(Meteor.userId());   // 3
    RocketChat.models.Messages.createSubscriptionRoleAddedWithRoomIdAndUser(rid, user, {
      u: {                                                             // 21
        _id: fromUser._id,                                             // 22
        username: fromUser.username                                    // 22
      },                                                               //
      role: 'owner'                                                    // 21
    });                                                                //
    RocketChat.Notifications.notifyAll('roles-change', {               // 3
      type: 'added',                                                   // 26
      _id: 'owner',                                                    // 26
      u: {                                                             // 26
        _id: user._id,                                                 // 26
        username: user.username                                        // 26
      },                                                               //
      scope: rid                                                       // 26
    });                                                                //
    return true;                                                       // 28
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=addRoomOwner.coffee.js.map
