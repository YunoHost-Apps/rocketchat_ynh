(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v022.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 22,                                                         // 2
  up: function() {                                                     // 2
                                                                       // 4
    /*                                                                 // 4
    		 * Update message edit field                                     //
     */                                                                //
    RocketChat.models.Messages.upgradeEtsToEditAt();                   // 4
    return console.log('Updated old messages\' ets edited timestamp to new editedAt timestamp.');
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v022.coffee.js.map
