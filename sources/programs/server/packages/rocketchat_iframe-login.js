(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Logger = Package['rocketchat:logger'].Logger;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/rocketchat_iframe-login/iframe_rocketchat.js                               //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
Meteor.startup(function () {                                                           // 1
	RocketChat.settings.addGroup('Accounts', function () {                                // 2
		this.section('Iframe', function () {                                                 // 3
			this.add('Accounts_iframe_enabled', false, { type: 'boolean', 'public': true });    // 4
			this.add('Accounts_iframe_url', '', { type: 'string', 'public': true });            // 5
			this.add('Accounts_Iframe_api_url', '', { type: 'string', 'public': true });        // 6
			this.add('Accounts_Iframe_api_method', 'POST', { type: 'string', 'public': true });
		});                                                                                  //
	});                                                                                   //
});                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/rocketchat_iframe-login/iframe_server.js                                   //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
/* globals Accounts */                                                                 //
                                                                                       //
Accounts.registerLoginHandler('iframe', function (result) {                            // 3
	if (!result.iframe) {                                                                 // 4
		return;                                                                              // 5
	}                                                                                     //
                                                                                       //
	console.log('[Method] registerLoginHandler');                                         // 8
                                                                                       //
	var user = Meteor.users.findOne({                                                     // 10
		'services.iframe.token': result.token                                                // 11
	});                                                                                   //
                                                                                       //
	if (user) {                                                                           // 14
		return {                                                                             // 15
			userId: user._id                                                                    // 16
		};                                                                                   //
	}                                                                                     //
});                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:iframe-login'] = {};

})();

//# sourceMappingURL=rocketchat_iframe-login.js.map
