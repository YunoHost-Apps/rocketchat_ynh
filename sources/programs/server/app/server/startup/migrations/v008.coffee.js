(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v008.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 8,                                                          // 2
  up: function() {                                                     // 2
    var ref, ref1, ref2, ref3, ref4, settings;                         // 4
    console.log('Load old settings record');                           // 4
    settings = RocketChat.models.Settings.findOne({                    // 4
      _id: 'settings'                                                  // 5
    });                                                                //
    if (settings) {                                                    // 6
      if (settings.CDN_PREFIX != null) {                               // 7
        RocketChat.models.Settings.insert({                            // 7
          _id: 'CDN_PREFIX',                                           // 7
          value: settings.CDN_PREFIX,                                  // 7
          type: 'string',                                              // 7
          group: 'General'                                             // 7
        });                                                            //
      }                                                                //
      if (((ref = settings.ENV) != null ? ref.MAIL_URL : void 0) != null) {
        RocketChat.models.Settings.insert({                            // 8
          _id: 'MAIL_URL',                                             // 8
          value: settings.ENV.MAIL_URL,                                // 8
          type: 'string',                                              // 8
          group: 'SMTP'                                                // 8
        });                                                            //
      }                                                                //
      if (settings.denyUnverifiedEmails != null) {                     // 9
        RocketChat.models.Settings.insert({                            // 9
          _id: 'Accounts_denyUnverifiedEmails',                        // 9
          value: settings.denyUnverifiedEmails,                        // 9
          type: 'boolean',                                             // 9
          group: 'Accounts'                                            // 9
        });                                                            //
      }                                                                //
      if (((ref1 = settings["public"]) != null ? (ref2 = ref1.avatarStore) != null ? ref2.type : void 0 : void 0) != null) {
        RocketChat.models.Settings.insert({                            // 10
          _id: 'avatarStore_type',                                     // 10
          value: settings["public"].avatarStore.type,                  // 10
          type: 'string',                                              // 10
          group: 'API'                                                 // 10
        });                                                            //
      }                                                                //
      if (((ref3 = settings["public"]) != null ? (ref4 = ref3.avatarStore) != null ? ref4.path : void 0 : void 0) != null) {
        RocketChat.models.Settings.insert({                            // 11
          _id: 'avatarStore_path',                                     // 11
          value: settings["public"].avatarStore.path,                  // 11
          type: 'string',                                              // 11
          group: 'API'                                                 // 11
        });                                                            //
      }                                                                //
      return RocketChat.models.Settings.remove({                       //
        _id: 'settings'                                                // 12
      });                                                              //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v008.coffee.js.map
