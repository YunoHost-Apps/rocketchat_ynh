(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/room.coffee.js                                  //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('room', function(typeName) {                            // 1
  var name, type;                                                      // 2
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  if (typeof typeName !== 'string') {                                  // 5
    return this.ready();                                               // 6
  }                                                                    //
  type = typeName.substr(0, 1);                                        // 2
  name = typeName.substr(1);                                           // 2
  return RocketChat.roomTypes.runPublish.call(this, type, name);       // 11
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=room.coffee.js.map
