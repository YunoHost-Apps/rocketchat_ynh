(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/messages.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('messages', function(rid, start) {                      // 1
  var cursor, cursorDelete, cursorDeleteHandle, cursorHandle, publication;
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  publication = this;                                                  // 2
  if (typeof rid !== 'string') {                                       // 7
    return this.ready();                                               // 8
  }                                                                    //
  if (!Meteor.call('canAccessRoom', rid, this.userId)) {               // 10
    return this.ready();                                               // 11
  }                                                                    //
  cursor = RocketChat.models.Messages.findVisibleByRoomId(rid, {       // 2
    sort: {                                                            // 14
      ts: -1                                                           // 15
    },                                                                 //
    limit: 50                                                          // 14
  });                                                                  //
  cursorHandle = cursor.observeChanges({                               // 2
    added: function(_id, record) {                                     // 19
      record.starred = _.findWhere(record.starred, {                   // 20
        _id: publication.userId                                        // 20
      });                                                              //
      return publication.added('rocketchat_message', _id, record);     //
    },                                                                 //
    changed: function(_id, record) {                                   // 19
      record.starred = _.findWhere(record.starred, {                   // 24
        _id: publication.userId                                        // 24
      });                                                              //
      return publication.changed('rocketchat_message', _id, record);   //
    }                                                                  //
  });                                                                  //
  cursorDelete = RocketChat.models.Messages.findInvisibleByRoomId(rid, {
    fields: {                                                          // 28
      _id: 1                                                           // 29
    }                                                                  //
  });                                                                  //
  cursorDeleteHandle = cursorDelete.observeChanges({                   // 2
    added: function(_id, record) {                                     // 32
      return publication.added('rocketchat_message', _id, {            //
        _hidden: true                                                  // 33
      });                                                              //
    },                                                                 //
    changed: function(_id, record) {                                   // 32
      return publication.added('rocketchat_message', _id, {            //
        _hidden: true                                                  // 35
      });                                                              //
    }                                                                  //
  });                                                                  //
  this.ready();                                                        // 2
  return this.onStop(function() {                                      //
    cursorHandle.stop();                                               // 39
    return cursorDeleteHandle.stop();                                  //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=messages.coffee.js.map
