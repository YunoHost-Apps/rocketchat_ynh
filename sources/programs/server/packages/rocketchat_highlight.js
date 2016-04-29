(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var hljs = Package['simple:highlight.js'].hljs;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/rocketchat_highlight/highlight.coffee.js                                            //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                // 1
/*                                                                                              // 1
 * Highlight is a named function that will highlight ``` messages                               //
 * @param {Object} message - The message object                                                 //
 */                                                                                             //
var Highlight,                                                                                  // 1
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                //
Highlight = (function() {                                                                       // 1
  function Highlight(message) {                                                                 // 8
    var code, codeMatch, count, i, index, lang, len, msgParts, part, result, singleLine, token;
    if (s.trim(message.html)) {                                                                 // 10
      if (message.tokens == null) {                                                             //
        message.tokens = [];                                                                    //
      }                                                                                         //
      count = (message.html.match(/```/g) || []).length;                                        // 11
      if (count) {                                                                              // 16
        if (count % 2 > 0) {                                                                    // 19
          message.html = message.html + "\n```";                                                // 20
          message.msg = message.msg + "\n```";                                                  // 20
        }                                                                                       //
        msgParts = message.html.split(/(```\w*[\n\ ]?[\s\S]*?```+?)/);                          // 19
        for (index = i = 0, len = msgParts.length; i < len; index = ++i) {                      // 26
          part = msgParts[index];                                                               //
          codeMatch = part.match(/```(\w*)[\n\ ]?([\s\S]*?)```+?/);                             // 28
          if (codeMatch != null) {                                                              // 29
            singleLine = codeMatch[0].indexOf('\n') === -1;                                     // 31
            if (singleLine) {                                                                   // 33
              lang = '';                                                                        // 34
              code = _.unescapeHTML(codeMatch[1] + ' ' + codeMatch[2]);                         // 34
            } else {                                                                            //
              lang = codeMatch[1];                                                              // 37
              code = _.unescapeHTML(codeMatch[2]);                                              // 37
            }                                                                                   //
            if (indexOf.call(hljs.listLanguages(), lang) < 0) {                                 // 40
              result = hljs.highlightAuto(code);                                                // 41
            } else {                                                                            //
              result = hljs.highlight(lang, code);                                              // 43
            }                                                                                   //
            token = "$" + (Random.id()) + "$";                                                  // 31
            message.tokens.push({                                                               // 31
              highlight: true,                                                                  // 48
              token: token,                                                                     // 48
              text: "<pre><code class='hljs " + result.language + "'><span class='copyonly'>```<br></span>" + result.value + "<span class='copyonly'><br>```</span></code></pre>"
            });                                                                                 //
            msgParts[index] = token;                                                            // 31
          } else {                                                                              //
            msgParts[index] = part;                                                             // 54
          }                                                                                     //
        }                                                                                       // 26
        message.html = msgParts.join('');                                                       // 19
      }                                                                                         //
    }                                                                                           //
    return message;                                                                             // 59
  }                                                                                             //
                                                                                                //
  return Highlight;                                                                             //
                                                                                                //
})();                                                                                           //
                                                                                                //
RocketChat.callbacks.add('renderMessage', Highlight, RocketChat.callbacks.priority.HIGH);       // 1
                                                                                                //
RocketChat.Highlight = true;                                                                    // 1
                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:highlight'] = {};

})();

//# sourceMappingURL=rocketchat_highlight.js.map
