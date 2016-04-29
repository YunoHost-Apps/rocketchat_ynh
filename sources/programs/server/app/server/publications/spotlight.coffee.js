(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/spotlight.coffee.js                             //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('spotlight', function(selector, options, collName) {    // 1
  var ref, self, subHandleRooms, subHandleUsers;                       // 2
  if ((this.userId == null) || ((selector != null ? (ref = selector.name) != null ? ref.$regex : void 0 : void 0) == null)) {
    return this.ready();                                               // 3
  }                                                                    //
  self = this;                                                         // 2
  subHandleUsers = null;                                               // 2
  subHandleRooms = null;                                               // 2
  subHandleUsers = RocketChat.models.Users.findUsersByNameOrUsername(new RegExp(selector.name.$regex, 'i'), {
    limit: 10,                                                         // 9
    fields: {                                                          // 9
      name: 1,                                                         // 9
      username: 1,                                                     // 9
      status: 1                                                        // 9
    },                                                                 //
    sort: {                                                            // 9
      name: 1                                                          // 9
    }                                                                  //
  }).observeChanges({                                                  //
    added: function(id, fields) {                                      // 10
      var data;                                                        // 11
      data = {                                                         // 11
        type: 'u',                                                     // 11
        uid: id,                                                       // 11
        username: fields.username,                                     // 11
        name: fields.username + ' - ' + fields.name,                   // 11
        status: fields.status                                          // 11
      };                                                               //
      return self.added("autocompleteRecords", id, data);              //
    },                                                                 //
    removed: function(id) {                                            // 10
      return self.removed("autocompleteRecords", id);                  //
    }                                                                  //
  });                                                                  //
  subHandleRooms = RocketChat.models.Rooms.findByNameContainingAndTypes(selector.name.$regex, ['c'], {
    limit: 10,                                                         // 16
    fields: {                                                          // 16
      t: 1,                                                            // 16
      name: 1                                                          // 16
    },                                                                 //
    sort: {                                                            // 16
      name: 1                                                          // 16
    }                                                                  //
  }).observeChanges({                                                  //
    added: function(id, fields) {                                      // 17
      var data;                                                        // 18
      data = {                                                         // 18
        type: 'r',                                                     // 18
        rid: id,                                                       // 18
        name: fields.name,                                             // 18
        t: fields.t                                                    // 18
      };                                                               //
      return self.added("autocompleteRecords", id, data);              //
    },                                                                 //
    removed: function(id) {                                            // 17
      return self.removed("autocompleteRecords", id);                  //
    }                                                                  //
  });                                                                  //
  this.ready();                                                        // 2
  return this.onStop(function() {                                      //
    if (subHandleUsers != null) {                                      //
      subHandleUsers.stop();                                           //
    }                                                                  //
    return subHandleRooms != null ? subHandleRooms.stop() : void 0;    //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=spotlight.coffee.js.map
