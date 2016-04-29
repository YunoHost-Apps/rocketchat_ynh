(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v030.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 30,                                                         // 2
  up: function() {                                                     // 2
    var WebRTC_STUN_Server, WebRTC_TURN_Password, WebRTC_TURN_Server, WebRTC_TURN_Username, ref, ref1, ref2, ref3, servers;
    WebRTC_STUN_Server = (ref = RocketChat.models.Settings.findOne('WebRTC_STUN_Server')) != null ? ref.value : void 0;
    WebRTC_TURN_Server = (ref1 = RocketChat.models.Settings.findOne('WebRTC_TURN_Server')) != null ? ref1.value : void 0;
    WebRTC_TURN_Username = (ref2 = RocketChat.models.Settings.findOne('WebRTC_TURN_Username')) != null ? ref2.value : void 0;
    WebRTC_TURN_Password = (ref3 = RocketChat.models.Settings.findOne('WebRTC_TURN_Password')) != null ? ref3.value : void 0;
    RocketChat.models.Settings.remove({                                // 4
      _id: 'WebRTC_STUN_Server'                                        // 10
    });                                                                //
    RocketChat.models.Settings.remove({                                // 4
      _id: 'WebRTC_TURN_Server'                                        // 11
    });                                                                //
    RocketChat.models.Settings.remove({                                // 4
      _id: 'WebRTC_TURN_Username'                                      // 12
    });                                                                //
    RocketChat.models.Settings.remove({                                // 4
      _id: 'WebRTC_TURN_Password'                                      // 13
    });                                                                //
    if (WebRTC_STUN_Server === 'stun:stun.l.google.com:19302' && WebRTC_TURN_Server === 'turn:numb.viagenie.ca:3478' && WebRTC_TURN_Username === 'team@rocket.chat' && WebRTC_TURN_Password === 'demo') {
      return;                                                          // 17
    }                                                                  //
    servers = '';                                                      // 4
    if (WebRTC_STUN_Server != null) {                                  // 21
      servers += WebRTC_STUN_Server;                                   // 22
    }                                                                  //
    if (WebRTC_TURN_Server != null) {                                  // 24
      servers += ', ';                                                 // 25
      if (WebRTC_TURN_Username != null) {                              // 26
        servers += encodeURIComponent(WebRTC_TURN_Username) + ':' + encodeURIComponent(WebRTC_TURN_Password) + '@';
      }                                                                //
      servers += WebRTC_TURN_Server;                                   // 25
    }                                                                  //
    if (servers !== '') {                                              // 30
      return RocketChat.models.Settings.upsert({                       //
        _id: 'WebRTC_Servers'                                          // 32
      }, {                                                             //
        $set: {                                                        // 34
          value: servers                                               // 35
        },                                                             //
        $setOnInsert: {                                                // 34
          createdAt: new Date                                          // 37
        }                                                              //
      });                                                              //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v030.coffee.js.map
