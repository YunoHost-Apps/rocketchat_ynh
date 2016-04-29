(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/privateHistory.coffee.js                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('privateHistory', function() {                          // 1
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  return RocketChat.models.Rooms.findByContainigUsername(RocketChat.models.Users.findOneById(this.userId).username, {
    fields: {                                                          // 6
      t: 1,                                                            // 7
      name: 1,                                                         // 7
      msgs: 1,                                                         // 7
      ts: 1,                                                           // 7
      lm: 1,                                                           // 7
      cl: 1                                                            // 7
    }                                                                  //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=privateHistory.coffee.js.map
