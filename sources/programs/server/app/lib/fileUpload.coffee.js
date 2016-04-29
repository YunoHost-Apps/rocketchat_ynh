(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// lib/fileUpload.coffee.js                                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var initFileStore;                                                     // 1
                                                                       //
if (typeof UploadFS !== "undefined" && UploadFS !== null) {            // 1
  RocketChat.models.Uploads.model.allow({                              // 2
    insert: function(userId, doc) {                                    // 3
      return userId;                                                   // 4
    },                                                                 //
    update: function(userId, doc) {                                    // 3
      return userId === doc.userId;                                    // 7
    },                                                                 //
    remove: function(userId, doc) {                                    // 3
      return userId === doc.userId;                                    // 10
    }                                                                  //
  });                                                                  //
  initFileStore = function() {                                         // 2
    var cookie;                                                        // 13
    cookie = new Cookies();                                            // 13
    if (Meteor.isClient) {                                             // 14
      cookie.set('rc_uid', Meteor.userId());                           // 15
      cookie.set('rc_token', Meteor._localStorage.getItem('Meteor.loginToken'));
      cookie.send();                                                   // 15
    }                                                                  //
    return Meteor.fileStore = new UploadFS.store.GridFS({              //
      collection: RocketChat.models.Uploads.model,                     // 20
      name: 'rocketchat_uploads',                                      // 20
      collectionName: 'rocketchat_uploads',                            // 20
      filter: new UploadFS.Filter({                                    // 20
        onCheck: FileUpload.validateFileUpload                         // 24
      }),                                                              //
      transformWrite: function(readStream, writeStream, fileId, file) {
        var identify, stream;                                          // 26
        if (RocketChatFile.enabled === false || !/^image\/.+/.test(file.type)) {
          return readStream.pipe(writeStream);                         // 27
        }                                                              //
        stream = void 0;                                               // 26
        identify = function(err, data) {                               // 26
          var ref;                                                     // 32
          if (err != null) {                                           // 32
            return stream.pipe(writeStream);                           // 33
          }                                                            //
          file.identify = {                                            // 32
            format: data.format,                                       // 36
            size: data.size                                            // 36
          };                                                           //
          if ((data.Orientation != null) && ((ref = data.Orientation) !== '' && ref !== 'Unknown' && ref !== 'Undefined')) {
            return RocketChatFile.gm(stream).autoOrient().stream().pipe(writeStream);
          } else {                                                     //
            return stream.pipe(writeStream);                           //
          }                                                            //
        };                                                             //
        return stream = RocketChatFile.gm(readStream).identify(identify).stream();
      },                                                               //
      onRead: function(fileId, file, req, res) {                       // 20
        var rawCookies, ref, token, uid;                               // 47
        if (RocketChat.settings.get('FileUpload_ProtectFiles')) {      // 47
          if ((req != null ? (ref = req.headers) != null ? ref.cookie : void 0 : void 0) != null) {
            rawCookies = req.headers.cookie;                           // 48
          }                                                            //
          if (rawCookies != null) {                                    // 49
            uid = cookie.get('rc_uid', rawCookies);                    // 49
          }                                                            //
          if (rawCookies != null) {                                    // 50
            token = cookie.get('rc_token', rawCookies);                // 50
          }                                                            //
          if (uid == null) {                                           // 52
            uid = req.query.rc_uid;                                    // 53
            token = req.query.rc_token;                                // 53
          }                                                            //
          if (!(uid && token && RocketChat.models.Users.findOneByIdAndLoginToken(uid, token))) {
            res.writeHead(403);                                        // 57
            return false;                                              // 58
          }                                                            //
        }                                                              //
        res.setHeader('content-disposition', "attachment; filename=\"" + (encodeURIComponent(file.name)) + "\"");
        return true;                                                   // 61
      }                                                                //
    });                                                                //
  };                                                                   //
  Meteor.startup(function() {                                          // 2
    if (Meteor.isServer) {                                             // 64
      return initFileStore();                                          //
    } else {                                                           //
      return Tracker.autorun(function(c) {                             //
        if (Meteor.userId() && RocketChat.settings.subscription.ready()) {
          initFileStore();                                             // 69
          return c.stop();                                             //
        }                                                              //
      });                                                              //
    }                                                                  //
  });                                                                  //
}                                                                      //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=fileUpload.coffee.js.map
