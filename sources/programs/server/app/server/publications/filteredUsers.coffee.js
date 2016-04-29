(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/filteredUsers.coffee.js                         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('filteredUsers', function(filter) {                     // 1
  var cursorHandle, exp, options, pub;                                 // 2
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  if (!_.isObject(filter)) {                                           // 5
    return this.ready();                                               // 6
  }                                                                    //
  exp = new RegExp(filter.name, 'i');                                  // 2
  options = {                                                          // 2
    fields: {                                                          // 11
      username: 1                                                      // 12
    },                                                                 //
    sort: {                                                            // 11
      username: 1                                                      // 14
    },                                                                 //
    limit: 5                                                           // 11
  };                                                                   //
  pub = this;                                                          // 2
  cursorHandle = RocketChat.models.Users.findByActiveUsersUsernameExcept(exp, filter.except, options).observeChanges({
    added: function(_id, record) {                                     // 20
      return pub.added('filtered-users', _id, record);                 //
    },                                                                 //
    changed: function(_id, record) {                                   // 20
      return pub.changed('filtered-users', _id, record);               //
    },                                                                 //
    removed: function(_id, record) {                                   // 20
      return pub.removed('filtered-users', _id, record);               //
    }                                                                  //
  });                                                                  //
  this.ready();                                                        // 2
  this.onStop(function() {                                             // 2
    return cursorHandle.stop();                                        //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=filteredUsers.coffee.js.map
