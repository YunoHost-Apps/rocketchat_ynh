(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_reactions/server/models/Messages.js                                                        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
RocketChat.models.Messages.setReactions = function (messageId, reactions) {                                       // 1
	return this.update({ _id: messageId }, { $set: { reactions: reactions } });                                      // 2
};                                                                                                                //
                                                                                                                  //
RocketChat.models.Messages.unsetReactions = function (messageId) {                                                // 5
	return this.update({ _id: messageId }, { $unset: { reactions: 1 } });                                            // 6
};                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_reactions/setReaction.js                                                                   //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/* globals msgStream */                                                                                           //
Meteor.methods({                                                                                                  // 2
	setReaction: function (reaction, messageId) {                                                                    // 3
		if (!Meteor.userId()) {                                                                                         // 4
			throw new Meteor.Error(203, 'User_logged_out');                                                                // 5
		}                                                                                                               //
                                                                                                                  //
		var message = RocketChat.models.Messages.findOneById(messageId);                                                // 8
                                                                                                                  //
		if (!Meteor.call('canAccessRoom', message.rid, Meteor.userId())) {                                              // 10
			throw new Meteor.Error(203, '[methods] Not authorized');                                                       // 11
		}                                                                                                               //
                                                                                                                  //
		var user = Meteor.user();                                                                                       // 14
                                                                                                                  //
		if (message.reactions && message.reactions[reaction] && message.reactions[reaction].usernames.indexOf(user.username) !== -1) {
			message.reactions[reaction].usernames.splice(message.reactions[reaction].usernames.indexOf(user.username), 1);
                                                                                                                  //
			if (message.reactions[reaction].usernames.length === 0) {                                                      // 19
				delete message.reactions[reaction];                                                                           // 20
			}                                                                                                              //
                                                                                                                  //
			if (_.isEmpty(message.reactions)) {                                                                            // 23
				delete message.reactions;                                                                                     // 24
				RocketChat.models.Messages.unsetReactions(messageId);                                                         // 25
			} else {                                                                                                       //
				RocketChat.models.Messages.setReactions(messageId, message.reactions);                                        // 27
			}                                                                                                              //
		} else {                                                                                                        //
			if (!message.reactions) {                                                                                      // 30
				message.reactions = {};                                                                                       // 31
			}                                                                                                              //
			if (!message.reactions[reaction]) {                                                                            // 33
				message.reactions[reaction] = {                                                                               // 34
					usernames: []                                                                                                // 35
				};                                                                                                            //
			}                                                                                                              //
			message.reactions[reaction].usernames.push(user.username);                                                     // 38
                                                                                                                  //
			RocketChat.models.Messages.setReactions(messageId, message.reactions);                                         // 40
		}                                                                                                               //
                                                                                                                  //
		msgStream.emit(message.rid, message);                                                                           // 43
                                                                                                                  //
		return;                                                                                                         // 45
	}                                                                                                                //
});                                                                                                               //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_reactions/loadStylesheets.js                                                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
RocketChat.theme.addPackageAsset(function () {                                                                    // 1
	return Assets.getText('client/stylesheets/reaction.less');                                                       // 2
});                                                                                                               //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:reactions'] = {};

})();

//# sourceMappingURL=rocketchat_reactions.js.map
