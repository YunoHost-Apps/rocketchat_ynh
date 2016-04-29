(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_push-notifications/server/methods/saveNotificationSettings.js                          //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
Meteor.methods({                                                                                              // 1
	saveNotificationSettings: function (rid, field, value) {                                                     // 2
		if (!Meteor.userId()) {                                                                                     // 3
			throw new Meteor.Error('invalid-user', 'Invalid user');                                                    // 4
		}                                                                                                           //
                                                                                                              //
		check(rid, String);                                                                                         // 7
		check(field, String);                                                                                       // 8
		check(value, String);                                                                                       // 9
                                                                                                              //
		if (['desktopNotifications', 'mobilePushNotifications', 'emailNotifications'].indexOf(field) === -1) {      // 11
			throw new Meteor.Error('invalid-settings', 'Invalid settings field');                                      // 12
		}                                                                                                           //
                                                                                                              //
		if (['all', 'mentions', 'nothing', 'default'].indexOf(value) === -1) {                                      // 15
			throw new Meteor.Error('invalid-settings', 'Invalid settings value');                                      // 16
		}                                                                                                           //
                                                                                                              //
		var subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, Meteor.userId());          // 19
		if (!subscription) {                                                                                        // 20
			throw new Meteor.Error('invalid-subscription', 'Invalid subscription');                                    // 21
		}                                                                                                           //
                                                                                                              //
		if (field === 'desktopNotifications') {                                                                     // 24
			RocketChat.models.Subscriptions.updateDesktopNotificationsById(subscription._id, value);                   // 25
		} else if (field === 'mobilePushNotifications') {                                                           //
			RocketChat.models.Subscriptions.updateMobilePushNotificationsById(subscription._id, value);                // 27
		} else if (field === 'emailNotifications') {                                                                //
			RocketChat.models.Subscriptions.updateEmailNotificationsById(subscription._id, value);                     // 29
		}                                                                                                           //
                                                                                                              //
		return true;                                                                                                // 32
	}                                                                                                            //
});                                                                                                           //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_push-notifications/server/models/Subscriptions.js                                      //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
RocketChat.models.Subscriptions.updateDesktopNotificationsById = function (_id, desktopNotifications) {       // 1
	var query = {                                                                                                // 2
		_id: _id                                                                                                    // 3
	};                                                                                                           //
                                                                                                              //
	var update = {                                                                                               // 6
		$set: {                                                                                                     // 7
			desktopNotifications: desktopNotifications                                                                 // 8
		}                                                                                                           //
	};                                                                                                           //
                                                                                                              //
	return this.update(query, update);                                                                           // 12
};                                                                                                            //
                                                                                                              //
RocketChat.models.Subscriptions.updateMobilePushNotificationsById = function (_id, mobilePushNotifications) {
	var query = {                                                                                                // 16
		_id: _id                                                                                                    // 17
	};                                                                                                           //
                                                                                                              //
	var update = {                                                                                               // 20
		$set: {                                                                                                     // 21
			mobilePushNotifications: mobilePushNotifications                                                           // 22
		}                                                                                                           //
	};                                                                                                           //
                                                                                                              //
	return this.update(query, update);                                                                           // 26
};                                                                                                            //
                                                                                                              //
RocketChat.models.Subscriptions.updateEmailNotificationsById = function (_id, emailNotifications) {           // 29
	var query = {                                                                                                // 30
		_id: _id                                                                                                    // 31
	};                                                                                                           //
                                                                                                              //
	var update = {                                                                                               // 34
		$set: {                                                                                                     // 35
			emailNotifications: emailNotifications                                                                     // 36
		}                                                                                                           //
	};                                                                                                           //
                                                                                                              //
	return this.update(query, update);                                                                           // 40
};                                                                                                            //
                                                                                                              //
RocketChat.models.Subscriptions.findAlwaysNotifyDesktopUsersByRoomId = function (roomId) {                    // 43
	var query = {                                                                                                // 44
		rid: roomId,                                                                                                // 45
		desktopNotifications: 'all'                                                                                 // 46
	};                                                                                                           //
                                                                                                              //
	return this.find(query);                                                                                     // 49
};                                                                                                            //
                                                                                                              //
RocketChat.models.Subscriptions.findDontNotifyDesktopUsersByRoomId = function (roomId) {                      // 52
	var query = {                                                                                                // 53
		rid: roomId,                                                                                                // 54
		desktopNotifications: 'nothing'                                                                             // 55
	};                                                                                                           //
                                                                                                              //
	return this.find(query);                                                                                     // 58
};                                                                                                            //
                                                                                                              //
RocketChat.models.Subscriptions.findAlwaysNotifyMobileUsersByRoomId = function (roomId) {                     // 61
	var query = {                                                                                                // 62
		rid: roomId,                                                                                                // 63
		mobilePushNotifications: 'all'                                                                              // 64
	};                                                                                                           //
                                                                                                              //
	return this.find(query);                                                                                     // 67
};                                                                                                            //
                                                                                                              //
RocketChat.models.Subscriptions.findDontNotifyMobileUsersByRoomId = function (roomId) {                       // 70
	var query = {                                                                                                // 71
		rid: roomId,                                                                                                // 72
		mobilePushNotifications: 'nothing'                                                                          // 73
	};                                                                                                           //
                                                                                                              //
	return this.find(query);                                                                                     // 76
};                                                                                                            //
                                                                                                              //
RocketChat.models.Subscriptions.findNotificationPreferencesByRoom = function (roomId) {                       // 79
	var query = {                                                                                                // 80
		rid: roomId,                                                                                                // 81
		'u._id': { $exists: true },                                                                                 // 82
		$or: [{ desktopNotifications: { $exists: true } }, { mobilePushNotifications: { $exists: true } }]          // 83
	};                                                                                                           //
                                                                                                              //
	return this.find(query);                                                                                     // 89
};                                                                                                            //
                                                                                                              //
RocketChat.models.Subscriptions.findWithSendEmailByRoomId = function (roomId) {                               // 92
	var query = {                                                                                                // 93
		rid: roomId,                                                                                                // 94
		emailNotifications: {                                                                                       // 95
			$exists: true                                                                                              // 96
		}                                                                                                           //
	};                                                                                                           //
                                                                                                              //
	return this.find(query, { fields: { emailNotifications: 1, u: 1 } });                                        // 100
};                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:push-notifications'] = {};

})();

//# sourceMappingURL=rocketchat_push-notifications.js.map
