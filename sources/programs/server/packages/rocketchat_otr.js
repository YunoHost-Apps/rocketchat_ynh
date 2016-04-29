(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_otr/server/settings.js                                                           //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
RocketChat.settings.addGroup('OTR', function () {                                                       // 1
	this.add('OTR_Enable', true, { type: 'boolean', 'public': true });                                     // 2
});                                                                                                     //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_otr/server/models/Messages.js                                                    //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
RocketChat.models.Messages.deleteOldOTRMessages = function (roomId, ts) {                               // 1
	var query = { rid: roomId, t: 'otr', ts: { $lte: ts } };                                               // 2
	return this.remove(query);                                                                             // 3
};                                                                                                      //
                                                                                                        //
RocketChat.models.Messages.updateOTRAck = function (_id, otrAck) {                                      // 6
	var query = { _id: _id };                                                                              // 7
	var update = { $set: { otrAck: otrAck } };                                                             // 8
	return this.update(query, update);                                                                     // 9
};                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_otr/server/methods/deleteOldOTRMessages.js                                       //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
Meteor.methods({                                                                                        // 1
	deleteOldOTRMessages: function (roomId) {                                                              // 2
		if (!Meteor.userId()) {                                                                               // 3
			throw new Meteor.Error('invalid-user', '[methods] deleteOldOTRMessages -> Invalid user');            // 4
		}                                                                                                     //
                                                                                                        //
		var now = new Date();                                                                                 // 7
		var subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(roomId, Meteor.userId());
		if (subscription && subscription.t === 'd') {                                                         // 9
			RocketChat.models.Messages.deleteOldOTRMessages(roomId, now);                                        // 10
		} else {                                                                                              //
			throw new Meteor.Error('invalid-room', '[methods] deleteOldOTRMessages -> Invalid room');            // 12
		}                                                                                                     //
	}                                                                                                      //
});                                                                                                     //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_otr/server/methods/updateOTRAck.js                                               //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
Meteor.methods({                                                                                        // 1
	updateOTRAck: function (_id, ack) {                                                                    // 2
		if (!Meteor.userId()) {                                                                               // 3
			throw new Meteor.Error('invalid-user', '[methods] deleteOldOTRMessages -> Invalid user');            // 4
		}                                                                                                     //
		RocketChat.models.Messages.updateOTRAck(_id, ack);                                                    // 6
	}                                                                                                      //
});                                                                                                     //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:otr'] = {};

})();

//# sourceMappingURL=rocketchat_otr.js.map
