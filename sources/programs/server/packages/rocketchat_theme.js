(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var WebAppHashing = Package['webapp-hashing'].WebAppHashing;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/rocketchat_theme/server/server.coffee.js                                                  //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var autoprefixer, calculateClientHash, crypto, less, logger;                                          // 1
                                                                                                      //
less = Npm.require('less');                                                                           // 1
                                                                                                      //
autoprefixer = Npm.require('less-plugin-autoprefix');                                                 // 1
                                                                                                      //
crypto = Npm.require('crypto');                                                                       // 1
                                                                                                      //
logger = new Logger('rocketchat:theme', {                                                             // 1
  methods: {                                                                                          // 6
    stop_rendering: {                                                                                 // 7
      type: 'info'                                                                                    // 8
    }                                                                                                 //
  }                                                                                                   //
});                                                                                                   //
                                                                                                      //
calculateClientHash = WebAppHashing.calculateClientHash;                                              // 1
                                                                                                      //
WebAppHashing.calculateClientHash = function(manifest, includeFilter, runtimeConfigOverride) {        // 1
  var css, hash, themeManifestItem;                                                                   // 13
  css = RocketChat.theme.getCss();                                                                    // 13
  WebAppInternals.staticFiles['/__cordova/theme.css'] = WebAppInternals.staticFiles['/theme.css'] = {
    cacheable: true,                                                                                  // 16
    sourceMapUrl: void 0,                                                                             // 16
    type: 'css',                                                                                      // 16
    content: css                                                                                      // 16
  };                                                                                                  //
  hash = crypto.createHash('sha1').update(css).digest('hex');                                         // 13
  themeManifestItem = _.find(manifest, function(item) {                                               // 13
    return item.path === 'app/theme.css';                                                             // 23
  });                                                                                                 //
  if (themeManifestItem == null) {                                                                    // 24
    themeManifestItem = {};                                                                           // 25
    manifest.push(themeManifestItem);                                                                 // 25
  }                                                                                                   //
  themeManifestItem.path = 'app/theme.css';                                                           // 13
  themeManifestItem.type = 'css';                                                                     // 13
  themeManifestItem.cacheable = true;                                                                 // 13
  themeManifestItem.where = 'client';                                                                 // 13
  themeManifestItem.url = "/theme.css?" + hash;                                                       // 13
  themeManifestItem.size = css.length;                                                                // 13
  themeManifestItem.hash = hash;                                                                      // 13
  return calculateClientHash.call(this, manifest, includeFilter, runtimeConfigOverride);              //
};                                                                                                    // 12
                                                                                                      //
RocketChat.theme = new ((function() {                                                                 // 1
  _Class.prototype.variables = {};                                                                    // 40
                                                                                                      //
  _Class.prototype.packageCallbacks = [];                                                             // 40
                                                                                                      //
  _Class.prototype.files = ['assets/stylesheets/global/_variables.less', 'assets/stylesheets/utils/_keyframes.import.less', 'assets/stylesheets/utils/_lesshat.import.less', 'assets/stylesheets/utils/_preloader.import.less', 'assets/stylesheets/utils/_reset.import.less', 'assets/stylesheets/utils/_chatops.less', 'assets/stylesheets/animation.css', 'assets/stylesheets/base.less', 'assets/stylesheets/fontello.css', 'assets/stylesheets/rtl.less', 'assets/stylesheets/swipebox.min.css', 'assets/stylesheets/utils/_colors.import.less'];
                                                                                                      //
  function _Class() {                                                                                 // 57
    this.customCSS = '';                                                                              // 58
    RocketChat.settings.add('css', '');                                                               // 58
    RocketChat.settings.addGroup('Layout');                                                           // 58
    this.compileDelayed = _.debounce(Meteor.bindEnvironment(this.compile.bind(this)), 300);           // 58
    RocketChat.settings.onload('*', Meteor.bindEnvironment((function(_this) {                         // 58
      return function(key, value, initialLoad) {                                                      //
        var name;                                                                                     // 66
        if (key === 'theme-custom-css') {                                                             // 66
          if ((value != null ? value.trim() : void 0) !== '') {                                       // 67
            _this.customCSS = value;                                                                  // 68
          }                                                                                           //
        } else if (/^theme-.+/.test(key) === true) {                                                  //
          name = key.replace(/^theme-[a-z]+-/, '');                                                   // 70
          if (_this.variables[name] != null) {                                                        // 71
            _this.variables[name].value = value;                                                      // 72
          }                                                                                           //
        } else {                                                                                      //
          return;                                                                                     // 74
        }                                                                                             //
        return _this.compileDelayed();                                                                //
      };                                                                                              //
    })(this)));                                                                                       //
  }                                                                                                   //
                                                                                                      //
  _Class.prototype.compile = function() {                                                             // 40
    var content, file, i, j, len, len1, options, packageCallback, ref, ref1, result, start;           // 79
    content = [this.getVariablesAsLess()];                                                            // 79
    ref = this.files;                                                                                 // 83
    for (i = 0, len = ref.length; i < len; i++) {                                                     // 83
      file = ref[i];                                                                                  //
      content.push(Assets.getText(file));                                                             // 83
    }                                                                                                 // 83
    ref1 = this.packageCallbacks;                                                                     // 85
    for (j = 0, len1 = ref1.length; j < len1; j++) {                                                  // 85
      packageCallback = ref1[j];                                                                      //
      result = packageCallback();                                                                     // 86
      if (_.isString(result)) {                                                                       // 87
        content.push(result);                                                                         // 88
      }                                                                                               //
    }                                                                                                 // 85
    content.push(this.customCSS);                                                                     // 79
    content = content.join('\n');                                                                     // 79
    options = {                                                                                       // 79
      compress: true,                                                                                 // 95
      plugins: [new autoprefixer()]                                                                   // 95
    };                                                                                                //
    start = Date.now();                                                                               // 79
    return less.render(content, options, function(err, data) {                                        //
      logger.stop_rendering(Date.now() - start);                                                      // 102
      if (err != null) {                                                                              // 103
        return console.log(err);                                                                      // 104
      }                                                                                               //
      RocketChat.settings.updateById('css', data.css);                                                // 102
      return process.emit('message', {                                                                //
        refresh: 'client'                                                                             // 108
      });                                                                                             //
    });                                                                                               //
  };                                                                                                  //
                                                                                                      //
  _Class.prototype.addVariable = function(type, name, value, persist) {                               // 40
    var config;                                                                                       // 111
    if (persist == null) {                                                                            //
      persist = true;                                                                                 //
    }                                                                                                 //
    this.variables[name] = {                                                                          // 111
      type: type,                                                                                     // 112
      value: value                                                                                    // 112
    };                                                                                                //
    if (persist === true) {                                                                           // 115
      config = {                                                                                      // 116
        group: 'Layout',                                                                              // 117
        type: type,                                                                                   // 117
        section: 'Colors',                                                                            // 117
        "public": false                                                                               // 117
      };                                                                                              //
      return RocketChat.settings.add("theme-" + type + "-" + name, value, config);                    //
    }                                                                                                 //
  };                                                                                                  //
                                                                                                      //
  _Class.prototype.addPublicColor = function(name, value) {                                           // 40
    return this.addVariable('color', name, value, true);                                              //
  };                                                                                                  //
                                                                                                      //
  _Class.prototype.getVariablesAsObject = function() {                                                // 40
    var name, obj, ref, variable;                                                                     // 128
    obj = {};                                                                                         // 128
    ref = this.variables;                                                                             // 129
    for (name in ref) {                                                                               // 129
      variable = ref[name];                                                                           //
      obj[name] = variable.value;                                                                     // 130
    }                                                                                                 // 129
    return obj;                                                                                       // 132
  };                                                                                                  //
                                                                                                      //
  _Class.prototype.getVariablesAsLess = function() {                                                  // 40
    var items, name, ref, variable;                                                                   // 135
    items = [];                                                                                       // 135
    ref = this.variables;                                                                             // 136
    for (name in ref) {                                                                               // 136
      variable = ref[name];                                                                           //
      items.push("@" + name + ": " + variable.value + ";");                                           // 137
    }                                                                                                 // 136
    return items.join('\n');                                                                          // 139
  };                                                                                                  //
                                                                                                      //
  _Class.prototype.addPackageAsset = function(cb) {                                                   // 40
    this.packageCallbacks.push(cb);                                                                   // 142
    return this.compileDelayed();                                                                     //
  };                                                                                                  //
                                                                                                      //
  _Class.prototype.getCss = function() {                                                              // 40
    return RocketChat.settings.get('css');                                                            // 146
  };                                                                                                  //
                                                                                                      //
  return _Class;                                                                                      //
                                                                                                      //
})());                                                                                                //
                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/rocketchat_theme/server/variables.coffee.js                                               //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.theme.addPublicColor("primary-background-color", "#04436a");                               // 1
                                                                                                      //
RocketChat.theme.addPublicColor("primary-font-color", "#444444");                                     // 1
                                                                                                      //
RocketChat.theme.addPublicColor("secondary-background-color", "#f4f4f4");                             // 1
                                                                                                      //
RocketChat.theme.addPublicColor("secondary-font-color", "#7f7f7f");                                   // 1
                                                                                                      //
RocketChat.theme.addPublicColor("tertiary-background-color", "#eaeaea");                              // 1
                                                                                                      //
RocketChat.theme.addPublicColor("tertiary-font-color", "rgba(255, 255, 255, 0.6)");                   // 1
                                                                                                      //
RocketChat.theme.addPublicColor("quaternary-font-color", "#ffffff");                                  // 1
                                                                                                      //
RocketChat.theme.addPublicColor("action-buttons-color", "#13679a");                                   // 1
                                                                                                      //
RocketChat.theme.addPublicColor("active-channel-background-color", "rgba(255, 255, 255, 0.075)");     // 1
                                                                                                      //
RocketChat.theme.addPublicColor("active-channel-font-color", "rgba(255, 255, 255, 0.75)");            // 1
                                                                                                      //
RocketChat.theme.addPublicColor("blockquote-background", "#cccccc");                                  // 1
                                                                                                      //
RocketChat.theme.addPublicColor("clean-buttons-color", "rgba(0, 0, 0, 0.25)");                        // 1
                                                                                                      //
RocketChat.theme.addPublicColor("code-background", "#f8f8f8");                                        // 1
                                                                                                      //
RocketChat.theme.addPublicColor("code-border", "#cccccc");                                            // 1
                                                                                                      //
RocketChat.theme.addPublicColor("code-color", "#333333");                                             // 1
                                                                                                      //
RocketChat.theme.addPublicColor("content-background-color", "#ffffff");                               // 1
                                                                                                      //
RocketChat.theme.addPublicColor("custom-scrollbar-color", "rgba(255, 255, 255, 0.05)");               // 1
                                                                                                      //
RocketChat.theme.addPublicColor("info-active-font-color", "#ff0000");                                 // 1
                                                                                                      //
RocketChat.theme.addPublicColor("info-font-color", "#aaaaaa");                                        // 1
                                                                                                      //
RocketChat.theme.addPublicColor("input-font-color", "rgba(255, 255, 255, 0.85)");                     // 1
                                                                                                      //
RocketChat.theme.addPublicColor("link-font-color", "#008ce3");                                        // 1
                                                                                                      //
RocketChat.theme.addPublicColor("message-hover-background-color", "rgba(0, 0, 0, 0.025)");            // 1
                                                                                                      //
RocketChat.theme.addPublicColor("smallprint-font-color", "#c2e7ff");                                  // 1
                                                                                                      //
RocketChat.theme.addPublicColor("smallprint-hover-color", "#ffffff");                                 // 1
                                                                                                      //
RocketChat.theme.addPublicColor("status-away", "#fcb316");                                            // 1
                                                                                                      //
RocketChat.theme.addPublicColor("status-busy", "#d30230");                                            // 1
                                                                                                      //
RocketChat.theme.addPublicColor("status-offline", "rgba(150, 150, 150, 0.50)");                       // 1
                                                                                                      //
RocketChat.theme.addPublicColor("status-online", "#35ac19");                                          // 1
                                                                                                      //
RocketChat.theme.addPublicColor("unread-notification-color", "#1dce73");                              // 1
                                                                                                      //
RocketChat.settings.add("theme-custom-css", '', {                                                     // 1
  group: 'Layout',                                                                                    // 34
  type: 'code',                                                                                       // 34
  code: 'text/x-less',                                                                                // 34
  multiline: true,                                                                                    // 34
  section: 'Custom CSS',                                                                              // 34
  "public": false                                                                                     // 34
});                                                                                                   //
                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:theme'] = {};

})();

//# sourceMappingURL=rocketchat_theme.js.map
