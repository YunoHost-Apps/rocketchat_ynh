(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v033.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 33,                                                         // 2
  up: function() {                                                     // 2
    var integrations, scriptAlert, update;                             // 4
    scriptAlert = "/**\n * This scrit is out-of-date, convert to the new format\n * (https://github.com/RocketChat/Rocket.Chat/wiki/WebHook-Scripting)\n**/\n\n";
    integrations = RocketChat.models.Integrations.find({               // 4
      $or: [                                                           // 6
        {                                                              //
          script: {                                                    // 8
            $exists: false                                             // 8
          },                                                           //
          processIncomingRequestScript: {                              // 8
            $exists: true                                              // 8
          }                                                            //
        }, {                                                           //
          script: {                                                    // 9
            $exists: false                                             // 9
          },                                                           //
          prepareOutgoingRequestScript: {                              // 9
            $exists: true                                              // 9
          }                                                            //
        }, {                                                           //
          script: {                                                    // 10
            $exists: false                                             // 10
          },                                                           //
          processOutgoingResponseScript: {                             // 10
            $exists: true                                              // 10
          }                                                            //
        }                                                              //
      ]                                                                //
    }).fetch();                                                        //
    integrations.forEach(function(integration) {                       // 4
      var script;                                                      // 16
      script = '';                                                     // 16
      if (integration.processIncomingRequestScript) {                  // 17
        script += integration.processIncomingRequestScript + '\n\n';   // 18
      }                                                                //
      if (integration.prepareOutgoingRequestScript) {                  // 20
        script += integration.prepareOutgoingRequestScript + '\n\n';   // 21
      }                                                                //
      if (integration.processOutgoingResponseScript) {                 // 23
        script += integration.processOutgoingResponseScript + '\n\n';  // 24
      }                                                                //
      return RocketChat.models.Integrations.update(integration._id, {  //
        $set: {                                                        // 27
          script: scriptAlert + script.replace(/^/gm, '// ')           // 28
        }                                                              //
      });                                                              //
    });                                                                //
    update = {                                                         // 4
      $unset: {                                                        // 32
        processIncomingRequestScript: 1,                               // 33
        prepareOutgoingRequestScript: 1,                               // 33
        processOutgoingResponseScript: 1                               // 33
      }                                                                //
    };                                                                 //
    RocketChat.models.Integrations.update({}, update, {                // 4
      multi: true                                                      // 37
    });                                                                //
    update = {                                                         // 4
      $set: {                                                          // 40
        enabled: true                                                  // 41
      }                                                                //
    };                                                                 //
    return RocketChat.models.Integrations.update({                     //
      enabled: {                                                       // 43
        $exists: false                                                 // 43
      }                                                                //
    }, update, {                                                       //
      multi: true                                                      // 43
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v033.coffee.js.map
