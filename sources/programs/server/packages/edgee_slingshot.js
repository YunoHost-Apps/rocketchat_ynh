(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var Slingshot, matchAllowedFileTypes;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/edgee_slingshot/packages/edgee_slingshot.js                                 //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
(function () {                                                                          // 1
                                                                                        // 2
///////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                               //     // 4
// packages/edgee:slingshot/lib/restrictions.js                                  //     // 5
//                                                                               //     // 6
///////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                 //     // 8
/**                                                                              // 1   // 9
 * @module meteor-slingshot                                                      // 2   // 10
 */                                                                              // 3   // 11
                                                                                 // 4   // 12
Slingshot = {};                                                                  // 5   // 13
                                                                                 // 6   // 14
/* global matchAllowedFileTypes: true */                                         // 7   // 15
matchAllowedFileTypes = Match.OneOf(String, [String], RegExp, null);             // 8   // 16
                                                                                 // 9   // 17
/**                                                                              // 10  // 18
 * List of configured restrictions by name.                                      // 11  // 19
 *                                                                               // 12  // 20
 * @type {Object.<String, Function>}                                             // 13  // 21
 * @private                                                                      // 14  // 22
 */                                                                              // 15  // 23
                                                                                 // 16  // 24
Slingshot._restrictions = {};                                                    // 17  // 25
                                                                                 // 18  // 26
/**                                                                              // 19  // 27
 * Creates file upload restrictions for a specific directive.                    // 20  // 28
 *                                                                               // 21  // 29
 * @param {string} name - A unique identifier of the directive.                  // 22  // 30
 * @param {Object} restrictions - The file upload restrictions.                  // 23  // 31
 * @returns {Object}                                                             // 24  // 32
 */                                                                              // 25  // 33
                                                                                 // 26  // 34
Slingshot.fileRestrictions = function (name, restrictions) {                     // 27  // 35
  check(restrictions, {                                                          // 28  // 36
    authorize: Match.Optional(Function),                                         // 29  // 37
    maxSize: Match.Optional(Match.OneOf(Number, null)),                          // 30  // 38
    allowedFileTypes: Match.Optional(matchAllowedFileTypes)                      // 31  // 39
  });                                                                            // 32  // 40
                                                                                 // 33  // 41
  if (Meteor.isServer) {                                                         // 34  // 42
    var directive = Slingshot.getDirective(name);                                // 35  // 43
    if (directive) {                                                             // 36  // 44
      _.extend(directive._directive, restrictions);                              // 37  // 45
    }                                                                            // 38  // 46
  }                                                                              // 39  // 47
                                                                                 // 40  // 48
  return (Slingshot._restrictions[name] =                                        // 41  // 49
    _.extend(Slingshot._restrictions[name] || {}, restrictions));                // 42  // 50
};                                                                               // 43  // 51
                                                                                 // 44  // 52
/**                                                                              // 45  // 53
 * @param {string} name - The unique identifier of the directive to              // 46  // 54
 * retrieve the restrictions for.                                                // 47  // 55
 * @returns {Object}                                                             // 48  // 56
 */                                                                              // 49  // 57
                                                                                 // 50  // 58
Slingshot.getRestrictions = function (name) {                                    // 51  // 59
  return this._restrictions[name] || {};                                         // 52  // 60
};                                                                               // 53  // 61
                                                                                 // 54  // 62
///////////////////////////////////////////////////////////////////////////////////     // 63
                                                                                        // 64
}).call(this);                                                                          // 65
                                                                                        // 66
                                                                                        // 67
                                                                                        // 68
                                                                                        // 69
                                                                                        // 70
                                                                                        // 71
(function () {                                                                          // 72
                                                                                        // 73
///////////////////////////////////////////////////////////////////////////////////     // 74
//                                                                               //     // 75
// packages/edgee:slingshot/lib/validators.js                                    //     // 76
//                                                                               //     // 77
///////////////////////////////////////////////////////////////////////////////////     // 78
                                                                                 //     // 79
Slingshot.Validators = {                                                         // 1   // 80
                                                                                 // 2   // 81
 /**                                                                             // 3   // 82
  *                                                                              // 4   // 83
  * @method checkAll                                                             // 5   // 84
  *                                                                              // 6   // 85
  * @throws Meteor.Error                                                         // 7   // 86
  *                                                                              // 8   // 87
  * @param {Object} context                                                      // 9   // 88
  * @param {FileInfo} file                                                       // 10  // 89
  * @param {Object} [meta]                                                       // 11  // 90
  * @param {Object} [restrictions]                                               // 12  // 91
  *                                                                              // 13  // 92
  * @returns {Boolean}                                                           // 14  // 93
  */                                                                             // 15  // 94
                                                                                 // 16  // 95
  checkAll: function (context, file, meta, restrictions) {                       // 17  // 96
    return this.checkFileSize(file.size, restrictions.maxSize) &&                // 18  // 97
      this.checkFileType(file.type, restrictions.allowedFileTypes) &&            // 19  // 98
      (typeof restrictions.authorize !== 'function' ||                           // 20  // 99
        restrictions.authorize.call(context, file, meta));                       // 21  // 100
  },                                                                             // 22  // 101
                                                                                 // 23  // 102
  /**                                                                            // 24  // 103
   * @throws Meteor.Error                                                        // 25  // 104
   *                                                                             // 26  // 105
   * @param {Number} size - Size of file in bytes.                               // 27  // 106
   * @param {Number} maxSize - Max size of file in bytes.                        // 28  // 107
   * @returns {boolean}                                                          // 29  // 108
   */                                                                            // 30  // 109
                                                                                 // 31  // 110
  checkFileSize: function (size, maxSize) {                                      // 32  // 111
    maxSize = Math.min(maxSize, Infinity);                                       // 33  // 112
                                                                                 // 34  // 113
    if (maxSize && size > maxSize)                                               // 35  // 114
      throw new Meteor.Error("Upload denied", "File exceeds allowed size of " +  // 36  // 115
      formatBytes(maxSize));                                                     // 37  // 116
                                                                                 // 38  // 117
    return true;                                                                 // 39  // 118
  },                                                                             // 40  // 119
                                                                                 // 41  // 120
  /**                                                                            // 42  // 121
   *                                                                             // 43  // 122
   * @throws Meteor.Error                                                        // 44  // 123
   *                                                                             // 45  // 124
   * @param {String} type - Mime type                                            // 46  // 125
   * @param {(RegExp|Array|String)} [allowed] - Allowed file type(s)             // 47  // 126
   * @returns {boolean}                                                          // 48  // 127
   */                                                                            // 49  // 128
                                                                                 // 50  // 129
  checkFileType: function (type, allowed) {                                      // 51  // 130
    if (allowed instanceof RegExp) {                                             // 52  // 131
                                                                                 // 53  // 132
      if (!allowed.test(type))                                                   // 54  // 133
        throw new Meteor.Error("Upload denied",                                  // 55  // 134
          type + " is not an allowed file type");                                // 56  // 135
                                                                                 // 57  // 136
      return true;                                                               // 58  // 137
    }                                                                            // 59  // 138
                                                                                 // 60  // 139
    if (_.isArray(allowed)) {                                                    // 61  // 140
      if (allowed.indexOf(type) < 0) {                                           // 62  // 141
        throw new Meteor.Error("Upload denied",                                  // 63  // 142
          type + " is not one of the followed allowed file types: " +            // 64  // 143
          allowed.join(", "));                                                   // 65  // 144
      }                                                                          // 66  // 145
                                                                                 // 67  // 146
      return true;                                                               // 68  // 147
    }                                                                            // 69  // 148
                                                                                 // 70  // 149
    if (allowed && allowed !== type) {                                           // 71  // 150
      throw new Meteor.Error("Upload denied", "Only files of type " + allowed +  // 72  // 151
        " can be uploaded");                                                     // 73  // 152
    }                                                                            // 74  // 153
                                                                                 // 75  // 154
    return true;                                                                 // 76  // 155
  }                                                                              // 77  // 156
};                                                                               // 78  // 157
                                                                                 // 79  // 158
/** Human readable data-size in bytes.                                           // 80  // 159
 *                                                                               // 81  // 160
 * @param size {Number}                                                          // 82  // 161
 * @returns {string}                                                             // 83  // 162
 */                                                                              // 84  // 163
                                                                                 // 85  // 164
function formatBytes(size) {                                                     // 86  // 165
  var units = ['Bytes', 'KB', 'MB', 'GB', 'TB'],                                 // 87  // 166
      unit = units.shift();                                                      // 88  // 167
                                                                                 // 89  // 168
  while (size >= 0x400 && units.length) {                                        // 90  // 169
    size /= 0x400;                                                               // 91  // 170
    unit = units.shift();                                                        // 92  // 171
  }                                                                              // 93  // 172
                                                                                 // 94  // 173
  return (Math.round(size * 100) / 100) + " " + unit;                            // 95  // 174
}                                                                                // 96  // 175
                                                                                 // 97  // 176
///////////////////////////////////////////////////////////////////////////////////     // 177
                                                                                        // 178
}).call(this);                                                                          // 179
                                                                                        // 180
                                                                                        // 181
                                                                                        // 182
                                                                                        // 183
                                                                                        // 184
                                                                                        // 185
(function () {                                                                          // 186
                                                                                        // 187
///////////////////////////////////////////////////////////////////////////////////     // 188
//                                                                               //     // 189
// packages/edgee:slingshot/lib/directive.js                                     //     // 190
//                                                                               //     // 191
///////////////////////////////////////////////////////////////////////////////////     // 192
                                                                                 //     // 193
/**                                                                              // 1   // 194
 * @callback Directive~authorize                                                 // 2   // 195
 *                                                                               // 3   // 196
 * The meteor method context is passed on to this function, including            // 4   // 197
 * this.userId                                                                   // 5   // 198
 *                                                                               // 6   // 199
 * @throws Meteor.Error                                                          // 7   // 200
 *                                                                               // 8   // 201
 * @param {{size: Number, type: String, name: String}} file - File to be         // 9   // 202
 * uploaded                                                                      // 10  // 203
 * @param {Object} [meta] - Meta information provided by the client.             // 11  // 204
 *                                                                               // 12  // 205
 * @returns Boolean Return true to authorize the requested upload.               // 13  // 206
 */                                                                              // 14  // 207
                                                                                 // 15  // 208
/**                                                                              // 16  // 209
 * @typedef {Object} Directive                                                   // 17  // 210
 *                                                                               // 18  // 211
 * @property {Number} maxSize - Maximum size in bytes                            // 19  // 212
 * @property {(string, Array.<String>, RegExp, null)} allowedFileTypes - MIME    // 20  // 213
 * types that can be uploaded. If null is passed, then all file types are        // 21  // 214
 * allowed.                                                                      // 22  // 215
 *                                                                               // 23  // 216
 * @property {Directive~authorize} authorize - Function to determine whether a   // 24  // 217
 * file-upload is authorized or not.                                             // 25  // 218
 *                                                                               // 26  // 219
 * @property {String} [cacheControl] - rfc2616 Cache-Control directive (if       // 27  // 220
 * applicable to the selected storage service)                                   // 28  // 221
 *                                                                               // 29  // 222
 * @property {String} [contentDisposition] - rfc2616 Content-Disposition         // 30  // 223
 * directive. Defaults to "inline; <uploaded file name>"                         // 31  // 224
 *                                                                               // 32  // 225
 * @property {String}                                                            // 33  // 226
 */                                                                              // 34  // 227
                                                                                 // 35  // 228
/**                                                                              // 36  // 229
 * @typedef {Object} FileInfo                                                    // 37  // 230
 *                                                                               // 38  // 231
 * @property {String} [name] - Given name to the file.                           // 39  // 232
 * @property {Number} size - File-size in bytes.                                 // 40  // 233
 * @property {String} [type] - mime type.                                        // 41  // 234
 *                                                                               // 42  // 235
 */                                                                              // 43  // 236
                                                                                 // 44  // 237
/**                                                                              // 45  // 238
 * @typedef {Object} UploadInstructions                                          // 46  // 239
 *                                                                               // 47  // 240
 * @property {String} upload - POST URL                                          // 48  // 241
 * @property {String} download - Download URL                                    // 49  // 242
 * @property {Array.<{name: String, value: Object}>} postData - POST data to be  // 50  // 243
 * transferred to storage service along with credentials.                        // 51  // 244
 */                                                                              // 52  // 245
                                                                                 // 53  // 246
/**                                                                              // 54  // 247
 * List of installed directives by name.                                         // 55  // 248
 *                                                                               // 56  // 249
 * @type {Object.<string, Directive>}                                            // 57  // 250
 * @private                                                                      // 58  // 251
 */                                                                              // 59  // 252
                                                                                 // 60  // 253
Slingshot._directives = {};                                                      // 61  // 254
                                                                                 // 62  // 255
/**                                                                              // 63  // 256
 * Creates file upload directive that defines a set of rule by which a file may  // 64  // 257
 * be uploaded.                                                                  // 65  // 258
 *                                                                               // 66  // 259
 * @param {string} name - A unique identifier of the directive.                  // 67  // 260
 * @param {Object} service - A storage service to use.                           // 68  // 261
 * @param {Directive} options                                                    // 69  // 262
 * @returns {Slingshot.Directive}                                                // 70  // 263
 */                                                                              // 71  // 264
                                                                                 // 72  // 265
Slingshot.createDirective = function (name, service, options) {                  // 73  // 266
  if (_.has(Slingshot._directives, name))                                        // 74  // 267
    throw new Error("Directive '" + name + "' already exists");                  // 75  // 268
                                                                                 // 76  // 269
  var restrictions = Slingshot.getRestrictions(name);                            // 77  // 270
  _.defaults(options, restrictions);                                             // 78  // 271
                                                                                 // 79  // 272
  return (Slingshot._directives[name] =                                          // 80  // 273
    new Slingshot.Directive(service, options));                                  // 81  // 274
};                                                                               // 82  // 275
                                                                                 // 83  // 276
/**                                                                              // 84  // 277
 * @param {string} name - The unique identifier of the directive to be           // 85  // 278
 * retrieved.                                                                    // 86  // 279
 * @returns {Slingshot.Directive}                                                // 87  // 280
 */                                                                              // 88  // 281
                                                                                 // 89  // 282
Slingshot.getDirective = function (name) {                                       // 90  // 283
  return this._directives[name];                                                 // 91  // 284
};                                                                               // 92  // 285
                                                                                 // 93  // 286
/**                                                                              // 94  // 287
 * @param {Object} service                                                       // 95  // 288
 * @param {Directive} directive                                                  // 96  // 289
 * @constructor                                                                  // 97  // 290
 */                                                                              // 98  // 291
                                                                                 // 99  // 292
Slingshot.Directive = function (service, directive) {                            // 100
  check(this, Slingshot.Directive);                                              // 101
                                                                                 // 102
  //service does not have to be a plain-object, so checking fields individually  // 103
  check(service.directiveMatch, Object);                                         // 104
  check(service.upload, Function);                                               // 105
  check(service.maxSize, Match.Optional(Number));                                // 106
  check(service.allowedFileTypes, Match.Optional(matchAllowedFileTypes));        // 107
                                                                                 // 108
  _.defaults(directive, service.directiveDefault);                               // 109
                                                                                 // 110
  check(directive, _.extend({                                                    // 111
    authorize: Function,                                                         // 112
    maxSize: Match.Where(function (size) {                                       // 113
      check(size, Match.OneOf(Number, null));                                    // 114
                                                                                 // 115
      return !size || size > 0 && size <= (service.maxSize || Infinity);         // 116
    }),                                                                          // 117
    allowedFileTypes: matchAllowedFileTypes,                                     // 118
    cdn: Match.Optional(String)                                                  // 119
  }, service.directiveMatch));                                                   // 120
                                                                                 // 121
  /**                                                                            // 122
   * @method storageService                                                      // 123
   * @returns {Object}                                                           // 124
   */                                                                            // 125
                                                                                 // 126
  this.storageService = function () {                                            // 127
    return service;                                                              // 128
  };                                                                             // 129
                                                                                 // 130
  /**                                                                            // 131
   * @private                                                                    // 132
   * @property {Directive} _directive                                            // 133
   */                                                                            // 134
                                                                                 // 135
  this._directive = directive;                                                   // 136
};                                                                               // 137
                                                                                 // 138
_.extend(Slingshot.Directive.prototype, {                                        // 139
                                                                                 // 140
  /**                                                                            // 141
   * @param {{userId: String}} method                                            // 142
   * @param {FileInfo} file                                                      // 143
   * @param {Object} [meta]                                                      // 144
   *                                                                             // 145
   * @returns UploadInstructions                                                 // 146
   */                                                                            // 147
                                                                                 // 148
  getInstructions: function (method, file, meta) {                               // 149
    var instructions = this.storageService().upload(method, this._directive,     // 150
      file, meta);                                                               // 151
                                                                                 // 152
    check(instructions, {                                                        // 153
      upload: String,                                                            // 154
      download: String,                                                          // 155
      postData: [{                                                               // 156
        name: String,                                                            // 157
        value: Match.OneOf(String, Number, null)                                 // 158
      }],                                                                        // 159
      headers: Match.Optional(Object)                                            // 160
    });                                                                          // 161
                                                                                 // 162
    return instructions;                                                         // 163
  },                                                                             // 164
                                                                                 // 165
 /**                                                                             // 166
  *                                                                              // 167
  * @method requestAuthorization                                                 // 168
  *                                                                              // 169
  * @throws Meteor.Error                                                         // 170
  *                                                                              // 171
  * @param {Object} context                                                      // 172
  * @param {FileInfo} file                                                       // 173
  * @param {Object} [meta]                                                       // 174
  *                                                                              // 175
  * @returns {Boolean}                                                           // 176
  */                                                                             // 177
                                                                                 // 178
  requestAuthorization: function (context, file, meta) {                         // 179
    var validators = Slingshot.Validators,                                       // 180
        restrictions = _.pick(this._directive,                                   // 181
          ['authorize', 'maxSize', 'allowedFileTypes']                           // 182
        );                                                                       // 183
                                                                                 // 184
    return validators.checkAll(context, file, meta, restrictions);               // 185
  }                                                                              // 186
                                                                                 // 187
});                                                                              // 188
                                                                                 // 189
Meteor.methods({                                                                 // 190
  /**                                                                            // 191
   * Requests to perform a file upload.                                          // 192
   *                                                                             // 193
   * @param {String} directiveName                                               // 194
   * @param {FileInfo} file                                                      // 195
   * @param {Object} [meta]                                                      // 196
   *                                                                             // 197
   * @returns {UploadInstructions}                                               // 198
   */                                                                            // 199
                                                                                 // 200
  "slingshot/uploadRequest": function (directiveName, file, meta) {              // 201
    check(directiveName, String);                                                // 202
    check(file, {                                                                // 203
      type: Match.Optional(Match.Where(function (type) {                         // 204
        check(type, String);                                                     // 205
        return !type || /^[^\/]+\/[^\/]+$/.test(type);                           // 206
      })),                                                                       // 207
      name: Match.Optional(String),                                              // 208
      size: Match.Where(function (size) {                                        // 209
        check(size, Number);                                                     // 210
        return size >= 0;                                                        // 211
      })                                                                         // 212
    });                                                                          // 213
                                                                                 // 214
    if (!file.type)                                                              // 215
      delete file.type;                                                          // 216
                                                                                 // 217
    check(meta, Match.Optional(Match.OneOf(Object, null)));                      // 218
                                                                                 // 219
    var directive = Slingshot.getDirective(directiveName);                       // 220
                                                                                 // 221
    if (!directive) {                                                            // 222
      throw new Meteor.Error("Invalid directive",                                // 223
        "The directive " + directiveName + " does not seem to exist");           // 224
    }                                                                            // 225
                                                                                 // 226
    if (!directive.requestAuthorization(this, file, meta)) {                     // 227
      throw new Meteor.Error("Unauthorized", "You are not allowed to " +         // 228
        "upload this file");                                                     // 229
    }                                                                            // 230
                                                                                 // 231
    return directive.getInstructions(this, file, meta);                          // 232
  }                                                                              // 233
});                                                                              // 234
                                                                                 // 235
function quoteString(string, quotes) {                                           // 236
  return quotes + string.replace(quotes, '\\' + quotes) + quotes;                // 237
}                                                                                // 238
                                                                                 // 239
///////////////////////////////////////////////////////////////////////////////////     // 433
                                                                                        // 434
}).call(this);                                                                          // 435
                                                                                        // 436
                                                                                        // 437
                                                                                        // 438
                                                                                        // 439
                                                                                        // 440
                                                                                        // 441
(function () {                                                                          // 442
                                                                                        // 443
///////////////////////////////////////////////////////////////////////////////////     // 444
//                                                                               //     // 445
// packages/edgee:slingshot/lib/storage-policy.js                                //     // 446
//                                                                               //     // 447
///////////////////////////////////////////////////////////////////////////////////     // 448
                                                                                 //     // 449
                                                                                 // 1   // 450
/**                                                                              // 2   // 451
 * @constructor                                                                  // 3   // 452
 */                                                                              // 4   // 453
                                                                                 // 5   // 454
Slingshot.StoragePolicy = function () {                                          // 6   // 455
                                                                                 // 7   // 456
  /**                                                                            // 8   // 457
   * @type {{[expiration]: String, conditions: Array.<(Object|Array)>}}          // 9   // 458
   */                                                                            // 10  // 459
                                                                                 // 11  // 460
  var policy = {conditions: []};                                                 // 12  // 461
                                                                                 // 13  // 462
  var self = this;                                                               // 14  // 463
                                                                                 // 15  // 464
  _.extend(self, {                                                               // 16  // 465
                                                                                 // 17  // 466
    /** Set policy expiration time (as an absolute value).                       // 18  // 467
     *                                                                           // 19  // 468
     * Subsequent calls override previous expiration values.                     // 20  // 469
     *                                                                           // 21  // 470
     * @param {Date} deadline                                                    // 22  // 471
     *                                                                           // 23  // 472
     * @returns {Slingshot.StoragePolicy}                                        // 24  // 473
     */                                                                          // 25  // 474
                                                                                 // 26  // 475
    expire: function (deadline) {                                                // 27  // 476
      check(deadline, Date);                                                     // 28  // 477
                                                                                 // 29  // 478
      policy.expiration = deadline.toISOString();                                // 30  // 479
                                                                                 // 31  // 480
      return self;                                                               // 32  // 481
    },                                                                           // 33  // 482
                                                                                 // 34  // 483
                                                                                 // 35  // 484
    /** Adds a constraint in which a property must equal a value.                // 36  // 485
     *                                                                           // 37  // 486
     * @param {(String|Object.<String, String>)} property                        // 38  // 487
     * @param {String} [value]                                                   // 39  // 488
     *                                                                           // 40  // 489
     * @returns {Slingshot.StoragePolicy}                                        // 41  // 490
     */                                                                          // 42  // 491
                                                                                 // 43  // 492
    match: function (property, value) {                                          // 44  // 493
      if (_.isObject(property)) {                                                // 45  // 494
        _.each(property, function (value, property) {                            // 46  // 495
          self.match(property, value);                                           // 47  // 496
        });                                                                      // 48  // 497
      }                                                                          // 49  // 498
      else if (property && !_.isUndefined(value)) {                              // 50  // 499
        var constraint = {};                                                     // 51  // 500
                                                                                 // 52  // 501
        constraint[property] = value;                                            // 53  // 502
                                                                                 // 54  // 503
        policy.conditions.push(constraint);                                      // 55  // 504
      }                                                                          // 56  // 505
                                                                                 // 57  // 506
      return self;                                                               // 58  // 507
    },                                                                           // 59  // 508
                                                                                 // 60  // 509
    /** Set expiration time to a future value (relative from now)                // 61  // 510
     *                                                                           // 62  // 511
     * Subsequent calls override previous expiration values.                     // 63  // 512
     *                                                                           // 64  // 513
     * @param {Number} ms - Number of milliseconds in the future.                // 65  // 514
     *                                                                           // 66  // 515
     * @return {Slingshot.StoragePolicy}                                         // 67  // 516
     */                                                                          // 68  // 517
                                                                                 // 69  // 518
    expireIn: function (ms) {                                                    // 70  // 519
      return self.expire(new Date(Date.now() + ms));                             // 71  // 520
    },                                                                           // 72  // 521
                                                                                 // 73  // 522
    /** Adds a starts-with constraint.                                           // 74  // 523
     *                                                                           // 75  // 524
     * @param {string} field - Name of the field without the preceding '$'       // 76  // 525
     * @param {string} constraint - Value that the field must start with         // 77  // 526
     * @returns {Slingshot.StoragePolicy}                                        // 78  // 527
     */                                                                          // 79  // 528
                                                                                 // 80  // 529
    startsWith: function (field, constraint) {                                   // 81  // 530
      policy.conditions.push(["starts-with", "$" + field, constraint]);          // 82  // 531
      return self;                                                               // 83  // 532
    },                                                                           // 84  // 533
                                                                                 // 85  // 534
    /** Adds a file-size constraint                                              // 86  // 535
     *                                                                           // 87  // 536
     * @param minimum {Number} Minimum file-size                                 // 88  // 537
     * @param maximum {Number} Maximum file-size                                 // 89  // 538
     * @returns {Slingshot.StoragePolicy}                                        // 90  // 539
     */                                                                          // 91  // 540
                                                                                 // 92  // 541
    contentLength: function (minimum, maximum) {                                 // 93  // 542
      policy.conditions.push(["content-length-range", minimum, maximum]);        // 94  // 543
      return self;                                                               // 95  // 544
    },                                                                           // 96  // 545
                                                                                 // 97  // 546
    /**                                                                          // 98  // 547
     * @returns {string}                                                         // 99  // 548
     */                                                                          // 100
                                                                                 // 101
    stringify: function (encoding) {                                             // 102
      /* global Buffer: false */                                                 // 103
      return Buffer(JSON.stringify(policy), "utf-8")                             // 104
        .toString(encoding || "base64");                                         // 105
    }                                                                            // 106
  });                                                                            // 107
};                                                                               // 108
                                                                                 // 109
                                                                                 // 110
///////////////////////////////////////////////////////////////////////////////////     // 560
                                                                                        // 561
}).call(this);                                                                          // 562
                                                                                        // 563
                                                                                        // 564
                                                                                        // 565
                                                                                        // 566
                                                                                        // 567
                                                                                        // 568
(function () {                                                                          // 569
                                                                                        // 570
///////////////////////////////////////////////////////////////////////////////////     // 571
//                                                                               //     // 572
// packages/edgee:slingshot/services/aws-s3.js                                   //     // 573
//                                                                               //     // 574
///////////////////////////////////////////////////////////////////////////////////     // 575
                                                                                 //     // 576
Slingshot.S3Storage = {                                                          // 1   // 577
                                                                                 // 2   // 578
  accessId: "AWSAccessKeyId",                                                    // 3   // 579
  secretKey: "AWSSecretAccessKey",                                               // 4   // 580
                                                                                 // 5   // 581
  directiveMatch: {                                                              // 6   // 582
    bucket: String,                                                              // 7   // 583
    bucketUrl: Match.OneOf(String, Function),                                    // 8   // 584
                                                                                 // 9   // 585
    region: Match.Where(function (region) {                                      // 10  // 586
      check(region, String);                                                     // 11  // 587
                                                                                 // 12  // 588
      return /^[a-z]{2}-\w+-\d+$/.test(region);                                  // 13  // 589
    }),                                                                          // 14  // 590
                                                                                 // 15  // 591
    AWSAccessKeyId: String,                                                      // 16  // 592
    AWSSecretAccessKey: String,                                                  // 17  // 593
                                                                                 // 18  // 594
    acl: Match.Optional(Match.Where(function (acl) {                             // 19  // 595
      check(acl, String);                                                        // 20  // 596
                                                                                 // 21  // 597
      return [                                                                   // 22  // 598
          "private",                                                             // 23  // 599
          "public-read",                                                         // 24  // 600
          "public-read-write",                                                   // 25  // 601
          "authenticated-read",                                                  // 26  // 602
          "bucket-owner-read",                                                   // 27  // 603
          "bucket-owner-full-control",                                           // 28  // 604
          "log-delivery-write"                                                   // 29  // 605
        ].indexOf(acl) >= 0;                                                     // 30  // 606
    })),                                                                         // 31  // 607
                                                                                 // 32  // 608
    key: Match.OneOf(String, Function),                                          // 33  // 609
                                                                                 // 34  // 610
    expire: Match.Where(function (expire) {                                      // 35  // 611
      check(expire, Number);                                                     // 36  // 612
                                                                                 // 37  // 613
      return expire > 0;                                                         // 38  // 614
    }),                                                                          // 39  // 615
                                                                                 // 40  // 616
    cacheControl: Match.Optional(String),                                        // 41  // 617
    contentDisposition: Match.Optional(Match.OneOf(String, Function, null))      // 42  // 618
  },                                                                             // 43  // 619
                                                                                 // 44  // 620
  directiveDefault: _.chain(Meteor.settings)                                     // 45  // 621
    .pick("AWSAccessKeyId", "AWSSecretAccessKey")                                // 46  // 622
    .extend({                                                                    // 47  // 623
      bucket: Meteor.settings.S3Bucket,                                          // 48  // 624
      bucketUrl: function (bucket, region) {                                     // 49  // 625
        var bucketDomain = "s3-" + region + ".amazonaws.com";                    // 50  // 626
        if (region === "us-east-1")                                              // 51  // 627
          bucketDomain = "s3.amazonaws.com";                                     // 52  // 628
                                                                                 // 53  // 629
        if (bucket.indexOf(".") !== -1)                                          // 54  // 630
          return "https://" + bucketDomain + "/" + bucket;                       // 55  // 631
                                                                                 // 56  // 632
        return "https://" + bucket + "." + bucketDomain;                         // 57  // 633
      },                                                                         // 58  // 634
      region: Meteor.settings.AWSRegion || "us-east-1",                          // 59  // 635
      expire: 5 * 60 * 1000 //in 5 minutes                                       // 60  // 636
    })                                                                           // 61  // 637
    .value(),                                                                    // 62  // 638
                                                                                 // 63  // 639
  getContentDisposition: function (method, directive, file, meta) {              // 64  // 640
    var getContentDisposition = directive.contentDisposition;                    // 65  // 641
                                                                                 // 66  // 642
    if (!_.isFunction(getContentDisposition)) {                                  // 67  // 643
      getContentDisposition = function () {                                      // 68  // 644
        var filename = file.name && encodeURIComponent(file.name);               // 69  // 645
                                                                                 // 70  // 646
        return directive.contentDisposition || filename &&                       // 71  // 647
          "inline; filename=\"" + filename + "\"; filename*=utf-8''" +           // 72  // 648
          filename;                                                              // 73  // 649
      };                                                                         // 74  // 650
    }                                                                            // 75  // 651
                                                                                 // 76  // 652
    return getContentDisposition.call(method, file, meta);                       // 77  // 653
  },                                                                             // 78  // 654
                                                                                 // 79  // 655
  /**                                                                            // 80  // 656
   *                                                                             // 81  // 657
   * @param {{userId: String}} method                                            // 82  // 658
   * @param {Directive} directive                                                // 83  // 659
   * @param {FileInfo} file                                                      // 84  // 660
   * @param {Object} [meta]                                                      // 85  // 661
   *                                                                             // 86  // 662
   * @returns {UploadInstructions}                                               // 87  // 663
   */                                                                            // 88  // 664
                                                                                 // 89  // 665
  upload: function (method, directive, file, meta) {                             // 90  // 666
    var policy = new Slingshot.StoragePolicy()                                   // 91  // 667
          .expireIn(directive.expire)                                            // 92  // 668
          .contentLength(0, Math.min(file.size, directive.maxSize || Infinity)), // 93  // 669
                                                                                 // 94  // 670
        payload = {                                                              // 95  // 671
          key: _.isFunction(directive.key) ?                                     // 96  // 672
            directive.key.call(method, file, meta) : directive.key,              // 97  // 673
                                                                                 // 98  // 674
          bucket: directive.bucket,                                              // 99  // 675
                                                                                 // 100
          "Content-Type": file.type,                                             // 101
          "acl": directive.acl,                                                  // 102
                                                                                 // 103
          "Cache-Control": directive.cacheControl,                               // 104
          "Content-Disposition": this.getContentDisposition(method, directive,   // 105
            file, meta)                                                          // 106
        },                                                                       // 107
                                                                                 // 108
        bucketUrl = _.isFunction(directive.bucketUrl) ?                          // 109
          directive.bucketUrl(directive.bucket, directive.region) :              // 110
          directive.bucketUrl,                                                   // 111
                                                                                 // 112
        downloadUrl = [                                                          // 113
          (directive.cdn || bucketUrl),                                          // 114
          payload.key                                                            // 115
        ].map(function (part) {                                                  // 116
            return part.replace(/\/+$/, '');                                     // 117
          }).join("/");                                                          // 118
                                                                                 // 119
    this.applySignature(payload, policy, directive);                             // 120
                                                                                 // 121
    return {                                                                     // 122
      upload: bucketUrl,                                                         // 123
      download: downloadUrl,                                                     // 124
      postData: [{                                                               // 125
        name: "key",                                                             // 126
        value: payload.key                                                       // 127
      }].concat(_.chain(payload).omit("key").map(function (value, name) {        // 128
          return !_.isUndefined(value) && {                                      // 129
              name: name,                                                        // 130
              value: value                                                       // 131
            };                                                                   // 132
        }).compact().value())                                                    // 133
    };                                                                           // 134
  },                                                                             // 135
                                                                                 // 136
  /** Applies signature an upload payload                                        // 137
   *                                                                             // 138
   * @param {Object} payload - Data to be upload along with file                 // 139
   * @param {Slingshot.StoragePolicy} policy                                     // 140
   * @param {Directive} directive                                                // 141
   */                                                                            // 142
                                                                                 // 143
  applySignature: function (payload, policy, directive) {                        // 144
    var now =  new Date(),                                                       // 145
        today = now.getUTCFullYear() + formatNumber(now.getUTCMonth() + 1, 2) +  // 146
          formatNumber(now.getUTCDate(), 2),                                     // 147
        service = "s3";                                                          // 148
                                                                                 // 149
    _.extend(payload, {                                                          // 150
      "x-amz-algorithm": "AWS4-HMAC-SHA256",                                     // 151
      "x-amz-credential": [                                                      // 152
        directive[this.accessId],                                                // 153
        today,                                                                   // 154
        directive.region,                                                        // 155
        service,                                                                 // 156
        "aws4_request"                                                           // 157
      ].join("/"),                                                               // 158
      "x-amz-date": today + "T000000Z"                                           // 159
    });                                                                          // 160
                                                                                 // 161
    payload.policy = policy.match(payload).stringify();                          // 162
    payload["x-amz-signature"] = this.signAwsV4(payload.policy,                  // 163
      directive[this.secretKey], today, directive.region, service);              // 164
  },                                                                             // 165
                                                                                 // 166
  /** Generate a AWS Signature Version 4                                         // 167
   *                                                                             // 168
   * @param {String} policy - Base64 encoded policy to sign.                     // 169
   * @param {String} secretKey - AWSSecretAccessKey                              // 170
   * @param {String} date - Signature date (yyyymmdd)                            // 171
   * @param {String} region - AWS Data-Center region                             // 172
   * @param {String} service - type of service to use                            // 173
   * @returns {String} hex encoded HMAC-256 signature                            // 174
   */                                                                            // 175
                                                                                 // 176
  signAwsV4: function (policy, secretKey, date, region, service) {               // 177
    var dateKey = hmac256("AWS4" + secretKey, date),                             // 178
        dateRegionKey = hmac256(dateKey, region),                                // 179
        dateRegionServiceKey= hmac256(dateRegionKey, service),                   // 180
        signingKey = hmac256(dateRegionServiceKey, "aws4_request");              // 181
                                                                                 // 182
    return hmac256(signingKey, policy, "hex");                                   // 183
  }                                                                              // 184
};                                                                               // 185
                                                                                 // 186
Slingshot.S3Storage.TempCredentials = _.defaults({                               // 187
                                                                                 // 188
  directiveMatch: _.chain(Slingshot.S3Storage.directiveMatch)                    // 189
    .omit("AWSAccessKeyId", "AWSSecretAccessKey")                                // 190
    .extend({                                                                    // 191
      temporaryCredentials: Function                                             // 192
    })                                                                           // 193
    .value(),                                                                    // 194
                                                                                 // 195
  directiveDefault: _.omit(Slingshot.S3Storage.directiveDefault,                 // 196
    "AWSAccessKeyId", "AWSSecretAccessKey"),                                     // 197
                                                                                 // 198
  applySignature: function (payload, policy, directive) {                        // 199
    var credentials = directive.temporaryCredentials(directive.expire);          // 200
                                                                                 // 201
    check(credentials, Match.ObjectIncluding({                                   // 202
      AccessKeyId: Slingshot.S3Storage.directiveMatch.AWSAccessKeyId,            // 203
      SecretAccessKey: Slingshot.S3Storage.directiveMatch.AWSSecretAccessKey,    // 204
      SessionToken: String                                                       // 205
    }));                                                                         // 206
                                                                                 // 207
    payload["x-amz-security-token"] = credentials.SessionToken;                  // 208
                                                                                 // 209
    return Slingshot.S3Storage.applySignature                                    // 210
      .call(this, payload, policy, _.defaults({                                  // 211
        AWSAccessKeyId: credentials.AccessKeyId,                                 // 212
        AWSSecretAccessKey: credentials.SecretAccessKey                          // 213
      }, directive));                                                            // 214
  }                                                                              // 215
}, Slingshot.S3Storage);                                                         // 216
                                                                                 // 217
                                                                                 // 218
function formatNumber(num, digits) {                                             // 219
  var string = String(num);                                                      // 220
                                                                                 // 221
  return Array(digits - string.length + 1).join("0").concat(string);             // 222
}                                                                                // 223
                                                                                 // 224
var crypto = Npm.require("crypto");                                              // 225
                                                                                 // 226
function hmac256(key, data, encoding) {                                          // 227
  /* global Buffer: false */                                                     // 228
  return crypto                                                                  // 229
    .createHmac("sha256", key)                                                   // 230
    .update(new Buffer(data, "utf-8"))                                           // 231
    .digest(encoding);                                                           // 232
}                                                                                // 233
                                                                                 // 234
///////////////////////////////////////////////////////////////////////////////////     // 811
                                                                                        // 812
}).call(this);                                                                          // 813
                                                                                        // 814
                                                                                        // 815
                                                                                        // 816
                                                                                        // 817
                                                                                        // 818
                                                                                        // 819
(function () {                                                                          // 820
                                                                                        // 821
///////////////////////////////////////////////////////////////////////////////////     // 822
//                                                                               //     // 823
// packages/edgee:slingshot/services/google-cloud.js                             //     // 824
//                                                                               //     // 825
///////////////////////////////////////////////////////////////////////////////////     // 826
                                                                                 //     // 827
//GoogleCloud is based on the very same api as AWS S3, so we extend it:          // 1   // 828
                                                                                 // 2   // 829
Slingshot.GoogleCloud = _.defaults({                                             // 3   // 830
                                                                                 // 4   // 831
  accessId: "GoogleAccessId",                                                    // 5   // 832
  secretKey: "GoogleSecretKey",                                                  // 6   // 833
                                                                                 // 7   // 834
  directiveMatch: _.chain(Slingshot.S3Storage.directiveMatch)                    // 8   // 835
    .omit(Slingshot.S3Storage.accessId, Slingshot.S3Storage.secretKey, "region") // 9   // 836
    .extend({                                                                    // 10  // 837
      GoogleAccessId: String,                                                    // 11  // 838
      GoogleSecretKey: String,                                                   // 12  // 839
                                                                                 // 13  // 840
      acl: Match.Optional(Match.Where(function (acl) {                           // 14  // 841
        check(acl, String);                                                      // 15  // 842
                                                                                 // 16  // 843
        return [                                                                 // 17  // 844
            "project-private",                                                   // 18  // 845
            "private",                                                           // 19  // 846
            "public-read",                                                       // 20  // 847
            "public-read-write",                                                 // 21  // 848
            "authenticated-read",                                                // 22  // 849
            "bucket-owner-read",                                                 // 23  // 850
            "bucket-owner-full-control"                                          // 24  // 851
          ].indexOf(acl) >= 0;                                                   // 25  // 852
      }))                                                                        // 26  // 853
    })                                                                           // 27  // 854
    .value(),                                                                    // 28  // 855
                                                                                 // 29  // 856
  directiveDefault:  _.chain(Meteor.settings)                                    // 30  // 857
    .pick("GoogleAccessId")                                                      // 31  // 858
    .extend(Slingshot.S3Storage.directiveDefault, {                              // 32  // 859
      bucketUrl: function (bucket) {                                             // 33  // 860
        return "https://" + bucket + ".storage.googleapis.com";                  // 34  // 861
      }                                                                          // 35  // 862
    })                                                                           // 36  // 863
    .omit(Slingshot.S3Storage.accessId, Slingshot.S3Storage.secretKey, "region") // 37  // 864
    .value(),                                                                    // 38  // 865
                                                                                 // 39  // 866
  applySignature: function (payload, policy, directive) {                        // 40  // 867
    payload[this.accessId] = directive[this.accessId];                           // 41  // 868
    payload.policy = policy.match(_.omit(payload, this.accessId)).stringify();   // 42  // 869
    payload.signature = this.sign(directive[this.secretKey], payload.policy);    // 43  // 870
  },                                                                             // 44  // 871
                                                                                 // 45  // 872
  /**                                                                            // 46  // 873
   * @param {String} secretKey - pem private key                                 // 47  // 874
   * @param {String} policy                                                      // 48  // 875
   * @returns {*|String}                                                         // 49  // 876
   */                                                                            // 50  // 877
                                                                                 // 51  // 878
  sign: function (secretKey, policy) {                                           // 52  // 879
    return Npm.require("crypto")                                                 // 53  // 880
      .createSign('RSA-SHA256')                                                  // 54  // 881
      .update(policy)                                                            // 55  // 882
      .sign(secretKey, "base64");                                                // 56  // 883
  }                                                                              // 57  // 884
}, Slingshot.S3Storage);                                                         // 58  // 885
                                                                                 // 59  // 886
///////////////////////////////////////////////////////////////////////////////////     // 887
                                                                                        // 888
}).call(this);                                                                          // 889
                                                                                        // 890
                                                                                        // 891
                                                                                        // 892
                                                                                        // 893
                                                                                        // 894
                                                                                        // 895
(function () {                                                                          // 896
                                                                                        // 897
///////////////////////////////////////////////////////////////////////////////////     // 898
//                                                                               //     // 899
// packages/edgee:slingshot/services/rackspace.js                                //     // 900
//                                                                               //     // 901
///////////////////////////////////////////////////////////////////////////////////     // 902
                                                                                 //     // 903
Slingshot.RackspaceFiles = {                                                     // 1   // 904
                                                                                 // 2   // 905
  directiveMatch: {                                                              // 3   // 906
    RackspaceAccountId: String,                                                  // 4   // 907
    RackspaceMetaDataKey: String,                                                // 5   // 908
    container: String,                                                           // 6   // 909
    region: String,                                                              // 7   // 910
    pathPrefix: Match.OneOf(String, Function),                                   // 8   // 911
    expire: Match.Where(function (expire) {                                      // 9   // 912
      check(expire, Number);                                                     // 10  // 913
                                                                                 // 11  // 914
      return expire > 0;                                                         // 12  // 915
    }),                                                                          // 13  // 916
    deleteAt: Match.Optional(Date),                                              // 14  // 917
    deleteAfter: Match.Optional(Number)                                          // 15  // 918
  },                                                                             // 16  // 919
                                                                                 // 17  // 920
  directiveDefault: _.chain(Meteor.settings)                                     // 18  // 921
    .pick("RackspaceAccountId", "RackspaceMetaDataKey")                          // 19  // 922
    .extend({                                                                    // 20  // 923
      region: "iad3",                                                            // 21  // 924
      expire: 5 * 60 * 1000 //in 5 minutes                                       // 22  // 925
    })                                                                           // 23  // 926
    .value(),                                                                    // 24  // 927
                                                                                 // 25  // 928
  version: "v1",                                                                 // 26  // 929
                                                                                 // 27  // 930
  path: function (directive, prefix) {                                           // 28  // 931
    return "/" + [                                                               // 29  // 932
      this.version,                                                              // 30  // 933
      "MossoCloudFS_" + directive.RackspaceAccountId,                            // 31  // 934
      directive.container,                                                       // 32  // 935
      prefix                                                                     // 33  // 936
    ].join("/").replace(/\/+/, "/");                                             // 34  // 937
  },                                                                             // 35  // 938
                                                                                 // 36  // 939
  pathPrefix: function (method, directive, file, meta) {                         // 37  // 940
    if ("pathPrefix" in directive) {                                             // 38  // 941
      return (_.isFunction(directive.pathPrefix) ?                               // 39  // 942
        directive.pathPrefix.call(method, file, meta) : directive.pathPrefix);   // 40  // 943
    }                                                                            // 41  // 944
    else {                                                                       // 42  // 945
      return "";                                                                 // 43  // 946
    }                                                                            // 44  // 947
  },                                                                             // 45  // 948
                                                                                 // 46  // 949
  host: function (region) {                                                      // 47  // 950
    return "https://storage101." + region + ".clouddrive.com";                   // 48  // 951
  },                                                                             // 49  // 952
                                                                                 // 50  // 953
  maxSize: 0x140000000, //5GB                                                    // 51  // 954
                                                                                 // 52  // 955
  upload: function (method, directive, file, meta) {                             // 53  // 956
    var pathPrefix = this.pathPrefix(method, directive, file, meta),             // 54  // 957
        path = this.path(directive, pathPrefix),                                 // 55  // 958
        host = this.host(directive.region),                                      // 56  // 959
        url = host + path,                                                       // 57  // 960
        data = [                                                                 // 58  // 961
          {                                                                      // 59  // 962
            name: "redirect",                                                    // 60  // 963
            value: ""                                                            // 61  // 964
          },                                                                     // 62  // 965
          {                                                                      // 63  // 966
            name: "max_file_size",                                               // 64  // 967
            value: Math.min(file.size, directive.maxSize || this.maxSize)        // 65  // 968
          },                                                                     // 66  // 969
          {                                                                      // 67  // 970
            name: "max_file_count",                                              // 68  // 971
            value: 1                                                             // 69  // 972
          },                                                                     // 70  // 973
          {                                                                      // 71  // 974
            name: "expires",                                                     // 72  // 975
            value: Date.now() + directive.expire                                 // 73  // 976
          }                                                                      // 74  // 977
        ];                                                                       // 75  // 978
                                                                                 // 76  // 979
    data.push({                                                                  // 77  // 980
        name: "signature",                                                       // 78  // 981
        value: this.sign(directive.RackspaceMetaDataKey, path, data)             // 79  // 982
    });                                                                          // 80  // 983
                                                                                 // 81  // 984
    if ("deleteAt" in directive)                                                 // 82  // 985
      data.push({                                                                // 83  // 986
        name: "x_delete_at",                                                     // 84  // 987
        value: directive.deleteAt.getTime()                                      // 85  // 988
      });                                                                        // 86  // 989
                                                                                 // 87  // 990
    if ("deleteAfter" in directive)                                              // 88  // 991
      data.push({                                                                // 89  // 992
        name: "x_delete_after",                                                  // 90  // 993
        value: Math.round(directive.deleteAfter / 1000)                          // 91  // 994
      });                                                                        // 92  // 995
                                                                                 // 93  // 996
    var cdn = directive.cdn;                                                     // 94  // 997
                                                                                 // 95  // 998
    return {                                                                     // 96  // 999
      upload: url,                                                               // 97  // 1000
      download: (cdn && cdn + "/" + pathPrefix || host + path) + file.name,      // 98  // 1001
      postData: data                                                             // 99  // 1002
    };                                                                           // 100
  },                                                                             // 101
                                                                                 // 102
  sign: function (secretkey, path, data) {                                       // 103
    /* global Buffer: false */                                                   // 104
    var policy = path + "\n" + _.pluck(data, "value").join("\n");                // 105
                                                                                 // 106
    return Npm.require("crypto")                                                 // 107
      .createHmac("sha1", secretkey)                                             // 108
      .update(new Buffer(policy, "utf-8"))                                       // 109
      .digest("hex");                                                            // 110
  }                                                                              // 111
                                                                                 // 112
};                                                                               // 113
                                                                                 // 114
///////////////////////////////////////////////////////////////////////////////////     // 1018
                                                                                        // 1019
}).call(this);                                                                          // 1020
                                                                                        // 1021
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['edgee:slingshot'] = {
  Slingshot: Slingshot
};

})();

//# sourceMappingURL=edgee_slingshot.js.map
