(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v029.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 29,                                                         // 2
  up: function() {                                                     // 2
    var LDAP_Bind_Search, LDAP_DN, LDAP_TLS, LDAP_Url, ref, ref1, ref2, ref3;
    LDAP_Url = (ref = RocketChat.models.Settings.findOne('LDAP_Url')) != null ? ref.value : void 0;
    LDAP_TLS = (ref1 = RocketChat.models.Settings.findOne('LDAP_TLS')) != null ? ref1.value : void 0;
    LDAP_DN = (ref2 = RocketChat.models.Settings.findOne('LDAP_DN')) != null ? ref2.value : void 0;
    LDAP_Bind_Search = (ref3 = RocketChat.models.Settings.findOne('LDAP_Bind_Search')) != null ? ref3.value : void 0;
    if ((LDAP_Url != null) && LDAP_Url.trim() !== '') {                // 9
      LDAP_Url = LDAP_Url.replace(/ldaps?:\/\//i, '');                 // 10
      RocketChat.models.Settings.upsert({                              // 10
        _id: 'LDAP_Host'                                               // 12
      }, {                                                             //
        $set: {                                                        // 14
          value: LDAP_Url                                              // 15
        },                                                             //
        $setOnInsert: {                                                // 14
          createdAt: new Date                                          // 17
        }                                                              //
      });                                                              //
    }                                                                  //
    if (LDAP_TLS === true) {                                           // 19
      RocketChat.models.Settings.upsert({                              // 20
        _id: 'LDAP_Encryption'                                         // 21
      }, {                                                             //
        $set: {                                                        // 23
          value: 'tls'                                                 // 24
        },                                                             //
        $setOnInsert: {                                                // 23
          createdAt: new Date                                          // 26
        }                                                              //
      });                                                              //
    }                                                                  //
    if ((LDAP_DN != null) && LDAP_DN.trim() !== '') {                  // 28
      RocketChat.models.Settings.upsert({                              // 29
        _id: 'LDAP_Domain_Base'                                        // 30
      }, {                                                             //
        $set: {                                                        // 32
          value: LDAP_DN                                               // 33
        },                                                             //
        $setOnInsert: {                                                // 32
          createdAt: new Date                                          // 35
        }                                                              //
      });                                                              //
      RocketChat.models.Settings.upsert({                              // 29
        _id: 'LDAP_Username_Field'                                     // 38
      }, {                                                             //
        $set: {                                                        // 40
          value: ''                                                    // 41
        },                                                             //
        $setOnInsert: {                                                // 40
          createdAt: new Date                                          // 43
        }                                                              //
      });                                                              //
      RocketChat.models.Settings.upsert({                              // 29
        _id: 'LDAP_Unique_Identifier_Field'                            // 46
      }, {                                                             //
        $set: {                                                        // 48
          value: ''                                                    // 49
        },                                                             //
        $setOnInsert: {                                                // 48
          createdAt: new Date                                          // 51
        }                                                              //
      });                                                              //
    }                                                                  //
    if ((LDAP_Bind_Search != null) && LDAP_Bind_Search.trim() !== '') {
      RocketChat.models.Settings.upsert({                              // 54
        _id: 'LDAP_Custom_Domain_Search'                               // 55
      }, {                                                             //
        $set: {                                                        // 57
          value: LDAP_Bind_Search                                      // 58
        },                                                             //
        $setOnInsert: {                                                // 57
          createdAt: new Date                                          // 60
        }                                                              //
      });                                                              //
      RocketChat.models.Settings.upsert({                              // 54
        _id: 'LDAP_Use_Custom_Domain_Search'                           // 63
      }, {                                                             //
        $set: {                                                        // 65
          value: true                                                  // 66
        },                                                             //
        $setOnInsert: {                                                // 65
          createdAt: new Date                                          // 68
        }                                                              //
      });                                                              //
    }                                                                  //
    RocketChat.models.Settings.remove({                                // 4
      _id: 'LDAP_Url'                                                  // 71
    });                                                                //
    RocketChat.models.Settings.remove({                                // 4
      _id: 'LDAP_TLS'                                                  // 72
    });                                                                //
    RocketChat.models.Settings.remove({                                // 4
      _id: 'LDAP_DN'                                                   // 73
    });                                                                //
    return RocketChat.models.Settings.remove({                         //
      _id: 'LDAP_Bind_Search'                                          // 74
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v029.coffee.js.map
