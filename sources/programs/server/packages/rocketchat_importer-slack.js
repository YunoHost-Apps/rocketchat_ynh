(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Importer = Package['rocketchat:importer'].Importer;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var moment = Package['mrt:moment'].moment;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_importer-slack/server.coffee.js                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },                               // 1
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                      //
                                                                                                                    //
Importer.Slack = Importer.Slack = (function(superClass) {                                                           // 1
  extend(Slack, superClass);                                                                                        // 2
                                                                                                                    //
  function Slack(name, descriptionI18N, fileTypeRegex) {                                                            // 2
    this.getSelection = bind(this.getSelection, this);                                                              // 3
    this.convertSlackMessageToRocketChat = bind(this.convertSlackMessageToRocketChat, this);                        // 3
    this.getRocketUser = bind(this.getRocketUser, this);                                                            // 3
    this.getSlackChannelFromName = bind(this.getSlackChannelFromName, this);                                        // 3
    this.startImport = bind(this.startImport, this);                                                                // 3
    this.prepare = bind(this.prepare, this);                                                                        // 3
    Slack.__super__.constructor.call(this, name, descriptionI18N, fileTypeRegex);                                   // 3
    this.userTags = [];                                                                                             // 3
    this.bots = {};                                                                                                 // 3
  }                                                                                                                 //
                                                                                                                    //
  Slack.prototype.prepare = function(dataURI, sentContentType, fileName) {                                          // 2
    var channel, channelsId, contentType, entry, fn, fn1, image, j, len, messagesCount, messagesObj, ref, selectionChannels, selectionUsers, tempChannels, tempMessages, tempUsers, usersId, zip, zipEntries;
    Slack.__super__.prepare.call(this, dataURI, sentContentType, fileName);                                         // 8
    ref = RocketChatFile.dataURIParse(dataURI), image = ref.image, contentType = ref.contentType;                   // 8
    zip = new this.AdmZip(new Buffer(image, 'base64'));                                                             // 8
    zipEntries = zip.getEntries();                                                                                  // 8
    tempChannels = [];                                                                                              // 8
    tempUsers = [];                                                                                                 // 8
    tempMessages = {};                                                                                              // 8
    fn = (function(_this) {                                                                                         // 18
      return function(entry) {                                                                                      //
        var channelName, item, k, len1, msgGroupData, results, user;                                                // 20
        if (entry.entryName === 'channels.json') {                                                                  // 20
          _this.updateProgress(Importer.ProgressStep.PREPARING_CHANNELS);                                           // 21
          return tempChannels = JSON.parse(entry.getData().toString());                                             //
        } else if (entry.entryName === 'users.json') {                                                              //
          _this.updateProgress(Importer.ProgressStep.PREPARING_USERS);                                              // 24
          tempUsers = JSON.parse(entry.getData().toString());                                                       // 24
          results = [];                                                                                             // 27
          for (k = 0, len1 = tempUsers.length; k < len1; k++) {                                                     //
            user = tempUsers[k];                                                                                    //
            if (user.is_bot) {                                                                                      //
              results.push(_this.bots[user.profile.bot_id] = user);                                                 // 28
            }                                                                                                       //
          }                                                                                                         // 27
          return results;                                                                                           //
        } else if (!entry.isDirectory && entry.entryName.indexOf('/') > -1) {                                       //
          item = entry.entryName.split('/');                                                                        // 31
          channelName = item[0];                                                                                    // 31
          msgGroupData = item[1].split('.')[0];                                                                     // 31
          if (!tempMessages[channelName]) {                                                                         // 34
            tempMessages[channelName] = {};                                                                         // 35
          }                                                                                                         //
          try {                                                                                                     // 37
            return tempMessages[channelName][msgGroupData] = JSON.parse(entry.getData().toString());                //
          } catch (_error) {                                                                                        //
            return console.warn(entry.entryName + " is not a valid JSON file! Unable to import it.");               //
          }                                                                                                         //
        }                                                                                                           //
      };                                                                                                            //
    })(this);                                                                                                       //
    for (j = 0, len = zipEntries.length; j < len; j++) {                                                            // 18
      entry = zipEntries[j];                                                                                        //
      fn(entry);                                                                                                    // 19
    }                                                                                                               // 18
    usersId = this.collection.insert({                                                                              // 8
      'import': this.importRecord._id,                                                                              // 44
      'importer': this.name,                                                                                        // 44
      'type': 'users',                                                                                              // 44
      'users': tempUsers                                                                                            // 44
    });                                                                                                             //
    this.users = this.collection.findOne(usersId);                                                                  // 8
    this.updateRecord({                                                                                             // 8
      'count.users': tempUsers.length                                                                               // 46
    });                                                                                                             //
    this.addCountToTotal(tempUsers.length);                                                                         // 8
    channelsId = this.collection.insert({                                                                           // 8
      'import': this.importRecord._id,                                                                              // 50
      'importer': this.name,                                                                                        // 50
      'type': 'channels',                                                                                           // 50
      'channels': tempChannels                                                                                      // 50
    });                                                                                                             //
    this.channels = this.collection.findOne(channelsId);                                                            // 8
    this.updateRecord({                                                                                             // 8
      'count.channels': tempChannels.length                                                                         // 52
    });                                                                                                             //
    this.addCountToTotal(tempChannels.length);                                                                      // 8
    this.updateProgress(Importer.ProgressStep.PREPARING_MESSAGES);                                                  // 8
    messagesCount = 0;                                                                                              // 8
    fn1 = (function(_this) {                                                                                        // 58
      return function(channel, messagesObj) {                                                                       //
        var date, i, messagesId, msgs, results, splitMsg;                                                           // 60
        if (!_this.messages[channel]) {                                                                             // 60
          _this.messages[channel] = {};                                                                             // 61
        }                                                                                                           //
        results = [];                                                                                               // 62
        for (date in messagesObj) {                                                                                 //
          msgs = messagesObj[date];                                                                                 //
          messagesCount += msgs.length;                                                                             // 63
          _this.updateRecord({                                                                                      // 63
            'messagesstatus': channel + "/" + date                                                                  // 64
          });                                                                                                       //
          if (Importer.Base.getBSONSize(msgs) > Importer.Base.MaxBSONSize) {                                        // 66
            results.push((function() {                                                                              //
              var k, len1, ref1, results1;                                                                          //
              ref1 = Importer.Base.getBSONSafeArraysFromAnArray(msgs);                                              // 67
              results1 = [];                                                                                        // 67
              for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {                                              //
                splitMsg = ref1[i];                                                                                 //
                messagesId = this.collection.insert({                                                               // 68
                  'import': this.importRecord._id,                                                                  // 68
                  'importer': this.name,                                                                            // 68
                  'type': 'messages',                                                                               // 68
                  'name': channel + "/" + date + "." + i,                                                           // 68
                  'messages': splitMsg                                                                              // 68
                });                                                                                                 //
                results1.push(this.messages[channel][date + "." + i] = this.collection.findOne(messagesId));        // 68
              }                                                                                                     // 67
              return results1;                                                                                      //
            }).call(_this));                                                                                        //
          } else {                                                                                                  //
            messagesId = _this.collection.insert({                                                                  // 71
              'import': _this.importRecord._id,                                                                     // 71
              'importer': _this.name,                                                                               // 71
              'type': 'messages',                                                                                   // 71
              'name': channel + "/" + date,                                                                         // 71
              'messages': msgs                                                                                      // 71
            });                                                                                                     //
            results.push(_this.messages[channel][date] = _this.collection.findOne(messagesId));                     // 71
          }                                                                                                         //
        }                                                                                                           // 62
        return results;                                                                                             //
      };                                                                                                            //
    })(this);                                                                                                       //
    for (channel in tempMessages) {                                                                                 // 58
      messagesObj = tempMessages[channel];                                                                          //
      fn1(channel, messagesObj);                                                                                    // 59
    }                                                                                                               // 58
    this.updateRecord({                                                                                             // 8
      'count.messages': messagesCount,                                                                              // 74
      'messagesstatus': null                                                                                        // 74
    });                                                                                                             //
    this.addCountToTotal(messagesCount);                                                                            // 8
    if (tempUsers.length === 0 || tempChannels.length === 0 || messagesCount === 0) {                               // 77
      this.updateProgress(Importer.ProgressStep.ERROR);                                                             // 78
      return this.getProgress();                                                                                    // 79
    }                                                                                                               //
    selectionUsers = tempUsers.map(function(user) {                                                                 // 8
      return new Importer.SelectionUser(user.id, user.name, user.profile.email, user.deleted, user.is_bot, !user.is_bot);
    });                                                                                                             //
    selectionChannels = tempChannels.map(function(channel) {                                                        // 8
      return new Importer.SelectionChannel(channel.id, channel.name, channel.is_archived, true);                    // 84
    });                                                                                                             //
    this.updateProgress(Importer.ProgressStep.USER_SELECTION);                                                      // 8
    return new Importer.Selection(this.name, selectionUsers, selectionChannels);                                    // 87
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.startImport = function(importSelection) {                                                         // 2
    var c, channel, j, k, l, len, len1, len2, len3, m, ref, ref1, ref2, ref3, start, startedByUserId, u, user;      // 94
    Slack.__super__.startImport.call(this, importSelection);                                                        // 94
    start = Date.now();                                                                                             // 94
    ref = importSelection.users;                                                                                    // 97
    for (j = 0, len = ref.length; j < len; j++) {                                                                   // 97
      user = ref[j];                                                                                                //
      ref1 = this.users.users;                                                                                      // 98
      for (k = 0, len1 = ref1.length; k < len1; k++) {                                                              // 98
        u = ref1[k];                                                                                                //
        if (u.id === user.user_id) {                                                                                //
          u.do_import = user.do_import;                                                                             // 99
        }                                                                                                           //
      }                                                                                                             // 98
    }                                                                                                               // 97
    this.collection.update({                                                                                        // 94
      _id: this.users._id                                                                                           // 100
    }, {                                                                                                            //
      $set: {                                                                                                       // 100
        'users': this.users.users                                                                                   // 100
      }                                                                                                             //
    });                                                                                                             //
    ref2 = importSelection.channels;                                                                                // 102
    for (l = 0, len2 = ref2.length; l < len2; l++) {                                                                // 102
      channel = ref2[l];                                                                                            //
      ref3 = this.channels.channels;                                                                                // 103
      for (m = 0, len3 = ref3.length; m < len3; m++) {                                                              // 103
        c = ref3[m];                                                                                                //
        if (c.id === channel.channel_id) {                                                                          //
          c.do_import = channel.do_import;                                                                          // 104
        }                                                                                                           //
      }                                                                                                             // 103
    }                                                                                                               // 102
    this.collection.update({                                                                                        // 94
      _id: this.channels._id                                                                                        // 105
    }, {                                                                                                            //
      $set: {                                                                                                       // 105
        'channels': this.channels.channels                                                                          // 105
      }                                                                                                             //
    });                                                                                                             //
    startedByUserId = Meteor.userId();                                                                              // 94
    Meteor.defer((function(_this) {                                                                                 // 94
      return function() {                                                                                           //
        var fn, ignoreTypes, len4, len5, len6, messagesObj, missedTypes, n, o, p, ref4, ref5, ref6, ref7, timeTook;
        _this.updateProgress(Importer.ProgressStep.IMPORTING_USERS);                                                // 110
        ref4 = _this.users.users;                                                                                   // 111
        for (n = 0, len4 = ref4.length; n < len4; n++) {                                                            // 111
          user = ref4[n];                                                                                           //
          if (user.do_import) {                                                                                     //
            (function(user) {                                                                                       // 112
              return Meteor.runAsUser(startedByUserId, function() {                                                 //
                var existantUser, userId;                                                                           // 114
                existantUser = RocketChat.models.Users.findOneByEmailAddress(user.profile.email);                   // 114
                if (existantUser) {                                                                                 // 115
                  user.rocketId = existantUser._id;                                                                 // 116
                  _this.userTags.push({                                                                             // 116
                    slack: "<@" + user.id + ">",                                                                    // 118
                    slackLong: "<@" + user.id + "|" + user.name + ">",                                              // 118
                    rocket: "@" + existantUser.username                                                             // 118
                  });                                                                                               //
                } else {                                                                                            //
                  userId = Accounts.createUser({                                                                    // 122
                    email: user.profile.email,                                                                      // 122
                    password: Date.now() + user.name + user.profile.email.toUpperCase()                             // 122
                  });                                                                                               //
                  Meteor.runAsUser(userId, function() {                                                             // 122
                    var url;                                                                                        // 124
                    Meteor.call('setUsername', user.name);                                                          // 124
                    Meteor.call('joinDefaultChannels', true);                                                       // 124
                    url = null;                                                                                     // 124
                    if (user.profile.image_original) {                                                              // 127
                      url = user.profile.image_original;                                                            // 128
                    } else if (user.profile.image_512) {                                                            //
                      url = user.profile.image_512;                                                                 // 130
                    }                                                                                               //
                    Meteor.call('setAvatarFromService', url, null, 'url');                                          // 124
                    if (user.tz_offset) {                                                                           // 133
                      return Meteor.call('updateUserUtcOffset', user.tz_offset / 3600);                             //
                    }                                                                                               //
                  });                                                                                               //
                  if (user.profile.real_name) {                                                                     // 136
                    RocketChat.models.Users.setName(userId, user.profile.real_name);                                // 137
                  }                                                                                                 //
                  if (user.deleted) {                                                                               // 139
                    Meteor.call('setUserActiveStatus', userId, false);                                              // 140
                  }                                                                                                 //
                  user.rocketId = userId;                                                                           // 122
                  _this.userTags.push({                                                                             // 122
                    slack: "<@" + user.id + ">",                                                                    // 144
                    slackLong: "<@" + user.id + "|" + user.name + ">",                                              // 144
                    rocket: "@" + user.name                                                                         // 144
                  });                                                                                               //
                }                                                                                                   //
                return _this.addCountCompleted(1);                                                                  //
              });                                                                                                   //
            })(user);                                                                                               //
          }                                                                                                         //
        }                                                                                                           // 111
        _this.collection.update({                                                                                   // 110
          _id: _this.users._id                                                                                      // 148
        }, {                                                                                                        //
          $set: {                                                                                                   // 148
            'users': _this.users.users                                                                              // 148
          }                                                                                                         //
        });                                                                                                         //
        _this.updateProgress(Importer.ProgressStep.IMPORTING_CHANNELS);                                             // 110
        ref5 = _this.channels.channels;                                                                             // 151
        for (o = 0, len5 = ref5.length; o < len5; o++) {                                                            // 151
          channel = ref5[o];                                                                                        //
          if (channel.do_import) {                                                                                  //
            (function(channel) {                                                                                    // 152
              return Meteor.runAsUser(startedByUserId, function() {                                                 //
                var existantRoom, lastSetTopic, len6, len7, member, p, q, ref6, ref7, ref8, ref9, roomUpdate, userId, users;
                existantRoom = RocketChat.models.Rooms.findOneByName(channel.name);                                 // 154
                if (existantRoom || channel.is_general) {                                                           // 155
                  if (channel.is_general && channel.name !== (existantRoom != null ? existantRoom.name : void 0)) {
                    Meteor.call('saveRoomSettings', 'GENERAL', 'roomName', channel.name);                           // 157
                  }                                                                                                 //
                  channel.rocketId = channel.is_general ? 'GENERAL' : existantRoom._id;                             // 156
                } else {                                                                                            //
                  users = [];                                                                                       // 160
                  ref6 = channel.members;                                                                           // 161
                  for (p = 0, len6 = ref6.length; p < len6; p++) {                                                  // 161
                    member = ref6[p];                                                                               //
                    if (!(member !== channel.creator)) {                                                            //
                      continue;                                                                                     //
                    }                                                                                               //
                    user = _this.getRocketUser(member);                                                             // 162
                    if (user != null) {                                                                             // 163
                      users.push(user.username);                                                                    // 164
                    }                                                                                               //
                  }                                                                                                 // 161
                  userId = '';                                                                                      // 160
                  ref7 = _this.users.users;                                                                         // 167
                  for (q = 0, len7 = ref7.length; q < len7; q++) {                                                  // 167
                    user = ref7[q];                                                                                 //
                    if (user.id === channel.creator) {                                                              //
                      userId = user.rocketId;                                                                       // 168
                    }                                                                                               //
                  }                                                                                                 // 167
                  Meteor.runAsUser(userId, function() {                                                             // 160
                    var returned;                                                                                   // 171
                    returned = Meteor.call('createChannel', channel.name, users);                                   // 171
                    return channel.rocketId = returned.rid;                                                         //
                  });                                                                                               //
                  roomUpdate = {                                                                                    // 160
                    ts: new Date(channel.created * 1000)                                                            // 176
                  };                                                                                                //
                  if (!_.isEmpty((ref8 = channel.topic) != null ? ref8.value : void 0)) {                           // 178
                    roomUpdate.topic = channel.topic.value;                                                         // 179
                    lastSetTopic = channel.topic.last_set;                                                          // 179
                  }                                                                                                 //
                  if (!_.isEmpty((ref9 = channel.purpose) != null ? ref9.value : void 0) && channel.purpose.last_set > lastSetTopic) {
                    roomUpdate.topic = channel.purpose.value;                                                       // 183
                  }                                                                                                 //
                  RocketChat.models.Rooms.update({                                                                  // 160
                    _id: channel.rocketId                                                                           // 185
                  }, {                                                                                              //
                    $set: roomUpdate                                                                                // 185
                  });                                                                                               //
                }                                                                                                   //
                return _this.addCountCompleted(1);                                                                  //
              });                                                                                                   //
            })(channel);                                                                                            //
          }                                                                                                         //
        }                                                                                                           // 151
        _this.collection.update({                                                                                   // 110
          _id: _this.channels._id                                                                                   // 188
        }, {                                                                                                        //
          $set: {                                                                                                   // 188
            'channels': _this.channels.channels                                                                     // 188
          }                                                                                                         //
        });                                                                                                         //
        missedTypes = {};                                                                                           // 110
        ignoreTypes = {                                                                                             // 110
          'bot_add': true,                                                                                          // 191
          'file_comment': true,                                                                                     // 191
          'file_mention': true,                                                                                     // 191
          'channel_name': true                                                                                      // 191
        };                                                                                                          //
        _this.updateProgress(Importer.ProgressStep.IMPORTING_MESSAGES);                                             // 110
        ref6 = _this.messages;                                                                                      // 193
        fn = function(channel, messagesObj) {                                                                       // 193
          return Meteor.runAsUser(startedByUserId, function() {                                                     //
            var botUser, botUsername, date, details, message, msgObj, msgs, results, room, slackChannel;            // 196
            slackChannel = _this.getSlackChannelFromName(channel);                                                  // 196
            if (slackChannel != null ? slackChannel.do_import : void 0) {                                           // 197
              room = RocketChat.models.Rooms.findOneById(slackChannel.rocketId, {                                   // 198
                fields: {                                                                                           // 198
                  usernames: 1,                                                                                     // 198
                  t: 1,                                                                                             // 198
                  name: 1                                                                                           // 198
                }                                                                                                   //
              });                                                                                                   //
              results = [];                                                                                         // 199
              for (date in messagesObj) {                                                                           //
                msgs = messagesObj[date];                                                                           //
                _this.updateRecord({                                                                                // 200
                  'messagesstatus': channel + "/" + date + "." + msgs.messages.length                               // 200
                });                                                                                                 //
                results.push((function() {                                                                          // 200
                  var len6, p, ref7, ref8, ref9, results1;                                                          //
                  ref7 = msgs.messages;                                                                             // 201
                  results1 = [];                                                                                    // 201
                  for (p = 0, len6 = ref7.length; p < len6; p++) {                                                  //
                    message = ref7[p];                                                                              //
                    if (message.type === 'message') {                                                               // 202
                      if (message.subtype != null) {                                                                // 203
                        if (message.subtype === 'channel_join') {                                                   // 204
                          if (this.getRocketUser(message.user) != null) {                                           // 205
                            RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(room._id, this.getRocketUser(message.user), {
                              ts: new Date(parseInt(message.ts.split('.')[0]) * 1000)                               // 206
                            });                                                                                     //
                          }                                                                                         //
                        } else if (message.subtype === 'channel_leave') {                                           //
                          if (this.getRocketUser(message.user) != null) {                                           // 208
                            RocketChat.models.Messages.createUserLeaveWithRoomIdAndUser(room._id, this.getRocketUser(message.user), {
                              ts: new Date(parseInt(message.ts.split('.')[0]) * 1000)                               // 209
                            });                                                                                     //
                          }                                                                                         //
                        } else if (message.subtype === 'me_message') {                                              //
                          RocketChat.sendMessage(this.getRocketUser(message.user), {                                // 211
                            msg: '_' + this.convertSlackMessageToRocketChat(message.text) + '_',                    // 211
                            ts: new Date(parseInt(message.ts.split('.')[0]) * 1000)                                 // 211
                          }, room);                                                                                 //
                        } else if (message.subtype === 'bot_message') {                                             //
                          botUser = RocketChat.models.Users.findOneById('rocket.cat', {                             // 213
                            fields: {                                                                               // 213
                              username: 1                                                                           // 213
                            }                                                                                       //
                          });                                                                                       //
                          botUsername = this.bots[message.bot_id] ? (ref8 = this.bots[message.bot_id]) != null ? ref8.name : void 0 : message.username;
                          msgObj = {                                                                                // 213
                            msg: message.text ? message.text : '',                                                  // 216
                            ts: new Date(parseInt(message.ts.split('.')[0]) * 1000),                                // 216
                            rid: room._id,                                                                          // 216
                            bot: true,                                                                              // 216
                            attachments: message.attachments,                                                       // 216
                            username: botUsername ? botUsername : void 0                                            // 216
                          };                                                                                        //
                          if (message.edited != null) {                                                             // 223
                            msgObj.ets = new Date(parseInt(message.edited.ts.split('.')[0]) * 1000);                // 224
                          }                                                                                         //
                          if (message.icons != null) {                                                              // 226
                            msgObj.emoji = message.icons.emoji;                                                     // 227
                          }                                                                                         //
                          msgObj.msg = this.convertSlackMessageToRocketChat(msgObj.msg);                            // 213
                          RocketChat.sendMessage(botUser, msgObj, room);                                            // 213
                        } else if (message.subtype === 'channel_purpose') {                                         //
                          RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', room._id, message.purpose, this.getRocketUser(message.user), {
                            ts: new Date(parseInt(message.ts.split('.')[0]) * 1000)                                 // 233
                          });                                                                                       //
                        } else if (message.subtype === 'channel_topic') {                                           //
                          RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', room._id, message.topic, this.getRocketUser(message.user), {
                            ts: new Date(parseInt(message.ts.split('.')[0]) * 1000)                                 // 235
                          });                                                                                       //
                        } else if (message.subtype === 'pinned_item') {                                             //
                          RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('message_pinned', room._id, '', this.getRocketUser(message.user), {
                            ts: new Date(parseInt(message.ts.split('.')[0]) * 1000),                                // 238
                            attachments: [                                                                          // 238
                              {                                                                                     //
                                "text": this.convertSlackMessageToRocketChat(message.attachments[0].text),          // 240
                                "author_name": message.attachments[0].author_subname,                               // 240
                                "author_icon": getAvatarUrlFromUsername(message.attachments[0].author_subname)      // 240
                              }                                                                                     //
                            ]                                                                                       //
                          });                                                                                       //
                        } else if (message.subtype === 'file_share') {                                              //
                          if (((ref9 = message.file) != null ? ref9.url_private_download : void 0) !== void 0) {    // 245
                            details = {                                                                             // 246
                              name: message.file.name,                                                              // 247
                              size: message.file.size,                                                              // 247
                              type: message.file.mimetype,                                                          // 247
                              rid: room._id                                                                         // 247
                            };                                                                                      //
                            this.uploadFile(details, message.file.url_private_download, this.getRocketUser(message.user), room, new Date(parseInt(message.ts.split('.')[0]) * 1000));
                          }                                                                                         //
                        } else {                                                                                    //
                          if (!missedTypes[message.subtype] && !ignoreTypes[message.subtype]) {                     // 253
                            missedTypes[message.subtype] = message;                                                 // 254
                          }                                                                                         //
                        }                                                                                           //
                      } else {                                                                                      //
                        user = this.getRocketUser(message.user);                                                    // 256
                        if (user != null) {                                                                         // 257
                          msgObj = {                                                                                // 258
                            msg: this.convertSlackMessageToRocketChat(message.text),                                // 259
                            ts: new Date(parseInt(message.ts.split('.')[0]) * 1000),                                // 259
                            rid: room._id,                                                                          // 259
                            u: {                                                                                    // 259
                              _id: user._id,                                                                        // 263
                              username: user.username                                                               // 263
                            }                                                                                       //
                          };                                                                                        //
                          if (message.edited != null) {                                                             // 266
                            msgObj.ets = new Date(parseInt(message.edited.ts.split('.')[0]) * 1000);                // 267
                          }                                                                                         //
                          RocketChat.sendMessage(this.getRocketUser(message.user), msgObj, room);                   // 258
                        }                                                                                           //
                      }                                                                                             //
                    }                                                                                               //
                    results1.push(this.addCountCompleted(1));                                                       // 202
                  }                                                                                                 // 201
                  return results1;                                                                                  //
                }).call(_this));                                                                                    //
              }                                                                                                     // 199
              return results;                                                                                       //
            }                                                                                                       //
          });                                                                                                       //
        };                                                                                                          //
        for (channel in ref6) {                                                                                     // 193
          messagesObj = ref6[channel];                                                                              //
          fn(channel, messagesObj);                                                                                 // 194
        }                                                                                                           // 193
        console.log(missedTypes);                                                                                   // 110
        _this.updateProgress(Importer.ProgressStep.FINISHING);                                                      // 110
        ref7 = _this.channels.channels;                                                                             // 273
        for (p = 0, len6 = ref7.length; p < len6; p++) {                                                            // 273
          channel = ref7[p];                                                                                        //
          if (channel.do_import && channel.is_archived) {                                                           //
            (function(channel) {                                                                                    // 274
              return Meteor.runAsUser(startedByUserId, function() {                                                 //
                return Meteor.call('archiveRoom', channel.rocketId);                                                //
              });                                                                                                   //
            })(channel);                                                                                            //
          }                                                                                                         //
        }                                                                                                           // 273
        _this.updateProgress(Importer.ProgressStep.DONE);                                                           // 110
        timeTook = Date.now() - start;                                                                              // 110
        return console.log("Import took " + timeTook + " milliseconds.");                                           //
      };                                                                                                            //
    })(this));                                                                                                      //
    return this.getProgress();                                                                                      // 287
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.getSlackChannelFromName = function(channelName) {                                                 // 2
    var channel, j, len, ref;                                                                                       // 290
    ref = this.channels.channels;                                                                                   // 290
    for (j = 0, len = ref.length; j < len; j++) {                                                                   // 290
      channel = ref[j];                                                                                             //
      if (channel.name === channelName) {                                                                           //
        return channel;                                                                                             // 291
      }                                                                                                             //
    }                                                                                                               // 290
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.getRocketUser = function(slackId) {                                                               // 2
    var j, len, ref, user;                                                                                          // 294
    ref = this.users.users;                                                                                         // 294
    for (j = 0, len = ref.length; j < len; j++) {                                                                   // 294
      user = ref[j];                                                                                                //
      if (user.id === slackId) {                                                                                    //
        return RocketChat.models.Users.findOneById(user.rocketId, {                                                 // 295
          fields: {                                                                                                 // 295
            username: 1                                                                                             // 295
          }                                                                                                         //
        });                                                                                                         //
      }                                                                                                             //
    }                                                                                                               // 294
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.convertSlackMessageToRocketChat = function(message) {                                             // 2
    var j, len, ref, userReplace;                                                                                   // 298
    if (message != null) {                                                                                          // 298
      message = message.replace(/<!everyone>/g, '@all');                                                            // 299
      message = message.replace(/<!channel>/g, '@all');                                                             // 299
      message = message.replace(/&gt;/g, '<');                                                                      // 299
      message = message.replace(/&lt;/g, '>');                                                                      // 299
      message = message.replace(/&amp;/g, '&');                                                                     // 299
      message = message.replace(/:simple_smile:/g, ':smile:');                                                      // 299
      message = message.replace(/:memo:/g, ':pencil:');                                                             // 299
      message = message.replace(/:piggy:/g, ':pig:');                                                               // 299
      message = message.replace(/:uk:/g, ':gb:');                                                                   // 299
      message = message.replace(/<(http[s]?:[^>]*)>/g, '$1');                                                       // 299
      ref = this.userTags;                                                                                          // 309
      for (j = 0, len = ref.length; j < len; j++) {                                                                 // 309
        userReplace = ref[j];                                                                                       //
        message = message.replace(userReplace.slack, userReplace.rocket);                                           // 310
        message = message.replace(userReplace.slackLong, userReplace.rocket);                                       // 310
      }                                                                                                             // 309
      return message;                                                                                               // 312
    }                                                                                                               //
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.getSelection = function() {                                                                       // 2
    var selectionChannels, selectionUsers;                                                                          // 315
    selectionUsers = this.users.users.map(function(user) {                                                          // 315
      return new Importer.SelectionUser(user.id, user.name, user.profile.email, user.deleted, user.is_bot, !user.is_bot);
    });                                                                                                             //
    selectionChannels = this.channels.channels.map(function(channel) {                                              // 315
      return new Importer.SelectionChannel(channel.id, channel.name, channel.is_archived, true);                    // 318
    });                                                                                                             //
    return new Importer.Selection(this.name, selectionUsers, selectionChannels);                                    // 320
  };                                                                                                                //
                                                                                                                    //
  return Slack;                                                                                                     //
                                                                                                                    //
})(Importer.Base);                                                                                                  //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_importer-slack/main.coffee.js                                                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.AddImporter('slack', Importer.Slack, {                                                                     // 1
  name: 'Slack',                                                                                                    // 2
  description: TAPi18n.__('Importer_From_Description', {                                                            // 2
    from: 'Slack'                                                                                                   // 3
  }),                                                                                                               //
  fileTypeRegex: new RegExp('application\/.*?zip')                                                                  // 2
});                                                                                                                 //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:importer-slack'] = {};

})();

//# sourceMappingURL=rocketchat_importer-slack.js.map
