(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var logger;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_cas/cas_rocketchat.js                                                                    //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/* globals logger:true */                                                                                       //
                                                                                                                //
logger = new Logger('CAS', {});                                                                                 // 3
                                                                                                                //
Meteor.startup(function () {                                                                                    // 5
	RocketChat.settings.addGroup('CAS', function () {                                                              // 6
		this.add('CAS_enabled', false, { type: 'boolean', group: 'CAS', 'public': true });                            // 7
		this.add('CAS_base_url', '', { type: 'string', group: 'CAS', 'public': true });                               // 8
		this.add('CAS_login_url', '', { type: 'string', group: 'CAS', 'public': true });                              // 9
		this.add('CAS_version', '1.0', { type: 'select', values: [{ key: '1.0', i18nLabel: '1.0' }], group: 'CAS' });
                                                                                                                //
		this.section('CAS Login Layout', function () {                                                                // 12
			this.add('CAS_popup_width', '810', { type: 'string', group: 'CAS', 'public': true });                        // 13
			this.add('CAS_popup_height', '610', { type: 'string', group: 'CAS', 'public': true });                       // 14
			this.add('CAS_button_label_text', 'CAS', { type: 'string', group: 'CAS' });                                  // 15
			this.add('CAS_button_label_color', '#FFFFFF', { type: 'color', group: 'CAS' });                              // 16
			this.add('CAS_button_color', '#13679A', { type: 'color', group: 'CAS' });                                    // 17
			this.add('CAS_autoclose', true, { type: 'boolean', group: 'CAS' });                                          // 18
		});                                                                                                           //
	});                                                                                                            //
});                                                                                                             //
                                                                                                                //
var timer;                                                                                                      // 23
                                                                                                                //
function updateServices() /*record*/{                                                                           // 25
	if (typeof timer !== 'undefined') {                                                                            // 26
		Meteor.clearTimeout(timer);                                                                                   // 27
	}                                                                                                              //
                                                                                                                //
	timer = Meteor.setTimeout(function () {                                                                        // 30
		var data = {                                                                                                  // 31
			// These will pe passed to 'node-cas' as options                                                             //
			enabled: RocketChat.settings.get('CAS_enabled'),                                                             // 33
			base_url: RocketChat.settings.get('CAS_base_url'),                                                           // 34
			login_url: RocketChat.settings.get('CAS_login_url'),                                                         // 35
			// Rocketchat Visuals                                                                                        //
			buttonLabelText: RocketChat.settings.get('CAS_button_label_text'),                                           // 37
			buttonLabelColor: RocketChat.settings.get('CAS_button_label_color'),                                         // 38
			buttonColor: RocketChat.settings.get('CAS_button_color'),                                                    // 39
			width: RocketChat.settings.get('CAS_popup_width'),                                                           // 40
			height: RocketChat.settings.get('CAS_popup_height'),                                                         // 41
			autoclose: RocketChat.settings.get('CAS_autoclose')                                                          // 42
		};                                                                                                            //
                                                                                                                //
		// Either register or deregister the CAS login service based upon its configuration                           //
		if (data.enabled) {                                                                                           // 46
			logger.info('Enabling CAS login service');                                                                   // 47
			ServiceConfiguration.configurations.upsert({ service: 'cas' }, { $set: data });                              // 48
		} else {                                                                                                      //
			logger.info('Disabling CAS login service');                                                                  // 50
			ServiceConfiguration.configurations.remove({ service: 'cas' });                                              // 51
		}                                                                                                             //
	}, 2000);                                                                                                      //
}                                                                                                               //
                                                                                                                //
function check_record(record) {                                                                                 // 56
	if (/^CAS_.+/.test(record._id)) {                                                                              // 57
		updateServices(record);                                                                                       // 58
	}                                                                                                              //
}                                                                                                               //
                                                                                                                //
RocketChat.models.Settings.find().observe({                                                                     // 62
	added: check_record,                                                                                           // 63
	changed: check_record,                                                                                         // 64
	removed: check_record                                                                                          // 65
});                                                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_cas/cas_server.js                                                                        //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/* globals RoutePolicy, logger */                                                                               //
/* jshint newcap: false */                                                                                      //
                                                                                                                //
var fiber = Npm.require('fibers');                                                                              // 4
var url = Npm.require('url');                                                                                   // 5
var CAS = Npm.require('cas');                                                                                   // 6
                                                                                                                //
var _casCredentialTokens = {};                                                                                  // 8
                                                                                                                //
RoutePolicy.declare('/_cas/', 'network');                                                                       // 10
                                                                                                                //
var closePopup = function (res) {                                                                               // 12
	res.writeHead(200, { 'Content-Type': 'text/html' });                                                           // 13
	var content = '<html><head><script>window.close()</script></head></html>';                                     // 14
	res.end(content, 'utf-8');                                                                                     // 15
};                                                                                                              //
                                                                                                                //
var casTicket = function (req, token, callback) {                                                               // 18
                                                                                                                //
	// get configuration                                                                                           //
	if (!RocketChat.settings.get('CAS_enabled')) {                                                                 // 21
		logger.error('Got ticket validation request, but CAS is not enabled');                                        // 22
		callback();                                                                                                   // 23
	}                                                                                                              //
                                                                                                                //
	// get ticket and validate.                                                                                    //
	var parsedUrl = url.parse(req.url, true);                                                                      // 27
	var ticketId = parsedUrl.query.ticket;                                                                         // 28
	var baseUrl = RocketChat.settings.get('CAS_base_url');                                                         // 29
	logger.debug('Using CAS_base_url: ' + baseUrl);                                                                // 30
                                                                                                                //
	var cas = new CAS({                                                                                            // 32
		base_url: baseUrl,                                                                                            // 33
		service: Meteor.absoluteUrl() + '_cas/' + token                                                               // 34
	});                                                                                                            //
                                                                                                                //
	cas.validate(ticketId, function (err, status, username) {                                                      // 37
		if (err) {                                                                                                    // 38
			logger.error('error when trying to validate ' + err);                                                        // 39
		} else {                                                                                                      //
			if (status) {                                                                                                // 41
				logger.info('Validated user: ' + username);                                                                 // 42
				_casCredentialTokens[token] = { id: username };                                                             // 43
			} else {                                                                                                     //
				logger.error('Unable to validate ticket: ' + ticketId);                                                     // 45
			}                                                                                                            //
		}                                                                                                             //
                                                                                                                //
		callback();                                                                                                   // 49
	});                                                                                                            //
                                                                                                                //
	return;                                                                                                        // 52
};                                                                                                              //
                                                                                                                //
var middleware = function (req, res, next) {                                                                    // 55
	// Make sure to catch any exceptions because otherwise we'd crash                                              //
	// the runner                                                                                                  //
	try {                                                                                                          // 58
		var barePath = req.url.substring(0, req.url.indexOf('?'));                                                    // 59
		var splitPath = barePath.split('/');                                                                          // 60
                                                                                                                //
		// Any non-cas request will continue down the default                                                         //
		// middlewares.                                                                                               //
		if (splitPath[1] !== '_cas') {                                                                                // 64
			next();                                                                                                      // 65
			return;                                                                                                      // 66
		}                                                                                                             //
                                                                                                                //
		// get auth token                                                                                             //
		var credentialToken = splitPath[2];                                                                           // 70
		if (!credentialToken) {                                                                                       // 71
			closePopup(res);                                                                                             // 72
			return;                                                                                                      // 73
		}                                                                                                             //
                                                                                                                //
		// validate ticket                                                                                            //
		casTicket(req, credentialToken, function () {                                                                 // 77
			closePopup(res);                                                                                             // 78
		});                                                                                                           //
	} catch (err) {                                                                                                //
		logger.error('Unexpected error : ' + err.message);                                                            // 82
		closePopup(res);                                                                                              // 83
	}                                                                                                              //
};                                                                                                              //
                                                                                                                //
// Listen to incoming OAuth http requests                                                                       //
WebApp.connectHandlers.use(function (req, res, next) {                                                          // 88
	// Need to create a fiber since we're using synchronous http calls and nothing                                 //
	// else is wrapping this in a fiber automatically                                                              //
	fiber(function () {                                                                                            // 91
		middleware(req, res, next);                                                                                   // 92
	}).run();                                                                                                      //
});                                                                                                             //
                                                                                                                //
var _hasCredential = function (credentialToken) {                                                               // 96
	return _.has(_casCredentialTokens, credentialToken);                                                           // 97
};                                                                                                              //
                                                                                                                //
/*                                                                                                              //
 * Retrieve token and delete it to avoid replaying it.                                                          //
 */                                                                                                             //
var _retrieveCredential = function (credentialToken) {                                                          // 103
	var result = _casCredentialTokens[credentialToken];                                                            // 104
	delete _casCredentialTokens[credentialToken];                                                                  // 105
	return result;                                                                                                 // 106
};                                                                                                              //
                                                                                                                //
/*                                                                                                              //
 * Register a server-side login handle.                                                                         //
 * It is call after Accounts.callLoginMethod() is call from client.                                             //
 *                                                                                                              //
 */                                                                                                             //
Accounts.registerLoginHandler(function (options) {                                                              // 114
                                                                                                                //
	if (!options.cas) {                                                                                            // 116
		return undefined;                                                                                             // 117
	}                                                                                                              //
                                                                                                                //
	if (!_hasCredential(options.cas.credentialToken)) {                                                            // 120
		throw new Meteor.Error(Accounts.LoginCancelledError.numericError, 'no matching login attempt found');         // 121
	}                                                                                                              //
                                                                                                                //
	var result = _retrieveCredential(options.cas.credentialToken);                                                 // 125
	options = { profile: { name: result.id } };                                                                    // 126
                                                                                                                //
	// Search existing user by its external service id                                                             //
	logger.debug('Looking up user with username: ' + result.id);                                                   // 129
	var user = Meteor.users.findOne({ 'services.cas.external_id': result.id });                                    // 130
                                                                                                                //
	if (user) {                                                                                                    // 132
		logger.debug('Using existing user for \'' + result.id + '\' with id: ' + user._id);                           // 133
	} else {                                                                                                       //
                                                                                                                //
		// Define new user                                                                                            //
		var newUser = {                                                                                               // 137
			username: result.id,                                                                                         // 138
			active: true,                                                                                                // 139
			globalRoles: ['user'],                                                                                       // 140
			services: {                                                                                                  // 141
				cas: {                                                                                                      // 142
					external_id: result.id                                                                                     // 143
				}                                                                                                           //
			}                                                                                                            //
		};                                                                                                            //
                                                                                                                //
		// Create the user                                                                                            //
		logger.debug('User \'' + result.id + '\'does not exist yet, creating it');                                    // 149
		var userId = Accounts.insertUserDoc({}, newUser);                                                             // 150
                                                                                                                //
		// Fetch and use it                                                                                           //
		user = Meteor.users.findOne(userId);                                                                          // 153
		logger.debug('Created new user for \'' + result.id + '\' with id: ' + user._id);                              // 154
                                                                                                                //
		logger.debug('Joining user to default channels');                                                             // 156
		Meteor.runAsUser(user._id, function () {                                                                      // 157
			Meteor.call('joinDefaultChannels');                                                                          // 158
		});                                                                                                           //
	}                                                                                                              //
                                                                                                                //
	return { userId: user._id };                                                                                   // 163
});                                                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:cas'] = {};

})();

//# sourceMappingURL=rocketchat_cas.js.map
