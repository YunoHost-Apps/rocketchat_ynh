(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/initialData.coffee.js                                //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                            // 1
  return Meteor.defer(function() {                                     //
    var adminUser, id, nameValidation, oldestUser, re, rs, ws;         // 4
    if (RocketChat.models.Rooms.findOneById('GENERAL') == null) {      // 4
      RocketChat.models.Rooms.createWithIdTypeAndName('GENERAL', 'c', 'general', {
        "default": true                                                // 6
      });                                                              //
    }                                                                  //
    if (RocketChat.models.Users.findOneById('rocket.cat') == null) {   // 8
      RocketChat.models.Users.create({                                 // 9
        _id: 'rocket.cat',                                             // 10
        name: "Rocket.Cat",                                            // 10
        username: 'rocket.cat',                                        // 10
        status: "online",                                              // 10
        statusDefault: "online",                                       // 10
        utcOffset: 0,                                                  // 10
        active: true,                                                  // 10
        type: 'bot'                                                    // 10
      });                                                              //
      rs = RocketChatFile.bufferToStream(new Buffer(Assets.getBinary('avatars/rocketcat.png'), 'utf8'));
      RocketChatFileAvatarInstance.deleteFile("rocket.cat.jpg");       // 9
      ws = RocketChatFileAvatarInstance.createWriteStream("rocket.cat.jpg", 'image/png');
      ws.on('end', Meteor.bindEnvironment(function() {                 // 9
        return RocketChat.models.Users.setAvatarOrigin('rocket.cat', 'local');
      }));                                                             //
      rs.pipe(ws);                                                     // 9
    }                                                                  //
    if (process.env.ADMIN_PASS != null) {                              // 28
      if (_.isEmpty(RocketChat.authz.getUsersInRole('admin').fetch())) {
        console.log('Inserting admin user:'.green);                    // 30
        adminUser = {                                                  // 30
          name: "Administrator",                                       // 33
          username: "admin",                                           // 33
          status: "offline",                                           // 33
          statusDefault: "online",                                     // 33
          utcOffset: 0,                                                // 33
          active: true                                                 // 33
        };                                                             //
        if (process.env.ADMIN_NAME != null) {                          // 40
          adminUser.name = process.env.ADMIN_NAME;                     // 41
        }                                                              //
        console.log(("Name: " + adminUser.name).green);                // 30
        if (process.env.ADMIN_EMAIL != null) {                         // 44
          re = /^[^@].*@[^@]+$/i;                                      // 45
          if (re.test(process.env.ADMIN_EMAIL)) {                      // 46
            if (!RocketChat.models.Users.findOneByEmailAddress(process.env.ADMIN_EMAIL)) {
              adminUser.emails = [                                     // 48
                {                                                      //
                  address: process.env.ADMIN_EMAIL,                    // 49
                  verified: true                                       // 49
                }                                                      //
              ];                                                       //
              console.log(("Email: " + process.env.ADMIN_EMAIL).green);
            } else {                                                   //
              console.log('E-mail provided already exists; Ignoring environment variables ADMIN_EMAIL'.red);
            }                                                          //
          } else {                                                     //
            console.log('E-mail provided is invalid; Ignoring environment variables ADMIN_EMAIL'.red);
          }                                                            //
        }                                                              //
        if (process.env.ADMIN_USERNAME != null) {                      // 58
          try {                                                        // 59
            nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$');
          } catch (_error) {                                           //
            nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$');          // 62
          }                                                            //
          if (nameValidation.test(process.env.ADMIN_USERNAME)) {       // 63
            if (RocketChat.checkUsernameAvailability(process.env.ADMIN_USERNAME)) {
              adminUser.username = process.env.ADMIN_USERNAME;         // 65
            } else {                                                   //
              console.log('Username provided already exists; Ignoring environment variables ADMIN_USERNAME'.red);
            }                                                          //
          } else {                                                     //
            console.log('Username provided is invalid; Ignoring environment variables ADMIN_USERNAME'.red);
          }                                                            //
        }                                                              //
        console.log(("Username: " + adminUser.username).green);        // 30
        id = RocketChat.models.Users.create(adminUser);                // 30
        Accounts.setPassword(id, process.env.ADMIN_PASS);              // 30
        console.log(("Password: " + process.env.ADMIN_PASS).green);    // 30
        RocketChat.authz.addUserRoles(id, 'admin');                    // 30
      } else {                                                         //
        console.log('Users with admin role already exist; Ignoring environment variables ADMIN_PASS'.red);
      }                                                                //
    }                                                                  //
    if (_.isEmpty(RocketChat.authz.getUsersInRole('admin').fetch())) {
      oldestUser = RocketChat.models.Users.findOne({                   // 84
        _id: {                                                         // 84
          $ne: 'rocket.cat'                                            // 84
        }                                                              //
      }, {                                                             //
        fields: {                                                      // 84
          username: 1                                                  // 84
        },                                                             //
        sort: {                                                        // 84
          createdAt: 1                                                 // 84
        }                                                              //
      });                                                              //
      if (oldestUser) {                                                // 85
        RocketChat.authz.addUserRoles(oldestUser._id, 'admin');        // 86
        return console.log("No admins are found. Set " + oldestUser.username + " as admin for being the oldest user");
      }                                                                //
    }                                                                  //
  });                                                                  //
});                                                                    // 1
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=initialData.coffee.js.map
