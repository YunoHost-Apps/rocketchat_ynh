(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomType.coffee.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomType = function(rid, roomType) {                                                                   // 1
  if (!Match.test(rid, String)) {                                                                                     // 2
    throw new Meteor.Error('invalid-rid');                                                                            // 3
  }                                                                                                                   //
  if (roomType !== 'c' && roomType !== 'p') {                                                                         // 5
    throw new Meteor.Error('invalid-room-type', 'Invalid_room_type', {                                                // 6
      roomType: roomType                                                                                              // 6
    });                                                                                                               //
  }                                                                                                                   //
  return RocketChat.models.Rooms.setTypeById(rid, roomType) && RocketChat.models.Subscriptions.updateTypeByRoomId(rid, roomType);
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomTopic.coffee.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomTopic = function(rid, roomTopic) {                                                                 // 1
  if (!Match.test(rid, String)) {                                                                                     // 2
    throw new Meteor.Error('invalid-rid');                                                                            // 3
  }                                                                                                                   //
  return RocketChat.models.Rooms.setTopicById(rid, roomTopic);                                                        // 5
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomName.coffee.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomName = function(rid, name) {                                                                       // 1
  var nameValidation, ref, room;                                                                                      // 2
  if (!Meteor.userId()) {                                                                                             // 2
    throw new Meteor.Error('error-invalid-user', "Invalid user", {                                                    // 3
      "function": 'RocketChat.saveRoomName'                                                                           // 3
    });                                                                                                               //
  }                                                                                                                   //
  room = RocketChat.models.Rooms.findOneById(rid);                                                                    // 2
  if ((ref = room.t) !== 'c' && ref !== 'p') {                                                                        // 7
    throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                      // 8
      "function": 'RocketChat.saveRoomName'                                                                           // 8
    });                                                                                                               //
  }                                                                                                                   //
  if (!RocketChat.authz.hasPermission(Meteor.userId(), 'edit-room', rid)) {                                           // 10
    throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                      // 11
      "function": 'RocketChat.saveRoomName'                                                                           // 11
    });                                                                                                               //
  }                                                                                                                   //
  try {                                                                                                               // 13
    nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$');                        // 14
  } catch (_error) {                                                                                                  //
    nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$');                                                                 // 16
  }                                                                                                                   //
  if (!nameValidation.test(name)) {                                                                                   // 18
    throw new Meteor.Error('error-invalid-room-name', 'Invalid room name', {                                          // 19
      "function": 'RocketChat.saveRoomName',                                                                          // 19
      channelName: name                                                                                               // 19
    });                                                                                                               //
  }                                                                                                                   //
  if (name === room.name) {                                                                                           // 23
    return;                                                                                                           // 24
  }                                                                                                                   //
  if (RocketChat.models.Rooms.findOneByName(name)) {                                                                  // 27
    throw new Meteor.Error('error-duplicate-channel-name', 'Duplicate channel name', {                                // 28
      "function": 'RocketChat.saveRoomName',                                                                          // 28
      channelName: name                                                                                               // 28
    });                                                                                                               //
  }                                                                                                                   //
  RocketChat.models.Rooms.setNameById(rid, name);                                                                     // 2
  RocketChat.models.Subscriptions.updateNameByRoomId(rid, name);                                                      // 2
  return name;                                                                                                        // 33
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/methods/saveRoomSettings.coffee.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  saveRoomSettings: function(rid, setting, value) {                                                                   // 2
    var message, name, room;                                                                                          // 3
    if (!Match.test(rid, String)) {                                                                                   // 3
      throw new Meteor.Error('invalid-rid', 'Invalid room');                                                          // 4
    }                                                                                                                 //
    if (setting !== 'roomName' && setting !== 'roomTopic' && setting !== 'roomType' && setting !== 'default') {       // 6
      throw new Meteor.Error('invalid-settings', 'Invalid settings provided');                                        // 7
    }                                                                                                                 //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'edit-room', rid)) {                                         // 9
      throw new Meteor.Error(503, 'Not authorized');                                                                  // 10
    }                                                                                                                 //
    if (setting === 'default' && !RocketChat.authz.hasPermission(this.userId, 'view-room-administration')) {          // 12
      throw new Meteor.Error(503, 'Not authorized');                                                                  // 13
    }                                                                                                                 //
    room = RocketChat.models.Rooms.findOneById(rid);                                                                  // 3
    if (room != null) {                                                                                               // 16
      switch (setting) {                                                                                              // 17
        case 'roomName':                                                                                              // 17
          name = RocketChat.saveRoomName(rid, value);                                                                 // 19
          RocketChat.models.Messages.createRoomRenamedWithRoomIdRoomNameAndUser(rid, name, Meteor.user());            // 19
          break;                                                                                                      // 18
        case 'roomTopic':                                                                                             // 17
          if (value !== room.topic) {                                                                                 // 22
            RocketChat.saveRoomTopic(rid, value);                                                                     // 23
            RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', rid, value, Meteor.user());
          }                                                                                                           //
          break;                                                                                                      // 21
        case 'roomType':                                                                                              // 17
          if (value !== room.t) {                                                                                     // 26
            RocketChat.saveRoomType(rid, value);                                                                      // 27
            if (value === 'c') {                                                                                      // 28
              message = TAPi18n.__('Channel');                                                                        // 29
            } else {                                                                                                  //
              message = TAPi18n.__('Private_Group');                                                                  // 31
            }                                                                                                         //
            RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_privacy', rid, message, Meteor.user());
          }                                                                                                           //
          break;                                                                                                      // 25
        case 'default':                                                                                               // 17
          RocketChat.models.Rooms.saveDefaultById(rid, value);                                                        // 34
      }                                                                                                               // 17
    }                                                                                                                 //
    return true;                                                                                                      // 36
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/models/Messages.coffee.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser = function(type, roomId, message, user, extraData) {
  return this.createWithTypeRoomIdMessageAndUser(type, roomId, message, user, extraData);                             // 2
};                                                                                                                    // 1
                                                                                                                      //
RocketChat.models.Messages.createRoomRenamedWithRoomIdRoomNameAndUser = function(roomId, roomName, user, extraData) {
  return this.createWithTypeRoomIdMessageAndUser('r', roomId, roomName, user, extraData);                             // 5
};                                                                                                                    // 4
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:channel-settings'] = {};

})();

//# sourceMappingURL=rocketchat_channel-settings.js.map
