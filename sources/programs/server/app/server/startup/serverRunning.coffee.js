(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/serverRunning.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                            // 1
  return Meteor.setTimeout(function() {                                //
    var msg;                                                           // 3
    msg = ["     Version: " + RocketChat.Info.version, "Process Port: " + process.env.PORT, "    Site URL: " + (RocketChat.settings.get('Site_Url'))].join('\n');
    return SystemLogger.startup_box(msg, 'SERVER RUNNING');            //
  }, 100);                                                             //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=serverRunning.coffee.js.map
