(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;

/* Package-scope variables */
var DDPCommon;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/dispatch_run-as-user/packages/dispatch_run-as-user.js                                             //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
(function () {                                                                                                // 1
                                                                                                              // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                                                     //     // 4
// packages/dispatch:run-as-user/lib/pre.1.0.3.js                                                      //     // 5
//                                                                                                     //     // 6
/////////////////////////////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                                       //     // 8
// This code will go away in later versions of Meteor, this is just a "polyfill"                       // 1   // 9
// until the next release of Meteor maybe 1.0.3?                                                       // 2   // 10
//                                                                                                     // 3   // 11
if (typeof DDPCommon === 'undefined') {                                                                // 4   // 12
  DDPCommon = {};                                                                                      // 5   // 13
                                                                                                       // 6   // 14
  DDPCommon.MethodInvocation = function (options) {                                                    // 7   // 15
    var self = this;                                                                                   // 8   // 16
                                                                                                       // 9   // 17
    // true if we're running not the actual method, but a stub (that is,                               // 10  // 18
    // if we're on a client (which may be a browser, or in the future a                                // 11  // 19
    // server connecting to another server) and presently running a                                    // 12  // 20
    // simulation of a server-side method for latency compensation                                     // 13  // 21
    // purposes). not currently true except in a client such as a browser,                             // 14  // 22
    // since there's usually no point in running stubs unless you have a                               // 15  // 23
    // zero-latency connection to the user.                                                            // 16  // 24
                                                                                                       // 17  // 25
    /**                                                                                                // 18  // 26
     * @summary Access inside a method invocation.  Boolean value, true if this invocation is a stub.  // 19  // 27
     * @locus Anywhere                                                                                 // 20  // 28
     * @name  isSimulation                                                                             // 21  // 29
     * @memberOf MethodInvocation                                                                      // 22  // 30
     * @instance                                                                                       // 23  // 31
     * @type {Boolean}                                                                                 // 24  // 32
     */                                                                                                // 25  // 33
    this.isSimulation = options.isSimulation;                                                          // 26  // 34
                                                                                                       // 27  // 35
    // call this function to allow other method invocations (from the                                  // 28  // 36
    // same client) to continue running without waiting for this one to                                // 29  // 37
    // complete.                                                                                       // 30  // 38
    this._unblock = options.unblock || function () {};                                                 // 31  // 39
    this._calledUnblock = false;                                                                       // 32  // 40
                                                                                                       // 33  // 41
    // current user id                                                                                 // 34  // 42
                                                                                                       // 35  // 43
    /**                                                                                                // 36  // 44
     * @summary The id of the user that made this method call, or `null` if no user was logged in.     // 37  // 45
     * @locus Anywhere                                                                                 // 38  // 46
     * @name  userId                                                                                   // 39  // 47
     * @memberOf MethodInvocation                                                                      // 40  // 48
     * @instance                                                                                       // 41  // 49
     */                                                                                                // 42  // 50
    this.userId = options.userId;                                                                      // 43  // 51
                                                                                                       // 44  // 52
    // sets current user id in all appropriate server contexts and                                     // 45  // 53
    // reruns subscriptions                                                                            // 46  // 54
    this._setUserId = options.setUserId || function () {};                                             // 47  // 55
                                                                                                       // 48  // 56
    // On the server, the connection this method call came in on.                                      // 49  // 57
                                                                                                       // 50  // 58
    /**                                                                                                // 51  // 59
     * @summary Access inside a method invocation. The [connection](#meteor_onconnection) that this method was received on. `null` if the method is not associated with a connection, eg. a server initiated method call.
     * @locus Server                                                                                   // 53  // 61
     * @name  connection                                                                               // 54  // 62
     * @memberOf MethodInvocation                                                                      // 55  // 63
     * @instance                                                                                       // 56  // 64
     */                                                                                                // 57  // 65
    this.connection = options.connection;                                                              // 58  // 66
                                                                                                       // 59  // 67
    // The seed for randomStream value generation                                                      // 60  // 68
    this.randomSeed = options.randomSeed;                                                              // 61  // 69
                                                                                                       // 62  // 70
    // This is set by RandomStream.get; and holds the random stream state                              // 63  // 71
    this.randomStream = null;                                                                          // 64  // 72
  };                                                                                                   // 65  // 73
                                                                                                       // 66  // 74
  _.extend(DDPCommon.MethodInvocation.prototype, {                                                     // 67  // 75
    /**                                                                                                // 68  // 76
     * @summary Call inside a method invocation.  Allow subsequent method from this client to begin running in a new fiber.
     * @locus Server                                                                                   // 70  // 78
     * @memberOf MethodInvocation                                                                      // 71  // 79
     * @instance                                                                                       // 72  // 80
     */                                                                                                // 73  // 81
    unblock: function () {                                                                             // 74  // 82
      var self = this;                                                                                 // 75  // 83
      self._calledUnblock = true;                                                                      // 76  // 84
      self._unblock();                                                                                 // 77  // 85
    },                                                                                                 // 78  // 86
                                                                                                       // 79  // 87
    /**                                                                                                // 80  // 88
     * @summary Set the logged in user.                                                                // 81  // 89
     * @locus Server                                                                                   // 82  // 90
     * @memberOf MethodInvocation                                                                      // 83  // 91
     * @instance                                                                                       // 84  // 92
     * @param {String | null} userId The value that should be returned by `userId` on this connection. // 85  // 93
     */                                                                                                // 86  // 94
    setUserId: function (userId) {                                                                     // 87  // 95
      var self = this;                                                                                 // 88  // 96
      if (self._calledUnblock)                                                                         // 89  // 97
        throw new Error("Can't call setUserId in a method after calling unblock");                     // 90  // 98
      self.userId = userId;                                                                            // 91  // 99
      // self._setUserId(userId);                                                                      // 92  // 100
    }                                                                                                  // 93  // 101
                                                                                                       // 94  // 102
  });                                                                                                  // 95  // 103
}                                                                                                      // 96  // 104
                                                                                                       // 97  // 105
/////////////////////////////////////////////////////////////////////////////////////////////////////////     // 106
                                                                                                              // 107
}).call(this);                                                                                                // 108
                                                                                                              // 109
                                                                                                              // 110
                                                                                                              // 111
                                                                                                              // 112
                                                                                                              // 113
                                                                                                              // 114
(function () {                                                                                                // 115
                                                                                                              // 116
/////////////////////////////////////////////////////////////////////////////////////////////////////////     // 117
//                                                                                                     //     // 118
// packages/dispatch:run-as-user/lib/common.js                                                         //     // 119
//                                                                                                     //     // 120
/////////////////////////////////////////////////////////////////////////////////////////////////////////     // 121
                                                                                                       //     // 122
// This file adds the actual "Meteor.runAsUser" and "Meteor.isRestricted" api                          // 1   // 123
//                                                                                                     // 2   // 124
// It's done by using a DDP method invocation, setting a user id and a                                 // 3   // 125
// "isRestricted" flag on it.                                                                          // 4   // 126
//                                                                                                     // 5   // 127
// If run inside of an existing DDP invocation a nested version will be created.                       // 6   // 128
                                                                                                       // 7   // 129
var restrictedMode = new Meteor.EnvironmentVariable();                                                 // 8   // 130
                                                                                                       // 9   // 131
/**                                                                                                    // 10  // 132
 * Returns true if inside a runAsUser user scope                                                       // 11  // 133
 * @return {Boolean} True if in a runAsUser user scope                                                 // 12  // 134
 */                                                                                                    // 13  // 135
Meteor.isRestricted = function () {                                                                    // 14  // 136
  return !!restrictedMode.get();                                                                       // 15  // 137
};                                                                                                     // 16  // 138
                                                                                                       // 17  // 139
/**                                                                                                    // 18  // 140
 * Run code restricted                                                                                 // 19  // 141
 * @param  {Function} f Code to run in restricted mode                                                 // 20  // 142
 * @return {Any}   Result of code running                                                              // 21  // 143
 */                                                                                                    // 22  // 144
Meteor.runRestricted = function(f) {                                                                   // 23  // 145
  if (Meteor.isRestricted()) {                                                                         // 24  // 146
    return f();                                                                                        // 25  // 147
  } else {                                                                                             // 26  // 148
    return restrictedMode.withValue(true, f);                                                          // 27  // 149
  }                                                                                                    // 28  // 150
};                                                                                                     // 29  // 151
                                                                                                       // 30  // 152
/**                                                                                                    // 31  // 153
 * Run code unrestricted                                                                               // 32  // 154
 * @param  {Function} f Code to run in restricted mode                                                 // 33  // 155
 * @return {Any}   Result of code running                                                              // 34  // 156
 */                                                                                                    // 35  // 157
Meteor.runUnrestricted = function(f) {                                                                 // 36  // 158
  if (Meteor.isRestricted()) {                                                                         // 37  // 159
    return restrictedMode.withValue(false, f);                                                         // 38  // 160
  } else {                                                                                             // 39  // 161
    f();                                                                                               // 40  // 162
  }                                                                                                    // 41  // 163
};                                                                                                     // 42  // 164
                                                                                                       // 43  // 165
/**                                                                                                    // 44  // 166
 * Run as a user                                                                                       // 45  // 167
 * @param  {String} userId The id of user to run as                                                    // 46  // 168
 * @param  {Function} f      Function to run as user                                                   // 47  // 169
 * @return {Any} Returns function result                                                               // 48  // 170
 */                                                                                                    // 49  // 171
Meteor.runAsUser = function (userId, f) {                                                              // 50  // 172
  var currentInvocation = DDP._CurrentInvocation.get();                                                // 51  // 173
                                                                                                       // 52  // 174
  // Create a new method invocation                                                                    // 53  // 175
  var invocation = new DDPCommon.MethodInvocation(                                                     // 54  // 176
    (currentInvocation) ? currentInvocation : {                                                        // 55  // 177
      connection: null                                                                                 // 56  // 178
    }                                                                                                  // 57  // 179
  );                                                                                                   // 58  // 180
                                                                                                       // 59  // 181
  // Now run as user on this invocation                                                                // 60  // 182
  invocation.setUserId(userId);                                                                        // 61  // 183
                                                                                                       // 62  // 184
  return DDP._CurrentInvocation.withValue(invocation, function () {                                    // 63  // 185
    return f.apply(invocation, [userId]);                                                              // 64  // 186
  });                                                                                                  // 65  // 187
};                                                                                                     // 66  // 188
                                                                                                       // 67  // 189
/**                                                                                                    // 68  // 190
 * Run as restricted user                                                                              // 69  // 191
 * @param  {Function} f Function to run unrestricted                                                   // 70  // 192
 * @return {Any}   Returns function result                                                             // 71  // 193
 */                                                                                                    // 72  // 194
Meteor.runAsRestrictedUser = function(userId, f) {                                                     // 73  // 195
  return Meteor.runRestricted(function() {                                                             // 74  // 196
    return Meteor.runAsUser(userId, f);                                                                // 75  // 197
  });                                                                                                  // 76  // 198
};                                                                                                     // 77  // 199
                                                                                                       // 78  // 200
var adminMode = new Meteor.EnvironmentVariable();                                                      // 79  // 201
                                                                                                       // 80  // 202
/**                                                                                                    // 81  // 203
 * Check if code is running isside an invocation / method                                              // 82  // 204
 */                                                                                                    // 83  // 205
Meteor.isAdmin = function() {                                                                          // 84  // 206
  return !!adminMode.get();                                                                            // 85  // 207
};                                                                                                     // 86  // 208
                                                                                                       // 87  // 209
/**                                                                                                    // 88  // 210
 * Make the function run outside invocation                                                            // 89  // 211
 */                                                                                                    // 90  // 212
Meteor.runAsAdmin = function(f) {                                                                      // 91  // 213
  if (Meteor.isAdmin()) {                                                                              // 92  // 214
    return f();                                                                                        // 93  // 215
  } else {                                                                                             // 94  // 216
    return adminMode.withValue(false, f);                                                              // 95  // 217
  }                                                                                                    // 96  // 218
};                                                                                                     // 97  // 219
                                                                                                       // 98  // 220
/**                                                                                                    // 99  // 221
 * Make sure code runs outside an invocation on the                                                    // 100
 * server                                                                                              // 101
 */                                                                                                    // 102
Meteor.runOutsideInvocation = function(f) {                                                            // 103
  if (Meteor.isServer && DDP._CurrentInvocation.get()) {                                               // 104
    DDP._CurrentInvocation.withValue(null, f);                                                         // 105
  } else {                                                                                             // 106
    f();                                                                                               // 107
  }                                                                                                    // 108
};                                                                                                     // 109
                                                                                                       // 110
/////////////////////////////////////////////////////////////////////////////////////////////////////////     // 233
                                                                                                              // 234
}).call(this);                                                                                                // 235
                                                                                                              // 236
                                                                                                              // 237
                                                                                                              // 238
                                                                                                              // 239
                                                                                                              // 240
                                                                                                              // 241
(function () {                                                                                                // 242
                                                                                                              // 243
/////////////////////////////////////////////////////////////////////////////////////////////////////////     // 244
//                                                                                                     //     // 245
// packages/dispatch:run-as-user/lib/collection.overwrites.js                                          //     // 246
//                                                                                                     //     // 247
/////////////////////////////////////////////////////////////////////////////////////////////////////////     // 248
                                                                                                       //     // 249
// This file overwrites the default metoer Mongo.Collection modifiers: "insert",                       // 1   // 250
// "update", "remove"                                                                                  // 2   // 251
//                                                                                                     // 3   // 252
// The new methods are checking if Meteor is in "restricted" mode to apply                             // 4   // 253
// allow and deny rules if needed.                                                                     // 5   // 254
//                                                                                                     // 6   // 255
// This will allow us to run the modifiers inside of a "Meteor.runAsUser" with                         // 7   // 256
// security checks.                                                                                    // 8   // 257
_.each(['insert', 'update', 'remove'], function (method) {                                             // 9   // 258
                                                                                                       // 10  // 259
  var _super = Mongo.Collection.prototype[method];                                                     // 11  // 260
                                                                                                       // 12  // 261
  Mongo.Collection.prototype[method] = function ( /* arguments */ ) {                                  // 13  // 262
    var self = this;                                                                                   // 14  // 263
    var args = _.toArray(arguments);                                                                   // 15  // 264
                                                                                                       // 16  // 265
    // Check if this method is run in restricted mode and collection is                                // 17  // 266
    // restricted.                                                                                     // 18  // 267
    if (Meteor.isRestricted() && self._restricted) {                                                   // 19  // 268
                                                                                                       // 20  // 269
      var generatedId = null;                                                                          // 21  // 270
      if (method === 'insert' && !_.has(args[0], '_id')) {                                             // 22  // 271
        generatedId = self._makeNewID();                                                               // 23  // 272
      }                                                                                                // 24  // 273
                                                                                                       // 25  // 274
      // short circuit if there is no way it will pass.                                                // 26  // 275
      if (self._validators[method].allow.length === 0) {                                               // 27  // 276
        throw new Meteor.Error(                                                                        // 28  // 277
          403, 'Access denied. No allow validators set on restricted ' +                               // 29  // 278
          'collection for method \'' + method + '\'.');                                                // 30  // 279
      }                                                                                                // 31  // 280
                                                                                                       // 32  // 281
      var validatedMethodName =                                                                        // 33  // 282
        '_validated' + method.charAt(0).toUpperCase() + method.slice(1);                               // 34  // 283
      args.unshift(Meteor.userId());                                                                   // 35  // 284
                                                                                                       // 36  // 285
      if (method === 'insert') {                                                                       // 37  // 286
        args.push(generatedId);                                                                        // 38  // 287
                                                                                                       // 39  // 288
        self[validatedMethodName].apply(self, args);                                                   // 40  // 289
        // xxx: for now we return the id since self._validatedInsert doesn't                           // 41  // 290
        // yet return the new id                                                                       // 42  // 291
        return generatedId || args[0]._id;                                                             // 43  // 292
                                                                                                       // 44  // 293
      }                                                                                                // 45  // 294
                                                                                                       // 46  // 295
      return self[validatedMethodName].apply(self, args);                                              // 47  // 296
                                                                                                       // 48  // 297
    }                                                                                                  // 49  // 298
                                                                                                       // 50  // 299
    return _super.apply(self, args);                                                                   // 51  // 300
  };                                                                                                   // 52  // 301
                                                                                                       // 53  // 302
});                                                                                                    // 54  // 303
                                                                                                       // 55  // 304
/////////////////////////////////////////////////////////////////////////////////////////////////////////     // 305
                                                                                                              // 306
}).call(this);                                                                                                // 307
                                                                                                              // 308
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['dispatch:run-as-user'] = {};

})();

//# sourceMappingURL=dispatch_run-as-user.js.map
