(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v002.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 2,                                                          // 2
  up: function() {                                                     // 2
    return RocketChat.models.Users.find({                              //
      avatarOrigin: {                                                  // 4
        $exists: false                                                 // 4
      },                                                               //
      username: {                                                      // 4
        $exists: true                                                  // 4
      }                                                                //
    }).forEach(function(user) {                                        //
      var avatars, contentType, dataURI, image, ref, rs, service, services, ws;
      avatars = getAvatarSuggestionForUser(user);                      // 5
      services = Object.keys(avatars);                                 // 5
      if (services.length === 0) {                                     // 9
        return;                                                        // 10
      }                                                                //
      service = services[0];                                           // 5
      console.log(user.username, '->', service);                       // 5
      dataURI = avatars[service].blob;                                 // 5
      ref = RocketChatFile.dataURIParse(dataURI), image = ref.image, contentType = ref.contentType;
      rs = RocketChatFile.bufferToStream(new Buffer(image, 'base64'));
      ws = RocketChatFileAvatarInstance.createWriteStream(user.username + ".jpg", contentType);
      ws.on('end', Meteor.bindEnvironment(function() {                 // 5
        return RocketChat.models.Users.setAvatarOrigin(user._id, service);
      }));                                                             //
      return rs.pipe(ws);                                              //
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v002.coffee.js.map
