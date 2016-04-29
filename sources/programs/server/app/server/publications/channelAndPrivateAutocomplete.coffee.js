(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/channelAndPrivateAutocomplete.coffee.js         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('channelAndPrivateAutocomplete', function(selector) {   // 1
  var cursorHandle, options, pub;                                      // 2
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  if (RocketChat.authz.hasPermission(this.userId, 'view-other-user-channels') !== true) {
    return this.ready();                                               // 6
  }                                                                    //
  pub = this;                                                          // 2
  options = {                                                          // 2
    fields: {                                                          // 11
      _id: 1,                                                          // 12
      name: 1                                                          // 12
    },                                                                 //
    limit: 10,                                                         // 11
    sort: {                                                            // 11
      name: 1                                                          // 16
    }                                                                  //
  };                                                                   //
  cursorHandle = RocketChat.models.Rooms.findByNameStartingAndTypes(selector.name, ['c', 'p'], options).observeChanges({
    added: function(_id, record) {                                     // 19
      return pub.added('autocompleteRecords', _id, record);            //
    },                                                                 //
    changed: function(_id, record) {                                   // 19
      return pub.changed('autocompleteRecords', _id, record);          //
    },                                                                 //
    removed: function(_id, record) {                                   // 19
      return pub.removed('autocompleteRecords', _id, record);          //
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

//# sourceMappingURL=channelAndPrivateAutocomplete.coffee.js.map
