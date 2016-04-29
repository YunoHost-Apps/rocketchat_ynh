(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var Babel = Package['babel-compiler'].Babel;
var BabelCompiler = Package['babel-compiler'].BabelCompiler;
var hljs = Package['simple:highlight.js'].hljs;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, logger;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/lib/rocketchat.coffee.js                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.integrations = {};                                                                                        // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/client/stylesheets/load.coffee.js                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.theme.addPackageAsset(function() {                                                                        // 1
  return Assets.getText('client/stylesheets/integrations.less');                                                     // 2
});                                                                                                                  // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/logger.js                                                                 //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* globals logger:true */                                                                                            //
/* exported logger */                                                                                                //
                                                                                                                     //
logger = new Logger('Integrations', {                                                                                // 4
	sections: {                                                                                                         // 5
		incoming: 'Incoming WebHook',                                                                                      // 6
		outgoing: 'Outgoing WebHook'                                                                                       // 7
	}                                                                                                                   //
});                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/models/Integrations.coffee.js                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                       //
                                                                                                                     //
RocketChat.models.Integrations = new ((function(superClass) {                                                        // 1
  extend(_Class, superClass);                                                                                        // 2
                                                                                                                     //
  function _Class() {                                                                                                // 2
    this._initModel('integrations');                                                                                 // 3
  }                                                                                                                  //
                                                                                                                     //
  return _Class;                                                                                                     //
                                                                                                                     //
})(RocketChat.models._Base));                                                                                        //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/publications/integrations.coffee.js                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('integrations', function() {                                                                          // 1
  if (!this.userId) {                                                                                                // 2
    return this.ready();                                                                                             // 3
  }                                                                                                                  //
  if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                         // 5
    throw new Meteor.Error("not-authorized");                                                                        // 6
  }                                                                                                                  //
  return RocketChat.models.Integrations.find();                                                                      // 8
});                                                                                                                  // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/incoming/addIncomingIntegration.coffee.js                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                     // 1
  addIncomingIntegration: function(integration) {                                                                    // 2
    var babelOptions, channel, channelType, e, record, ref, token, user;                                             // 3
    if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                       // 3
      throw new Meteor.Error('not_authorized');                                                                      // 4
    }                                                                                                                //
    if (!_.isString(integration.channel)) {                                                                          // 6
      throw new Meteor.Error('invalid_channel', '[methods] addIncomingIntegration -> channel must be string');       // 7
    }                                                                                                                //
    if (integration.channel.trim() === '') {                                                                         // 9
      throw new Meteor.Error('invalid_channel', '[methods] addIncomingIntegration -> channel can\'t be empty');      // 10
    }                                                                                                                //
    if ((ref = integration.channel[0]) !== '@' && ref !== '#') {                                                     // 12
      throw new Meteor.Error('invalid_channel', '[methods] addIncomingIntegration -> channel should start with # or @');
    }                                                                                                                //
    if (!_.isString(integration.username)) {                                                                         // 15
      throw new Meteor.Error('invalid_username', '[methods] addIncomingIntegration -> username must be string');     // 16
    }                                                                                                                //
    if (integration.username.trim() === '') {                                                                        // 18
      throw new Meteor.Error('invalid_username', '[methods] addIncomingIntegration -> username can\'t be empty');    // 19
    }                                                                                                                //
    if (integration.scriptEnabled === true && (integration.script != null) && integration.script.trim() !== '') {    // 21
      try {                                                                                                          // 22
        babelOptions = Babel.getDefaultOptions();                                                                    // 23
        babelOptions.externalHelpers = false;                                                                        // 23
        integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                           // 23
        integration.scriptError = void 0;                                                                            // 23
      } catch (_error) {                                                                                             //
        e = _error;                                                                                                  // 29
        integration.scriptCompiled = void 0;                                                                         // 29
        integration.scriptError = _.pick(e, 'name', 'message', 'pos', 'loc', 'codeFrame');                           // 29
      }                                                                                                              //
    }                                                                                                                //
    record = void 0;                                                                                                 // 3
    channelType = integration.channel[0];                                                                            // 3
    channel = integration.channel.substr(1);                                                                         // 3
    switch (channelType) {                                                                                           // 36
      case '#':                                                                                                      // 36
        record = RocketChat.models.Rooms.findOne({                                                                   // 38
          $or: [                                                                                                     // 39
            {                                                                                                        //
              _id: channel                                                                                           // 40
            }, {                                                                                                     //
              name: channel                                                                                          // 41
            }                                                                                                        //
          ]                                                                                                          //
        });                                                                                                          //
        break;                                                                                                       // 37
      case '@':                                                                                                      // 36
        record = RocketChat.models.Users.findOne({                                                                   // 44
          $or: [                                                                                                     // 45
            {                                                                                                        //
              _id: channel                                                                                           // 46
            }, {                                                                                                     //
              username: channel                                                                                      // 47
            }                                                                                                        //
          ]                                                                                                          //
        });                                                                                                          //
    }                                                                                                                // 36
    if (record === void 0) {                                                                                         // 50
      throw new Meteor.Error('channel_does_not_exists', "[methods] addIncomingIntegration -> The channel does not exists");
    }                                                                                                                //
    user = RocketChat.models.Users.findOne({                                                                         // 3
      username: integration.username                                                                                 // 53
    });                                                                                                              //
    if (user == null) {                                                                                              // 55
      throw new Meteor.Error('user_does_not_exists', "[methods] addIncomingIntegration -> The username does not exists");
    }                                                                                                                //
    token = Random.id(48);                                                                                           // 3
    integration.type = 'webhook-incoming';                                                                           // 3
    integration.token = token;                                                                                       // 3
    integration.userId = user._id;                                                                                   // 3
    integration._createdAt = new Date;                                                                               // 3
    integration._createdBy = RocketChat.models.Users.findOne(this.userId, {                                          // 3
      fields: {                                                                                                      // 64
        username: 1                                                                                                  // 64
      }                                                                                                              //
    });                                                                                                              //
    RocketChat.models.Roles.addUserRoles(user._id, 'bot');                                                           // 3
    integration._id = RocketChat.models.Integrations.insert(integration);                                            // 3
    return integration;                                                                                              // 70
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/incoming/updateIncomingIntegration.coffee.js                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                     // 1
  updateIncomingIntegration: function(integrationId, integration) {                                                  // 2
    var babelOptions, channel, channelType, currentIntegration, e, record, ref, user;                                // 3
    if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                       // 3
      throw new Meteor.Error('not_authorized');                                                                      // 4
    }                                                                                                                //
    if (!_.isString(integration.channel)) {                                                                          // 6
      throw new Meteor.Error('invalid_channel', '[methods] updateIncomingIntegration -> channel must be string');    // 7
    }                                                                                                                //
    if (integration.channel.trim() === '') {                                                                         // 9
      throw new Meteor.Error('invalid_channel', '[methods] updateIncomingIntegration -> channel can\'t be empty');   // 10
    }                                                                                                                //
    if ((ref = integration.channel[0]) !== '@' && ref !== '#') {                                                     // 12
      throw new Meteor.Error('invalid_channel', '[methods] updateIncomingIntegration -> channel should start with # or @');
    }                                                                                                                //
    currentIntegration = RocketChat.models.Integrations.findOne(integrationId);                                      // 3
    if (currentIntegration == null) {                                                                                // 16
      throw new Meteor.Error('invalid_integration', '[methods] updateIncomingIntegration -> integration not found');
    }                                                                                                                //
    if (integration.scriptEnabled === true && (integration.script != null) && integration.script.trim() !== '') {    // 19
      try {                                                                                                          // 20
        babelOptions = Babel.getDefaultOptions();                                                                    // 21
        babelOptions.externalHelpers = false;                                                                        // 21
        integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                           // 21
        integration.scriptError = void 0;                                                                            // 21
      } catch (_error) {                                                                                             //
        e = _error;                                                                                                  // 27
        integration.scriptCompiled = void 0;                                                                         // 27
        integration.scriptError = _.pick(e, 'name', 'message', 'pos', 'loc', 'codeFrame');                           // 27
      }                                                                                                              //
    }                                                                                                                //
    record = void 0;                                                                                                 // 3
    channelType = integration.channel[0];                                                                            // 3
    channel = integration.channel.substr(1);                                                                         // 3
    switch (channelType) {                                                                                           // 34
      case '#':                                                                                                      // 34
        record = RocketChat.models.Rooms.findOne({                                                                   // 36
          $or: [                                                                                                     // 37
            {                                                                                                        //
              _id: channel                                                                                           // 38
            }, {                                                                                                     //
              name: channel                                                                                          // 39
            }                                                                                                        //
          ]                                                                                                          //
        });                                                                                                          //
        break;                                                                                                       // 35
      case '@':                                                                                                      // 34
        record = RocketChat.models.Users.findOne({                                                                   // 42
          $or: [                                                                                                     // 43
            {                                                                                                        //
              _id: channel                                                                                           // 44
            }, {                                                                                                     //
              username: channel                                                                                      // 45
            }                                                                                                        //
          ]                                                                                                          //
        });                                                                                                          //
    }                                                                                                                // 34
    if (record === void 0) {                                                                                         // 48
      throw new Meteor.Error('channel_does_not_exists', "[methods] updateIncomingIntegration -> The channel does not exists");
    }                                                                                                                //
    user = RocketChat.models.Users.findOne({                                                                         // 3
      username: currentIntegration.username                                                                          // 51
    });                                                                                                              //
    RocketChat.models.Roles.addUserRoles(user._id, 'bot');                                                           // 3
    RocketChat.models.Integrations.update(integrationId, {                                                           // 3
      $set: {                                                                                                        // 55
        enabled: integration.enabled,                                                                                // 56
        name: integration.name,                                                                                      // 56
        avatar: integration.avatar,                                                                                  // 56
        emoji: integration.emoji,                                                                                    // 56
        alias: integration.alias,                                                                                    // 56
        channel: integration.channel,                                                                                // 56
        script: integration.script,                                                                                  // 56
        scriptEnabled: integration.scriptEnabled,                                                                    // 56
        scriptCompiled: integration.scriptCompiled,                                                                  // 56
        scriptError: integration.scriptError,                                                                        // 56
        _updatedAt: new Date,                                                                                        // 56
        _updatedBy: RocketChat.models.Users.findOne(this.userId, {                                                   // 56
          fields: {                                                                                                  // 67
            username: 1                                                                                              // 67
          }                                                                                                          //
        })                                                                                                           //
      }                                                                                                              //
    });                                                                                                              //
    return RocketChat.models.Integrations.findOne(integrationId);                                                    // 69
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/incoming/deleteIncomingIntegration.coffee.js                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                     // 1
  deleteIncomingIntegration: function(integrationId) {                                                               // 2
    var integration;                                                                                                 // 3
    if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                       // 3
      throw new Meteor.Error('not_authorized');                                                                      // 4
    }                                                                                                                //
    integration = RocketChat.models.Integrations.findOne(integrationId);                                             // 3
    if (integration == null) {                                                                                       // 8
      throw new Meteor.Error('invalid_integration', '[methods] deleteIncomingIntegration -> integration not found');
    }                                                                                                                //
    RocketChat.models.Integrations.remove({                                                                          // 3
      _id: integrationId                                                                                             // 11
    });                                                                                                              //
    return true;                                                                                                     // 13
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/outgoing/addOutgoingIntegration.coffee.js                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                     // 1
  addOutgoingIntegration: function(integration) {                                                                    // 2
    var babelOptions, channel, channelType, e, i, index, j, len, len1, record, ref, ref1, ref2, ref3, triggerWord, url, user;
    if ((((ref = integration.channel) != null ? ref.trim : void 0) != null) && integration.channel.trim() === '') {  // 3
      delete integration.channel;                                                                                    // 4
    }                                                                                                                //
    if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations') && !RocketChat.authz.hasPermission(this.userId, 'manage-integrations', 'bot')) {
      throw new Meteor.Error('not_authorized');                                                                      // 7
    }                                                                                                                //
    if (integration.username.trim() === '') {                                                                        // 9
      throw new Meteor.Error('invalid_username', '[methods] addOutgoingIntegration -> username can\'t be empty');    // 10
    }                                                                                                                //
    if (!Match.test(integration.urls, [String])) {                                                                   // 12
      throw new Meteor.Error('invalid_urls', '[methods] addOutgoingIntegration -> urls must be an array');           // 13
    }                                                                                                                //
    ref1 = integration.urls;                                                                                         // 15
    for (index = i = 0, len = ref1.length; i < len; index = ++i) {                                                   // 15
      url = ref1[index];                                                                                             //
      if (url.trim() === '') {                                                                                       // 16
        delete integration.urls[index];                                                                              // 16
      }                                                                                                              //
    }                                                                                                                // 15
    integration.urls = _.without(integration.urls, [void 0]);                                                        // 3
    if (integration.urls.length === 0) {                                                                             // 20
      throw new Meteor.Error('invalid_urls', '[methods] addOutgoingIntegration -> urls is required');                // 21
    }                                                                                                                //
    if ((integration.channel != null) && ((ref2 = integration.channel[0]) !== '@' && ref2 !== '#')) {                // 23
      throw new Meteor.Error('invalid_channel', '[methods] addOutgoingIntegration -> channel should start with # or @');
    }                                                                                                                //
    if (integration.triggerWords != null) {                                                                          // 26
      if (!Match.test(integration.triggerWords, [String])) {                                                         // 27
        throw new Meteor.Error('invalid_triggerWords', '[methods] addOutgoingIntegration -> triggerWords must be an array');
      }                                                                                                              //
      ref3 = integration.triggerWords;                                                                               // 30
      for (index = j = 0, len1 = ref3.length; j < len1; index = ++j) {                                               // 30
        triggerWord = ref3[index];                                                                                   //
        if (triggerWord.trim() === '') {                                                                             // 31
          delete integration.triggerWords[index];                                                                    // 31
        }                                                                                                            //
      }                                                                                                              // 30
      integration.triggerWords = _.without(integration.triggerWords, [void 0]);                                      // 27
    }                                                                                                                //
    if (integration.scriptEnabled === true && (integration.script != null) && integration.script.trim() !== '') {    // 35
      try {                                                                                                          // 36
        babelOptions = Babel.getDefaultOptions();                                                                    // 37
        babelOptions.externalHelpers = false;                                                                        // 37
        integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                           // 37
        integration.scriptError = void 0;                                                                            // 37
      } catch (_error) {                                                                                             //
        e = _error;                                                                                                  // 43
        integration.scriptCompiled = void 0;                                                                         // 43
        integration.scriptError = _.pick(e, 'name', 'message', 'pos', 'loc', 'codeFrame');                           // 43
      }                                                                                                              //
    }                                                                                                                //
    if (integration.channel != null) {                                                                               // 47
      record = void 0;                                                                                               // 48
      channelType = integration.channel[0];                                                                          // 48
      channel = integration.channel.substr(1);                                                                       // 48
      switch (channelType) {                                                                                         // 52
        case '#':                                                                                                    // 52
          record = RocketChat.models.Rooms.findOne({                                                                 // 54
            $or: [                                                                                                   // 55
              {                                                                                                      //
                _id: channel                                                                                         // 56
              }, {                                                                                                   //
                name: channel                                                                                        // 57
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
          break;                                                                                                     // 53
        case '@':                                                                                                    // 52
          record = RocketChat.models.Users.findOne({                                                                 // 60
            $or: [                                                                                                   // 61
              {                                                                                                      //
                _id: channel                                                                                         // 62
              }, {                                                                                                   //
                username: channel                                                                                    // 63
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
      }                                                                                                              // 52
      if (record === void 0) {                                                                                       // 66
        throw new Meteor.Error('channel_does_not_exists', "[methods] addOutgoingIntegration -> The channel does not exists");
      }                                                                                                              //
    }                                                                                                                //
    user = RocketChat.models.Users.findOne({                                                                         // 3
      username: integration.username                                                                                 // 69
    });                                                                                                              //
    if (user == null) {                                                                                              // 71
      throw new Meteor.Error('user_does_not_exists', "[methods] addOutgoingIntegration -> The username does not exists");
    }                                                                                                                //
    integration.type = 'webhook-outgoing';                                                                           // 3
    integration.userId = user._id;                                                                                   // 3
    integration._createdAt = new Date;                                                                               // 3
    integration._createdBy = RocketChat.models.Users.findOne(this.userId, {                                          // 3
      fields: {                                                                                                      // 77
        username: 1                                                                                                  // 77
      }                                                                                                              //
    });                                                                                                              //
    integration._id = RocketChat.models.Integrations.insert(integration);                                            // 3
    return integration;                                                                                              // 81
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/outgoing/updateOutgoingIntegration.coffee.js                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                     // 1
  updateOutgoingIntegration: function(integrationId, integration) {                                                  // 2
    var babelOptions, channel, channelType, e, i, index, j, len, len1, record, ref, ref1, ref2, ref3, triggerWord, url, user;
    if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                       // 3
      throw new Meteor.Error('not_authorized');                                                                      // 4
    }                                                                                                                //
    if (integration.username.trim() === '') {                                                                        // 6
      throw new Meteor.Error('invalid_username', '[methods] updateOutgoingIntegration -> username can\'t be empty');
    }                                                                                                                //
    if (!Match.test(integration.urls, [String])) {                                                                   // 9
      throw new Meteor.Error('invalid_urls', '[methods] updateOutgoingIntegration -> urls must be an array');        // 10
    }                                                                                                                //
    ref = integration.urls;                                                                                          // 12
    for (index = i = 0, len = ref.length; i < len; index = ++i) {                                                    // 12
      url = ref[index];                                                                                              //
      if (url.trim() === '') {                                                                                       // 13
        delete integration.urls[index];                                                                              // 13
      }                                                                                                              //
    }                                                                                                                // 12
    integration.urls = _.without(integration.urls, [void 0]);                                                        // 3
    if (integration.urls.length === 0) {                                                                             // 17
      throw new Meteor.Error('invalid_urls', '[methods] updateOutgoingIntegration -> urls is required');             // 18
    }                                                                                                                //
    if (_.isString(integration.channel)) {                                                                           // 20
      integration.channel = integration.channel.trim();                                                              // 21
    } else {                                                                                                         //
      integration.channel = void 0;                                                                                  // 23
    }                                                                                                                //
    if ((integration.channel != null) && ((ref1 = integration.channel[0]) !== '@' && ref1 !== '#')) {                // 25
      throw new Meteor.Error('invalid_channel', '[methods] updateOutgoingIntegration -> channel should start with # or @');
    }                                                                                                                //
    if ((integration.token == null) || ((ref2 = integration.token) != null ? ref2.trim() : void 0) === '') {         // 28
      throw new Meteor.Error('invalid_token', '[methods] updateOutgoingIntegration -> token is required');           // 29
    }                                                                                                                //
    if (integration.triggerWords != null) {                                                                          // 31
      if (!Match.test(integration.triggerWords, [String])) {                                                         // 32
        throw new Meteor.Error('invalid_triggerWords', '[methods] updateOutgoingIntegration -> triggerWords must be an array');
      }                                                                                                              //
      ref3 = integration.triggerWords;                                                                               // 35
      for (index = j = 0, len1 = ref3.length; j < len1; index = ++j) {                                               // 35
        triggerWord = ref3[index];                                                                                   //
        if (triggerWord.trim() === '') {                                                                             // 36
          delete integration.triggerWords[index];                                                                    // 36
        }                                                                                                            //
      }                                                                                                              // 35
      integration.triggerWords = _.without(integration.triggerWords, [void 0]);                                      // 32
    }                                                                                                                //
    if (RocketChat.models.Integrations.findOne(integrationId) == null) {                                             // 40
      throw new Meteor.Error('invalid_integration', '[methods] updateOutgoingIntegration -> integration not found');
    }                                                                                                                //
    if (integration.scriptEnabled === true && (integration.script != null) && integration.script.trim() !== '') {    // 43
      try {                                                                                                          // 44
        babelOptions = Babel.getDefaultOptions();                                                                    // 45
        babelOptions.externalHelpers = false;                                                                        // 45
        integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                           // 45
        integration.scriptError = void 0;                                                                            // 45
      } catch (_error) {                                                                                             //
        e = _error;                                                                                                  // 51
        integration.scriptCompiled = void 0;                                                                         // 51
        integration.scriptError = _.pick(e, 'name', 'message', 'pos', 'loc', 'codeFrame');                           // 51
      }                                                                                                              //
    }                                                                                                                //
    if (integration.channel != null) {                                                                               // 55
      record = void 0;                                                                                               // 56
      channelType = integration.channel[0];                                                                          // 56
      channel = integration.channel.substr(1);                                                                       // 56
      switch (channelType) {                                                                                         // 60
        case '#':                                                                                                    // 60
          record = RocketChat.models.Rooms.findOne({                                                                 // 62
            $or: [                                                                                                   // 63
              {                                                                                                      //
                _id: channel                                                                                         // 64
              }, {                                                                                                   //
                name: channel                                                                                        // 65
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
          break;                                                                                                     // 61
        case '@':                                                                                                    // 60
          record = RocketChat.models.Users.findOne({                                                                 // 68
            $or: [                                                                                                   // 69
              {                                                                                                      //
                _id: channel                                                                                         // 70
              }, {                                                                                                   //
                username: channel                                                                                    // 71
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
      }                                                                                                              // 60
      if (record === void 0) {                                                                                       // 74
        throw new Meteor.Error('channel_does_not_exists', "[methods] updateOutgoingIntegration -> The channel does not exists");
      }                                                                                                              //
    }                                                                                                                //
    user = RocketChat.models.Users.findOne({                                                                         // 3
      username: integration.username                                                                                 // 77
    });                                                                                                              //
    if (user == null) {                                                                                              // 79
      throw new Meteor.Error('user_does_not_exists', "[methods] updateOutgoingIntegration -> The username does not exists");
    }                                                                                                                //
    RocketChat.models.Integrations.update(integrationId, {                                                           // 3
      $set: {                                                                                                        // 83
        enabled: integration.enabled,                                                                                // 84
        name: integration.name,                                                                                      // 84
        avatar: integration.avatar,                                                                                  // 84
        emoji: integration.emoji,                                                                                    // 84
        alias: integration.alias,                                                                                    // 84
        channel: integration.channel,                                                                                // 84
        username: integration.username,                                                                              // 84
        userId: user._id,                                                                                            // 84
        urls: integration.urls,                                                                                      // 84
        token: integration.token,                                                                                    // 84
        script: integration.script,                                                                                  // 84
        scriptEnabled: integration.scriptEnabled,                                                                    // 84
        scriptCompiled: integration.scriptCompiled,                                                                  // 84
        scriptError: integration.scriptError,                                                                        // 84
        triggerWords: integration.triggerWords,                                                                      // 84
        _updatedAt: new Date,                                                                                        // 84
        _updatedBy: RocketChat.models.Users.findOne(this.userId, {                                                   // 84
          fields: {                                                                                                  // 100
            username: 1                                                                                              // 100
          }                                                                                                          //
        })                                                                                                           //
      }                                                                                                              //
    });                                                                                                              //
    return RocketChat.models.Integrations.findOne(integrationId);                                                    // 102
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/outgoing/deleteOutgoingIntegration.coffee.js                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                     // 1
  deleteOutgoingIntegration: function(integrationId) {                                                               // 2
    var integration;                                                                                                 // 3
    if (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations') && !RocketChat.authz.hasPermission(this.userId, 'manage-integrations', 'bot')) {
      throw new Meteor.Error('not_authorized');                                                                      // 4
    }                                                                                                                //
    integration = RocketChat.models.Integrations.findOne(integrationId);                                             // 3
    if (integration == null) {                                                                                       // 8
      throw new Meteor.Error('invalid_integration', '[methods] deleteOutgoingIntegration -> integration not found');
    }                                                                                                                //
    RocketChat.models.Integrations.remove({                                                                          // 3
      _id: integrationId                                                                                             // 11
    });                                                                                                              //
    return true;                                                                                                     // 13
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/api/api.coffee.js                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Api, addIntegrationRest, compiledScripts, createIntegration, executeIntegrationRest, getIntegrationScript, integrationInfoRest, integrationSampleRest, removeIntegration, removeIntegrationRest, vm;
                                                                                                                     //
vm = Npm.require('vm');                                                                                              // 1
                                                                                                                     //
compiledScripts = {};                                                                                                // 1
                                                                                                                     //
getIntegrationScript = function(integration) {                                                                       // 1
  var compiledScript, e, sandbox, script, vmScript;                                                                  // 6
  compiledScript = compiledScripts[integration._id];                                                                 // 6
  if ((compiledScript != null) && +compiledScript._updatedAt === +integration._updatedAt) {                          // 7
    return compiledScript.script;                                                                                    // 8
  }                                                                                                                  //
  script = integration.scriptCompiled;                                                                               // 6
  vmScript = void 0;                                                                                                 // 6
  sandbox = {                                                                                                        // 6
    _: _,                                                                                                            // 13
    s: s,                                                                                                            // 13
    console: console,                                                                                                // 13
    Store: {                                                                                                         // 13
      set: function(key, val) {                                                                                      // 17
        return store[key] = val;                                                                                     // 18
      },                                                                                                             //
      get: function(key) {                                                                                           // 17
        return store[key];                                                                                           // 20
      }                                                                                                              //
    }                                                                                                                //
  };                                                                                                                 //
  try {                                                                                                              // 22
    logger.incoming.info('will evaluate script');                                                                    // 23
    logger.incoming.debug(script);                                                                                   // 23
    vmScript = vm.createScript(script, 'script.js');                                                                 // 23
    vmScript.runInNewContext(sandbox);                                                                               // 23
    if (sandbox.Script != null) {                                                                                    // 30
      compiledScripts[integration._id] = {                                                                           // 31
        script: new sandbox.Script(),                                                                                // 32
        _updatedAt: integration._updatedAt                                                                           // 32
      };                                                                                                             //
      return compiledScripts[integration._id].script;                                                                // 35
    }                                                                                                                //
  } catch (_error) {                                                                                                 //
    e = _error;                                                                                                      // 37
    logger.incoming.error("[Error evaluating Script:]");                                                             // 37
    logger.incoming.error(script.replace(/^/gm, '  '));                                                              // 37
    logger.incoming.error("[Stack:]");                                                                               // 37
    logger.incoming.error(e.stack.replace(/^/gm, '  '));                                                             // 37
    throw RocketChat.API.v1.failure('error-evaluating-script');                                                      // 41
  }                                                                                                                  //
  if (sandbox.Script == null) {                                                                                      // 43
    throw RocketChat.API.v1.failure('class-script-not-found');                                                       // 44
  }                                                                                                                  //
};                                                                                                                   // 5
                                                                                                                     //
Api = new Restivus({                                                                                                 // 1
  enableCors: true,                                                                                                  // 48
  apiPath: 'hooks/',                                                                                                 // 48
  auth: {                                                                                                            // 48
    user: function() {                                                                                               // 51
      var ref, user;                                                                                                 // 52
      if (((ref = this.bodyParams) != null ? ref.payload : void 0) != null) {                                        // 52
        this.bodyParams = JSON.parse(this.bodyParams.payload);                                                       // 53
      }                                                                                                              //
      this.integration = RocketChat.models.Integrations.findOne({                                                    // 52
        _id: this.request.params.integrationId,                                                                      // 56
        token: decodeURIComponent(this.request.params.token)                                                         // 56
      });                                                                                                            //
      if (this.integration == null) {                                                                                // 59
        logger.incoming.info("Invalid integration id", this.request.params.integrationId, "or token", this.request.params.token);
        return;                                                                                                      // 61
      }                                                                                                              //
      user = RocketChat.models.Users.findOne({                                                                       // 52
        _id: this.integration.userId                                                                                 // 64
      });                                                                                                            //
      return {                                                                                                       // 66
        user: user                                                                                                   // 66
      };                                                                                                             //
    }                                                                                                                //
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
createIntegration = function(options, user) {                                                                        // 1
  logger.incoming.info('Add integration');                                                                           // 70
  logger.incoming.debug(options);                                                                                    // 70
  Meteor.runAsUser(user._id, (function(_this) {                                                                      // 70
    return function() {                                                                                              //
      switch (options['event']) {                                                                                    // 74
        case 'newMessageOnChannel':                                                                                  // 74
          if (options.data == null) {                                                                                //
            options.data = {};                                                                                       //
          }                                                                                                          //
          if ((options.data.channel_name != null) && options.data.channel_name.indexOf('#') === -1) {                // 78
            options.data.channel_name = '#' + options.data.channel_name;                                             // 79
          }                                                                                                          //
          return Meteor.call('addOutgoingIntegration', {                                                             //
            username: 'rocket.cat',                                                                                  // 82
            urls: [options.target_url],                                                                              // 82
            name: options.name,                                                                                      // 82
            channel: options.data.channel_name,                                                                      // 82
            triggerWords: options.data.trigger_words                                                                 // 82
          });                                                                                                        //
        case 'newMessageToUser':                                                                                     // 74
          if (options.data.username.indexOf('@') === -1) {                                                           // 89
            options.data.username = '@' + options.data.username;                                                     // 90
          }                                                                                                          //
          return Meteor.call('addOutgoingIntegration', {                                                             //
            username: 'rocket.cat',                                                                                  // 93
            urls: [options.target_url],                                                                              // 93
            name: options.name,                                                                                      // 93
            channel: options.data.username,                                                                          // 93
            triggerWords: options.data.trigger_words                                                                 // 93
          });                                                                                                        //
      }                                                                                                              // 74
    };                                                                                                               //
  })(this));                                                                                                         //
  return RocketChat.API.v1.success();                                                                                // 99
};                                                                                                                   // 69
                                                                                                                     //
removeIntegration = function(options, user) {                                                                        // 1
  var integrationToRemove;                                                                                           // 103
  logger.incoming.info('Remove integration');                                                                        // 103
  logger.incoming.debug(options);                                                                                    // 103
  integrationToRemove = RocketChat.models.Integrations.findOne({                                                     // 103
    urls: options.target_url                                                                                         // 106
  });                                                                                                                //
  Meteor.runAsUser(user._id, (function(_this) {                                                                      // 103
    return function() {                                                                                              //
      return Meteor.call('deleteOutgoingIntegration', integrationToRemove._id);                                      //
    };                                                                                                               //
  })(this));                                                                                                         //
  return RocketChat.API.v1.success();                                                                                // 110
};                                                                                                                   // 102
                                                                                                                     //
executeIntegrationRest = function() {                                                                                // 1
  var defaultValues, e, message, ref, ref1, request, result, script;                                                 // 114
  logger.incoming.info('Post integration');                                                                          // 114
  logger.incoming.debug('@urlParams', this.urlParams);                                                               // 114
  logger.incoming.debug('@bodyParams', this.bodyParams);                                                             // 114
  if (this.integration.enabled !== true) {                                                                           // 118
    return {                                                                                                         // 119
      statusCode: 503,                                                                                               // 120
      body: 'Service Unavailable'                                                                                    // 120
    };                                                                                                               //
  }                                                                                                                  //
  defaultValues = {                                                                                                  // 114
    channel: this.integration.channel,                                                                               // 124
    alias: this.integration.alias,                                                                                   // 124
    avatar: this.integration.avatar,                                                                                 // 124
    emoji: this.integration.emoji                                                                                    // 124
  };                                                                                                                 //
  if (this.integration.scriptEnabled === true && (this.integration.scriptCompiled != null) && this.integration.scriptCompiled.trim() !== '') {
    script = void 0;                                                                                                 // 131
    try {                                                                                                            // 132
      script = getIntegrationScript(this.integration);                                                               // 133
    } catch (_error) {                                                                                               //
      e = _error;                                                                                                    // 135
      return e;                                                                                                      // 135
    }                                                                                                                //
    request = {                                                                                                      // 131
      url: {                                                                                                         // 138
        hash: this.request._parsedUrl.hash,                                                                          // 139
        search: this.request._parsedUrl.search,                                                                      // 139
        query: this.queryParams,                                                                                     // 139
        pathname: this.request._parsedUrl.pathname,                                                                  // 139
        path: this.request._parsedUrl.path                                                                           // 139
      },                                                                                                             //
      url_raw: this.request.url,                                                                                     // 138
      url_params: this.urlParams,                                                                                    // 138
      content: this.bodyParams,                                                                                      // 138
      content_raw: (ref = this.request._readableState) != null ? (ref1 = ref.buffer) != null ? ref1.toString() : void 0 : void 0,
      headers: this.request.headers,                                                                                 // 138
      user: {                                                                                                        // 138
        _id: this.user._id,                                                                                          // 150
        name: this.user.name,                                                                                        // 150
        username: this.user.username                                                                                 // 150
      }                                                                                                              //
    };                                                                                                               //
    try {                                                                                                            // 154
      result = script.process_incoming_request({                                                                     // 155
        request: request                                                                                             // 155
      });                                                                                                            //
      if ((result != null ? result.error : void 0) != null) {                                                        // 157
        return RocketChat.API.v1.failure(result.error);                                                              // 158
      }                                                                                                              //
      this.bodyParams = result != null ? result.content : void 0;                                                    // 155
      logger.incoming.debug('result', this.bodyParams);                                                              // 155
    } catch (_error) {                                                                                               //
      e = _error;                                                                                                    // 164
      logger.incoming.error("[Error running Script:]");                                                              // 164
      logger.incoming.error(this.integration.scriptCompiled.replace(/^/gm, '  '));                                   // 164
      logger.incoming.error("[Stack:]");                                                                             // 164
      logger.incoming.error(e.stack.replace(/^/gm, '  '));                                                           // 164
      return RocketChat.API.v1.failure('error-running-script');                                                      // 168
    }                                                                                                                //
  }                                                                                                                  //
  if (this.bodyParams == null) {                                                                                     // 170
    RocketChat.API.v1.failure('body-empty');                                                                         // 171
  }                                                                                                                  //
  this.bodyParams.bot = {                                                                                            // 114
    i: this.integration._id                                                                                          // 174
  };                                                                                                                 //
  try {                                                                                                              // 176
    message = processWebhookMessage(this.bodyParams, this.user, defaultValues);                                      // 177
    if (message == null) {                                                                                           // 179
      return RocketChat.API.v1.failure('unknown-error');                                                             // 180
    }                                                                                                                //
    return RocketChat.API.v1.success();                                                                              // 182
  } catch (_error) {                                                                                                 //
    e = _error;                                                                                                      // 184
    return RocketChat.API.v1.failure(e.error);                                                                       // 184
  }                                                                                                                  //
};                                                                                                                   // 113
                                                                                                                     //
addIntegrationRest = function() {                                                                                    // 1
  return createIntegration(this.bodyParams, this.user);                                                              // 188
};                                                                                                                   // 187
                                                                                                                     //
removeIntegrationRest = function() {                                                                                 // 1
  return removeIntegration(this.bodyParams, this.user);                                                              // 192
};                                                                                                                   // 191
                                                                                                                     //
integrationSampleRest = function() {                                                                                 // 1
  logger.incoming.info('Sample Integration');                                                                        // 196
  return {                                                                                                           // 198
    statusCode: 200,                                                                                                 // 199
    body: [                                                                                                          // 199
      {                                                                                                              //
        token: Random.id(24),                                                                                        // 201
        channel_id: Random.id(),                                                                                     // 201
        channel_name: 'general',                                                                                     // 201
        timestamp: new Date,                                                                                         // 201
        user_id: Random.id(),                                                                                        // 201
        user_name: 'rocket.cat',                                                                                     // 201
        text: 'Sample text 1',                                                                                       // 201
        trigger_word: 'Sample'                                                                                       // 201
      }, {                                                                                                           //
        token: Random.id(24),                                                                                        // 210
        channel_id: Random.id(),                                                                                     // 210
        channel_name: 'general',                                                                                     // 210
        timestamp: new Date,                                                                                         // 210
        user_id: Random.id(),                                                                                        // 210
        user_name: 'rocket.cat',                                                                                     // 210
        text: 'Sample text 2',                                                                                       // 210
        trigger_word: 'Sample'                                                                                       // 210
      }, {                                                                                                           //
        token: Random.id(24),                                                                                        // 219
        channel_id: Random.id(),                                                                                     // 219
        channel_name: 'general',                                                                                     // 219
        timestamp: new Date,                                                                                         // 219
        user_id: Random.id(),                                                                                        // 219
        user_name: 'rocket.cat',                                                                                     // 219
        text: 'Sample text 3',                                                                                       // 219
        trigger_word: 'Sample'                                                                                       // 219
      }                                                                                                              //
    ]                                                                                                                //
  };                                                                                                                 //
};                                                                                                                   // 195
                                                                                                                     //
integrationInfoRest = function() {                                                                                   // 1
  logger.incoming.info('Info integration');                                                                          // 231
  return {                                                                                                           // 233
    statusCode: 200,                                                                                                 // 234
    body: {                                                                                                          // 234
      success: true                                                                                                  // 236
    }                                                                                                                //
  };                                                                                                                 //
};                                                                                                                   // 230
                                                                                                                     //
RocketChat.API.v1.addRoute('integrations.create', {                                                                  // 1
  authRequired: true                                                                                                 // 239
}, {                                                                                                                 //
  post: function() {                                                                                                 // 240
    return createIntegration(this.bodyParams, this.user);                                                            // 241
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
RocketChat.API.v1.addRoute('integrations.remove', {                                                                  // 1
  authRequired: true                                                                                                 // 244
}, {                                                                                                                 //
  post: function() {                                                                                                 // 245
    return removeIntegration(this.bodyParams, this.user);                                                            // 246
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Api.addRoute(':integrationId/:userId/:token', {                                                                      // 1
  authRequired: true                                                                                                 // 249
}, {                                                                                                                 //
  post: executeIntegrationRest,                                                                                      // 249
  get: executeIntegrationRest                                                                                        // 249
});                                                                                                                  //
                                                                                                                     //
Api.addRoute(':integrationId/:token', {                                                                              // 1
  authRequired: true                                                                                                 // 250
}, {                                                                                                                 //
  post: executeIntegrationRest,                                                                                      // 250
  get: executeIntegrationRest                                                                                        // 250
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('sample/:integrationId/:userId/:token', {                                                               // 1
  authRequired: true                                                                                                 // 252
}, {                                                                                                                 //
  get: integrationSampleRest                                                                                         // 252
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('sample/:integrationId/:token', {                                                                       // 1
  authRequired: true                                                                                                 // 253
}, {                                                                                                                 //
  get: integrationSampleRest                                                                                         // 253
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('info/:integrationId/:userId/:token', {                                                                 // 1
  authRequired: true                                                                                                 // 255
}, {                                                                                                                 //
  get: integrationInfoRest                                                                                           // 255
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('info/:integrationId/:token', {                                                                         // 1
  authRequired: true                                                                                                 // 256
}, {                                                                                                                 //
  get: integrationInfoRest                                                                                           // 256
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('add/:integrationId/:userId/:token', {                                                                  // 1
  authRequired: true                                                                                                 // 258
}, {                                                                                                                 //
  post: addIntegrationRest                                                                                           // 258
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('add/:integrationId/:token', {                                                                          // 1
  authRequired: true                                                                                                 // 259
}, {                                                                                                                 //
  post: addIntegrationRest                                                                                           // 259
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('remove/:integrationId/:userId/:token', {                                                               // 1
  authRequired: true                                                                                                 // 261
}, {                                                                                                                 //
  post: removeIntegrationRest                                                                                        // 261
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('remove/:integrationId/:token', {                                                                       // 1
  authRequired: true                                                                                                 // 262
}, {                                                                                                                 //
  post: removeIntegrationRest                                                                                        // 262
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/triggers.coffee.js                                                        //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ExecuteTrigger, ExecuteTriggerUrl, ExecuteTriggers, compiledScripts, executeScript, getIntegrationScript, hasScriptAndMethod, triggers, vm;
                                                                                                                     //
vm = Npm.require('vm');                                                                                              // 1
                                                                                                                     //
compiledScripts = {};                                                                                                // 1
                                                                                                                     //
getIntegrationScript = function(integration) {                                                                       // 1
  var compiledScript, e, sandbox, script, store, vmScript;                                                           // 6
  compiledScript = compiledScripts[integration._id];                                                                 // 6
  if ((compiledScript != null) && +compiledScript._updatedAt === +integration._updatedAt) {                          // 7
    return compiledScript.script;                                                                                    // 8
  }                                                                                                                  //
  script = integration.scriptCompiled;                                                                               // 6
  vmScript = void 0;                                                                                                 // 6
  store = {};                                                                                                        // 6
  sandbox = {                                                                                                        // 6
    _: _,                                                                                                            // 14
    s: s,                                                                                                            // 14
    console: console,                                                                                                // 14
    Store: {                                                                                                         // 14
      set: function(key, val) {                                                                                      // 18
        return store[key] = val;                                                                                     // 19
      },                                                                                                             //
      get: function(key) {                                                                                           // 18
        return store[key];                                                                                           // 21
      }                                                                                                              //
    },                                                                                                               //
    HTTP: function(method, url, options) {                                                                           // 14
      var e;                                                                                                         // 23
      try {                                                                                                          // 23
        return {                                                                                                     // 24
          result: HTTP.call(method, url, options)                                                                    // 25
        };                                                                                                           //
      } catch (_error) {                                                                                             //
        e = _error;                                                                                                  // 27
        return {                                                                                                     // 27
          error: e                                                                                                   // 28
        };                                                                                                           //
      }                                                                                                              //
    }                                                                                                                //
  };                                                                                                                 //
  try {                                                                                                              // 30
    logger.outgoing.info('will evaluate script');                                                                    // 31
    logger.outgoing.debug(script);                                                                                   // 31
    vmScript = vm.createScript(script, 'script.js');                                                                 // 31
    vmScript.runInNewContext(sandbox);                                                                               // 31
    if (sandbox.Script != null) {                                                                                    // 38
      compiledScripts[integration._id] = {                                                                           // 39
        script: new sandbox.Script(),                                                                                // 40
        _updatedAt: integration._updatedAt                                                                           // 40
      };                                                                                                             //
      return compiledScripts[integration._id].script;                                                                // 43
    }                                                                                                                //
  } catch (_error) {                                                                                                 //
    e = _error;                                                                                                      // 45
    logger.outgoing.error("[Error evaluating Script:]");                                                             // 45
    logger.outgoing.error(script.replace(/^/gm, '  '));                                                              // 45
    logger.outgoing.error("[Stack:]");                                                                               // 45
    logger.outgoing.error(e.stack.replace(/^/gm, '  '));                                                             // 45
    throw new Meteor.Error('error-evaluating-script');                                                               // 49
  }                                                                                                                  //
  if (sandbox.Script == null) {                                                                                      // 51
    logger.outgoing.error("[Class 'Script' not found]");                                                             // 52
    throw new Meteor.Error('class-script-not-found');                                                                // 53
  }                                                                                                                  //
};                                                                                                                   // 5
                                                                                                                     //
triggers = {};                                                                                                       // 1
                                                                                                                     //
hasScriptAndMethod = function(integration, method) {                                                                 // 1
  var e, script;                                                                                                     // 59
  if (integration.scriptEnabled !== true || (integration.scriptCompiled == null) || integration.scriptCompiled.trim() === '') {
    return false;                                                                                                    // 60
  }                                                                                                                  //
  script = void 0;                                                                                                   // 59
  try {                                                                                                              // 63
    script = getIntegrationScript(integration);                                                                      // 64
  } catch (_error) {                                                                                                 //
    e = _error;                                                                                                      // 66
    return;                                                                                                          // 66
  }                                                                                                                  //
  return script[method] != null;                                                                                     // 68
};                                                                                                                   // 58
                                                                                                                     //
executeScript = function(integration, method, params) {                                                              // 1
  var e, result, script;                                                                                             // 71
  script = void 0;                                                                                                   // 71
  try {                                                                                                              // 72
    script = getIntegrationScript(integration);                                                                      // 73
  } catch (_error) {                                                                                                 //
    e = _error;                                                                                                      // 75
    return;                                                                                                          // 75
  }                                                                                                                  //
  if (script[method] == null) {                                                                                      // 77
    logger.outgoing.error("[Method '" + method + "' not found]");                                                    // 78
    return;                                                                                                          // 79
  }                                                                                                                  //
  try {                                                                                                              // 81
    result = script[method](params);                                                                                 // 82
    logger.outgoing.debug('result', result);                                                                         // 82
    return result;                                                                                                   // 86
  } catch (_error) {                                                                                                 //
    e = _error;                                                                                                      // 88
    logger.incoming.error("[Error running Script:]");                                                                // 88
    logger.incoming.error(integration.scriptCompiled.replace(/^/gm, '  '));                                          // 88
    logger.incoming.error("[Stack:]");                                                                               // 88
    logger.incoming.error(e.stack.replace(/^/gm, '  '));                                                             // 88
  }                                                                                                                  //
};                                                                                                                   // 70
                                                                                                                     //
RocketChat.models.Integrations.find({                                                                                // 1
  type: 'webhook-outgoing'                                                                                           // 95
}).observe({                                                                                                         //
  added: function(record) {                                                                                          // 96
    var channel;                                                                                                     // 97
    channel = record.channel || '__any';                                                                             // 97
    if (triggers[channel] == null) {                                                                                 //
      triggers[channel] = {};                                                                                        //
    }                                                                                                                //
    return triggers[channel][record._id] = record;                                                                   //
  },                                                                                                                 //
  changed: function(record) {                                                                                        // 96
    var channel;                                                                                                     // 102
    channel = record.channel || '__any';                                                                             // 102
    if (triggers[channel] == null) {                                                                                 //
      triggers[channel] = {};                                                                                        //
    }                                                                                                                //
    return triggers[channel][record._id] = record;                                                                   //
  },                                                                                                                 //
  removed: function(record) {                                                                                        // 96
    var channel;                                                                                                     // 107
    channel = record.channel || '__any';                                                                             // 107
    return delete triggers[channel][record._id];                                                                     //
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
ExecuteTriggerUrl = function(url, trigger, message, room, tries) {                                                   // 1
  var data, i, len, opts, ref, ref1, sandbox, sendMessage, triggerWord, word;                                        // 112
  if (tries == null) {                                                                                               //
    tries = 0;                                                                                                       //
  }                                                                                                                  //
  word = void 0;                                                                                                     // 112
  if (((ref = trigger.triggerWords) != null ? ref.length : void 0) > 0) {                                            // 113
    ref1 = trigger.triggerWords;                                                                                     // 114
    for (i = 0, len = ref1.length; i < len; i++) {                                                                   // 114
      triggerWord = ref1[i];                                                                                         //
      if (message.msg.indexOf(triggerWord) === 0) {                                                                  // 115
        word = triggerWord;                                                                                          // 116
        break;                                                                                                       // 117
      }                                                                                                              //
    }                                                                                                                // 114
    if (word == null) {                                                                                              // 120
      return;                                                                                                        // 121
    }                                                                                                                //
  }                                                                                                                  //
  data = {                                                                                                           // 112
    token: trigger.token,                                                                                            // 124
    channel_id: room._id,                                                                                            // 124
    channel_name: room.name,                                                                                         // 124
    timestamp: message.ts,                                                                                           // 124
    user_id: message.u._id,                                                                                          // 124
    user_name: message.u.username,                                                                                   // 124
    text: message.msg                                                                                                // 124
  };                                                                                                                 //
  if (word != null) {                                                                                                // 132
    data.trigger_word = word;                                                                                        // 133
  }                                                                                                                  //
  sendMessage = function(message) {                                                                                  // 112
    var defaultValues, user;                                                                                         // 136
    user = RocketChat.models.Users.findOneByUsername(trigger.username);                                              // 136
    message.bot = {                                                                                                  // 136
      i: trigger._id                                                                                                 // 139
    };                                                                                                               //
    defaultValues = {                                                                                                // 136
      alias: trigger.alias,                                                                                          // 142
      avatar: trigger.avatar,                                                                                        // 142
      emoji: trigger.emoji                                                                                           // 142
    };                                                                                                               //
    if (room.t === 'd') {                                                                                            // 146
      defaultValues.channel = '@' + room._id;                                                                        // 147
    } else {                                                                                                         //
      defaultValues.channel = '#' + room._id;                                                                        // 149
    }                                                                                                                //
    return message = processWebhookMessage(message, user, defaultValues);                                            //
  };                                                                                                                 //
  opts = {                                                                                                           // 112
    params: {},                                                                                                      // 155
    method: 'POST',                                                                                                  // 155
    url: url,                                                                                                        // 155
    data: data,                                                                                                      // 155
    auth: void 0,                                                                                                    // 155
    npmRequestOptions: {                                                                                             // 155
      rejectUnauthorized: !RocketChat.settings.get('Allow_Invalid_SelfSigned_Certs'),                                // 161
      strictSSL: !RocketChat.settings.get('Allow_Invalid_SelfSigned_Certs')                                          // 161
    },                                                                                                               //
    headers: {                                                                                                       // 155
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'
    }                                                                                                                //
  };                                                                                                                 //
  if (hasScriptAndMethod(trigger, 'prepare_outgoing_request')) {                                                     // 166
    sandbox = {                                                                                                      // 167
      request: opts                                                                                                  // 168
    };                                                                                                               //
    opts = executeScript(trigger, 'prepare_outgoing_request', sandbox);                                              // 167
  }                                                                                                                  //
  if (opts == null) {                                                                                                // 172
    return;                                                                                                          // 173
  }                                                                                                                  //
  if (opts.message != null) {                                                                                        // 175
    sendMessage(opts.message);                                                                                       // 176
  }                                                                                                                  //
  if ((opts.url == null) || (opts.method == null)) {                                                                 // 178
    return;                                                                                                          // 179
  }                                                                                                                  //
  return HTTP.call(opts.method, opts.url, opts, function(error, result) {                                            //
    var ref2, ref3, ref4, ref5, scriptResult;                                                                        // 182
    scriptResult = void 0;                                                                                           // 182
    if (hasScriptAndMethod(trigger, 'process_outgoing_response')) {                                                  // 183
      sandbox = {                                                                                                    // 184
        request: opts,                                                                                               // 185
        response: {                                                                                                  // 185
          error: error,                                                                                              // 187
          status_code: result.statusCode,                                                                            // 187
          content: result.data,                                                                                      // 187
          content_raw: result.content,                                                                               // 187
          headers: result.headers                                                                                    // 187
        }                                                                                                            //
      };                                                                                                             //
      scriptResult = executeScript(trigger, 'process_outgoing_response', sandbox);                                   // 184
      if (scriptResult != null ? scriptResult.content : void 0) {                                                    // 195
        sendMessage(scriptResult.content);                                                                           // 196
        return;                                                                                                      // 197
      }                                                                                                              //
      if (scriptResult === false) {                                                                                  // 199
        return;                                                                                                      // 200
      }                                                                                                              //
    }                                                                                                                //
    if ((result == null) || ((ref2 = result.statusCode) !== 200 && ref2 !== 201 && ref2 !== 202)) {                  // 202
      if (error != null) {                                                                                           // 203
        logger.outgoing.error(error);                                                                                // 204
      }                                                                                                              //
      if (result != null) {                                                                                          // 205
        logger.outgoing.error(result);                                                                               // 206
      }                                                                                                              //
      if (result.statusCode === 410) {                                                                               // 208
        RocketChat.models.Integrations.remove({                                                                      // 209
          _id: trigger._id                                                                                           // 209
        });                                                                                                          //
        return;                                                                                                      // 210
      }                                                                                                              //
      if (result.statusCode === 500) {                                                                               // 212
        logger.outgoing.error('Request Error [500]', url);                                                           // 213
        logger.outgoing.error(result.content);                                                                       // 213
        return;                                                                                                      // 215
      }                                                                                                              //
      if (tries <= 6) {                                                                                              // 217
        Meteor.setTimeout(function() {                                                                               // 219
          return ExecuteTriggerUrl(url, trigger, message, room, tries + 1);                                          //
        }, Math.pow(10, tries + 2));                                                                                 //
      }                                                                                                              //
      return;                                                                                                        // 223
    }                                                                                                                //
    if ((ref3 = result != null ? result.statusCode : void 0) === 200 || ref3 === 201 || ref3 === 202) {              // 226
      if (((result != null ? (ref4 = result.data) != null ? ref4.text : void 0 : void 0) != null) || ((result != null ? (ref5 = result.data) != null ? ref5.attachments : void 0 : void 0) != null)) {
        return sendMessage(result.data);                                                                             //
      }                                                                                                              //
    }                                                                                                                //
  });                                                                                                                //
};                                                                                                                   // 111
                                                                                                                     //
ExecuteTrigger = function(trigger, message, room) {                                                                  // 1
  var i, len, ref, results, url;                                                                                     // 232
  ref = trigger.urls;                                                                                                // 232
  results = [];                                                                                                      // 232
  for (i = 0, len = ref.length; i < len; i++) {                                                                      //
    url = ref[i];                                                                                                    //
    results.push(ExecuteTriggerUrl(url, trigger, message, room));                                                    // 233
  }                                                                                                                  // 232
  return results;                                                                                                    //
};                                                                                                                   // 231
                                                                                                                     //
ExecuteTriggers = function(message, room) {                                                                          // 1
  var i, id, key, len, ref, ref1, ref2, ref3, ref4, ref5, ref6, trigger, triggerToExecute, triggersToExecute, username;
  if (room == null) {                                                                                                // 237
    return;                                                                                                          // 238
  }                                                                                                                  //
  triggersToExecute = [];                                                                                            // 237
  switch (room.t) {                                                                                                  // 242
    case 'd':                                                                                                        // 242
      id = room._id.replace(message.u._id, '');                                                                      // 244
      username = _.without(room.usernames, message.u.username);                                                      // 244
      username = username[0];                                                                                        // 244
      if (triggers['@' + id] != null) {                                                                              // 249
        ref = triggers['@' + id];                                                                                    // 250
        for (key in ref) {                                                                                           // 250
          trigger = ref[key];                                                                                        //
          triggersToExecute.push(trigger);                                                                           // 250
        }                                                                                                            // 250
      }                                                                                                              //
      if (id !== username && (triggers['@' + username] != null)) {                                                   // 252
        ref1 = triggers['@' + username];                                                                             // 253
        for (key in ref1) {                                                                                          // 253
          trigger = ref1[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           // 253
        }                                                                                                            // 253
      }                                                                                                              //
      break;                                                                                                         // 243
    case 'c':                                                                                                        // 242
      if (triggers.__any != null) {                                                                                  // 256
        ref2 = triggers.__any;                                                                                       // 257
        for (key in ref2) {                                                                                          // 257
          trigger = ref2[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           // 257
        }                                                                                                            // 257
      }                                                                                                              //
      if (triggers['#' + room._id] != null) {                                                                        // 259
        ref3 = triggers['#' + room._id];                                                                             // 260
        for (key in ref3) {                                                                                          // 260
          trigger = ref3[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           // 260
        }                                                                                                            // 260
      }                                                                                                              //
      if (room._id !== room.name && (triggers['#' + room.name] != null)) {                                           // 262
        ref4 = triggers['#' + room.name];                                                                            // 263
        for (key in ref4) {                                                                                          // 263
          trigger = ref4[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           // 263
        }                                                                                                            // 263
      }                                                                                                              //
      break;                                                                                                         // 255
    default:                                                                                                         // 242
      if (triggers['#' + room._id] != null) {                                                                        // 266
        ref5 = triggers['#' + room._id];                                                                             // 267
        for (key in ref5) {                                                                                          // 267
          trigger = ref5[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           // 267
        }                                                                                                            // 267
      }                                                                                                              //
      if (room._id !== room.name && (triggers['#' + room.name] != null)) {                                           // 269
        ref6 = triggers['#' + room.name];                                                                            // 270
        for (key in ref6) {                                                                                          // 270
          trigger = ref6[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           // 270
        }                                                                                                            // 270
      }                                                                                                              //
  }                                                                                                                  // 242
  for (i = 0, len = triggersToExecute.length; i < len; i++) {                                                        // 273
    triggerToExecute = triggersToExecute[i];                                                                         //
    if (triggerToExecute.enabled === true) {                                                                         // 274
      ExecuteTrigger(triggerToExecute, message, room);                                                               // 275
    }                                                                                                                //
  }                                                                                                                  // 273
  return message;                                                                                                    // 277
};                                                                                                                   // 236
                                                                                                                     //
RocketChat.callbacks.add('afterSaveMessage', ExecuteTriggers, RocketChat.callbacks.priority.LOW);                    // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/processWebhookMessage.js                                                  //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
this.processWebhookMessage = function (messageObj, user, defaultValues) {                                            // 1
	var attachment, channel, channelType, i, len, message, ref, rid, room, roomUser;                                    // 2
                                                                                                                     //
	if (!defaultValues) {                                                                                               // 4
		defaultValues = {                                                                                                  // 5
			channel: '',                                                                                                      // 6
			alias: '',                                                                                                        // 7
			avatar: '',                                                                                                       // 8
			emoji: ''                                                                                                         // 9
		};                                                                                                                 //
	}                                                                                                                   //
                                                                                                                     //
	channel = messageObj.channel || defaultValues.channel;                                                              // 13
                                                                                                                     //
	channelType = channel[0];                                                                                           // 15
                                                                                                                     //
	channel = channel.substr(1);                                                                                        // 17
                                                                                                                     //
	switch (channelType) {                                                                                              // 19
		case '#':                                                                                                          // 20
			room = RocketChat.models.Rooms.findOne({                                                                          // 21
				$or: [{                                                                                                          // 22
					_id: channel                                                                                                    // 24
				}, {                                                                                                             //
					name: channel                                                                                                   // 26
				}]                                                                                                               //
			});                                                                                                               //
			if (!_.isObject(room)) {                                                                                          // 30
				throw new Meteor.Error('invalid-channel');                                                                       // 31
			}                                                                                                                 //
			rid = room._id;                                                                                                   // 33
			if (room.t === 'c') {                                                                                             // 34
				Meteor.runAsUser(user._id, function () {                                                                         // 35
					return Meteor.call('joinRoom', room._id);                                                                       // 36
				});                                                                                                              //
			}                                                                                                                 //
			break;                                                                                                            // 39
		case '@':                                                                                                          // 39
			roomUser = RocketChat.models.Users.findOne({                                                                      // 41
				$or: [{                                                                                                          // 42
					_id: channel                                                                                                    // 44
				}, {                                                                                                             //
					username: channel                                                                                               // 46
				}]                                                                                                               //
			}) || {};                                                                                                         //
			rid = [user._id, roomUser._id].sort().join('');                                                                   // 50
			room = RocketChat.models.Rooms.findOne({                                                                          // 51
				_id: {                                                                                                           // 52
					$in: [rid, channel]                                                                                             // 53
				}                                                                                                                //
			});                                                                                                               //
			if (!_.isObject(roomUser) && !_.isObject(room)) {                                                                 // 56
				throw new Meteor.Error('invalid-channel');                                                                       // 57
			}                                                                                                                 //
			if (!room) {                                                                                                      // 59
				Meteor.runAsUser(user._id, function () {                                                                         // 60
					Meteor.call('createDirectMessage', roomUser.username);                                                          // 61
					room = RocketChat.models.Rooms.findOne(rid);                                                                    // 62
				});                                                                                                              //
			}                                                                                                                 //
			break;                                                                                                            // 65
		default:                                                                                                           // 65
			throw new Meteor.Error('invalid-channel-type');                                                                   // 67
	}                                                                                                                   // 67
                                                                                                                     //
	if (messageObj.attachments && !_.isArray(messageObj.attachments)) {                                                 // 70
		console.log('Attachments should be Array, ignoring value'.red, messageObj.attachments);                            // 71
		messageObj.attachments = undefined;                                                                                // 72
	}                                                                                                                   //
                                                                                                                     //
	message = {                                                                                                         // 75
		alias: messageObj.username || messageObj.alias || defaultValues.alias,                                             // 76
		msg: _.trim(messageObj.text || messageObj.msg || ''),                                                              // 77
		attachments: messageObj.attachments,                                                                               // 78
		parseUrls: messageObj.parseUrls !== undefined ? messageObj.parseUrls : !messageObj.attachments,                    // 79
		bot: messageObj.bot,                                                                                               // 80
		groupable: false                                                                                                   // 81
	};                                                                                                                  //
                                                                                                                     //
	if (!_.isEmpty(messageObj.icon_url) || !_.isEmpty(messageObj.avatar)) {                                             // 84
		message.avatar = messageObj.icon_url || messageObj.avatar;                                                         // 85
	} else if (!_.isEmpty(messageObj.icon_emoji) || !_.isEmpty(messageObj.emoji)) {                                     //
		message.emoji = messageObj.icon_emoji || messageObj.emoji;                                                         // 87
	} else if (!_.isEmpty(defaultValues.avatar)) {                                                                      //
		message.avatar = defaultValues.avatar;                                                                             // 89
	} else if (!_.isEmpty(defaultValues.emoji)) {                                                                       //
		message.emoji = defaultValues.emoji;                                                                               // 91
	}                                                                                                                   //
                                                                                                                     //
	if (_.isArray(message.attachments)) {                                                                               // 94
		ref = message.attachments;                                                                                         // 95
		for (i = 0, len = ref.length; i < len; i++) {                                                                      // 96
			attachment = ref[i];                                                                                              // 97
			if (attachment.msg) {                                                                                             // 98
				attachment.text = _.trim(attachment.msg);                                                                        // 99
				delete attachment.msg;                                                                                           // 100
			}                                                                                                                 //
		}                                                                                                                  //
	}                                                                                                                   //
                                                                                                                     //
	var messageReturn = RocketChat.sendMessage(user, message, room, {});                                                // 105
                                                                                                                     //
	return {                                                                                                            // 107
		channel: channel,                                                                                                  // 108
		message: messageReturn                                                                                             // 109
	};                                                                                                                  //
};                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:integrations'] = {};

})();

//# sourceMappingURL=rocketchat_integrations.js.map
