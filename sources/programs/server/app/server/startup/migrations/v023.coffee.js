(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v023.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 23,                                                         // 2
  up: function() {                                                     // 2
    RocketChat.models.Settings.remove({                                // 4
      _id: 'Accounts_denyUnverifiedEmails'                             // 4
    });                                                                //
    return console.log('Deleting not used setting Accounts_denyUnverifiedEmails');
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v023.coffee.js.map
