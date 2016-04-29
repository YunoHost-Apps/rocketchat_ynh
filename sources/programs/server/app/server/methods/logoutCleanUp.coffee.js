(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/logoutCleanUp.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  logoutCleanUp: function(user) {                                      // 2
    return Meteor.defer(function() {                                   //
      return RocketChat.callbacks.run('afterLogoutCleanUp', user);     //
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=logoutCleanUp.coffee.js.map
