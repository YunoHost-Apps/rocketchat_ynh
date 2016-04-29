(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, WebRTC;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_webrtc/server/settings.coffee.js              //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.settings.addGroup('WebRTC', function() {                  // 1
  this.add('WebRTC_Enable_Channel', false, {                         // 2
    type: 'boolean',                                                 // 2
    group: 'WebRTC',                                                 // 2
    "public": true                                                   // 2
  });                                                                //
  this.add('WebRTC_Enable_Private', true, {                          // 2
    type: 'boolean',                                                 // 3
    group: 'WebRTC',                                                 // 3
    "public": true                                                   // 3
  });                                                                //
  this.add('WebRTC_Enable_Direct', true, {                           // 2
    type: 'boolean',                                                 // 4
    group: 'WebRTC',                                                 // 4
    "public": true                                                   // 4
  });                                                                //
  return this.add('WebRTC_Servers', 'stun:stun.l.google.com:19302, stun:23.21.150.121, team%40rocket.chat:demo@turn:numb.viagenie.ca:3478', {
    type: 'string',                                                  // 5
    group: 'WebRTC',                                                 // 5
    "public": true                                                   // 5
  });                                                                //
});                                                                  // 1
                                                                     //
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:webrtc'] = {
  WebRTC: WebRTC
};

})();

//# sourceMappingURL=rocketchat_webrtc.js.map
