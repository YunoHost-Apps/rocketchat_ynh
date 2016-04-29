(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v005.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 5,                                                          // 2
  up: function() {                                                     // 2
    console.log('Dropping test rooms with less than 2 messages');      // 5
    RocketChat.models.Rooms.find({                                     // 5
      msgs: {                                                          // 6
        '$lt': 2                                                       // 6
      }                                                                //
    }).forEach(function(room) {                                        //
      console.log('Dropped: ', room.name);                             // 7
      RocketChat.models.Rooms.removeById(room._id);                    // 7
      RocketChat.models.Messages.removeByRoomId(room._id);             // 7
      return RocketChat.models.Subscriptions.removeByRoomId(room._id);
    });                                                                //
    console.log('Dropping test rooms with less than 2 user');          // 5
    RocketChat.models.Rooms.find({                                     // 5
      usernames: {                                                     // 14
        '$size': 1                                                     // 14
      }                                                                //
    }).forEach(function(room) {                                        //
      console.log('Dropped: ', room.name);                             // 15
      RocketChat.models.Rooms.removeById(room._id);                    // 15
      RocketChat.models.Messages.removeByRoomId(room._id);             // 15
      return RocketChat.models.Subscriptions.removeByRoomId(room._id);
    });                                                                //
    console.log('Adding username to all users');                       // 5
    RocketChat.models.Users.find({                                     // 5
      'username': {                                                    // 22
        '$exists': 0                                                   // 22
      },                                                               //
      'emails': {                                                      // 22
        '$exists': 1                                                   // 22
      }                                                                //
    }).forEach(function(user) {                                        //
      var newUserName;                                                 // 23
      newUserName = user.emails[0].address.split("@")[0];              // 23
      if (RocketChat.models.Users.findOneByUsername(newUserName)) {    // 24
        newUserName = newUserName + Math.floor((Math.random() * 10) + 1);
        if (RocketChat.models.Users.findOneByUsername(newUserName)) {  // 26
          newUserName = newUserName + Math.floor((Math.random() * 10) + 1);
          if (RocketChat.models.Users.findOneByUsername(newUserName)) {
            newUserName = newUserName + Math.floor((Math.random() * 10) + 1);
          }                                                            //
        }                                                              //
      }                                                                //
      console.log('Adding: username ' + newUserName + ' to all user ' + user._id);
      return RocketChat.models.Users.setUsername(user._id, newUserName);
    });                                                                //
    console.log('Fixing _id of direct messages rooms');                // 5
    RocketChat.models.Rooms.findByType('d').forEach(function(room) {   // 5
      var id0, id1, ids, newId;                                        // 36
      newId = '';                                                      // 36
      id0 = RocketChat.models.Users.findOneByUsername(room.usernames[0])._id;
      id1 = RocketChat.models.Users.findOneByUsername(room.usernames[1])._id;
      ids = [id0, id1];                                                // 36
      newId = ids.sort().join('');                                     // 36
      if (newId !== room._id) {                                        // 41
        console.log('Fixing: _id ' + room._id + ' to ' + newId);       // 42
        RocketChat.models.Subscriptions.update({                       // 42
          'rid': room._id                                              // 43
        }, {                                                           //
          '$set': {                                                    // 43
            'rid': newId                                               // 43
          }                                                            //
        }, {                                                           //
          'multi': 1                                                   // 43
        });                                                            //
        RocketChat.models.Messages.update({                            // 42
          'rid': room._id                                              // 44
        }, {                                                           //
          '$set': {                                                    // 44
            'rid': newId                                               // 44
          }                                                            //
        }, {                                                           //
          'multi': 1                                                   // 44
        });                                                            //
        RocketChat.models.Rooms.removeById(room._id);                  // 42
        room._id = newId;                                              // 42
        RocketChat.models.Rooms.insert(room);                          // 42
      }                                                                //
      RocketChat.models.Subscriptions.update({                         // 36
        'rid': room._id,                                               // 48
        'u._id': id0                                                   // 48
      }, {                                                             //
        '$set': {                                                      // 48
          'name': room.usernames[1]                                    // 48
        }                                                              //
      });                                                              //
      return RocketChat.models.Subscriptions.update({                  //
        'rid': room._id,                                               // 49
        'u._id': id1                                                   // 49
      }, {                                                             //
        '$set': {                                                      // 49
          'name': room.usernames[0]                                    // 49
        }                                                              //
      });                                                              //
    });                                                                //
    console.log('Adding u.username to all documents');                 // 5
    RocketChat.models.Users.find({}, {                                 // 5
      'username': 1                                                    // 53
    }).forEach(function(user) {                                        //
      console.log('Adding: u.username ' + user.username + ' to all document');
      RocketChat.models.Rooms.update({                                 // 54
        'u._id': user._id                                              // 55
      }, {                                                             //
        '$set': {                                                      // 55
          'u.username': user.username                                  // 55
        }                                                              //
      }, {                                                             //
        'multi': 1                                                     // 55
      });                                                              //
      RocketChat.models.Subscriptions.update({                         // 54
        'u._id': user._id                                              // 56
      }, {                                                             //
        '$set': {                                                      // 56
          'u.username': user.username                                  // 56
        }                                                              //
      }, {                                                             //
        'multi': 1                                                     // 56
      });                                                              //
      RocketChat.models.Messages.update({                              // 54
        'u._id': user._id                                              // 57
      }, {                                                             //
        '$set': {                                                      // 57
          'u.username': user.username                                  // 57
        }                                                              //
      }, {                                                             //
        'multi': 1                                                     // 57
      });                                                              //
      RocketChat.models.Messages.update({                              // 54
        'uid': user._id                                                // 58
      }, {                                                             //
        '$set': {                                                      // 58
          'u': user                                                    // 58
        }                                                              //
      }, {                                                             //
        'multi': 1                                                     // 58
      });                                                              //
      RocketChat.models.Messages.update({                              // 54
        'by': user._id                                                 // 59
      }, {                                                             //
        '$set': {                                                      // 59
          'u': user                                                    // 59
        }                                                              //
      }, {                                                             //
        'multi': 1                                                     // 59
      });                                                              //
      return RocketChat.models.Messages.update({                       //
        'uid': {                                                       // 60
          '$exists': 1                                                 // 60
        }                                                              //
      }, {                                                             //
        '$unset': {                                                    // 60
          'uid': 1,                                                    // 60
          'by': 1                                                      // 60
        }                                                              //
      }, {                                                             //
        'multi': 1                                                     // 60
      });                                                              //
    });                                                                //
    return console.log('End');                                         //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v005.coffee.js.map
