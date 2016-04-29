(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/lib/cordova.coffee.js                                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var configurePush, sendPush;                                           // 1
                                                                       //
Meteor.methods({                                                       // 1
  log: function() {                                                    // 2
    return console.log.apply(console, arguments);                      //
  },                                                                   //
  push_test: function() {                                              // 2
    var query, tokens, user;                                           // 6
    user = Meteor.user();                                              // 6
    if (user == null) {                                                // 7
      throw new Meteor.Error('unauthorized', '[methods] push_test -> Unauthorized');
    }                                                                  //
    if (!RocketChat.authz.hasRole(user._id, 'admin')) {                // 10
      throw new Meteor.Error('unauthorized', '[methods] push_test -> Unauthorized');
    }                                                                  //
    if (Push.enabled !== true) {                                       // 13
      throw new Meteor.Error('push_disabled');                         // 14
    }                                                                  //
    query = {                                                          // 6
      $and: [                                                          // 17
        {                                                              //
          userId: user._id                                             // 18
        }, {                                                           //
          $or: [                                                       // 19
            {                                                          //
              'token.apn': {                                           // 21
                $exists: true                                          // 21
              }                                                        //
            }, {                                                       //
              'token.gcm': {                                           // 22
                $exists: true                                          // 22
              }                                                        //
            }                                                          //
          ]                                                            //
        }                                                              //
      ]                                                                //
    };                                                                 //
    tokens = Push.appCollection.find(query).count();                   // 6
    if (tokens === 0) {                                                // 29
      throw new Meteor.Error('no_tokens_for_this_user');               // 30
    }                                                                  //
    Push.send({                                                        // 6
      from: 'push',                                                    // 33
      title: "@" + user.username,                                      // 33
      text: TAPi18n.__("This_is_a_push_test_messsage"),                // 33
      apn: {                                                           // 33
        text: ("@" + user.username + ":\n") + TAPi18n.__("This_is_a_push_test_messsage")
      },                                                               //
      sound: 'chime',                                                  // 33
      query: {                                                         // 33
        userId: user._id                                               // 40
      }                                                                //
    });                                                                //
    return {                                                           // 42
      message: "Your_push_was_sent_to_s_devices",                      // 43
      params: [tokens]                                                 // 43
    };                                                                 //
  }                                                                    //
});                                                                    //
                                                                       //
configurePush = function() {                                           // 1
  var apn, gcm;                                                        // 48
  if (RocketChat.settings.get('Push_debug')) {                         // 48
    console.log('Push: configuring...');                               // 49
  }                                                                    //
  if (RocketChat.settings.get('Push_enable') === true) {               // 51
    Push.allow({                                                       // 52
      send: function(userId, notification) {                           // 53
        return RocketChat.authz.hasRole(userId, 'admin');              // 54
      }                                                                //
    });                                                                //
    apn = void 0;                                                      // 52
    gcm = void 0;                                                      // 52
    if (RocketChat.settings.get('Push_enable_gateway') === false) {    // 59
      gcm = {                                                          // 60
        apiKey: RocketChat.settings.get('Push_gcm_api_key'),           // 61
        projectNumber: RocketChat.settings.get('Push_gcm_project_number')
      };                                                               //
      apn = {                                                          // 60
        passphrase: RocketChat.settings.get('Push_apn_passphrase'),    // 65
        keyData: RocketChat.settings.get('Push_apn_key'),              // 65
        certData: RocketChat.settings.get('Push_apn_cert')             // 65
      };                                                               //
      if (RocketChat.settings.get('Push_production') !== true) {       // 69
        apn = {                                                        // 70
          passphrase: RocketChat.settings.get('Push_apn_dev_passphrase'),
          keyData: RocketChat.settings.get('Push_apn_dev_key'),        // 71
          certData: RocketChat.settings.get('Push_apn_dev_cert'),      // 71
          gateway: 'gateway.sandbox.push.apple.com'                    // 71
        };                                                             //
      }                                                                //
      if ((apn.keyData == null) || apn.keyData.trim() === '' || (apn.keyData == null) || apn.keyData.trim() === '') {
        apn = void 0;                                                  // 77
      }                                                                //
      if ((gcm.apiKey == null) || gcm.apiKey.trim() === '' || (gcm.projectNumber == null) || gcm.projectNumber.trim() === '') {
        gcm = void 0;                                                  // 80
      }                                                                //
    }                                                                  //
    Push.Configure({                                                   // 52
      apn: apn,                                                        // 83
      gcm: gcm,                                                        // 83
      production: RocketChat.settings.get('Push_production'),          // 83
      sendInterval: 1000,                                              // 83
      sendBatchSize: 10                                                // 83
    });                                                                //
    if (RocketChat.settings.get('Push_enable_gateway') === true) {     // 89
      Push.serverSend = function(options) {                            // 90
        var query;                                                     // 91
        options = options || {                                         // 91
          badge: 0                                                     // 91
        };                                                             //
        query = void 0;                                                // 91
        if (options.from !== '' + options.from) {                      // 94
          throw new Error('Push.send: option "from" not a string');    // 95
        }                                                              //
        if (options.title !== '' + options.title) {                    // 97
          throw new Error('Push.send: option "title" not a string');   // 98
        }                                                              //
        if (options.text !== '' + options.text) {                      // 100
          throw new Error('Push.send: option "text" not a string');    // 101
        }                                                              //
        if (RocketChat.settings.get('Push_debug')) {                   // 103
          console.log('Push: send message "' + options.title + '" via query', options.query);
        }                                                              //
        query = {                                                      // 91
          $and: [                                                      // 107
            options.query, {                                           //
              $or: [                                                   // 109
                {                                                      //
                  'token.apn': {                                       // 111
                    $exists: true                                      // 111
                  }                                                    //
                }, {                                                   //
                  'token.gcm': {                                       // 112
                    $exists: true                                      // 112
                  }                                                    //
                }                                                      //
              ]                                                        //
            }                                                          //
          ]                                                            //
        };                                                             //
        return Push.appCollection.find(query).forEach(function(app) {  //
          var service, token;                                          // 118
          if (RocketChat.settings.get('Push_debug')) {                 // 118
            console.log('Push: send to token', app.token);             // 119
          }                                                            //
          if (app.token.apn != null) {                                 // 121
            service = 'apn';                                           // 122
            token = app.token.apn;                                     // 122
          } else if (app.token.gcm != null) {                          //
            service = 'gcm';                                           // 125
            token = app.token.gcm;                                     // 125
          }                                                            //
          return sendPush(service, token, options);                    //
        });                                                            //
      };                                                               //
    }                                                                  //
    return Push.enabled = true;                                        //
  }                                                                    //
};                                                                     // 47
                                                                       //
sendPush = function(service, token, options, tries) {                  // 1
  var e, milli;                                                        // 133
  if (tries == null) {                                                 //
    tries = 0;                                                         //
  }                                                                    //
  try {                                                                // 133
    return HTTP.post(RocketChat.settings.get('Push_gateway') + ("/push/" + service + "/send"), {
      data: {                                                          // 135
        token: token,                                                  // 136
        options: options                                               // 136
      }                                                                //
    });                                                                //
  } catch (_error) {                                                   //
    e = _error;                                                        // 139
    SystemLogger.error('Error sending push to gateway (' + tries + ' try) ->', e);
    if (tries <= 6) {                                                  // 140
      milli = Math.pow(10, tries + 2);                                 // 141
      SystemLogger.log('Trying sending push to gateway again in', milli, 'milliseconds');
      return Meteor.setTimeout(function() {                            //
        return sendPush(service, token, options, tries + 1);           //
      }, milli);                                                       //
    }                                                                  //
  }                                                                    //
};                                                                     // 132
                                                                       //
Meteor.startup(function() {                                            // 1
  return configurePush();                                              //
});                                                                    // 150
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=cordova.coffee.js.map
