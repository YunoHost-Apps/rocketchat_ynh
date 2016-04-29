(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v014.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 14,                                                         // 2
  up: function() {                                                     // 2
    var i, len, metaKeys, newValue, oldAndNew, oldValue, ref, ref1;    // 5
    RocketChat.models.Settings.remove({                                // 5
      _id: "API_Piwik_URL"                                             // 5
    });                                                                //
    RocketChat.models.Settings.remove({                                // 5
      _id: "API_Piwik_ID"                                              // 6
    });                                                                //
    RocketChat.models.Settings.remove({                                // 5
      _id: "Message_Edit"                                              // 8
    });                                                                //
    RocketChat.models.Settings.remove({                                // 5
      _id: "Message_Delete"                                            // 9
    });                                                                //
    RocketChat.models.Settings.remove({                                // 5
      _id: "Message_KeepStatusHistory"                                 // 10
    });                                                                //
    RocketChat.models.Settings.update({                                // 5
      _id: "Message_ShowEditedStatus"                                  // 12
    }, {                                                               //
      $set: {                                                          // 12
        type: "boolean",                                               // 12
        value: true                                                    // 12
      }                                                                //
    });                                                                //
    RocketChat.models.Settings.update({                                // 5
      _id: "Message_ShowDeletedStatus"                                 // 13
    }, {                                                               //
      $set: {                                                          // 13
        type: "boolean",                                               // 13
        value: false                                                   // 13
      }                                                                //
    });                                                                //
    metaKeys = [                                                       // 5
      {                                                                //
        'old': 'Meta:language',                                        // 16
        'new': 'Meta_language'                                         // 16
      }, {                                                             //
        'old': 'Meta:fb:app_id',                                       // 19
        'new': 'Meta_fb_app_id'                                        // 19
      }, {                                                             //
        'old': 'Meta:robots',                                          // 22
        'new': 'Meta_robots'                                           // 22
      }, {                                                             //
        'old': 'Meta:google-site-verification',                        // 25
        'new': 'Meta_google-site-verification'                         // 25
      }, {                                                             //
        'old': 'Meta:msvalidate.01',                                   // 28
        'new': 'Meta_msvalidate01'                                     // 28
      }                                                                //
    ];                                                                 //
    for (i = 0, len = metaKeys.length; i < len; i++) {                 // 32
      oldAndNew = metaKeys[i];                                         //
      oldValue = (ref = RocketChat.models.Settings.findOne({           // 33
        _id: oldAndNew.old                                             //
      })) != null ? ref.value : void 0;                                //
      newValue = (ref1 = RocketChat.models.Settings.findOne({          // 33
        _id: oldAndNew["new"]                                          //
      })) != null ? ref1.value : void 0;                               //
      if ((oldValue != null) && (newValue == null)) {                  // 35
        RocketChat.models.Settings.update({                            // 36
          _id: oldAndNew["new"]                                        // 36
        }, {                                                           //
          $set: {                                                      // 36
            value: newValue                                            // 36
          }                                                            //
        });                                                            //
      }                                                                //
      RocketChat.models.Settings.remove({                              // 33
        _id: oldAndNew.old                                             // 38
      });                                                              //
    }                                                                  // 32
    return RocketChat.models.Settings.remove({                         //
      _id: "SMTP_Security"                                             // 41
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v014.coffee.js.map
