(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v036.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var url;                                                               // 1
                                                                       //
url = Npm.require('url');                                              // 1
                                                                       //
RocketChat.Migrations.add({                                            // 1
  version: 36,                                                         // 3
  up: function() {                                                     // 3
    var e, loginHeader, match, requestUrl;                             // 5
    loginHeader = RocketChat.models.Settings.findOne({                 // 5
      _id: 'Layout_Login_Header'                                       // 5
    });                                                                //
    if ((loginHeader != null ? loginHeader.value : void 0) == null) {  // 7
      return;                                                          // 8
    }                                                                  //
    match = loginHeader.value.match(/<img\ssrc=['"]([^'"]+)/);         // 5
    if ((match != null) && match.length === 2) {                       // 11
      requestUrl = match[1];                                           // 12
      if (requestUrl[0] === '/') {                                     // 13
        requestUrl = url.resolve(Meteor.absoluteUrl(), requestUrl);    // 14
      }                                                                //
      try {                                                            // 16
        Meteor.startup(function() {                                    // 17
          return Meteor.setTimeout(function() {                        //
            var result;                                                // 19
            result = HTTP.get(requestUrl, {                            // 19
              npmRequestOptions: {                                     // 19
                encoding: 'binary'                                     // 19
              }                                                        //
            });                                                        //
            if (result.statusCode === 200) {                           // 20
              return RocketChat.Assets.setAsset(result.content, result.headers['content-type'], 'logo');
            }                                                          //
          }, 30000);                                                   //
        });                                                            //
      } catch (_error) {                                               //
        e = _error;                                                    // 24
        console.log(e);                                                // 24
      }                                                                //
    }                                                                  //
    return RocketChat.models.Settings.remove({                         //
      _id: 'Layout_Login_Header'                                       // 27
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v036.coffee.js.map
