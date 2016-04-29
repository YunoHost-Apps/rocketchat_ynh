(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var LDAPJS;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_ldapjs/lib/ldapjs.js                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
LDAPJS = Npm.require('ldapjs');                                      // 1
                                                                     // 2
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:ldapjs'] = {
  LDAPJS: LDAPJS
};

})();

//# sourceMappingURL=rocketchat_ldapjs.js.map
