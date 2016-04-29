(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v018.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 18,                                                         // 2
  up: function() {                                                     // 2
    var changes, from, record, to;                                     // 4
    changes = {                                                        // 4
      Accounts_Facebook: 'Accounts_OAuth_Facebook',                    // 5
      Accounts_Facebook_id: 'Accounts_OAuth_Facebook_id',              // 5
      Accounts_Facebook_secret: 'Accounts_OAuth_Facebook_secret',      // 5
      Accounts_Google: 'Accounts_OAuth_Google',                        // 5
      Accounts_Google_id: 'Accounts_OAuth_Google_id',                  // 5
      Accounts_Google_secret: 'Accounts_OAuth_Google_secret',          // 5
      Accounts_Github: 'Accounts_OAuth_Github',                        // 5
      Accounts_Github_id: 'Accounts_OAuth_Github_id',                  // 5
      Accounts_Github_secret: 'Accounts_OAuth_Github_secret',          // 5
      Accounts_Gitlab: 'Accounts_OAuth_Gitlab',                        // 5
      Accounts_Gitlab_id: 'Accounts_OAuth_Gitlab_id',                  // 5
      Accounts_Gitlab_secret: 'Accounts_OAuth_Gitlab_secret',          // 5
      Accounts_Linkedin: 'Accounts_OAuth_Linkedin',                    // 5
      Accounts_Linkedin_id: 'Accounts_OAuth_Linkedin_id',              // 5
      Accounts_Linkedin_secret: 'Accounts_OAuth_Linkedin_secret',      // 5
      Accounts_Meteor: 'Accounts_OAuth_Meteor',                        // 5
      Accounts_Meteor_id: 'Accounts_OAuth_Meteor_id',                  // 5
      Accounts_Meteor_secret: 'Accounts_OAuth_Meteor_secret',          // 5
      Accounts_Twitter: 'Accounts_OAuth_Twitter',                      // 5
      Accounts_Twitter_id: 'Accounts_OAuth_Twitter_id',                // 5
      Accounts_Twitter_secret: 'Accounts_OAuth_Twitter_secret'         // 5
    };                                                                 //
    for (from in changes) {                                            // 27
      to = changes[from];                                              //
      record = RocketChat.models.Settings.findOne({                    // 28
        _id: from                                                      // 28
      });                                                              //
      if (record != null) {                                            // 29
        delete record._id;                                             // 30
        RocketChat.models.Settings.upsert({                            // 30
          _id: to                                                      // 31
        }, record);                                                    //
      }                                                                //
      RocketChat.models.Settings.remove({                              // 28
        _id: from                                                      // 32
      });                                                              //
    }                                                                  // 27
    return ServiceConfiguration.configurations.remove({});             //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v018.coffee.js.map
