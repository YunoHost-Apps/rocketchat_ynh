(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v027.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 27,                                                         // 2
  up: function() {                                                     // 2
    RocketChat.models.Users.update({}, {                               // 4
      $rename: {                                                       // 4
        roles: '_roles'                                                // 4
      }                                                                //
    }, {                                                               //
      multi: true                                                      // 4
    });                                                                //
    RocketChat.models.Users.find({                                     // 4
      _roles: {                                                        // 6
        $exists: 1                                                     // 6
      }                                                                //
    }).forEach(function(user) {                                        //
      var ref, results, roles, scope;                                  // 7
      ref = user._roles;                                               // 7
      results = [];                                                    // 7
      for (scope in ref) {                                             //
        roles = ref[scope];                                            //
        results.push(RocketChat.models.Roles.addUserRoles(user._id, roles, scope));
      }                                                                // 7
      return results;                                                  //
    });                                                                //
    return RocketChat.models.Users.update({}, {                        //
      $unset: {                                                        // 10
        _roles: 1                                                      // 10
      }                                                                //
    }, {                                                               //
      multi: true                                                      // 10
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v027.coffee.js.map
