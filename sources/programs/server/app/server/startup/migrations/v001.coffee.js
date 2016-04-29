(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v001.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 1,                                                          // 2
  up: function() {                                                     // 2
    return RocketChat.models.Users.find({                              //
      username: {                                                      // 4
        $exists: false                                                 // 4
      },                                                               //
      lastLogin: {                                                     // 4
        $exists: true                                                  // 4
      }                                                                //
    }).forEach(function(user) {                                        //
      var username;                                                    // 5
      username = generateSuggestion(user);                             // 5
      if ((username != null) && username.trim() !== '') {              // 6
        return RocketChat.models.Users.setUsername(user._id, username);
      } else {                                                         //
        return console.log("User without username", JSON.stringify(user, null, ' '));
      }                                                                //
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v001.coffee.js.map
