(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v007.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 7,                                                          // 2
  up: function() {                                                     // 2
    var count, query;                                                  // 5
    console.log('Populate urls in messages');                          // 5
    query = RocketChat.models.Messages.find({                          // 5
      'urls.0': {                                                      // 6
        $exists: true                                                  // 6
      }                                                                //
    });                                                                //
    count = query.count();                                             // 5
    query.forEach(function(message, index) {                           // 5
      console.log((index + 1) + " / " + count);                        // 9
      message.urls = message.urls.map(function(url) {                  // 9
        if (_.isString(url)) {                                         // 12
          return {                                                     // 13
            url: url                                                   // 13
          };                                                           //
        }                                                              //
        return url;                                                    // 14
      });                                                              //
      return OEmbed.RocketUrlParser(message);                          //
    });                                                                //
    return console.log('End');                                         //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v007.coffee.js.map
