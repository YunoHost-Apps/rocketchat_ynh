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

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/rocketchat_ui-admin/publications/adminRooms.js                               //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
Meteor.publish('adminRooms', function (filter, types, limit) {                           // 1
	var options;                                                                            // 2
	if (!this.userId) {                                                                     // 3
		return this.ready();                                                                   // 4
	}                                                                                       //
	if (RocketChat.authz.hasPermission(this.userId, 'view-room-administration') !== true) {
		return this.ready();                                                                   // 7
	}                                                                                       //
	if (!_.isArray(types)) {                                                                // 9
		types = [];                                                                            // 10
	}                                                                                       //
	options = {                                                                             // 12
		fields: {                                                                              // 13
			name: 1,                                                                              // 14
			t: 1,                                                                                 // 15
			cl: 1,                                                                                // 16
			u: 1,                                                                                 // 17
			usernames: 1,                                                                         // 18
			muted: 1,                                                                             // 19
			'default': 1,                                                                         // 20
			topic: 1,                                                                             // 21
			msgs: 1,                                                                              // 22
			archived: 1                                                                           // 23
		},                                                                                     //
		limit: limit,                                                                          // 25
		sort: {                                                                                // 26
			'default': -1,                                                                        // 27
			name: 1                                                                               // 28
		}                                                                                      //
	};                                                                                      //
	filter = _.trim(filter);                                                                // 31
	if (filter && types.length) {                                                           // 32
		return RocketChat.models.Rooms.findByNameContainingAndTypes(filter, types, options);   // 33
	} else if (types.length) {                                                              //
		return RocketChat.models.Rooms.findByTypes(types, options);                            // 35
	} else {                                                                                //
		return RocketChat.models.Rooms.findByNameContaining(filter, options);                  // 37
	}                                                                                       //
});                                                                                      //
///////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:ui-admin'] = {};

})();

//# sourceMappingURL=rocketchat_ui-admin.js.map
