(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var moment = Package['momentjs:moment'].moment;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/rocketchat_channel-settings-mail-messages/server/lib/startup.coffee.js                    //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                           // 1
  var permission;                                                                                     // 2
  permission = {                                                                                      // 2
    _id: 'mail-messages',                                                                             // 2
    roles: ['admin']                                                                                  // 2
  };                                                                                                  //
  return RocketChat.models.Permissions.upsert(permission._id, {                                       //
    $setOnInsert: permission                                                                          // 3
  });                                                                                                 //
});                                                                                                   // 1
                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/rocketchat_channel-settings-mail-messages/server/methods/mailMessages.coffee.js           //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                      // 1
  'mailMessages': function(data) {                                                                    // 2
    var email, emails, html, i, j, len, len1, localeFn, missing, name, ref, ref1, ref2, ref3, ref4, rfcMailPatternWithName, room, user, username;
    if (!Meteor.userId()) {                                                                           // 3
      throw new Meteor.Error('invalid-user', "[methods] mailMessages -> Invalid user");               // 4
    }                                                                                                 //
    check(data, Match.ObjectIncluding({                                                               // 3
      rid: String,                                                                                    // 6
      to_users: [String],                                                                             // 6
      to_emails: String,                                                                              // 6
      subject: String,                                                                                // 6
      messages: [String],                                                                             // 6
      language: String                                                                                // 6
    }));                                                                                              //
    room = Meteor.call('canAccessRoom', data.rid, Meteor.userId());                                   // 3
    if (!room) {                                                                                      // 9
      throw new Meteor.Error('invalid-room', "[methods] mailMessages -> Invalid room");               // 10
    }                                                                                                 //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'mail-messages')) {                          // 12
      throw new Meteor.Error('not-authorized');                                                       // 13
    }                                                                                                 //
    rfcMailPatternWithName = /^(?:.*<)?([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(?:>?)$/;
    emails = _.compact(data.to_emails.trim().split(','));                                             // 3
    missing = [];                                                                                     // 3
    if (data.to_users.length > 0) {                                                                   // 19
      ref = data.to_users;                                                                            // 20
      for (i = 0, len = ref.length; i < len; i++) {                                                   // 20
        username = ref[i];                                                                            //
        user = RocketChat.models.Users.findOneByUsername(username);                                   // 21
        if (user != null ? (ref1 = user.emails) != null ? (ref2 = ref1[0]) != null ? ref2.address : void 0 : void 0 : void 0) {
          emails.push(user.emails[0].address);                                                        // 23
        } else {                                                                                      //
          missing.push(username);                                                                     // 25
        }                                                                                             //
      }                                                                                               // 20
    }                                                                                                 //
    console.log(emails);                                                                              // 3
    for (j = 0, len1 = emails.length; j < len1; j++) {                                                // 27
      email = emails[j];                                                                              //
      if (!rfcMailPatternWithName.test(email.trim())) {                                               // 28
        throw new Meteor.Error('invalid-email', "[methods] mailMessages -> Invalid e-mail " + email);
      }                                                                                               //
    }                                                                                                 // 27
    user = Meteor.user();                                                                             // 3
    name = user.name;                                                                                 // 3
    email = (ref3 = user.emails) != null ? (ref4 = ref3[0]) != null ? ref4.address : void 0 : void 0;
    data.language = data.language.split('-').shift().toLowerCase();                                   // 3
    if (data.language !== 'en') {                                                                     // 37
      localeFn = Meteor.call('loadLocale', data.language);                                            // 38
      if (localeFn) {                                                                                 // 39
        Function(localeFn)();                                                                         // 40
      }                                                                                               //
    }                                                                                                 //
    html = "";                                                                                        // 3
    RocketChat.models.Messages.findByRoomIdAndMessageIds(data.rid, data.messages, {                   // 3
      sort: {                                                                                         // 43
        ts: 1                                                                                         // 43
      }                                                                                               //
    }).forEach(function(message) {                                                                    //
      var dateTime;                                                                                   // 44
      dateTime = moment(message.ts).locale(data.language).format('L LT');                             // 44
      return html += ("<p style='margin-bottom: 5px'><b>" + message.u.username + "</b> <span style='color: #aaa; font-size: 12px'>" + dateTime + "</span><br />") + RocketChat.Message.parse(message, data.language) + "</p>";
    });                                                                                               //
    Meteor.defer(function() {                                                                         // 3
      Email.send({                                                                                    // 48
        to: emails,                                                                                   // 49
        from: RocketChat.settings.get('From_Email'),                                                  // 49
        replyTo: email,                                                                               // 49
        subject: data.subject,                                                                        // 49
        html: html                                                                                    // 49
      });                                                                                             //
      return console.log('Sending email to ' + emails.join(', '));                                    //
    });                                                                                               //
    return {                                                                                          // 57
      success: true,                                                                                  // 57
      missing: missing                                                                                // 57
    };                                                                                                //
  }                                                                                                   //
});                                                                                                   //
                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:channel-settings-mail-messages'] = {};

})();

//# sourceMappingURL=rocketchat_channel-settings-mail-messages.js.map
