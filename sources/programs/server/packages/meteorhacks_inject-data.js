(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;

/* Package-scope variables */
var InjectData;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteorhacks_inject-data/lib/namespace.js                 //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
InjectData = {};                                                     // 1
///////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteorhacks_inject-data/lib/utils.js                     //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
InjectData._encode = function(ejson) {                               // 1
  var ejsonString = EJSON.stringify(ejson);                          // 2
  return encodeURIComponent(ejsonString);                            // 3
};                                                                   // 4
                                                                     // 5
InjectData._decode = function(encodedEjson) {                        // 6
  var decodedEjsonString = decodeURIComponent(encodedEjson);         // 7
  if(!decodedEjsonString) return null;                               // 8
                                                                     // 9
  return EJSON.parse(decodedEjsonString);                            // 10
};                                                                   // 11
                                                                     // 12
///////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteorhacks_inject-data/lib/server.js                    //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var http = Npm.require('http');                                      // 1
                                                                     // 2
var templateText = Assets.getText('lib/inject.html');                // 3
var injectDataTemplate = _.template(templateText);                   // 4
                                                                     // 5
// custome API                                                       // 6
InjectData.pushData = function pushData(res, key, value) {           // 7
  if(!res._injectPayload) {                                          // 8
    res._injectPayload = {};                                         // 9
  }                                                                  // 10
                                                                     // 11
  res._injectPayload[key] = value;                                   // 12
  InjectData._hijackWriteIfNeeded(res);                              // 13
};                                                                   // 14
                                                                     // 15
InjectData.getData = function getData(res, key) {                    // 16
  if(res._injectPayload) {                                           // 17
    return _.clone(res._injectPayload[key]);                         // 18
  } else {                                                           // 19
    return null;                                                     // 20
  }                                                                  // 21
};                                                                   // 22
                                                                     // 23
InjectData._hijackWriteIfNeeded = function(res) {                    // 24
  if(res._writeHijacked) {                                           // 25
    return;                                                          // 26
  }                                                                  // 27
  res._writeHijacked = true;                                         // 28
                                                                     // 29
  var originalWrite = res.write;                                     // 30
  res.write = function(chunk, encoding) {                            // 31
    var condition =                                                  // 32
      res._injectPayload && !res._injected &&                        // 33
      encoding === undefined &&                                      // 34
      /<!DOCTYPE html>/.test(chunk);                                 // 35
                                                                     // 36
    if(condition) {                                                  // 37
      // if cors headers included if may cause some security holes   // 38
      // so we simply turn off injecting if we detect an cors header
      // read more: http://goo.gl/eGwb4e                             // 40
      if(res._headers['access-control-allow-origin']) {              // 41
        var warnMessage =                                            // 42
          'warn: injecting data turned off due to CORS headers. ' +  // 43
          'read more: http://goo.gl/eGwb4e';                         // 44
                                                                     // 45
        console.warn(warnMessage);                                   // 46
        originalWrite.call(res, chunk, encoding);                    // 47
        return;                                                      // 48
      }                                                              // 49
                                                                     // 50
      // inject data                                                 // 51
      var data = InjectData._encode(res._injectPayload);             // 52
      var injectHtml = injectDataTemplate({data: data});             // 53
                                                                     // 54
      // if this is a buffer, convert it to string                   // 55
      chunk = chunk.toString();                                      // 56
      chunk = chunk.replace('<script', injectHtml + '<script');      // 57
                                                                     // 58
      res._injected = true;                                          // 59
    }                                                                // 60
                                                                     // 61
    originalWrite.call(res, chunk, encoding);                        // 62
  };                                                                 // 63
};                                                                   // 64
                                                                     // 65
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteorhacks:inject-data'] = {
  InjectData: InjectData
};

})();

//# sourceMappingURL=meteorhacks_inject-data.js.map
