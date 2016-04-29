(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/appcache.coffee.js                                   //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ref;                                                               // 1
                                                                       //
if ((ref = Meteor.AppCache) != null) {                                 //
  ref.config({                                                         //
    onlineOnly: ['/elements/', '/landing/', '/moment-locales/', '/scripts/']
  });                                                                  //
}                                                                      //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=appcache.coffee.js.map
