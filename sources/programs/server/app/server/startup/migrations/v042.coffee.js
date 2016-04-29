(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v042.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 42,                                                         // 2
  up: function() {                                                     // 2
    var chunks, extension, files, from, list, oldFile, results, to;    // 4
    files = RocketChat.__migration_assets_files = new Mongo.Collection('assets.files');
    chunks = RocketChat.__migration_assets_chunks = new Mongo.Collection('assets.chunks');
    list = {                                                           // 4
      'favicon.ico': 'favicon_ico',                                    // 6
      'favicon.svg': 'favicon',                                        // 6
      'favicon_64.png': 'favicon_64',                                  // 6
      'favicon_96.png': 'favicon_96',                                  // 6
      'favicon_128.png': 'favicon_128',                                // 6
      'favicon_192.png': 'favicon_192',                                // 6
      'favicon_256.png': 'favicon_256'                                 // 6
    };                                                                 //
    results = [];                                                      // 16
    for (from in list) {                                               //
      to = list[from];                                                 //
      if (files.findOne({                                              // 17
        _id: to                                                        //
      }) == null) {                                                    //
        oldFile = files.findOne({                                      // 18
          _id: from                                                    // 18
        });                                                            //
        if (oldFile != null) {                                         // 19
          extension = RocketChat.Assets.mime.extension(oldFile.contentType);
          RocketChat.settings.removeById("Assets_" + from);            // 20
          RocketChat.settings.updateById("Assets_" + to, {             // 20
            url: "/assets/" + to + "." + extension,                    // 22
            defaultUrl: RocketChat.Assets.assets[to].defaultUrl        // 22
          });                                                          //
          oldFile._id = to;                                            // 20
          oldFile.filename = to;                                       // 20
          files.insert(oldFile);                                       // 20
          files.remove({                                               // 20
            _id: from                                                  // 29
          });                                                          //
          results.push(chunks.update({                                 // 20
            files_id: from                                             // 30
          }, {                                                         //
            $set: {                                                    // 30
              files_id: to                                             // 30
            }                                                          //
          }, {                                                         //
            multi: true                                                // 30
          }));                                                         //
        } else {                                                       //
          results.push(void 0);                                        //
        }                                                              //
      } else {                                                         //
        results.push(void 0);                                          //
      }                                                                //
    }                                                                  // 16
    return results;                                                    //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v042.coffee.js.map
