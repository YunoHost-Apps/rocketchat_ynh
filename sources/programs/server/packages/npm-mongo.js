(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var NpmModuleMongodb, NpmModuleMongodbVersion;

(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// packages/npm-mongo/wrapper.js                                       //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
NpmModuleMongodb = Npm.require('mongodb');                             // 1
NpmModuleMongodbVersion = Npm.require('mongodb/package.json').version;
                                                                       // 3
/////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['npm-mongo'] = {
  NpmModuleMongodb: NpmModuleMongodb,
  NpmModuleMongodbVersion: NpmModuleMongodbVersion
};

})();

//# sourceMappingURL=npm-mongo.js.map
