(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// lib/underscore.string.coffee.js                                     //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var mixin;                                                             // 6
                                                                       //
mixin = function(obj) {                                                // 6
  return _.each(_.functions(obj), function(name) {                     //
    var func;                                                          // 8
    if (!_[name] && (_.prototype[name] == null)) {                     // 8
      func = _[name] = obj[name];                                      // 9
      return _.prototype[name] = function() {                          //
        var args;                                                      // 11
        args = [this._wrapped];                                        // 11
        push.apply(args, arguments);                                   // 11
        return result.call(this, func.apply(_, args));                 // 13
      };                                                               //
    }                                                                  //
  });                                                                  //
};                                                                     // 6
                                                                       //
mixin(s.exports());                                                    // 6
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=underscore.string.coffee.js.map
