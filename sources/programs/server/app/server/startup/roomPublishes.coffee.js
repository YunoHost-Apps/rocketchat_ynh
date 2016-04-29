(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/roomPublishes.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                            // 1
  RocketChat.roomTypes.setPublish('c', function(identifier) {          // 2
    var options;                                                       // 3
    options = {                                                        // 3
      fields: {                                                        // 4
        name: 1,                                                       // 5
        t: 1,                                                          // 5
        cl: 1,                                                         // 5
        u: 1,                                                          // 5
        usernames: 1,                                                  // 5
        topic: 1,                                                      // 5
        muted: 1,                                                      // 5
        archived: 1                                                    // 5
      }                                                                //
    };                                                                 //
    return RocketChat.models.Rooms.findByTypeAndName('c', identifier, options);
  });                                                                  //
  RocketChat.roomTypes.setPublish('p', function(identifier) {          // 2
    var options, user;                                                 // 17
    options = {                                                        // 17
      fields: {                                                        // 18
        name: 1,                                                       // 19
        t: 1,                                                          // 19
        cl: 1,                                                         // 19
        u: 1,                                                          // 19
        usernames: 1,                                                  // 19
        topic: 1,                                                      // 19
        muted: 1,                                                      // 19
        archived: 1                                                    // 19
      }                                                                //
    };                                                                 //
    user = RocketChat.models.Users.findOneById(this.userId, {          // 17
      fields: {                                                        // 28
        username: 1                                                    // 28
      }                                                                //
    });                                                                //
    return RocketChat.models.Rooms.findByTypeAndNameContainigUsername('p', identifier, user.username, options);
  });                                                                  //
  return RocketChat.roomTypes.setPublish('d', function(identifier) {   //
    var options, user;                                                 // 32
    options = {                                                        // 32
      fields: {                                                        // 33
        name: 1,                                                       // 34
        t: 1,                                                          // 34
        cl: 1,                                                         // 34
        u: 1,                                                          // 34
        usernames: 1,                                                  // 34
        topic: 1                                                       // 34
      }                                                                //
    };                                                                 //
    user = RocketChat.models.Users.findOneById(this.userId, {          // 32
      fields: {                                                        // 40
        username: 1                                                    // 40
      }                                                                //
    });                                                                //
    return RocketChat.models.Rooms.findByTypeContainigUsernames('d', [user.username, identifier], options);
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=roomPublishes.coffee.js.map
