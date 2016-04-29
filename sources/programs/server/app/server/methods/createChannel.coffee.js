(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/createChannel.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                       //
Meteor.methods({                                                       // 1
  createChannel: function(name, members) {                             // 2
    var extra, i, len, member, nameValidation, now, ref, room, user, username;
    if (!Meteor.userId()) {                                            // 3
      throw new Meteor.Error('invalid-user', "[methods] createChannel -> Invalid user");
    }                                                                  //
    try {                                                              // 6
      nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$');
    } catch (_error) {                                                 //
      nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$');                // 9
    }                                                                  //
    if (!nameValidation.test(name)) {                                  // 11
      throw new Meteor.Error('name-invalid');                          // 12
    }                                                                  //
    if (RocketChat.authz.hasPermission(Meteor.userId(), 'create-c') !== true) {
      throw new Meteor.Error('not-authorized', '[methods] createChannel -> Not authorized');
    }                                                                  //
    now = new Date();                                                  // 3
    user = Meteor.user();                                              // 3
    if (ref = user.username, indexOf.call(members, ref) < 0) {         // 20
      members.push(user.username);                                     // 20
    }                                                                  //
    if (RocketChat.models.Rooms.findOneByName(name)) {                 // 23
      if (RocketChat.models.Rooms.findOneByName(name).archived) {      // 24
        throw new Meteor.Error('archived-duplicate-name');             // 25
      } else {                                                         //
        throw new Meteor.Error('duplicate-name');                      // 27
      }                                                                //
    }                                                                  //
    RocketChat.callbacks.run('beforeCreateChannel', user, {            // 3
      t: 'c',                                                          // 32
      name: name,                                                      // 32
      ts: now,                                                         // 32
      usernames: members,                                              // 32
      u: {                                                             // 32
        _id: user._id,                                                 // 37
        username: user.username                                        // 37
      }                                                                //
    });                                                                //
    room = RocketChat.models.Rooms.createWithTypeNameUserAndUsernames('c', name, user, members, {
      ts: now                                                          // 42
    });                                                                //
    for (i = 0, len = members.length; i < len; i++) {                  // 44
      username = members[i];                                           //
      member = RocketChat.models.Users.findOneByUsername(username);    // 45
      if (member == null) {                                            // 46
        continue;                                                      // 47
      }                                                                //
      extra = {};                                                      // 45
      if (username === user.username) {                                // 51
        extra.ls = now;                                                // 52
        extra.open = true;                                             // 52
      }                                                                //
      RocketChat.models.Subscriptions.createWithRoomAndUser(room, member, extra);
    }                                                                  // 44
    RocketChat.authz.addUserRoles(Meteor.userId(), ['owner'], room._id);
    Meteor.defer(function() {                                          // 3
      return RocketChat.callbacks.run('afterCreateChannel', user, room);
    });                                                                //
    return {                                                           // 63
      rid: room._id                                                    // 63
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=createChannel.coffee.js.map
