(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;

/* Package-scope variables */
var CollectionHooks;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/matb33_collection-hooks/collection-hooks.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Relevant AOP terminology:                                                                                           // 1
// Aspect: User code that runs before/after (hook)                                                                     // 2
// Advice: Wrapper code that knows when to call user code (aspects)                                                    // 3
// Pointcut: before/after                                                                                              // 4
                                                                                                                       // 5
var advices = {};                                                                                                      // 6
var Tracker = Package.tracker && Package.tracker.Tracker || Package.deps.Deps;                                         // 7
var publishUserId = Meteor.isServer && new Meteor.EnvironmentVariable();                                               // 8
                                                                                                                       // 9
CollectionHooks = {                                                                                                    // 10
  defaults: {                                                                                                          // 11
    before: { insert: {}, update: {}, remove: {}, upsert: {}, find: {}, findOne: {}, all: {}},                         // 12
    after: { insert: {}, update: {}, remove: {}, find: {}, findOne: {}, all: {}},                                      // 13
    all: { insert: {}, update: {}, remove: {}, find: {}, findOne: {}, all: {}}                                         // 14
  },                                                                                                                   // 15
  directEnv: new Meteor.EnvironmentVariable(),                                                                         // 16
  directOp: function directOp(func) {                                                                                  // 17
    return this.directEnv.withValue(true, func);                                                                       // 18
  },                                                                                                                   // 19
  hookedOp: function hookedOp(func) {                                                                                  // 20
    return this.directEnv.withValue(false, func);                                                                      // 21
  }                                                                                                                    // 22
};                                                                                                                     // 23
                                                                                                                       // 24
CollectionHooks.getUserId = function getUserId() {                                                                     // 25
  var userId;                                                                                                          // 26
                                                                                                                       // 27
  if (Meteor.isClient) {                                                                                               // 28
    Tracker.nonreactive(function () {                                                                                  // 29
      userId = Meteor.userId && Meteor.userId();                                                                       // 30
    });                                                                                                                // 31
  }                                                                                                                    // 32
                                                                                                                       // 33
  if (Meteor.isServer) {                                                                                               // 34
    try {                                                                                                              // 35
      // Will throw an error unless within method call.                                                                // 36
      // Attempt to recover gracefully by catching:                                                                    // 37
      userId = Meteor.userId && Meteor.userId();                                                                       // 38
    } catch (e) {}                                                                                                     // 39
                                                                                                                       // 40
    if (!userId) {                                                                                                     // 41
      // Get the userId if we are in a publish function.                                                               // 42
      userId = publishUserId.get();                                                                                    // 43
    }                                                                                                                  // 44
  }                                                                                                                    // 45
                                                                                                                       // 46
  return userId;                                                                                                       // 47
};                                                                                                                     // 48
                                                                                                                       // 49
CollectionHooks.extendCollectionInstance = function extendCollectionInstance(self, constructor) {                      // 50
  // Offer a public API to allow the user to define aspects                                                            // 51
  // Example: collection.before.insert(func);                                                                          // 52
  _.each(["before", "after"], function (pointcut) {                                                                    // 53
    _.each(advices, function (advice, method) {                                                                        // 54
      if (advice === "upsert" && pointcut === "after") return;                                                         // 55
                                                                                                                       // 56
      Meteor._ensure(self, pointcut, method);                                                                          // 57
      Meteor._ensure(self, "_hookAspects", method);                                                                    // 58
                                                                                                                       // 59
      self._hookAspects[method][pointcut] = [];                                                                        // 60
      self[pointcut][method] = function (aspect, options) {                                                            // 61
        var len = self._hookAspects[method][pointcut].push({                                                           // 62
          aspect: aspect,                                                                                              // 63
          options: CollectionHooks.initOptions(options, pointcut, method)                                              // 64
        });                                                                                                            // 65
                                                                                                                       // 66
        return {                                                                                                       // 67
          replace: function (aspect, options) {                                                                        // 68
            self._hookAspects[method][pointcut].splice(len - 1, 1, {                                                   // 69
              aspect: aspect,                                                                                          // 70
              options: CollectionHooks.initOptions(options, pointcut, method)                                          // 71
            });                                                                                                        // 72
          },                                                                                                           // 73
          remove: function () {                                                                                        // 74
            self._hookAspects[method][pointcut].splice(len - 1, 1);                                                    // 75
          }                                                                                                            // 76
        };                                                                                                             // 77
      };                                                                                                               // 78
    });                                                                                                                // 79
  });                                                                                                                  // 80
                                                                                                                       // 81
  // Offer a publicly accessible object to allow the user to define                                                    // 82
  // collection-wide hook options.                                                                                     // 83
  // Example: collection.hookOptions.after.update = {fetchPrevious: false};                                            // 84
  self.hookOptions = EJSON.clone(CollectionHooks.defaults);                                                            // 85
                                                                                                                       // 86
  // Wrap mutator methods, letting the defined advice do the work                                                      // 87
  _.each(advices, function (advice, method) {                                                                          // 88
    var collection = Meteor.isClient || method === "upsert" ? self : self._collection;                                 // 89
                                                                                                                       // 90
    // Store a reference to the original mutator method                                                                // 91
    var _super = collection[method];                                                                                   // 92
                                                                                                                       // 93
    Meteor._ensure(self, "direct", method);                                                                            // 94
    self.direct[method] = function () {                                                                                // 95
      var args = arguments;                                                                                            // 96
      return CollectionHooks.directOp(function () {                                                                    // 97
        return constructor.prototype[method].apply(self, args);                                                        // 98
      });                                                                                                              // 99
    };                                                                                                                 // 100
                                                                                                                       // 101
    collection[method] = function () {                                                                                 // 102
      if (CollectionHooks.directEnv.get() === true) {                                                                  // 103
        return _super.apply(collection, arguments);                                                                    // 104
      }                                                                                                                // 105
                                                                                                                       // 106
      // NOTE: should we decide to force `update` with `{upsert:true}` to use                                          // 107
      // the `upsert` hooks, this is what will accomplish it. It's important to                                        // 108
      // realize that Meteor won't distinguish between an `update` and an                                              // 109
      // `insert` though, so we'll end up with `after.update` getting called                                           // 110
      // even on an `insert`. That's why we've chosen to disable this for now.                                         // 111
      // if (method === "update" && _.isObject(arguments[2]) && arguments[2].upsert) {                                 // 112
      //   method = "upsert";                                                                                          // 113
      //   advice = CollectionHooks.getAdvice(method);                                                                 // 114
      // }                                                                                                             // 115
                                                                                                                       // 116
      return advice.call(this,                                                                                         // 117
        CollectionHooks.getUserId(),                                                                                   // 118
        _super,                                                                                                        // 119
        self,                                                                                                          // 120
        method === "upsert" ? {                                                                                        // 121
          insert: self._hookAspects.insert || {},                                                                      // 122
          update: self._hookAspects.update || {},                                                                      // 123
          upsert: self._hookAspects.upsert || {}                                                                       // 124
        } : self._hookAspects[method] || {},                                                                           // 125
        function (doc) {                                                                                               // 126
          return  _.isFunction(self._transform)                                                                        // 127
                  ? function (d) { return self._transform(d || doc); }                                                 // 128
                  : function (d) { return d || doc; };                                                                 // 129
        },                                                                                                             // 130
        _.toArray(arguments),                                                                                          // 131
        false                                                                                                          // 132
      );                                                                                                               // 133
    };                                                                                                                 // 134
  });                                                                                                                  // 135
};                                                                                                                     // 136
                                                                                                                       // 137
CollectionHooks.defineAdvice = function defineAdvice(method, advice) {                                                 // 138
  advices[method] = advice;                                                                                            // 139
};                                                                                                                     // 140
                                                                                                                       // 141
CollectionHooks.getAdvice = function getAdvice(method) {                                                               // 142
  return advices[method];                                                                                              // 143
};                                                                                                                     // 144
                                                                                                                       // 145
CollectionHooks.initOptions = function initOptions(options, pointcut, method) {                                        // 146
  return CollectionHooks.extendOptions(CollectionHooks.defaults, options, pointcut, method);                           // 147
};                                                                                                                     // 148
                                                                                                                       // 149
CollectionHooks.extendOptions = function extendOptions(source, options, pointcut, method) {                            // 150
  options = _.extend(options || {}, source.all.all);                                                                   // 151
  options = _.extend(options, source[pointcut].all);                                                                   // 152
  options = _.extend(options, source.all[method]);                                                                     // 153
  options = _.extend(options, source[pointcut][method]);                                                               // 154
  return options;                                                                                                      // 155
};                                                                                                                     // 156
                                                                                                                       // 157
CollectionHooks.getDocs = function getDocs(collection, selector, options) {                                            // 158
  var self = this;                                                                                                     // 159
                                                                                                                       // 160
  var findOptions = {transform: null, reactive: false}; // added reactive: false                                       // 161
                                                                                                                       // 162
  /*                                                                                                                   // 163
  // No "fetch" support at this time.                                                                                  // 164
  if (!self._validators.fetchAllFields) {                                                                              // 165
    findOptions.fields = {};                                                                                           // 166
    _.each(self._validators.fetch, function(fieldName) {                                                               // 167
      findOptions.fields[fieldName] = 1;                                                                               // 168
    });                                                                                                                // 169
  }                                                                                                                    // 170
  */                                                                                                                   // 171
                                                                                                                       // 172
  // Bit of a magic condition here... only "update" passes options, so this is                                         // 173
  // only relevant to when update calls getDocs:                                                                       // 174
  if (options) {                                                                                                       // 175
    // This was added because in our case, we are potentially iterating over                                           // 176
    // multiple docs. If multi isn't enabled, force a limit (almost like                                               // 177
    // findOne), as the default for update without multi enabled is to affect                                          // 178
    // only the first matched document:                                                                                // 179
    if (!options.multi) {                                                                                              // 180
      findOptions.limit = 1;                                                                                           // 181
    }                                                                                                                  // 182
  }                                                                                                                    // 183
                                                                                                                       // 184
  // Unlike validators, we iterate over multiple docs, so use                                                          // 185
  // find instead of findOne:                                                                                          // 186
  return collection.find(selector, findOptions);                                                                       // 187
};                                                                                                                     // 188
                                                                                                                       // 189
// This function contains a snippet of code pulled and modified from:                                                  // 190
// ~/.meteor/packages/mongo-livedata/collection.js                                                                     // 191
// It's contained in these utility functions to make updates easier for us in                                          // 192
// case this code changes.                                                                                             // 193
CollectionHooks.getFields = function getFields(mutator) {                                                              // 194
  // compute modified fields                                                                                           // 195
  var fields = [];                                                                                                     // 196
                                                                                                                       // 197
  _.each(mutator, function (params, op) {                                                                              // 198
    //====ADDED START=======================                                                                           // 199
    if (_.contains(["$set", "$unset", "$inc", "$push", "$pull", "$pop", "$rename", "$pullAll", "$addToSet", "$bit"], op)) {
    //====ADDED END=========================                                                                           // 201
      _.each(_.keys(params), function (field) {                                                                        // 202
        // treat dotted fields as if they are replacing their                                                          // 203
        // top-level part                                                                                              // 204
        if (field.indexOf('.') !== -1)                                                                                 // 205
          field = field.substring(0, field.indexOf('.'));                                                              // 206
                                                                                                                       // 207
        // record the field we are trying to change                                                                    // 208
        if (!_.contains(fields, field))                                                                                // 209
          fields.push(field);                                                                                          // 210
      });                                                                                                              // 211
    //====ADDED START=======================                                                                           // 212
    } else {                                                                                                           // 213
      fields.push(op);                                                                                                 // 214
    }                                                                                                                  // 215
    //====ADDED END=========================                                                                           // 216
  });                                                                                                                  // 217
                                                                                                                       // 218
  return fields;                                                                                                       // 219
};                                                                                                                     // 220
                                                                                                                       // 221
CollectionHooks.reassignPrototype = function reassignPrototype(instance, constr) {                                     // 222
  var hasSetPrototypeOf = typeof Object.setPrototypeOf === "function";                                                 // 223
                                                                                                                       // 224
  if (!constr) constr = typeof Mongo !== "undefined" ? Mongo.Collection : Meteor.Collection;                           // 225
                                                                                                                       // 226
  // __proto__ is not available in < IE11                                                                              // 227
  // Note: Assigning a prototype dynamically has performance implications                                              // 228
  if (hasSetPrototypeOf) {                                                                                             // 229
    Object.setPrototypeOf(instance, constr.prototype);                                                                 // 230
  } else if (instance.__proto__) {                                                                                     // 231
    instance.__proto__ = constr.prototype;                                                                             // 232
  }                                                                                                                    // 233
};                                                                                                                     // 234
                                                                                                                       // 235
CollectionHooks.wrapCollection = function wrapCollection(ns, as) {                                                     // 236
  if (!as._CollectionConstructor) as._CollectionConstructor = as.Collection;                                           // 237
  if (!as._CollectionPrototype) as._CollectionPrototype = new as.Collection(null);                                     // 238
                                                                                                                       // 239
  var constructor = as._CollectionConstructor;                                                                         // 240
  var proto = as._CollectionPrototype;                                                                                 // 241
                                                                                                                       // 242
  ns.Collection = function () {                                                                                        // 243
    var ret = constructor.apply(this, arguments);                                                                      // 244
    CollectionHooks.extendCollectionInstance(this, constructor);                                                       // 245
    return ret;                                                                                                        // 246
  };                                                                                                                   // 247
                                                                                                                       // 248
  ns.Collection.prototype = proto;                                                                                     // 249
  ns.Collection.prototype.constructor = ns.Collection;                                                                 // 250
                                                                                                                       // 251
  for (var prop in constructor) {                                                                                      // 252
    if (constructor.hasOwnProperty(prop)) {                                                                            // 253
      ns.Collection[prop] = constructor[prop];                                                                         // 254
    }                                                                                                                  // 255
  }                                                                                                                    // 256
};                                                                                                                     // 257
                                                                                                                       // 258
CollectionHooks.modify = LocalCollection._modify;                                                                      // 259
                                                                                                                       // 260
if (typeof Mongo !== "undefined") {                                                                                    // 261
  CollectionHooks.wrapCollection(Meteor, Mongo);                                                                       // 262
  CollectionHooks.wrapCollection(Mongo, Mongo);                                                                        // 263
} else {                                                                                                               // 264
  CollectionHooks.wrapCollection(Meteor, Meteor);                                                                      // 265
}                                                                                                                      // 266
                                                                                                                       // 267
if (Meteor.isServer) {                                                                                                 // 268
  var _publish = Meteor.publish;                                                                                       // 269
  Meteor.publish = function (name, func) {                                                                             // 270
    return _publish.call(this, name, function () {                                                                     // 271
      // This function is called repeatedly in publications                                                            // 272
      var ctx = this, args = arguments;                                                                                // 273
      return publishUserId.withValue(ctx && ctx.userId, function () {                                                  // 274
        return func.apply(ctx, args);                                                                                  // 275
      });                                                                                                              // 276
    });                                                                                                                // 277
  };                                                                                                                   // 278
                                                                                                                       // 279
  // Make the above available for packages with hooks that want to determine                                           // 280
  // whether they are running inside a publish function or not.                                                        // 281
  CollectionHooks.isWithinPublish = function isWithinPublish() {                                                       // 282
    return publishUserId.get() !== undefined;                                                                          // 283
  };                                                                                                                   // 284
}                                                                                                                      // 285
                                                                                                                       // 286
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/matb33_collection-hooks/insert.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
CollectionHooks.defineAdvice("insert", function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
  var self = this;                                                                                                     // 2
  var ctx = {context: self, _super: _super, args: args};                                                               // 3
  var callback = _.last(args);                                                                                         // 4
  var async = _.isFunction(callback);                                                                                  // 5
  var abort, ret;                                                                                                      // 6
                                                                                                                       // 7
  // args[0] : doc                                                                                                     // 8
  // args[1] : callback                                                                                                // 9
                                                                                                                       // 10
  // before                                                                                                            // 11
  if (!suppressAspects) {                                                                                              // 12
    try {                                                                                                              // 13
      _.each(aspects.before, function (o) {                                                                            // 14
        var r = o.aspect.call(_.extend({transform: getTransform(args[0])}, ctx), userId, args[0]);                     // 15
        if (r === false) abort = true;                                                                                 // 16
      });                                                                                                              // 17
                                                                                                                       // 18
      if (abort) return false;                                                                                         // 19
    } catch (e) {                                                                                                      // 20
      if (async) return callback.call(self, e);                                                                        // 21
      throw e;                                                                                                         // 22
    }                                                                                                                  // 23
  }                                                                                                                    // 24
                                                                                                                       // 25
  function after(id, err) {                                                                                            // 26
    var doc = args[0];                                                                                                 // 27
    if (id) {                                                                                                          // 28
      doc = EJSON.clone(args[0]);                                                                                      // 29
      doc._id = id;                                                                                                    // 30
    }                                                                                                                  // 31
    if (!suppressAspects) {                                                                                            // 32
      var lctx = _.extend({transform: getTransform(doc), _id: id, err: err}, ctx);                                     // 33
      _.each(aspects.after, function (o) {                                                                             // 34
        o.aspect.call(lctx, userId, doc);                                                                              // 35
      });                                                                                                              // 36
    }                                                                                                                  // 37
    return id;                                                                                                         // 38
  }                                                                                                                    // 39
                                                                                                                       // 40
  if (async) {                                                                                                         // 41
    args[args.length - 1] = function (err, obj) {                                                                      // 42
      after(obj && obj[0] && obj[0]._id || obj, err);                                                                  // 43
      return callback.apply(this, arguments);                                                                          // 44
    };                                                                                                                 // 45
    return _super.apply(self, args);                                                                                   // 46
  } else {                                                                                                             // 47
    ret = _super.apply(self, args);                                                                                    // 48
    return after(ret && ret[0] && ret[0]._id || ret);                                                                  // 49
  }                                                                                                                    // 50
});                                                                                                                    // 51
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/matb33_collection-hooks/update.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
CollectionHooks.defineAdvice("update", function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
  var self = this;                                                                                                     // 2
  var ctx = {context: self, _super: _super, args: args};                                                               // 3
  var callback = _.last(args);                                                                                         // 4
  var async = _.isFunction(callback);                                                                                  // 5
  var docs, docIds, fields, abort, prev = {};                                                                          // 6
  var collection = _.has(self, "_collection") ? self._collection : self;                                               // 7
                                                                                                                       // 8
  // args[0] : selector                                                                                                // 9
  // args[1] : mutator                                                                                                 // 10
  // args[2] : options (optional)                                                                                      // 11
  // args[3] : callback                                                                                                // 12
                                                                                                                       // 13
  if (_.isFunction(args[2])) {                                                                                         // 14
    callback = args[2];                                                                                                // 15
    args[2] = {};                                                                                                      // 16
  }                                                                                                                    // 17
                                                                                                                       // 18
  if (!suppressAspects) {                                                                                              // 19
    try {                                                                                                              // 20
      if (aspects.before || aspects.after) {                                                                           // 21
        fields = CollectionHooks.getFields(args[1]);                                                                   // 22
        docs = CollectionHooks.getDocs.call(self, collection, args[0], args[2]).fetch();                               // 23
        docIds = _.map(docs, function (doc) { return doc._id; });                                                      // 24
      }                                                                                                                // 25
                                                                                                                       // 26
      // copy originals for convenience for the "after" pointcut                                                       // 27
      if (aspects.after) {                                                                                             // 28
        prev.mutator = EJSON.clone(args[1]);                                                                           // 29
        prev.options = EJSON.clone(args[2]);                                                                           // 30
        if (_.some(aspects.after, function (o) { return o.options.fetchPrevious !== false; }) &&                       // 31
            CollectionHooks.extendOptions(instance.hookOptions, {}, "after", "update").fetchPrevious !== false) {      // 32
          prev.docs = {};                                                                                              // 33
          _.each(docs, function (doc) {                                                                                // 34
            prev.docs[doc._id] = EJSON.clone(doc);                                                                     // 35
          });                                                                                                          // 36
        }                                                                                                              // 37
      }                                                                                                                // 38
                                                                                                                       // 39
      // before                                                                                                        // 40
      _.each(aspects.before, function (o) {                                                                            // 41
        _.each(docs, function (doc) {                                                                                  // 42
          var r = o.aspect.call(_.extend({transform: getTransform(doc)}, ctx), userId, doc, fields, args[1], args[2]);
          if (r === false) abort = true;                                                                               // 44
        });                                                                                                            // 45
      });                                                                                                              // 46
                                                                                                                       // 47
      if (abort) return false;                                                                                         // 48
    } catch (e) {                                                                                                      // 49
      if (async) return callback.call(self, e);                                                                        // 50
      throw e;                                                                                                         // 51
    }                                                                                                                  // 52
  }                                                                                                                    // 53
                                                                                                                       // 54
  function after(affected, err) {                                                                                      // 55
    if (!suppressAspects) {                                                                                            // 56
      var fields = CollectionHooks.getFields(args[1]);                                                                 // 57
      var docs = CollectionHooks.getDocs.call(self, collection, {_id: {$in: docIds}}, args[2]).fetch();                // 58
                                                                                                                       // 59
      _.each(aspects.after, function (o) {                                                                             // 60
        _.each(docs, function (doc) {                                                                                  // 61
          o.aspect.call(_.extend({                                                                                     // 62
            transform: getTransform(doc),                                                                              // 63
            previous: prev.docs && prev.docs[doc._id],                                                                 // 64
            affected: affected,                                                                                        // 65
            err: err                                                                                                   // 66
          }, ctx), userId, doc, fields, prev.mutator, prev.options);                                                   // 67
        });                                                                                                            // 68
      });                                                                                                              // 69
    }                                                                                                                  // 70
  }                                                                                                                    // 71
                                                                                                                       // 72
  if (async) {                                                                                                         // 73
    args[args.length - 1] = function (err, affected) {                                                                 // 74
      after(affected, err);                                                                                            // 75
      return callback.apply(this, arguments);                                                                          // 76
    };                                                                                                                 // 77
    return _super.apply(this, args);                                                                                   // 78
  } else {                                                                                                             // 79
    var affected = _super.apply(self, args);                                                                           // 80
    after(affected);                                                                                                   // 81
    return affected;                                                                                                   // 82
  }                                                                                                                    // 83
});                                                                                                                    // 84
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/matb33_collection-hooks/remove.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
CollectionHooks.defineAdvice("remove", function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
  var self = this;                                                                                                     // 2
  var ctx = {context: self, _super: _super, args: args};                                                               // 3
  var callback = _.last(args);                                                                                         // 4
  var async = _.isFunction(callback);                                                                                  // 5
  var docs, abort, prev = [];                                                                                          // 6
  var collection = _.has(self, "_collection") ? self._collection : self;                                               // 7
                                                                                                                       // 8
  // args[0] : selector                                                                                                // 9
  // args[1] : callback                                                                                                // 10
                                                                                                                       // 11
  if (!suppressAspects) {                                                                                              // 12
    try {                                                                                                              // 13
      if (aspects.before || aspects.after) {                                                                           // 14
        docs = CollectionHooks.getDocs.call(self, collection, args[0]).fetch();                                        // 15
      }                                                                                                                // 16
                                                                                                                       // 17
      // copy originals for convenience for the "after" pointcut                                                       // 18
      if (aspects.after) {                                                                                             // 19
        _.each(docs, function (doc) {                                                                                  // 20
          prev.push(EJSON.clone(doc));                                                                                 // 21
        });                                                                                                            // 22
      }                                                                                                                // 23
                                                                                                                       // 24
      // before                                                                                                        // 25
      _.each(aspects.before, function (o) {                                                                            // 26
        _.each(docs, function (doc) {                                                                                  // 27
          var r = o.aspect.call(_.extend({transform: getTransform(doc)}, ctx), userId, doc);                           // 28
          if (r === false) abort = true;                                                                               // 29
        });                                                                                                            // 30
      });                                                                                                              // 31
                                                                                                                       // 32
      if (abort) return false;                                                                                         // 33
    } catch (e) {                                                                                                      // 34
      if (async) return callback.call(self, e);                                                                        // 35
      throw e;                                                                                                         // 36
    }                                                                                                                  // 37
  }                                                                                                                    // 38
                                                                                                                       // 39
  function after(err) {                                                                                                // 40
    if (!suppressAspects) {                                                                                            // 41
      _.each(aspects.after, function (o) {                                                                             // 42
        _.each(prev, function (doc) {                                                                                  // 43
          o.aspect.call(_.extend({transform: getTransform(doc), err: err}, ctx), userId, doc);                         // 44
        });                                                                                                            // 45
      });                                                                                                              // 46
    }                                                                                                                  // 47
  }                                                                                                                    // 48
                                                                                                                       // 49
  if (async) {                                                                                                         // 50
    args[args.length - 1] = function (err) {                                                                           // 51
      after(err);                                                                                                      // 52
      return callback.apply(this, arguments);                                                                          // 53
    };                                                                                                                 // 54
    return _super.apply(self, args);                                                                                   // 55
  } else {                                                                                                             // 56
    var result = _super.apply(self, args);                                                                             // 57
    after();                                                                                                           // 58
    return result;                                                                                                     // 59
  }                                                                                                                    // 60
});                                                                                                                    // 61
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/matb33_collection-hooks/upsert.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
CollectionHooks.defineAdvice("upsert", function (userId, _super, instance, aspectGroup, getTransform, args, suppressAspects) {
  var self = this;                                                                                                     // 2
  var ctx = {context: self, _super: _super, args: args};                                                               // 3
  var callback = _.last(args);                                                                                         // 4
  var async = _.isFunction(callback);                                                                                  // 5
  var docs, docIds, fields, abort, prev = {};                                                                          // 6
  var collection = _.has(self, "_collection") ? self._collection : self;                                               // 7
                                                                                                                       // 8
  // args[0] : selector                                                                                                // 9
  // args[1] : mutator                                                                                                 // 10
  // args[2] : options (optional)                                                                                      // 11
  // args[3] : callback                                                                                                // 12
                                                                                                                       // 13
  if (_.isFunction(args[2])) {                                                                                         // 14
    callback = args[2];                                                                                                // 15
    args[2] = {};                                                                                                      // 16
  }                                                                                                                    // 17
                                                                                                                       // 18
  if (!suppressAspects) {                                                                                              // 19
    if (aspectGroup.upsert.before) {                                                                                   // 20
      fields = CollectionHooks.getFields(args[1]);                                                                     // 21
      docs = CollectionHooks.getDocs.call(self, collection, args[0], args[2]).fetch();                                 // 22
      docIds = _.map(docs, function (doc) { return doc._id; });                                                        // 23
    }                                                                                                                  // 24
                                                                                                                       // 25
    // copy originals for convenience for the "after" pointcut                                                         // 26
    if (aspectGroup.update.after) {                                                                                    // 27
      if (_.some(aspectGroup.update.after, function (o) { return o.options.fetchPrevious !== false; }) &&              // 28
          CollectionHooks.extendOptions(instance.hookOptions, {}, "after", "update").fetchPrevious !== false) {        // 29
        prev.mutator = EJSON.clone(args[1]);                                                                           // 30
        prev.options = EJSON.clone(args[2]);                                                                           // 31
        prev.docs = {};                                                                                                // 32
        _.each(docs, function (doc) {                                                                                  // 33
          prev.docs[doc._id] = EJSON.clone(doc);                                                                       // 34
        });                                                                                                            // 35
      }                                                                                                                // 36
    }                                                                                                                  // 37
                                                                                                                       // 38
    // before                                                                                                          // 39
    if (!suppressAspects) {                                                                                            // 40
      _.each(aspectGroup.upsert.before, function (o) {                                                                 // 41
        var r = o.aspect.call(ctx, userId, args[0], args[1], args[2]);                                                 // 42
        if (r === false) abort = true;                                                                                 // 43
      });                                                                                                              // 44
                                                                                                                       // 45
      if (abort) return false;                                                                                         // 46
    }                                                                                                                  // 47
  }                                                                                                                    // 48
                                                                                                                       // 49
  function afterUpdate(affected, err) {                                                                                // 50
    if (!suppressAspects) {                                                                                            // 51
      var fields = CollectionHooks.getFields(args[1]);                                                                 // 52
      var docs = CollectionHooks.getDocs.call(self, collection, {_id: {$in: docIds}}, args[2]).fetch();                // 53
                                                                                                                       // 54
      _.each(aspectGroup.update.after, function (o) {                                                                  // 55
        _.each(docs, function (doc) {                                                                                  // 56
          o.aspect.call(_.extend({                                                                                     // 57
            transform: getTransform(doc),                                                                              // 58
            previous: prev.docs && prev.docs[doc._id],                                                                 // 59
            affected: affected,                                                                                        // 60
            err: err                                                                                                   // 61
          }, ctx), userId, doc, fields, prev.mutator, prev.options);                                                   // 62
        });                                                                                                            // 63
      });                                                                                                              // 64
    }                                                                                                                  // 65
  }                                                                                                                    // 66
                                                                                                                       // 67
  function afterInsert(id, err) {                                                                                      // 68
    if (!suppressAspects) {                                                                                            // 69
      var doc = CollectionHooks.getDocs.call(self, collection, {_id: id}, args[0], {}).fetch()[0]; // 3rd argument passes empty object which causes magic logic to imply limit:1
      var lctx = _.extend({transform: getTransform(doc), _id: id, err: err}, ctx);                                     // 71
      _.each(aspectGroup.insert.after, function (o) {                                                                  // 72
        o.aspect.call(lctx, userId, doc);                                                                              // 73
      });                                                                                                              // 74
    }                                                                                                                  // 75
  }                                                                                                                    // 76
                                                                                                                       // 77
  if (async) {                                                                                                         // 78
    args[args.length - 1] = function (err, ret) {                                                                      // 79
      if (ret.insertedId) {                                                                                            // 80
        afterInsert(ret.insertedId, err);                                                                              // 81
      } else {                                                                                                         // 82
        afterUpdate(ret.numberAffected, err);                                                                          // 83
      }                                                                                                                // 84
                                                                                                                       // 85
      return CollectionHooks.hookedOp(function () {                                                                    // 86
        return callback.call(this, err, ret);                                                                          // 87
      });                                                                                                              // 88
    };                                                                                                                 // 89
                                                                                                                       // 90
    return CollectionHooks.directOp(function () {                                                                      // 91
      return _super.apply(self, args);                                                                                 // 92
    });                                                                                                                // 93
  } else {                                                                                                             // 94
    var ret = CollectionHooks.directOp(function () {                                                                   // 95
      return _super.apply(self, args);                                                                                 // 96
    });                                                                                                                // 97
                                                                                                                       // 98
    if (ret.insertedId) {                                                                                              // 99
      afterInsert(ret.insertedId);                                                                                     // 100
    } else {                                                                                                           // 101
      afterUpdate(ret.numberAffected);                                                                                 // 102
    }                                                                                                                  // 103
                                                                                                                       // 104
    return ret;                                                                                                        // 105
  }                                                                                                                    // 106
});                                                                                                                    // 107
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/matb33_collection-hooks/find.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
CollectionHooks.defineAdvice("find", function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
  var self = this;                                                                                                     // 2
  var ctx = {context: self, _super: _super, args: args};                                                               // 3
  var ret, abort;                                                                                                      // 4
                                                                                                                       // 5
  // args[0] : selector                                                                                                // 6
  // args[1] : options                                                                                                 // 7
                                                                                                                       // 8
  // before                                                                                                            // 9
  if (!suppressAspects) {                                                                                              // 10
    _.each(aspects.before, function (o) {                                                                              // 11
      var r = o.aspect.call(ctx, userId, args[0], args[1]);                                                            // 12
      if (r === false) abort = true;                                                                                   // 13
    });                                                                                                                // 14
                                                                                                                       // 15
    if (abort) return false;                                                                                           // 16
  }                                                                                                                    // 17
                                                                                                                       // 18
  function after(cursor) {                                                                                             // 19
    if (!suppressAspects) {                                                                                            // 20
      _.each(aspects.after, function (o) {                                                                             // 21
        o.aspect.call(ctx, userId, args[0], args[1], cursor);                                                          // 22
      });                                                                                                              // 23
    }                                                                                                                  // 24
  }                                                                                                                    // 25
                                                                                                                       // 26
  ret = _super.apply(self, args);                                                                                      // 27
  after(ret);                                                                                                          // 28
                                                                                                                       // 29
  return ret;                                                                                                          // 30
});                                                                                                                    // 31
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/matb33_collection-hooks/findone.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
CollectionHooks.defineAdvice("findOne", function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
  var self = this;                                                                                                     // 2
  var ctx = {context: self, _super: _super, args: args};                                                               // 3
  var ret, abort;                                                                                                      // 4
                                                                                                                       // 5
  // args[0] : selector                                                                                                // 6
  // args[1] : options                                                                                                 // 7
                                                                                                                       // 8
  // before                                                                                                            // 9
  if (!suppressAspects) {                                                                                              // 10
    _.each(aspects.before, function (o) {                                                                              // 11
      var r = o.aspect.call(ctx, userId, args[0], args[1]);                                                            // 12
      if (r === false) abort = true;                                                                                   // 13
    });                                                                                                                // 14
                                                                                                                       // 15
    if (abort) return false;                                                                                           // 16
  }                                                                                                                    // 17
                                                                                                                       // 18
  function after(doc) {                                                                                                // 19
    if (!suppressAspects) {                                                                                            // 20
      _.each(aspects.after, function (o) {                                                                             // 21
        o.aspect.call(ctx, userId, args[0], args[1], doc);                                                             // 22
      });                                                                                                              // 23
    }                                                                                                                  // 24
  }                                                                                                                    // 25
                                                                                                                       // 26
  ret = _super.apply(self, args);                                                                                      // 27
  after(ret);                                                                                                          // 28
                                                                                                                       // 29
  return ret;                                                                                                          // 30
});                                                                                                                    // 31
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/matb33_collection-hooks/users-compat.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
if (Meteor.users) {                                                                                                    // 1
  // If Meteor.users has been instantiated, attempt to re-assign its prototype:                                        // 2
  CollectionHooks.reassignPrototype(Meteor.users);                                                                     // 3
                                                                                                                       // 4
  // Next, give it the hook aspects:                                                                                   // 5
  var Collection = typeof Mongo !== "undefined" && typeof Mongo.Collection !== "undefined" ? Mongo.Collection : Meteor.Collection;
  CollectionHooks.extendCollectionInstance(Meteor.users, Collection);                                                  // 7
}                                                                                                                      // 8
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['matb33:collection-hooks'] = {
  CollectionHooks: CollectionHooks
};

})();

//# sourceMappingURL=matb33_collection-hooks.js.map
