(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v020.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 20,                                                         // 2
  up: function() {                                                     // 2
                                                                       // 4
    /*                                                                 // 4
    		 * Migrate existing `rocketchat_uploads` documents to include the room Id
    		 * where the file was uploaded to. The room Id is retrieved from the message
    		 * document created after the file upload.                       //
     */                                                                //
    var cursorFileMessages, msgOptions, msgQuery;                      // 4
    msgQuery = {                                                       // 4
      rid: {                                                           // 12
        $exists: true                                                  // 12
      },                                                               //
      'file._id': {                                                    // 12
        $exists: true                                                  // 13
      }                                                                //
    };                                                                 //
    msgOptions = {                                                     // 4
      fields: {                                                        // 15
        _id: 1,                                                        // 16
        rid: 1,                                                        // 16
        'file._id': 1                                                  // 16
      }                                                                //
    };                                                                 //
    cursorFileMessages = RocketChat.models.Messages.find(msgQuery, msgOptions);
    if (!cursorFileMessages.count()) {                                 // 20
      return;                                                          // 20
    }                                                                  //
    _.each(cursorFileMessages.fetch(), function(msg) {                 // 4
      var ref;                                                         // 23
      return RocketChat.models.Uploads.update({                        //
        _id: msg != null ? (ref = msg.file) != null ? ref._id : void 0 : void 0
      }, {                                                             //
        $set: {                                                        // 23
          rid: msg.rid                                                 // 23
        }                                                              //
      }, {                                                             //
        $multi: true                                                   // 23
      });                                                              //
    });                                                                //
    return console.log('Updated rocketchat_uploads documents to include the room Id in which they were sent.');
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v020.coffee.js.map
