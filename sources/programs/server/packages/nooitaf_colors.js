(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var colors;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/nooitaf_colors/export.js                                 //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
colors = Npm.require('colors');                                      // 1
                                                                     // 2
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['nooitaf:colors'] = {
  colors: colors
};

})();

//# sourceMappingURL=nooitaf_colors.js.map
