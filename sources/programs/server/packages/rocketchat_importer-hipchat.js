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
// packages/rocketchat_importer-hipchat/server.coffee.js                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },                               // 1
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                      //
                                                                                                                    //
Importer.HipChat = Importer.HipChat = (function(superClass) {                                                       // 1
  extend(HipChat, superClass);                                                                                      // 2
                                                                                                                    //
  HipChat.RoomPrefix = 'hipchat_export/rooms/';                                                                     // 2
                                                                                                                    //
  HipChat.UsersPrefix = 'hipchat_export/users/';                                                                    // 2
                                                                                                                    //
  function HipChat(name, descriptionI18N, fileTypeRegex) {                                                          // 5
    this.getSelection = bind(this.getSelection, this);                                                              // 6
    this.convertHipChatMessageToRocketChat = bind(this.convertHipChatMessageToRocketChat, this);                    // 6
    this.getRocketUser = bind(this.getRocketUser, this);                                                            // 6
    this.getHipChatChannelFromName = bind(this.getHipChatChannelFromName, this);                                    // 6
    this.startImport = bind(this.startImport, this);                                                                // 6
    this.prepare = bind(this.prepare, this);                                                                        // 6
    HipChat.__super__.constructor.call(this, name, descriptionI18N, fileTypeRegex);                                 // 6
    this.userTags = [];                                                                                             // 6
  }                                                                                                                 //
                                                                                                                    //
  HipChat.prototype.prepare = function(dataURI, sentContentType, fileName) {                                        // 2
    var channel, channelsId, contentType, entry, fn, fn1, image, j, len, messagesCount, messagesObj, ref, selectionChannels, selectionUsers, tempMessages, tempRooms, tempUsers, usersId, zip, zipEntries;
    HipChat.__super__.prepare.call(this, dataURI, sentContentType, fileName);                                       // 10
    ref = RocketChatFile.dataURIParse(dataURI), image = ref.image, contentType = ref.contentType;                   // 10
    zip = new this.AdmZip(new Buffer(image, 'base64'));                                                             // 10
    zipEntries = zip.getEntries();                                                                                  // 10
    tempRooms = [];                                                                                                 // 10
    tempUsers = [];                                                                                                 // 10
    tempMessages = {};                                                                                              // 10
    fn = (function(_this) {                                                                                         // 20
      return function(entry) {                                                                                      //
        var item, k, len1, msgGroupData, results, room, roomName, usersName;                                        // 22
        if (!entry.isDirectory) {                                                                                   // 22
          if (entry.entryName.indexOf(Importer.HipChat.RoomPrefix) > -1) {                                          // 23
            roomName = entry.entryName.split(Importer.HipChat.RoomPrefix)[1];                                       // 24
            if (roomName === 'list.json') {                                                                         // 25
              _this.updateProgress(Importer.ProgressStep.PREPARING_CHANNELS);                                       // 26
              tempRooms = JSON.parse(entry.getData().toString()).rooms;                                             // 26
              results = [];                                                                                         // 28
              for (k = 0, len1 = tempRooms.length; k < len1; k++) {                                                 //
                room = tempRooms[k];                                                                                //
                results.push(room.name = _.slugify(room.name));                                                     // 29
              }                                                                                                     // 28
              return results;                                                                                       //
            } else if (roomName.indexOf('/') > -1) {                                                                //
              item = roomName.split('/');                                                                           // 31
              roomName = _.slugify(item[0]);                                                                        // 31
              msgGroupData = item[1].split('.')[0];                                                                 // 31
              if (!tempMessages[roomName]) {                                                                        // 34
                tempMessages[roomName] = {};                                                                        // 35
              }                                                                                                     //
              try {                                                                                                 // 38
                return tempMessages[roomName][msgGroupData] = JSON.parse(entry.getData().toString());               //
              } catch (_error) {                                                                                    //
                return console.warn(entry.entryName + " is not a valid JSON file! Unable to import it.");           //
              }                                                                                                     //
            }                                                                                                       //
          } else if (entry.entryName.indexOf(Importer.HipChat.UsersPrefix) > -1) {                                  //
            usersName = entry.entryName.split(Importer.HipChat.UsersPrefix)[1];                                     // 43
            if (usersName === 'list.json') {                                                                        // 44
              _this.updateProgress(Importer.ProgressStep.PREPARING_USERS);                                          // 45
              return tempUsers = JSON.parse(entry.getData().toString()).users;                                      //
            } else {                                                                                                //
              return console.warn("Unexpected file in the " + _this.name + " import: " + entry.entryName);          //
            }                                                                                                       //
          }                                                                                                         //
        }                                                                                                           //
      };                                                                                                            //
    })(this);                                                                                                       //
    for (j = 0, len = zipEntries.length; j < len; j++) {                                                            // 20
      entry = zipEntries[j];                                                                                        //
      fn(entry);                                                                                                    // 21
    }                                                                                                               // 20
    usersId = this.collection.insert({                                                                              // 10
      'import': this.importRecord._id,                                                                              // 52
      'importer': this.name,                                                                                        // 52
      'type': 'users',                                                                                              // 52
      'users': tempUsers                                                                                            // 52
    });                                                                                                             //
    this.users = this.collection.findOne(usersId);                                                                  // 10
    this.updateRecord({                                                                                             // 10
      'count.users': tempUsers.length                                                                               // 54
    });                                                                                                             //
    this.addCountToTotal(tempUsers.length);                                                                         // 10
    channelsId = this.collection.insert({                                                                           // 10
      'import': this.importRecord._id,                                                                              // 58
      'importer': this.name,                                                                                        // 58
      'type': 'channels',                                                                                           // 58
      'channels': tempRooms                                                                                         // 58
    });                                                                                                             //
    this.channels = this.collection.findOne(channelsId);                                                            // 10
    this.updateRecord({                                                                                             // 10
      'count.channels': tempRooms.length                                                                            // 60
    });                                                                                                             //
    this.addCountToTotal(tempRooms.length);                                                                         // 10
    this.updateProgress(Importer.ProgressStep.PREPARING_MESSAGES);                                                  // 10
    messagesCount = 0;                                                                                              // 10
    fn1 = (function(_this) {                                                                                        // 66
      return function(channel, messagesObj) {                                                                       //
        var date, i, messagesId, msgs, results, splitMsg;                                                           // 68
        if (!_this.messages[channel]) {                                                                             // 68
          _this.messages[channel] = {};                                                                             // 69
        }                                                                                                           //
        results = [];                                                                                               // 70
        for (date in messagesObj) {                                                                                 //
          msgs = messagesObj[date];                                                                                 //
          messagesCount += msgs.length;                                                                             // 71
          _this.updateRecord({                                                                                      // 71
            'messagesstatus': channel + "/" + date                                                                  // 72
          });                                                                                                       //
          if (Importer.Base.getBSONSize(msgs) > Importer.Base.MaxBSONSize) {                                        // 74
            results.push((function() {                                                                              //
              var k, len1, ref1, results1;                                                                          //
              ref1 = Importer.Base.getBSONSafeArraysFromAnArray(msgs);                                              // 75
              results1 = [];                                                                                        // 75
              for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {                                              //
                splitMsg = ref1[i];                                                                                 //
                messagesId = this.collection.insert({                                                               // 76
                  'import': this.importRecord._id,                                                                  // 76
                  'importer': this.name,                                                                            // 76
                  'type': 'messages',                                                                               // 76
                  'name': channel + "/" + date + "." + i,                                                           // 76
                  'messages': splitMsg                                                                              // 76
                });                                                                                                 //
                results1.push(this.messages[channel][date + "." + i] = this.collection.findOne(messagesId));        // 76
              }                                                                                                     // 75
              return results1;                                                                                      //
            }).call(_this));                                                                                        //
          } else {                                                                                                  //
            messagesId = _this.collection.insert({                                                                  // 79
              'import': _this.importRecord._id,                                                                     // 79
              'importer': _this.name,                                                                               // 79
              'type': 'messages',                                                                                   // 79
              'name': channel + "/" + date,                                                                         // 79
              'messages': msgs                                                                                      // 79
            });                                                                                                     //
            results.push(_this.messages[channel][date] = _this.collection.findOne(messagesId));                     // 79
          }                                                                                                         //
        }                                                                                                           // 70
        return results;                                                                                             //
      };                                                                                                            //
    })(this);                                                                                                       //
    for (channel in tempMessages) {                                                                                 // 66
      messagesObj = tempMessages[channel];                                                                          //
      fn1(channel, messagesObj);                                                                                    // 67
    }                                                                                                               // 66
    this.updateRecord({                                                                                             // 10
      'count.messages': messagesCount,                                                                              // 82
      'messagesstatus': null                                                                                        // 82
    });                                                                                                             //
    this.addCountToTotal(messagesCount);                                                                            // 10
    if (tempUsers.length === 0 || tempRooms.length === 0 || messagesCount === 0) {                                  // 85
      this.updateProgress(Importer.ProgressStep.ERROR);                                                             // 86
      return this.getProgress();                                                                                    // 87
    }                                                                                                               //
    selectionUsers = tempUsers.map(function(user) {                                                                 // 10
      return new Importer.SelectionUser(user.user_id, user.name, user.email, user.is_deleted, false, !user.is_bot);
    });                                                                                                             //
    selectionChannels = tempRooms.map(function(room) {                                                              // 10
      return new Importer.SelectionChannel(room.room_id, room.name, room.is_archived, true);                        // 93
    });                                                                                                             //
    this.updateProgress(Importer.ProgressStep.USER_SELECTION);                                                      // 10
    return new Importer.Selection(this.name, selectionUsers, selectionChannels);                                    // 96
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.startImport = function(importSelection) {                                                       // 2
    var c, channel, j, k, l, len, len1, len2, len3, m, ref, ref1, ref2, ref3, start, startedByUserId, u, user;      // 103
    HipChat.__super__.startImport.call(this, importSelection);                                                      // 103
    start = Date.now();                                                                                             // 103
    ref = importSelection.users;                                                                                    // 106
    for (j = 0, len = ref.length; j < len; j++) {                                                                   // 106
      user = ref[j];                                                                                                //
      ref1 = this.users.users;                                                                                      // 107
      for (k = 0, len1 = ref1.length; k < len1; k++) {                                                              // 107
        u = ref1[k];                                                                                                //
        if (u.user_id === user.user_id) {                                                                           //
          u.do_import = user.do_import;                                                                             // 108
        }                                                                                                           //
      }                                                                                                             // 107
    }                                                                                                               // 106
    this.collection.update({                                                                                        // 103
      _id: this.users._id                                                                                           // 109
    }, {                                                                                                            //
      $set: {                                                                                                       // 109
        'users': this.users.users                                                                                   // 109
      }                                                                                                             //
    });                                                                                                             //
    ref2 = importSelection.channels;                                                                                // 111
    for (l = 0, len2 = ref2.length; l < len2; l++) {                                                                // 111
      channel = ref2[l];                                                                                            //
      ref3 = this.channels.channels;                                                                                // 112
      for (m = 0, len3 = ref3.length; m < len3; m++) {                                                              // 112
        c = ref3[m];                                                                                                //
        if (c.room_id === channel.channel_id) {                                                                     //
          c.do_import = channel.do_import;                                                                          // 113
        }                                                                                                           //
      }                                                                                                             // 112
    }                                                                                                               // 111
    this.collection.update({                                                                                        // 103
      _id: this.channels._id                                                                                        // 114
    }, {                                                                                                            //
      $set: {                                                                                                       // 114
        'channels': this.channels.channels                                                                          // 114
      }                                                                                                             //
    });                                                                                                             //
    startedByUserId = Meteor.userId();                                                                              // 103
    Meteor.defer((function(_this) {                                                                                 // 103
      return function() {                                                                                           //
        var fn, len4, len5, len6, messagesObj, n, nousers, o, p, ref4, ref5, ref6, ref7, timeTook;                  // 119
        _this.updateProgress(Importer.ProgressStep.IMPORTING_USERS);                                                // 119
        ref4 = _this.users.users;                                                                                   // 120
        for (n = 0, len4 = ref4.length; n < len4; n++) {                                                            // 120
          user = ref4[n];                                                                                           //
          if (user.do_import) {                                                                                     //
            (function(user) {                                                                                       // 121
              return Meteor.runAsUser(startedByUserId, function() {                                                 //
                var existantUser, userId;                                                                           // 123
                existantUser = RocketChat.models.Users.findOneByEmailAddress(user.email);                           // 123
                if (existantUser) {                                                                                 // 124
                  user.rocketId = existantUser._id;                                                                 // 125
                  _this.userTags.push({                                                                             // 125
                    hipchat: "@" + user.mention_name,                                                               // 127
                    rocket: "@" + existantUser.username                                                             // 127
                  });                                                                                               //
                } else {                                                                                            //
                  userId = Accounts.createUser({                                                                    // 130
                    email: user.email,                                                                              // 130
                    password: Date.now() + user.name + user.email.toUpperCase()                                     // 130
                  });                                                                                               //
                  user.rocketId = userId;                                                                           // 130
                  _this.userTags.push({                                                                             // 130
                    hipchat: "@" + user.mention_name,                                                               // 133
                    rocket: "@" + user.mention_name                                                                 // 133
                  });                                                                                               //
                  Meteor.runAsUser(userId, function() {                                                             // 130
                    Meteor.call('setUsername', user.mention_name);                                                  // 136
                    Meteor.call('joinDefaultChannels', true);                                                       // 136
                    Meteor.call('setAvatarFromService', user.photo_url, null, 'url');                               // 136
                    return Meteor.call('updateUserUtcOffset', parseInt(moment().tz(user.timezone).format('Z').toString().split(':')[0]));
                  });                                                                                               //
                  if (user.name != null) {                                                                          // 141
                    RocketChat.models.Users.setName(userId, user.name);                                             // 142
                  }                                                                                                 //
                  if (user.is_deleted) {                                                                            // 145
                    Meteor.call('setUserActiveStatus', userId, false);                                              // 146
                  }                                                                                                 //
                }                                                                                                   //
                return _this.addCountCompleted(1);                                                                  //
              });                                                                                                   //
            })(user);                                                                                               //
          }                                                                                                         //
        }                                                                                                           // 120
        _this.collection.update({                                                                                   // 119
          _id: _this.users._id                                                                                      // 148
        }, {                                                                                                        //
          $set: {                                                                                                   // 148
            'users': _this.users.users                                                                              // 148
          }                                                                                                         //
        });                                                                                                         //
        _this.updateProgress(Importer.ProgressStep.IMPORTING_CHANNELS);                                             // 119
        ref5 = _this.channels.channels;                                                                             // 151
        for (o = 0, len5 = ref5.length; o < len5; o++) {                                                            // 151
          channel = ref5[o];                                                                                        //
          if (channel.do_import) {                                                                                  //
            (function(channel) {                                                                                    // 152
              return Meteor.runAsUser(startedByUserId, function() {                                                 //
                var existantRoom, len6, p, ref6, userId;                                                            // 154
                channel.name = channel.name.replace(/ /g, '');                                                      // 154
                existantRoom = RocketChat.models.Rooms.findOneByName(channel.name);                                 // 154
                if (existantRoom) {                                                                                 // 156
                  channel.rocketId = existantRoom._id;                                                              // 157
                } else {                                                                                            //
                  userId = '';                                                                                      // 159
                  ref6 = _this.users.users;                                                                         // 160
                  for (p = 0, len6 = ref6.length; p < len6; p++) {                                                  // 160
                    user = ref6[p];                                                                                 //
                    if (user.user_id === channel.owner_user_id) {                                                   //
                      userId = user.rocketId;                                                                       // 161
                    }                                                                                               //
                  }                                                                                                 // 160
                  if (userId !== '') {                                                                              // 163
                    Meteor.runAsUser(userId, function() {                                                           // 164
                      var returned;                                                                                 // 165
                      returned = Meteor.call('createChannel', channel.name, []);                                    // 165
                      return channel.rocketId = returned.rid;                                                       //
                    });                                                                                             //
                    RocketChat.models.Rooms.update({                                                                // 164
                      _id: channel.rocketId                                                                         // 167
                    }, {                                                                                            //
                      $set: {                                                                                       // 167
                        'ts': new Date(channel.created * 1000)                                                      // 167
                      }                                                                                             //
                    });                                                                                             //
                  } else {                                                                                          //
                    console.warn("Failed to find the channel creator for " + channel.name + ".");                   // 169
                  }                                                                                                 //
                }                                                                                                   //
                return _this.addCountCompleted(1);                                                                  //
              });                                                                                                   //
            })(channel);                                                                                            //
          }                                                                                                         //
        }                                                                                                           // 151
        _this.collection.update({                                                                                   // 119
          _id: _this.channels._id                                                                                   // 171
        }, {                                                                                                        //
          $set: {                                                                                                   // 171
            'channels': _this.channels.channels                                                                     // 171
          }                                                                                                         //
        });                                                                                                         //
        _this.updateProgress(Importer.ProgressStep.IMPORTING_MESSAGES);                                             // 119
        nousers = {};                                                                                               // 119
        ref6 = _this.messages;                                                                                      // 175
        fn = function(channel, messagesObj) {                                                                       // 175
          return Meteor.runAsUser(startedByUserId, function() {                                                     //
            var date, hipchatChannel, message, msgObj, msgs, results, room;                                         // 178
            hipchatChannel = _this.getHipChatChannelFromName(channel);                                              // 178
            if (hipchatChannel != null ? hipchatChannel.do_import : void 0) {                                       // 179
              room = RocketChat.models.Rooms.findOneById(hipchatChannel.rocketId, {                                 // 180
                fields: {                                                                                           // 180
                  usernames: 1,                                                                                     // 180
                  t: 1,                                                                                             // 180
                  name: 1                                                                                           // 180
                }                                                                                                   //
              });                                                                                                   //
              results = [];                                                                                         // 181
              for (date in messagesObj) {                                                                           //
                msgs = messagesObj[date];                                                                           //
                _this.updateRecord({                                                                                // 182
                  'messagesstatus': channel + "/" + date + "." + msgs.messages.length                               // 182
                });                                                                                                 //
                results.push((function() {                                                                          // 182
                  var len6, p, ref7, results1;                                                                      //
                  ref7 = msgs.messages;                                                                             // 183
                  results1 = [];                                                                                    // 183
                  for (p = 0, len6 = ref7.length; p < len6; p++) {                                                  //
                    message = ref7[p];                                                                              //
                    if (message.from != null) {                                                                     // 184
                      user = this.getRocketUser(message.from.user_id);                                              // 185
                      if (user != null) {                                                                           // 186
                        msgObj = {                                                                                  // 187
                          msg: this.convertHipChatMessageToRocketChat(message.message),                             // 188
                          ts: new Date(message.date),                                                               // 188
                          u: {                                                                                      // 188
                            _id: user._id,                                                                          // 191
                            username: user.username                                                                 // 191
                          }                                                                                         //
                        };                                                                                          //
                        RocketChat.sendMessage(user, msgObj, room);                                                 // 187
                      } else {                                                                                      //
                        if (!nousers[message.from.user_id]) {                                                       // 196
                          nousers[message.from.user_id] = message.from;                                             // 197
                        }                                                                                           //
                      }                                                                                             //
                    } else {                                                                                        //
                      if (!_.isArray(message)) {                                                                    // 199
                        console.warn('Please report the following:', message);                                      // 200
                      }                                                                                             //
                    }                                                                                               //
                    results1.push(this.addCountCompleted(1));                                                       // 184
                  }                                                                                                 // 183
                  return results1;                                                                                  //
                }).call(_this));                                                                                    //
              }                                                                                                     // 181
              return results;                                                                                       //
            }                                                                                                       //
          });                                                                                                       //
        };                                                                                                          //
        for (channel in ref6) {                                                                                     // 175
          messagesObj = ref6[channel];                                                                              //
          fn(channel, messagesObj);                                                                                 // 176
        }                                                                                                           // 175
        console.warn('The following did not have users:', nousers);                                                 // 119
        _this.updateProgress(Importer.ProgressStep.FINISHING);                                                      // 119
        ref7 = _this.channels.channels;                                                                             // 205
        for (p = 0, len6 = ref7.length; p < len6; p++) {                                                            // 205
          channel = ref7[p];                                                                                        //
          if (channel.do_import && channel.is_archived) {                                                           //
            (function(channel) {                                                                                    // 206
              return Meteor.runAsUser(startedByUserId, function() {                                                 //
                return Meteor.call('archiveRoom', channel.rocketId);                                                //
              });                                                                                                   //
            })(channel);                                                                                            //
          }                                                                                                         //
        }                                                                                                           // 205
        _this.updateProgress(Importer.ProgressStep.DONE);                                                           // 119
        timeTook = Date.now() - start;                                                                              // 119
        return console.log("Import took " + timeTook + " milliseconds.");                                           //
      };                                                                                                            //
    })(this));                                                                                                      //
    return this.getProgress();                                                                                      // 218
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.getHipChatChannelFromName = function(channelName) {                                             // 2
    var channel, j, len, ref;                                                                                       // 221
    ref = this.channels.channels;                                                                                   // 221
    for (j = 0, len = ref.length; j < len; j++) {                                                                   // 221
      channel = ref[j];                                                                                             //
      if (channel.name === channelName) {                                                                           //
        return channel;                                                                                             // 222
      }                                                                                                             //
    }                                                                                                               // 221
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.getRocketUser = function(hipchatId) {                                                           // 2
    var j, len, ref, user;                                                                                          // 225
    ref = this.users.users;                                                                                         // 225
    for (j = 0, len = ref.length; j < len; j++) {                                                                   // 225
      user = ref[j];                                                                                                //
      if (user.user_id === hipchatId) {                                                                             //
        return RocketChat.models.Users.findOneById(user.rocketId, {                                                 // 226
          fields: {                                                                                                 // 226
            username: 1                                                                                             // 226
          }                                                                                                         //
        });                                                                                                         //
      }                                                                                                             //
    }                                                                                                               // 225
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.convertHipChatMessageToRocketChat = function(message) {                                         // 2
    var j, len, ref, userReplace;                                                                                   // 229
    if (message != null) {                                                                                          // 229
      ref = this.userTags;                                                                                          // 230
      for (j = 0, len = ref.length; j < len; j++) {                                                                 // 230
        userReplace = ref[j];                                                                                       //
        message = message.replace(userReplace.hipchat, userReplace.rocket);                                         // 231
      }                                                                                                             // 230
      return message;                                                                                               // 232
    }                                                                                                               //
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.getSelection = function() {                                                                     // 2
    var selectionChannels, selectionUsers;                                                                          // 235
    selectionUsers = this.users.users.map(function(user) {                                                          // 235
      return new Importer.SelectionUser(user.user_id, user.name, user.email, user.is_deleted, false, !user.is_bot);
    });                                                                                                             //
    selectionChannels = this.channels.channels.map(function(room) {                                                 // 235
      return new Importer.SelectionChannel(room.room_id, room.name, room.is_archived, true);                        // 239
    });                                                                                                             //
    return new Importer.Selection(this.name, selectionUsers, selectionChannels);                                    // 241
  };                                                                                                                //
                                                                                                                    //
  return HipChat;                                                                                                   //
                                                                                                                    //
})(Importer.Base);                                                                                                  //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_importer-hipchat/main.coffee.js                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.AddImporter('hipchat', Importer.HipChat, {                                                                 // 1
  name: 'HipChat',                                                                                                  // 2
  description: TAPi18n.__('Importer_From_Description', {                                                            // 2
    from: 'HipChat'                                                                                                 // 3
  }),                                                                                                               //
  fileTypeRegex: new RegExp('application\/.*?zip')                                                                  // 2
});                                                                                                                 //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:importer-hipchat'] = {};

})();

//# sourceMappingURL=rocketchat_importer-hipchat.js.map
