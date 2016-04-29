(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var RocketChatFile = Package['rocketchat:file'].RocketChatFile;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var WebAppHashing = Package['webapp-hashing'].WebAppHashing;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_assets/server/assets.coffee.js                                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var assets, calculateClientHash, crypto, fn, key, mime, sizeOf, value,                                            // 1
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                  //
sizeOf = Npm.require('image-size');                                                                               // 1
                                                                                                                  //
mime = Npm.require('mime-types');                                                                                 // 1
                                                                                                                  //
crypto = Npm.require('crypto');                                                                                   // 1
                                                                                                                  //
mime.extensions['image/vnd.microsoft.icon'] = ['ico'];                                                            // 1
                                                                                                                  //
this.RocketChatAssetsInstance = new RocketChatFile.GridFS({                                                       // 1
  name: 'assets'                                                                                                  // 8
});                                                                                                               //
                                                                                                                  //
assets = {                                                                                                        // 1
  'logo': {                                                                                                       // 12
    label: 'logo (svg, png, jpg)',                                                                                // 13
    defaultUrl: 'images/logo/logo.svg',                                                                           // 13
    constraints: {                                                                                                // 13
      type: 'image',                                                                                              // 16
      extensions: ['svg', 'png', 'jpg', 'jpeg'],                                                                  // 16
      width: void 0,                                                                                              // 16
      height: void 0                                                                                              // 16
    }                                                                                                             //
  },                                                                                                              //
  'favicon_ico': {                                                                                                // 12
    label: 'favicon.ico',                                                                                         // 21
    defaultUrl: 'favicon.ico',                                                                                    // 21
    constraints: {                                                                                                // 21
      type: 'image',                                                                                              // 24
      extensions: ['ico'],                                                                                        // 24
      width: void 0,                                                                                              // 24
      height: void 0                                                                                              // 24
    }                                                                                                             //
  },                                                                                                              //
  'favicon': {                                                                                                    // 12
    label: 'favicon.svg',                                                                                         // 29
    defaultUrl: 'images/logo/icon.svg',                                                                           // 29
    constraints: {                                                                                                // 29
      type: 'image',                                                                                              // 32
      extensions: ['svg'],                                                                                        // 32
      width: void 0,                                                                                              // 32
      height: void 0                                                                                              // 32
    }                                                                                                             //
  },                                                                                                              //
  'favicon_64': {                                                                                                 // 12
    label: 'favicon.png (64x64)',                                                                                 // 37
    defaultUrl: 'images/logo/favicon-64x64.png',                                                                  // 37
    constraints: {                                                                                                // 37
      type: 'image',                                                                                              // 40
      extensions: ['png'],                                                                                        // 40
      width: 64,                                                                                                  // 40
      height: 64                                                                                                  // 40
    }                                                                                                             //
  },                                                                                                              //
  'favicon_96': {                                                                                                 // 12
    label: 'favicon.png (96x96)',                                                                                 // 45
    defaultUrl: 'images/logo/favicon-96x96.png',                                                                  // 45
    constraints: {                                                                                                // 45
      type: 'image',                                                                                              // 48
      extensions: ['png'],                                                                                        // 48
      width: 96,                                                                                                  // 48
      height: 96                                                                                                  // 48
    }                                                                                                             //
  },                                                                                                              //
  'favicon_128': {                                                                                                // 12
    label: 'favicon.png (128x128)',                                                                               // 53
    defaultUrl: 'images/logo/favicon-128x128.png',                                                                // 53
    constraints: {                                                                                                // 53
      type: 'image',                                                                                              // 56
      extensions: ['png'],                                                                                        // 56
      width: 128,                                                                                                 // 56
      height: 128                                                                                                 // 56
    }                                                                                                             //
  },                                                                                                              //
  'favicon_192': {                                                                                                // 12
    label: 'favicon.png (192x192)',                                                                               // 61
    defaultUrl: 'images/logo/android-chrome-192x192.png',                                                         // 61
    constraints: {                                                                                                // 61
      type: 'image',                                                                                              // 64
      extensions: ['png'],                                                                                        // 64
      width: 192,                                                                                                 // 64
      height: 192                                                                                                 // 64
    }                                                                                                             //
  },                                                                                                              //
  'favicon_256': {                                                                                                // 12
    label: 'favicon.png (256x256)',                                                                               // 69
    defaultUrl: 'images/logo/favicon-256x256.png',                                                                // 69
    constraints: {                                                                                                // 69
      type: 'image',                                                                                              // 72
      extensions: ['png'],                                                                                        // 72
      width: 256,                                                                                                 // 72
      height: 256                                                                                                 // 72
    }                                                                                                             //
  }                                                                                                               //
};                                                                                                                //
                                                                                                                  //
RocketChat.Assets = new ((function() {                                                                            // 1
  function _Class() {}                                                                                            //
                                                                                                                  //
  _Class.prototype.mime = mime;                                                                                   // 79
                                                                                                                  //
  _Class.prototype.assets = assets;                                                                               // 79
                                                                                                                  //
  _Class.prototype.setAsset = function(binaryContent, contentType, asset) {                                       // 79
    var dimensions, extension, file, rs, ws;                                                                      // 83
    if (assets[asset] == null) {                                                                                  // 83
      throw new Meteor.Error("Invalid_asset");                                                                    // 84
    }                                                                                                             //
    extension = mime.extension(contentType);                                                                      // 83
    if (indexOf.call(assets[asset].constraints.extensions, extension) < 0) {                                      // 87
      throw new Meteor.Error("Invalid_file_type", contentType);                                                   // 88
    }                                                                                                             //
    file = new Buffer(binaryContent, 'binary');                                                                   // 83
    if ((assets[asset].constraints.width != null) || (assets[asset].constraints.height != null)) {                // 91
      dimensions = sizeOf(file);                                                                                  // 92
      if ((assets[asset].constraints.width != null) && assets[asset].constraints.width !== dimensions.width) {    // 94
        throw new Meteor.Error("Invalid_file_width");                                                             // 95
      }                                                                                                           //
      if ((assets[asset].constraints.height != null) && assets[asset].constraints.height !== dimensions.height) {
        throw new Meteor.Error("Invalid_file_height");                                                            // 98
      }                                                                                                           //
    }                                                                                                             //
    rs = RocketChatFile.bufferToStream(file);                                                                     // 83
    RocketChatAssetsInstance.deleteFile(asset);                                                                   // 83
    ws = RocketChatAssetsInstance.createWriteStream(asset, contentType);                                          // 83
    ws.on('end', Meteor.bindEnvironment(function() {                                                              // 83
      return Meteor.setTimeout(function() {                                                                       //
        return RocketChat.settings.updateById("Assets_" + asset, {                                                //
          url: "/assets/" + asset + "." + extension,                                                              // 105
          defaultUrl: assets[asset].defaultUrl                                                                    // 105
        });                                                                                                       //
      }, 200);                                                                                                    //
    }));                                                                                                          //
    rs.pipe(ws);                                                                                                  // 83
  };                                                                                                              //
                                                                                                                  //
  _Class.prototype.unsetAsset = function(asset) {                                                                 // 79
    if (assets[asset] == null) {                                                                                  // 115
      throw new Meteor.Error("Invalid_asset");                                                                    // 116
    }                                                                                                             //
    RocketChatAssetsInstance.deleteFile(asset);                                                                   // 115
    RocketChat.settings.updateById("Assets_" + asset, {                                                           // 115
      defaultUrl: assets[asset].defaultUrl                                                                        // 120
    });                                                                                                           //
  };                                                                                                              //
                                                                                                                  //
  _Class.prototype.refreshClients = function() {                                                                  // 79
    return process.emit('message', {                                                                              //
      refresh: 'client'                                                                                           // 124
    });                                                                                                           //
  };                                                                                                              //
                                                                                                                  //
  return _Class;                                                                                                  //
                                                                                                                  //
})());                                                                                                            //
                                                                                                                  //
RocketChat.settings.addGroup('Assets');                                                                           // 1
                                                                                                                  //
fn = function(key, value) {                                                                                       // 128
  return RocketChat.settings.add("Assets_" + key, {                                                               //
    defaultUrl: value.defaultUrl                                                                                  // 130
  }, {                                                                                                            //
    type: 'asset',                                                                                                // 130
    group: 'Assets',                                                                                              // 130
    fileConstraints: value.constraints,                                                                           // 130
    i18nLabel: value.label,                                                                                       // 130
    asset: key,                                                                                                   // 130
    "public": true                                                                                                // 130
  });                                                                                                             //
};                                                                                                                // 129
for (key in assets) {                                                                                             // 128
  value = assets[key];                                                                                            //
  fn(key, value);                                                                                                 // 129
}                                                                                                                 // 128
                                                                                                                  //
Meteor.startup(function() {                                                                                       // 1
  var forEachAsset, results;                                                                                      // 133
  forEachAsset = function(key, value) {                                                                           // 133
    return RocketChat.settings.get("Assets_" + key, function(settingKey, settingValue) {                          //
      var data, file;                                                                                             // 135
      if ((settingValue != null ? settingValue.url : void 0) == null) {                                           // 135
        value.cache = void 0;                                                                                     // 136
        return;                                                                                                   // 137
      }                                                                                                           //
      file = RocketChatAssetsInstance.getFileWithReadStream(key);                                                 // 135
      if (!file) {                                                                                                // 140
        value.cache = void 0;                                                                                     // 141
        return;                                                                                                   // 142
      }                                                                                                           //
      data = [];                                                                                                  // 135
      file.readStream.on('data', Meteor.bindEnvironment(function(chunk) {                                         // 135
        return data.push(chunk);                                                                                  //
      }));                                                                                                        //
      return file.readStream.on('end', Meteor.bindEnvironment(function() {                                        //
        var extension, hash;                                                                                      // 149
        data = Buffer.concat(data);                                                                               // 149
        hash = crypto.createHash('sha1').update(data).digest('hex');                                              // 149
        extension = settingValue.url.split('.').pop();                                                            // 149
        return value.cache = {                                                                                    //
          path: "assets/" + key + "." + extension,                                                                // 153
          cacheable: false,                                                                                       // 153
          sourceMapUrl: void 0,                                                                                   // 153
          where: 'client',                                                                                        // 153
          type: 'asset',                                                                                          // 153
          content: data,                                                                                          // 153
          extension: extension,                                                                                   // 153
          url: "/assets/" + key + "." + extension + "?" + hash,                                                   // 153
          size: file.length,                                                                                      // 153
          uploadDate: file.uploadDate,                                                                            // 153
          contentType: file.contentType,                                                                          // 153
          hash: hash                                                                                              // 153
        };                                                                                                        //
      }));                                                                                                        //
    });                                                                                                           //
  };                                                                                                              //
  results = [];                                                                                                   // 167
  for (key in assets) {                                                                                           //
    value = assets[key];                                                                                          //
    results.push(forEachAsset(key, value));                                                                       // 167
  }                                                                                                               // 167
  return results;                                                                                                 //
});                                                                                                               // 132
                                                                                                                  //
calculateClientHash = WebAppHashing.calculateClientHash;                                                          // 1
                                                                                                                  //
WebAppHashing.calculateClientHash = function(manifest, includeFilter, runtimeConfigOverride) {                    // 1
  var cache, extension, index, manifestItem;                                                                      // 171
  for (key in assets) {                                                                                           // 171
    value = assets[key];                                                                                          //
    if ((value.cache == null) && (value.defaultUrl == null)) {                                                    // 172
      continue;                                                                                                   // 173
    }                                                                                                             //
    manifestItem = _.find(manifest, function(item) {                                                              // 172
      return item.path === key;                                                                                   // 176
    });                                                                                                           //
    cache = {};                                                                                                   // 172
    if (value.cache) {                                                                                            // 179
      cache = {                                                                                                   // 180
        path: value.cache.path,                                                                                   // 181
        cacheable: value.cache.cacheable,                                                                         // 181
        sourceMapUrl: value.cache.sourceMapUrl,                                                                   // 181
        where: value.cache.where,                                                                                 // 181
        type: value.cache.type,                                                                                   // 181
        url: value.cache.url,                                                                                     // 181
        size: value.cache.size,                                                                                   // 181
        hash: value.cache.hash                                                                                    // 181
      };                                                                                                          //
      WebAppInternals.staticFiles["/__cordova/assets/" + key] = value.cache;                                      // 180
      WebAppInternals.staticFiles["/__cordova/assets/" + key + "." + value.cache.extension] = value.cache;        // 180
    } else {                                                                                                      //
      extension = value.defaultUrl.split('.').pop();                                                              // 193
      cache = {                                                                                                   // 193
        path: "assets/" + key + "." + extension,                                                                  // 195
        cacheable: false,                                                                                         // 195
        sourceMapUrl: void 0,                                                                                     // 195
        where: 'client',                                                                                          // 195
        type: 'asset',                                                                                            // 195
        url: "/assets/" + key + "." + extension + "?v3",                                                          // 195
        hash: 'v3'                                                                                                // 195
      };                                                                                                          //
      WebAppInternals.staticFiles["/__cordova/assets/" + key] = WebAppInternals.staticFiles["/__cordova/" + value.defaultUrl];
      WebAppInternals.staticFiles["/__cordova/assets/" + key + "." + extension] = WebAppInternals.staticFiles["/__cordova/" + value.defaultUrl];
    }                                                                                                             //
    if (manifestItem != null) {                                                                                   // 208
      index = manifest.indexOf(manifestItem);                                                                     // 209
      manifest[index] = cache;                                                                                    // 209
    } else {                                                                                                      //
      manifest.push(cache);                                                                                       // 213
    }                                                                                                             //
  }                                                                                                               // 171
  return calculateClientHash.call(this, manifest, includeFilter, runtimeConfigOverride);                          // 215
};                                                                                                                // 170
                                                                                                                  //
Meteor.methods({                                                                                                  // 1
  refreshClients: function() {                                                                                    // 219
    var hasPermission;                                                                                            // 220
    if (!Meteor.userId()) {                                                                                       // 220
      throw new Meteor.Error('invalid-user', "[methods] unsetAsset -> Invalid user");                             // 221
    }                                                                                                             //
    hasPermission = RocketChat.authz.hasPermission(Meteor.userId(), 'manage-assets');                             // 220
    if (!hasPermission) {                                                                                         // 224
      throw new Meteor.Error('manage-assets-not-allowed', "[methods] unsetAsset -> Manage assets not allowed");   // 225
    }                                                                                                             //
    return RocketChat.Assets.refreshClients;                                                                      //
  },                                                                                                              //
  unsetAsset: function(asset) {                                                                                   // 219
    var hasPermission;                                                                                            // 231
    if (!Meteor.userId()) {                                                                                       // 231
      throw new Meteor.Error('invalid-user', "[methods] unsetAsset -> Invalid user");                             // 232
    }                                                                                                             //
    hasPermission = RocketChat.authz.hasPermission(Meteor.userId(), 'manage-assets');                             // 231
    if (!hasPermission) {                                                                                         // 235
      throw new Meteor.Error('manage-assets-not-allowed', "[methods] unsetAsset -> Manage assets not allowed");   // 236
    }                                                                                                             //
    return RocketChat.Assets.unsetAsset(asset);                                                                   //
  },                                                                                                              //
  setAsset: function(binaryContent, contentType, asset) {                                                         // 219
    var hasPermission;                                                                                            // 242
    if (!Meteor.userId()) {                                                                                       // 242
      throw new Meteor.Error('invalid-user', "[methods] setAsset -> Invalid user");                               // 243
    }                                                                                                             //
    hasPermission = RocketChat.authz.hasPermission(Meteor.userId(), 'manage-assets');                             // 242
    if (!hasPermission) {                                                                                         // 246
      throw new Meteor.Error('manage-assets-not-allowed', "[methods] unsetAsset -> Manage assets not allowed");   // 247
    }                                                                                                             //
    RocketChat.Assets.setAsset(binaryContent, contentType, asset);                                                // 242
  }                                                                                                               //
});                                                                                                               //
                                                                                                                  //
WebApp.connectHandlers.use('/assets/', Meteor.bindEnvironment(function(req, res, next) {                          // 1
  var file, params, ref, ref1, ref2, ref3, reqModifiedHeader;                                                     // 254
  params = {                                                                                                      // 254
    asset: decodeURIComponent(req.url.replace(/^\//, '').replace(/\?.*$/, '')).replace(/\.[^.]*$/, '')            // 255
  };                                                                                                              //
  file = (ref = assets[params.asset]) != null ? ref.cache : void 0;                                               // 254
  if (file == null) {                                                                                             // 259
    if (((ref1 = assets[params.asset]) != null ? ref1.defaultUrl : void 0) != null) {                             // 260
      req.url = '/' + assets[params.asset].defaultUrl;                                                            // 261
      WebAppInternals.staticFilesMiddleware(WebAppInternals.staticFiles, req, res, next);                         // 261
    } else {                                                                                                      //
      res.writeHead(404);                                                                                         // 264
      res.end();                                                                                                  // 264
    }                                                                                                             //
    return;                                                                                                       // 267
  }                                                                                                               //
  reqModifiedHeader = req.headers["if-modified-since"];                                                           // 254
  if (reqModifiedHeader != null) {                                                                                // 270
    if (reqModifiedHeader === ((ref2 = file.uploadDate) != null ? ref2.toUTCString() : void 0)) {                 // 271
      res.setHeader('Last-Modified', reqModifiedHeader);                                                          // 272
      res.writeHead(304);                                                                                         // 272
      res.end();                                                                                                  // 272
      return;                                                                                                     // 275
    }                                                                                                             //
  }                                                                                                               //
  res.setHeader('Cache-Control', 'public, max-age=0');                                                            // 254
  res.setHeader('Expires', '-1');                                                                                 // 254
  res.setHeader('Last-Modified', ((ref3 = file.uploadDate) != null ? ref3.toUTCString() : void 0) || new Date().toUTCString());
  res.setHeader('Content-Type', file.contentType);                                                                // 254
  res.setHeader('Content-Length', file.size);                                                                     // 254
  res.writeHead(200);                                                                                             // 254
  res.end(file.content);                                                                                          // 254
}));                                                                                                              // 253
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:assets'] = {};

})();

//# sourceMappingURL=rocketchat_assets.js.map
