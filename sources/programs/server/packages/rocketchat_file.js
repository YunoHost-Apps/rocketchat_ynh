(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, RocketChatFile;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/rocketchat_file/file.server.coffee.js                                            //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Grid, detectGM, exec, fs, gm, mkdirp, path, stream;                                      // 1
                                                                                             //
Grid = Npm.require('gridfs-stream');                                                         // 1
                                                                                             //
stream = Npm.require('stream');                                                              // 1
                                                                                             //
fs = Npm.require('fs');                                                                      // 1
                                                                                             //
path = Npm.require('path');                                                                  // 1
                                                                                             //
mkdirp = Npm.require('mkdirp');                                                              // 1
                                                                                             //
gm = Npm.require('gm');                                                                      // 1
                                                                                             //
exec = Npm.require('child_process').exec;                                                    // 1
                                                                                             //
Grid.prototype.tryParseObjectId = function() {                                               // 1
  return false;                                                                              //
};                                                                                           // 10
                                                                                             //
RocketChatFile = {                                                                           // 1
  gm: gm,                                                                                    // 13
  enabled: void 0,                                                                           // 13
  enable: function() {                                                                       // 13
    RocketChatFile.enabled = true;                                                           // 16
    return RocketChat.settings.updateOptionsById('Accounts_AvatarResize', {                  //
      alert: void 0                                                                          // 17
    });                                                                                      //
  },                                                                                         //
  disable: function() {                                                                      // 13
    RocketChatFile.enabled = false;                                                          // 19
    return RocketChat.settings.updateOptionsById('Accounts_AvatarResize', {                  //
      alert: 'The_image_resize_will_not_work_because_we_can_not_detect_ImageMagick_or_GraphicsMagick_installed_in_your_server'
    });                                                                                      //
  }                                                                                          //
};                                                                                           //
                                                                                             //
detectGM = function() {                                                                      // 1
  return exec('gm version', Meteor.bindEnvironment(function(error, stdout, stderr) {         //
    if ((error == null) && stdout.indexOf('GraphicsMagick') > -1) {                          // 25
      RocketChatFile.enable();                                                               // 26
      RocketChat.Info.GraphicsMagick = {                                                     // 26
        enabled: true,                                                                       // 29
        version: stdout                                                                      // 29
      };                                                                                     //
    } else {                                                                                 //
      RocketChat.Info.GraphicsMagick = {                                                     // 32
        enabled: false                                                                       // 33
      };                                                                                     //
    }                                                                                        //
    return exec('convert -version', Meteor.bindEnvironment(function(error, stdout, stderr) {
      if ((error == null) && stdout.indexOf('ImageMagick') > -1) {                           // 36
        if (RocketChatFile.enabled !== true) {                                               // 37
          RocketChatFile.gm = RocketChatFile.gm.subClass({                                   // 39
            imageMagick: true                                                                // 39
          });                                                                                //
          RocketChatFile.enable();                                                           // 39
        }                                                                                    //
        return RocketChat.Info.ImageMagick = {                                               //
          enabled: true,                                                                     // 43
          version: stdout                                                                    // 43
        };                                                                                   //
      } else {                                                                               //
        if (RocketChatFile.enabled !== true) {                                               // 46
          RocketChatFile.disable();                                                          // 47
        }                                                                                    //
        return RocketChat.Info.ImageMagick = {                                               //
          enabled: false                                                                     // 50
        };                                                                                   //
      }                                                                                      //
    }));                                                                                     //
  }));                                                                                       //
};                                                                                           // 23
                                                                                             //
detectGM();                                                                                  // 1
                                                                                             //
Meteor.methods({                                                                             // 1
  'detectGM': function() {                                                                   // 55
    detectGM();                                                                              // 56
  }                                                                                          //
});                                                                                          //
                                                                                             //
RocketChatFile.bufferToStream = function(buffer) {                                           // 1
  var bufferStream;                                                                          // 61
  bufferStream = new stream.PassThrough();                                                   // 61
  bufferStream.end(buffer);                                                                  // 61
  return bufferStream;                                                                       // 63
};                                                                                           // 60
                                                                                             //
RocketChatFile.dataURIParse = function(dataURI) {                                            // 1
  var imageData;                                                                             // 66
  imageData = dataURI.split(';base64,');                                                     // 66
  return {                                                                                   // 67
    image: imageData[1],                                                                     // 67
    contentType: imageData[0].replace('data:', '')                                           // 67
  };                                                                                         //
};                                                                                           // 65
                                                                                             //
RocketChatFile.addPassThrough = function(st, fn) {                                           // 1
  var pass;                                                                                  // 73
  pass = new stream.PassThrough();                                                           // 73
  fn(pass, st);                                                                              // 73
  return pass;                                                                               // 75
};                                                                                           // 72
                                                                                             //
RocketChatFile.GridFS = (function() {                                                        // 1
  function _Class(config) {                                                                  // 79
    var db, mongo, name, transformWrite;                                                     // 80
    if (config == null) {                                                                    //
      config = {};                                                                           //
    }                                                                                        //
    name = config.name, transformWrite = config.transformWrite;                              // 80
    if (name == null) {                                                                      //
      name = 'file';                                                                         //
    }                                                                                        //
    this.name = name;                                                                        // 80
    this.transformWrite = transformWrite;                                                    // 80
    mongo = Package.mongo.MongoInternals.NpmModule;                                          // 80
    db = Package.mongo.MongoInternals.defaultRemoteCollectionDriver().mongo.db;              // 80
    this.store = new Grid(db, mongo);                                                        // 80
    this.findOneSync = Meteor.wrapAsync(this.store.collection(this.name).findOne.bind(this.store.collection(this.name)));
    this.removeSync = Meteor.wrapAsync(this.store.remove.bind(this.store));                  // 80
  }                                                                                          //
                                                                                             //
  _Class.prototype.findOne = function(fileName) {                                            // 79
    return this.findOneSync({                                                                // 95
      _id: fileName                                                                          // 95
    });                                                                                      //
  };                                                                                         //
                                                                                             //
  _Class.prototype.remove = function(fileName) {                                             // 79
    return this.removeSync({                                                                 // 98
      _id: fileName,                                                                         // 99
      root: this.name                                                                        // 99
    });                                                                                      //
  };                                                                                         //
                                                                                             //
  _Class.prototype.createWriteStream = function(fileName, contentType) {                     // 79
    var self, ws;                                                                            // 103
    self = this;                                                                             // 103
    ws = this.store.createWriteStream({                                                      // 103
      _id: fileName,                                                                         // 106
      filename: fileName,                                                                    // 106
      mode: 'w',                                                                             // 106
      root: this.name,                                                                       // 106
      content_type: contentType                                                              // 106
    });                                                                                      //
    if (self.transformWrite != null) {                                                       // 112
      ws = RocketChatFile.addPassThrough(ws, function(rs, ws) {                              // 113
        var file;                                                                            // 114
        file = {                                                                             // 114
          name: self.name,                                                                   // 115
          fileName: fileName,                                                                // 115
          contentType: contentType                                                           // 115
        };                                                                                   //
        return self.transformWrite(file, rs, ws);                                            //
      });                                                                                    //
    }                                                                                        //
    ws.on('close', function() {                                                              // 103
      return ws.emit('end');                                                                 //
    });                                                                                      //
    return ws;                                                                               // 124
  };                                                                                         //
                                                                                             //
  _Class.prototype.createReadStream = function(fileName) {                                   // 79
    return this.store.createReadStream({                                                     // 127
      _id: fileName,                                                                         // 128
      root: this.name                                                                        // 128
    });                                                                                      //
    return void 0;                                                                           // 130
  };                                                                                         //
                                                                                             //
  _Class.prototype.getFileWithReadStream = function(fileName) {                              // 79
    var file, rs;                                                                            // 133
    file = this.findOne(fileName);                                                           // 133
    if (file == null) {                                                                      // 134
      return void 0;                                                                         // 135
    }                                                                                        //
    rs = this.createReadStream(fileName);                                                    // 133
    return {                                                                                 // 139
      readStream: rs,                                                                        // 139
      contentType: file.contentType,                                                         // 139
      length: file.length,                                                                   // 139
      uploadDate: file.uploadDate                                                            // 139
    };                                                                                       //
  };                                                                                         //
                                                                                             //
  _Class.prototype.deleteFile = function(fileName) {                                         // 79
    var file;                                                                                // 147
    file = this.findOne(fileName);                                                           // 147
    if (file == null) {                                                                      // 148
      return void 0;                                                                         // 149
    }                                                                                        //
    return this.remove(fileName);                                                            // 151
  };                                                                                         //
                                                                                             //
  return _Class;                                                                             //
                                                                                             //
})();                                                                                        //
                                                                                             //
RocketChatFile.FileSystem = (function() {                                                    // 1
  function _Class(config) {                                                                  // 155
    var absolutePath, homepath, transformWrite;                                              // 156
    if (config == null) {                                                                    //
      config = {};                                                                           //
    }                                                                                        //
    absolutePath = config.absolutePath, transformWrite = config.transformWrite;              // 156
    if (absolutePath == null) {                                                              //
      absolutePath = '~/uploads';                                                            //
    }                                                                                        //
    this.transformWrite = transformWrite;                                                    // 156
    if (absolutePath.split(path.sep)[0] === '~') {                                           // 162
      homepath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;        // 163
      if (homepath != null) {                                                                // 164
        absolutePath = absolutePath.replace('~', homepath);                                  // 165
      } else {                                                                               //
        throw new Error('Unable to resolve "~" in path');                                    // 167
      }                                                                                      //
    }                                                                                        //
    this.absolutePath = path.resolve(absolutePath);                                          // 156
    mkdirp.sync(this.absolutePath);                                                          // 156
    this.statSync = Meteor.wrapAsync(fs.stat.bind(fs));                                      // 156
    this.unlinkSync = Meteor.wrapAsync(fs.unlink.bind(fs));                                  // 156
  }                                                                                          //
                                                                                             //
  _Class.prototype.createWriteStream = function(fileName, contentType) {                     // 155
    var self, ws;                                                                            // 175
    self = this;                                                                             // 175
    ws = fs.createWriteStream(path.join(this.absolutePath, fileName));                       // 175
    if (self.transformWrite != null) {                                                       // 179
      ws = RocketChatFile.addPassThrough(ws, function(rs, ws) {                              // 180
        var file;                                                                            // 181
        file = {                                                                             // 181
          fileName: fileName,                                                                // 182
          contentType: contentType                                                           // 182
        };                                                                                   //
        return self.transformWrite(file, rs, ws);                                            //
      });                                                                                    //
    }                                                                                        //
    ws.on('close', function() {                                                              // 175
      return ws.emit('end');                                                                 //
    });                                                                                      //
    return ws;                                                                               // 190
  };                                                                                         //
                                                                                             //
  _Class.prototype.createReadStream = function(fileName) {                                   // 155
    return fs.createReadStream(path.join(this.absolutePath, fileName));                      // 193
  };                                                                                         //
                                                                                             //
  _Class.prototype.stat = function(fileName) {                                               // 155
    return this.statSync(path.join(this.absolutePath, fileName));                            // 196
  };                                                                                         //
                                                                                             //
  _Class.prototype.remove = function(fileName) {                                             // 155
    return this.unlinkSync(path.join(this.absolutePath, fileName));                          // 199
  };                                                                                         //
                                                                                             //
  _Class.prototype.getFileWithReadStream = function(fileName) {                              // 155
    var e, rs, stat;                                                                         // 202
    try {                                                                                    // 202
      stat = this.stat(fileName);                                                            // 203
      rs = this.createReadStream(fileName);                                                  // 203
      return {                                                                               // 206
        readStream: rs,                                                                      // 206
        length: stat.size                                                                    // 206
      };                                                                                     //
    } catch (_error) {                                                                       //
      e = _error;                                                                            // 212
      return void 0;                                                                         // 212
    }                                                                                        //
  };                                                                                         //
                                                                                             //
  _Class.prototype.deleteFile = function(fileName) {                                         // 155
    var e, stat;                                                                             // 215
    try {                                                                                    // 215
      stat = this.stat(fileName);                                                            // 216
      return this.remove(fileName);                                                          // 217
    } catch (_error) {                                                                       //
      e = _error;                                                                            // 219
      return void 0;                                                                         // 219
    }                                                                                        //
  };                                                                                         //
                                                                                             //
  return _Class;                                                                             //
                                                                                             //
})();                                                                                        //
                                                                                             //
///////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:file'] = {
  RocketChatFile: RocketChatFile
};

})();

//# sourceMappingURL=rocketchat_file.js.map
