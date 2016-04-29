(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/monbro_mongodb-mapreduce-aggregation/packages/monbro_mongodb-mapreduce-aggr //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
(function () {                                                                          // 1
                                                                                        // 2
///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/monbro:mongodb-mapreduce-aggregation/server.coffee.js                    //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Future, path, tl, _callMapReduce, _dummyCollection_, _futureWrapper;                // 10
                                                                                        // 11
tl = typeof TLog !== "undefined" && TLog !== null ? TLog.getLogger() : void 0;          // 12
                                                                                        // 13
path = Npm.require("path");                                                             // 14
                                                                                        // 15
Future = Npm.require(path.join("fibers", "future"));                                    // 16
                                                                                        // 17
_dummyCollection_ = new Meteor.Collection('__dummy__');                                 // 18
                                                                                        // 19
_futureWrapper = function(collection, commandName, args) {                              // 20
  var cb, col, coll1, collectionName, future, result;                                   // 21
  col = (typeof collection) === "string" ? _dummyCollection_ : collection;              // 22
  collectionName = (typeof collection) === "string" ? collection : collection._name;    // 23
  coll1 = col.find()._mongo.db.collection(collectionName);                              // 24
  future = new Future;                                                                  // 25
  cb = future.resolver();                                                               // 26
  args = args.slice();                                                                  // 27
  args.push(cb);                                                                        // 28
  coll1[commandName].apply(coll1, args);                                                // 29
  return result = future.wait();                                                        // 30
};                                                                                      // 31
                                                                                        // 32
_callMapReduce = function(collection, map, reduce, options) {                           // 33
  var col, coll1, collectionName, future, result;                                       // 34
  col = (typeof collection) === "string" ? _dummyCollection_ : collection;              // 35
  collectionName = (typeof collection) === "string" ? collection : collection._name;    // 36
  if (tl != null) {                                                                     // 37
    tl.debug("callMapReduce called for collection " + collectionName + " map: " + map + " reduce: " + reduce + (" options: " + (JSON.stringify(options))));
  }                                                                                     // 39
  coll1 = col.find()._mongo.db.collection(collectionName);                              // 40
  future = new Future;                                                                  // 41
  coll1.mapReduce(map, reduce, options, function(err, result, stats) {                  // 42
    var res;                                                                            // 43
    if (err) {                                                                          // 44
      future["throw"](err);                                                             // 45
    }                                                                                   // 46
    res = {                                                                             // 47
      collectionName: result.collectionName,                                            // 48
      stats: stats                                                                      // 49
    };                                                                                  // 50
    return future["return"]([true, res]);                                               // 51
  });                                                                                   // 52
  result = future.wait();                                                               // 53
  if (!result[0]) {                                                                     // 54
    throw result[1];                                                                    // 55
  }                                                                                     // 56
  return result[1];                                                                     // 57
};                                                                                      // 58
                                                                                        // 59
_.extend(Meteor.Collection.prototype, {                                                 // 60
  distinct: function(key, query, options) {                                             // 61
    return _futureWrapper(this._name, "distinct", [key, query, options]);               // 62
  },                                                                                    // 63
  aggregate: function(pipeline) {                                                       // 64
    return _futureWrapper(this._name, "aggregate", [pipeline]);                         // 65
  },                                                                                    // 66
  mapReduce: function(map, reduce, options) {                                           // 67
    options = options || {};                                                            // 68
    options.readPreference = "primary";                                                 // 69
    return _callMapReduce(this._name, map, reduce, options);                            // 70
  }                                                                                     // 71
});                                                                                     // 72
///////////////////////////////////////////////////////////////////////////////////////
                                                                                        // 74
}).call(this);                                                                          // 75
                                                                                        // 76
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['monbro:mongodb-mapreduce-aggregation'] = {};

})();

//# sourceMappingURL=monbro_mongodb-mapreduce-aggregation.js.map
