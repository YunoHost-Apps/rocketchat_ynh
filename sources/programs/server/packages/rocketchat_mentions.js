(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_mentions/server.coffee.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                                       // 1
/*                                                                                                                     // 1
 * Mentions is a named function that will process Mentions                                                             //
 * @param {Object} message - The message object                                                                        //
 */                                                                                                                    //
var MentionsServer;                                                                                                    // 1
                                                                                                                       //
MentionsServer = (function() {                                                                                         // 1
  function MentionsServer(message) {                                                                                   // 7
    var channels, mentions, msgChannelRegex, msgMentionRegex, verifiedChannels, verifiedMentions;                      // 9
    mentions = [];                                                                                                     // 9
    msgMentionRegex = new RegExp('(?:^|\\s|\\n)(?:@)(' + RocketChat.settings.get('UTF8_Names_Validation') + ')', 'g');
    message.msg.replace(msgMentionRegex, function(match, mention) {                                                    // 9
      return mentions.push(mention);                                                                                   //
    });                                                                                                                //
    if (mentions.length !== 0) {                                                                                       // 13
      mentions = _.unique(mentions);                                                                                   // 14
      verifiedMentions = [];                                                                                           // 14
      mentions.forEach(function(mention) {                                                                             // 14
        var allChannel, messageMaxAll, verifiedMention;                                                                // 17
        if (mention === 'all') {                                                                                       // 17
          messageMaxAll = RocketChat.settings.get('Message_MaxAll');                                                   // 18
          if (messageMaxAll > 0) {                                                                                     // 19
            allChannel = RocketChat.models.Rooms.findOneById(message.rid);                                             // 20
            if (allChannel.usernames.length <= messageMaxAll) {                                                        // 21
              verifiedMention = {                                                                                      // 22
                _id: mention,                                                                                          // 23
                username: mention                                                                                      // 23
              };                                                                                                       //
            }                                                                                                          //
          } else {                                                                                                     //
            verifiedMention = {                                                                                        // 26
              _id: mention,                                                                                            // 27
              username: mention                                                                                        // 27
            };                                                                                                         //
          }                                                                                                            //
        } else {                                                                                                       //
          verifiedMention = Meteor.users.findOne({                                                                     // 30
            username: mention                                                                                          // 30
          }, {                                                                                                         //
            fields: {                                                                                                  // 30
              _id: 1,                                                                                                  // 30
              username: 1                                                                                              // 30
            }                                                                                                          //
          });                                                                                                          //
        }                                                                                                              //
        if (verifiedMention != null) {                                                                                 // 32
          return verifiedMentions.push(verifiedMention);                                                               //
        }                                                                                                              //
      });                                                                                                              //
      if (verifiedMentions.length !== 0) {                                                                             // 33
        message.mentions = verifiedMentions;                                                                           // 34
      }                                                                                                                //
    }                                                                                                                  //
    channels = [];                                                                                                     // 9
    msgChannelRegex = new RegExp('(?:^|\\s|\\n)(?:#)(' + RocketChat.settings.get('UTF8_Names_Validation') + ')', 'g');
    message.msg.replace(msgChannelRegex, function(match, mention) {                                                    // 9
      return channels.push(mention);                                                                                   //
    });                                                                                                                //
    if (channels.length !== 0) {                                                                                       // 41
      channels = _.unique(channels);                                                                                   // 42
      verifiedChannels = [];                                                                                           // 42
      channels.forEach(function(mention) {                                                                             // 42
        var verifiedChannel;                                                                                           // 45
        verifiedChannel = RocketChat.models.Rooms.findOneByNameAndType(mention, 'c', {                                 // 45
          fields: {                                                                                                    // 45
            _id: 1,                                                                                                    // 45
            name: 1                                                                                                    // 45
          }                                                                                                            //
        });                                                                                                            //
        if (verifiedChannel != null) {                                                                                 // 46
          return verifiedChannels.push(verifiedChannel);                                                               //
        }                                                                                                              //
      });                                                                                                              //
      if (verifiedChannels.length !== 0) {                                                                             // 48
        message.channels = verifiedChannels;                                                                           // 49
      }                                                                                                                //
    }                                                                                                                  //
    return message;                                                                                                    // 50
  }                                                                                                                    //
                                                                                                                       //
  return MentionsServer;                                                                                               //
                                                                                                                       //
})();                                                                                                                  //
                                                                                                                       //
RocketChat.callbacks.add('beforeSaveMessage', MentionsServer, RocketChat.callbacks.priority.HIGH);                     // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:mentions'] = {};

})();

//# sourceMappingURL=rocketchat_mentions.js.map
