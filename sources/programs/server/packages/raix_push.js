(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var EventState = Package['raix:eventstate'].EventState;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Push, _matchToken, checkClientSecurity, _replaceToken, _removeToken, initPushUpdates;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_push/lib/common/main.js                                                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// The push object is an event emitter                                                                               //
Push = new EventState();                                                                                             // 2
                                                                                                                     //
// This is the match pattern for tokens                                                                              //
_matchToken = Match.OneOf({ apn: String }, { gcm: String });                                                         // 5
                                                                                                                     //
// Client-side security warnings, used to check options                                                              //
checkClientSecurity = function (options) {                                                                           // 9
                                                                                                                     //
  // Warn if certificates or keys are added here on client. We dont allow the                                        //
  // user to do this for security reasons.                                                                           //
  if (options.apn && options.apn.certData) {                                                                         // 13
    throw new Error('Push.init: Dont add your APN certificate in client code!');                                     // 14
  }                                                                                                                  //
                                                                                                                     //
  if (options.apn && options.apn.keyData) {                                                                          // 17
    throw new Error('Push.init: Dont add your APN key in client code!');                                             // 18
  }                                                                                                                  //
                                                                                                                     //
  if (options.apn && options.apn.passphrase) {                                                                       // 21
    throw new Error('Push.init: Dont add your APN passphrase in client code!');                                      // 22
  }                                                                                                                  //
                                                                                                                     //
  if (options.gcm && options.gcm.apiKey) {                                                                           // 25
    throw new Error('Push.init: Dont add your GCM api key in client code!');                                         // 26
  }                                                                                                                  //
};                                                                                                                   //
                                                                                                                     //
// DEPRECATED                                                                                                        //
Push.init = function () {                                                                                            // 31
  console.warn('Push.init have been deprecated in favor of "config.push.json" please migrate');                      // 32
};                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_push/lib/common/notifications.js                                                                    //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// Notifications collection                                                                                          //
Push.notifications = new Mongo.Collection('_raix_push_notifications');                                               // 2
                                                                                                                     //
// This is a general function to validate that the data added to notifications                                       //
// is in the correct format. If not this function will throw errors                                                  //
var _validateDocument = function (notification) {                                                                    // 6
                                                                                                                     //
  // Check the general notification                                                                                  //
  check(notification, {                                                                                              // 9
    from: String,                                                                                                    // 10
    title: String,                                                                                                   // 11
    text: String,                                                                                                    // 12
    badge: Match.Optional(Number),                                                                                   // 13
    sound: Match.Optional(String),                                                                                   // 14
    notId: Match.Optional(Match.Integer),                                                                            // 15
    apn: Match.Optional({                                                                                            // 16
      from: Match.Optional(String),                                                                                  // 17
      title: Match.Optional(String),                                                                                 // 18
      text: Match.Optional(String),                                                                                  // 19
      badge: Match.Optional(Number),                                                                                 // 20
      sound: Match.Optional(String),                                                                                 // 21
      notId: Match.Optional(Match.Integer)                                                                           // 22
    }),                                                                                                              //
    gcm: Match.Optional({                                                                                            // 24
      from: Match.Optional(String),                                                                                  // 25
      title: Match.Optional(String),                                                                                 // 26
      text: Match.Optional(String),                                                                                  // 27
      badge: Match.Optional(Number),                                                                                 // 28
      sound: Match.Optional(String),                                                                                 // 29
      notId: Match.Optional(Match.Integer)                                                                           // 30
    }),                                                                                                              //
    query: Match.Optional(String),                                                                                   // 32
    token: Match.Optional(_matchToken),                                                                              // 33
    tokens: Match.Optional([_matchToken]),                                                                           // 34
    payload: Match.Optional(Object),                                                                                 // 35
    delayUntil: Match.Optional(Date),                                                                                // 36
    createdAt: Date,                                                                                                 // 37
    createdBy: Match.OneOf(String, null)                                                                             // 38
  });                                                                                                                //
                                                                                                                     //
  // Make sure a token selector or query have been set                                                               //
  if (!notification.token && !notification.tokens && !notification.query) {                                          // 42
    throw new Error('No token selector or query found');                                                             // 43
  }                                                                                                                  //
                                                                                                                     //
  // If tokens array is set it should not be empty                                                                   //
  if (notification.tokens && !notification.tokens.length) {                                                          // 47
    throw new Error('No tokens in array');                                                                           // 48
  }                                                                                                                  //
};                                                                                                                   //
                                                                                                                     //
Push.send = function (options) {                                                                                     // 52
  // If on the client we set the user id - on the server we need an option                                           //
  // set or we default to "<SERVER>" as the creator of the notification                                              //
  // If current user not set see if we can set it to the logged in user                                              //
  // this will only run on the client if Meteor.userId is available                                                  //
  var currentUser = Meteor.isClient && Meteor.userId && Meteor.userId() || Meteor.isServer && (options.createdBy || '<SERVER>') || null;
                                                                                                                     //
  // Rig the notification object                                                                                     //
  var notification = _.extend({                                                                                      // 61
    createdAt: new Date(),                                                                                           // 62
    createdBy: currentUser                                                                                           // 63
  }, _.pick(options, 'from', 'title', 'text'));                                                                      //
                                                                                                                     //
  // Add extra                                                                                                       //
  _.extend(notification, _.pick(options, 'payload', 'badge', 'sound', 'notId', 'delayUntil'));                       // 67
                                                                                                                     //
  if (Match.test(options.apn, Object)) {                                                                             // 69
    notification.apn = _.pick(options.apn, 'from', 'title', 'text', 'badge', 'sound', 'notId');                      // 70
  }                                                                                                                  //
                                                                                                                     //
  if (Match.test(options.gcm, Object)) {                                                                             // 73
    notification.gcm = _.pick(options.gcm, 'from', 'title', 'text', 'badge', 'sound', 'notId');                      // 74
  }                                                                                                                  //
                                                                                                                     //
  // Set one token selector, this can be token, array of tokens or query                                             //
  if (options.query) {                                                                                               // 78
    // Set query to the json string version fixing #43 and #39                                                       //
    notification.query = JSON.stringify(options.query);                                                              // 80
  } else if (options.token) {                                                                                        //
    // Set token                                                                                                     //
    notification.token = options.token;                                                                              // 83
  } else if (options.tokens) {                                                                                       //
    // Set tokens                                                                                                    //
    notification.tokens = options.tokens;                                                                            // 86
  }                                                                                                                  //
                                                                                                                     //
  // Validate the notification                                                                                       //
  _validateDocument(notification);                                                                                   // 90
                                                                                                                     //
  // Try to add the notification to send, we return an id to keep track                                              //
  return Push.notifications.insert(notification);                                                                    // 93
};                                                                                                                   //
                                                                                                                     //
Push.allow = function (rules) {                                                                                      // 96
  if (rules.send) {                                                                                                  // 97
    Push.notifications.allow({                                                                                       // 98
      'insert': function (userId, notification) {                                                                    // 99
        // Validate the notification                                                                                 //
        _validateDocument(notification);                                                                             // 101
        // Set the user defined "send" rules                                                                         //
        return rules.send.apply(this, [userId, notification]);                                                       // 103
      }                                                                                                              //
    });                                                                                                              //
  }                                                                                                                  //
};                                                                                                                   //
                                                                                                                     //
Push.deny = function (rules) {                                                                                       // 109
  if (rules.send) {                                                                                                  // 110
    Push.notifications.deny({                                                                                        // 111
      'insert': function (userId, notification) {                                                                    // 112
        // Validate the notification                                                                                 //
        _validateDocument(notification);                                                                             // 114
        // Set the user defined "send" rules                                                                         //
        return rules.send.apply(this, [userId, notification]);                                                       // 116
      }                                                                                                              //
    });                                                                                                              //
  }                                                                                                                  //
};                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_push/lib/server/push.api.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/*                                                                                                                   //
  A general purpose user CordovaPush                                                                                 //
  ios, android, mail, twitter?, facebook?, sms?, snailMail? :)                                                       //
                                                                                                                     //
  Phonegap generic :                                                                                                 //
  https://github.com/phonegap-build/PushPlugin                                                                       //
 */                                                                                                                  //
                                                                                                                     //
// getText / getBinary                                                                                               //
                                                                                                                     //
Push.setBadge = function () /* id, count */{                                                                         // 11
  // throw new Error('Push.setBadge not implemented on the server');                                                 //
};                                                                                                                   //
                                                                                                                     //
var isConfigured = false;                                                                                            // 15
                                                                                                                     //
Push.Configure = function (options) {                                                                                // 17
  var self = this;                                                                                                   // 18
  // https://npmjs.org/package/apn                                                                                   //
                                                                                                                     //
  // After requesting the certificate from Apple, export your private key as                                         //
  // a .p12 file anddownload the .cer file from the iOS Provisioning Portal.                                         //
                                                                                                                     //
  // gateway.push.apple.com, port 2195                                                                               //
  // gateway.sandbox.push.apple.com, port 2195                                                                       //
                                                                                                                     //
  // Now, in the directory containing cert.cer and key.p12 execute the                                               //
  // following commands to generate your .pem files:                                                                 //
  // $ openssl x509 -in cert.cer -inform DER -outform PEM -out cert.pem                                              //
  // $ openssl pkcs12 -in key.p12 -out key.pem -nodes                                                                //
                                                                                                                     //
  // Block multiple calls                                                                                            //
  if (isConfigured) {                                                                                                // 33
    throw new Error('Push.Configure should not be called more than once!');                                          // 34
  }                                                                                                                  //
                                                                                                                     //
  isConfigured = true;                                                                                               // 37
                                                                                                                     //
  // Add debug info                                                                                                  //
  if (Push.debug) {                                                                                                  // 40
    console.log('Push.Configure', options);                                                                          // 41
  }                                                                                                                  //
                                                                                                                     //
  // This function is called when a token is replaced on a device - normally                                         //
  // this should not happen, but if it does we should take action on it                                              //
  _replaceToken = function (currentToken, newToken) {                                                                // 46
    // console.log('Replace token: ' + currentToken + ' -- ' + newToken);                                            //
    // If the server gets a token event its passing in the current token and                                         //
    // the new value - if new value is undefined this empty the token                                                //
    self.emitState('token', currentToken, newToken);                                                                 // 50
  };                                                                                                                 //
                                                                                                                     //
  // Rig the removeToken callback                                                                                    //
  _removeToken = function (token) {                                                                                  // 54
    // console.log('Remove token: ' + token);                                                                        //
    // Invalidate the token                                                                                          //
    self.emitState('token', token, null);                                                                            // 57
  };                                                                                                                 //
                                                                                                                     //
  if (options.apn) {                                                                                                 // 61
    if (Push.debug) {                                                                                                // 62
      console.log('Push: APN configured');                                                                           // 63
    }                                                                                                                //
                                                                                                                     //
    // Allow production to be a general option for push notifications                                                //
    if (options.production === Boolean(options.production)) {                                                        // 67
      options.apn.production = options.production;                                                                   // 68
    }                                                                                                                //
                                                                                                                     //
    // Give the user warnings about development settings                                                             //
    if (options.apn.development) {                                                                                   // 72
      // This flag is normally set by the configuration file                                                         //
      console.warn('WARNING: Push APN is using development key and certificate');                                    // 74
    } else {                                                                                                         //
      // We check the apn gateway i the options, we could risk shipping                                              //
      // server into production while using the production configuration.                                            //
      // On the other hand we could be in development but using the production                                       //
      // configuration. And finally we could have configured an unknown apn                                          //
      // gateway (this could change in the future - but a warning about typos                                        //
      // can save hours of debugging)                                                                                //
      //                                                                                                             //
      // Warn about gateway configurations - it's more a guide                                                       //
      if (options.apn.gateway) {                                                                                     // 84
                                                                                                                     //
        if (options.apn.gateway === 'gateway.sandbox.push.apple.com') {                                              // 86
          // Using the development sandbox                                                                           //
          console.warn('WARNING: Push APN is in development mode');                                                  // 88
        } else if (options.apn.gateway === 'gateway.push.apple.com') {                                               //
          // In production - but warn if we are running on localhost                                                 //
          if (/http:\/\/localhost/.test(Meteor.absoluteUrl())) {                                                     // 91
            console.warn('WARNING: Push APN is configured to production mode - but server is running' + ' from localhost');
          }                                                                                                          //
        } else {                                                                                                     //
          // Warn about gateways we dont know about                                                                  //
          console.warn('WARNING: Push APN unkown gateway "' + options.apn.gateway + '"');                            // 97
        }                                                                                                            //
      } else {                                                                                                       //
        if (options.apn.production) {                                                                                // 101
          if (/http:\/\/localhost/.test(Meteor.absoluteUrl())) {                                                     // 102
            console.warn('WARNING: Push APN is configured to production mode - but server is running' + ' from localhost');
          }                                                                                                          //
        } else {                                                                                                     //
          console.warn('WARNING: Push APN is in development mode');                                                  // 107
        }                                                                                                            //
      }                                                                                                              //
    }                                                                                                                //
                                                                                                                     //
    // Check certificate data                                                                                        //
    if (!options.apn.certData || !options.apn.certData.length) {                                                     // 114
      console.error('ERROR: Push server could not find certData');                                                   // 115
    }                                                                                                                //
                                                                                                                     //
    // Check key data                                                                                                //
    if (!options.apn.keyData || !options.apn.keyData.length) {                                                       // 119
      console.error('ERROR: Push server could not find keyData');                                                    // 120
    }                                                                                                                //
                                                                                                                     //
    // Rig apn connection                                                                                            //
    var apn = Npm.require('apn');                                                                                    // 124
    var apnConnection = new apn.Connection(options.apn);                                                             // 125
                                                                                                                     //
    // Listen to transmission errors - should handle the same way as feedback.                                       //
    apnConnection.on('transmissionError', Meteor.bindEnvironment(function (errCode, notification, recipient) {       // 128
      if (Push.debug) {                                                                                              // 129
        console.log('Got error code %d for token %s', errCode, notification.token);                                  // 130
      }                                                                                                              //
      if ([2, 5, 8].indexOf(errCode) >= 0) {                                                                         // 132
                                                                                                                     //
        // Invalid token errors...                                                                                   //
        _removeToken({                                                                                               // 136
          apn: notification.token                                                                                    // 137
        });                                                                                                          //
      }                                                                                                              //
    }));                                                                                                             //
    // XXX: should we do a test of the connection? It would be nice to know                                          //
    // That the server/certificates/network are correct configured                                                   //
                                                                                                                     //
    // apnConnection.connect().then(function() {                                                                     //
    //     console.info('CHECK: Push APN connection OK');                                                            //
    // }, function(err) {                                                                                            //
    //     console.warn('CHECK: Push APN connection FAILURE');                                                       //
    // });                                                                                                           //
    // Note: the above code spoils the connection - investigate how to                                               //
    // shutdown/close it.                                                                                            //
                                                                                                                     //
    self.sendAPN = function (userToken, notification) {                                                              // 152
      if (Match.test(notification.apn, Object)) {                                                                    // 153
        notification = _.extend({}, notification, notification.apn);                                                 // 154
      }                                                                                                              //
                                                                                                                     //
      // console.log('sendAPN', notification.from, userToken, notification.title, notification.text,                 //
      // notification.badge, notification.priority);                                                                 //
      var priority = notification.priority || notification.priority === 0 ? notification.priority : 10;              // 159
                                                                                                                     //
      var myDevice = new apn.Device(userToken);                                                                      // 161
                                                                                                                     //
      var note = new apn.Notification();                                                                             // 163
                                                                                                                     //
      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.                                // 165
      if (typeof notification.badge !== 'undefined') {                                                               // 166
        note.badge = notification.badge;                                                                             // 167
      }                                                                                                              //
      if (typeof notification.sound !== 'undefined') {                                                               // 169
        note.sound = notification.sound;                                                                             // 170
      }                                                                                                              //
                                                                                                                     //
      // adds category support for iOS8 custom actions as described here:                                            //
      // https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/                        //
      // RemoteNotificationsPG/Chapters/IPhoneOSClientImp.html#//apple_ref/doc/uid/TP40008194-CH103-SW36             //
      if (typeof notification.category !== 'undefined') {                                                            // 176
        note.category = notification.category;                                                                       // 177
      }                                                                                                              //
                                                                                                                     //
      note.alert = notification.text;                                                                                // 180
      // Allow the user to set payload data                                                                          //
      note.payload = notification.payload ? { ejson: EJSON.stringify(notification.payload) } : {};                   // 182
                                                                                                                     //
      note.payload.messageFrom = notification.from;                                                                  // 184
      note.priority = priority;                                                                                      // 185
                                                                                                                     //
      // Store the token on the note so we can reference it if there was an error                                    //
      note.token = userToken;                                                                                        // 189
                                                                                                                     //
      // console.log('I:Send message to: ' + userToken + ' count=' + count);                                         //
                                                                                                                     //
      apnConnection.pushNotification(note, myDevice);                                                                // 193
    };                                                                                                               //
                                                                                                                     //
    var initFeedback = function () {                                                                                 // 198
      var apn = Npm.require('apn');                                                                                  // 199
      // console.log('Init feedback');                                                                               //
      var feedbackOptions = {                                                                                        // 201
        'batchFeedback': true,                                                                                       // 202
                                                                                                                     //
        // Time in SECONDS                                                                                           //
        'interval': 5,                                                                                               // 205
        production: !options.apn.development,                                                                        // 206
        cert: options.certData,                                                                                      // 207
        key: options.keyData,                                                                                        // 208
        passphrase: options.passphrase                                                                               // 209
      };                                                                                                             //
                                                                                                                     //
      var feedback = new apn.Feedback(feedbackOptions);                                                              // 212
      feedback.on('feedback', function (devices) {                                                                   // 213
        devices.forEach(function (item) {                                                                            // 214
          // Do something with item.device and item.time;                                                            //
          // console.log('A:PUSH FEEDBACK ' + item.device + ' - ' + item.time);                                      //
          // The app is most likely removed from the device, we should                                               //
          // remove the token                                                                                        //
          _removeToken({                                                                                             // 219
            apn: item.device                                                                                         // 220
          });                                                                                                        //
        });                                                                                                          //
      });                                                                                                            //
                                                                                                                     //
      feedback.start();                                                                                              // 225
    };                                                                                                               //
                                                                                                                     //
    // Init feedback from apn server                                                                                 //
    // This will help keep the appCollection up-to-date, it will help update                                         //
    // and remove token from appCollection.                                                                          //
    initFeedback();                                                                                                  // 231
  } // EO ios notification                                                                                           //
                                                                                                                     //
  if (options.gcm && options.gcm.apiKey) {                                                                           // 235
    if (Push.debug) {                                                                                                // 236
      console.log('GCM configured');                                                                                 // 237
    }                                                                                                                //
    //self.sendGCM = function(options.from, userTokens, options.title, options.text, options.badge, options.priority) {
    self.sendGCM = function (userTokens, notification) {                                                             // 240
      if (Match.test(notification.gcm, Object)) {                                                                    // 241
        notification = _.extend({}, notification, notification.gcm);                                                 // 242
      }                                                                                                              //
                                                                                                                     //
      // Make sure userTokens are an array of strings                                                                //
      if (userTokens === '' + userTokens) {                                                                          // 246
        userTokens = [userTokens];                                                                                   // 247
      }                                                                                                              //
                                                                                                                     //
      // Check if any tokens in there to send                                                                        //
      if (!userTokens.length) {                                                                                      // 251
        if (Push.debug) {                                                                                            // 252
          console.log('sendGCM no push tokens found');                                                               // 253
        }                                                                                                            //
        return;                                                                                                      // 255
      }                                                                                                              //
                                                                                                                     //
      if (Push.debug) {                                                                                              // 258
        console.log('sendGCM', userTokens, notification);                                                            // 259
      }                                                                                                              //
                                                                                                                     //
      var gcm = Npm.require('node-gcm');                                                                             // 262
      var Fiber = Npm.require('fibers');                                                                             // 263
                                                                                                                     //
      // Allow user to set payload                                                                                   //
      var data = notification.payload ? { ejson: EJSON.stringify(notification.payload) } : {};                       // 266
                                                                                                                     //
      data.title = notification.title;                                                                               // 268
      data.message = notification.text;                                                                              // 269
                                                                                                                     //
      // Set extra details                                                                                           //
      if (typeof notification.badge !== 'undefined') {                                                               // 272
        data.msgcnt = notification.badge;                                                                            // 273
      }                                                                                                              //
      if (typeof notification.sound !== 'undefined') {                                                               // 275
        data.soundname = notification.sound;                                                                         // 276
      }                                                                                                              //
      if (typeof notification.notId !== 'undefined') {                                                               // 278
        data.notId = notification.notId;                                                                             // 279
      }                                                                                                              //
                                                                                                                     //
      //var message = new gcm.Message();                                                                             //
      var message = new gcm.Message({                                                                                // 283
        collapseKey: notification.from,                                                                              // 284
        //    delayWhileIdle: true,                                                                                  //
        //    timeToLive: 4,                                                                                         //
        //    restricted_package_name: 'dk.gi2.app'                                                                  //
        data: data                                                                                                   // 288
      });                                                                                                            //
                                                                                                                     //
      if (Push.debug) {                                                                                              // 291
        console.log('Create GCM Sender using "' + options.gcm.apiKey + '"');                                         // 292
      }                                                                                                              //
      var sender = new gcm.Sender(options.gcm.apiKey);                                                               // 294
                                                                                                                     //
      _.each(userTokens, function (value /*, key */) {                                                               // 296
        if (Push.debug) {                                                                                            // 297
          console.log('A:Send message to: ' + value);                                                                // 298
        }                                                                                                            //
      });                                                                                                            //
                                                                                                                     //
      /*message.addData('title', title);                                                                             //
      message.addData('message', text);                                                                              //
      message.addData('msgcnt', '1');                                                                                //
      message.collapseKey = 'sitDrift';                                                                              //
      message.delayWhileIdle = true;                                                                                 //
      message.timeToLive = 3;*/                                                                                      //
                                                                                                                     //
      // /**                                                                                                         //
      //  * Parameters: message-literal, userTokens-array, No. of retries, callback-function                         //
      //  */                                                                                                         //
                                                                                                                     //
      var userToken = userTokens.length === 1 ? userTokens[0] : null;                                                // 313
                                                                                                                     //
      sender.send(message, userTokens, 5, function (err, result) {                                                   // 315
        if (err) {                                                                                                   // 316
          if (Push.debug) {                                                                                          // 317
            console.log('ANDROID ERROR: result of sender: ' + result);                                               // 318
          }                                                                                                          //
        } else {                                                                                                     //
          if (result === null) {                                                                                     // 321
            if (Push.debug) {                                                                                        // 322
              console.log('ANDROID: Result of sender is null');                                                      // 323
            }                                                                                                        //
            return;                                                                                                  // 325
          }                                                                                                          //
          if (Push.debug) {                                                                                          // 327
            console.log('ANDROID: Result of sender: ' + JSON.stringify(result));                                     // 328
          }                                                                                                          //
          if (result.canonical_ids === 1 && userToken) {                                                             // 330
            // jshint ignore:line                                                                                    //
                                                                                                                     //
            // This is an old device, token is replaced                                                              //
            Fiber(function (self) {                                                                                  // 333
              // Run in fiber                                                                                        //
              try {                                                                                                  // 335
                self.callback(self.oldToken, self.newToken);                                                         // 336
              } catch (err) {}                                                                                       //
            }).run({                                                                                                 //
              oldToken: { gcm: userToken },                                                                          // 342
              newToken: { gcm: result.results[0].registration_id }, // jshint ignore:line                            // 343
              callback: _replaceToken                                                                                // 344
            });                                                                                                      //
            //_replaceToken({ gcm: userToken }, { gcm: result.results[0].registration_id });                         //
          }                                                                                                          //
          // We cant send to that token - might not be registred                                                     //
          // ask the user to remove the token from the list                                                          //
          if (result.failure !== 0 && userToken) {                                                                   // 351
                                                                                                                     //
            // This is an old device, token is replaced                                                              //
            Fiber(function (self) {                                                                                  // 354
              // Run in fiber                                                                                        //
              try {                                                                                                  // 356
                self.callback(self.token);                                                                           // 357
              } catch (err) {}                                                                                       //
            }).run({                                                                                                 //
              token: { gcm: userToken },                                                                             // 363
              callback: _removeToken                                                                                 // 364
            });                                                                                                      //
            //_replaceToken({ gcm: userToken }, { gcm: result.results[0].registration_id });                         //
          }                                                                                                          //
        }                                                                                                            //
      });                                                                                                            //
      // /** Use the following line if you want to send the message without retries                                  //
      // sender.sendNoRetry(message, userTokens, function (result) {                                                 //
      //     console.log('ANDROID: ' + JSON.stringify(result));                                                      //
      // });                                                                                                         //
      // **/                                                                                                         //
    }; // EO sendAndroid                                                                                             //
  } // EO Android                                                                                                    //
                                                                                                                     //
  // Universal send function                                                                                         //
  var _querySend = function (query, options) {                                                                       // 382
                                                                                                                     //
    var countApn = [];                                                                                               // 384
    var countGcm = [];                                                                                               // 385
                                                                                                                     //
    Push.appCollection.find(query).forEach(function (app) {                                                          // 387
                                                                                                                     //
      if (Push.debug) {                                                                                              // 389
        console.log('send to token', app.token);                                                                     // 390
      }                                                                                                              //
                                                                                                                     //
      if (app.token.apn) {                                                                                           // 393
        countApn.push(app._id);                                                                                      // 394
        // Send to APN                                                                                               //
        if (self.sendAPN) {                                                                                          // 396
          self.sendAPN(app.token.apn, options);                                                                      // 397
        }                                                                                                            //
      } else if (app.token.gcm) {                                                                                    //
        countGcm.push(app._id);                                                                                      // 401
                                                                                                                     //
        // Send to GCM                                                                                               //
        // We do support multiple here - so we should construct an array                                             //
        // and send it bulk - Investigate limit count of id's                                                        //
        if (self.sendGCM) {                                                                                          // 406
          self.sendGCM(app.token.gcm, options);                                                                      // 407
        }                                                                                                            //
      } else {                                                                                                       //
        throw new Error('Push.send got a faulty query');                                                             // 411
      }                                                                                                              //
    });                                                                                                              //
                                                                                                                     //
    if (Push.debug) {                                                                                                // 416
                                                                                                                     //
      console.log('Push: Sent message "' + options.title + '" to ' + countApn.length + ' ios apps ' + countGcm.length + ' android apps');
                                                                                                                     //
      // Add some verbosity about the send result, making sure the developer                                         //
      // understands what just happened.                                                                             //
      if (!countApn.length && !countGcm.length) {                                                                    // 423
        if (Push.appCollection.find().count() === 0) {                                                               // 424
          console.log('Push, GUIDE: The "Push.appCollection" is empty -' + ' No clients have registred on the server yet...');
        }                                                                                                            //
      } else if (!countApn.length) {                                                                                 //
        if (Push.appCollection.find({ 'token.apn': { $exists: true } }).count() === 0) {                             // 429
          console.log('Push, GUIDE: The "Push.appCollection" - No APN clients have registred on the server yet...');
        }                                                                                                            //
      } else if (!countGcm.length) {                                                                                 //
        if (Push.appCollection.find({ 'token.gcm': { $exists: true } }).count() === 0) {                             // 433
          console.log('Push, GUIDE: The "Push.appCollection" - No GCM clients have registred on the server yet...');
        }                                                                                                            //
      }                                                                                                              //
    }                                                                                                                //
                                                                                                                     //
    return {                                                                                                         // 440
      apn: countApn,                                                                                                 // 441
      gcm: countGcm                                                                                                  // 442
    };                                                                                                               //
  };                                                                                                                 //
                                                                                                                     //
  self.serverSend = function (options) {                                                                             // 446
    options = options || { badge: 0 };                                                                               // 447
    var query;                                                                                                       // 448
                                                                                                                     //
    // Check basic options                                                                                           //
    if (options.from !== '' + options.from) {                                                                        // 451
      throw new Error('Push.send: option "from" not a string');                                                      // 452
    }                                                                                                                //
                                                                                                                     //
    if (options.title !== '' + options.title) {                                                                      // 455
      throw new Error('Push.send: option "title" not a string');                                                     // 456
    }                                                                                                                //
                                                                                                                     //
    if (options.text !== '' + options.text) {                                                                        // 459
      throw new Error('Push.send: option "text" not a string');                                                      // 460
    }                                                                                                                //
                                                                                                                     //
    if (options.token || options.tokens) {                                                                           // 463
                                                                                                                     //
      // The user set one token or array of tokens                                                                   //
      var tokenList = options.token ? [options.token] : options.tokens;                                              // 466
                                                                                                                     //
      if (Push.debug) {                                                                                              // 468
        console.log('Push: Send message "' + options.title + '" via token(s)', tokenList);                           // 469
      }                                                                                                              //
                                                                                                                     //
      query = {                                                                                                      // 472
        $or: [                                                                                                       // 473
        // XXX: Test this query: can we hand in a list of push tokens?                                               //
        { $and: [{ token: { $in: tokenList } },                                                                      // 475
          // And is not disabled                                                                                     //
          { enabled: { $ne: false } }]                                                                               // 478
        },                                                                                                           //
        // XXX: Test this query: does this work on app id?                                                           //
        { $and: [{ _in: { $in: tokenList } }, // one of the app ids                                                  // 482
          { $or: [{ 'token.apn': { $exists: true } }, // got apn token                                               // 484
            { 'token.gcm': { $exists: true } } // got gcm token                                                      // 486
            ] },                                                                                                     //
          // And is not disabled                                                                                     //
          { enabled: { $ne: false } }]                                                                               // 489
        }]                                                                                                           //
      };                                                                                                             //
    } else if (options.query) {                                                                                      //
                                                                                                                     //
      if (Push.debug) {                                                                                              // 497
        console.log('Push: Send message "' + options.title + '" via query', options.query);                          // 498
      }                                                                                                              //
                                                                                                                     //
      query = {                                                                                                      // 501
        $and: [options.query, // query object                                                                        // 502
        { $or: [{ 'token.apn': { $exists: true } }, // got apn token                                                 // 504
          { 'token.gcm': { $exists: true } } // got gcm token                                                        // 506
          ] },                                                                                                       //
        // And is not disabled                                                                                       //
        { enabled: { $ne: false } }]                                                                                 // 509
      };                                                                                                             //
    }                                                                                                                //
                                                                                                                     //
    if (query) {                                                                                                     // 515
                                                                                                                     //
      // Convert to querySend and return status                                                                      //
      return _querySend(query, options);                                                                             // 518
    } else {                                                                                                         //
      throw new Error('Push.send: please set option "token"/"tokens" or "query"');                                   // 521
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
  // This interval will allow only one notification to be sent at a time, it                                         //
  // will check for new notifications at every `options.sendInterval`                                                //
  // (default interval is 15000 ms)                                                                                  //
  //                                                                                                                 //
  // It looks in notifications collection to see if theres any pending                                               //
  // notifications, if so it will try to reserve the pending notification.                                           //
  // If successfully reserved the send is started.                                                                   //
  //                                                                                                                 //
  // If notification.query is type string, it's assumed to be a json string                                          //
  // version of the query selector. Making it able to carry `$` properties in                                        //
  // the mongo collection.                                                                                           //
  //                                                                                                                 //
  // Pr. default notifications are removed from the collection after send have                                       //
  // completed. Setting `options.keepNotifications` will update and keep the                                         //
  // notification eg. if needed for historical reasons.                                                              //
  //                                                                                                                 //
  // After the send have completed a "send" event will be emitted with a                                             //
  // status object containing notification id and the send result object.                                            //
  //                                                                                                                 //
  var isSendingNotification = false;                                                                                 // 546
                                                                                                                     //
  if (options.sendInterval !== null) {                                                                               // 548
                                                                                                                     //
    // This will require index since we sort notifications by createdAt                                              //
    Push.notifications._ensureIndex({ createdAt: 1 });                                                               // 551
                                                                                                                     //
    Meteor.setInterval(function () {                                                                                 // 553
                                                                                                                     //
      if (isSendingNotification) {                                                                                   // 555
        return;                                                                                                      // 556
      }                                                                                                              //
      // Set send fence                                                                                              //
      isSendingNotification = true;                                                                                  // 559
                                                                                                                     //
      // var countSent = 0;                                                                                          //
      var batchSize = options.sendBatchSize || 1;                                                                    // 562
                                                                                                                     //
      // Find notifications that are not being or already sent                                                       //
      var pendingNotifications = Push.notifications.find({ $and: [                                                   // 565
        // Message is not sent                                                                                       //
        { sent: { $ne: true } },                                                                                     // 567
        // And not being sent by other instances                                                                     //
        { sending: { $ne: true } },                                                                                  // 569
        // And not queued for future                                                                                 //
        { $or: [{ delayUntil: { $exists: false } }, { delayUntil: { $lte: new Date() } }] }] }, {                    // 571
        // Sort by created date                                                                                      //
        sort: { createdAt: 1 },                                                                                      // 574
        limit: batchSize                                                                                             // 575
      });                                                                                                            //
                                                                                                                     //
      pendingNotifications.forEach(function (notification) {                                                         // 578
        // Reserve notification                                                                                      //
        var reserved = Push.notifications.update({ $and: [                                                           // 580
          // Try to reserve the current notification                                                                 //
          { _id: notification._id },                                                                                 // 582
          // Make sure no other instances have reserved it                                                           //
          { sending: { $ne: true } }] }, {                                                                           // 584
          $set: {                                                                                                    // 586
            // Try to reserve                                                                                        //
            sending: true                                                                                            // 588
          }                                                                                                          //
        });                                                                                                          //
                                                                                                                     //
        // Make sure we only handle notifications reserved by this                                                   //
        // instance                                                                                                  //
        if (reserved) {                                                                                              // 594
                                                                                                                     //
          // Check if query is set and is type String                                                                //
          if (notification.query && notification.query === '' + notification.query) {                                // 597
            try {                                                                                                    // 598
              // The query is in string json format - we need to parse it                                            //
              notification.query = JSON.parse(notification.query);                                                   // 600
            } catch (err) {                                                                                          //
              // Did the user tamper with this??                                                                     //
              throw new Error('Push: Error while parsing query string, Error: ' + err.message);                      // 603
            }                                                                                                        //
          }                                                                                                          //
                                                                                                                     //
          // Send the notification                                                                                   //
          var result = Push.serverSend(notification);                                                                // 608
                                                                                                                     //
          if (!options.keepNotifications) {                                                                          // 610
            // Pr. Default we will remove notifications                                                              //
            Push.notifications.remove({ _id: notification._id });                                                    // 612
          } else {                                                                                                   //
                                                                                                                     //
            // Update the notification                                                                               //
            Push.notifications.update({ _id: notification._id }, {                                                   // 616
              $set: {                                                                                                // 617
                // Mark as sent                                                                                      //
                sent: true,                                                                                          // 619
                // Set the sent date                                                                                 //
                sentAt: new Date(),                                                                                  // 621
                // Count                                                                                             //
                count: result,                                                                                       // 623
                // Not being sent anymore                                                                            //
                sending: false                                                                                       // 625
              }                                                                                                      //
            });                                                                                                      //
          }                                                                                                          //
                                                                                                                     //
          // Emit the send                                                                                           //
          self.emit('send', { notification: notification._id, result: result });                                     // 632
        } // Else could not reserve                                                                                  //
      }); // EO forEach                                                                                              //
                                                                                                                     //
      // Remove the send fence                                                                                       //
      isSendingNotification = false;                                                                                 // 639
    }, options.sendInterval || 15000); // Default every 15th sec                                                     //
  } else {                                                                                                           //
      if (Push.debug) {                                                                                              // 643
        console.log('Push: Send server is disabled');                                                                // 644
      }                                                                                                              //
    }                                                                                                                //
};                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_push/lib/server/server.js                                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Push.appCollection = new Mongo.Collection('_raix_push_app_tokens');                                                  // 1
                                                                                                                     //
Push.addListener('token', function (currentToken, value) {                                                           // 3
  if (value) {                                                                                                       // 4
    // Update the token for app                                                                                      //
    Push.appCollection.update({ token: currentToken }, { $set: { token: value } }, { multi: true });                 // 6
  } else if (value === null) {                                                                                       //
    // Remove the token for app                                                                                      //
    Push.appCollection.update({ token: currentToken }, { $unset: { token: true } }, { multi: true });                // 9
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Meteor.methods({                                                                                                     // 13
  'raix:push-update': function (options) {                                                                           // 14
    if (Push.debug) {                                                                                                // 15
      console.log('Push: Got push token from app:', options);                                                        // 16
    }                                                                                                                //
                                                                                                                     //
    check(options, {                                                                                                 // 19
      id: Match.Optional(String),                                                                                    // 20
      token: _matchToken,                                                                                            // 21
      appName: String,                                                                                               // 22
      userId: Match.OneOf(String, null),                                                                             // 23
      metadata: Match.Optional(Object)                                                                               // 24
    });                                                                                                              //
                                                                                                                     //
    // The if user id is set then user id should match on client and connection                                      //
    if (options.userId && options.userId !== this.userId) {                                                          // 28
      throw new Meteor.Error(403, 'Forbidden access');                                                               // 29
    }                                                                                                                //
                                                                                                                     //
    var doc;                                                                                                         // 32
                                                                                                                     //
    // lookup app by id if one was included                                                                          //
    if (options.id) {                                                                                                // 35
      doc = Push.appCollection.findOne({ _id: options.id });                                                         // 36
    }                                                                                                                //
                                                                                                                     //
    // No doc was found - we check the database to see if                                                            //
    // we can find a match for the app via token and appName                                                         //
    if (!doc) {                                                                                                      // 41
      doc = Push.appCollection.findOne({                                                                             // 42
        $and: [{ token: options.token }, // Match token                                                              // 43
        { appName: options.appName }, // Match appName                                                               // 45
        { token: { $exists: true } } // Make sure token exists                                                       // 46
        ]                                                                                                            //
      });                                                                                                            //
    }                                                                                                                //
                                                                                                                     //
    // if we could not find the id or token then create it                                                           //
    if (!doc) {                                                                                                      // 52
      // Rig default doc                                                                                             //
      doc = {                                                                                                        // 54
        token: options.token,                                                                                        // 55
        appName: options.appName,                                                                                    // 56
        userId: options.userId,                                                                                      // 57
        enabled: true,                                                                                               // 58
        createdAt: new Date(),                                                                                       // 59
        updatedAt: new Date()                                                                                        // 60
      };                                                                                                             //
                                                                                                                     //
      if (options.id) {                                                                                              // 63
        // XXX: We might want to check the id - Why isnt there a match for id                                        //
        // in the Meteor check... Normal length 17 (could be larger), and                                            //
        // numbers+letters are used in Random.id() with exception of 0 and 1                                         //
        doc._id = options.id;                                                                                        // 67
        // The user wanted us to use a specific id, we didn't find this while                                        //
        // searching. The client could depend on the id eg. as reference so                                          //
        // we respect this and try to create a document with the selected id;                                        //
        Push.appCollection._collection.insert(doc);                                                                  // 71
      } else {                                                                                                       //
        // Get the id from insert                                                                                    //
        doc._id = Push.appCollection.insert(doc);                                                                    // 74
      }                                                                                                              //
    } else {                                                                                                         //
      // We found the app so update the updatedAt and set the token                                                  //
      Push.appCollection.update({ _id: doc._id }, {                                                                  // 78
        $set: {                                                                                                      // 79
          updatedAt: new Date(),                                                                                     // 80
          token: options.token                                                                                       // 81
        }                                                                                                            //
      });                                                                                                            //
    }                                                                                                                //
                                                                                                                     //
    if (doc) {                                                                                                       // 86
      // xxx: Hack                                                                                                   //
      // Clean up mech making sure tokens are uniq - android sometimes generate                                      //
      // new tokens resulting in duplicates                                                                          //
      var removed = Push.appCollection.remove({                                                                      // 90
        $and: [{ _id: { $ne: doc._id } }, { token: doc.token }, // Match token                                       // 91
        { appName: doc.appName }, // Match appName                                                                   // 94
        { token: { $exists: true } } // Make sure token exists                                                       // 95
        ]                                                                                                            //
      });                                                                                                            //
                                                                                                                     //
      if (removed && Push.debug) {                                                                                   // 99
        console.log('Push: Removed ' + removed + ' existing app items');                                             // 100
      }                                                                                                              //
    }                                                                                                                //
                                                                                                                     //
    if (doc && Push.debug) {                                                                                         // 104
      console.log('Push: updated', doc);                                                                             // 105
    }                                                                                                                //
                                                                                                                     //
    if (!doc) {                                                                                                      // 108
      throw new Meteor.Error(500, 'setPushToken could not create record');                                           // 109
    }                                                                                                                //
    // Return the doc we want to use                                                                                 //
    return doc;                                                                                                      // 112
  },                                                                                                                 //
  'raix:push-setuser': function (id) {                                                                               // 114
    check(id, String);                                                                                               // 115
                                                                                                                     //
    if (Push.debug) {                                                                                                // 117
      console.log('Push: Settings userId "' + this.userId + '" for app:', id);                                       // 118
    }                                                                                                                //
    // We update the appCollection id setting the Meteor.userId                                                      //
    var found = Push.appCollection.update({ _id: id }, { $set: { userId: this.userId } });                           // 121
                                                                                                                     //
    // Note that the app id might not exist because no token is set yet.                                             //
    // We do create the new app id for the user since we might store additional                                      //
    // metadata for the app / user                                                                                   //
                                                                                                                     //
    // If id not found then create it?                                                                               //
    // We dont, its better to wait until the user wants to                                                           //
    // store metadata or token - We could end up with unused data in the                                             //
    // collection at every app re-install / update                                                                   //
    //                                                                                                               //
    // The user could store some metadata in appCollectin but only if they                                           //
    // have created the app and provided a token.                                                                    //
    // If not the metadata should be set via ground:db                                                               //
                                                                                                                     //
    return !!found;                                                                                                  // 136
  },                                                                                                                 //
  'raix:push-metadata': function (data) {                                                                            // 138
    check(data, {                                                                                                    // 139
      id: String,                                                                                                    // 140
      metadata: Object                                                                                               // 141
    });                                                                                                              //
                                                                                                                     //
    // Set the metadata                                                                                              //
    var found = Push.appCollection.update({ _id: data.id }, { $set: { metadata: data.metadata } });                  // 145
                                                                                                                     //
    return !!found;                                                                                                  // 147
  },                                                                                                                 //
  'raix:push-enable': function (data) {                                                                              // 149
    check(data, {                                                                                                    // 150
      id: String,                                                                                                    // 151
      enabled: Boolean                                                                                               // 152
    });                                                                                                              //
                                                                                                                     //
    if (Push.debug) {                                                                                                // 155
      console.log('Push: Setting enabled to "' + data.enabled + '" for app:', data.id);                              // 156
    }                                                                                                                //
                                                                                                                     //
    var found = Push.appCollection.update({ _id: data.id }, { $set: { enabled: data.enabled } });                    // 159
                                                                                                                     //
    return !!found;                                                                                                  // 161
  }                                                                                                                  //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['raix:push'] = {
  Push: Push,
  _matchToken: _matchToken,
  checkClientSecurity: checkClientSecurity,
  initPushUpdates: initPushUpdates,
  _replaceToken: _replaceToken,
  _removeToken: _removeToken
};

})();

//# sourceMappingURL=raix_push.js.map
