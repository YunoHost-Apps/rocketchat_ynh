(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var DDPCommon = Package['ddp-common'].DDPCommon;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var EV, self, Streamer;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_streamer/lib/ev.js                                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/* globals EV:true */                                                                                               //
/* exported EV */                                                                                                   //
                                                                                                                    //
EV = (function () {                                                                                                 // 4
	function EV() {                                                                                                    // 5
		babelHelpers.classCallCheck(this, EV);                                                                            //
                                                                                                                    //
		this.handlers = {};                                                                                               // 6
	}                                                                                                                  //
                                                                                                                    //
	EV.prototype.emit = (function () {                                                                                 // 4
		function emit(event) {                                                                                            // 9
			var _this = this;                                                                                                //
                                                                                                                    //
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {        //
				args[_key - 1] = arguments[_key];                                                                               // 9
			}                                                                                                                //
                                                                                                                    //
			if (this.handlers[event]) {                                                                                      // 10
				this.handlers[event].forEach(function (handler) {                                                               // 11
					return handler.apply(_this, args);                                                                             //
				});                                                                                                             //
			}                                                                                                                //
		}                                                                                                                 //
                                                                                                                    //
		return emit;                                                                                                      //
	})();                                                                                                              //
                                                                                                                    //
	EV.prototype.emitWithScope = (function () {                                                                        // 4
		function emitWithScope(event, scope) {                                                                            // 15
			for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
				args[_key2 - 2] = arguments[_key2];                                                                             // 15
			}                                                                                                                //
                                                                                                                    //
			if (this.handlers[event]) {                                                                                      // 16
				this.handlers[event].forEach(function (handler) {                                                               // 17
					return handler.apply(scope, args);                                                                             //
				});                                                                                                             //
			}                                                                                                                //
		}                                                                                                                 //
                                                                                                                    //
		return emitWithScope;                                                                                             //
	})();                                                                                                              //
                                                                                                                    //
	EV.prototype.on = (function () {                                                                                   // 4
		function on(event, callback) {                                                                                    // 21
			if (!this.handlers[event]) {                                                                                     // 22
				this.handlers[event] = [];                                                                                      // 23
			}                                                                                                                //
			this.handlers[event].push(callback);                                                                             // 25
		}                                                                                                                 //
                                                                                                                    //
		return on;                                                                                                        //
	})();                                                                                                              //
                                                                                                                    //
	EV.prototype.once = (function () {                                                                                 // 4
		function once(event, callback) {                                                                                  // 28
			self = this;                                                                                                     // 29
			self.on(event, (function () {                                                                                    // 30
				function onetimeCallback() {                                                                                    // 30
					callback.apply(this, arguments);                                                                               // 31
					self.removeListener(event, onetimeCallback);                                                                   // 32
				}                                                                                                               //
                                                                                                                    //
				return onetimeCallback;                                                                                         //
			})());                                                                                                           //
		}                                                                                                                 //
                                                                                                                    //
		return once;                                                                                                      //
	})();                                                                                                              //
                                                                                                                    //
	EV.prototype.removeListener = (function () {                                                                       // 4
		function removeListener(event, callback) {                                                                        // 36
			if (this.handlers[event]) {                                                                                      // 37
				var index = this.handlers[event].indexOf(callback);                                                             // 38
				if (index > -1) {                                                                                               // 39
					this.handlers[event].splice(index, 1);                                                                         // 40
				}                                                                                                               //
			}                                                                                                                //
		}                                                                                                                 //
                                                                                                                    //
		return removeListener;                                                                                            //
	})();                                                                                                              //
                                                                                                                    //
	EV.prototype.removeAllListeners = (function () {                                                                   // 4
		function removeAllListeners(event) {                                                                              // 45
			this.handlers[event] = undefined;                                                                                // 46
		}                                                                                                                 //
                                                                                                                    //
		return removeAllListeners;                                                                                        //
	})();                                                                                                              //
                                                                                                                    //
	return EV;                                                                                                         //
})();                                                                                                               //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_streamer/server/server.js                                                                    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/* globals EV */                                                                                                    //
                                                                                                                    //
var StreamerCentral = (function (_EV) {                                                                             //
	babelHelpers.inherits(StreamerCentral, _EV);                                                                       //
                                                                                                                    //
	function StreamerCentral() {                                                                                       // 4
		babelHelpers.classCallCheck(this, StreamerCentral);                                                               //
                                                                                                                    //
		_EV.call(this);                                                                                                   // 5
                                                                                                                    //
		this.instances = {};                                                                                              // 7
	}                                                                                                                  //
                                                                                                                    //
	return StreamerCentral;                                                                                            //
})(EV);                                                                                                             //
                                                                                                                    //
Meteor.StreamerCentral = new StreamerCentral();                                                                     // 11
                                                                                                                    //
Meteor.Streamer = (function (_EV2) {                                                                                // 14
	babelHelpers.inherits(Streamer, _EV2);                                                                             //
                                                                                                                    //
	function Streamer(name) {                                                                                          // 15
		var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];                               //
                                                                                                                    //
		var _ref$retransmit = _ref.retransmit;                                                                            //
		var retransmit = _ref$retransmit === undefined ? true : _ref$retransmit;                                          //
		var _ref$retransmitToSelf = _ref.retransmitToSelf;                                                                //
		var retransmitToSelf = _ref$retransmitToSelf === undefined ? false : _ref$retransmitToSelf;                       //
		babelHelpers.classCallCheck(this, Streamer);                                                                      //
                                                                                                                    //
		if (Meteor.StreamerCentral.instances[name]) {                                                                     // 16
			console.warn('Streamer instance already exists:', name);                                                         // 17
			return Meteor.StreamerCentral.instances[name];                                                                   // 18
		}                                                                                                                 //
                                                                                                                    //
		_EV2.call(this);                                                                                                  // 21
                                                                                                                    //
		Meteor.StreamerCentral.instances[name] = this;                                                                    // 23
                                                                                                                    //
		this.name = name;                                                                                                 // 25
		this.retransmit = retransmit;                                                                                     // 26
		this.retransmitToSelf = retransmitToSelf;                                                                         // 27
                                                                                                                    //
		this.subscriptions = [];                                                                                          // 29
		this.subscriptionsByEventName = {};                                                                               // 30
		this.transformers = {};                                                                                           // 31
                                                                                                                    //
		this.iniPublication();                                                                                            // 33
		this.initMethod();                                                                                                // 34
                                                                                                                    //
		this._allowRead = {};                                                                                             // 36
		this._allowWrite = {};                                                                                            // 37
                                                                                                                    //
		this.allowRead('none');                                                                                           // 39
		this.allowWrite('none');                                                                                          // 40
	}                                                                                                                  //
                                                                                                                    //
	Streamer.prototype.allowRead = (function () {                                                                      // 14
		function allowRead(eventName, fn) {                                                                               // 74
			if (fn === undefined) {                                                                                          // 75
				fn = eventName;                                                                                                 // 76
				eventName = '__all__';                                                                                          // 77
			}                                                                                                                //
                                                                                                                    //
			if (typeof fn === 'function') {                                                                                  // 80
				return this._allowRead[eventName] = fn;                                                                         // 81
			}                                                                                                                //
                                                                                                                    //
			if (typeof fn === 'string' && ['all', 'none', 'logged'].indexOf(fn) === -1) {                                    // 84
				console.error('allowRead shortcut \'' + fn + '\' is invalid');                                                  // 85
			}                                                                                                                //
                                                                                                                    //
			if (fn === 'all' || fn === true) {                                                                               // 88
				return this._allowRead[eventName] = function () {                                                               // 89
					return true;                                                                                                   // 89
				};                                                                                                              //
			}                                                                                                                //
                                                                                                                    //
			if (fn === 'none' || fn === false) {                                                                             // 92
				return this._allowRead[eventName] = function () {                                                               // 93
					return false;                                                                                                  // 93
				};                                                                                                              //
			}                                                                                                                //
                                                                                                                    //
			if (fn === 'logged') {                                                                                           // 96
				return this._allowRead[eventName] = function () {                                                               // 97
					return Boolean(this.userId);                                                                                   // 97
				};                                                                                                              //
			}                                                                                                                //
		}                                                                                                                 //
                                                                                                                    //
		return allowRead;                                                                                                 //
	})();                                                                                                              //
                                                                                                                    //
	Streamer.prototype.allowWrite = (function () {                                                                     // 14
		function allowWrite(eventName, fn) {                                                                              // 101
			if (fn === undefined) {                                                                                          // 102
				fn = eventName;                                                                                                 // 103
				eventName = '__all__';                                                                                          // 104
			}                                                                                                                //
                                                                                                                    //
			if (typeof fn === 'function') {                                                                                  // 107
				return this._allowWrite[eventName] = fn;                                                                        // 108
			}                                                                                                                //
                                                                                                                    //
			if (typeof fn === 'string' && ['all', 'none', 'logged'].indexOf(fn) === -1) {                                    // 111
				console.error('allowWrite shortcut \'' + fn + '\' is invalid');                                                 // 112
			}                                                                                                                //
                                                                                                                    //
			if (fn === 'all' || fn === true) {                                                                               // 115
				return this._allowWrite[eventName] = function () {                                                              // 116
					return true;                                                                                                   // 116
				};                                                                                                              //
			}                                                                                                                //
                                                                                                                    //
			if (fn === 'none' || fn === false) {                                                                             // 119
				return this._allowWrite[eventName] = function () {                                                              // 120
					return false;                                                                                                  // 120
				};                                                                                                              //
			}                                                                                                                //
                                                                                                                    //
			if (fn === 'logged') {                                                                                           // 123
				return this._allowWrite[eventName] = function () {                                                              // 124
					return Boolean(this.userId);                                                                                   // 124
				};                                                                                                              //
			}                                                                                                                //
		}                                                                                                                 //
                                                                                                                    //
		return allowWrite;                                                                                                //
	})();                                                                                                              //
                                                                                                                    //
	Streamer.prototype.isReadAllowed = (function () {                                                                  // 14
		function isReadAllowed(scope, eventName) {                                                                        // 128
			if (this._allowRead[eventName]) {                                                                                // 129
				return this._allowRead[eventName].call(scope, eventName);                                                       // 130
			}                                                                                                                //
                                                                                                                    //
			return this._allowRead['__all__'].call(scope, eventName);                                                        // 133
		}                                                                                                                 //
                                                                                                                    //
		return isReadAllowed;                                                                                             //
	})();                                                                                                              //
                                                                                                                    //
	Streamer.prototype.isWriteAllowed = (function () {                                                                 // 14
		function isWriteAllowed(scope, eventName, args) {                                                                 // 136
			var _allowWrite$__all__;                                                                                         //
                                                                                                                    //
			if (this._allowWrite[eventName]) {                                                                               // 137
				var _allowWrite$eventName;                                                                                      //
                                                                                                                    //
				return (_allowWrite$eventName = this._allowWrite[eventName]).call.apply(_allowWrite$eventName, [scope, eventName].concat(args));
			}                                                                                                                //
                                                                                                                    //
			return (_allowWrite$__all__ = this._allowWrite['__all__']).call.apply(_allowWrite$__all__, [scope, eventName].concat(args));
		}                                                                                                                 //
                                                                                                                    //
		return isWriteAllowed;                                                                                            //
	})();                                                                                                              //
                                                                                                                    //
	Streamer.prototype.addSubscription = (function () {                                                                // 14
		function addSubscription(subscription, eventName) {                                                               // 144
			this.subscriptions.push(subscription);                                                                           // 145
                                                                                                                    //
			if (!this.subscriptionsByEventName[eventName]) {                                                                 // 147
				this.subscriptionsByEventName[eventName] = [];                                                                  // 148
			}                                                                                                                //
                                                                                                                    //
			this.subscriptionsByEventName[eventName].push(subscription);                                                     // 151
		}                                                                                                                 //
                                                                                                                    //
		return addSubscription;                                                                                           //
	})();                                                                                                              //
                                                                                                                    //
	Streamer.prototype.removeSubscription = (function () {                                                             // 14
		function removeSubscription(subscription, eventName) {                                                            // 154
			var index = this.subscriptions.indexOf(subscription);                                                            // 155
			if (index > -1) {                                                                                                // 156
				this.subscriptions.splice(index, 1);                                                                            // 157
			}                                                                                                                //
                                                                                                                    //
			if (this.subscriptionsByEventName[eventName]) {                                                                  // 160
				var _index = this.subscriptionsByEventName[eventName].indexOf(subscription);                                    // 161
				if (_index > -1) {                                                                                              // 162
					this.subscriptionsByEventName[eventName].splice(_index, 1);                                                    // 163
				}                                                                                                               //
			}                                                                                                                //
		}                                                                                                                 //
                                                                                                                    //
		return removeSubscription;                                                                                        //
	})();                                                                                                              //
                                                                                                                    //
	Streamer.prototype.transform = (function () {                                                                      // 14
		function transform(eventName, fn) {                                                                               // 168
			if (typeof eventName === 'function') {                                                                           // 169
				fn = eventName;                                                                                                 // 170
				eventName = '__all__';                                                                                          // 171
			}                                                                                                                //
                                                                                                                    //
			if (!this.transformers[eventName]) {                                                                             // 174
				this.transformers[eventName] = [];                                                                              // 175
			}                                                                                                                //
                                                                                                                    //
			this.transformers[eventName].push(fn);                                                                           // 178
		}                                                                                                                 //
                                                                                                                    //
		return transform;                                                                                                 //
	})();                                                                                                              //
                                                                                                                    //
	Streamer.prototype.applyTransformers = (function () {                                                              // 14
		function applyTransformers(methodScope, eventName, args) {                                                        // 181
			if (this.transformers['__all__']) {                                                                              // 182
				this.transformers['__all__'].forEach(function (transform) {                                                     // 183
					args = transform.call(methodScope, eventName, args);                                                           // 184
					methodScope.tranformed = true;                                                                                 // 185
					if (!Array.isArray(args)) {                                                                                    // 186
						args = [args];                                                                                                // 187
					}                                                                                                              //
				});                                                                                                             //
			}                                                                                                                //
                                                                                                                    //
			if (this.transformers[eventName]) {                                                                              // 192
				this.transformers[eventName].forEach(function (transform) {                                                     // 193
					args = transform.call.apply(transform, [methodScope].concat(args));                                            // 194
					methodScope.tranformed = true;                                                                                 // 195
					if (!Array.isArray(args)) {                                                                                    // 196
						args = [args];                                                                                                // 197
					}                                                                                                              //
				});                                                                                                             //
			}                                                                                                                //
                                                                                                                    //
			return args;                                                                                                     // 202
		}                                                                                                                 //
                                                                                                                    //
		return applyTransformers;                                                                                         //
	})();                                                                                                              //
                                                                                                                    //
	Streamer.prototype.iniPublication = (function () {                                                                 // 14
		function iniPublication() {                                                                                       // 205
			var stream = this;                                                                                               // 206
			Meteor.publish(this.subscriptionName, function (eventName, useCollection) {                                      // 207
				if (typeof eventName !== 'string' || eventName.length === 0) {                                                  // 208
					this.stop();                                                                                                   // 209
					return;                                                                                                        // 210
				}                                                                                                               //
                                                                                                                    //
				if (stream.isReadAllowed(this, eventName) !== true) {                                                           // 213
					this.stop();                                                                                                   // 214
					return;                                                                                                        // 215
				}                                                                                                               //
                                                                                                                    //
				var subscription = {                                                                                            // 218
					subscription: this,                                                                                            // 219
					eventName: eventName                                                                                           // 220
				};                                                                                                              //
                                                                                                                    //
				stream.addSubscription(subscription, eventName);                                                                // 223
                                                                                                                    //
				this.onStop(function () {                                                                                       // 225
					stream.removeSubscription(subscription, eventName);                                                            // 226
				});                                                                                                             //
                                                                                                                    //
				if (useCollection === true) {                                                                                   // 229
					// Collection compatibility                                                                                    //
					this._session.sendAdded(stream.subscriptionName, 'id', {                                                       // 231
						eventName: eventName                                                                                          // 232
					});                                                                                                            //
				}                                                                                                               //
                                                                                                                    //
				this.ready();                                                                                                   // 236
			});                                                                                                              //
		}                                                                                                                 //
                                                                                                                    //
		return iniPublication;                                                                                            //
	})();                                                                                                              //
                                                                                                                    //
	Streamer.prototype.initMethod = (function () {                                                                     // 14
		function initMethod() {                                                                                           // 240
			var _this = this;                                                                                                //
                                                                                                                    //
			var stream = this;                                                                                               // 241
			var method = {};                                                                                                 // 242
                                                                                                                    //
			method[this.subscriptionName] = function (eventName) {                                                           // 244
				var _EV2$prototype$emitWithScope;                                                                               //
                                                                                                                    //
				for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {       //
					args[_key - 1] = arguments[_key];                                                                              // 244
				}                                                                                                               //
                                                                                                                    //
				this.unblock();                                                                                                 // 245
                                                                                                                    //
				if (stream.isWriteAllowed(this, eventName, args) !== true) {                                                    // 247
					return;                                                                                                        // 248
				}                                                                                                               //
                                                                                                                    //
				var methodScope = {                                                                                             // 251
					userId: this.userId,                                                                                           // 252
					connection: this.connection,                                                                                   // 253
					originalParams: args,                                                                                          // 254
					tranformed: false                                                                                              // 255
				};                                                                                                              //
                                                                                                                    //
				args = stream.applyTransformers(methodScope, eventName, args);                                                  // 258
                                                                                                                    //
				(_EV2$prototype$emitWithScope = _EV2.prototype.emitWithScope).call.apply(_EV2$prototype$emitWithScope, [_this, eventName, methodScope].concat(args));
                                                                                                                    //
				if (stream.retransmit === true) {                                                                               // 262
					stream._emit(eventName, args, this.connection, true);                                                          // 263
				}                                                                                                               //
			};                                                                                                               //
                                                                                                                    //
			try {                                                                                                            // 267
				Meteor.methods(method);                                                                                         // 268
			} catch (e) {                                                                                                    //
				console.error(e);                                                                                               // 270
			}                                                                                                                //
		}                                                                                                                 //
                                                                                                                    //
		return initMethod;                                                                                                //
	})();                                                                                                              //
                                                                                                                    //
	Streamer.prototype._emit = (function () {                                                                          // 14
		function _emit(eventName, args, origin, broadcast) {                                                              // 274
			var _this2 = this;                                                                                               //
                                                                                                                    //
			if (broadcast === true) {                                                                                        // 275
				Meteor.StreamerCentral.emit('broadcast', this.name, eventName, args);                                           // 276
			}                                                                                                                //
                                                                                                                    //
			var subscriptions = this.subscriptionsByEventName[eventName];                                                    // 279
			if (!Array.isArray(subscriptions)) {                                                                             // 280
				return;                                                                                                         // 281
			}                                                                                                                //
                                                                                                                    //
			subscriptions.forEach(function (subscription) {                                                                  // 284
				if (_this2.retransmitToSelf === false && origin && origin === subscription.subscription.connection) {           // 285
					return;                                                                                                        // 286
				}                                                                                                               //
                                                                                                                    //
				subscription.subscription._session.sendChanged(_this2.subscriptionName, 'id', {                                 // 289
					eventName: eventName,                                                                                          // 290
					args: args                                                                                                     // 291
				});                                                                                                             //
			});                                                                                                              //
		}                                                                                                                 //
                                                                                                                    //
		return _emit;                                                                                                     //
	})();                                                                                                              //
                                                                                                                    //
	Streamer.prototype.emit = (function () {                                                                           // 14
		function emit(eventName) {                                                                                        // 296
			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];                                                                             // 296
			}                                                                                                                //
                                                                                                                    //
			this._emit(eventName, args, undefined, true);                                                                    // 297
		}                                                                                                                 //
                                                                                                                    //
		return emit;                                                                                                      //
	})();                                                                                                              //
                                                                                                                    //
	Streamer.prototype.emitWithoutBroadcast = (function () {                                                           // 14
		function emitWithoutBroadcast(eventName) {                                                                        // 300
			for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
				args[_key3 - 1] = arguments[_key3];                                                                             // 300
			}                                                                                                                //
                                                                                                                    //
			this._emit(eventName, args, undefined, false);                                                                   // 301
		}                                                                                                                 //
                                                                                                                    //
		return emitWithoutBroadcast;                                                                                      //
	})();                                                                                                              //
                                                                                                                    //
	babelHelpers.createClass(Streamer, [{                                                                              //
		key: 'name',                                                                                                      //
		get: function () {                                                                                                //
			return this._name;                                                                                               // 44
		},                                                                                                                //
		set: function (name) {                                                                                            //
			check(name, String);                                                                                             // 48
			this._name = name;                                                                                               // 49
		}                                                                                                                 //
	}, {                                                                                                               //
		key: 'subscriptionName',                                                                                          //
		get: function () {                                                                                                //
			return 'stream-' + this.name;                                                                                    // 53
		}                                                                                                                 //
	}, {                                                                                                               //
		key: 'retransmit',                                                                                                //
		get: function () {                                                                                                //
			return this._retransmit;                                                                                         // 57
		},                                                                                                                //
		set: function (retransmit) {                                                                                      //
			check(retransmit, Boolean);                                                                                      // 61
			this._retransmit = retransmit;                                                                                   // 62
		}                                                                                                                 //
	}, {                                                                                                               //
		key: 'retransmitToSelf',                                                                                          //
		get: function () {                                                                                                //
			return this._retransmitToSelf;                                                                                   // 66
		},                                                                                                                //
		set: function (retransmitToSelf) {                                                                                //
			check(retransmitToSelf, Boolean);                                                                                // 70
			this._retransmitToSelf = retransmitToSelf;                                                                       // 71
		}                                                                                                                 //
	}]);                                                                                                               //
	return Streamer;                                                                                                   //
})(EV);                                                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:streamer'] = {
  Streamer: Streamer
};

})();

//# sourceMappingURL=rocketchat_streamer.js.map
