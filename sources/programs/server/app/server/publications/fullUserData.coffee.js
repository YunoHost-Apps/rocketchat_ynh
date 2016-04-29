(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/publications/fullUserData.coffee.js                          //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('fullUserData', function(filter, limit) {               // 1
  var fields, filterReg, options;                                      // 2
  if (!this.userId) {                                                  // 2
    return this.ready();                                               // 3
  }                                                                    //
  fields = {                                                           // 2
    name: 1,                                                           // 6
    username: 1,                                                       // 6
    status: 1,                                                         // 6
    utcOffset: 1,                                                      // 6
    type: 1                                                            // 6
  };                                                                   //
  if (RocketChat.authz.hasPermission(this.userId, 'view-full-other-user-info') === true) {
    fields = _.extend(fields, {                                        // 13
      emails: 1,                                                       // 14
      phone: 1,                                                        // 14
      statusConnection: 1,                                             // 14
      createdAt: 1,                                                    // 14
      lastLogin: 1,                                                    // 14
      active: 1,                                                       // 14
      services: 1,                                                     // 14
      requirePasswordChange: 1,                                        // 14
      requirePasswordChangeReason: 1,                                  // 14
      roles: 1                                                         // 14
    });                                                                //
  } else {                                                             //
    limit = 1;                                                         // 25
  }                                                                    //
  filter = s.trim(filter);                                             // 2
  if (!filter && limit === 1) {                                        // 29
    return this.ready();                                               // 30
  }                                                                    //
  options = {                                                          // 2
    fields: fields,                                                    // 33
    limit: limit,                                                      // 33
    sort: {                                                            // 33
      username: 1                                                      // 35
    }                                                                  //
  };                                                                   //
  if (filter) {                                                        // 37
    if (limit === 1) {                                                 // 38
      return RocketChat.models.Users.findByUsername(filter, options);  // 39
    } else {                                                           //
      filterReg = new RegExp(filter, "i");                             // 41
      return RocketChat.models.Users.findByUsernameNameOrEmailAddress(filterReg, options);
    }                                                                  //
  }                                                                    //
  return RocketChat.models.Users.find({}, options);                    // 44
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=fullUserData.coffee.js.map
