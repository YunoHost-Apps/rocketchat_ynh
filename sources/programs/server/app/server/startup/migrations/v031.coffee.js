(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v031.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 31,                                                         // 2
  up: function() {                                                     // 2
    var changes, from, record, results, to;                            // 4
    changes = {                                                        // 4
      API_Analytics: 'GoogleTagManager_id'                             // 5
    };                                                                 //
    results = [];                                                      // 7
    for (from in changes) {                                            //
      to = changes[from];                                              //
      record = RocketChat.models.Settings.findOne({                    // 8
        _id: from                                                      // 8
      });                                                              //
      if (record != null) {                                            // 9
        delete record._id;                                             // 10
        RocketChat.models.Settings.upsert({                            // 10
          _id: to                                                      // 11
        }, record);                                                    //
      }                                                                //
      results.push(RocketChat.models.Settings.remove({                 // 8
        _id: from                                                      // 12
      }));                                                             //
    }                                                                  // 7
    return results;                                                    //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v031.coffee.js.map
