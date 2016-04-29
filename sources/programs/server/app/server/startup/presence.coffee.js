(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/presence.coffee.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                            // 1
  InstanceStatus.registerInstance('rocket.chat', {                     // 2
    port: process.env.PORT                                             // 2
  });                                                                  //
  UserPresence.start();                                                // 2
  return UserPresenceMonitor.start();                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=presence.coffee.js.map
