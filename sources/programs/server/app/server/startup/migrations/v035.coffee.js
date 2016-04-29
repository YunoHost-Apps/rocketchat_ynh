(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v035.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 35,                                                         // 2
  up: function() {                                                     // 2
    return RocketChat.models.Messages.update({                         //
      'file._id': {                                                    // 5
        $exists: true                                                  // 5
      },                                                               //
      'attachments.title_link': {                                      // 5
        $exists: true                                                  // 6
      },                                                               //
      'attachments.title_link_download': {                             // 5
        $exists: false                                                 // 7
      }                                                                //
    }, {                                                               //
      $set: {                                                          // 9
        'attachments.$.title_link_download': true                      // 10
      }                                                                //
    }, {                                                               //
      multi: true                                                      // 12
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v035.coffee.js.map
