(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v026.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 26,                                                         // 2
  up: function() {                                                     // 2
    return RocketChat.models.Messages.update({                         //
      t: 'rm'                                                          // 4
    }, {                                                               //
      $set: {                                                          // 4
        mentions: []                                                   // 4
      }                                                                //
    }, {                                                               //
      multi: true                                                      // 4
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v026.coffee.js.map
