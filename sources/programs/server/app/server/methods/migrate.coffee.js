(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/migrate.coffee.js                                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  migrateTo: function(version) {                                       // 2
    var user;                                                          // 3
    user = Meteor.user();                                              // 3
    if ((user == null) || RocketChat.authz.hasPermission(user._id, 'run-migration') !== true) {
      throw new Meteor.Error("not-authorized", '[methods] migrateTo');
    }                                                                  //
    this.unblock();                                                    // 3
    RocketChat.Migrations.migrateTo(version);                          // 3
    return version;                                                    // 10
  },                                                                   //
  getMigrationVersion: function() {                                    // 2
    return RocketChat.Migrations.getVersion();                         // 13
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=migrate.coffee.js.map
