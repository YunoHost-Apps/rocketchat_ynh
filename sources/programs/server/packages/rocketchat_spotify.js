(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var OEmbed = Package['rocketchat:oembed'].OEmbed;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_spotify/lib/spotify.coffee.js                                                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                                   // 1
/*                                                                                                                 // 1
 * Spotify a named function that will process Spotify links or syntaxes (ex: spotify:track:1q6IK1l4qpYykOaWaLJkWG)
 * @param {Object} message - The message object                                                                    //
 */                                                                                                                //
var Spotify;                                                                                                       // 1
                                                                                                                   //
Spotify = (function() {                                                                                            // 1
  var process;                                                                                                     // 7
                                                                                                                   //
  function Spotify() {}                                                                                            //
                                                                                                                   //
  process = function(message, source, callback) {                                                                  // 7
    var codeMatch, i, index, len, msgParts, part, results;                                                         // 8
    if (_.trim(source)) {                                                                                          // 8
      msgParts = source.split(/(```\w*[\n ]?[\s\S]*?```+?)|(`(?:[^`]+)`)/);                                        // 10
      results = [];                                                                                                // 12
      for (index = i = 0, len = msgParts.length; i < len; index = ++i) {                                           //
        part = msgParts[index];                                                                                    //
        if (((part != null ? part.length : void 0) != null) > 0) {                                                 // 14
          codeMatch = part.match(/(?:```(\w*)[\n ]?([\s\S]*?)```+?)|(?:`(?:[^`]+)`)/);                             // 15
          if (codeMatch == null) {                                                                                 // 16
            results.push(callback(message, msgParts, index, part));                                                //
          } else {                                                                                                 //
            results.push(void 0);                                                                                  //
          }                                                                                                        //
        } else {                                                                                                   //
          results.push(void 0);                                                                                    //
        }                                                                                                          //
      }                                                                                                            // 12
      return results;                                                                                              //
    }                                                                                                              //
  };                                                                                                               //
                                                                                                                   //
  Spotify.transform = function(message) {                                                                          // 7
    var changed, urls;                                                                                             // 20
    urls = [];                                                                                                     // 20
    if (Array.isArray(message.urls)) {                                                                             // 21
      urls = urls.concat(message.urls);                                                                            // 22
    }                                                                                                              //
    changed = false;                                                                                               // 20
    process(message, message.msg, function(message, msgParts, index, part) {                                       // 20
      var data, match, path, re, results, url;                                                                     // 27
      re = /(?:^|\s)spotify:([^:\s]+):([^:\s]+)(?::([^:\s]+))?(?::(\S+))?(?:\s|$)/g;                               // 27
      results = [];                                                                                                // 28
      while (match = re.exec(part)) {                                                                              //
        data = _.filter(match.slice(1), function(value) {                                                          // 29
          return value != null;                                                                                    // 30
        });                                                                                                        //
        path = _.map(data, function(value) {                                                                       // 29
          return _.escape(value);                                                                                  // 32
        }).join('/');                                                                                              //
        url = 'https://open.spotify.com/' + path;                                                                  // 29
        urls.push({                                                                                                // 29
          'url': url,                                                                                              // 35
          'source': 'spotify:' + data.join(':')                                                                    // 35
        });                                                                                                        //
        results.push(changed = true);                                                                              // 29
      }                                                                                                            //
      return results;                                                                                              //
    });                                                                                                            //
    if (changed) {                                                                                                 // 39
      message.urls = urls;                                                                                         // 40
    }                                                                                                              //
    return message;                                                                                                // 42
  };                                                                                                               //
                                                                                                                   //
  Spotify.render = function(message) {                                                                             // 7
    process(message, message.html, function(message, msgParts, index, part) {                                      // 45
      var i, item, len, quotedSource, re, ref;                                                                     // 46
      if (Array.isArray(message.urls)) {                                                                           // 46
        ref = message.urls;                                                                                        // 47
        for (i = 0, len = ref.length; i < len; i++) {                                                              // 47
          item = ref[i];                                                                                           //
          if (item.source) {                                                                                       // 48
            quotedSource = item.source.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');                                     // 49
            re = new RegExp('(^|\\s)' + quotedSource + '(\\s|$)', 'g');                                            // 49
            msgParts[index] = part.replace(re, '$1<a href="' + item.url + '" target="_blank">' + item.source + '</a>$2');
          }                                                                                                        //
        }                                                                                                          // 47
        return message.html = msgParts.join('');                                                                   //
      }                                                                                                            //
    });                                                                                                            //
    return message;                                                                                                // 54
  };                                                                                                               //
                                                                                                                   //
  return Spotify;                                                                                                  //
                                                                                                                   //
})();                                                                                                              //
                                                                                                                   //
RocketChat.callbacks.add('beforeSaveMessage', Spotify.transform, RocketChat.callbacks.priority.LOW);               // 1
                                                                                                                   //
RocketChat.callbacks.add('renderMessage', Spotify.render);                                                         // 1
                                                                                                                   //
RocketChat.Spotify = Spotify;                                                                                      // 1
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:spotify'] = {};

})();

//# sourceMappingURL=rocketchat_spotify.js.map
