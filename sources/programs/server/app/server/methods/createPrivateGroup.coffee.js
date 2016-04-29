(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/createPrivateGroup.coffee.js                         //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  createPrivateGroup: function(name, members) {                        // 2
    var extra, i, len, me, member, nameValidation, now, room, username;
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('invalid-user', "[methods] createPrivateGroup -> Invalid user");
    }                                                                  //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'create-p')) {
      throw new Meteor.Error('not-authorized', '[methods] createPrivateGroup -> Not authorized');
    }                                                                  //
    try {                                                              // 9
      nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$');
    } catch (_error) {                                                 //
      nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$');                // 12
    }                                                                  //
    if (!nameValidation.test(name)) {                                  // 14
      throw new Meteor.Error('name-invalid');                          // 15
    }                                                                  //
    now = new Date();                                                  // 3
    me = Meteor.user();                                                // 3
    members.push(me.username);                                         // 3
    if (RocketChat.models.Rooms.findOneByName(name)) {                 // 26
      if (RocketChat.models.Rooms.findOneByName(name).archived) {      // 27
        throw new Meteor.Error('archived-duplicate-name');             // 28
      } else {                                                         //
        throw new Meteor.Error('duplicate-name');                      // 30
      }                                                                //
    }                                                                  //
    room = RocketChat.models.Rooms.createWithTypeNameUserAndUsernames('p', name, me, members, {
      ts: now                                                          // 34
    });                                                                //
    for (i = 0, len = members.length; i < len; i++) {                  // 36
      username = members[i];                                           //
      member = RocketChat.models.Users.findOneByUsername(username, {   // 37
        fields: {                                                      // 37
          username: 1                                                  // 37
        }                                                              //
      });                                                              //
      if (member == null) {                                            // 38
        continue;                                                      // 39
      }                                                                //
      extra = {};                                                      // 37
      if (username === me.username) {                                  // 43
        extra.ls = now;                                                // 44
      } else {                                                         //
        extra.alert = true;                                            // 46
      }                                                                //
      RocketChat.models.Subscriptions.createWithRoomAndUser(room, member, extra);
    }                                                                  // 36
    RocketChat.authz.addUserRoles(Meteor.userId(), ['owner'], room._id);
    return {                                                           // 53
      rid: room._id                                                    // 53
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=createPrivateGroup.coffee.js.map
