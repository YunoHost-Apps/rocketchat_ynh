(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/roomFiles.coffee.js                             //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('roomFiles', function(rid, limit) {                     // 1
  var cursorFileListHandle, pub;                                       // 2
  if (limit == null) {                                                 //
    limit = 50;                                                        //
  }                                                                    //
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  pub = this;                                                          // 2
  cursorFileListHandle = RocketChat.models.Uploads.findNotHiddenFilesOfRoom(rid, limit).observeChanges({
    added: function(_id, record) {                                     // 8
      return pub.added('room_files', _id, record);                     //
    },                                                                 //
    changed: function(_id, record) {                                   // 8
      return pub.changed('room_files', _id, record);                   //
    },                                                                 //
    removed: function(_id, record) {                                   // 8
      return pub.removed('room_files', _id, record);                   //
    }                                                                  //
  });                                                                  //
  this.ready();                                                        // 2
  return this.onStop(function() {                                      //
    return cursorFileListHandle.stop();                                //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=roomFiles.coffee.js.map
