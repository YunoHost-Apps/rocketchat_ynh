(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare, incrementCounter, decrementCounter, setCounter, deleteCounters;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/konecty_mongo-counter/packages/konecty_mongo-counter.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function () {                                                                                                         // 1
                                                                                                                       // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/konecty:mongo-counter/counter.coffee.js                                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var callCounter, getCounterCollection, _decrementCounter, _deleteCounters, _incrementCounter, _setCounter,                                                                
  __slice = [].slice;                                                                                                  // 11
                                                                                                                       // 12
getCounterCollection = function(collection) {                                                                          // 13
  return collection.rawCollection();                                                                                   // 14
};                                                                                                                     // 15
                                                                                                                       // 16
callCounter = function() {                                                                                             // 17
  var Counters, args, collection, future, method, _ref;                                                                // 18
  method = arguments[0], collection = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];    // 19
  Counters = getCounterCollection(collection);                                                                         // 20
  if (Meteor.wrapAsync != null) {                                                                                      // 21
    return Meteor.wrapAsync(_.bind(Counters[method], Counters)).apply(null, args);                                     // 22
  } else {                                                                                                             // 23
    future = new (Npm.require(Npm.require('path').join('fibers', 'future')))();                                        // 24
    (_ref = Counters[method]).call.apply(_ref, [Counters].concat(__slice.call(args), [future.resolver()]));            // 25
    return future.wait();                                                                                              // 26
  }                                                                                                                    // 27
};                                                                                                                     // 28
                                                                                                                       // 29
_deleteCounters = function(collection) {                                                                               // 30
  return callCounter('remove', collection, {}, {                                                                       // 31
    safe: true                                                                                                         // 32
  });                                                                                                                  // 33
};                                                                                                                     // 34
                                                                                                                       // 35
_incrementCounter = function(collection, counterName, amount) {                                                        // 36
  var newDoc;                                                                                                          // 37
  if (amount == null) {                                                                                                // 38
    amount = 1;                                                                                                        // 39
  }                                                                                                                    // 40
  newDoc = callCounter('findAndModify', collection, {                                                                  // 41
    _id: counterName                                                                                                   // 42
  }, null, {                                                                                                           // 43
    $inc: {                                                                                                            // 44
      next_val: amount                                                                                                 // 45
    }                                                                                                                  // 46
  }, {                                                                                                                 // 47
    "new": true,                                                                                                       // 48
    upsert: true                                                                                                       // 49
  });                                                                                                                  // 50
  return newDoc.next_val;                                                                                              // 51
};                                                                                                                     // 52
                                                                                                                       // 53
_decrementCounter = function(collection, counterName, amount) {                                                        // 54
  if (amount == null) {                                                                                                // 55
    amount = 1;                                                                                                        // 56
  }                                                                                                                    // 57
  return _incrementCounter(collection, counterName, -amount);                                                          // 58
};                                                                                                                     // 59
                                                                                                                       // 60
_setCounter = function(collection, counterName, value) {                                                               // 61
  callCounter('update', collection, {                                                                                  // 62
    _id: counterName                                                                                                   // 63
  }, {                                                                                                                 // 64
    $set: {                                                                                                            // 65
      next_val: value                                                                                                  // 66
    }                                                                                                                  // 67
  });                                                                                                                  // 68
};                                                                                                                     // 69
                                                                                                                       // 70
if (typeof Package !== "undefined" && Package !== null) {                                                              // 71
  incrementCounter = _incrementCounter;                                                                                // 72
  decrementCounter = _decrementCounter;                                                                                // 73
  setCounter = _setCounter;                                                                                            // 74
  deleteCounters = _deleteCounters;                                                                                    // 75
} else {                                                                                                               // 76
  this.incrementCounter = _incrementCounter;                                                                           // 77
  this.decrementCounter = _decrementCounter;                                                                           // 78
  this.setCounter = _setCounter;                                                                                       // 79
  this.deleteCounters = _deleteCounters;                                                                               // 80
}                                                                                                                      // 81
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       // 83
}).call(this);                                                                                                         // 84
                                                                                                                       // 85
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['konecty:mongo-counter'] = {
  incrementCounter: incrementCounter,
  decrementCounter: decrementCounter,
  setCounter: setCounter,
  deleteCounters: deleteCounters
};

})();

//# sourceMappingURL=konecty_mongo-counter.js.map
