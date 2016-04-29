(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/userAutocomplete.coffee.js                      //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('userAutocomplete', function(selector) {                // 1
  var cursorHandle, exceptions, options, pub;                          // 2
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  pub = this;                                                          // 2
  options = {                                                          // 2
    fields: {                                                          // 8
      name: 1,                                                         // 9
      username: 1,                                                     // 9
      status: 1                                                        // 9
    },                                                                 //
    limit: 10,                                                         // 8
    sort: {                                                            // 8
      name: 1                                                          // 14
    }                                                                  //
  };                                                                   //
  exceptions = selector.exceptions || [];                              // 2
  cursorHandle = RocketChat.models.Users.findActiveByUsernameRegexWithExceptions(selector.username, exceptions, options).observeChanges({
    added: function(_id, record) {                                     // 19
      return pub.added("autocompleteRecords", _id, record);            //
    },                                                                 //
    changed: function(_id, record) {                                   // 19
      return pub.changed("autocompleteRecords", _id, record);          //
    },                                                                 //
    removed: function(_id, record) {                                   // 19
      return pub.removed("autocompleteRecords", _id, record);          //
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

//# sourceMappingURL=userAutocomplete.coffee.js.map
