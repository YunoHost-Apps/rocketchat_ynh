(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var colors = Package['nooitaf:colors'].colors;

/* Package-scope variables */
var UsersSessions, UserPresence, UserPresenceMonitor;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/konecty_user-presence/packages/konecty_user-presence.js  //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
(function () {                                                       // 1
                                                                     // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/konecty:user-presence/common/common.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
UsersSessions = new Meteor.Collection('usersSessions');                                                               // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                     // 11
}).call(this);                                                       // 12
                                                                     // 13
                                                                     // 14
                                                                     // 15
                                                                     // 16
                                                                     // 17
                                                                     // 18
(function () {                                                       // 19
                                                                     // 20
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/konecty:user-presence/server/server.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
UsersSessions._ensureIndex({'connections.instanceId': 1}, {sparse: 1, name: 'connections.instanceId'});               // 1
UsersSessions._ensureIndex({'connections.id': 1}, {sparse: 1, name: 'connections.id'});                               // 2
                                                                                                                      // 3
var allowedStatus = ['online', 'away', 'busy', 'offline'];                                                            // 4
                                                                                                                      // 5
var logEnable = false;                                                                                                // 6
                                                                                                                      // 7
var log = function(msg, color) {                                                                                      // 8
	if (logEnable) {                                                                                                     // 9
		if (color) {                                                                                                        // 10
			console.log(msg[color]);                                                                                           // 11
		} else {                                                                                                            // 12
			console.log(msg);                                                                                                  // 13
		}                                                                                                                   // 14
	}                                                                                                                    // 15
};                                                                                                                    // 16
                                                                                                                      // 17
var logRed    = function() {log(Array.prototype.slice.call(arguments).join(' '), 'red');};                            // 18
var logGrey   = function() {log(Array.prototype.slice.call(arguments).join(' '), 'grey');};                           // 19
var logGreen  = function() {log(Array.prototype.slice.call(arguments).join(' '), 'green');};                          // 20
var logYellow = function() {log(Array.prototype.slice.call(arguments).join(' '), 'yellow');};                         // 21
                                                                                                                      // 22
UserPresence = {                                                                                                      // 23
	activeLogs: function() {                                                                                             // 24
		logEnable = true;                                                                                                   // 25
	},                                                                                                                   // 26
                                                                                                                      // 27
	removeLostConnections: function() {                                                                                  // 28
		if (Package['konecty:multiple-instances-status']) {                                                                 // 29
			var ids = InstanceStatus.getCollection().find({}, {fields: {_id: 1}}).fetch();                                     // 30
                                                                                                                      // 31
			ids = ids.map(function(id) {                                                                                       // 32
				return id._id;                                                                                                    // 33
			});                                                                                                                // 34
                                                                                                                      // 35
			var update = {                                                                                                     // 36
				$pull: {                                                                                                          // 37
					connections: {                                                                                                   // 38
						instanceId: {                                                                                                   // 39
							$nin: ids                                                                                                      // 40
						}                                                                                                               // 41
					}                                                                                                                // 42
				}                                                                                                                 // 43
			};                                                                                                                 // 44
                                                                                                                      // 45
			UsersSessions.update({}, update, {multi: true});                                                                   // 46
		} else {                                                                                                            // 47
			UsersSessions.remove({});                                                                                          // 48
		}                                                                                                                   // 49
	},                                                                                                                   // 50
                                                                                                                      // 51
	removeConnectionsByInstanceId: function(instanceId) {                                                                // 52
		logRed('[user-presence] removeConnectionsByInstanceId', instanceId);                                                // 53
		var update = {                                                                                                      // 54
			$pull: {                                                                                                           // 55
				connections: {                                                                                                    // 56
					instanceId: instanceId                                                                                           // 57
				}                                                                                                                 // 58
			}                                                                                                                  // 59
		};                                                                                                                  // 60
                                                                                                                      // 61
		UsersSessions.update({}, update, {multi: true});                                                                    // 62
	},                                                                                                                   // 63
                                                                                                                      // 64
	removeAllConnections: function() {                                                                                   // 65
		logRed('[user-presence] removeAllConnections');                                                                     // 66
		UsersSessions.remove({});                                                                                           // 67
	},                                                                                                                   // 68
                                                                                                                      // 69
	startObserveForDeletedServers: function() {                                                                          // 70
		InstanceStatus.getCollection().find({}, {fields: {_id: 1}}).observeChanges({                                        // 71
			removed: function(id) {                                                                                            // 72
				UserPresence.removeConnectionsByInstanceId(id);                                                                   // 73
			}                                                                                                                  // 74
		});                                                                                                                 // 75
	},                                                                                                                   // 76
                                                                                                                      // 77
	createConnection: function(userId, connection, status, visitor) {                                                    // 78
		if (!userId) {                                                                                                      // 79
			return;                                                                                                            // 80
		};                                                                                                                  // 81
                                                                                                                      // 82
		connection.UserPresenceUserId = userId;                                                                             // 83
                                                                                                                      // 84
		status = status || 'online';                                                                                        // 85
                                                                                                                      // 86
		logGreen('[user-presence] createConnection', userId, connection.id, visitor === true ? 'visitor' : 'user');         // 87
                                                                                                                      // 88
		var query = {                                                                                                       // 89
			_id: userId                                                                                                        // 90
		};                                                                                                                  // 91
                                                                                                                      // 92
		var now = new Date();                                                                                               // 93
                                                                                                                      // 94
		var instanceId = undefined;                                                                                         // 95
		if (Package['konecty:multiple-instances-status']) {                                                                 // 96
			instanceId = InstanceStatus.id();                                                                                  // 97
		};                                                                                                                  // 98
                                                                                                                      // 99
		var update = {                                                                                                      // 100
			$set: {                                                                                                            // 101
				visitor: visitor === true                                                                                         // 102
			},                                                                                                                 // 103
			$push: {                                                                                                           // 104
				connections: {                                                                                                    // 105
					id: connection.id,                                                                                               // 106
					instanceId: instanceId,                                                                                          // 107
					status: status,                                                                                                  // 108
					_createdAt: now,                                                                                                 // 109
					_updatedAt: now                                                                                                  // 110
				}                                                                                                                 // 111
			}                                                                                                                  // 112
		};                                                                                                                  // 113
                                                                                                                      // 114
		UsersSessions.upsert(query, update);                                                                                // 115
	},                                                                                                                   // 116
                                                                                                                      // 117
	setConnection: function(userId, connection, status, visitor) {                                                       // 118
		if (!userId) {                                                                                                      // 119
			return;                                                                                                            // 120
		};                                                                                                                  // 121
                                                                                                                      // 122
		logGrey('[user-presence] setConnection', userId, connection.id, status, visitor === true ? 'visitor' : 'user');     // 123
                                                                                                                      // 124
		var query = {                                                                                                       // 125
			_id: userId,                                                                                                       // 126
			'connections.id': connection.id                                                                                    // 127
		};                                                                                                                  // 128
                                                                                                                      // 129
		var now = new Date();                                                                                               // 130
                                                                                                                      // 131
		var update = {                                                                                                      // 132
			$set: {                                                                                                            // 133
				'connections.$.status': status,                                                                                   // 134
				'connections.$._updatedAt': now                                                                                   // 135
			}                                                                                                                  // 136
		};                                                                                                                  // 137
                                                                                                                      // 138
		var count = UsersSessions.update(query, update);                                                                    // 139
                                                                                                                      // 140
		if (count === 0) {                                                                                                  // 141
			UserPresence.createConnection(userId, connection, status, visitor);                                                // 142
		};                                                                                                                  // 143
                                                                                                                      // 144
		if (visitor !== true) {                                                                                             // 145
			if (status === 'online') {                                                                                         // 146
				Meteor.users.update({_id: userId, statusDefault: 'online', status: {$ne: 'online'}}, {$set: {status: 'online'}}); // 147
			} else if (status === 'away') {                                                                                    // 148
				Meteor.users.update({_id: userId, statusDefault: 'online', status: {$ne: 'away'}}, {$set: {status: 'away'}});     // 149
			}                                                                                                                  // 150
		}                                                                                                                   // 151
	},                                                                                                                   // 152
                                                                                                                      // 153
	setDefaultStatus: function(userId, status) {                                                                         // 154
		if (!userId) {                                                                                                      // 155
			return;                                                                                                            // 156
		};                                                                                                                  // 157
                                                                                                                      // 158
		if (allowedStatus.indexOf(status) === -1) {                                                                         // 159
			return;                                                                                                            // 160
		};                                                                                                                  // 161
                                                                                                                      // 162
		logYellow('[user-presence] setDefaultStatus', userId, status);                                                      // 163
                                                                                                                      // 164
		Meteor.users.update({_id: userId, statusDefault: {$ne: status}}, {$set: {status: status, statusDefault: status}});  // 165
	},                                                                                                                   // 166
                                                                                                                      // 167
	removeConnection: function(connectionId) {                                                                           // 168
		logRed('[user-presence] removeConnection', connectionId);                                                           // 169
                                                                                                                      // 170
		var query = {                                                                                                       // 171
			'connections.id': connectionId                                                                                     // 172
		};                                                                                                                  // 173
                                                                                                                      // 174
		var update = {                                                                                                      // 175
			$pull: {                                                                                                           // 176
				connections: {                                                                                                    // 177
					id: connectionId                                                                                                 // 178
				}                                                                                                                 // 179
			}                                                                                                                  // 180
		};                                                                                                                  // 181
                                                                                                                      // 182
		UsersSessions.update(query, update);                                                                                // 183
	},                                                                                                                   // 184
                                                                                                                      // 185
	start: function() {                                                                                                  // 186
		Meteor.onConnection(function(connection) {                                                                          // 187
			connection.onClose(function() {                                                                                    // 188
				if (connection.UserPresenceUserId != undefined) {                                                                 // 189
					UserPresence.removeConnection(connection.id);                                                                    // 190
				}                                                                                                                 // 191
			});                                                                                                                // 192
		});                                                                                                                 // 193
                                                                                                                      // 194
		process.on('exit', function() {                                                                                     // 195
			if (Package['konecty:multiple-instances-status']) {                                                                // 196
				UserPresence.removeConnectionsByInstanceId(InstanceStatus.id());                                                  // 197
			} else {                                                                                                           // 198
				UserPresence.removeAllConnections();                                                                              // 199
			}                                                                                                                  // 200
		});                                                                                                                 // 201
                                                                                                                      // 202
		if (Package['accounts-base']) {                                                                                     // 203
			Accounts.onLogin(function(login) {                                                                                 // 204
				UserPresence.createConnection(login.user._id, login.connection);                                                  // 205
			});                                                                                                                // 206
		};                                                                                                                  // 207
                                                                                                                      // 208
		Meteor.publish(null, function() {                                                                                   // 209
			if (this.userId == null && this.connection.UserPresenceUserId != undefined) {                                      // 210
				UserPresence.removeConnection(this.connection.id);                                                                // 211
				delete this.connection.UserPresenceUserId;                                                                        // 212
			}                                                                                                                  // 213
                                                                                                                      // 214
			this.ready();                                                                                                      // 215
		});                                                                                                                 // 216
                                                                                                                      // 217
		if (Package['konecty:multiple-instances-status']) {                                                                 // 218
			UserPresence.startObserveForDeletedServers();                                                                      // 219
		}                                                                                                                   // 220
                                                                                                                      // 221
		UserPresence.removeLostConnections();                                                                               // 222
                                                                                                                      // 223
		Meteor.methods({                                                                                                    // 224
			'UserPresence:connect': function() {                                                                               // 225
				this.unblock();                                                                                                   // 226
				UserPresence.createConnection(this.userId, this.connection);                                                      // 227
			},                                                                                                                 // 228
                                                                                                                      // 229
			'UserPresence:away': function() {                                                                                  // 230
				this.unblock();                                                                                                   // 231
				UserPresence.setConnection(this.userId, this.connection, 'away');                                                 // 232
			},                                                                                                                 // 233
                                                                                                                      // 234
			'UserPresence:online': function() {                                                                                // 235
				this.unblock();                                                                                                   // 236
				UserPresence.setConnection(this.userId, this.connection, 'online');                                               // 237
			},                                                                                                                 // 238
                                                                                                                      // 239
			'UserPresence:setDefaultStatus': function(status) {                                                                // 240
				this.unblock();                                                                                                   // 241
				UserPresence.setDefaultStatus(this.userId, status);                                                               // 242
			},                                                                                                                 // 243
                                                                                                                      // 244
			'UserPresence:visitor:connect': function(id) {                                                                     // 245
				this.unblock();                                                                                                   // 246
				UserPresence.createConnection(id, this.connection, 'online', true);                                               // 247
			}                                                                                                                  // 248
		});                                                                                                                 // 249
	}                                                                                                                    // 250
}                                                                                                                     // 251
                                                                                                                      // 252
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                     // 280
}).call(this);                                                       // 281
                                                                     // 282
                                                                     // 283
                                                                     // 284
                                                                     // 285
                                                                     // 286
                                                                     // 287
(function () {                                                       // 288
                                                                     // 289
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/konecty:user-presence/server/monitor.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
UserPresenceMonitor = {                                                                                               // 1
	onSetUserStatus: function() {},                                                                                      // 2
                                                                                                                      // 3
	start: function() {                                                                                                  // 4
		UsersSessions.find({}).observe({                                                                                    // 5
			added: function(record) {                                                                                          // 6
				UserPresenceMonitor.processUserSession(record, 'added');                                                          // 7
			},                                                                                                                 // 8
			changed: function(record) {                                                                                        // 9
				UserPresenceMonitor.processUserSession(record, 'changed');                                                        // 10
			},                                                                                                                 // 11
			removed: function(record) {                                                                                        // 12
				UserPresenceMonitor.processUserSession(record, 'removed');                                                        // 13
			}                                                                                                                  // 14
		});                                                                                                                 // 15
                                                                                                                      // 16
		Meteor.users.find({}).observeChanges({                                                                              // 17
			changed: UserPresenceMonitor.processUser                                                                           // 18
		});                                                                                                                 // 19
	},                                                                                                                   // 20
                                                                                                                      // 21
	processUserSession: function(record, action) {                                                                       // 22
		if (action === 'removed' && (record.connections == null || record.connections.length === 0)) {                      // 23
			return;                                                                                                            // 24
		};                                                                                                                  // 25
                                                                                                                      // 26
		if (record.connections == null || record.connections.length === 0 || action === 'removed') {                        // 27
			if (record.visitor === true) {                                                                                     // 28
				UserPresenceMonitor.setVisitorStatus(record._id, 'offline');                                                      // 29
			} else {                                                                                                           // 30
				UserPresenceMonitor.setUserStatus(record._id, 'offline');                                                         // 31
			}                                                                                                                  // 32
                                                                                                                      // 33
			if (action !== 'removed') {                                                                                        // 34
				UsersSessions.remove({_id: record._id, 'connections.0': {$exists: false} });                                      // 35
			};                                                                                                                 // 36
			return;                                                                                                            // 37
		};                                                                                                                  // 38
                                                                                                                      // 39
		var connectionStatus = 'offline';                                                                                   // 40
		record.connections.forEach(function(connection) {                                                                   // 41
			if (connection.status === 'online') {                                                                              // 42
				connectionStatus = 'online';                                                                                      // 43
			} else if (connection.status === 'away' && connectionStatus === 'offline') {                                       // 44
				connectionStatus = 'away';                                                                                        // 45
			};                                                                                                                 // 46
		});                                                                                                                 // 47
                                                                                                                      // 48
		if (record.visitor === true) {                                                                                      // 49
			UserPresenceMonitor.setVisitorStatus(record._id, connectionStatus);                                                // 50
		} else {                                                                                                            // 51
			UserPresenceMonitor.setUserStatus(record._id, connectionStatus);                                                   // 52
		};                                                                                                                  // 53
	},                                                                                                                   // 54
                                                                                                                      // 55
	processUser: function(id, fields) {                                                                                  // 56
		if (fields.statusDefault == null) {                                                                                 // 57
			return;                                                                                                            // 58
		};                                                                                                                  // 59
                                                                                                                      // 60
		var userSession = UsersSessions.findOne({_id: id});                                                                 // 61
                                                                                                                      // 62
		if (userSession) {                                                                                                  // 63
			UserPresenceMonitor.processUserSession(userSession, 'changed');                                                    // 64
		};                                                                                                                  // 65
	},                                                                                                                   // 66
                                                                                                                      // 67
	setUserStatus: function(userId, status) {                                                                            // 68
		var user = Meteor.users.findOne(userId),                                                                            // 69
			statusConnection = status;                                                                                         // 70
                                                                                                                      // 71
		if (!user) {                                                                                                        // 72
			return;                                                                                                            // 73
		};                                                                                                                  // 74
                                                                                                                      // 75
		if (user.statusDefault != null && status !== 'offline' && user.statusDefault !== 'online') {                        // 76
			status = user.statusDefault;                                                                                       // 77
		};                                                                                                                  // 78
                                                                                                                      // 79
		var query = {                                                                                                       // 80
			_id: userId,                                                                                                       // 81
			$or: [                                                                                                             // 82
				{status: {$ne: status}},                                                                                          // 83
				{statusConnection: {$ne: statusConnection}}                                                                       // 84
			]                                                                                                                  // 85
		};                                                                                                                  // 86
                                                                                                                      // 87
		var update = {                                                                                                      // 88
			$set: {                                                                                                            // 89
				status: status,                                                                                                   // 90
				statusConnection: statusConnection                                                                                // 91
			}                                                                                                                  // 92
		};                                                                                                                  // 93
                                                                                                                      // 94
		Meteor.users.update(query, update);                                                                                 // 95
                                                                                                                      // 96
		UserPresenceMonitor.onSetUserStatus(user, status, statusConnection);                                                // 97
	},                                                                                                                   // 98
                                                                                                                      // 99
	setVisitorStatus: function(id, status) {}                                                                            // 100
}                                                                                                                     // 101
                                                                                                                      // 102
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                     // 399
}).call(this);                                                       // 400
                                                                     // 401
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['konecty:user-presence'] = {
  UserPresence: UserPresence,
  UserPresenceMonitor: UserPresenceMonitor
};

})();

//# sourceMappingURL=konecty_user-presence.js.map
