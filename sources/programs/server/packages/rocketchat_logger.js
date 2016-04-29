(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Random = Package.random.Random;
var Log = Package.logging.Log;
var colors = Package['nooitaf:colors'].colors;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;

/* Package-scope variables */
var __coffeescriptShare, Logger;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/rocketchat_logger/server.coffee.js                                                              //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var StdOut, processString,                                                                                  // 1
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,                                                                              //
  slice = [].slice;                                                                                         //
                                                                                                            //
this.LoggerManager = new ((function(superClass) {                                                           // 1
  extend(_Class, superClass);                                                                               // 2
                                                                                                            //
  function _Class() {                                                                                       // 2
    this.enabled = false;                                                                                   // 3
    this.loggers = {};                                                                                      // 3
    this.queue = [];                                                                                        // 3
    this.showPackage = false;                                                                               // 3
    this.showFileAndLine = false;                                                                           // 3
    this.logLevel = 0;                                                                                      // 3
  }                                                                                                         //
                                                                                                            //
  _Class.prototype.register = function(logger) {                                                            // 2
    if (!logger instanceof Logger) {                                                                        // 12
      return;                                                                                               // 13
    }                                                                                                       //
    this.loggers[logger.name] = logger;                                                                     // 12
    return this.emit('register', logger);                                                                   //
  };                                                                                                        //
                                                                                                            //
  _Class.prototype.addToQueue = function(logger, args) {                                                    // 2
    return this.queue.push({                                                                                //
      logger: logger,                                                                                       // 21
      args: args                                                                                            // 21
    });                                                                                                     //
  };                                                                                                        //
                                                                                                            //
  _Class.prototype.dispatchQueue = function() {                                                             // 2
    var i, item, len1, ref;                                                                                 // 25
    ref = this.queue;                                                                                       // 25
    for (i = 0, len1 = ref.length; i < len1; i++) {                                                         // 25
      item = ref[i];                                                                                        //
      item.logger._log.apply(item.logger, item.args);                                                       // 26
    }                                                                                                       // 25
    return this.clearQueue();                                                                               //
  };                                                                                                        //
                                                                                                            //
  _Class.prototype.clearQueue = function() {                                                                // 2
    return this.queue = [];                                                                                 //
  };                                                                                                        //
                                                                                                            //
  _Class.prototype.disable = function() {                                                                   // 2
    return this.enabled = false;                                                                            //
  };                                                                                                        //
                                                                                                            //
  _Class.prototype.enable = function(dispatchQueue) {                                                       // 2
    if (dispatchQueue == null) {                                                                            //
      dispatchQueue = false;                                                                                //
    }                                                                                                       //
    this.enabled = true;                                                                                    // 37
    if (dispatchQueue === true) {                                                                           // 38
      return this.dispatchQueue();                                                                          //
    } else {                                                                                                //
      return this.clearQueue();                                                                             //
    }                                                                                                       //
  };                                                                                                        //
                                                                                                            //
  return _Class;                                                                                            //
                                                                                                            //
})(EventEmitter));                                                                                          //
                                                                                                            //
this.Logger = Logger = (function() {                                                                        // 1
  Logger.prototype.defaultTypes = {                                                                         // 49
    debug: {                                                                                                // 50
      name: 'debug',                                                                                        // 51
      color: 'blue',                                                                                        // 51
      level: 2                                                                                              // 51
    },                                                                                                      //
    log: {                                                                                                  // 50
      name: 'info',                                                                                         // 55
      color: 'blue',                                                                                        // 55
      level: 1                                                                                              // 55
    },                                                                                                      //
    info: {                                                                                                 // 50
      name: 'info',                                                                                         // 59
      color: 'blue',                                                                                        // 59
      level: 1                                                                                              // 59
    },                                                                                                      //
    success: {                                                                                              // 50
      name: 'info',                                                                                         // 63
      color: 'green',                                                                                       // 63
      level: 1                                                                                              // 63
    },                                                                                                      //
    warn: {                                                                                                 // 50
      name: 'warn',                                                                                         // 67
      color: 'magenta',                                                                                     // 67
      level: 1                                                                                              // 67
    },                                                                                                      //
    error: {                                                                                                // 50
      name: 'error',                                                                                        // 71
      color: 'red',                                                                                         // 71
      level: 0                                                                                              // 71
    }                                                                                                       //
  };                                                                                                        //
                                                                                                            //
  function Logger(name1, config) {                                                                          // 75
    var fn, fn1, fn2, method, name, ref, ref1, ref2, section, self, type, typeConfig;                       // 76
    this.name = name1;                                                                                      // 76
    if (config == null) {                                                                                   //
      config = {};                                                                                          //
    }                                                                                                       //
    self = this;                                                                                            // 76
    this.config = {};                                                                                       // 76
    _.extend(this.config, config);                                                                          // 76
    if (LoggerManager.loggers[this.name] != null) {                                                         // 81
      LoggerManager.loggers[this.name].warn('Duplicated instance');                                         // 82
      return LoggerManager.loggers[this.name];                                                              // 83
    }                                                                                                       //
    ref = this.defaultTypes;                                                                                // 85
    fn = function(type, typeConfig) {                                                                       // 85
      self[type] = function() {                                                                             // 87
        var args;                                                                                           // 88
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                       // 88
        return self._log.call(self, {                                                                       //
          section: this.__section,                                                                          // 89
          type: type,                                                                                       // 89
          level: typeConfig.level,                                                                          // 89
          method: typeConfig.name,                                                                          // 89
          "arguments": args                                                                                 // 89
        });                                                                                                 //
      };                                                                                                    //
      return self[type + "_box"] = function() {                                                             //
        var args;                                                                                           // 96
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                       // 96
        return self._log.call(self, {                                                                       //
          section: this.__section,                                                                          // 97
          type: type,                                                                                       // 97
          box: true,                                                                                        // 97
          level: typeConfig.level,                                                                          // 97
          method: typeConfig.name,                                                                          // 97
          "arguments": args                                                                                 // 97
        });                                                                                                 //
      };                                                                                                    //
    };                                                                                                      //
    for (type in ref) {                                                                                     // 85
      typeConfig = ref[type];                                                                               //
      fn(type, typeConfig);                                                                                 // 86
    }                                                                                                       // 85
    if (this.config.methods != null) {                                                                      // 104
      ref1 = this.config.methods;                                                                           // 105
      fn1 = function(method, typeConfig) {                                                                  // 105
        if (self[method] != null) {                                                                         // 107
          self.warn("Method", method, "already exists");                                                    // 108
        }                                                                                                   //
        if (self.defaultTypes[typeConfig.type] == null) {                                                   // 110
          self.warn("Method type", typeConfig.type, "doest not exists");                                    // 111
        }                                                                                                   //
        self[method] = function() {                                                                         // 107
          var args, ref2;                                                                                   // 114
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                     // 114
          return self._log.call(self, {                                                                     //
            section: this.__section,                                                                        // 115
            type: typeConfig.type,                                                                          // 115
            level: typeConfig.level != null ? typeConfig.level : (ref2 = self.defaultTypes[typeConfig.type]) != null ? ref2.level : void 0,
            method: method,                                                                                 // 115
            "arguments": args                                                                               // 115
          });                                                                                               //
        };                                                                                                  //
        return self[method + "_box"] = function() {                                                         //
          var args, ref2;                                                                                   // 122
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                     // 122
          return self._log.call(self, {                                                                     //
            section: this.__section,                                                                        // 123
            type: typeConfig.type,                                                                          // 123
            box: true,                                                                                      // 123
            level: typeConfig.level != null ? typeConfig.level : (ref2 = self.defaultTypes[typeConfig.type]) != null ? ref2.level : void 0,
            method: method,                                                                                 // 123
            "arguments": args                                                                               // 123
          });                                                                                               //
        };                                                                                                  //
      };                                                                                                    //
      for (method in ref1) {                                                                                // 105
        typeConfig = ref1[method];                                                                          //
        fn1(method, typeConfig);                                                                            // 106
      }                                                                                                     // 105
    }                                                                                                       //
    if (this.config.sections != null) {                                                                     // 130
      ref2 = this.config.sections;                                                                          // 131
      fn2 = function(section, name) {                                                                       // 131
        var fn3, ref3, ref4, results;                                                                       // 133
        self[section] = {};                                                                                 // 133
        ref3 = self.defaultTypes;                                                                           // 134
        fn3 = (function(_this) {                                                                            // 134
          return function(type, typeConfig) {                                                               //
            self[section][type] = function() {                                                              // 136
              return self[type].apply({                                                                     //
                __section: name                                                                             // 137
              }, arguments);                                                                                //
            };                                                                                              //
            return self[section][type + "_box"] = function() {                                              //
              return self[type + "_box"].apply({                                                            //
                __section: name                                                                             // 140
              }, arguments);                                                                                //
            };                                                                                              //
          };                                                                                                //
        })(this);                                                                                           //
        for (type in ref3) {                                                                                // 134
          typeConfig = ref3[type];                                                                          //
          fn3(type, typeConfig);                                                                            // 135
        }                                                                                                   // 134
        ref4 = self.config.methods;                                                                         // 142
        results = [];                                                                                       // 142
        for (method in ref4) {                                                                              //
          typeConfig = ref4[method];                                                                        //
          results.push((function(_this) {                                                                   // 143
            return function(method, typeConfig) {                                                           //
              self[section][method] = function() {                                                          // 144
                return self[method].apply({                                                                 //
                  __section: name                                                                           // 145
                }, arguments);                                                                              //
              };                                                                                            //
              return self[section][method + "_box"] = function() {                                          //
                return self[method + "_box"].apply({                                                        //
                  __section: name                                                                           // 148
                }, arguments);                                                                              //
              };                                                                                            //
            };                                                                                              //
          })(this)(method, typeConfig));                                                                    //
        }                                                                                                   // 142
        return results;                                                                                     //
      };                                                                                                    //
      for (section in ref2) {                                                                               // 131
        name = ref2[section];                                                                               //
        fn2(section, name);                                                                                 // 132
      }                                                                                                     // 131
    }                                                                                                       //
    LoggerManager.register(this);                                                                           // 76
    return this;                                                                                            // 151
  }                                                                                                         //
                                                                                                            //
  Logger.prototype.getPrefix = function(options) {                                                          // 49
    var detailParts, details, prefix;                                                                       // 154
    if (options.section != null) {                                                                          // 154
      prefix = this.name + " ➔ " + options.section + "." + options.method;                                  // 155
    } else {                                                                                                //
      prefix = this.name + " ➔ " + options.method;                                                          // 157
    }                                                                                                       //
    details = this._getCallerDetails();                                                                     // 154
    detailParts = [];                                                                                       // 154
    if ((details["package"] != null) && (LoggerManager.showPackage === true || options.type === 'error')) {
      detailParts.push(details["package"]);                                                                 // 163
    }                                                                                                       //
    if (LoggerManager.showFileAndLine === true || options.type === 'error') {                               // 165
      if ((details.file != null) && (details.line != null)) {                                               // 166
        detailParts.push(details.file + ":" + details.line);                                                // 167
      } else {                                                                                              //
        if (details.file != null) {                                                                         // 169
          detailParts.push(details.file);                                                                   // 170
        }                                                                                                   //
        if (details.line != null) {                                                                         // 171
          detailParts.push(details.line);                                                                   // 172
        }                                                                                                   //
      }                                                                                                     //
    }                                                                                                       //
    if (this.defaultTypes[options.type] != null) {                                                          // 174
      prefix = prefix[this.defaultTypes[options.type].color];                                               // 175
    }                                                                                                       //
    if (detailParts.length > 0) {                                                                           // 177
      prefix = (detailParts.join(' ')) + " " + prefix;                                                      // 178
    }                                                                                                       //
    return prefix;                                                                                          // 180
  };                                                                                                        //
                                                                                                            //
  Logger.prototype._getCallerDetails = function() {                                                         // 49
    var details, getStack, i, index, item, len1, line, lines, match, packageMatch, stack;                   // 184
    getStack = function() {                                                                                 // 184
      var err, stack;                                                                                       // 188
      err = new Error;                                                                                      // 188
      stack = err.stack;                                                                                    // 188
      return stack;                                                                                         // 190
    };                                                                                                      //
    stack = getStack();                                                                                     // 184
    if (!stack) {                                                                                           // 194
      return {};                                                                                            // 195
    }                                                                                                       //
    lines = stack.split('\n');                                                                              // 184
    line = void 0;                                                                                          // 184
    for (index = i = 0, len1 = lines.length; i < len1; index = ++i) {                                       // 202
      item = lines[index];                                                                                  //
      if (!(index > 0)) {                                                                                   //
        continue;                                                                                           //
      }                                                                                                     //
      line = item;                                                                                          // 203
      if (line.match(/^\s*at eval \(eval/)) {                                                               // 204
        return {                                                                                            // 205
          file: "eval"                                                                                      // 205
        };                                                                                                  //
      }                                                                                                     //
      if (!line.match(/packages\/rocketchat_logger(?:\/|\.js)/)) {                                          // 207
        break;                                                                                              // 208
      }                                                                                                     //
    }                                                                                                       // 202
    details = {};                                                                                           // 184
    match = /(?:[@(]| at )([^(]+?):([0-9:]+)(?:\)|$)/.exec(line);                                           // 184
    if (!match) {                                                                                           // 216
      return details;                                                                                       // 217
    }                                                                                                       //
    details.line = match[2].split(':')[0];                                                                  // 184
    details.file = match[1].split('/').slice(-1)[0].split('?')[0];                                          // 184
    packageMatch = match[1].match(/packages\/([^\.\/]+)(?:\/|\.)/);                                         // 184
    if (packageMatch != null) {                                                                             // 227
      details["package"] = packageMatch[1];                                                                 // 228
    }                                                                                                       //
    return details;                                                                                         // 230
  };                                                                                                        //
                                                                                                            //
  Logger.prototype.makeABox = function(message, title) {                                                    // 49
    var i, j, len, len1, len2, line, lines, separator, topLine;                                             // 233
    if (!_.isArray(message)) {                                                                              // 233
      message = message.split("\n");                                                                        // 234
    }                                                                                                       //
    len = 0;                                                                                                // 233
    for (i = 0, len1 = message.length; i < len1; i++) {                                                     // 237
      line = message[i];                                                                                    //
      len = Math.max(len, line.length);                                                                     // 238
    }                                                                                                       // 237
    topLine = "+--" + s.pad('', len, '-') + "--+";                                                          // 233
    separator = "|  " + s.pad('', len, '') + "  |";                                                         // 233
    lines = [];                                                                                             // 233
    lines.push(topLine);                                                                                    // 233
    if (title != null) {                                                                                    // 245
      lines.push("|  " + s.lrpad(title, len) + "  |");                                                      // 246
      lines.push(topLine);                                                                                  // 246
    }                                                                                                       //
    lines.push(separator);                                                                                  // 233
    for (j = 0, len2 = message.length; j < len2; j++) {                                                     // 251
      line = message[j];                                                                                    //
      lines.push("|  " + s.rpad(line, len) + "  |");                                                        // 252
    }                                                                                                       // 251
    lines.push(separator);                                                                                  // 233
    lines.push(topLine);                                                                                    // 233
    return lines;                                                                                           // 256
  };                                                                                                        //
                                                                                                            //
  Logger.prototype._log = function(options) {                                                               // 49
    var box, color, i, len1, line, prefix, subPrefix;                                                       // 260
    if (LoggerManager.enabled === false) {                                                                  // 260
      LoggerManager.addToQueue(this, arguments);                                                            // 261
      return;                                                                                               // 262
    }                                                                                                       //
    if (options.level == null) {                                                                            //
      options.level = 1;                                                                                    //
    }                                                                                                       //
    if (LoggerManager.logLevel < options.level) {                                                           // 266
      return;                                                                                               // 267
    }                                                                                                       //
    prefix = this.getPrefix(options);                                                                       // 260
    if (options.box === true && _.isString(options["arguments"][0])) {                                      // 271
      color = void 0;                                                                                       // 272
      if (this.defaultTypes[options.type] != null) {                                                        // 273
        color = this.defaultTypes[options.type].color;                                                      // 274
      }                                                                                                     //
      box = this.makeABox(options["arguments"][0], options["arguments"][1]);                                // 272
      subPrefix = '➔';                                                                                      // 272
      if (color != null) {                                                                                  // 278
        subPrefix = subPrefix[color];                                                                       // 279
      }                                                                                                     //
      console.log(subPrefix, prefix);                                                                       // 272
      for (i = 0, len1 = box.length; i < len1; i++) {                                                       // 282
        line = box[i];                                                                                      //
        if (color != null) {                                                                                // 283
          console.log(subPrefix, line[color]);                                                              // 284
        } else {                                                                                            //
          console.log(subPrefix, line);                                                                     // 286
        }                                                                                                   //
      }                                                                                                     // 282
    } else {                                                                                                //
      options["arguments"].unshift(prefix);                                                                 // 288
      console.log.apply(console, options["arguments"]);                                                     // 288
    }                                                                                                       //
  };                                                                                                        //
                                                                                                            //
  return Logger;                                                                                            //
                                                                                                            //
})();                                                                                                       //
                                                                                                            //
this.SystemLogger = new Logger('System', {                                                                  // 1
  methods: {                                                                                                // 295
    startup: {                                                                                              // 296
      type: 'success',                                                                                      // 297
      level: 0                                                                                              // 297
    }                                                                                                       //
  }                                                                                                         //
});                                                                                                         //
                                                                                                            //
processString = function(string, date) {                                                                    // 1
  if (string[0] === '{') {                                                                                  // 302
    try {                                                                                                   // 303
      return Log.format(EJSON.parse(string), {                                                              // 304
        color: true                                                                                         // 304
      });                                                                                                   //
    } catch (_error) {}                                                                                     //
  }                                                                                                         //
  try {                                                                                                     // 306
    return Log.format({                                                                                     // 307
      message: string,                                                                                      // 307
      time: date,                                                                                           // 307
      level: 'info'                                                                                         // 307
    }, {                                                                                                    //
      color: true                                                                                           // 307
    });                                                                                                     //
  } catch (_error) {}                                                                                       //
  return string;                                                                                            // 309
};                                                                                                          // 301
                                                                                                            //
StdOut = new ((function(superClass) {                                                                       // 1
  extend(_Class, superClass);                                                                               // 312
                                                                                                            //
  function _Class() {                                                                                       // 312
    var write;                                                                                              // 313
    this.queue = [];                                                                                        // 313
    write = process.stdout.write;                                                                           // 313
    process.stdout.write = (function(_this) {                                                               // 313
      return function(string, encoding, fd) {                                                               //
        var date, item, ref;                                                                                // 316
        write.apply(process.stdout, arguments);                                                             // 316
        date = new Date;                                                                                    // 316
        string = processString(string, date);                                                               // 316
        item = {                                                                                            // 316
          id: Random.id(),                                                                                  // 321
          string: string,                                                                                   // 321
          ts: date                                                                                          // 321
        };                                                                                                  //
        _this.queue.push(item);                                                                             // 316
        if (((typeof RocketChat !== "undefined" && RocketChat !== null ? (ref = RocketChat.settings) != null ? ref.get('Log_View_Limit') : void 0 : void 0) != null) && _this.queue.length > RocketChat.settings.get('Log_View_Limit')) {
          _this.queue.shift();                                                                              // 328
        }                                                                                                   //
        return _this.emit('write', string, item);                                                           //
      };                                                                                                    //
    })(this);                                                                                               //
  }                                                                                                         //
                                                                                                            //
  return _Class;                                                                                            //
                                                                                                            //
})(EventEmitter));                                                                                          //
                                                                                                            //
Meteor.publish('stdout', function() {                                                                       // 1
  var i, item, len1, ref;                                                                                   // 334
  if (!this.userId) {                                                                                       // 334
    return this.ready();                                                                                    // 335
  }                                                                                                         //
  if (RocketChat.authz.hasPermission(this.userId, 'view-logs') !== true) {                                  // 337
    return this.ready();                                                                                    // 338
  }                                                                                                         //
  ref = StdOut.queue;                                                                                       // 340
  for (i = 0, len1 = ref.length; i < len1; i++) {                                                           // 340
    item = ref[i];                                                                                          //
    this.added('stdout', item.id, {                                                                         // 341
      string: item.string,                                                                                  // 342
      ts: item.ts                                                                                           // 342
    });                                                                                                     //
  }                                                                                                         // 340
  this.ready();                                                                                             // 334
  StdOut.on('write', (function(_this) {                                                                     // 334
    return function(string, item) {                                                                         //
      return _this.added('stdout', item.id, {                                                               //
        string: item.string,                                                                                // 349
        ts: item.ts                                                                                         // 349
      });                                                                                                   //
    };                                                                                                      //
  })(this));                                                                                                //
});                                                                                                         // 333
                                                                                                            //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:logger'] = {
  Logger: Logger
};

})();

//# sourceMappingURL=rocketchat_logger.js.map
