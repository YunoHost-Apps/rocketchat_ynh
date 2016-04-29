(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v032.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 32,                                                         // 2
  up: function() {                                                     // 2
    return RocketChat.models.Settings.update({                         //
      '_id': /Accounts_OAuth_Custom_/                                  // 4
    }, {                                                               //
      $set: {                                                          // 4
        'group': 'OAuth'                                               // 4
      }                                                                //
    }, {                                                               //
      multi: true                                                      // 4
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v032.coffee.js.map
