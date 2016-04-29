(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v025.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 25,                                                         // 2
  up: function() {                                                     // 2
    return RocketChat.models.Settings.update({                         //
      _id: /Accounts_OAuth_Custom/                                     // 4
    }, {                                                               //
      $set: {                                                          // 4
        persistent: true                                               // 4
      },                                                               //
      $unset: {                                                        // 4
        hidden: true                                                   // 4
      }                                                                //
    }, {                                                               //
      multi: true                                                      // 4
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v025.coffee.js.map
