(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/avatar.coffee.js                                     //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                            // 1
  var RocketChatStore, path, ref, storeType, transformWrite;           // 2
  storeType = 'GridFS';                                                // 2
  if (RocketChat.settings.get('Accounts_AvatarStoreType')) {           // 4
    storeType = RocketChat.settings.get('Accounts_AvatarStoreType');   // 5
  }                                                                    //
  RocketChatStore = RocketChatFile[storeType];                         // 2
  if (RocketChatStore == null) {                                       // 9
    throw new Error("Invalid RocketChatStore type [" + storeType + "]");
  }                                                                    //
  console.log(("Using " + storeType + " for Avatar storage").green);   // 2
  transformWrite = function(file, readStream, writeStream) {           // 2
    var height, width;                                                 // 15
    if (RocketChatFile.enabled === false || RocketChat.settings.get('Accounts_AvatarResize') !== true) {
      return readStream.pipe(writeStream);                             // 16
    }                                                                  //
    height = RocketChat.settings.get('Accounts_AvatarSize');           // 15
    width = height;                                                    // 15
    return RocketChatFile.gm(readStream, file.fileName).background('#ffffff').resize(width, height + '^>').gravity('Center').extent(width, height).stream('jpeg').pipe(writeStream);
  };                                                                   //
  path = "~/uploads";                                                  // 2
  if (((ref = RocketChat.settings.get('Accounts_AvatarStorePath')) != null ? ref.trim() : void 0) !== '') {
    path = RocketChat.settings.get('Accounts_AvatarStorePath');        // 26
  }                                                                    //
  this.RocketChatFileAvatarInstance = new RocketChatStore({            // 2
    name: 'avatars',                                                   // 29
    absolutePath: path,                                                // 29
    transformWrite: transformWrite                                     // 29
  });                                                                  //
  return WebApp.connectHandlers.use('/avatar/', Meteor.bindEnvironment(function(req, res, next) {
    var color, colors, file, initials, params, position, ref1, ref2, ref3, ref4, ref5, ref6, reqModifiedHeader, svg, user, username, usernameParts;
    params = {                                                         // 34
      username: decodeURIComponent(req.url.replace(/^\//, '').replace(/\?.*$/, ''))
    };                                                                 //
    if (params.username[0] !== '@') {                                  // 37
      if ((ref1 = Meteor.settings) != null ? (ref2 = ref1["public"]) != null ? ref2.sandstorm : void 0 : void 0) {
        user = RocketChat.models.Users.findOneByUsername(params.username.replace('.jpg', ''));
        if (user != null ? (ref3 = user.services) != null ? (ref4 = ref3.sandstorm) != null ? ref4.picture : void 0 : void 0 : void 0) {
          res.setHeader('Location', user.services.sandstorm.picture);  // 41
          res.writeHead(302);                                          // 41
          res.end();                                                   // 41
          return;                                                      // 44
        }                                                              //
      }                                                                //
      file = RocketChatFileAvatarInstance.getFileWithReadStream(encodeURIComponent(params.username));
    } else {                                                           //
      params.username = params.username.replace('@', '');              // 47
    }                                                                  //
    res.setHeader('Content-Disposition', 'inline');                    // 34
    if (file == null) {                                                // 52
      res.setHeader('Content-Type', 'image/svg+xml');                  // 53
      res.setHeader('Cache-Control', 'public, max-age=0');             // 53
      res.setHeader('Expires', '-1');                                  // 53
      res.setHeader('Last-Modified', "Thu, 01 Jan 2015 00:00:00 GMT");
      reqModifiedHeader = req.headers["if-modified-since"];            // 53
      if (reqModifiedHeader != null) {                                 // 59
        if (reqModifiedHeader === "Thu, 01 Jan 2015 00:00:00 GMT") {   // 60
          res.writeHead(304);                                          // 61
          res.end();                                                   // 61
          return;                                                      // 63
        }                                                              //
      }                                                                //
      colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];
      username = params.username.replace('.jpg', '');                  // 53
      color = '';                                                      // 53
      initials = '';                                                   // 53
      if (username === "?") {                                          // 70
        color = "#000";                                                // 71
        initials = username;                                           // 71
      } else {                                                         //
        position = username.length % colors.length;                    // 74
        color = colors[position];                                      // 74
        username = username.replace(/[^A-Za-z0-9]/g, '.').replace(/\.+/g, '.').replace(/(^\.)|(\.$)/g, '');
        usernameParts = username.split('.');                           // 74
        initials = usernameParts.length > 1 ? _.first(usernameParts)[0] + _.last(usernameParts)[0] : username.replace(/[^A-Za-z0-9]/g, '').substr(0, 2);
        initials = initials.toUpperCase();                             // 74
      }                                                                //
      svg = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" pointer-events=\"none\" width=\"50\" height=\"50\" style=\"width: 50px; height: 50px; background-color: " + color + ";\">\n	<text text-anchor=\"middle\" y=\"50%\" x=\"50%\" dy=\"0.36em\" pointer-events=\"auto\" fill=\"#ffffff\" font-family=\"Helvetica, Arial, Lucida Grande, sans-serif\" style=\"font-weight: 400; font-size: 28px;\">\n		" + initials + "\n	</text>\n</svg>";
      res.write(svg);                                                  // 53
      res.end();                                                       // 53
      return;                                                          // 95
    }                                                                  //
    reqModifiedHeader = req.headers["if-modified-since"];              // 34
    if (reqModifiedHeader != null) {                                   // 98
      if (reqModifiedHeader === ((ref5 = file.uploadDate) != null ? ref5.toUTCString() : void 0)) {
        res.setHeader('Last-Modified', reqModifiedHeader);             // 100
        res.writeHead(304);                                            // 100
        res.end();                                                     // 100
        return;                                                        // 103
      }                                                                //
    }                                                                  //
    res.setHeader('Cache-Control', 'public, max-age=0');               // 34
    res.setHeader('Expires', '-1');                                    // 34
    res.setHeader('Last-Modified', ((ref6 = file.uploadDate) != null ? ref6.toUTCString() : void 0) || new Date().toUTCString());
    res.setHeader('Content-Type', 'image/jpeg');                       // 34
    res.setHeader('Content-Length', file.length);                      // 34
    file.readStream.pipe(res);                                         // 34
  }));                                                                 //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=avatar.coffee.js.map
