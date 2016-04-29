(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var s = Package['underscorestring:underscore.string'].s;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_markdown/settings.coffee.js                                                      //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                             // 1
  RocketChat.settings.add('Markdown_Headers', false, {                                                  // 2
    type: 'boolean',                                                                                    // 2
    group: 'Message',                                                                                   // 2
    section: 'Markdown',                                                                                // 2
    "public": true                                                                                      // 2
  });                                                                                                   //
  return RocketChat.settings.add('Markdown_SupportSchemesForLink', 'http,https', {                      //
    type: 'string',                                                                                     // 3
    group: 'Message',                                                                                   // 3
    section: 'Markdown',                                                                                // 3
    "public": true,                                                                                     // 3
    i18nDescription: 'Markdown_SupportSchemesForLink_Description'                                       // 3
  });                                                                                                   //
});                                                                                                     // 1
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_markdown/markdown.coffee.js                                                      //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                        // 1
/*                                                                                                      // 1
 * Markdown is a named function that will parse markdown syntax                                         //
 * @param {Object} message - The message object                                                         //
 */                                                                                                     //
var Markdown;                                                                                           // 1
                                                                                                        //
Markdown = (function() {                                                                                // 1
  function Markdown(message) {                                                                          // 7
    var msg, schemes;                                                                                   // 8
    msg = message;                                                                                      // 8
    if (!_.isString(message)) {                                                                         // 10
      if (_.trim(message != null ? message.html : void 0)) {                                            // 11
        msg = message.html;                                                                             // 12
      } else {                                                                                          //
        return message;                                                                                 // 14
      }                                                                                                 //
    }                                                                                                   //
    if (_.isString(message)) {                                                                          // 17
      msg = msg.replace(/(^|&gt;|[ >_*~])\`([^`\r\n]+)\`([<_*~]|\B|\b|$)/gm, '$1<span class="copyonly">`</span><span><code class="inline">$2</code></span><span class="copyonly">`</span>$3');
    } else {                                                                                            //
      if (message.tokens == null) {                                                                     //
        message.tokens = [];                                                                            //
      }                                                                                                 //
      msg = msg.replace(/(^|&gt;|[ >_*~])\`([^`\r\n]+)\`([<_*~]|\B|\b|$)/gm, function(match, p1, p2, p3, offset, text) {
        var token;                                                                                      // 22
        token = "$" + (Random.id()) + "$";                                                              // 22
        message.tokens.push({                                                                           // 22
          token: token,                                                                                 // 25
          text: p1 + "<span class=\"copyonly\">`</span><span><code class=\"inline\">" + p2 + "</code></span><span class=\"copyonly\">`</span>" + p3
        });                                                                                             //
        return token;                                                                                   // 28
      });                                                                                               //
    }                                                                                                   //
    schemes = RocketChat.settings.get('Markdown_SupportSchemesForLink').split(',').join('|');           // 8
    msg = msg.replace(new RegExp("!\\[([^\\]]+)\\]\\(((?:" + schemes + "):\\/\\/[^\\)]+)\\)", 'gm'), '<a href="$2" title="$1" class="swipebox" target="_blank"><div class="inline-image" style="background-image: url($2);"></div></a>');
    msg = msg.replace(new RegExp("\\[([^\\]]+)\\]\\(((?:" + schemes + "):\\/\\/[^\\)]+)\\)", 'gm'), '<a href="$2" target="_blank">$1</a>');
    msg = msg.replace(new RegExp("(?:<|&lt;)((?:" + schemes + "):\\/\\/[^\\|]+)\\|(.+?)(?=>|&gt;)(?:>|&gt;)", 'gm'), '<a href="$1" target="_blank">$2</a>');
    if (RocketChat.settings.get('Markdown_Headers')) {                                                  // 41
      msg = msg.replace(/^# (([\w\d-_\/\*\.,\\] ?)+)/gm, '<h1>$1</h1>');                                // 43
      msg = msg.replace(/^## (([\w\d-_\/\*\.,\\] ?)+)/gm, '<h2>$1</h2>');                               // 43
      msg = msg.replace(/^### (([\w\d-_\/\*\.,\\] ?)+)/gm, '<h3>$1</h3>');                              // 43
      msg = msg.replace(/^#### (([\w\d-_\/\*\.,\\] ?)+)/gm, '<h4>$1</h4>');                             // 43
    }                                                                                                   //
    msg = msg.replace(/(^|&gt;|[ >_~`])\*{1,2}([^\*\r\n]+)\*{1,2}([<_~`]|\B|\b|$)/gm, '$1<span class="copyonly">*</span><strong>$2</strong><span class="copyonly">*</span>$3');
    msg = msg.replace(/(^|&gt;|[ >*~`])\_([^\_\r\n]+)\_([<*~`]|\B|\b|$)/gm, '$1<span class="copyonly">_</span><em>$2</em><span class="copyonly">_</span>$3');
    msg = msg.replace(/(^|&gt;|[ >_*`])\~{1,2}([^~\r\n]+)\~{1,2}([<_*`]|\B|\b|$)/gm, '$1<span class="copyonly">~</span><strike>$2</strike><span class="copyonly">~</span>$3');
    msg = msg.replace(/(?:&gt;){3}\n+([\s\S]*?)\n+(?:&lt;){3}/g, '<blockquote><span class="copyonly">&gt;&gt;&gt;</span>$1<span class="copyonly">&lt;&lt;&lt;</span></blockquote>');
    msg = msg.replace(/^&gt;(.*)$/gm, '<blockquote><span class="copyonly">&gt;</span>$1</blockquote>');
    msg = msg.replace(/\s*<blockquote>/gm, '<blockquote>');                                             // 8
    msg = msg.replace(/<\/blockquote>\s*/gm, '</blockquote>');                                          // 8
    msg = msg.replace(/<\/blockquote>\n<blockquote>/gm, '</blockquote><blockquote>');                   // 8
    if (!_.isString(message)) {                                                                         // 79
      message.html = msg;                                                                               // 80
    } else {                                                                                            //
      message = msg;                                                                                    // 82
    }                                                                                                   //
    if (typeof window !== "undefined" && window !== null ? window.rocketDebug : void 0) {               // 84
      console.log('Markdown', message);                                                                 // 84
    }                                                                                                   //
    return message;                                                                                     // 86
  }                                                                                                     //
                                                                                                        //
  return Markdown;                                                                                      //
                                                                                                        //
})();                                                                                                   //
                                                                                                        //
RocketChat.callbacks.add('renderMessage', Markdown, RocketChat.callbacks.priority.HIGH);                // 1
                                                                                                        //
RocketChat.Markdown = Markdown;                                                                         // 1
                                                                                                        //
if (Meteor.isClient) {                                                                                  // 91
  Blaze.registerHelper('RocketChatMarkdown', function(text) {                                           // 92
    return RocketChat.Markdown(text);                                                                   // 93
  });                                                                                                   //
}                                                                                                       //
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:markdown'] = {};

})();

//# sourceMappingURL=rocketchat_markdown.js.map
