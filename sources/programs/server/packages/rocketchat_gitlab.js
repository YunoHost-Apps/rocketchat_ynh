(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var CustomOAuth = Package['rocketchat:custom-oauth'].CustomOAuth;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// packages/rocketchat_gitlab/common.coffee.js                               //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Gitlab, config;                                                          // 1
                                                                             //
config = {                                                                   // 1
  serverURL: 'https://gitlab.com',                                           // 2
  identityPath: '/api/v3/user',                                              // 2
  addAutopublishFields: {                                                    // 2
    forLoggedInUser: ['services.gitlab'],                                    // 5
    forOtherUsers: ['services.gitlab.username']                              // 5
  }                                                                          //
};                                                                           //
                                                                             //
Gitlab = new CustomOAuth('gitlab', config);                                  // 1
                                                                             //
if (Meteor.isServer) {                                                       // 10
  Meteor.startup(function() {                                                // 11
    return RocketChat.models.Settings.findById('API_Gitlab_URL').observe({   //
      added: function(record) {                                              // 13
        config.serverURL = RocketChat.settings.get('API_Gitlab_URL');        // 14
        return Gitlab.configure(config);                                     //
      },                                                                     //
      changed: function(record) {                                            // 13
        config.serverURL = RocketChat.settings.get('API_Gitlab_URL');        // 17
        return Gitlab.configure(config);                                     //
      }                                                                      //
    });                                                                      //
  });                                                                        //
} else {                                                                     //
  Meteor.startup(function() {                                                // 20
    return Tracker.autorun(function() {                                      //
      if (RocketChat.settings.get('API_Gitlab_URL')) {                       // 22
        config.serverURL = RocketChat.settings.get('API_Gitlab_URL');        // 23
        return Gitlab.configure(config);                                     //
      }                                                                      //
    });                                                                      //
  });                                                                        //
}                                                                            //
                                                                             //
///////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// packages/rocketchat_gitlab/startup.coffee.js                              //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.settings.addGroup('OAuth', function() {                           // 1
  return this.section('GitLab', function() {                                 //
    var enableQuery;                                                         // 3
    enableQuery = {                                                          // 3
      _id: 'Accounts_OAuth_Gitlab',                                          // 3
      value: true                                                            // 3
    };                                                                       //
    this.add('Accounts_OAuth_Gitlab', false, {                               // 3
      type: 'boolean',                                                       // 4
      "public": true                                                         // 4
    });                                                                      //
    this.add('API_Gitlab_URL', '', {                                         // 3
      type: 'string',                                                        // 5
      enableQuery: enableQuery,                                              // 5
      "public": true                                                         // 5
    });                                                                      //
    this.add('Accounts_OAuth_Gitlab_id', '', {                               // 3
      type: 'string',                                                        // 6
      enableQuery: enableQuery                                               // 6
    });                                                                      //
    this.add('Accounts_OAuth_Gitlab_secret', '', {                           // 3
      type: 'string',                                                        // 7
      enableQuery: enableQuery                                               // 7
    });                                                                      //
    return this.add('Accounts_OAuth_Gitlab_callback_url', '_oauth/gitlab', {
      type: 'relativeUrl',                                                   // 8
      readonly: true,                                                        // 8
      force: true,                                                           // 8
      enableQuery: enableQuery                                               // 8
    });                                                                      //
  });                                                                        //
});                                                                          // 1
                                                                             //
///////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:gitlab'] = {};

})();

//# sourceMappingURL=rocketchat_gitlab.js.map
