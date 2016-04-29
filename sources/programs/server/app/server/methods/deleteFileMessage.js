(function(){Meteor.methods({
	deleteFileMessage: function(fileID) {
		return Meteor.call('deleteMessage', RocketChat.models.Messages.getMessageByFileId(fileID));
	}
});

}).call(this);

//# sourceMappingURL=deleteFileMessage.js.map
