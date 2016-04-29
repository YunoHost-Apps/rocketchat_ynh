(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var module, exports, s;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/underscorestring_underscore.string/meteor-pre.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Defining this will trick dist/underscore.string.js into putting its exports into module.exports                    // 1
// Credit to Tim Heckel for this trick - see https://github.com/TimHeckel/meteor-underscore-string                    // 2
module = {};                                                                                                          // 3
                                                                                                                      // 4
// This also needed, otherwise above doesn't work???                                                                  // 5
exports = {};                                                                                                         // 6
                                                                                                                      // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/underscorestring_underscore.string/dist/underscore.string.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*                                                                                                                    // 1
* Underscore.string                                                                                                   // 2
* (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>                                                        // 3
* Underscore.string is freely distributable under the terms of the MIT license.                                       // 4
* Documentation: https://github.com/epeli/underscore.string                                                           // 5
* Some code is borrowed from MooTools and Alexandru Marasteanu.                                                       // 6
* Version '3.3.4'                                                                                                     // 7
* @preserve                                                                                                           // 8
*/                                                                                                                    // 9
                                                                                                                      // 10
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.s = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var trim = require('./trim');                                                                                         // 12
var decap = require('./decapitalize');                                                                                // 13
                                                                                                                      // 14
module.exports = function camelize(str, decapitalize) {                                                               // 15
  str = trim(str).replace(/[-_\s]+(.)?/g, function(match, c) {                                                        // 16
    return c ? c.toUpperCase() : '';                                                                                  // 17
  });                                                                                                                 // 18
                                                                                                                      // 19
  if (decapitalize === true) {                                                                                        // 20
    return decap(str);                                                                                                // 21
  } else {                                                                                                            // 22
    return str;                                                                                                       // 23
  }                                                                                                                   // 24
};                                                                                                                    // 25
                                                                                                                      // 26
},{"./decapitalize":10,"./trim":65}],2:[function(require,module,exports){                                             // 27
var makeString = require('./helper/makeString');                                                                      // 28
                                                                                                                      // 29
module.exports = function capitalize(str, lowercaseRest) {                                                            // 30
  str = makeString(str);                                                                                              // 31
  var remainingChars = !lowercaseRest ? str.slice(1) : str.slice(1).toLowerCase();                                    // 32
                                                                                                                      // 33
  return str.charAt(0).toUpperCase() + remainingChars;                                                                // 34
};                                                                                                                    // 35
                                                                                                                      // 36
},{"./helper/makeString":20}],3:[function(require,module,exports){                                                    // 37
var makeString = require('./helper/makeString');                                                                      // 38
                                                                                                                      // 39
module.exports = function chars(str) {                                                                                // 40
  return makeString(str).split('');                                                                                   // 41
};                                                                                                                    // 42
                                                                                                                      // 43
},{"./helper/makeString":20}],4:[function(require,module,exports){                                                    // 44
module.exports = function chop(str, step) {                                                                           // 45
  if (str == null) return [];                                                                                         // 46
  str = String(str);                                                                                                  // 47
  step = ~~step;                                                                                                      // 48
  return step > 0 ? str.match(new RegExp('.{1,' + step + '}', 'g')) : [str];                                          // 49
};                                                                                                                    // 50
                                                                                                                      // 51
},{}],5:[function(require,module,exports){                                                                            // 52
var capitalize = require('./capitalize');                                                                             // 53
var camelize = require('./camelize');                                                                                 // 54
var makeString = require('./helper/makeString');                                                                      // 55
                                                                                                                      // 56
module.exports = function classify(str) {                                                                             // 57
  str = makeString(str);                                                                                              // 58
  return capitalize(camelize(str.replace(/[\W_]/g, ' ')).replace(/\s/g, ''));                                         // 59
};                                                                                                                    // 60
                                                                                                                      // 61
},{"./camelize":1,"./capitalize":2,"./helper/makeString":20}],6:[function(require,module,exports){                    // 62
var trim = require('./trim');                                                                                         // 63
                                                                                                                      // 64
module.exports = function clean(str) {                                                                                // 65
  return trim(str).replace(/\s\s+/g, ' ');                                                                            // 66
};                                                                                                                    // 67
                                                                                                                      // 68
},{"./trim":65}],7:[function(require,module,exports){                                                                 // 69
                                                                                                                      // 70
var makeString = require('./helper/makeString');                                                                      // 71
                                                                                                                      // 72
var from  = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž',                                              // 73
  to    = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz';                                                // 74
                                                                                                                      // 75
from += from.toUpperCase();                                                                                           // 76
to += to.toUpperCase();                                                                                               // 77
                                                                                                                      // 78
to = to.split('');                                                                                                    // 79
                                                                                                                      // 80
// for tokens requireing multitoken output                                                                            // 81
from += 'ß';                                                                                                          // 82
to.push('ss');                                                                                                        // 83
                                                                                                                      // 84
                                                                                                                      // 85
module.exports = function cleanDiacritics(str) {                                                                      // 86
  return makeString(str).replace(/.{1}/g, function(c){                                                                // 87
    var index = from.indexOf(c);                                                                                      // 88
    return index === -1 ? c : to[index];                                                                              // 89
  });                                                                                                                 // 90
};                                                                                                                    // 91
                                                                                                                      // 92
},{"./helper/makeString":20}],8:[function(require,module,exports){                                                    // 93
var makeString = require('./helper/makeString');                                                                      // 94
                                                                                                                      // 95
module.exports = function(str, substr) {                                                                              // 96
  str = makeString(str);                                                                                              // 97
  substr = makeString(substr);                                                                                        // 98
                                                                                                                      // 99
  if (str.length === 0 || substr.length === 0) return 0;                                                              // 100
                                                                                                                      // 101
  return str.split(substr).length - 1;                                                                                // 102
};                                                                                                                    // 103
                                                                                                                      // 104
},{"./helper/makeString":20}],9:[function(require,module,exports){                                                    // 105
var trim = require('./trim');                                                                                         // 106
                                                                                                                      // 107
module.exports = function dasherize(str) {                                                                            // 108
  return trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();                                 // 109
};                                                                                                                    // 110
                                                                                                                      // 111
},{"./trim":65}],10:[function(require,module,exports){                                                                // 112
var makeString = require('./helper/makeString');                                                                      // 113
                                                                                                                      // 114
module.exports = function decapitalize(str) {                                                                         // 115
  str = makeString(str);                                                                                              // 116
  return str.charAt(0).toLowerCase() + str.slice(1);                                                                  // 117
};                                                                                                                    // 118
                                                                                                                      // 119
},{"./helper/makeString":20}],11:[function(require,module,exports){                                                   // 120
var makeString = require('./helper/makeString');                                                                      // 121
                                                                                                                      // 122
function getIndent(str) {                                                                                             // 123
  var matches = str.match(/^[\s\\t]*/gm);                                                                             // 124
  var indent = matches[0].length;                                                                                     // 125
                                                                                                                      // 126
  for (var i = 1; i < matches.length; i++) {                                                                          // 127
    indent = Math.min(matches[i].length, indent);                                                                     // 128
  }                                                                                                                   // 129
                                                                                                                      // 130
  return indent;                                                                                                      // 131
}                                                                                                                     // 132
                                                                                                                      // 133
module.exports = function dedent(str, pattern) {                                                                      // 134
  str = makeString(str);                                                                                              // 135
  var indent = getIndent(str);                                                                                        // 136
  var reg;                                                                                                            // 137
                                                                                                                      // 138
  if (indent === 0) return str;                                                                                       // 139
                                                                                                                      // 140
  if (typeof pattern === 'string') {                                                                                  // 141
    reg = new RegExp('^' + pattern, 'gm');                                                                            // 142
  } else {                                                                                                            // 143
    reg = new RegExp('^[ \\t]{' + indent + '}', 'gm');                                                                // 144
  }                                                                                                                   // 145
                                                                                                                      // 146
  return str.replace(reg, '');                                                                                        // 147
};                                                                                                                    // 148
                                                                                                                      // 149
},{"./helper/makeString":20}],12:[function(require,module,exports){                                                   // 150
var makeString = require('./helper/makeString');                                                                      // 151
var toPositive = require('./helper/toPositive');                                                                      // 152
                                                                                                                      // 153
module.exports = function endsWith(str, ends, position) {                                                             // 154
  str = makeString(str);                                                                                              // 155
  ends = '' + ends;                                                                                                   // 156
  if (typeof position == 'undefined') {                                                                               // 157
    position = str.length - ends.length;                                                                              // 158
  } else {                                                                                                            // 159
    position = Math.min(toPositive(position), str.length) - ends.length;                                              // 160
  }                                                                                                                   // 161
  return position >= 0 && str.indexOf(ends, position) === position;                                                   // 162
};                                                                                                                    // 163
                                                                                                                      // 164
},{"./helper/makeString":20,"./helper/toPositive":22}],13:[function(require,module,exports){                          // 165
var makeString = require('./helper/makeString');                                                                      // 166
var escapeChars = require('./helper/escapeChars');                                                                    // 167
                                                                                                                      // 168
var regexString = '[';                                                                                                // 169
for(var key in escapeChars) {                                                                                         // 170
  regexString += key;                                                                                                 // 171
}                                                                                                                     // 172
regexString += ']';                                                                                                   // 173
                                                                                                                      // 174
var regex = new RegExp( regexString, 'g');                                                                            // 175
                                                                                                                      // 176
module.exports = function escapeHTML(str) {                                                                           // 177
                                                                                                                      // 178
  return makeString(str).replace(regex, function(m) {                                                                 // 179
    return '&' + escapeChars[m] + ';';                                                                                // 180
  });                                                                                                                 // 181
};                                                                                                                    // 182
                                                                                                                      // 183
},{"./helper/escapeChars":17,"./helper/makeString":20}],14:[function(require,module,exports){                         // 184
module.exports = function() {                                                                                         // 185
  var result = {};                                                                                                    // 186
                                                                                                                      // 187
  for (var prop in this) {                                                                                            // 188
    if (!this.hasOwnProperty(prop) || prop.match(/^(?:include|contains|reverse|join|map|wrap)$/)) continue;           // 189
    result[prop] = this[prop];                                                                                        // 190
  }                                                                                                                   // 191
                                                                                                                      // 192
  return result;                                                                                                      // 193
};                                                                                                                    // 194
                                                                                                                      // 195
},{}],15:[function(require,module,exports){                                                                           // 196
var makeString = require('./makeString');                                                                             // 197
                                                                                                                      // 198
module.exports = function adjacent(str, direction) {                                                                  // 199
  str = makeString(str);                                                                                              // 200
  if (str.length === 0) {                                                                                             // 201
    return '';                                                                                                        // 202
  }                                                                                                                   // 203
  return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length - 1) + direction);                          // 204
};                                                                                                                    // 205
                                                                                                                      // 206
},{"./makeString":20}],16:[function(require,module,exports){                                                          // 207
var escapeRegExp = require('./escapeRegExp');                                                                         // 208
                                                                                                                      // 209
module.exports = function defaultToWhiteSpace(characters) {                                                           // 210
  if (characters == null)                                                                                             // 211
    return '\\s';                                                                                                     // 212
  else if (characters.source)                                                                                         // 213
    return characters.source;                                                                                         // 214
  else                                                                                                                // 215
    return '[' + escapeRegExp(characters) + ']';                                                                      // 216
};                                                                                                                    // 217
                                                                                                                      // 218
},{"./escapeRegExp":18}],17:[function(require,module,exports){                                                        // 219
/* We're explicitly defining the list of entities we want to escape.                                                  // 220
nbsp is an HTML entity, but we don't want to escape all space characters in a string, hence its omission in this map.
                                                                                                                      // 222
*/                                                                                                                    // 223
var escapeChars = {                                                                                                   // 224
  '¢' : 'cent',                                                                                                       // 225
  '£' : 'pound',                                                                                                      // 226
  '¥' : 'yen',                                                                                                        // 227
  '€': 'euro',                                                                                                        // 228
  '©' :'copy',                                                                                                        // 229
  '®' : 'reg',                                                                                                        // 230
  '<' : 'lt',                                                                                                         // 231
  '>' : 'gt',                                                                                                         // 232
  '"' : 'quot',                                                                                                       // 233
  '&' : 'amp',                                                                                                        // 234
  '\'' : '#39'                                                                                                        // 235
};                                                                                                                    // 236
                                                                                                                      // 237
module.exports = escapeChars;                                                                                         // 238
                                                                                                                      // 239
},{}],18:[function(require,module,exports){                                                                           // 240
var makeString = require('./makeString');                                                                             // 241
                                                                                                                      // 242
module.exports = function escapeRegExp(str) {                                                                         // 243
  return makeString(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');                                               // 244
};                                                                                                                    // 245
                                                                                                                      // 246
},{"./makeString":20}],19:[function(require,module,exports){                                                          // 247
/*                                                                                                                    // 248
We're explicitly defining the list of entities that might see in escape HTML strings                                  // 249
*/                                                                                                                    // 250
var htmlEntities = {                                                                                                  // 251
  nbsp: ' ',                                                                                                          // 252
  cent: '¢',                                                                                                          // 253
  pound: '£',                                                                                                         // 254
  yen: '¥',                                                                                                           // 255
  euro: '€',                                                                                                          // 256
  copy: '©',                                                                                                          // 257
  reg: '®',                                                                                                           // 258
  lt: '<',                                                                                                            // 259
  gt: '>',                                                                                                            // 260
  quot: '"',                                                                                                          // 261
  amp: '&',                                                                                                           // 262
  apos: '\''                                                                                                          // 263
};                                                                                                                    // 264
                                                                                                                      // 265
module.exports = htmlEntities;                                                                                        // 266
                                                                                                                      // 267
},{}],20:[function(require,module,exports){                                                                           // 268
/**                                                                                                                   // 269
 * Ensure some object is a coerced to a string                                                                        // 270
 **/                                                                                                                  // 271
module.exports = function makeString(object) {                                                                        // 272
  if (object == null) return '';                                                                                      // 273
  return '' + object;                                                                                                 // 274
};                                                                                                                    // 275
                                                                                                                      // 276
},{}],21:[function(require,module,exports){                                                                           // 277
module.exports = function strRepeat(str, qty){                                                                        // 278
  if (qty < 1) return '';                                                                                             // 279
  var result = '';                                                                                                    // 280
  while (qty > 0) {                                                                                                   // 281
    if (qty & 1) result += str;                                                                                       // 282
    qty >>= 1, str += str;                                                                                            // 283
  }                                                                                                                   // 284
  return result;                                                                                                      // 285
};                                                                                                                    // 286
                                                                                                                      // 287
},{}],22:[function(require,module,exports){                                                                           // 288
module.exports = function toPositive(number) {                                                                        // 289
  return number < 0 ? 0 : (+number || 0);                                                                             // 290
};                                                                                                                    // 291
                                                                                                                      // 292
},{}],23:[function(require,module,exports){                                                                           // 293
var capitalize = require('./capitalize');                                                                             // 294
var underscored = require('./underscored');                                                                           // 295
var trim = require('./trim');                                                                                         // 296
                                                                                                                      // 297
module.exports = function humanize(str) {                                                                             // 298
  return capitalize(trim(underscored(str).replace(/_id$/, '').replace(/_/g, ' ')));                                   // 299
};                                                                                                                    // 300
                                                                                                                      // 301
},{"./capitalize":2,"./trim":65,"./underscored":67}],24:[function(require,module,exports){                            // 302
var makeString = require('./helper/makeString');                                                                      // 303
                                                                                                                      // 304
module.exports = function include(str, needle) {                                                                      // 305
  if (needle === '') return true;                                                                                     // 306
  return makeString(str).indexOf(needle) !== -1;                                                                      // 307
};                                                                                                                    // 308
                                                                                                                      // 309
},{"./helper/makeString":20}],25:[function(require,module,exports){                                                   // 310
/*                                                                                                                    // 311
* Underscore.string                                                                                                   // 312
* (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>                                                        // 313
* Underscore.string is freely distributable under the terms of the MIT license.                                       // 314
* Documentation: https://github.com/epeli/underscore.string                                                           // 315
* Some code is borrowed from MooTools and Alexandru Marasteanu.                                                       // 316
* Version '3.3.4'                                                                                                     // 317
* @preserve                                                                                                           // 318
*/                                                                                                                    // 319
                                                                                                                      // 320
'use strict';                                                                                                         // 321
                                                                                                                      // 322
function s(value) {                                                                                                   // 323
  /* jshint validthis: true */                                                                                        // 324
  if (!(this instanceof s)) return new s(value);                                                                      // 325
  this._wrapped = value;                                                                                              // 326
}                                                                                                                     // 327
                                                                                                                      // 328
s.VERSION = '3.3.4';                                                                                                  // 329
                                                                                                                      // 330
s.isBlank          = require('./isBlank');                                                                            // 331
s.stripTags        = require('./stripTags');                                                                          // 332
s.capitalize       = require('./capitalize');                                                                         // 333
s.decapitalize     = require('./decapitalize');                                                                       // 334
s.chop             = require('./chop');                                                                               // 335
s.trim             = require('./trim');                                                                               // 336
s.clean            = require('./clean');                                                                              // 337
s.cleanDiacritics  = require('./cleanDiacritics');                                                                    // 338
s.count            = require('./count');                                                                              // 339
s.chars            = require('./chars');                                                                              // 340
s.swapCase         = require('./swapCase');                                                                           // 341
s.escapeHTML       = require('./escapeHTML');                                                                         // 342
s.unescapeHTML     = require('./unescapeHTML');                                                                       // 343
s.splice           = require('./splice');                                                                             // 344
s.insert           = require('./insert');                                                                             // 345
s.replaceAll       = require('./replaceAll');                                                                         // 346
s.include          = require('./include');                                                                            // 347
s.join             = require('./join');                                                                               // 348
s.lines            = require('./lines');                                                                              // 349
s.dedent           = require('./dedent');                                                                             // 350
s.reverse          = require('./reverse');                                                                            // 351
s.startsWith       = require('./startsWith');                                                                         // 352
s.endsWith         = require('./endsWith');                                                                           // 353
s.pred             = require('./pred');                                                                               // 354
s.succ             = require('./succ');                                                                               // 355
s.titleize         = require('./titleize');                                                                           // 356
s.camelize         = require('./camelize');                                                                           // 357
s.underscored      = require('./underscored');                                                                        // 358
s.dasherize        = require('./dasherize');                                                                          // 359
s.classify         = require('./classify');                                                                           // 360
s.humanize         = require('./humanize');                                                                           // 361
s.ltrim            = require('./ltrim');                                                                              // 362
s.rtrim            = require('./rtrim');                                                                              // 363
s.truncate         = require('./truncate');                                                                           // 364
s.prune            = require('./prune');                                                                              // 365
s.words            = require('./words');                                                                              // 366
s.pad              = require('./pad');                                                                                // 367
s.lpad             = require('./lpad');                                                                               // 368
s.rpad             = require('./rpad');                                                                               // 369
s.lrpad            = require('./lrpad');                                                                              // 370
s.sprintf          = require('./sprintf');                                                                            // 371
s.vsprintf         = require('./vsprintf');                                                                           // 372
s.toNumber         = require('./toNumber');                                                                           // 373
s.numberFormat     = require('./numberFormat');                                                                       // 374
s.strRight         = require('./strRight');                                                                           // 375
s.strRightBack     = require('./strRightBack');                                                                       // 376
s.strLeft          = require('./strLeft');                                                                            // 377
s.strLeftBack      = require('./strLeftBack');                                                                        // 378
s.toSentence       = require('./toSentence');                                                                         // 379
s.toSentenceSerial = require('./toSentenceSerial');                                                                   // 380
s.slugify          = require('./slugify');                                                                            // 381
s.surround         = require('./surround');                                                                           // 382
s.quote            = require('./quote');                                                                              // 383
s.unquote          = require('./unquote');                                                                            // 384
s.repeat           = require('./repeat');                                                                             // 385
s.naturalCmp       = require('./naturalCmp');                                                                         // 386
s.levenshtein      = require('./levenshtein');                                                                        // 387
s.toBoolean        = require('./toBoolean');                                                                          // 388
s.exports          = require('./exports');                                                                            // 389
s.escapeRegExp     = require('./helper/escapeRegExp');                                                                // 390
s.wrap             = require('./wrap');                                                                               // 391
s.map              = require('./map');                                                                                // 392
                                                                                                                      // 393
// Aliases                                                                                                            // 394
s.strip     = s.trim;                                                                                                 // 395
s.lstrip    = s.ltrim;                                                                                                // 396
s.rstrip    = s.rtrim;                                                                                                // 397
s.center    = s.lrpad;                                                                                                // 398
s.rjust     = s.lpad;                                                                                                 // 399
s.ljust     = s.rpad;                                                                                                 // 400
s.contains  = s.include;                                                                                              // 401
s.q         = s.quote;                                                                                                // 402
s.toBool    = s.toBoolean;                                                                                            // 403
s.camelcase = s.camelize;                                                                                             // 404
s.mapChars  = s.map;                                                                                                  // 405
                                                                                                                      // 406
                                                                                                                      // 407
// Implement chaining                                                                                                 // 408
s.prototype = {                                                                                                       // 409
  value: function value() {                                                                                           // 410
    return this._wrapped;                                                                                             // 411
  }                                                                                                                   // 412
};                                                                                                                    // 413
                                                                                                                      // 414
function fn2method(key, fn) {                                                                                         // 415
  if (typeof fn !== 'function') return;                                                                               // 416
  s.prototype[key] = function() {                                                                                     // 417
    var args = [this._wrapped].concat(Array.prototype.slice.call(arguments));                                         // 418
    var res = fn.apply(null, args);                                                                                   // 419
    // if the result is non-string stop the chain and return the value                                                // 420
    return typeof res === 'string' ? new s(res) : res;                                                                // 421
  };                                                                                                                  // 422
}                                                                                                                     // 423
                                                                                                                      // 424
// Copy functions to instance methods for chaining                                                                    // 425
for (var key in s) fn2method(key, s[key]);                                                                            // 426
                                                                                                                      // 427
fn2method('tap', function tap(string, fn) {                                                                           // 428
  return fn(string);                                                                                                  // 429
});                                                                                                                   // 430
                                                                                                                      // 431
function prototype2method(methodName) {                                                                               // 432
  fn2method(methodName, function(context) {                                                                           // 433
    var args = Array.prototype.slice.call(arguments, 1);                                                              // 434
    return String.prototype[methodName].apply(context, args);                                                         // 435
  });                                                                                                                 // 436
}                                                                                                                     // 437
                                                                                                                      // 438
var prototypeMethods = [                                                                                              // 439
  'toUpperCase',                                                                                                      // 440
  'toLowerCase',                                                                                                      // 441
  'split',                                                                                                            // 442
  'replace',                                                                                                          // 443
  'slice',                                                                                                            // 444
  'substring',                                                                                                        // 445
  'substr',                                                                                                           // 446
  'concat'                                                                                                            // 447
];                                                                                                                    // 448
                                                                                                                      // 449
for (var method in prototypeMethods) prototype2method(prototypeMethods[method]);                                      // 450
                                                                                                                      // 451
                                                                                                                      // 452
module.exports = s;                                                                                                   // 453
                                                                                                                      // 454
},{"./camelize":1,"./capitalize":2,"./chars":3,"./chop":4,"./classify":5,"./clean":6,"./cleanDiacritics":7,"./count":8,"./dasherize":9,"./decapitalize":10,"./dedent":11,"./endsWith":12,"./escapeHTML":13,"./exports":14,"./helper/escapeRegExp":18,"./humanize":23,"./include":24,"./insert":26,"./isBlank":27,"./join":28,"./levenshtein":29,"./lines":30,"./lpad":31,"./lrpad":32,"./ltrim":33,"./map":34,"./naturalCmp":35,"./numberFormat":38,"./pad":39,"./pred":40,"./prune":41,"./quote":42,"./repeat":43,"./replaceAll":44,"./reverse":45,"./rpad":46,"./rtrim":47,"./slugify":48,"./splice":49,"./sprintf":50,"./startsWith":51,"./strLeft":52,"./strLeftBack":53,"./strRight":54,"./strRightBack":55,"./stripTags":56,"./succ":57,"./surround":58,"./swapCase":59,"./titleize":60,"./toBoolean":61,"./toNumber":62,"./toSentence":63,"./toSentenceSerial":64,"./trim":65,"./truncate":66,"./underscored":67,"./unescapeHTML":68,"./unquote":69,"./vsprintf":70,"./words":71,"./wrap":72}],26:[function(require,module,exports){
var splice = require('./splice');                                                                                     // 456
                                                                                                                      // 457
module.exports = function insert(str, i, substr) {                                                                    // 458
  return splice(str, i, 0, substr);                                                                                   // 459
};                                                                                                                    // 460
                                                                                                                      // 461
},{"./splice":49}],27:[function(require,module,exports){                                                              // 462
var makeString = require('./helper/makeString');                                                                      // 463
                                                                                                                      // 464
module.exports = function isBlank(str) {                                                                              // 465
  return (/^\s*$/).test(makeString(str));                                                                             // 466
};                                                                                                                    // 467
                                                                                                                      // 468
},{"./helper/makeString":20}],28:[function(require,module,exports){                                                   // 469
var makeString = require('./helper/makeString');                                                                      // 470
var slice = [].slice;                                                                                                 // 471
                                                                                                                      // 472
module.exports = function join() {                                                                                    // 473
  var args = slice.call(arguments),                                                                                   // 474
    separator = args.shift();                                                                                         // 475
                                                                                                                      // 476
  return args.join(makeString(separator));                                                                            // 477
};                                                                                                                    // 478
                                                                                                                      // 479
},{"./helper/makeString":20}],29:[function(require,module,exports){                                                   // 480
var makeString = require('./helper/makeString');                                                                      // 481
                                                                                                                      // 482
/**                                                                                                                   // 483
 * Based on the implementation here: https://github.com/hiddentao/fast-levenshtein                                    // 484
 */                                                                                                                   // 485
module.exports = function levenshtein(str1, str2) {                                                                   // 486
  'use strict';                                                                                                       // 487
  str1 = makeString(str1);                                                                                            // 488
  str2 = makeString(str2);                                                                                            // 489
                                                                                                                      // 490
  // Short cut cases                                                                                                  // 491
  if (str1 === str2) return 0;                                                                                        // 492
  if (!str1 || !str2) return Math.max(str1.length, str2.length);                                                      // 493
                                                                                                                      // 494
  // two rows                                                                                                         // 495
  var prevRow = new Array(str2.length + 1);                                                                           // 496
                                                                                                                      // 497
  // initialise previous row                                                                                          // 498
  for (var i = 0; i < prevRow.length; ++i) {                                                                          // 499
    prevRow[i] = i;                                                                                                   // 500
  }                                                                                                                   // 501
                                                                                                                      // 502
  // calculate current row distance from previous row                                                                 // 503
  for (i = 0; i < str1.length; ++i) {                                                                                 // 504
    var nextCol = i + 1;                                                                                              // 505
                                                                                                                      // 506
    for (var j = 0; j < str2.length; ++j) {                                                                           // 507
      var curCol = nextCol;                                                                                           // 508
                                                                                                                      // 509
      // substution                                                                                                   // 510
      nextCol = prevRow[j] + ( (str1.charAt(i) === str2.charAt(j)) ? 0 : 1 );                                         // 511
      // insertion                                                                                                    // 512
      var tmp = curCol + 1;                                                                                           // 513
      if (nextCol > tmp) {                                                                                            // 514
        nextCol = tmp;                                                                                                // 515
      }                                                                                                               // 516
      // deletion                                                                                                     // 517
      tmp = prevRow[j + 1] + 1;                                                                                       // 518
      if (nextCol > tmp) {                                                                                            // 519
        nextCol = tmp;                                                                                                // 520
      }                                                                                                               // 521
                                                                                                                      // 522
      // copy current col value into previous (in preparation for next iteration)                                     // 523
      prevRow[j] = curCol;                                                                                            // 524
    }                                                                                                                 // 525
                                                                                                                      // 526
    // copy last col value into previous (in preparation for next iteration)                                          // 527
    prevRow[j] = nextCol;                                                                                             // 528
  }                                                                                                                   // 529
                                                                                                                      // 530
  return nextCol;                                                                                                     // 531
};                                                                                                                    // 532
                                                                                                                      // 533
},{"./helper/makeString":20}],30:[function(require,module,exports){                                                   // 534
module.exports = function lines(str) {                                                                                // 535
  if (str == null) return [];                                                                                         // 536
  return String(str).split(/\r\n?|\n/);                                                                               // 537
};                                                                                                                    // 538
                                                                                                                      // 539
},{}],31:[function(require,module,exports){                                                                           // 540
var pad = require('./pad');                                                                                           // 541
                                                                                                                      // 542
module.exports = function lpad(str, length, padStr) {                                                                 // 543
  return pad(str, length, padStr);                                                                                    // 544
};                                                                                                                    // 545
                                                                                                                      // 546
},{"./pad":39}],32:[function(require,module,exports){                                                                 // 547
var pad = require('./pad');                                                                                           // 548
                                                                                                                      // 549
module.exports = function lrpad(str, length, padStr) {                                                                // 550
  return pad(str, length, padStr, 'both');                                                                            // 551
};                                                                                                                    // 552
                                                                                                                      // 553
},{"./pad":39}],33:[function(require,module,exports){                                                                 // 554
var makeString = require('./helper/makeString');                                                                      // 555
var defaultToWhiteSpace = require('./helper/defaultToWhiteSpace');                                                    // 556
var nativeTrimLeft = String.prototype.trimLeft;                                                                       // 557
                                                                                                                      // 558
module.exports = function ltrim(str, characters) {                                                                    // 559
  str = makeString(str);                                                                                              // 560
  if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);                                                 // 561
  characters = defaultToWhiteSpace(characters);                                                                       // 562
  return str.replace(new RegExp('^' + characters + '+'), '');                                                         // 563
};                                                                                                                    // 564
                                                                                                                      // 565
},{"./helper/defaultToWhiteSpace":16,"./helper/makeString":20}],34:[function(require,module,exports){                 // 566
var makeString = require('./helper/makeString');                                                                      // 567
                                                                                                                      // 568
module.exports = function(str, callback) {                                                                            // 569
  str = makeString(str);                                                                                              // 570
                                                                                                                      // 571
  if (str.length === 0 || typeof callback !== 'function') return str;                                                 // 572
                                                                                                                      // 573
  return str.replace(/./g, callback);                                                                                 // 574
};                                                                                                                    // 575
                                                                                                                      // 576
},{"./helper/makeString":20}],35:[function(require,module,exports){                                                   // 577
module.exports = function naturalCmp(str1, str2) {                                                                    // 578
  if (str1 == str2) return 0;                                                                                         // 579
  if (!str1) return -1;                                                                                               // 580
  if (!str2) return 1;                                                                                                // 581
                                                                                                                      // 582
  var cmpRegex = /(\.\d+|\d+|\D+)/g,                                                                                  // 583
    tokens1 = String(str1).match(cmpRegex),                                                                           // 584
    tokens2 = String(str2).match(cmpRegex),                                                                           // 585
    count = Math.min(tokens1.length, tokens2.length);                                                                 // 586
                                                                                                                      // 587
  for (var i = 0; i < count; i++) {                                                                                   // 588
    var a = tokens1[i],                                                                                               // 589
      b = tokens2[i];                                                                                                 // 590
                                                                                                                      // 591
    if (a !== b) {                                                                                                    // 592
      var num1 = +a;                                                                                                  // 593
      var num2 = +b;                                                                                                  // 594
      if (num1 === num1 && num2 === num2) {                                                                           // 595
        return num1 > num2 ? 1 : -1;                                                                                  // 596
      }                                                                                                               // 597
      return a < b ? -1 : 1;                                                                                          // 598
    }                                                                                                                 // 599
  }                                                                                                                   // 600
                                                                                                                      // 601
  if (tokens1.length != tokens2.length)                                                                               // 602
    return tokens1.length - tokens2.length;                                                                           // 603
                                                                                                                      // 604
  return str1 < str2 ? -1 : 1;                                                                                        // 605
};                                                                                                                    // 606
                                                                                                                      // 607
},{}],36:[function(require,module,exports){                                                                           // 608
(function(window) {                                                                                                   // 609
    var re = {                                                                                                        // 610
        not_string: /[^s]/,                                                                                           // 611
        number: /[diefg]/,                                                                                            // 612
        json: /[j]/,                                                                                                  // 613
        not_json: /[^j]/,                                                                                             // 614
        text: /^[^\x25]+/,                                                                                            // 615
        modulo: /^\x25{2}/,                                                                                           // 616
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,        // 617
        key: /^([a-z_][a-z_\d]*)/i,                                                                                   // 618
        key_access: /^\.([a-z_][a-z_\d]*)/i,                                                                          // 619
        index_access: /^\[(\d+)\]/,                                                                                   // 620
        sign: /^[\+\-]/                                                                                               // 621
    }                                                                                                                 // 622
                                                                                                                      // 623
    function sprintf() {                                                                                              // 624
        var key = arguments[0], cache = sprintf.cache                                                                 // 625
        if (!(cache[key] && cache.hasOwnProperty(key))) {                                                             // 626
            cache[key] = sprintf.parse(key)                                                                           // 627
        }                                                                                                             // 628
        return sprintf.format.call(null, cache[key], arguments)                                                       // 629
    }                                                                                                                 // 630
                                                                                                                      // 631
    sprintf.format = function(parse_tree, argv) {                                                                     // 632
        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = ""
        for (i = 0; i < tree_length; i++) {                                                                           // 634
            node_type = get_type(parse_tree[i])                                                                       // 635
            if (node_type === "string") {                                                                             // 636
                output[output.length] = parse_tree[i]                                                                 // 637
            }                                                                                                         // 638
            else if (node_type === "array") {                                                                         // 639
                match = parse_tree[i] // convenience purposes only                                                    // 640
                if (match[2]) { // keyword argument                                                                   // 641
                    arg = argv[cursor]                                                                                // 642
                    for (k = 0; k < match[2].length; k++) {                                                           // 643
                        if (!arg.hasOwnProperty(match[2][k])) {                                                       // 644
                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]))           // 645
                        }                                                                                             // 646
                        arg = arg[match[2][k]]                                                                        // 647
                    }                                                                                                 // 648
                }                                                                                                     // 649
                else if (match[1]) { // positional argument (explicit)                                                // 650
                    arg = argv[match[1]]                                                                              // 651
                }                                                                                                     // 652
                else { // positional argument (implicit)                                                              // 653
                    arg = argv[cursor++]                                                                              // 654
                }                                                                                                     // 655
                                                                                                                      // 656
                if (get_type(arg) == "function") {                                                                    // 657
                    arg = arg()                                                                                       // 658
                }                                                                                                     // 659
                                                                                                                      // 660
                if (re.not_string.test(match[8]) && re.not_json.test(match[8]) && (get_type(arg) != "number" && isNaN(arg))) {
                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)))            // 662
                }                                                                                                     // 663
                                                                                                                      // 664
                if (re.number.test(match[8])) {                                                                       // 665
                    is_positive = arg >= 0                                                                            // 666
                }                                                                                                     // 667
                                                                                                                      // 668
                switch (match[8]) {                                                                                   // 669
                    case "b":                                                                                         // 670
                        arg = arg.toString(2)                                                                         // 671
                    break                                                                                             // 672
                    case "c":                                                                                         // 673
                        arg = String.fromCharCode(arg)                                                                // 674
                    break                                                                                             // 675
                    case "d":                                                                                         // 676
                    case "i":                                                                                         // 677
                        arg = parseInt(arg, 10)                                                                       // 678
                    break                                                                                             // 679
                    case "j":                                                                                         // 680
                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0)                            // 681
                    break                                                                                             // 682
                    case "e":                                                                                         // 683
                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential()                            // 684
                    break                                                                                             // 685
                    case "f":                                                                                         // 686
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg)                          // 687
                    break                                                                                             // 688
                    case "g":                                                                                         // 689
                        arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg)                      // 690
                    break                                                                                             // 691
                    case "o":                                                                                         // 692
                        arg = arg.toString(8)                                                                         // 693
                    break                                                                                             // 694
                    case "s":                                                                                         // 695
                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg)                    // 696
                    break                                                                                             // 697
                    case "u":                                                                                         // 698
                        arg = arg >>> 0                                                                               // 699
                    break                                                                                             // 700
                    case "x":                                                                                         // 701
                        arg = arg.toString(16)                                                                        // 702
                    break                                                                                             // 703
                    case "X":                                                                                         // 704
                        arg = arg.toString(16).toUpperCase()                                                          // 705
                    break                                                                                             // 706
                }                                                                                                     // 707
                if (re.json.test(match[8])) {                                                                         // 708
                    output[output.length] = arg                                                                       // 709
                }                                                                                                     // 710
                else {                                                                                                // 711
                    if (re.number.test(match[8]) && (!is_positive || match[3])) {                                     // 712
                        sign = is_positive ? "+" : "-"                                                                // 713
                        arg = arg.toString().replace(re.sign, "")                                                     // 714
                    }                                                                                                 // 715
                    else {                                                                                            // 716
                        sign = ""                                                                                     // 717
                    }                                                                                                 // 718
                    pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " "                      // 719
                    pad_length = match[6] - (sign + arg).length                                                       // 720
                    pad = match[6] ? (pad_length > 0 ? str_repeat(pad_character, pad_length) : "") : ""               // 721
                    output[output.length] = match[5] ? sign + arg + pad : (pad_character === "0" ? sign + pad + arg : pad + sign + arg)
                }                                                                                                     // 723
            }                                                                                                         // 724
        }                                                                                                             // 725
        return output.join("")                                                                                        // 726
    }                                                                                                                 // 727
                                                                                                                      // 728
    sprintf.cache = {}                                                                                                // 729
                                                                                                                      // 730
    sprintf.parse = function(fmt) {                                                                                   // 731
        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0                                                    // 732
        while (_fmt) {                                                                                                // 733
            if ((match = re.text.exec(_fmt)) !== null) {                                                              // 734
                parse_tree[parse_tree.length] = match[0]                                                              // 735
            }                                                                                                         // 736
            else if ((match = re.modulo.exec(_fmt)) !== null) {                                                       // 737
                parse_tree[parse_tree.length] = "%"                                                                   // 738
            }                                                                                                         // 739
            else if ((match = re.placeholder.exec(_fmt)) !== null) {                                                  // 740
                if (match[2]) {                                                                                       // 741
                    arg_names |= 1                                                                                    // 742
                    var field_list = [], replacement_field = match[2], field_match = []                               // 743
                    if ((field_match = re.key.exec(replacement_field)) !== null) {                                    // 744
                        field_list[field_list.length] = field_match[1]                                                // 745
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {     // 746
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {                     // 747
                                field_list[field_list.length] = field_match[1]                                        // 748
                            }                                                                                         // 749
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {              // 750
                                field_list[field_list.length] = field_match[1]                                        // 751
                            }                                                                                         // 752
                            else {                                                                                    // 753
                                throw new SyntaxError("[sprintf] failed to parse named argument key")                 // 754
                            }                                                                                         // 755
                        }                                                                                             // 756
                    }                                                                                                 // 757
                    else {                                                                                            // 758
                        throw new SyntaxError("[sprintf] failed to parse named argument key")                         // 759
                    }                                                                                                 // 760
                    match[2] = field_list                                                                             // 761
                }                                                                                                     // 762
                else {                                                                                                // 763
                    arg_names |= 2                                                                                    // 764
                }                                                                                                     // 765
                if (arg_names === 3) {                                                                                // 766
                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")      // 767
                }                                                                                                     // 768
                parse_tree[parse_tree.length] = match                                                                 // 769
            }                                                                                                         // 770
            else {                                                                                                    // 771
                throw new SyntaxError("[sprintf] unexpected placeholder")                                             // 772
            }                                                                                                         // 773
            _fmt = _fmt.substring(match[0].length)                                                                    // 774
        }                                                                                                             // 775
        return parse_tree                                                                                             // 776
    }                                                                                                                 // 777
                                                                                                                      // 778
    var vsprintf = function(fmt, argv, _argv) {                                                                       // 779
        _argv = (argv || []).slice(0)                                                                                 // 780
        _argv.splice(0, 0, fmt)                                                                                       // 781
        return sprintf.apply(null, _argv)                                                                             // 782
    }                                                                                                                 // 783
                                                                                                                      // 784
    /**                                                                                                               // 785
     * helpers                                                                                                        // 786
     */                                                                                                               // 787
    function get_type(variable) {                                                                                     // 788
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()                                    // 789
    }                                                                                                                 // 790
                                                                                                                      // 791
    function str_repeat(input, multiplier) {                                                                          // 792
        return Array(multiplier + 1).join(input)                                                                      // 793
    }                                                                                                                 // 794
                                                                                                                      // 795
    /**                                                                                                               // 796
     * export to either browser or node.js                                                                            // 797
     */                                                                                                               // 798
    if (typeof exports !== "undefined") {                                                                             // 799
        exports.sprintf = sprintf                                                                                     // 800
        exports.vsprintf = vsprintf                                                                                   // 801
    }                                                                                                                 // 802
    else {                                                                                                            // 803
        window.sprintf = sprintf                                                                                      // 804
        window.vsprintf = vsprintf                                                                                    // 805
                                                                                                                      // 806
        if (typeof define === "function" && define.amd) {                                                             // 807
            define(function() {                                                                                       // 808
                return {                                                                                              // 809
                    sprintf: sprintf,                                                                                 // 810
                    vsprintf: vsprintf                                                                                // 811
                }                                                                                                     // 812
            })                                                                                                        // 813
        }                                                                                                             // 814
    }                                                                                                                 // 815
})(typeof window === "undefined" ? this : window);                                                                    // 816
                                                                                                                      // 817
},{}],37:[function(require,module,exports){                                                                           // 818
(function (global){                                                                                                   // 819
                                                                                                                      // 820
/**                                                                                                                   // 821
 * Module exports.                                                                                                    // 822
 */                                                                                                                   // 823
                                                                                                                      // 824
module.exports = deprecate;                                                                                           // 825
                                                                                                                      // 826
/**                                                                                                                   // 827
 * Mark that a method should not be used.                                                                             // 828
 * Returns a modified function which warns once by default.                                                           // 829
 *                                                                                                                    // 830
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.                                                 // 831
 *                                                                                                                    // 832
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions                                        // 833
 * will throw an Error when invoked.                                                                                  // 834
 *                                                                                                                    // 835
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions                                        // 836
 * will invoke `console.trace()` instead of `console.error()`.                                                        // 837
 *                                                                                                                    // 838
 * @param {Function} fn - the function to deprecate                                                                   // 839
 * @param {String} msg - the string to print to the console when `fn` is invoked                                      // 840
 * @returns {Function} a new "deprecated" version of `fn`                                                             // 841
 * @api public                                                                                                        // 842
 */                                                                                                                   // 843
                                                                                                                      // 844
function deprecate (fn, msg) {                                                                                        // 845
  if (config('noDeprecation')) {                                                                                      // 846
    return fn;                                                                                                        // 847
  }                                                                                                                   // 848
                                                                                                                      // 849
  var warned = false;                                                                                                 // 850
  function deprecated() {                                                                                             // 851
    if (!warned) {                                                                                                    // 852
      if (config('throwDeprecation')) {                                                                               // 853
        throw new Error(msg);                                                                                         // 854
      } else if (config('traceDeprecation')) {                                                                        // 855
        console.trace(msg);                                                                                           // 856
      } else {                                                                                                        // 857
        console.warn(msg);                                                                                            // 858
      }                                                                                                               // 859
      warned = true;                                                                                                  // 860
    }                                                                                                                 // 861
    return fn.apply(this, arguments);                                                                                 // 862
  }                                                                                                                   // 863
                                                                                                                      // 864
  return deprecated;                                                                                                  // 865
}                                                                                                                     // 866
                                                                                                                      // 867
/**                                                                                                                   // 868
 * Checks `localStorage` for boolean values for the given `name`.                                                     // 869
 *                                                                                                                    // 870
 * @param {String} name                                                                                               // 871
 * @returns {Boolean}                                                                                                 // 872
 * @api private                                                                                                       // 873
 */                                                                                                                   // 874
                                                                                                                      // 875
function config (name) {                                                                                              // 876
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes                                    // 877
  try {                                                                                                               // 878
    if (!global.localStorage) return false;                                                                           // 879
  } catch (_) {                                                                                                       // 880
    return false;                                                                                                     // 881
  }                                                                                                                   // 882
  var val = global.localStorage[name];                                                                                // 883
  if (null == val) return false;                                                                                      // 884
  return String(val).toLowerCase() === 'true';                                                                        // 885
}                                                                                                                     // 886
                                                                                                                      // 887
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],38:[function(require,module,exports){                                                                           // 889
module.exports = function numberFormat(number, dec, dsep, tsep) {                                                     // 890
  if (isNaN(number) || number == null) return '';                                                                     // 891
                                                                                                                      // 892
  number = number.toFixed(~~dec);                                                                                     // 893
  tsep = typeof tsep == 'string' ? tsep : ',';                                                                        // 894
                                                                                                                      // 895
  var parts = number.split('.'),                                                                                      // 896
    fnums = parts[0],                                                                                                 // 897
    decimals = parts[1] ? (dsep || '.') + parts[1] : '';                                                              // 898
                                                                                                                      // 899
  return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;                                               // 900
};                                                                                                                    // 901
                                                                                                                      // 902
},{}],39:[function(require,module,exports){                                                                           // 903
var makeString = require('./helper/makeString');                                                                      // 904
var strRepeat = require('./helper/strRepeat');                                                                        // 905
                                                                                                                      // 906
module.exports = function pad(str, length, padStr, type) {                                                            // 907
  str = makeString(str);                                                                                              // 908
  length = ~~length;                                                                                                  // 909
                                                                                                                      // 910
  var padlen = 0;                                                                                                     // 911
                                                                                                                      // 912
  if (!padStr)                                                                                                        // 913
    padStr = ' ';                                                                                                     // 914
  else if (padStr.length > 1)                                                                                         // 915
    padStr = padStr.charAt(0);                                                                                        // 916
                                                                                                                      // 917
  switch (type) {                                                                                                     // 918
  case 'right':                                                                                                       // 919
    padlen = length - str.length;                                                                                     // 920
    return str + strRepeat(padStr, padlen);                                                                           // 921
  case 'both':                                                                                                        // 922
    padlen = length - str.length;                                                                                     // 923
    return strRepeat(padStr, Math.ceil(padlen / 2)) + str + strRepeat(padStr, Math.floor(padlen / 2));                // 924
  default: // 'left'                                                                                                  // 925
    padlen = length - str.length;                                                                                     // 926
    return strRepeat(padStr, padlen) + str;                                                                           // 927
  }                                                                                                                   // 928
};                                                                                                                    // 929
                                                                                                                      // 930
},{"./helper/makeString":20,"./helper/strRepeat":21}],40:[function(require,module,exports){                           // 931
var adjacent = require('./helper/adjacent');                                                                          // 932
                                                                                                                      // 933
module.exports = function succ(str) {                                                                                 // 934
  return adjacent(str, -1);                                                                                           // 935
};                                                                                                                    // 936
                                                                                                                      // 937
},{"./helper/adjacent":15}],41:[function(require,module,exports){                                                     // 938
/**                                                                                                                   // 939
 * _s.prune: a more elegant version of truncate                                                                       // 940
 * prune extra chars, never leaving a half-chopped word.                                                              // 941
 * @author github.com/rwz                                                                                             // 942
 */                                                                                                                   // 943
var makeString = require('./helper/makeString');                                                                      // 944
var rtrim = require('./rtrim');                                                                                       // 945
                                                                                                                      // 946
module.exports = function prune(str, length, pruneStr) {                                                              // 947
  str = makeString(str);                                                                                              // 948
  length = ~~length;                                                                                                  // 949
  pruneStr = pruneStr != null ? String(pruneStr) : '...';                                                             // 950
                                                                                                                      // 951
  if (str.length <= length) return str;                                                                               // 952
                                                                                                                      // 953
  var tmpl = function(c) {                                                                                            // 954
      return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' ';                                                         // 955
    },                                                                                                                // 956
    template = str.slice(0, length + 1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'           // 957
                                                                                                                      // 958
  if (template.slice(template.length - 2).match(/\w\w/))                                                              // 959
    template = template.replace(/\s*\S+$/, '');                                                                       // 960
  else                                                                                                                // 961
    template = rtrim(template.slice(0, template.length - 1));                                                         // 962
                                                                                                                      // 963
  return (template + pruneStr).length > str.length ? str : str.slice(0, template.length) + pruneStr;                  // 964
};                                                                                                                    // 965
                                                                                                                      // 966
},{"./helper/makeString":20,"./rtrim":47}],42:[function(require,module,exports){                                      // 967
var surround = require('./surround');                                                                                 // 968
                                                                                                                      // 969
module.exports = function quote(str, quoteChar) {                                                                     // 970
  return surround(str, quoteChar || '"');                                                                             // 971
};                                                                                                                    // 972
                                                                                                                      // 973
},{"./surround":58}],43:[function(require,module,exports){                                                            // 974
var makeString = require('./helper/makeString');                                                                      // 975
var strRepeat = require('./helper/strRepeat');                                                                        // 976
                                                                                                                      // 977
module.exports = function repeat(str, qty, separator) {                                                               // 978
  str = makeString(str);                                                                                              // 979
                                                                                                                      // 980
  qty = ~~qty;                                                                                                        // 981
                                                                                                                      // 982
  // using faster implementation if separator is not needed;                                                          // 983
  if (separator == null) return strRepeat(str, qty);                                                                  // 984
                                                                                                                      // 985
  // this one is about 300x slower in Google Chrome                                                                   // 986
  /*eslint no-empty: 0*/                                                                                              // 987
  for (var repeat = []; qty > 0; repeat[--qty] = str) {}                                                              // 988
  return repeat.join(separator);                                                                                      // 989
};                                                                                                                    // 990
                                                                                                                      // 991
},{"./helper/makeString":20,"./helper/strRepeat":21}],44:[function(require,module,exports){                           // 992
var makeString = require('./helper/makeString');                                                                      // 993
                                                                                                                      // 994
module.exports = function replaceAll(str, find, replace, ignorecase) {                                                // 995
  var flags = (ignorecase === true)?'gi':'g';                                                                         // 996
  var reg = new RegExp(find, flags);                                                                                  // 997
                                                                                                                      // 998
  return makeString(str).replace(reg, replace);                                                                       // 999
};                                                                                                                    // 1000
                                                                                                                      // 1001
},{"./helper/makeString":20}],45:[function(require,module,exports){                                                   // 1002
var chars = require('./chars');                                                                                       // 1003
                                                                                                                      // 1004
module.exports = function reverse(str) {                                                                              // 1005
  return chars(str).reverse().join('');                                                                               // 1006
};                                                                                                                    // 1007
                                                                                                                      // 1008
},{"./chars":3}],46:[function(require,module,exports){                                                                // 1009
var pad = require('./pad');                                                                                           // 1010
                                                                                                                      // 1011
module.exports = function rpad(str, length, padStr) {                                                                 // 1012
  return pad(str, length, padStr, 'right');                                                                           // 1013
};                                                                                                                    // 1014
                                                                                                                      // 1015
},{"./pad":39}],47:[function(require,module,exports){                                                                 // 1016
var makeString = require('./helper/makeString');                                                                      // 1017
var defaultToWhiteSpace = require('./helper/defaultToWhiteSpace');                                                    // 1018
var nativeTrimRight = String.prototype.trimRight;                                                                     // 1019
                                                                                                                      // 1020
module.exports = function rtrim(str, characters) {                                                                    // 1021
  str = makeString(str);                                                                                              // 1022
  if (!characters && nativeTrimRight) return nativeTrimRight.call(str);                                               // 1023
  characters = defaultToWhiteSpace(characters);                                                                       // 1024
  return str.replace(new RegExp(characters + '+$'), '');                                                              // 1025
};                                                                                                                    // 1026
                                                                                                                      // 1027
},{"./helper/defaultToWhiteSpace":16,"./helper/makeString":20}],48:[function(require,module,exports){                 // 1028
var trim = require('./trim');                                                                                         // 1029
var dasherize = require('./dasherize');                                                                               // 1030
var cleanDiacritics = require('./cleanDiacritics');                                                                   // 1031
                                                                                                                      // 1032
module.exports = function slugify(str) {                                                                              // 1033
  return trim(dasherize(cleanDiacritics(str).replace(/[^\w\s-]/g, '-').toLowerCase()), '-');                          // 1034
};                                                                                                                    // 1035
                                                                                                                      // 1036
},{"./cleanDiacritics":7,"./dasherize":9,"./trim":65}],49:[function(require,module,exports){                          // 1037
var chars = require('./chars');                                                                                       // 1038
                                                                                                                      // 1039
module.exports = function splice(str, i, howmany, substr) {                                                           // 1040
  var arr = chars(str);                                                                                               // 1041
  arr.splice(~~i, ~~howmany, substr);                                                                                 // 1042
  return arr.join('');                                                                                                // 1043
};                                                                                                                    // 1044
                                                                                                                      // 1045
},{"./chars":3}],50:[function(require,module,exports){                                                                // 1046
var deprecate = require('util-deprecate');                                                                            // 1047
                                                                                                                      // 1048
module.exports = deprecate(require('sprintf-js').sprintf,                                                             // 1049
  'sprintf() will be removed in the next major release, use the sprintf-js package instead.');                        // 1050
                                                                                                                      // 1051
},{"sprintf-js":36,"util-deprecate":37}],51:[function(require,module,exports){                                        // 1052
var makeString = require('./helper/makeString');                                                                      // 1053
var toPositive = require('./helper/toPositive');                                                                      // 1054
                                                                                                                      // 1055
module.exports = function startsWith(str, starts, position) {                                                         // 1056
  str = makeString(str);                                                                                              // 1057
  starts = '' + starts;                                                                                               // 1058
  position = position == null ? 0 : Math.min(toPositive(position), str.length);                                       // 1059
  return str.lastIndexOf(starts, position) === position;                                                              // 1060
};                                                                                                                    // 1061
                                                                                                                      // 1062
},{"./helper/makeString":20,"./helper/toPositive":22}],52:[function(require,module,exports){                          // 1063
var makeString = require('./helper/makeString');                                                                      // 1064
                                                                                                                      // 1065
module.exports = function strLeft(str, sep) {                                                                         // 1066
  str = makeString(str);                                                                                              // 1067
  sep = makeString(sep);                                                                                              // 1068
  var pos = !sep ? -1 : str.indexOf(sep);                                                                             // 1069
  return~ pos ? str.slice(0, pos) : str;                                                                              // 1070
};                                                                                                                    // 1071
                                                                                                                      // 1072
},{"./helper/makeString":20}],53:[function(require,module,exports){                                                   // 1073
var makeString = require('./helper/makeString');                                                                      // 1074
                                                                                                                      // 1075
module.exports = function strLeftBack(str, sep) {                                                                     // 1076
  str = makeString(str);                                                                                              // 1077
  sep = makeString(sep);                                                                                              // 1078
  var pos = str.lastIndexOf(sep);                                                                                     // 1079
  return~ pos ? str.slice(0, pos) : str;                                                                              // 1080
};                                                                                                                    // 1081
                                                                                                                      // 1082
},{"./helper/makeString":20}],54:[function(require,module,exports){                                                   // 1083
var makeString = require('./helper/makeString');                                                                      // 1084
                                                                                                                      // 1085
module.exports = function strRight(str, sep) {                                                                        // 1086
  str = makeString(str);                                                                                              // 1087
  sep = makeString(sep);                                                                                              // 1088
  var pos = !sep ? -1 : str.indexOf(sep);                                                                             // 1089
  return~ pos ? str.slice(pos + sep.length, str.length) : str;                                                        // 1090
};                                                                                                                    // 1091
                                                                                                                      // 1092
},{"./helper/makeString":20}],55:[function(require,module,exports){                                                   // 1093
var makeString = require('./helper/makeString');                                                                      // 1094
                                                                                                                      // 1095
module.exports = function strRightBack(str, sep) {                                                                    // 1096
  str = makeString(str);                                                                                              // 1097
  sep = makeString(sep);                                                                                              // 1098
  var pos = !sep ? -1 : str.lastIndexOf(sep);                                                                         // 1099
  return~ pos ? str.slice(pos + sep.length, str.length) : str;                                                        // 1100
};                                                                                                                    // 1101
                                                                                                                      // 1102
},{"./helper/makeString":20}],56:[function(require,module,exports){                                                   // 1103
var makeString = require('./helper/makeString');                                                                      // 1104
                                                                                                                      // 1105
module.exports = function stripTags(str) {                                                                            // 1106
  return makeString(str).replace(/<\/?[^>]+>/g, '');                                                                  // 1107
};                                                                                                                    // 1108
                                                                                                                      // 1109
},{"./helper/makeString":20}],57:[function(require,module,exports){                                                   // 1110
var adjacent = require('./helper/adjacent');                                                                          // 1111
                                                                                                                      // 1112
module.exports = function succ(str) {                                                                                 // 1113
  return adjacent(str, 1);                                                                                            // 1114
};                                                                                                                    // 1115
                                                                                                                      // 1116
},{"./helper/adjacent":15}],58:[function(require,module,exports){                                                     // 1117
module.exports = function surround(str, wrapper) {                                                                    // 1118
  return [wrapper, str, wrapper].join('');                                                                            // 1119
};                                                                                                                    // 1120
                                                                                                                      // 1121
},{}],59:[function(require,module,exports){                                                                           // 1122
var makeString = require('./helper/makeString');                                                                      // 1123
                                                                                                                      // 1124
module.exports = function swapCase(str) {                                                                             // 1125
  return makeString(str).replace(/\S/g, function(c) {                                                                 // 1126
    return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();                                                 // 1127
  });                                                                                                                 // 1128
};                                                                                                                    // 1129
                                                                                                                      // 1130
},{"./helper/makeString":20}],60:[function(require,module,exports){                                                   // 1131
var makeString = require('./helper/makeString');                                                                      // 1132
                                                                                                                      // 1133
module.exports = function titleize(str) {                                                                             // 1134
  return makeString(str).toLowerCase().replace(/(?:^|\s|-)\S/g, function(c) {                                         // 1135
    return c.toUpperCase();                                                                                           // 1136
  });                                                                                                                 // 1137
};                                                                                                                    // 1138
                                                                                                                      // 1139
},{"./helper/makeString":20}],61:[function(require,module,exports){                                                   // 1140
var trim = require('./trim');                                                                                         // 1141
                                                                                                                      // 1142
function boolMatch(s, matchers) {                                                                                     // 1143
  var i, matcher, down = s.toLowerCase();                                                                             // 1144
  matchers = [].concat(matchers);                                                                                     // 1145
  for (i = 0; i < matchers.length; i += 1) {                                                                          // 1146
    matcher = matchers[i];                                                                                            // 1147
    if (!matcher) continue;                                                                                           // 1148
    if (matcher.test && matcher.test(s)) return true;                                                                 // 1149
    if (matcher.toLowerCase() === down) return true;                                                                  // 1150
  }                                                                                                                   // 1151
}                                                                                                                     // 1152
                                                                                                                      // 1153
module.exports = function toBoolean(str, trueValues, falseValues) {                                                   // 1154
  if (typeof str === 'number') str = '' + str;                                                                        // 1155
  if (typeof str !== 'string') return !!str;                                                                          // 1156
  str = trim(str);                                                                                                    // 1157
  if (boolMatch(str, trueValues || ['true', '1'])) return true;                                                       // 1158
  if (boolMatch(str, falseValues || ['false', '0'])) return false;                                                    // 1159
};                                                                                                                    // 1160
                                                                                                                      // 1161
},{"./trim":65}],62:[function(require,module,exports){                                                                // 1162
module.exports = function toNumber(num, precision) {                                                                  // 1163
  if (num == null) return 0;                                                                                          // 1164
  var factor = Math.pow(10, isFinite(precision) ? precision : 0);                                                     // 1165
  return Math.round(num * factor) / factor;                                                                           // 1166
};                                                                                                                    // 1167
                                                                                                                      // 1168
},{}],63:[function(require,module,exports){                                                                           // 1169
var rtrim = require('./rtrim');                                                                                       // 1170
                                                                                                                      // 1171
module.exports = function toSentence(array, separator, lastSeparator, serial) {                                       // 1172
  separator = separator || ', ';                                                                                      // 1173
  lastSeparator = lastSeparator || ' and ';                                                                           // 1174
  var a = array.slice(),                                                                                              // 1175
    lastMember = a.pop();                                                                                             // 1176
                                                                                                                      // 1177
  if (array.length > 2 && serial) lastSeparator = rtrim(separator) + lastSeparator;                                   // 1178
                                                                                                                      // 1179
  return a.length ? a.join(separator) + lastSeparator + lastMember : lastMember;                                      // 1180
};                                                                                                                    // 1181
                                                                                                                      // 1182
},{"./rtrim":47}],64:[function(require,module,exports){                                                               // 1183
var toSentence = require('./toSentence');                                                                             // 1184
                                                                                                                      // 1185
module.exports = function toSentenceSerial(array, sep, lastSep) {                                                     // 1186
  return toSentence(array, sep, lastSep, true);                                                                       // 1187
};                                                                                                                    // 1188
                                                                                                                      // 1189
},{"./toSentence":63}],65:[function(require,module,exports){                                                          // 1190
var makeString = require('./helper/makeString');                                                                      // 1191
var defaultToWhiteSpace = require('./helper/defaultToWhiteSpace');                                                    // 1192
var nativeTrim = String.prototype.trim;                                                                               // 1193
                                                                                                                      // 1194
module.exports = function trim(str, characters) {                                                                     // 1195
  str = makeString(str);                                                                                              // 1196
  if (!characters && nativeTrim) return nativeTrim.call(str);                                                         // 1197
  characters = defaultToWhiteSpace(characters);                                                                       // 1198
  return str.replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');                               // 1199
};                                                                                                                    // 1200
                                                                                                                      // 1201
},{"./helper/defaultToWhiteSpace":16,"./helper/makeString":20}],66:[function(require,module,exports){                 // 1202
var makeString = require('./helper/makeString');                                                                      // 1203
                                                                                                                      // 1204
module.exports = function truncate(str, length, truncateStr) {                                                        // 1205
  str = makeString(str);                                                                                              // 1206
  truncateStr = truncateStr || '...';                                                                                 // 1207
  length = ~~length;                                                                                                  // 1208
  return str.length > length ? str.slice(0, length) + truncateStr : str;                                              // 1209
};                                                                                                                    // 1210
                                                                                                                      // 1211
},{"./helper/makeString":20}],67:[function(require,module,exports){                                                   // 1212
var trim = require('./trim');                                                                                         // 1213
                                                                                                                      // 1214
module.exports = function underscored(str) {                                                                          // 1215
  return trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();                      // 1216
};                                                                                                                    // 1217
                                                                                                                      // 1218
},{"./trim":65}],68:[function(require,module,exports){                                                                // 1219
var makeString = require('./helper/makeString');                                                                      // 1220
var htmlEntities = require('./helper/htmlEntities');                                                                  // 1221
                                                                                                                      // 1222
module.exports = function unescapeHTML(str) {                                                                         // 1223
  return makeString(str).replace(/\&([^;]+);/g, function(entity, entityCode) {                                        // 1224
    var match;                                                                                                        // 1225
                                                                                                                      // 1226
    if (entityCode in htmlEntities) {                                                                                 // 1227
      return htmlEntities[entityCode];                                                                                // 1228
    /*eslint no-cond-assign: 0*/                                                                                      // 1229
    } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {                                                       // 1230
      return String.fromCharCode(parseInt(match[1], 16));                                                             // 1231
    /*eslint no-cond-assign: 0*/                                                                                      // 1232
    } else if (match = entityCode.match(/^#(\d+)$/)) {                                                                // 1233
      return String.fromCharCode(~~match[1]);                                                                         // 1234
    } else {                                                                                                          // 1235
      return entity;                                                                                                  // 1236
    }                                                                                                                 // 1237
  });                                                                                                                 // 1238
};                                                                                                                    // 1239
                                                                                                                      // 1240
},{"./helper/htmlEntities":19,"./helper/makeString":20}],69:[function(require,module,exports){                        // 1241
module.exports = function unquote(str, quoteChar) {                                                                   // 1242
  quoteChar = quoteChar || '"';                                                                                       // 1243
  if (str[0] === quoteChar && str[str.length - 1] === quoteChar)                                                      // 1244
    return str.slice(1, str.length - 1);                                                                              // 1245
  else return str;                                                                                                    // 1246
};                                                                                                                    // 1247
                                                                                                                      // 1248
},{}],70:[function(require,module,exports){                                                                           // 1249
var deprecate = require('util-deprecate');                                                                            // 1250
                                                                                                                      // 1251
module.exports = deprecate(require('sprintf-js').vsprintf,                                                            // 1252
  'vsprintf() will be removed in the next major release, use the sprintf-js package instead.');                       // 1253
                                                                                                                      // 1254
},{"sprintf-js":36,"util-deprecate":37}],71:[function(require,module,exports){                                        // 1255
var isBlank = require('./isBlank');                                                                                   // 1256
var trim = require('./trim');                                                                                         // 1257
                                                                                                                      // 1258
module.exports = function words(str, delimiter) {                                                                     // 1259
  if (isBlank(str)) return [];                                                                                        // 1260
  return trim(str, delimiter).split(delimiter || /\s+/);                                                              // 1261
};                                                                                                                    // 1262
                                                                                                                      // 1263
},{"./isBlank":27,"./trim":65}],72:[function(require,module,exports){                                                 // 1264
// Wrap                                                                                                               // 1265
// wraps a string by a certain width                                                                                  // 1266
                                                                                                                      // 1267
var makeString = require('./helper/makeString');                                                                      // 1268
                                                                                                                      // 1269
module.exports = function wrap(str, options){                                                                         // 1270
  str = makeString(str);                                                                                              // 1271
                                                                                                                      // 1272
  options = options || {};                                                                                            // 1273
                                                                                                                      // 1274
  var width = options.width || 75;                                                                                    // 1275
  var seperator = options.seperator || '\n';                                                                          // 1276
  var cut = options.cut || false;                                                                                     // 1277
  var preserveSpaces = options.preserveSpaces || false;                                                               // 1278
  var trailingSpaces = options.trailingSpaces || false;                                                               // 1279
                                                                                                                      // 1280
  var result;                                                                                                         // 1281
                                                                                                                      // 1282
  if(width <= 0){                                                                                                     // 1283
    return str;                                                                                                       // 1284
  }                                                                                                                   // 1285
                                                                                                                      // 1286
  else if(!cut){                                                                                                      // 1287
                                                                                                                      // 1288
    var words = str.split(' ');                                                                                       // 1289
    var current_column = 0;                                                                                           // 1290
    result = '';                                                                                                      // 1291
                                                                                                                      // 1292
    while(words.length > 0){                                                                                          // 1293
                                                                                                                      // 1294
      // if adding a space and the next word would cause this line to be longer than width...                         // 1295
      if(1 + words[0].length + current_column > width){                                                               // 1296
        //start a new line if this line is not already empty                                                          // 1297
        if(current_column > 0){                                                                                       // 1298
          // add a space at the end of the line is preserveSpaces is true                                             // 1299
          if (preserveSpaces){                                                                                        // 1300
            result += ' ';                                                                                            // 1301
            current_column++;                                                                                         // 1302
          }                                                                                                           // 1303
          // fill the rest of the line with spaces if trailingSpaces option is true                                   // 1304
          else if(trailingSpaces){                                                                                    // 1305
            while(current_column < width){                                                                            // 1306
              result += ' ';                                                                                          // 1307
              current_column++;                                                                                       // 1308
            }                                                                                                         // 1309
          }                                                                                                           // 1310
          //start new line                                                                                            // 1311
          result += seperator;                                                                                        // 1312
          current_column = 0;                                                                                         // 1313
        }                                                                                                             // 1314
      }                                                                                                               // 1315
                                                                                                                      // 1316
      // if not at the begining of the line, add a space in front of the word                                         // 1317
      if(current_column > 0){                                                                                         // 1318
        result += ' ';                                                                                                // 1319
        current_column++;                                                                                             // 1320
      }                                                                                                               // 1321
                                                                                                                      // 1322
      // tack on the next word, update current column, a pop words array                                              // 1323
      result += words[0];                                                                                             // 1324
      current_column += words[0].length;                                                                              // 1325
      words.shift();                                                                                                  // 1326
                                                                                                                      // 1327
    }                                                                                                                 // 1328
                                                                                                                      // 1329
    // fill the rest of the line with spaces if trailingSpaces option is true                                         // 1330
    if(trailingSpaces){                                                                                               // 1331
      while(current_column < width){                                                                                  // 1332
        result += ' ';                                                                                                // 1333
        current_column++;                                                                                             // 1334
      }                                                                                                               // 1335
    }                                                                                                                 // 1336
                                                                                                                      // 1337
    return result;                                                                                                    // 1338
                                                                                                                      // 1339
  }                                                                                                                   // 1340
                                                                                                                      // 1341
  else {                                                                                                              // 1342
                                                                                                                      // 1343
    var index = 0;                                                                                                    // 1344
    result = '';                                                                                                      // 1345
                                                                                                                      // 1346
    // walk through each character and add seperators where appropriate                                               // 1347
    while(index < str.length){                                                                                        // 1348
      if(index % width == 0 && index > 0){                                                                            // 1349
        result += seperator;                                                                                          // 1350
      }                                                                                                               // 1351
      result += str.charAt(index);                                                                                    // 1352
      index++;                                                                                                        // 1353
    }                                                                                                                 // 1354
                                                                                                                      // 1355
    // fill the rest of the line with spaces if trailingSpaces option is true                                         // 1356
    if(trailingSpaces){                                                                                               // 1357
      while(index % width > 0){                                                                                       // 1358
        result += ' ';                                                                                                // 1359
        index++;                                                                                                      // 1360
      }                                                                                                               // 1361
    }                                                                                                                 // 1362
                                                                                                                      // 1363
    return result;                                                                                                    // 1364
  }                                                                                                                   // 1365
};                                                                                                                    // 1366
                                                                                                                      // 1367
},{"./helper/makeString":20}]},{},[25])(25)                                                                           // 1368
});                                                                                                                   // 1369
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/underscorestring_underscore.string/meteor-post.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// s will be picked up by Meteor and exported                                                                         // 1
s = module.exports;                                                                                                   // 2
                                                                                                                      // 3
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['underscorestring:underscore.string'] = {
  s: s
};

})();

//# sourceMappingURL=underscorestring_underscore.string.js.map
