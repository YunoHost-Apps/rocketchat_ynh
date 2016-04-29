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

/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                 //
// packages/rocketchat_github-enterprise/common.coffee.js                                          //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var GitHubEnterprise, config;                                                                      // 3
                                                                                                   //
config = {                                                                                         // 3
  serverURL: '',                                                                                   // 4
  identityPath: '/api/v3/user',                                                                    // 4
  authorizePath: '/login/oauth/authorize',                                                         // 4
  tokenPath: '/login/oauth/access_token',                                                          // 4
  addAutopublishFields: {                                                                          // 4
    forLoggedInUser: ['services.github-enterprise'],                                               // 9
    forOtherUsers: ['services.github-enterprise.username']                                         // 9
  }                                                                                                //
};                                                                                                 //
                                                                                                   //
GitHubEnterprise = new CustomOAuth('github_enterprise', config);                                   // 3
                                                                                                   //
if (Meteor.isServer) {                                                                             // 14
  Meteor.startup(function() {                                                                      // 15
    return RocketChat.models.Settings.findById('API_GitHub_Enterprise_URL').observe({              //
      added: function(record) {                                                                    // 17
        config.serverURL = RocketChat.settings.get('API_GitHub_Enterprise_URL');                   // 18
        return GitHubEnterprise.configure(config);                                                 //
      },                                                                                           //
      changed: function(record) {                                                                  // 17
        config.serverURL = RocketChat.settings.get('API_GitHub_Enterprise_URL');                   // 21
        return GitHubEnterprise.configure(config);                                                 //
      }                                                                                            //
    });                                                                                            //
  });                                                                                              //
} else {                                                                                           //
  Meteor.startup(function() {                                                                      // 24
    return Tracker.autorun(function() {                                                            //
      if (RocketChat.settings.get('API_GitHub_Enterprise_URL')) {                                  // 26
        config.serverURL = RocketChat.settings.get('API_GitHub_Enterprise_URL');                   // 27
        return GitHubEnterprise.configure(config);                                                 //
      }                                                                                            //
    });                                                                                            //
  });                                                                                              //
}                                                                                                  //
                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                 //
// packages/rocketchat_github-enterprise/startup.coffee.js                                         //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.settings.addGroup('OAuth', function() {                                                 // 1
  return this.section('GitHub Enterprise', function() {                                            //
    var enableQuery;                                                                               // 3
    enableQuery = {                                                                                // 3
      _id: 'Accounts_OAuth_GitHub_Enterprise',                                                     // 3
      value: true                                                                                  // 3
    };                                                                                             //
    this.add('Accounts_OAuth_GitHub_Enterprise', false, {                                          // 3
      type: 'boolean'                                                                              // 4
    });                                                                                            //
    this.add('API_GitHub_Enterprise_URL', '', {                                                    // 3
      type: 'string',                                                                              // 5
      "public": true,                                                                              // 5
      enableQuery: enableQuery,                                                                    // 5
      i18nDescription: 'API_GitHub_Enterprise_URL_Description'                                     // 5
    });                                                                                            //
    this.add('Accounts_OAuth_GitHub_Enterprise_id', '', {                                          // 3
      type: 'string',                                                                              // 6
      enableQuery: enableQuery                                                                     // 6
    });                                                                                            //
    this.add('Accounts_OAuth_GitHub_Enterprise_secret', '', {                                      // 3
      type: 'string',                                                                              // 7
      enableQuery: enableQuery                                                                     // 7
    });                                                                                            //
    return this.add('Accounts_OAuth_GitHub_Enterprise_callback_url', '_oauth/github_enterprise', {
      type: 'relativeUrl',                                                                         // 8
      readonly: true,                                                                              // 8
      force: true,                                                                                 // 8
      enableQuery: enableQuery                                                                     // 8
    });                                                                                            //
  });                                                                                              //
});                                                                                                // 1
                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:github-enterprise'] = {};

})();

//# sourceMappingURL=rocketchat_github-enterprise.js.map
