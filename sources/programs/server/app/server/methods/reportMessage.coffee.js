(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/reportMessage.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  reportMessage: function(message, description) {                      // 2
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('invalid-user', "[methods] reportMessage -> Invalid user");
    }                                                                  //
    if ((description == null) || description.trim() === '') {          // 6
      throw new Meteor.Error('invalid-description', "[methods] reportMessage -> Invalid description");
    }                                                                  //
    return RocketChat.models.Reports.createWithMessageDescriptionAndUserId(message, description, Meteor.userId());
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=reportMessage.coffee.js.map
