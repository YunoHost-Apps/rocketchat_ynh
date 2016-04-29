(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;

/* Package-scope variables */
var __coffeescriptShare, Autocomplete, AutocompleteTest;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/mizzao_autocomplete/packages/mizzao_autocomplete.js                              //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
(function () {                                                                               // 1
                                                                                             // 2
////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/mizzao:autocomplete/autocomplete-server.coffee.js                             //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                             // 10
                                                                                             // 11
Autocomplete = (function() {                                                                 // 12
  function Autocomplete() {}                                                                 // 13
                                                                                             // 14
  Autocomplete.publishCursor = function(cursor, sub) {                                       // 15
    return Mongo.Collection._publishCursor(cursor, sub, "autocompleteRecords");              // 16
  };                                                                                         // 17
                                                                                             // 18
  return Autocomplete;                                                                       // 19
                                                                                             // 20
})();                                                                                        // 21
                                                                                             // 22
Meteor.publish('autocomplete-recordset', function(selector, options, collName) {             // 23
  var collection;                                                                            // 24
  collection = global[collName];                                                             // 25
  if (!collection) {                                                                         // 26
    throw new Error(collName + ' is not defined on the global namespace of the server.');    // 27
  }                                                                                          // 28
  if (!collection._isInsecure()) {                                                           // 29
    Meteor._debug(collName + ' is a secure collection, therefore no data was returned because the client could compromise security by subscribing to arbitrary server collections via the browser console. Please write your own publish function.');
    return [];                                                                               // 31
  }                                                                                          // 32
  if (options.limit) {                                                                       // 33
    options.limit = Math.min(50, Math.abs(options.limit));                                   // 34
  }                                                                                          // 35
  Autocomplete.publishCursor(collection.find(selector, options), this);                      // 36
  return this.ready();                                                                       // 37
});                                                                                          // 38
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             // 40
}).call(this);                                                                               // 41
                                                                                             // 42
///////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mizzao:autocomplete'] = {
  Autocomplete: Autocomplete,
  AutocompleteTest: AutocompleteTest
};

})();

//# sourceMappingURL=mizzao_autocomplete.js.map
