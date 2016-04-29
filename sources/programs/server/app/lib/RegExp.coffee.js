(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// lib/RegExp.coffee.js                                                //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RegExp.escape = function(s) {                                          // 1
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');                  // 2
};                                                                     // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=RegExp.coffee.js.map
