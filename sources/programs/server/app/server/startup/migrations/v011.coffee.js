(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v011.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 11,                                                         // 2
  up: function() {                                                     // 2
                                                                       // 4
    /*                                                                 // 4
    		 * Set GENERAL room to be default                                //
     */                                                                //
    RocketChat.models.Rooms.update({                                   // 4
      _id: 'GENERAL'                                                   // 8
    }, {                                                               //
      $set: {                                                          // 8
        "default": true                                                // 8
      }                                                                //
    });                                                                //
    return console.log("Set GENERAL room to be default");              //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v011.coffee.js.map
