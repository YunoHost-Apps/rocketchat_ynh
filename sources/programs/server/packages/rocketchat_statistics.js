(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_statistics/lib/rocketchat.coffee.js                                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.statistics = {};                                                                                        // 1
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_statistics/server/models/Statistics.coffee.js                                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                     //
                                                                                                                   //
RocketChat.models.Statistics = new ((function(superClass) {                                                        // 1
  extend(_Class, superClass);                                                                                      // 2
                                                                                                                   //
  function _Class() {                                                                                              // 2
    this._initModel('statistics');                                                                                 // 3
  }                                                                                                                //
                                                                                                                   //
  _Class.prototype.findOneById = function(_id, options) {                                                          // 2
    var query;                                                                                                     // 8
    query = {                                                                                                      // 8
      _id: _id                                                                                                     // 9
    };                                                                                                             //
    return this.findOne(query, options);                                                                           // 11
  };                                                                                                               //
                                                                                                                   //
  _Class.prototype.findLast = function() {                                                                         // 2
    var options, query, ref;                                                                                       // 14
    query = {};                                                                                                    // 14
    options = {                                                                                                    // 14
      sort: {                                                                                                      // 15
        createdAt: -1                                                                                              // 15
      }                                                                                                            //
    };                                                                                                             //
    return (ref = this.find(query, options).fetch()) != null ? ref[0] : void 0;                                    // 16
  };                                                                                                               //
                                                                                                                   //
  return _Class;                                                                                                   //
                                                                                                                   //
})(RocketChat.models._Base));                                                                                      //
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_statistics/server/models/MRStatistics.coffee.js                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                     //
                                                                                                                   //
RocketChat.models.MRStatistics = new ((function(superClass) {                                                      // 1
  extend(_Class, superClass);                                                                                      // 2
                                                                                                                   //
  function _Class() {                                                                                              // 2
    this._initModel('mr_statistics');                                                                              // 3
  }                                                                                                                //
                                                                                                                   //
  _Class.prototype.findOneById = function(_id, options) {                                                          // 2
    var query;                                                                                                     // 8
    query = {                                                                                                      // 8
      _id: _id                                                                                                     // 9
    };                                                                                                             //
    return this.findOne(query, options);                                                                           // 11
  };                                                                                                               //
                                                                                                                   //
  return _Class;                                                                                                   //
                                                                                                                   //
})(RocketChat.models._Base));                                                                                      //
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_statistics/server/functions/get.coffee.js                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.statistics.get = function() {                                                                           // 1
  var f, m, migration, os, r, ref, ref1, ref2, ref3, result, statistics;                                           // 2
  statistics = {};                                                                                                 // 2
  statistics.uniqueId = RocketChat.settings.get("uniqueID");                                                       // 2
  statistics.createdAt = (ref = RocketChat.models.Settings.findOne("uniqueID")) != null ? ref._createdAt : void 0;
  statistics.version = (ref1 = RocketChat.Info) != null ? ref1.version : void 0;                                   // 2
  statistics.tag = (ref2 = RocketChat.Info) != null ? ref2.tag : void 0;                                           // 2
  statistics.branch = (ref3 = RocketChat.Info) != null ? ref3.branch : void 0;                                     // 2
  statistics.totalUsers = Meteor.users.find().count();                                                             // 2
  statistics.activeUsers = Meteor.users.find({                                                                     // 2
    active: true                                                                                                   // 13
  }).count();                                                                                                      //
  statistics.nonActiveUsers = statistics.totalUsers - statistics.activeUsers;                                      // 2
  statistics.onlineUsers = Meteor.users.find({                                                                     // 2
    statusConnection: 'online'                                                                                     // 15
  }).count();                                                                                                      //
  statistics.awayUsers = Meteor.users.find({                                                                       // 2
    statusConnection: 'away'                                                                                       // 16
  }).count();                                                                                                      //
  statistics.offlineUsers = statistics.totalUsers - statistics.onlineUsers - statistics.awayUsers;                 // 2
  statistics.totalRooms = RocketChat.models.Rooms.find().count();                                                  // 2
  statistics.totalChannels = RocketChat.models.Rooms.findByType('c').count();                                      // 2
  statistics.totalPrivateGroups = RocketChat.models.Rooms.findByType('p').count();                                 // 2
  statistics.totalDirect = RocketChat.models.Rooms.findByType('d').count();                                        // 2
  statistics.totalMessages = RocketChat.models.Messages.find().count();                                            // 2
  m = function() {                                                                                                 // 2
    emit(1, {                                                                                                      // 29
      sum: this.usernames.length || 0,                                                                             // 30
      min: this.usernames.length || 0,                                                                             // 30
      max: this.usernames.length || 0,                                                                             // 30
      count: 1                                                                                                     // 30
    });                                                                                                            //
    return emit(this.t, {                                                                                          //
      sum: this.usernames.length || 0,                                                                             // 36
      min: this.usernames.length || 0,                                                                             // 36
      max: this.usernames.length || 0,                                                                             // 36
      count: 1                                                                                                     // 36
    });                                                                                                            //
  };                                                                                                               //
  r = function(k, v) {                                                                                             // 2
    var a, b, i, len;                                                                                              // 42
    a = v.shift();                                                                                                 // 42
    for (i = 0, len = v.length; i < len; i++) {                                                                    // 43
      b = v[i];                                                                                                    //
      a.sum += b.sum;                                                                                              // 44
      a.min = Math.min(a.min, b.min);                                                                              // 44
      a.max = Math.max(a.max, b.max);                                                                              // 44
      a.count += b.count;                                                                                          // 44
    }                                                                                                              // 43
    return a;                                                                                                      // 48
  };                                                                                                               //
  f = function(k, v) {                                                                                             // 2
    v.avg = v.sum / v.count;                                                                                       // 51
    return v;                                                                                                      // 52
  };                                                                                                               //
  result = RocketChat.models.Rooms.model.mapReduce(m, r, {                                                         // 2
    finalize: f,                                                                                                   // 54
    out: "rocketchat_mr_statistics"                                                                                // 54
  });                                                                                                              //
  statistics.maxRoomUsers = 0;                                                                                     // 2
  statistics.avgChannelUsers = 0;                                                                                  // 2
  statistics.avgPrivateGroupUsers = 0;                                                                             // 2
  if (RocketChat.models.MRStatistics.findOneById(1)) {                                                             // 60
    statistics.maxRoomUsers = RocketChat.models.MRStatistics.findOneById(1).value.max;                             // 61
  }                                                                                                                //
  if (RocketChat.models.MRStatistics.findOneById('c')) {                                                           // 63
    statistics.avgChannelUsers = RocketChat.models.MRStatistics.findOneById('c').value.avg;                        // 64
  }                                                                                                                //
  if (RocketChat.models.MRStatistics.findOneById('p')) {                                                           // 66
    statistics.avgPrivateGroupUsers = RocketChat.models.MRStatistics.findOneById('p').value.avg;                   // 67
  }                                                                                                                //
  statistics.lastLogin = RocketChat.models.Users.getLastLogin();                                                   // 2
  statistics.lastMessageSentAt = RocketChat.models.Messages.getLastTimestamp();                                    // 2
  statistics.lastSeenSubscription = RocketChat.models.Subscriptions.getLastSeen();                                 // 2
  migration = typeof Migrations !== "undefined" && Migrations !== null ? Migrations._getControl() : void 0;        // 2
  if (migration) {                                                                                                 // 74
    statistics.migration = _.pick(migration, 'version', 'locked');                                                 // 75
  }                                                                                                                //
  os = Npm.require('os');                                                                                          // 2
  statistics.os = {                                                                                                // 2
    type: os.type(),                                                                                               // 79
    platform: os.platform(),                                                                                       // 79
    arch: os.arch(),                                                                                               // 79
    release: os.release(),                                                                                         // 79
    uptime: os.uptime(),                                                                                           // 79
    loadavg: os.loadavg(),                                                                                         // 79
    totalmem: os.totalmem(),                                                                                       // 79
    freemem: os.freemem(),                                                                                         // 79
    cpus: os.cpus()                                                                                                // 79
  };                                                                                                               //
  statistics.process = {                                                                                           // 2
    nodeVersion: process.version,                                                                                  // 90
    pid: process.pid,                                                                                              // 90
    uptime: process.uptime()                                                                                       // 90
  };                                                                                                               //
  statistics.migration = RocketChat.Migrations._getControl();                                                      // 2
  statistics.instanceCount = InstanceStatus.getCollection().find().count();                                        // 2
  return statistics;                                                                                               // 98
};                                                                                                                 // 1
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_statistics/server/functions/save.coffee.js                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.statistics.save = function() {                                                                          // 1
  var statistics;                                                                                                  // 2
  statistics = RocketChat.statistics.get();                                                                        // 2
  statistics.createdAt = new Date;                                                                                 // 2
  RocketChat.models.Statistics.insert(statistics);                                                                 // 2
  return statistics;                                                                                               // 5
};                                                                                                                 // 1
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_statistics/server/methods/getStatistics.coffee.js                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                   // 1
  getStatistics: function(refresh) {                                                                               // 2
    if (!Meteor.userId()) {                                                                                        // 3
      throw new Meteor.Error('invalid-user', "[methods] getStatistics -> Invalid user");                           // 4
    }                                                                                                              //
    if (RocketChat.authz.hasPermission(Meteor.userId(), 'view-statistics') !== true) {                             // 6
      throw new Meteor.Error('not-authorized', '[methods] getStatistics -> Not authorized');                       // 7
    }                                                                                                              //
    if (refresh) {                                                                                                 // 9
      return RocketChat.statistics.save();                                                                         // 10
    } else {                                                                                                       //
      return RocketChat.models.Statistics.findLast();                                                              // 12
    }                                                                                                              //
  }                                                                                                                //
});                                                                                                                //
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:statistics'] = {};

})();

//# sourceMappingURL=rocketchat_statistics.js.map
