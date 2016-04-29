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

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/rocketchat_wordpress/common.coffee.js                                  //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var WordPress, config;                                                             // 1
                                                                                   //
config = {                                                                         // 1
  serverURL: '',                                                                   // 2
  identityPath: '/oauth/me',                                                       // 2
  addAutopublishFields: {                                                          // 2
    forLoggedInUser: ['services.wordpress'],                                       // 5
    forOtherUsers: ['services.wordpress.user_login']                               // 5
  }                                                                                //
};                                                                                 //
                                                                                   //
WordPress = new CustomOAuth('wordpress', config);                                  // 1
                                                                                   //
if (Meteor.isServer) {                                                             // 10
  Meteor.startup(function() {                                                      // 11
    return RocketChat.models.Settings.find({                                       //
      _id: 'API_Wordpress_URL'                                                     // 12
    }).observe({                                                                   //
      added: function(record) {                                                    // 13
        config.serverURL = RocketChat.settings.get('API_Wordpress_URL');           // 14
        return WordPress.configure(config);                                        //
      },                                                                           //
      changed: function(record) {                                                  // 13
        config.serverURL = RocketChat.settings.get('API_Wordpress_URL');           // 17
        return WordPress.configure(config);                                        //
      }                                                                            //
    });                                                                            //
  });                                                                              //
} else {                                                                           //
  Meteor.startup(function() {                                                      // 20
    return Tracker.autorun(function() {                                            //
      if (RocketChat.settings.get('API_Wordpress_URL')) {                          // 22
        config.serverURL = RocketChat.settings.get('API_Wordpress_URL');           // 23
        return WordPress.configure(config);                                        //
      }                                                                            //
    });                                                                            //
  });                                                                              //
}                                                                                  //
                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/rocketchat_wordpress/startup.coffee.js                                 //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.settings.addGroup('OAuth', function() {                                 // 1
  return this.section('WordPress', function() {                                    //
    var enableQuery;                                                               // 3
    enableQuery = {                                                                // 3
      _id: 'Accounts_OAuth_Wordpress',                                             // 3
      value: true                                                                  // 3
    };                                                                             //
    this.add('Accounts_OAuth_Wordpress', false, {                                  // 3
      type: 'boolean',                                                             // 4
      "public": true                                                               // 4
    });                                                                            //
    this.add('API_Wordpress_URL', '', {                                            // 3
      type: 'string',                                                              // 5
      enableQuery: enableQuery,                                                    // 5
      "public": true                                                               // 5
    });                                                                            //
    this.add('Accounts_OAuth_Wordpress_id', '', {                                  // 3
      type: 'string',                                                              // 6
      enableQuery: enableQuery                                                     // 6
    });                                                                            //
    this.add('Accounts_OAuth_Wordpress_secret', '', {                              // 3
      type: 'string',                                                              // 7
      enableQuery: enableQuery                                                     // 7
    });                                                                            //
    return this.add('Accounts_OAuth_Wordpress_callback_url', '_oauth/wordpress', {
      type: 'relativeUrl',                                                         // 8
      readonly: true,                                                              // 8
      force: true,                                                                 // 8
      enableQuery: enableQuery                                                     // 8
    });                                                                            //
  });                                                                              //
});                                                                                // 1
                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:wordpress'] = {};

})();

//# sourceMappingURL=rocketchat_wordpress.js.map
