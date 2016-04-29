(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/restapi/restapi.coffee.js                                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Api;                                                               // 1
                                                                       //
Api = new Restivus({                                                   // 1
  useDefaultAuth: true,                                                // 2
  prettyJson: true,                                                    // 2
  enableCors: false                                                    // 2
});                                                                    //
                                                                       //
Api.addRoute('info', {                                                 // 1
  authRequired: false                                                  // 7
}, {                                                                   //
  get: function() {                                                    // 8
    return RocketChat.Info;                                            //
  }                                                                    //
});                                                                    //
                                                                       //
Api.addRoute('version', {                                              // 1
  authRequired: false                                                  // 11
}, {                                                                   //
  get: function() {                                                    // 12
    var version;                                                       // 13
    version = {                                                        // 13
      api: '0.1',                                                      // 13
      rocketchat: '0.5'                                                // 13
    };                                                                 //
    return {                                                           //
      status: 'success',                                               // 14
      versions: version                                                // 14
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
Api.addRoute('publicRooms', {                                          // 1
  authRequired: true                                                   // 16
}, {                                                                   //
  get: function() {                                                    // 17
    var rooms;                                                         // 18
    rooms = RocketChat.models.Rooms.findByType('c', {                  // 18
      sort: {                                                          // 18
        msgs: -1                                                       // 18
      }                                                                //
    }).fetch();                                                        //
    return {                                                           //
      status: 'success',                                               // 19
      rooms: rooms                                                     // 19
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
Api.addRoute('rooms/:id/join', {                                       // 1
  authRequired: true                                                   // 22
}, {                                                                   //
  post: function() {                                                   // 23
    Meteor.runAsUser(this.userId, (function(_this) {                   // 24
      return function() {                                              //
        return Meteor.call('joinRoom', _this.urlParams.id);            //
      };                                                               //
    })(this));                                                         //
    return {                                                           //
      status: 'success'                                                // 26
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
Api.addRoute('rooms/:id/leave', {                                      // 1
  authRequired: true                                                   // 29
}, {                                                                   //
  post: function() {                                                   // 30
    Meteor.runAsUser(this.userId, (function(_this) {                   // 31
      return function() {                                              //
        return Meteor.call('leaveRoom', _this.urlParams.id);           //
      };                                                               //
    })(this));                                                         //
    return {                                                           //
      status: 'success'                                                // 33
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
Api.addRoute('rooms/:id/messages', {                                   // 1
  authRequired: true                                                   // 37
}, {                                                                   //
  get: function() {                                                    // 38
    var e, msgs;                                                       // 39
    try {                                                              // 39
      if (Meteor.call('canAccessRoom', this.urlParams.id, this.userId)) {
        msgs = RocketChat.models.Messages.findVisibleByRoomId(this.urlParams.id, {
          sort: {                                                      // 41
            ts: -1                                                     // 41
          },                                                           //
          limit: 50                                                    // 41
        }).fetch();                                                    //
        return {                                                       //
          status: 'success',                                           // 42
          messages: msgs                                               // 42
        };                                                             //
      } else {                                                         //
        return {                                                       //
          statusCode: 403,                                             // 44
          body: {                                                      // 44
            status: 'fail',                                            // 45
            message: 'Cannot access room.'                             // 45
          }                                                            //
        };                                                             //
      }                                                                //
    } catch (_error) {                                                 //
      e = _error;                                                      // 47
      return {                                                         //
        statusCode: 400,                                               // 47
        body: {                                                        // 47
          status: 'fail',                                              // 48
          message: e.name + ' :: ' + e.message                         // 48
        }                                                              //
      };                                                               //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
Api.addRoute('rooms/:id/send', {                                       // 1
  authRequired: true                                                   // 53
}, {                                                                   //
  post: function() {                                                   // 54
    Meteor.runAsUser(this.userId, (function(_this) {                   // 55
      return function() {                                              //
        console.log(_this.bodyParams.msg);                             // 56
        return Meteor.call('sendMessage', {                            //
          msg: _this.bodyParams.msg,                                   // 57
          rid: _this.urlParams.id                                      // 57
        });                                                            //
      };                                                               //
    })(this));                                                         //
    return {                                                           //
      status: 'success'                                                // 58
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
Api.testapiValidateUsers = function(users) {                           // 1
  var i, j, len, nameValidation, user;                                 // 63
  for (i = j = 0, len = users.length; j < len; i = ++j) {              // 63
    user = users[i];                                                   //
    if (user.name != null) {                                           // 64
      if (user.email != null) {                                        // 65
        if (user.pass != null) {                                       // 66
          try {                                                        // 67
            nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$', 'i');
          } catch (_error) {                                           //
            nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$', 'i');     // 70
          }                                                            //
          if (nameValidation.test(user.name)) {                        // 72
            if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+\b/i.test(user.email)) {
              continue;                                                // 74
            }                                                          //
          }                                                            //
        }                                                              //
      }                                                                //
    }                                                                  //
    throw new Meteor.Error('invalid-user-record', "[restapi] bulk/register -> record #" + i + " is invalid");
  }                                                                    // 63
};                                                                     // 62
                                                                       //
                                                                       // 79
/*                                                                     // 79
@api {post} /bulk/register  Register multiple users based on an input array.
@apiName register                                                      //
@apiGroup TestAndAdminAutomation                                       //
@apiVersion 0.0.1                                                      //
@apiDescription  Caller must have 'testagent' or 'adminautomation' role.
NOTE:   remove room is NOT recommended; use Meteor.reset() to clear db and re-seed instead
@apiParam {json} rooms An array of users in the body of the POST.      //
@apiParamExample {json} POST Request Body example:                     //
  {                                                                    //
    'users':[ {'email': 'user1@user1.com',                             //
               'name': 'user1',                                        //
               'pass': 'abc123' },                                     //
              {'email': 'user2@user2.com',                             //
               'name': 'user2',                                        //
               'pass': 'abc123'},                                      //
              ...                                                      //
            ]                                                          //
  }                                                                    //
@apiSuccess {json} ids An array of IDs of the registered users.        //
@apiSuccessExample {json} Success-Response:                            //
  HTTP/1.1 200 OK                                                      //
  {                                                                    //
    'ids':[ {'uid': 'uid_1'},                                          //
            {'uid': 'uid_2'},                                          //
            ...                                                        //
    ]                                                                  //
  }                                                                    //
 */                                                                    //
                                                                       //
Api.addRoute('bulk/register', {                                        // 1
  authRequired: true                                                   // 108
}, {                                                                   //
  post: {                                                              // 109
    action: function() {                                               // 112
      var e, endCount, i, ids, incoming, j, len, ref;                  // 113
      if (RocketChat.authz.hasPermission(this.userId, 'bulk-register-user')) {
        try {                                                          // 114
          Api.testapiValidateUsers(this.bodyParams.users);             // 116
          this.response.setTimeout(500 * this.bodyParams.users.length);
          ids = [];                                                    // 116
          endCount = this.bodyParams.users.length - 1;                 // 116
          ref = this.bodyParams.users;                                 // 120
          for (i = j = 0, len = ref.length; j < len; i = ++j) {        // 120
            incoming = ref[i];                                         //
            ids[i] = {                                                 // 121
              uid: Meteor.call('registerUser', incoming)               // 121
            };                                                         //
            Meteor.runAsUser(ids[i].uid, (function(_this) {            // 121
              return function() {                                      //
                Meteor.call('setUsername', incoming.name);             // 123
                return Meteor.call('joinDefaultChannels');             //
              };                                                       //
            })(this));                                                 //
          }                                                            // 120
          return {                                                     //
            status: 'success',                                         // 126
            ids: ids                                                   // 126
          };                                                           //
        } catch (_error) {                                             //
          e = _error;                                                  // 128
          return {                                                     //
            statusCode: 400,                                           // 128
            body: {                                                    // 128
              status: 'fail',                                          // 129
              message: e.name + ' :: ' + e.message                     // 129
            }                                                          //
          };                                                           //
        }                                                              //
      } else {                                                         //
        console.log('[restapi] bulk/register -> '.red, "User does not have 'bulk-register-user' permission");
        return {                                                       //
          statusCode: 403,                                             // 132
          body: {                                                      // 132
            status: 'error',                                           // 133
            message: 'You do not have permission to do this'           // 133
          }                                                            //
        };                                                             //
      }                                                                //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
Api.testapiValidateRooms = function(rooms) {                           // 1
  var i, j, len, nameValidation, room;                                 // 140
  for (i = j = 0, len = rooms.length; j < len; i = ++j) {              // 140
    room = rooms[i];                                                   //
    if (room.name != null) {                                           // 141
      if (room.members != null) {                                      // 142
        if (room.members.length > 1) {                                 // 143
          try {                                                        // 144
            nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$', 'i');
          } catch (_error) {                                           //
            nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$', 'i');     // 147
          }                                                            //
          if (nameValidation.test(room.name)) {                        // 149
            continue;                                                  // 150
          }                                                            //
        }                                                              //
      }                                                                //
    }                                                                  //
    throw new Meteor.Error('invalid-room-record', "[restapi] bulk/createRoom -> record #" + i + " is invalid");
  }                                                                    // 140
};                                                                     // 139
                                                                       //
                                                                       // 155
/*                                                                     // 155
@api {post} /bulk/createRoom Create multiple rooms based on an input array.
@apiName createRoom                                                    //
@apiGroup TestAndAdminAutomation                                       //
@apiVersion 0.0.1                                                      //
@apiParam {json} rooms An array of rooms in the body of the POST. 'name' is room name, 'members' is array of usernames
@apiParamExample {json} POST Request Body example:                     //
  {                                                                    //
    'rooms':[ {'name': 'room1',                                        //
               'members': ['user1', 'user2']                           //
  	      },                                                            //
  	      {'name': 'room2',                                             //
               'members': ['user1', 'user2', 'user3']                  //
              }                                                        //
              ...                                                      //
            ]                                                          //
  }                                                                    //
@apiDescription  Caller must have 'testagent' or 'adminautomation' role.
NOTE:   remove room is NOT recommended; use Meteor.reset() to clear db and re-seed instead
                                                                       //
@apiSuccess {json} ids An array of ids of the rooms created.           //
@apiSuccessExample {json} Success-Response:                            //
  HTTP/1.1 200 OK                                                      //
  {                                                                    //
    'ids':[ {'rid': 'rid_1'},                                          //
            {'rid': 'rid_2'},                                          //
            ...                                                        //
    ]                                                                  //
  }                                                                    //
 */                                                                    //
                                                                       //
Api.addRoute('bulk/createRoom', {                                      // 1
  authRequired: true                                                   // 185
}, {                                                                   //
  post: {                                                              // 186
    action: function() {                                               // 189
      var e, ids;                                                      // 192
      if (RocketChat.authz.hasPermission(this.userId, 'bulk-create-c')) {
        try {                                                          // 193
          this.response.setTimeout(1000 * this.bodyParams.rooms.length);
          Api.testapiValidateRooms(this.bodyParams.rooms);             // 194
          ids = [];                                                    // 194
          Meteor.runAsUser(this.userId, (function(_this) {             // 194
            return function() {                                        //
              var i, incoming, j, len, ref, results;                   // 198
              ref = _this.bodyParams.rooms;                            // 198
              results = [];                                            // 198
              for (i = j = 0, len = ref.length; j < len; i = ++j) {    //
                incoming = ref[i];                                     //
                results.push(ids[i] = Meteor.call('createChannel', incoming.name, incoming.members));
              }                                                        // 198
              return results;                                          //
            };                                                         //
          })(this));                                                   //
          return {                                                     //
            status: 'success',                                         // 199
            ids: ids                                                   // 199
          };                                                           //
        } catch (_error) {                                             //
          e = _error;                                                  // 201
          return {                                                     //
            statusCode: 400,                                           // 201
            body: {                                                    // 201
              status: 'fail',                                          // 202
              message: e.name + ' :: ' + e.message                     // 202
            }                                                          //
          };                                                           //
        }                                                              //
      } else {                                                         //
        console.log('[restapi] bulk/createRoom -> '.red, "User does not have 'bulk-create-c' permission");
        return {                                                       //
          statusCode: 403,                                             // 205
          body: {                                                      // 205
            status: 'error',                                           // 206
            message: 'You do not have permission to do this'           // 206
          }                                                            //
        };                                                             //
      }                                                                //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=restapi.coffee.js.map
