(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/channelsList.coffee.js                               //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  channelsList: function(filter, limit, sort) {                        // 2
    var options;                                                       // 3
    options = {                                                        // 3
      fields: {                                                        // 3
        name: 1                                                        // 3
      },                                                               //
      sort: {                                                          // 3
        msgs: -1                                                       // 3
      }                                                                //
    };                                                                 //
    if (_.isNumber(limit)) {                                           // 4
      options.limit = limit;                                           // 5
    }                                                                  //
    if (_.trim(sort)) {                                                // 6
      switch (sort) {                                                  // 7
        case 'name':                                                   // 7
          options.sort = {                                             // 9
            name: 1                                                    // 9
          };                                                           //
          break;                                                       // 8
        case 'msgs':                                                   // 7
          options.sort = {                                             // 11
            msgs: -1                                                   // 11
          };                                                           //
      }                                                                // 7
    }                                                                  //
    if (filter) {                                                      // 13
      return {                                                         // 14
        channels: RocketChat.models.Rooms.findByNameContainingAndTypes(filter, ['c'], options).fetch()
      };                                                               //
    } else {                                                           //
      return {                                                         // 16
        channels: RocketChat.models.Rooms.findByTypeAndArchivationState('c', false, options).fetch()
      };                                                               //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=channelsList.coffee.js.map
