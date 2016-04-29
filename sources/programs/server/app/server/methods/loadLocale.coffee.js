(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/loadLocale.coffee.js                                 //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  loadLocale: function(locale) {                                       // 2
    var e;                                                             // 3
    try {                                                              // 3
      return Assets.getText("moment-locales/" + (locale.toLowerCase()) + ".js");
    } catch (_error) {                                                 //
      e = _error;                                                      // 6
      return console.log(e);                                           //
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=loadLocale.coffee.js.map
