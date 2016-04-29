(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v034.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 34,                                                         // 2
  up: function() {                                                     // 2
    return RocketChat.models.Settings.update({                         //
      _id: 'Layout_Login_Header',                                      // 5
      value: '<a class="logo" href="/"><img src="/assets/logo/logo.svg?v=3" /></a>'
    }, {                                                               //
      $set: {                                                          // 8
        value: '<a class="logo" href="/"><img src="/assets/logo?v=3" /></a>'
      }                                                                //
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v034.coffee.js.map
