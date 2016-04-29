(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v021.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 21,                                                         // 2
  up: function() {                                                     // 2
                                                                       // 4
    /*                                                                 // 4
    		 * Remove any i18nLabel from rocketchat_settings                 //
    		 * They will be added again where necessary on next restart      //
     */                                                                //
    RocketChat.models.Settings.update({                                // 4
      i18nLabel: {                                                     // 9
        $exists: true                                                  // 9
      }                                                                //
    }, {                                                               //
      $unset: {                                                        // 9
        i18nLabel: 1                                                   // 9
      }                                                                //
    }, {                                                               //
      multi: true                                                      // 9
    });                                                                //
    return console.log('Removed i18nLabel from Settings. New labels will be added on next restart! Please restart your server.');
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v021.coffee.js.map
