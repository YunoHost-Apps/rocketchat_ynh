(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, Mailer;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/rocketchat_mailer/lib/Mailer.coffee.js                                                           //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                             // 1
                                                                                                             //
Mailer = {};                                                                                                 // 1
                                                                                                             //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/rocketchat_mailer/server/startup.coffee.js                                                       //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                  // 1
  return RocketChat.models.Permissions.upsert('access-mailer', {                                             //
    $setOnInsert: {                                                                                          // 2
      _id: 'access-mailer',                                                                                  // 2
      roles: ['admin']                                                                                       // 2
    }                                                                                                        //
  });                                                                                                        //
});                                                                                                          // 1
                                                                                                             //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/rocketchat_mailer/server/models/Users.coffee.js                                                  //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.models.Users.RocketMailUnsubscribe = function(_id, createdAt) {                                   // 3
  var affectedRows, query, update;                                                                           // 5
  query = {                                                                                                  // 5
    _id: _id,                                                                                                // 6
    createdAt: new Date(parseInt(createdAt))                                                                 // 6
  };                                                                                                         //
  update = {                                                                                                 // 5
    $set: {                                                                                                  // 10
      "mailer.unsubscribed": true                                                                            // 11
    }                                                                                                        //
  };                                                                                                         //
  affectedRows = this.update(query, update);                                                                 // 5
  console.log('[Mailer:Unsubscribe]', _id, createdAt, new Date(parseInt(createdAt)), affectedRows);          // 5
  return affectedRows;                                                                                       // 17
};                                                                                                           // 3
                                                                                                             //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/rocketchat_mailer/server/functions/sendMail.coffee.js                                            //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Mailer.sendMail = function(from, subject, body, dryrun, query) {                                             // 1
  var rfcMailPatternWithName, userQuery;                                                                     // 3
  rfcMailPatternWithName = /^(?:.*<)?([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(?:>?)$/;
  if (!rfcMailPatternWithName.test(from)) {                                                                  // 6
    throw new Meteor.Error('invalid-from-address', TAPi18n.__('You_informed_an_invalid_FROM_address'));      // 7
  }                                                                                                          //
  if (body.indexOf('[unsubscribe]') === -1) {                                                                // 9
    throw new Meteor.Error('missing-unsubscribe-link', TAPi18n.__('You_must_provide_the_unsubscribe_link'));
  }                                                                                                          //
  userQuery = {                                                                                              // 3
    "mailer.unsubscribed": {                                                                                 // 12
      $exists: 0                                                                                             // 12
    }                                                                                                        //
  };                                                                                                         //
  if (query) {                                                                                               // 13
    userQuery = {                                                                                            // 14
      $and: [userQuery, EJSON.parse(query)]                                                                  // 14
    };                                                                                                       //
  }                                                                                                          //
  if (dryrun) {                                                                                              // 16
    return Meteor.users.find({                                                                               //
      "emails.address": from                                                                                 // 17
    }).forEach(function(user) {                                                                              //
      var email, fname, html, lname, ref, ref1;                                                              // 19
      email = (ref = user.emails) != null ? (ref1 = ref[0]) != null ? ref1.address : void 0 : void 0;        // 19
      html = body.replace(/\[unsubscribe\]/g, Meteor.absoluteUrl(FlowRouter.path('mailer/unsubscribe/:_id/:createdAt', {
        _id: user._id,                                                                                       // 21
        createdAt: user.createdAt.getTime()                                                                  // 21
      })));                                                                                                  //
      html = html.replace(/\[name\]/g, user.name);                                                           // 19
      fname = _.strLeft(user.name, ' ');                                                                     // 19
      lname = _.strRightBack(user.name, ' ');                                                                // 19
      html = html.replace(/\[fname\]/g, fname);                                                              // 19
      html = html.replace(/\[lname\]/g, lname);                                                              // 19
      html = html.replace(/\[email\]/g, email);                                                              // 19
      html = html.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');                            // 19
      email = user.name + " <" + email + ">";                                                                // 19
      if (rfcMailPatternWithName.test(email)) {                                                              // 32
        Meteor.defer(function() {                                                                            // 33
          return Email.send({                                                                                //
            to: email,                                                                                       // 35
            from: from,                                                                                      // 35
            subject: subject,                                                                                // 35
            html: html                                                                                       // 35
          });                                                                                                //
        });                                                                                                  //
        return console.log('Sending email to ' + email);                                                     //
      }                                                                                                      //
    });                                                                                                      //
  } else {                                                                                                   //
    return Meteor.users.find({                                                                               //
      "mailer.unsubscribed": {                                                                               // 43
        $exists: 0                                                                                           // 43
      }                                                                                                      //
    }).forEach(function(user) {                                                                              //
      var email, fname, html, lname, ref, ref1;                                                              // 45
      email = (ref = user.emails) != null ? (ref1 = ref[0]) != null ? ref1.address : void 0 : void 0;        // 45
      html = body.replace(/\[unsubscribe\]/g, Meteor.absoluteUrl(FlowRouter.path('mailer/unsubscribe/:_id/:createdAt', {
        _id: user._id,                                                                                       // 47
        createdAt: user.createdAt.getTime()                                                                  // 47
      })));                                                                                                  //
      html = html.replace(/\[name\]/g, user.name);                                                           // 45
      fname = _.strLeft(user.name, ' ');                                                                     // 45
      lname = _.strRightBack(user.name, ' ');                                                                // 45
      html = html.replace(/\[fname\]/g, fname);                                                              // 45
      html = html.replace(/\[lname\]/g, lname);                                                              // 45
      html = html.replace(/\[email\]/g, email);                                                              // 45
      html = html.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');                            // 45
      email = user.name + " <" + email + ">";                                                                // 45
      if (rfcMailPatternWithName.test(email)) {                                                              // 58
        Meteor.defer(function() {                                                                            // 59
          return Email.send({                                                                                //
            to: email,                                                                                       // 61
            from: from,                                                                                      // 61
            subject: subject,                                                                                // 61
            html: html                                                                                       // 61
          });                                                                                                //
        });                                                                                                  //
        return console.log('Sending email to ' + email);                                                     //
      }                                                                                                      //
    });                                                                                                      //
  }                                                                                                          //
};                                                                                                           // 1
                                                                                                             //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/rocketchat_mailer/server/functions/unsubscribe.coffee.js                                         //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Mailer.unsubscribe = function(_id, createdAt) {                                                              // 1
  if (_id && createdAt) {                                                                                    // 2
    return RocketChat.models.Users.RocketMailUnsubscribe(_id, createdAt) === 1;                              // 3
  }                                                                                                          //
  return false;                                                                                              // 4
};                                                                                                           // 1
                                                                                                             //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/rocketchat_mailer/server/methods/sendMail.coffee.js                                              //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                             // 1
  'Mailer.sendMail': function(from, subject, body, dryrun, query) {                                          // 2
    return Mailer.sendMail(from, subject, body, dryrun, query);                                              // 4
  }                                                                                                          //
});                                                                                                          //
                                                                                                             //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/rocketchat_mailer/server/methods/unsubscribe.coffee.js                                           //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                             // 1
  'Mailer:unsubscribe': function(_id, createdAt) {                                                           // 2
    return Mailer.unsubscribe(_id, createdAt);                                                               // 3
  }                                                                                                          //
});                                                                                                          //
                                                                                                             //
DDPRateLimiter.addRule({                                                                                     // 1
  type: 'method',                                                                                            // 7
  name: 'Mailer:unsubscribe',                                                                                // 7
  connectionId: function() {                                                                                 // 7
    return true;                                                                                             // 9
  }                                                                                                          //
}, 1, 60000);                                                                                                //
                                                                                                             //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:mailer'] = {
  Mailer: Mailer
};

})();

//# sourceMappingURL=rocketchat_mailer.js.map
