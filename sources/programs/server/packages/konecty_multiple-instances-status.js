(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var colors = Package['nooitaf:colors'].colors;

/* Package-scope variables */
var InstanceStatus;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/konecty_multiple-instances-status/multiple-instances-status.js                            //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var events = new (Npm.require('events').EventEmitter)(),                                              // 1
	collectionName = process.env.MULTIPLE_INSTANCES_COLLECTION_NAME || 'instances',                      // 2
	defaultPingInterval = 2000; // 2s                                                                    // 3
                                                                                                      // 4
var Intances = new Meteor.Collection(collectionName);                                                 // 5
                                                                                                      // 6
Intances._ensureIndex({_updatedAt: 1}, {expireAfterSeconds: 60});                                     // 7
                                                                                                      // 8
InstanceStatus = {                                                                                    // 9
	name: undefined,                                                                                     // 10
	extraInformation: undefined,                                                                         // 11
                                                                                                      // 12
	events: events,                                                                                      // 13
                                                                                                      // 14
	getCollection: function() {                                                                          // 15
		return Intances;                                                                                    // 16
	},                                                                                                   // 17
                                                                                                      // 18
	registerInstance: function(name, extraInformation) {                                                 // 19
		InstanceStatus.name = name;                                                                         // 20
		InstanceStatus.extraInformation = extraInformation;                                                 // 21
                                                                                                      // 22
		if (InstanceStatus.id() === undefined || InstanceStatus.id() === null) {                            // 23
			return console.error('[multiple-instances-status] only can be called after Meteor.startup');       // 24
		}                                                                                                   // 25
                                                                                                      // 26
		var now = new Date(),                                                                               // 27
			instance = {                                                                                       // 28
				$set: {                                                                                           // 29
					pid: process.pid,                                                                                // 30
					name: name                                                                                       // 31
				},                                                                                                // 32
				$currentDate: {                                                                                   // 33
					_createdAt: true,                                                                                // 34
					_updatedAt: true                                                                                 // 35
				}                                                                                                 // 36
			};                                                                                                 // 37
                                                                                                      // 38
		if (extraInformation) {                                                                             // 39
			instance.$set.extraInformation = extraInformation;                                                 // 40
		}                                                                                                   // 41
                                                                                                      // 42
		try {                                                                                               // 43
			Intances.upsert({_id: InstanceStatus.id()}, instance);                                             // 44
			var result = Intances.findOne({_id: InstanceStatus.id()});                                         // 45
			InstanceStatus.start();                                                                            // 46
                                                                                                      // 47
			events.emit('registerInstance', result, instance);                                                 // 48
                                                                                                      // 49
			process.on('exit', InstanceStatus.onExit);                                                         // 50
                                                                                                      // 51
			return result;                                                                                     // 52
		} catch (e) {                                                                                       // 53
			return e;                                                                                          // 54
		}                                                                                                   // 55
	},                                                                                                   // 56
                                                                                                      // 57
	unregisterInstance: function() {                                                                     // 58
		try {                                                                                               // 59
			var result = Intances.remove({_id: InstanceStatus.id()});                                          // 60
			InstanceStatus.stop();                                                                             // 61
                                                                                                      // 62
			events.emit('unregisterInstance', InstanceStatus.id());                                            // 63
                                                                                                      // 64
			process.removeListener('exit', InstanceStatus.onExit);                                             // 65
                                                                                                      // 66
			return result;                                                                                     // 67
		} catch (e) {                                                                                       // 68
			return e;                                                                                          // 69
		}                                                                                                   // 70
	},                                                                                                   // 71
                                                                                                      // 72
	start: function(interval) {                                                                          // 73
		InstanceStatus.stop();                                                                              // 74
                                                                                                      // 75
		interval = interval || defaultPingInterval;                                                         // 76
                                                                                                      // 77
		InstanceStatus.interval = Meteor.setInterval(function() {                                           // 78
			InstanceStatus.ping();                                                                             // 79
		}, interval);                                                                                       // 80
	},                                                                                                   // 81
                                                                                                      // 82
	stop: function(interval) {                                                                           // 83
		if (InstanceStatus.interval) {                                                                      // 84
			InstanceStatus.interval.close();                                                                   // 85
			delete InstanceStatus.interval;                                                                    // 86
		}                                                                                                   // 87
	},                                                                                                   // 88
                                                                                                      // 89
	ping: function() {                                                                                   // 90
		var count = Intances.update(                                                                        // 91
			{                                                                                                  // 92
				_id: InstanceStatus.id()                                                                          // 93
			},                                                                                                 // 94
			{                                                                                                  // 95
				$currentDate: {                                                                                   // 96
					_updatedAt: true                                                                                 // 97
				}                                                                                                 // 98
			});                                                                                                // 99
                                                                                                      // 100
		if (count === 0) {                                                                                  // 101
			InstanceStatus.registerInstance(InstanceStatus.name, InstanceStatus.extraInformation);             // 102
		}                                                                                                   // 103
	},                                                                                                   // 104
                                                                                                      // 105
	onExit: function() {                                                                                 // 106
		InstanceStatus.unregisterInstance();                                                                // 107
	},                                                                                                   // 108
                                                                                                      // 109
	activeLogs: function() {                                                                             // 110
		Intances.find().observe({                                                                           // 111
			added: function(record) {                                                                          // 112
				var log = '[multiple-instances-status] Server connected: ' + record.name + ' - ' + record._id;    // 113
				if (record._id == InstanceStatus.id()) {                                                          // 114
					log += ' (me)';                                                                                  // 115
				}                                                                                                 // 116
				console.log(log.green);                                                                           // 117
			},                                                                                                 // 118
			removed: function(record) {                                                                        // 119
				var log = '[multiple-instances-status] Server disconnected: ' + record.name + ' - ' + record._id;
				console.log(log.red);                                                                             // 121
			}                                                                                                  // 122
		});                                                                                                 // 123
	},                                                                                                   // 124
                                                                                                      // 125
	id: function() {}                                                                                    // 126
};                                                                                                    // 127
                                                                                                      // 128
Meteor.startup(function() {                                                                           // 129
	var ID = Random.id();                                                                                // 130
                                                                                                      // 131
	InstanceStatus.id = function() {                                                                     // 132
		return ID;                                                                                          // 133
	};                                                                                                   // 134
});                                                                                                   // 135
                                                                                                      // 136
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['konecty:multiple-instances-status'] = {
  InstanceStatus: InstanceStatus
};

})();

//# sourceMappingURL=konecty_multiple-instances-status.js.map
