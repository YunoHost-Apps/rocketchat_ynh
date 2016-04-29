(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_tutum/startup.coffee.js                                                          //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                        // 1
/* Examples                                                                                             // 1
                                                                                                        //
DOCKERCLOUD_REDIS_HOST=redis://:password@host:6379                                                      //
DOCKERCLOUD_CLIENT_NAME=mywebsite                                                                       //
DOCKERCLOUD_CLIENT_HOST=mywebsite.dotcloud.com                                                          //
 */                                                                                                     //
var client, day, inactiveDays, redis, terminateAppIfInactive;                                           // 1
                                                                                                        //
if (process.env.DOCKERCLOUD_REDIS_HOST != null) {                                                       // 8
  redis = Npm.require('redis');                                                                         // 9
  client = redis.createClient(process.env.DOCKERCLOUD_REDIS_HOST);                                      // 9
  client.del("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST);                                        // 9
  client.rpush("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, process.env.DOCKERCLOUD_CLIENT_NAME);
  client.rpush("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, "http://" + (process.env.DOCKERCLOUD_IP_ADDRESS.split('/')[0]) + ":3000");
  process.on('SIGTERM', function() {                                                                    // 9
    return client.expire("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, 90);                        //
  });                                                                                                   //
  day = 86400000;                                                                                       // 9
  inactiveDays = 30;                                                                                    // 9
  if (!isNaN(parseInt(process.env.DOCKERCLOUD_REDIS_INACTIVE_DAYS))) {                                  // 25
    inactiveDays = parseInt(process.env.DOCKERCLOUD_REDIS_INACTIVE_DAYS);                               // 26
  }                                                                                                     //
  terminateAppIfInactive = function() {                                                                 // 9
    var subscription;                                                                                   // 29
    subscription = RocketChat.models.Subscriptions.findOne({                                            // 29
      ls: {                                                                                             // 29
        $exists: true                                                                                   // 29
      }                                                                                                 //
    }, {                                                                                                //
      sort: {                                                                                           // 29
        ls: -1                                                                                          // 29
      },                                                                                                //
      fields: {                                                                                         // 29
        ls: 1                                                                                           // 29
      }                                                                                                 //
    });                                                                                                 //
    if ((subscription == null) || Date.now() - subscription.ls > inactiveDays * day) {                  // 31
      client.del("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST);                                    // 32
      return process.exit(0);                                                                           //
    }                                                                                                   //
  };                                                                                                    //
  Meteor.setInterval(function() {                                                                       // 9
    var now;                                                                                            // 36
    now = new Date();                                                                                   // 36
    if (now.getHours() === 4 && now.getMinutes() === 0) {                                               // 37
      return terminateAppIfInactive();                                                                  //
    }                                                                                                   //
  }, 60000);                                                                                            //
}                                                                                                       //
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:tutum'] = {};

})();

//# sourceMappingURL=rocketchat_tutum.js.map
