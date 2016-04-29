(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Autoupdate = Package.autoupdate.Autoupdate;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var WebApp;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/livechat.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals WebApp:true */                                                                                             //
                                                                                                                      //
WebApp = Package.webapp.WebApp;                                                                                       // 3
var Autoupdate = Package.autoupdate.Autoupdate;                                                                       // 4
                                                                                                                      //
WebApp.connectHandlers.use('/livechat/', function (req, res /*, next*/) {                                             // 6
	res.setHeader('content-type', 'text/html; charset=utf-8');                                                           // 7
                                                                                                                      //
	var head = Assets.getText('public/head.html');                                                                       // 9
                                                                                                                      //
	var html = '<html>\n\t\t<head>\n\t\t\t<link rel="stylesheet" type="text/css" class="__meteor-css__" href="/packages/rocketchat_livechat/public/livechat.css?_dc=' + Autoupdate.autoupdateVersion + '">\n\t\t\t<script type="text/javascript">\n\t\t\t\t__meteor_runtime_config__ = ' + JSON.stringify(__meteor_runtime_config__) + ';\n\t\t\t</script>\n\t\t\t<script type="text/javascript" src="/packages/rocketchat_livechat/public/livechat.js?_dc=' + Autoupdate.autoupdateVersion + '"></script>\n\n\t\t\t' + head + '\n\t\t</head>\n\t\t<body>\n\t\t</body>\n\t</html>';
                                                                                                                      //
	res.write(html);                                                                                                     // 25
	res.end();                                                                                                           // 26
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/startup.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.startup(function () {                                                                                          // 1
	RocketChat.roomTypes.setPublish('l', function (identifier) {                                                         // 2
		return RocketChat.models.Rooms.findByTypeAndName('l', identifier, {                                                 // 3
			fields: {                                                                                                          // 4
				name: 1,                                                                                                          // 5
				t: 1,                                                                                                             // 6
				cl: 1,                                                                                                            // 7
				u: 1,                                                                                                             // 8
				usernames: 1,                                                                                                     // 9
				v: 1,                                                                                                             // 10
				livechatData: 1                                                                                                   // 11
			}                                                                                                                  //
		});                                                                                                                 //
	});                                                                                                                  //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/permissions.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.startup(function () {                                                                                          // 1
	var roles = _.pluck(RocketChat.models.Roles.find().fetch(), 'name');                                                 // 2
	if (roles.indexOf('livechat-agent') === -1) {                                                                        // 3
		RocketChat.models.Roles.createOrUpdate('livechat-agent');                                                           // 4
	}                                                                                                                    //
	if (roles.indexOf('livechat-manager') === -1) {                                                                      // 6
		RocketChat.models.Roles.createOrUpdate('livechat-manager');                                                         // 7
	}                                                                                                                    //
	if (roles.indexOf('livechat-guest') === -1) {                                                                        // 9
		RocketChat.models.Roles.createOrUpdate('livechat-guest');                                                           // 10
	}                                                                                                                    //
	if (RocketChat.models && RocketChat.models.Permissions) {                                                            // 12
		RocketChat.models.Permissions.createOrUpdate('view-l-room', ['livechat-agent', 'livechat-manager', 'admin']);       // 13
		RocketChat.models.Permissions.createOrUpdate('view-livechat-manager', ['livechat-manager', 'admin']);               // 14
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/config.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.startup(function () {                                                                                          // 1
	RocketChat.settings.addGroup('Livechat');                                                                            // 2
	RocketChat.settings.add('Livechat_title', 'Rocket.Chat', { type: 'string', group: 'Livechat', 'public': true });     // 3
	RocketChat.settings.add('Livechat_title_color', '#C1272D', { type: 'string', group: 'Livechat', 'public': true });   // 4
	RocketChat.settings.add('Livechat_enabled', false, { type: 'boolean', group: 'Livechat', 'public': true });          // 5
	RocketChat.settings.add('Livechat_registration_form', true, { type: 'boolean', group: 'Livechat', 'public': true, i18nLabel: 'Show_preregistration_form' });
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/client/stylesheets/load.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.theme.addPackageAsset(function () {                                                                        // 1
	return Assets.getText('client/stylesheets/livechat.less');                                                           // 2
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/addAgent.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:addAgent': function (username) {                                                                           // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
			throw new Meteor.Error('not-authorized');                                                                          // 4
		}                                                                                                                   //
                                                                                                                      //
		if (!username || !_.isString(username)) {                                                                           // 7
			throw new Meteor.Error('invalid-arguments');                                                                       // 8
		}                                                                                                                   //
                                                                                                                      //
		var user = RocketChat.models.Users.findOneByUsername(username, { fields: { _id: 1 } });                             // 11
                                                                                                                      //
		if (!user) {                                                                                                        // 13
			throw new Meteor.Error('user-not-found', 'Username_not_found');                                                    // 14
		}                                                                                                                   //
                                                                                                                      //
		if (RocketChat.authz.addUserRoles(user._id, 'livechat-agent')) {                                                    // 17
			RocketChat.models.Users.setOperator(user._id, true);                                                               // 18
			RocketChat.models.Users.setLivechatStatus(user._id, 'available');                                                  // 19
			return true;                                                                                                       // 20
		}                                                                                                                   //
                                                                                                                      //
		return false;                                                                                                       // 23
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/addManager.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:addManager': function (username) {                                                                         // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
			throw new Meteor.Error('not-authorized');                                                                          // 4
		}                                                                                                                   //
                                                                                                                      //
		if (!username || !_.isString(username)) {                                                                           // 7
			throw new Meteor.Error('invalid-arguments');                                                                       // 8
		}                                                                                                                   //
                                                                                                                      //
		var user = RocketChat.models.Users.findOneByUsername(username, { fields: { _id: 1 } });                             // 11
                                                                                                                      //
		if (!user) {                                                                                                        // 13
			throw new Meteor.Error('user-not-found', 'Username_not_found');                                                    // 14
		}                                                                                                                   //
                                                                                                                      //
		return RocketChat.authz.addUserRoles(user._id, 'livechat-manager');                                                 // 17
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/changeLivechatStatus.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:changeLivechatStatus': function () {                                                                       // 2
		if (!Meteor.userId()) {                                                                                             // 3
			throw new Meteor.Error('error-not-authorized', 'Not authorized');                                                  // 4
		}                                                                                                                   //
                                                                                                                      //
		var user = Meteor.user();                                                                                           // 7
                                                                                                                      //
		var newStatus = user.statusLivechat === 'available' ? 'not-available' : 'available';                                // 9
                                                                                                                      //
		return RocketChat.models.Users.setLivechatStatus(user._id, newStatus);                                              // 11
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/getCustomFields.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:getCustomFields': function () {                                                                            // 2
		return RocketChat.models.LivechatCustomField.find().fetch();                                                        // 3
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/pageVisited.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:pageVisited': function (token, pageInfo) {                                                                 // 2
		return RocketChat.models.LivechatPageVisited.saveByToken(token, pageInfo);                                          // 3
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/registerGuest.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:registerGuest': function () {                                                                              // 2
		var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];                                 //
                                                                                                                      //
		var token = _ref.token;                                                                                             //
		var name = _ref.name;                                                                                               //
		var email = _ref.email;                                                                                             //
		var department = _ref.department;                                                                                   //
                                                                                                                      //
		var qt,                                                                                                             // 3
		    user,                                                                                                           //
		    userData,                                                                                                       //
		    userExists,                                                                                                     //
		    userId,                                                                                                         //
		    inc = 0;                                                                                                        //
                                                                                                                      //
		check(token, String);                                                                                               // 5
                                                                                                                      //
		user = Meteor.users.findOne({                                                                                       // 7
			'profile.token': token                                                                                             // 8
		}, {                                                                                                                //
			fields: {                                                                                                          // 10
				_id: 1                                                                                                            // 11
			}                                                                                                                  //
		});                                                                                                                 //
                                                                                                                      //
		if (user != null) {                                                                                                 // 15
			throw new Meteor.Error('token-already-exists', 'Token already exists');                                            // 16
		}                                                                                                                   //
                                                                                                                      //
		while (true) {                                                                                                      // 19
			qt = Meteor.users.find({                                                                                           // 20
				'profile.guest': true                                                                                             // 21
			}).count() + 1;                                                                                                    //
                                                                                                                      //
			user = 'guest-' + (qt + inc++);                                                                                    // 24
                                                                                                                      //
			userExists = Meteor.users.findOne({                                                                                // 26
				'username': user                                                                                                  // 27
			}, {                                                                                                               //
				fields: {                                                                                                         // 29
					_id: 1                                                                                                           // 30
				}                                                                                                                 //
			});                                                                                                                //
                                                                                                                      //
			if (!userExists) {                                                                                                 // 34
				break;                                                                                                            // 35
			}                                                                                                                  //
		}                                                                                                                   //
		userData = {                                                                                                        // 38
			username: user,                                                                                                    // 39
			globalRoles: ['livechat-guest'],                                                                                   // 40
			department: department,                                                                                            // 41
			type: 'visitor'                                                                                                    // 42
		};                                                                                                                  //
                                                                                                                      //
		userData.userAgent = this.connection.httpHeaders['user-agent'];                                                     // 45
		userData.ip = this.connection.httpHeaders['x-real-ip'] || this.connection.clientAddress;                            // 46
		userData.host = this.connection.httpHeaders.host;                                                                   // 47
                                                                                                                      //
		userId = Accounts.insertUserDoc({}, userData);                                                                      // 49
                                                                                                                      //
		var updateUser = {                                                                                                  // 51
			name: name || user,                                                                                                // 52
			'profile.guest': true,                                                                                             // 53
			'profile.token': token                                                                                             // 54
		};                                                                                                                  //
                                                                                                                      //
		if (email && email.trim() !== '') {                                                                                 // 57
			updateUser.emails = [{ address: email }];                                                                          // 58
		}                                                                                                                   //
                                                                                                                      //
		var stampedToken = Accounts._generateStampedLoginToken();                                                           // 61
		var hashStampedToken = Accounts._hashStampedToken(stampedToken);                                                    // 62
                                                                                                                      //
		updateUser.services = {                                                                                             // 64
			resume: {                                                                                                          // 65
				loginTokens: [hashStampedToken]                                                                                   // 66
			}                                                                                                                  //
		};                                                                                                                  //
                                                                                                                      //
		Meteor.users.update(userId, {                                                                                       // 70
			$set: updateUser                                                                                                   // 71
		});                                                                                                                 //
                                                                                                                      //
		// update visited page history to not expire                                                                        //
		RocketChat.models.LivechatPageVisited.keepHistoryForToken(token);                                                   // 75
                                                                                                                      //
		return {                                                                                                            // 77
			userId: userId,                                                                                                    // 78
			token: stampedToken.token                                                                                          // 79
		};                                                                                                                  //
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/removeAgent.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:removeAgent': function (username) {                                                                        // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
			throw new Meteor.Error('not-authorized');                                                                          // 4
		}                                                                                                                   //
                                                                                                                      //
		if (!username || !_.isString(username)) {                                                                           // 7
			throw new Meteor.Error('invalid-arguments');                                                                       // 8
		}                                                                                                                   //
                                                                                                                      //
		var user = RocketChat.models.Users.findOneByUsername(username, { fields: { _id: 1 } });                             // 11
                                                                                                                      //
		if (!user) {                                                                                                        // 13
			throw new Meteor.Error('user-not-found', 'Username_not_found');                                                    // 14
		}                                                                                                                   //
                                                                                                                      //
		if (RocketChat.authz.removeUserFromRoles(user._id, 'livechat-agent')) {                                             // 17
			RocketChat.models.Users.setOperator(user._id, false);                                                              // 18
			RocketChat.models.Users.setLivechatStatus(user._id, 'not-available');                                              // 19
			return true;                                                                                                       // 20
		}                                                                                                                   //
                                                                                                                      //
		return false;                                                                                                       // 23
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/removeCustomField.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:removeCustomField': function (_id) {                                                                       // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
			throw new Meteor.Error('not-authorized');                                                                          // 4
		}                                                                                                                   //
                                                                                                                      //
		check(_id, String);                                                                                                 // 7
                                                                                                                      //
		var customField = RocketChat.models.LivechatCustomField.findOneById(_id, { fields: { _id: 1 } });                   // 9
                                                                                                                      //
		if (!customField) {                                                                                                 // 11
			throw new Meteor.Error('error-invalid-custom-field', 'Custom field not found', { method: 'livechat:removeCustomField' });
		}                                                                                                                   //
                                                                                                                      //
		return RocketChat.models.LivechatCustomField.removeById(_id);                                                       // 15
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/removeDepartment.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:removeDepartment': function (_id) {                                                                        // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
			throw new Meteor.Error('not-authorized');                                                                          // 4
		}                                                                                                                   //
                                                                                                                      //
		check(_id, String);                                                                                                 // 7
                                                                                                                      //
		var department = RocketChat.models.LivechatDepartment.findOneById(_id, { fields: { _id: 1 } });                     // 9
                                                                                                                      //
		if (!department) {                                                                                                  // 11
			throw new Meteor.Error('department-not-found', 'Department_not_found');                                            // 12
		}                                                                                                                   //
                                                                                                                      //
		return RocketChat.models.LivechatDepartment.removeById(_id);                                                        // 15
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/removeManager.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:removeManager': function (username) {                                                                      // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
			throw new Meteor.Error('not-authorized');                                                                          // 4
		}                                                                                                                   //
                                                                                                                      //
		check(username, String);                                                                                            // 7
                                                                                                                      //
		var user = RocketChat.models.Users.findOneByUsername(username, { fields: { _id: 1 } });                             // 9
                                                                                                                      //
		if (!user) {                                                                                                        // 11
			throw new Meteor.Error('user-not-found', 'Username_not_found');                                                    // 12
		}                                                                                                                   //
                                                                                                                      //
		return RocketChat.authz.removeUserFromRoles(user._id, 'livechat-manager');                                          // 15
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/removeTrigger.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:removeTrigger': function () /*trigger*/{                                                                   // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
			throw new Meteor.Error('not-authorized');                                                                          // 4
		}                                                                                                                   //
                                                                                                                      //
		return RocketChat.models.LivechatTrigger.removeAll();                                                               // 7
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/saveCustomField.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* eslint new-cap: [2, {"capIsNewExceptions": ["Match.ObjectIncluding", "Match.Optional"]}] */                        //
                                                                                                                      //
Meteor.methods({                                                                                                      // 3
	'livechat:saveCustomField': function (_id, customFieldData) {                                                        // 4
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 5
			throw new Meteor.Error('not-authorized');                                                                          // 6
		}                                                                                                                   //
                                                                                                                      //
		if (_id) {                                                                                                          // 9
			check(_id, String);                                                                                                // 10
		}                                                                                                                   //
                                                                                                                      //
		check(customFieldData, Match.ObjectIncluding({ field: String, label: String, scope: String, visibility: String }));
                                                                                                                      //
		if (!/^[0-9a-zA-Z-_]+$/.test(customFieldData.field)) {                                                              // 15
			throw new Meteor.Error('error-invalid-custom-field-nmae', 'Invalid custom field name. Use only letters, numbers, hyphens and underscores.', { method: 'livechat:saveCustomField' });
		}                                                                                                                   //
                                                                                                                      //
		if (_id) {                                                                                                          // 19
			var customField = RocketChat.models.LivechatCustomField.findOneById(_id);                                          // 20
			if (!customField) {                                                                                                // 21
				throw new Meteor.Error('error-invalid-custom-field', 'Custom Field Not found', { method: 'livechat:saveCustomField' });
			}                                                                                                                  //
		}                                                                                                                   //
                                                                                                                      //
		return RocketChat.models.LivechatCustomField.createOrUpdateCustomField(_id, customFieldData.field, customFieldData.label, customFieldData.scope, customFieldData.visibility);
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/saveDepartment.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* eslint new-cap: [2, {"capIsNewExceptions": ["Match.ObjectIncluding", "Match.Optional"]}] */                        //
                                                                                                                      //
Meteor.methods({                                                                                                      // 3
	'livechat:saveDepartment': function (_id, departmentData, departmentAgents) {                                        // 4
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 5
			throw new Meteor.Error('not-authorized');                                                                          // 6
		}                                                                                                                   //
                                                                                                                      //
		if (_id) {                                                                                                          // 9
			check(_id, String);                                                                                                // 10
		}                                                                                                                   //
                                                                                                                      //
		check(departmentData, Match.ObjectIncluding({ enabled: Boolean, name: String, description: Match.Optional(String), agents: Match.Optional([Match.ObjectIncluding({ _id: String, username: String })]) }));
                                                                                                                      //
		if (_id) {                                                                                                          // 15
			var department = RocketChat.models.LivechatDepartment.findOneById(_id);                                            // 16
			if (!department) {                                                                                                 // 17
				throw new Meteor.Error('department-not-found', 'Department_not_found');                                           // 18
			}                                                                                                                  //
		}                                                                                                                   //
                                                                                                                      //
		return RocketChat.models.LivechatDepartment.createOrUpdateDepartment(_id, departmentData.enabled, departmentData.name, departmentData.description, departmentAgents);
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/saveSurveyFeedback.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* eslint new-cap: [2, {"capIsNewExceptions": ["Match.ObjectIncluding"]}] */                                          //
                                                                                                                      //
Meteor.methods({                                                                                                      // 3
	'livechat:saveSurveyFeedback': function (visitorToken, visitorRoom, formData) {                                      // 4
		check(visitorToken, String);                                                                                        // 5
		check(visitorRoom, String);                                                                                         // 6
		check(formData, [Match.ObjectIncluding({ name: String, value: String })]);                                          // 7
                                                                                                                      //
		var visitor = RocketChat.models.Users.getVisitorByToken(visitorToken);                                              // 9
		var room = RocketChat.models.Rooms.findOneById(visitorRoom);                                                        // 10
                                                                                                                      //
		if (visitor !== undefined && room !== undefined && room.v !== undefined && visitor.profile !== undefined && room.v.token === visitor.profile.token) {
			var updateData = {};                                                                                               // 13
			for (var _iterator = formData, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;                                                                                                         //
                                                                                                                      //
				if (_isArray) {                                                                                                   //
					if (_i >= _iterator.length) break;                                                                               //
					_ref = _iterator[_i++];                                                                                          //
				} else {                                                                                                          //
					_i = _iterator.next();                                                                                           //
					if (_i.done) break;                                                                                              //
					_ref = _i.value;                                                                                                 //
				}                                                                                                                 //
                                                                                                                      //
				var item = _ref;                                                                                                  //
                                                                                                                      //
				if (_.contains(['satisfaction', 'agentKnowledge', 'agentResposiveness', 'agentFriendliness'], item.name) && _.contains(['1', '2', '3', '4', '5'], item.value)) {
					updateData[item.name] = item.value;                                                                              // 16
				} else if (item.name === 'additionalFeedback') {                                                                  //
					updateData[item.name] = item.value;                                                                              // 18
				}                                                                                                                 //
			}                                                                                                                  //
			if (!_.isEmpty(updateData)) {                                                                                      // 21
				return RocketChat.models.Rooms.updateSurveyFeedbackById(room._id, updateData);                                    // 22
			}                                                                                                                  //
		}                                                                                                                   //
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/saveTrigger.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:saveTrigger': function (trigger) {                                                                         // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
			throw new Meteor.Error('not-authorized');                                                                          // 4
		}                                                                                                                   //
                                                                                                                      //
		return RocketChat.models.LivechatTrigger.save(trigger);                                                             // 7
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/searchAgent.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:searchAgent': function (username) {                                                                        // 2
		if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
			throw new Meteor.Error('not-authorized');                                                                          // 4
		}                                                                                                                   //
                                                                                                                      //
		if (!username || !_.isString(username)) {                                                                           // 7
			throw new Meteor.Error('invalid-arguments');                                                                       // 8
		}                                                                                                                   //
                                                                                                                      //
		var user = RocketChat.models.Users.findOneByUsername(username, { fields: { _id: 1, username: 1 } });                // 11
                                                                                                                      //
		if (!user) {                                                                                                        // 13
			throw new Meteor.Error('user-not-found', 'Username_not_found');                                                    // 14
		}                                                                                                                   //
                                                                                                                      //
		return user;                                                                                                        // 17
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/sendMessageLivechat.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	sendMessageLivechat: function (message) {                                                                            // 2
		var guest, agent, room;                                                                                             // 3
                                                                                                                      //
		check(message.rid, String);                                                                                         // 5
		check(message.token, String);                                                                                       // 6
                                                                                                                      //
		guest = Meteor.users.findOne(Meteor.userId(), {                                                                     // 8
			fields: {                                                                                                          // 9
				username: 1,                                                                                                      // 10
				department: 1                                                                                                     // 11
			}                                                                                                                  //
		});                                                                                                                 //
                                                                                                                      //
		room = RocketChat.models.Rooms.findOneById(message.rid);                                                            // 15
		if (room == null) {                                                                                                 // 16
                                                                                                                      //
			// if no department selected verify if there is only one active and use it                                         //
			if (!guest.department) {                                                                                           // 19
				var departments = RocketChat.models.LivechatDepartment.findEnabledWithAgents();                                   // 20
				if (departments.count() === 1) {                                                                                  // 21
					guest.department = departments.fetch()[0]._id;                                                                   // 22
				}                                                                                                                 //
			}                                                                                                                  //
                                                                                                                      //
			agent = getNextAgent(guest.department);                                                                            // 26
			if (!agent) {                                                                                                      // 27
				throw new Meteor.Error('no-agent-online', 'Sorry, no online agents');                                             // 28
			}                                                                                                                  //
			RocketChat.models.Rooms.insert({                                                                                   // 30
				_id: message.rid,                                                                                                 // 31
				name: guest.username,                                                                                             // 32
				msgs: 1,                                                                                                          // 33
				lm: new Date(),                                                                                                   // 34
				usernames: [agent.username, guest.username],                                                                      // 35
				t: 'l',                                                                                                           // 36
				ts: new Date(),                                                                                                   // 37
				v: {                                                                                                              // 38
					token: message.token                                                                                             // 39
				}                                                                                                                 //
			});                                                                                                                //
			RocketChat.models.Subscriptions.insert({                                                                           // 42
				rid: message.rid,                                                                                                 // 43
				name: guest.username,                                                                                             // 44
				alert: true,                                                                                                      // 45
				open: true,                                                                                                       // 46
				unread: 1,                                                                                                        // 47
				answered: false,                                                                                                  // 48
				u: {                                                                                                              // 49
					_id: agent.agentId,                                                                                              // 50
					username: agent.username                                                                                         // 51
				},                                                                                                                //
				t: 'l',                                                                                                           // 53
				desktopNotifications: 'all',                                                                                      // 54
				mobilePushNotifications: 'all',                                                                                   // 55
				emailNotifications: 'all'                                                                                         // 56
			});                                                                                                                //
		}                                                                                                                   //
		room = Meteor.call('canAccessRoom', message.rid, guest._id);                                                        // 59
		if (!room) {                                                                                                        // 60
			throw new Meteor.Error('cannot-acess-room');                                                                       // 61
		}                                                                                                                   //
		return RocketChat.sendMessage(guest, message, room);                                                                // 63
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/methods/setCustomField.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	'livechat:setCustomField': function (token, key, value) {                                                            // 2
		var customField = RocketChat.models.LivechatCustomField.findOneById(key);                                           // 3
		if (customField) {                                                                                                  // 4
			if (customField.scope === 'room') {                                                                                // 5
				return RocketChat.models.Rooms.updateLivechatDataByToken(token, key, value);                                      // 6
			} else {                                                                                                           //
				// Save in user                                                                                                   //
				return RocketChat.models.Users.updateLivechatDataByToken(token, key, value);                                      // 9
			}                                                                                                                  //
		}                                                                                                                   //
                                                                                                                      //
		return true;                                                                                                        // 13
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/models/Users.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   //
 * Sets an user as (non)operator                                                                                      //
 * @param {string} _id - User's _id                                                                                   //
 * @param {boolean} operator - Flag to set as operator or not                                                         //
 */                                                                                                                   //
RocketChat.models.Users.setOperator = function (_id, operator) {                                                      // 6
	var update = {                                                                                                       // 7
		$set: {                                                                                                             // 8
			operator: operator                                                                                                 // 9
		}                                                                                                                   //
	};                                                                                                                   //
                                                                                                                      //
	return this.update(_id, update);                                                                                     // 13
};                                                                                                                    //
                                                                                                                      //
/**                                                                                                                   //
 * Gets all online agents                                                                                             //
 * @return                                                                                                            //
 */                                                                                                                   //
RocketChat.models.Users.findOnlineAgents = function () {                                                              // 20
	var query = {                                                                                                        // 21
		status: 'online',                                                                                                   // 22
		roles: 'livechat-agent'                                                                                             // 23
	};                                                                                                                   //
                                                                                                                      //
	return this.find(query);                                                                                             // 26
};                                                                                                                    //
                                                                                                                      //
/**                                                                                                                   //
 * Find online users from a list                                                                                      //
 * @param {array} userList - array of usernames                                                                       //
 * @return                                                                                                            //
 */                                                                                                                   //
RocketChat.models.Users.findOnlineUserFromList = function (userList) {                                                // 34
	var query = {                                                                                                        // 35
		statusConnection: { $ne: 'offline' },                                                                               // 36
		statusLivechat: 'available',                                                                                        // 37
		username: {                                                                                                         // 38
			$in: [].concat(userList)                                                                                           // 39
		}                                                                                                                   //
	};                                                                                                                   //
                                                                                                                      //
	return this.find(query);                                                                                             // 43
};                                                                                                                    //
                                                                                                                      //
/**                                                                                                                   //
 * Get next user agent in order                                                                                       //
 * @return {object} User from db                                                                                      //
 */                                                                                                                   //
RocketChat.models.Users.getNextAgent = function () {                                                                  // 50
	var query = {                                                                                                        // 51
		statusConnection: { $ne: 'offline' },                                                                               // 52
		statusLivechat: 'available',                                                                                        // 53
		roles: 'livechat-agent'                                                                                             // 54
	};                                                                                                                   //
                                                                                                                      //
	var collectionObj = this.model.rawCollection();                                                                      // 57
	var findAndModify = Meteor.wrapAsync(collectionObj.findAndModify, collectionObj);                                    // 58
                                                                                                                      //
	var sort = {                                                                                                         // 60
		livechatCount: 1,                                                                                                   // 61
		username: 1                                                                                                         // 62
	};                                                                                                                   //
                                                                                                                      //
	var update = {                                                                                                       // 65
		$inc: {                                                                                                             // 66
			livechatCount: 1                                                                                                   // 67
		}                                                                                                                   //
	};                                                                                                                   //
                                                                                                                      //
	var user = findAndModify(query, sort, update);                                                                       // 71
	if (user) {                                                                                                          // 72
		return {                                                                                                            // 73
			agentId: user._id,                                                                                                 // 74
			username: user.username                                                                                            // 75
		};                                                                                                                  //
	} else {                                                                                                             //
		return null;                                                                                                        // 78
	}                                                                                                                    //
};                                                                                                                    //
                                                                                                                      //
/**                                                                                                                   //
 * Gets visitor by token                                                                                              //
 * @param {string} token - Visitor token                                                                              //
 */                                                                                                                   //
RocketChat.models.Users.getVisitorByToken = function (token, options) {                                               // 86
	var query = {                                                                                                        // 87
		'profile.guest': true,                                                                                              // 88
		'profile.token': token                                                                                              // 89
	};                                                                                                                   //
                                                                                                                      //
	return this.findOne(query, options);                                                                                 // 92
};                                                                                                                    //
                                                                                                                      //
/**                                                                                                                   //
 * Gets visitor by token                                                                                              //
 * @param {string} token - Visitor token                                                                              //
 */                                                                                                                   //
RocketChat.models.Users.findVisitorByToken = function (token) {                                                       // 99
	var query = {                                                                                                        // 100
		'profile.guest': true,                                                                                              // 101
		'profile.token': token                                                                                              // 102
	};                                                                                                                   //
                                                                                                                      //
	return this.find(query);                                                                                             // 105
};                                                                                                                    //
                                                                                                                      //
/**                                                                                                                   //
 * Change user's livechat status                                                                                      //
 * @param {string} token - Visitor token                                                                              //
 */                                                                                                                   //
RocketChat.models.Users.setLivechatStatus = function (userId, status) {                                               // 112
	var query = {                                                                                                        // 113
		'_id': userId                                                                                                       // 114
	};                                                                                                                   //
                                                                                                                      //
	var update = {                                                                                                       // 117
		$set: {                                                                                                             // 118
			'statusLivechat': status                                                                                           // 119
		}                                                                                                                   //
	};                                                                                                                   //
                                                                                                                      //
	return this.update(query, update);                                                                                   // 123
};                                                                                                                    //
                                                                                                                      //
RocketChat.models.Users.updateLivechatDataByToken = function (token, key, value) {                                    // 126
	var _$set;                                                                                                           //
                                                                                                                      //
	var query = {                                                                                                        // 127
		'profile.token': token                                                                                              // 128
	};                                                                                                                   //
                                                                                                                      //
	var update = {                                                                                                       // 131
		$set: (_$set = {}, _$set['livechatData.' + key] = value, _$set)                                                     // 132
	};                                                                                                                   //
                                                                                                                      //
	return this.upsert(query, update);                                                                                   // 137
};                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/models/Rooms.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   //
 * Gets visitor by token                                                                                              //
 * @param {string} token - Visitor token                                                                              //
 */                                                                                                                   //
RocketChat.models.Rooms.updateSurveyFeedbackById = function (_id, surveyFeedback) {                                   // 5
	var query = {                                                                                                        // 6
		_id: _id                                                                                                            // 7
	};                                                                                                                   //
                                                                                                                      //
	var update = {                                                                                                       // 10
		$set: {                                                                                                             // 11
			surveyFeedback: surveyFeedback                                                                                     // 12
		}                                                                                                                   //
	};                                                                                                                   //
                                                                                                                      //
	return this.update(query, update);                                                                                   // 16
};                                                                                                                    //
                                                                                                                      //
RocketChat.models.Rooms.updateLivechatDataByToken = function (token, key, value) {                                    // 19
	var _$set;                                                                                                           //
                                                                                                                      //
	var query = {                                                                                                        // 20
		'v.token': token                                                                                                    // 21
	};                                                                                                                   //
                                                                                                                      //
	var update = {                                                                                                       // 24
		$set: (_$set = {}, _$set['livechatData.' + key] = value, _$set)                                                     // 25
	};                                                                                                                   //
                                                                                                                      //
	return this.upsert(query, update);                                                                                   // 30
};                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/models/LivechatCustomField.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   //
 * Livechat Custom Fields model                                                                                       //
 */                                                                                                                   //
                                                                                                                      //
var LivechatCustomField = (function (_RocketChat$models$_Base) {                                                      //
	babelHelpers.inherits(LivechatCustomField, _RocketChat$models$_Base);                                                //
                                                                                                                      //
	function LivechatCustomField() {                                                                                     // 5
		babelHelpers.classCallCheck(this, LivechatCustomField);                                                             //
                                                                                                                      //
		_RocketChat$models$_Base.call(this);                                                                                // 6
		this._initModel('livechat_custom_field');                                                                           // 7
	}                                                                                                                    //
                                                                                                                      //
	// FIND                                                                                                              //
                                                                                                                      //
	LivechatCustomField.prototype.findOneById = (function () {                                                           // 4
		function findOneById(_id, options) {                                                                                // 11
			var query = { _id: _id };                                                                                          // 12
                                                                                                                      //
			return this.findOne(query, options);                                                                               // 14
		}                                                                                                                   //
                                                                                                                      //
		return findOneById;                                                                                                 //
	})();                                                                                                                //
                                                                                                                      //
	LivechatCustomField.prototype.createOrUpdateCustomField = (function () {                                             // 4
		function createOrUpdateCustomField(_id, field, label, scope, visibility, extraData) {                               // 17
			var record = {                                                                                                     // 18
				label: label,                                                                                                     // 19
				scope: scope,                                                                                                     // 20
				visibility: visibility                                                                                            // 21
			};                                                                                                                 //
                                                                                                                      //
			_.extend(record, extraData);                                                                                       // 24
                                                                                                                      //
			if (_id) {                                                                                                         // 26
				this.update({ _id: _id }, { $set: record });                                                                      // 27
			} else {                                                                                                           //
				record._id = field;                                                                                               // 29
				_id = this.insert(record);                                                                                        // 30
			}                                                                                                                  //
                                                                                                                      //
			return record;                                                                                                     // 33
		}                                                                                                                   //
                                                                                                                      //
		return createOrUpdateCustomField;                                                                                   //
	})();                                                                                                                //
                                                                                                                      //
	// REMOVE                                                                                                            //
                                                                                                                      //
	LivechatCustomField.prototype.removeById = (function () {                                                            // 4
		function removeById(_id) {                                                                                          // 37
			var query = { _id: _id };                                                                                          // 38
                                                                                                                      //
			return this.remove(query);                                                                                         // 40
		}                                                                                                                   //
                                                                                                                      //
		return removeById;                                                                                                  //
	})();                                                                                                                //
                                                                                                                      //
	return LivechatCustomField;                                                                                          //
})(RocketChat.models._Base);                                                                                          //
                                                                                                                      //
RocketChat.models.LivechatCustomField = new LivechatCustomField();                                                    // 44
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/models/LivechatDepartment.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   //
 * Livechat Department model                                                                                          //
 */                                                                                                                   //
                                                                                                                      //
var LivechatDepartment = (function (_RocketChat$models$_Base) {                                                       //
	babelHelpers.inherits(LivechatDepartment, _RocketChat$models$_Base);                                                 //
                                                                                                                      //
	function LivechatDepartment() {                                                                                      // 5
		babelHelpers.classCallCheck(this, LivechatDepartment);                                                              //
                                                                                                                      //
		_RocketChat$models$_Base.call(this);                                                                                // 6
		this._initModel('livechat_department');                                                                             // 7
	}                                                                                                                    //
                                                                                                                      //
	// FIND                                                                                                              //
                                                                                                                      //
	LivechatDepartment.prototype.findOneById = (function () {                                                            // 4
		function findOneById(_id, options) {                                                                                // 11
			var query = { _id: _id };                                                                                          // 12
                                                                                                                      //
			return this.findOne(query, options);                                                                               // 14
		}                                                                                                                   //
                                                                                                                      //
		return findOneById;                                                                                                 //
	})();                                                                                                                //
                                                                                                                      //
	LivechatDepartment.prototype.findByDepartmentId = (function () {                                                     // 4
		function findByDepartmentId(_id, options) {                                                                         // 17
			var query = { _id: _id };                                                                                          // 18
                                                                                                                      //
			return this.find(query, options);                                                                                  // 20
		}                                                                                                                   //
                                                                                                                      //
		return findByDepartmentId;                                                                                          //
	})();                                                                                                                //
                                                                                                                      //
	LivechatDepartment.prototype.createOrUpdateDepartment = (function () {                                               // 4
		function createOrUpdateDepartment(_id, enabled, name, description, agents, extraData) {                             // 23
			agents = [].concat(agents);                                                                                        // 24
                                                                                                                      //
			var record = {                                                                                                     // 26
				enabled: enabled,                                                                                                 // 27
				name: name,                                                                                                       // 28
				description: description,                                                                                         // 29
				numAgents: agents.length                                                                                          // 30
			};                                                                                                                 //
                                                                                                                      //
			_.extend(record, extraData);                                                                                       // 33
                                                                                                                      //
			if (_id) {                                                                                                         // 35
				this.update({ _id: _id }, { $set: record });                                                                      // 36
			} else {                                                                                                           //
				_id = this.insert(record);                                                                                        // 38
			}                                                                                                                  //
                                                                                                                      //
			var savedAgents = _.pluck(RocketChat.models.LivechatDepartmentAgents.findByDepartmentId(_id).fetch(), 'agentId');  // 41
			var agentsToSave = _.pluck(agents, 'agentId');                                                                     // 42
                                                                                                                      //
			// remove other agents                                                                                             //
			_.difference(savedAgents, agentsToSave).forEach(function (agentId) {                                               // 45
				RocketChat.models.LivechatDepartmentAgents.removeByDepartmentIdAndAgentId(_id, agentId);                          // 46
			});                                                                                                                //
                                                                                                                      //
			agents.forEach(function (agent) {                                                                                  // 49
				RocketChat.models.LivechatDepartmentAgents.saveAgent({                                                            // 50
					agentId: agent.agentId,                                                                                          // 51
					departmentId: _id,                                                                                               // 52
					username: agent.username,                                                                                        // 53
					count: parseInt(agent.count),                                                                                    // 54
					order: parseInt(agent.order)                                                                                     // 55
				});                                                                                                               //
			});                                                                                                                //
                                                                                                                      //
			return _.extend(record, { _id: _id });                                                                             // 59
		}                                                                                                                   //
                                                                                                                      //
		return createOrUpdateDepartment;                                                                                    //
	})();                                                                                                                //
                                                                                                                      //
	// REMOVE                                                                                                            //
                                                                                                                      //
	LivechatDepartment.prototype.removeById = (function () {                                                             // 4
		function removeById(_id) {                                                                                          // 63
			var query = { _id: _id };                                                                                          // 64
                                                                                                                      //
			return this.remove(query);                                                                                         // 66
		}                                                                                                                   //
                                                                                                                      //
		return removeById;                                                                                                  //
	})();                                                                                                                //
                                                                                                                      //
	LivechatDepartment.prototype.findEnabledWithAgents = (function () {                                                  // 4
		function findEnabledWithAgents() {                                                                                  // 69
			var query = {                                                                                                      // 70
				numAgents: { $gt: 0 },                                                                                            // 71
				enabled: true                                                                                                     // 72
			};                                                                                                                 //
			return this.find(query);                                                                                           // 74
		}                                                                                                                   //
                                                                                                                      //
		return findEnabledWithAgents;                                                                                       //
	})();                                                                                                                //
                                                                                                                      //
	return LivechatDepartment;                                                                                           //
})(RocketChat.models._Base);                                                                                          //
                                                                                                                      //
RocketChat.models.LivechatDepartment = new LivechatDepartment();                                                      // 78
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/models/LivechatDepartmentAgents.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   //
 * Livechat Department model                                                                                          //
 */                                                                                                                   //
                                                                                                                      //
var LivechatDepartmentAgents = (function (_RocketChat$models$_Base) {                                                 //
	babelHelpers.inherits(LivechatDepartmentAgents, _RocketChat$models$_Base);                                           //
                                                                                                                      //
	function LivechatDepartmentAgents() {                                                                                // 5
		babelHelpers.classCallCheck(this, LivechatDepartmentAgents);                                                        //
                                                                                                                      //
		_RocketChat$models$_Base.call(this);                                                                                // 6
		this._initModel('livechat_department_agents');                                                                      // 7
	}                                                                                                                    //
                                                                                                                      //
	LivechatDepartmentAgents.prototype.findByDepartmentId = (function () {                                               // 4
		function findByDepartmentId(departmentId) {                                                                         // 10
			return this.find({ departmentId: departmentId });                                                                  // 11
		}                                                                                                                   //
                                                                                                                      //
		return findByDepartmentId;                                                                                          //
	})();                                                                                                                //
                                                                                                                      //
	LivechatDepartmentAgents.prototype.saveAgent = (function () {                                                        // 4
		function saveAgent(agent) {                                                                                         // 14
			return this.upsert({                                                                                               // 15
				agentId: agent.agentId,                                                                                           // 16
				departmentId: agent.departmentId                                                                                  // 17
			}, {                                                                                                               //
				$set: {                                                                                                           // 19
					username: agent.username,                                                                                        // 20
					count: parseInt(agent.count),                                                                                    // 21
					order: parseInt(agent.order)                                                                                     // 22
				}                                                                                                                 //
			});                                                                                                                //
		}                                                                                                                   //
                                                                                                                      //
		return saveAgent;                                                                                                   //
	})();                                                                                                                //
                                                                                                                      //
	LivechatDepartmentAgents.prototype.removeByDepartmentIdAndAgentId = (function () {                                   // 4
		function removeByDepartmentIdAndAgentId(departmentId, agentId) {                                                    // 27
			this.remove({ departmentId: departmentId, agentId: agentId });                                                     // 28
		}                                                                                                                   //
                                                                                                                      //
		return removeByDepartmentIdAndAgentId;                                                                              //
	})();                                                                                                                //
                                                                                                                      //
	LivechatDepartmentAgents.prototype.getNextAgentForDepartment = (function () {                                        // 4
		function getNextAgentForDepartment(departmentId) {                                                                  // 31
			var agents = this.findByDepartmentId(departmentId).fetch();                                                        // 32
                                                                                                                      //
			if (agents.length === 0) {                                                                                         // 34
				return;                                                                                                           // 35
			}                                                                                                                  //
                                                                                                                      //
			var onlineUsers = RocketChat.models.Users.findOnlineUserFromList(_.pluck(agents, 'username'));                     // 38
                                                                                                                      //
			var onlineUsernames = _.pluck(onlineUsers.fetch(), 'username');                                                    // 40
                                                                                                                      //
			var query = {                                                                                                      // 42
				departmentId: departmentId,                                                                                       // 43
				username: {                                                                                                       // 44
					$in: onlineUsernames                                                                                             // 45
				}                                                                                                                 //
			};                                                                                                                 //
                                                                                                                      //
			var sort = {                                                                                                       // 49
				count: 1,                                                                                                         // 50
				sort: 1,                                                                                                          // 51
				username: 1                                                                                                       // 52
			};                                                                                                                 //
			var update = {                                                                                                     // 54
				$inc: {                                                                                                           // 55
					count: 1                                                                                                         // 56
				}                                                                                                                 //
			};                                                                                                                 //
                                                                                                                      //
			var collectionObj = this.model.rawCollection();                                                                    // 60
			var findAndModify = Meteor.wrapAsync(collectionObj.findAndModify, collectionObj);                                  // 61
                                                                                                                      //
			var agent = findAndModify(query, sort, update);                                                                    // 63
			if (agent) {                                                                                                       // 64
				return {                                                                                                          // 65
					agentId: agent.agentId,                                                                                          // 66
					username: agent.username                                                                                         // 67
				};                                                                                                                //
			} else {                                                                                                           //
				return null;                                                                                                      // 70
			}                                                                                                                  //
		}                                                                                                                   //
                                                                                                                      //
		return getNextAgentForDepartment;                                                                                   //
	})();                                                                                                                //
                                                                                                                      //
	return LivechatDepartmentAgents;                                                                                     //
})(RocketChat.models._Base);                                                                                          //
                                                                                                                      //
RocketChat.models.LivechatDepartmentAgents = new LivechatDepartmentAgents();                                          // 75
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/models/LivechatPageVisited.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   //
 * Livechat Page Visited model                                                                                        //
 */                                                                                                                   //
                                                                                                                      //
var LivechatPageVisited = (function (_RocketChat$models$_Base) {                                                      //
	babelHelpers.inherits(LivechatPageVisited, _RocketChat$models$_Base);                                                //
                                                                                                                      //
	function LivechatPageVisited() {                                                                                     // 5
		babelHelpers.classCallCheck(this, LivechatPageVisited);                                                             //
                                                                                                                      //
		_RocketChat$models$_Base.call(this);                                                                                // 6
		this._initModel('livechat_page_visited');                                                                           // 7
                                                                                                                      //
		this.tryEnsureIndex({ 'token': 1 });                                                                                // 9
		this.tryEnsureIndex({ 'ts': 1 });                                                                                   // 10
                                                                                                                      //
		// keep history for 1 month if the visitor does not register                                                        //
		this.tryEnsureIndex({ 'expireAt': 1 }, { sparse: 1, expireAfterSeconds: 0 });                                       // 13
	}                                                                                                                    //
                                                                                                                      //
	LivechatPageVisited.prototype.saveByToken = (function () {                                                           // 4
		function saveByToken(token, pageInfo) {                                                                             // 16
			// keep history of unregistered visitors for 1 month                                                               //
			var keepHistoryMiliseconds = 2592000000;                                                                           // 18
                                                                                                                      //
			return this.insert({                                                                                               // 20
				token: token,                                                                                                     // 21
				page: pageInfo,                                                                                                   // 22
				ts: new Date(),                                                                                                   // 23
				expireAt: new Date().getTime() + keepHistoryMiliseconds                                                           // 24
			});                                                                                                                //
		}                                                                                                                   //
                                                                                                                      //
		return saveByToken;                                                                                                 //
	})();                                                                                                                //
                                                                                                                      //
	LivechatPageVisited.prototype.findByToken = (function () {                                                           // 4
		function findByToken(token) {                                                                                       // 28
			return this.find({ token: token }, { sort: { ts: -1 }, limit: 20 });                                               // 29
		}                                                                                                                   //
                                                                                                                      //
		return findByToken;                                                                                                 //
	})();                                                                                                                //
                                                                                                                      //
	LivechatPageVisited.prototype.keepHistoryForToken = (function () {                                                   // 4
		function keepHistoryForToken(token) {                                                                               // 32
			return this.update({                                                                                               // 33
				token: token,                                                                                                     // 34
				expireAt: {                                                                                                       // 35
					$exists: true                                                                                                    // 36
				}                                                                                                                 //
			}, {                                                                                                               //
				$unset: {                                                                                                         // 39
					expireAt: 1                                                                                                      // 40
				}                                                                                                                 //
			}, {                                                                                                               //
				multi: true                                                                                                       // 43
			});                                                                                                                //
		}                                                                                                                   //
                                                                                                                      //
		return keepHistoryForToken;                                                                                         //
	})();                                                                                                                //
                                                                                                                      //
	return LivechatPageVisited;                                                                                          //
})(RocketChat.models._Base);                                                                                          //
                                                                                                                      //
RocketChat.models.LivechatPageVisited = new LivechatPageVisited();                                                    // 48
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/models/LivechatTrigger.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   //
 * Livechat Trigger model                                                                                             //
 */                                                                                                                   //
                                                                                                                      //
var LivechatTrigger = (function (_RocketChat$models$_Base) {                                                          //
	babelHelpers.inherits(LivechatTrigger, _RocketChat$models$_Base);                                                    //
                                                                                                                      //
	function LivechatTrigger() {                                                                                         // 5
		babelHelpers.classCallCheck(this, LivechatTrigger);                                                                 //
                                                                                                                      //
		_RocketChat$models$_Base.call(this);                                                                                // 6
		this._initModel('livechat_trigger');                                                                                // 7
	}                                                                                                                    //
                                                                                                                      //
	// FIND                                                                                                              //
                                                                                                                      //
	LivechatTrigger.prototype.save = (function () {                                                                      // 4
		function save(data) {                                                                                               // 11
			var trigger = this.findOne();                                                                                      // 12
                                                                                                                      //
			if (trigger) {                                                                                                     // 14
				return this.update({ _id: trigger._id }, { $set: data });                                                         // 15
			} else {                                                                                                           //
				return this.insert(data);                                                                                         // 17
			}                                                                                                                  //
		}                                                                                                                   //
                                                                                                                      //
		return save;                                                                                                        //
	})();                                                                                                                //
                                                                                                                      //
	LivechatTrigger.prototype.removeAll = (function () {                                                                 // 4
		function removeAll() {                                                                                              // 21
			this.remove({});                                                                                                   // 22
		}                                                                                                                   //
                                                                                                                      //
		return removeAll;                                                                                                   //
	})();                                                                                                                //
                                                                                                                      //
	return LivechatTrigger;                                                                                              //
})(RocketChat.models._Base);                                                                                          //
                                                                                                                      //
RocketChat.models.LivechatTrigger = new LivechatTrigger();                                                            // 26
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/lib/getNextAgent.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* exported getNextAgent */                                                                                           //
                                                                                                                      //
this.getNextAgent = function (department) {                                                                           // 3
	if (department) {                                                                                                    // 4
		return RocketChat.models.LivechatDepartmentAgents.getNextAgentForDepartment(department);                            // 5
	} else {                                                                                                             //
		return RocketChat.models.Users.getNextAgent();                                                                      // 7
	}                                                                                                                    //
};                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/publications/availableDepartments.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.publish('livechat:availableDepartments', function () {                                                         // 1
	return RocketChat.models.LivechatDepartment.findEnabledWithAgents();                                                 // 2
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/publications/customFields.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.publish('livechat:customFields', function (_id) {                                                              // 1
	if (!this.userId) {                                                                                                  // 2
		throw new Meteor.Error('not-authorized');                                                                           // 3
	}                                                                                                                    //
                                                                                                                      //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                   // 6
		throw new Meteor.Error('not-authorized');                                                                           // 7
	}                                                                                                                    //
                                                                                                                      //
	if (s.trim(_id)) {                                                                                                   // 10
		return RocketChat.models.LivechatCustomField.find({ _id: _id });                                                    // 11
	}                                                                                                                    //
                                                                                                                      //
	return RocketChat.models.LivechatCustomField.find();                                                                 // 14
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/publications/departmentAgents.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.publish('livechat:departmentAgents', function (departmentId) {                                                 // 1
	if (!this.userId) {                                                                                                  // 2
		throw new Meteor.Error('not-authorized');                                                                           // 3
	}                                                                                                                    //
                                                                                                                      //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 6
		throw new Meteor.Error('not-authorized');                                                                           // 7
	}                                                                                                                    //
                                                                                                                      //
	return RocketChat.models.LivechatDepartmentAgents.find({ departmentId: departmentId });                              // 10
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/publications/livechatAgents.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.publish('livechat:agents', function () {                                                                       // 1
	if (!this.userId) {                                                                                                  // 2
		throw new Meteor.Error('not-authorized');                                                                           // 3
	}                                                                                                                    //
                                                                                                                      //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 6
		throw new Meteor.Error('not-authorized');                                                                           // 7
	}                                                                                                                    //
                                                                                                                      //
	var self = this;                                                                                                     // 10
                                                                                                                      //
	var handle = RocketChat.authz.getUsersInRole('livechat-agent').observeChanges({                                      // 12
		added: function (id, fields) {                                                                                      // 13
			self.added('agentUsers', id, fields);                                                                              // 14
		},                                                                                                                  //
		changed: function (id, fields) {                                                                                    // 16
			self.changed('agentUsers', id, fields);                                                                            // 17
		},                                                                                                                  //
		removed: function (id) {                                                                                            // 19
			self.removed('agentUsers', id);                                                                                    // 20
		}                                                                                                                   //
	});                                                                                                                  //
                                                                                                                      //
	self.ready();                                                                                                        // 24
                                                                                                                      //
	self.onStop(function () {                                                                                            // 26
		handle.stop();                                                                                                      // 27
	});                                                                                                                  //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/publications/livechatDepartments.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.publish('livechat:departments', function (_id) {                                                               // 1
	if (!this.userId) {                                                                                                  // 2
		throw new Meteor.Error('not-authorized');                                                                           // 3
	}                                                                                                                    //
                                                                                                                      //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 6
		throw new Meteor.Error('not-authorized');                                                                           // 7
	}                                                                                                                    //
                                                                                                                      //
	if (_id !== undefined) {                                                                                             // 10
		return RocketChat.models.LivechatDepartment.findByDepartmentId(_id);                                                // 11
	} else {                                                                                                             //
		return RocketChat.models.LivechatDepartment.find();                                                                 // 13
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/publications/livechatManagers.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.publish('livechat:managers', function () {                                                                     // 1
	if (!this.userId) {                                                                                                  // 2
		throw new Meteor.Error('not-authorized');                                                                           // 3
	}                                                                                                                    //
                                                                                                                      //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                         // 6
		throw new Meteor.Error('not-authorized');                                                                           // 7
	}                                                                                                                    //
                                                                                                                      //
	var self = this;                                                                                                     // 10
                                                                                                                      //
	var handle = RocketChat.authz.getUsersInRole('livechat-manager').observeChanges({                                    // 12
		added: function (id, fields) {                                                                                      // 13
			self.added('managerUsers', id, fields);                                                                            // 14
		},                                                                                                                  //
		changed: function (id, fields) {                                                                                    // 16
			self.changed('managerUsers', id, fields);                                                                          // 17
		},                                                                                                                  //
		removed: function (id) {                                                                                            // 19
			self.removed('managerUsers', id);                                                                                  // 20
		}                                                                                                                   //
	});                                                                                                                  //
                                                                                                                      //
	self.ready();                                                                                                        // 24
                                                                                                                      //
	self.onStop(function () {                                                                                            // 26
		handle.stop();                                                                                                      // 27
	});                                                                                                                  //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/publications/trigger.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.publish('livechat:trigger', function () {                                                                      // 1
	return RocketChat.models.LivechatTrigger.find();                                                                     // 2
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/publications/visitorInfo.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.publish('livechat:visitorInfo', function (roomId) {                                                            // 1
	if (!this.userId) {                                                                                                  // 2
		throw new Meteor.Error('not-authorized');                                                                           // 3
	}                                                                                                                    //
                                                                                                                      //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                   // 6
		throw new Meteor.Error('not-authorized');                                                                           // 7
	}                                                                                                                    //
                                                                                                                      //
	var room = RocketChat.models.Rooms.findOneById(roomId);                                                              // 10
                                                                                                                      //
	if (room && room.v && room.v.token) {                                                                                // 12
		return RocketChat.models.Users.findVisitorByToken(room.v.token);                                                    // 13
	} else {                                                                                                             //
		return this.ready();                                                                                                // 15
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/publications/visitorPageVisited.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.publish('livechat:visitorPageVisited', function (roomId) {                                                     // 1
	if (!this.userId) {                                                                                                  // 2
		throw new Meteor.Error('not-authorized');                                                                           // 3
	}                                                                                                                    //
                                                                                                                      //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                   // 6
		throw new Meteor.Error('not-authorized');                                                                           // 7
	}                                                                                                                    //
                                                                                                                      //
	var room = RocketChat.models.Rooms.findOneById(roomId);                                                              // 10
                                                                                                                      //
	if (room && room.v && room.v.token) {                                                                                // 12
		return RocketChat.models.LivechatPageVisited.findByToken(room.v.token);                                             // 13
	} else {                                                                                                             //
		return this.ready();                                                                                                // 15
	}                                                                                                                    //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_livechat/server/publications/visitorRoom.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.publish('livechat:visitorRoom', function (visitorToken) {                                                      // 1
	return RocketChat.models.Rooms.findByVisitorToken(visitorToken, {                                                    // 2
		fields: {                                                                                                           // 3
			name: 1,                                                                                                           // 4
			t: 1,                                                                                                              // 5
			cl: 1,                                                                                                             // 6
			u: 1,                                                                                                              // 7
			usernames: 1,                                                                                                      // 8
			v: 1                                                                                                               // 9
		}                                                                                                                   //
	});                                                                                                                  //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:livechat'] = {};

})();

//# sourceMappingURL=rocketchat_livechat.js.map
