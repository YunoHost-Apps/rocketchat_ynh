(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var blocking = Package['peerlibrary:blocking'].blocking;
var _ = Package.underscore._;

/* Package-scope variables */
var AWS;

(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/peerlibrary_aws-sdk/packages/peerlibrary_aws-sdk.js                     //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
(function () {                                                                      // 1
                                                                                    // 2
////////////////////////////////////////////////////////////////////////////////    // 3
//                                                                            //    // 4
// packages/peerlibrary:aws-sdk/server.js                                     //    // 5
//                                                                            //    // 6
////////////////////////////////////////////////////////////////////////////////    // 7
                                                                              //    // 8
AWS = Npm.require('aws-sdk');                                                 // 1  // 9
                                                                              // 2  // 10
var originalDefineMethods = AWS.Service.defineMethods;                        // 3  // 11
                                                                              // 4  // 12
function makeBlocking(proto, methodName) {                                    // 5  // 13
  var syncMethod = methodName + 'Sync';                                       // 6  // 14
  if (!proto[methodName]) return;                                             // 7  // 15
  if (!_.isFunction(proto[methodName])) return;                               // 8  // 16
  if (proto[syncMethod]) return;                                              // 9  // 17
  proto[syncMethod] = blocking(proto[methodName]);                            // 10
}                                                                             // 11
                                                                              // 12
AWS.Service.defineMethods = function defineMethods(svc) {                     // 13
  originalDefineMethods(svc);                                                 // 14
  AWS.util.each(svc.prototype.api.operations, function iterator(methodName) { // 15
    makeBlocking(svc.prototype, methodName);                                  // 16
  });                                                                         // 17
};                                                                            // 18
                                                                              // 19
AWS.util.each(AWS, function iterator(name) {                                  // 20
  if (!(AWS[name].prototype instanceof AWS.Service)) return;                  // 21
                                                                              // 22
  AWS.util.each(AWS[name].prototype, function iterator(methodName) {          // 23
    makeBlocking(AWS[name].prototype, methodName);                            // 24
  });                                                                         // 25
});                                                                           // 26
                                                                              // 27
////////////////////////////////////////////////////////////////////////////////    // 36
                                                                                    // 37
}).call(this);                                                                      // 38
                                                                                    // 39
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['peerlibrary:aws-sdk'] = {
  AWS: AWS
};

})();

//# sourceMappingURL=peerlibrary_aws-sdk.js.map
