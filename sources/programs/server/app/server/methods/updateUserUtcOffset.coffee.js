(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/updateUserUtcOffset.coffee.js                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  updateUserUtcOffset: function(utcOffset) {                           // 2
    if (this.userId == null) {                                         // 3
      return;                                                          // 4
    }                                                                  //
    this.unblock();                                                    // 3
    return RocketChat.models.Users.setUtcOffset(this.userId, utcOffset);
  }                                                                    //
});                                                                    //
                                                                       //
DDPRateLimiter.addRule({                                               // 1
  type: 'method',                                                      // 11
  name: 'updateUserUtcOffset',                                         // 11
  userId: function() {                                                 // 11
    return true;                                                       // 13
  }                                                                    //
}, 1, 60000);                                                          //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=updateUserUtcOffset.coffee.js.map
