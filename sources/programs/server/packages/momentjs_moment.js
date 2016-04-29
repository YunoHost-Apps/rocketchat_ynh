(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var moment;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/momentjs_moment/moment.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//! moment.js                                                                                                         // 1
//! version : 2.12.0                                                                                                  // 2
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors                                                        // 3
//! license : MIT                                                                                                     // 4
//! momentjs.com                                                                                                      // 5
                                                                                                                      // 6
;(function (global, factory) {                                                                                        // 7
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :                       // 8
    typeof define === 'function' && define.amd ? define(factory) :                                                    // 9
    global.moment = factory()                                                                                         // 10
}(this, function () { 'use strict';                                                                                   // 11
                                                                                                                      // 12
    var hookCallback;                                                                                                 // 13
                                                                                                                      // 14
    function utils_hooks__hooks () {                                                                                  // 15
        return hookCallback.apply(null, arguments);                                                                   // 16
    }                                                                                                                 // 17
                                                                                                                      // 18
    // This is done to register the method called with moment()                                                       // 19
    // without creating circular dependencies.                                                                        // 20
    function setHookCallback (callback) {                                                                             // 21
        hookCallback = callback;                                                                                      // 22
    }                                                                                                                 // 23
                                                                                                                      // 24
    function isArray(input) {                                                                                         // 25
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';                  // 26
    }                                                                                                                 // 27
                                                                                                                      // 28
    function isDate(input) {                                                                                          // 29
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';                    // 30
    }                                                                                                                 // 31
                                                                                                                      // 32
    function map(arr, fn) {                                                                                           // 33
        var res = [], i;                                                                                              // 34
        for (i = 0; i < arr.length; ++i) {                                                                            // 35
            res.push(fn(arr[i], i));                                                                                  // 36
        }                                                                                                             // 37
        return res;                                                                                                   // 38
    }                                                                                                                 // 39
                                                                                                                      // 40
    function hasOwnProp(a, b) {                                                                                       // 41
        return Object.prototype.hasOwnProperty.call(a, b);                                                            // 42
    }                                                                                                                 // 43
                                                                                                                      // 44
    function extend(a, b) {                                                                                           // 45
        for (var i in b) {                                                                                            // 46
            if (hasOwnProp(b, i)) {                                                                                   // 47
                a[i] = b[i];                                                                                          // 48
            }                                                                                                         // 49
        }                                                                                                             // 50
                                                                                                                      // 51
        if (hasOwnProp(b, 'toString')) {                                                                              // 52
            a.toString = b.toString;                                                                                  // 53
        }                                                                                                             // 54
                                                                                                                      // 55
        if (hasOwnProp(b, 'valueOf')) {                                                                               // 56
            a.valueOf = b.valueOf;                                                                                    // 57
        }                                                                                                             // 58
                                                                                                                      // 59
        return a;                                                                                                     // 60
    }                                                                                                                 // 61
                                                                                                                      // 62
    function create_utc__createUTC (input, format, locale, strict) {                                                  // 63
        return createLocalOrUTC(input, format, locale, strict, true).utc();                                           // 64
    }                                                                                                                 // 65
                                                                                                                      // 66
    function defaultParsingFlags() {                                                                                  // 67
        // We need to deep clone this object.                                                                         // 68
        return {                                                                                                      // 69
            empty           : false,                                                                                  // 70
            unusedTokens    : [],                                                                                     // 71
            unusedInput     : [],                                                                                     // 72
            overflow        : -2,                                                                                     // 73
            charsLeftOver   : 0,                                                                                      // 74
            nullInput       : false,                                                                                  // 75
            invalidMonth    : null,                                                                                   // 76
            invalidFormat   : false,                                                                                  // 77
            userInvalidated : false,                                                                                  // 78
            iso             : false                                                                                   // 79
        };                                                                                                            // 80
    }                                                                                                                 // 81
                                                                                                                      // 82
    function getParsingFlags(m) {                                                                                     // 83
        if (m._pf == null) {                                                                                          // 84
            m._pf = defaultParsingFlags();                                                                            // 85
        }                                                                                                             // 86
        return m._pf;                                                                                                 // 87
    }                                                                                                                 // 88
                                                                                                                      // 89
    function valid__isValid(m) {                                                                                      // 90
        if (m._isValid == null) {                                                                                     // 91
            var flags = getParsingFlags(m);                                                                           // 92
            m._isValid = !isNaN(m._d.getTime()) &&                                                                    // 93
                flags.overflow < 0 &&                                                                                 // 94
                !flags.empty &&                                                                                       // 95
                !flags.invalidMonth &&                                                                                // 96
                !flags.invalidWeekday &&                                                                              // 97
                !flags.nullInput &&                                                                                   // 98
                !flags.invalidFormat &&                                                                               // 99
                !flags.userInvalidated;                                                                               // 100
                                                                                                                      // 101
            if (m._strict) {                                                                                          // 102
                m._isValid = m._isValid &&                                                                            // 103
                    flags.charsLeftOver === 0 &&                                                                      // 104
                    flags.unusedTokens.length === 0 &&                                                                // 105
                    flags.bigHour === undefined;                                                                      // 106
            }                                                                                                         // 107
        }                                                                                                             // 108
        return m._isValid;                                                                                            // 109
    }                                                                                                                 // 110
                                                                                                                      // 111
    function valid__createInvalid (flags) {                                                                           // 112
        var m = create_utc__createUTC(NaN);                                                                           // 113
        if (flags != null) {                                                                                          // 114
            extend(getParsingFlags(m), flags);                                                                        // 115
        }                                                                                                             // 116
        else {                                                                                                        // 117
            getParsingFlags(m).userInvalidated = true;                                                                // 118
        }                                                                                                             // 119
                                                                                                                      // 120
        return m;                                                                                                     // 121
    }                                                                                                                 // 122
                                                                                                                      // 123
    function isUndefined(input) {                                                                                     // 124
        return input === void 0;                                                                                      // 125
    }                                                                                                                 // 126
                                                                                                                      // 127
    // Plugins that add properties should also add the key here (null value),                                         // 128
    // so we can properly clone ourselves.                                                                            // 129
    var momentProperties = utils_hooks__hooks.momentProperties = [];                                                  // 130
                                                                                                                      // 131
    function copyConfig(to, from) {                                                                                   // 132
        var i, prop, val;                                                                                             // 133
                                                                                                                      // 134
        if (!isUndefined(from._isAMomentObject)) {                                                                    // 135
            to._isAMomentObject = from._isAMomentObject;                                                              // 136
        }                                                                                                             // 137
        if (!isUndefined(from._i)) {                                                                                  // 138
            to._i = from._i;                                                                                          // 139
        }                                                                                                             // 140
        if (!isUndefined(from._f)) {                                                                                  // 141
            to._f = from._f;                                                                                          // 142
        }                                                                                                             // 143
        if (!isUndefined(from._l)) {                                                                                  // 144
            to._l = from._l;                                                                                          // 145
        }                                                                                                             // 146
        if (!isUndefined(from._strict)) {                                                                             // 147
            to._strict = from._strict;                                                                                // 148
        }                                                                                                             // 149
        if (!isUndefined(from._tzm)) {                                                                                // 150
            to._tzm = from._tzm;                                                                                      // 151
        }                                                                                                             // 152
        if (!isUndefined(from._isUTC)) {                                                                              // 153
            to._isUTC = from._isUTC;                                                                                  // 154
        }                                                                                                             // 155
        if (!isUndefined(from._offset)) {                                                                             // 156
            to._offset = from._offset;                                                                                // 157
        }                                                                                                             // 158
        if (!isUndefined(from._pf)) {                                                                                 // 159
            to._pf = getParsingFlags(from);                                                                           // 160
        }                                                                                                             // 161
        if (!isUndefined(from._locale)) {                                                                             // 162
            to._locale = from._locale;                                                                                // 163
        }                                                                                                             // 164
                                                                                                                      // 165
        if (momentProperties.length > 0) {                                                                            // 166
            for (i in momentProperties) {                                                                             // 167
                prop = momentProperties[i];                                                                           // 168
                val = from[prop];                                                                                     // 169
                if (!isUndefined(val)) {                                                                              // 170
                    to[prop] = val;                                                                                   // 171
                }                                                                                                     // 172
            }                                                                                                         // 173
        }                                                                                                             // 174
                                                                                                                      // 175
        return to;                                                                                                    // 176
    }                                                                                                                 // 177
                                                                                                                      // 178
    var updateInProgress = false;                                                                                     // 179
                                                                                                                      // 180
    // Moment prototype object                                                                                        // 181
    function Moment(config) {                                                                                         // 182
        copyConfig(this, config);                                                                                     // 183
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);                                            // 184
        // Prevent infinite loop in case updateOffset creates new moment                                              // 185
        // objects.                                                                                                   // 186
        if (updateInProgress === false) {                                                                             // 187
            updateInProgress = true;                                                                                  // 188
            utils_hooks__hooks.updateOffset(this);                                                                    // 189
            updateInProgress = false;                                                                                 // 190
        }                                                                                                             // 191
    }                                                                                                                 // 192
                                                                                                                      // 193
    function isMoment (obj) {                                                                                         // 194
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);                                // 195
    }                                                                                                                 // 196
                                                                                                                      // 197
    function absFloor (number) {                                                                                      // 198
        if (number < 0) {                                                                                             // 199
            return Math.ceil(number);                                                                                 // 200
        } else {                                                                                                      // 201
            return Math.floor(number);                                                                                // 202
        }                                                                                                             // 203
    }                                                                                                                 // 204
                                                                                                                      // 205
    function toInt(argumentForCoercion) {                                                                             // 206
        var coercedNumber = +argumentForCoercion,                                                                     // 207
            value = 0;                                                                                                // 208
                                                                                                                      // 209
        if (coercedNumber !== 0 && isFinite(coercedNumber)) {                                                         // 210
            value = absFloor(coercedNumber);                                                                          // 211
        }                                                                                                             // 212
                                                                                                                      // 213
        return value;                                                                                                 // 214
    }                                                                                                                 // 215
                                                                                                                      // 216
    // compare two arrays, return the number of differences                                                           // 217
    function compareArrays(array1, array2, dontConvert) {                                                             // 218
        var len = Math.min(array1.length, array2.length),                                                             // 219
            lengthDiff = Math.abs(array1.length - array2.length),                                                     // 220
            diffs = 0,                                                                                                // 221
            i;                                                                                                        // 222
        for (i = 0; i < len; i++) {                                                                                   // 223
            if ((dontConvert && array1[i] !== array2[i]) ||                                                           // 224
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {                                            // 225
                diffs++;                                                                                              // 226
            }                                                                                                         // 227
        }                                                                                                             // 228
        return diffs + lengthDiff;                                                                                    // 229
    }                                                                                                                 // 230
                                                                                                                      // 231
    function warn(msg) {                                                                                              // 232
        if (utils_hooks__hooks.suppressDeprecationWarnings === false &&                                               // 233
                (typeof console !==  'undefined') && console.warn) {                                                  // 234
            console.warn('Deprecation warning: ' + msg);                                                              // 235
        }                                                                                                             // 236
    }                                                                                                                 // 237
                                                                                                                      // 238
    function deprecate(msg, fn) {                                                                                     // 239
        var firstTime = true;                                                                                         // 240
                                                                                                                      // 241
        return extend(function () {                                                                                   // 242
            if (firstTime) {                                                                                          // 243
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(arguments).join(', ') + '\n' + (new Error()).stack);
                firstTime = false;                                                                                    // 245
            }                                                                                                         // 246
            return fn.apply(this, arguments);                                                                         // 247
        }, fn);                                                                                                       // 248
    }                                                                                                                 // 249
                                                                                                                      // 250
    var deprecations = {};                                                                                            // 251
                                                                                                                      // 252
    function deprecateSimple(name, msg) {                                                                             // 253
        if (!deprecations[name]) {                                                                                    // 254
            warn(msg);                                                                                                // 255
            deprecations[name] = true;                                                                                // 256
        }                                                                                                             // 257
    }                                                                                                                 // 258
                                                                                                                      // 259
    utils_hooks__hooks.suppressDeprecationWarnings = false;                                                           // 260
                                                                                                                      // 261
    function isFunction(input) {                                                                                      // 262
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';            // 263
    }                                                                                                                 // 264
                                                                                                                      // 265
    function isObject(input) {                                                                                        // 266
        return Object.prototype.toString.call(input) === '[object Object]';                                           // 267
    }                                                                                                                 // 268
                                                                                                                      // 269
    function locale_set__set (config) {                                                                               // 270
        var prop, i;                                                                                                  // 271
        for (i in config) {                                                                                           // 272
            prop = config[i];                                                                                         // 273
            if (isFunction(prop)) {                                                                                   // 274
                this[i] = prop;                                                                                       // 275
            } else {                                                                                                  // 276
                this['_' + i] = prop;                                                                                 // 277
            }                                                                                                         // 278
        }                                                                                                             // 279
        this._config = config;                                                                                        // 280
        // Lenient ordinal parsing accepts just a number in addition to                                               // 281
        // number + (possibly) stuff coming from _ordinalParseLenient.                                                // 282
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);                 // 283
    }                                                                                                                 // 284
                                                                                                                      // 285
    function mergeConfigs(parentConfig, childConfig) {                                                                // 286
        var res = extend({}, parentConfig), prop;                                                                     // 287
        for (prop in childConfig) {                                                                                   // 288
            if (hasOwnProp(childConfig, prop)) {                                                                      // 289
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {                                    // 290
                    res[prop] = {};                                                                                   // 291
                    extend(res[prop], parentConfig[prop]);                                                            // 292
                    extend(res[prop], childConfig[prop]);                                                             // 293
                } else if (childConfig[prop] != null) {                                                               // 294
                    res[prop] = childConfig[prop];                                                                    // 295
                } else {                                                                                              // 296
                    delete res[prop];                                                                                 // 297
                }                                                                                                     // 298
            }                                                                                                         // 299
        }                                                                                                             // 300
        return res;                                                                                                   // 301
    }                                                                                                                 // 302
                                                                                                                      // 303
    function Locale(config) {                                                                                         // 304
        if (config != null) {                                                                                         // 305
            this.set(config);                                                                                         // 306
        }                                                                                                             // 307
    }                                                                                                                 // 308
                                                                                                                      // 309
    // internal storage for locale config files                                                                       // 310
    var locales = {};                                                                                                 // 311
    var globalLocale;                                                                                                 // 312
                                                                                                                      // 313
    function normalizeLocale(key) {                                                                                   // 314
        return key ? key.toLowerCase().replace('_', '-') : key;                                                       // 315
    }                                                                                                                 // 316
                                                                                                                      // 317
    // pick the locale from the array                                                                                 // 318
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each                      // 319
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {                                                                                    // 321
        var i = 0, j, next, locale, split;                                                                            // 322
                                                                                                                      // 323
        while (i < names.length) {                                                                                    // 324
            split = normalizeLocale(names[i]).split('-');                                                             // 325
            j = split.length;                                                                                         // 326
            next = normalizeLocale(names[i + 1]);                                                                     // 327
            next = next ? next.split('-') : null;                                                                     // 328
            while (j > 0) {                                                                                           // 329
                locale = loadLocale(split.slice(0, j).join('-'));                                                     // 330
                if (locale) {                                                                                         // 331
                    return locale;                                                                                    // 332
                }                                                                                                     // 333
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {                          // 334
                    //the next array item is better than a shallower substring of this one                            // 335
                    break;                                                                                            // 336
                }                                                                                                     // 337
                j--;                                                                                                  // 338
            }                                                                                                         // 339
            i++;                                                                                                      // 340
        }                                                                                                             // 341
        return null;                                                                                                  // 342
    }                                                                                                                 // 343
                                                                                                                      // 344
    function loadLocale(name) {                                                                                       // 345
        var oldLocale = null;                                                                                         // 346
        // TODO: Find a better way to register and load all the locales in Node                                       // 347
        if (!locales[name] && (typeof module !== 'undefined') &&                                                      // 348
                module && module.exports) {                                                                           // 349
            try {                                                                                                     // 350
                oldLocale = globalLocale._abbr;                                                                       // 351
                require('./locale/' + name);                                                                          // 352
                // because defineLocale currently also sets the global locale, we                                     // 353
                // want to undo that for lazy loaded locales                                                          // 354
                locale_locales__getSetGlobalLocale(oldLocale);                                                        // 355
            } catch (e) { }                                                                                           // 356
        }                                                                                                             // 357
        return locales[name];                                                                                         // 358
    }                                                                                                                 // 359
                                                                                                                      // 360
    // This function will load locale and then set the global locale.  If                                             // 361
    // no arguments are passed in, it will simply return the current global                                           // 362
    // locale key.                                                                                                    // 363
    function locale_locales__getSetGlobalLocale (key, values) {                                                       // 364
        var data;                                                                                                     // 365
        if (key) {                                                                                                    // 366
            if (isUndefined(values)) {                                                                                // 367
                data = locale_locales__getLocale(key);                                                                // 368
            }                                                                                                         // 369
            else {                                                                                                    // 370
                data = defineLocale(key, values);                                                                     // 371
            }                                                                                                         // 372
                                                                                                                      // 373
            if (data) {                                                                                               // 374
                // moment.duration._locale = moment._locale = data;                                                   // 375
                globalLocale = data;                                                                                  // 376
            }                                                                                                         // 377
        }                                                                                                             // 378
                                                                                                                      // 379
        return globalLocale._abbr;                                                                                    // 380
    }                                                                                                                 // 381
                                                                                                                      // 382
    function defineLocale (name, config) {                                                                            // 383
        if (config !== null) {                                                                                        // 384
            config.abbr = name;                                                                                       // 385
            if (locales[name] != null) {                                                                              // 386
                deprecateSimple('defineLocaleOverride',                                                               // 387
                        'use moment.updateLocale(localeName, config) to change ' +                                    // 388
                        'an existing locale. moment.defineLocale(localeName, ' +                                      // 389
                        'config) should only be used for creating a new locale');                                     // 390
                config = mergeConfigs(locales[name]._config, config);                                                 // 391
            } else if (config.parentLocale != null) {                                                                 // 392
                if (locales[config.parentLocale] != null) {                                                           // 393
                    config = mergeConfigs(locales[config.parentLocale]._config, config);                              // 394
                } else {                                                                                              // 395
                    // treat as if there is no base config                                                            // 396
                    deprecateSimple('parentLocaleUndefined',                                                          // 397
                            'specified parentLocale is not defined yet');                                             // 398
                }                                                                                                     // 399
            }                                                                                                         // 400
            locales[name] = new Locale(config);                                                                       // 401
                                                                                                                      // 402
            // backwards compat for now: also set the locale                                                          // 403
            locale_locales__getSetGlobalLocale(name);                                                                 // 404
                                                                                                                      // 405
            return locales[name];                                                                                     // 406
        } else {                                                                                                      // 407
            // useful for testing                                                                                     // 408
            delete locales[name];                                                                                     // 409
            return null;                                                                                              // 410
        }                                                                                                             // 411
    }                                                                                                                 // 412
                                                                                                                      // 413
    function updateLocale(name, config) {                                                                             // 414
        if (config != null) {                                                                                         // 415
            var locale;                                                                                               // 416
            if (locales[name] != null) {                                                                              // 417
                config = mergeConfigs(locales[name]._config, config);                                                 // 418
            }                                                                                                         // 419
            locale = new Locale(config);                                                                              // 420
            locale.parentLocale = locales[name];                                                                      // 421
            locales[name] = locale;                                                                                   // 422
                                                                                                                      // 423
            // backwards compat for now: also set the locale                                                          // 424
            locale_locales__getSetGlobalLocale(name);                                                                 // 425
        } else {                                                                                                      // 426
            // pass null for config to unupdate, useful for tests                                                     // 427
            if (locales[name] != null) {                                                                              // 428
                if (locales[name].parentLocale != null) {                                                             // 429
                    locales[name] = locales[name].parentLocale;                                                       // 430
                } else if (locales[name] != null) {                                                                   // 431
                    delete locales[name];                                                                             // 432
                }                                                                                                     // 433
            }                                                                                                         // 434
        }                                                                                                             // 435
        return locales[name];                                                                                         // 436
    }                                                                                                                 // 437
                                                                                                                      // 438
    // returns locale data                                                                                            // 439
    function locale_locales__getLocale (key) {                                                                        // 440
        var locale;                                                                                                   // 441
                                                                                                                      // 442
        if (key && key._locale && key._locale._abbr) {                                                                // 443
            key = key._locale._abbr;                                                                                  // 444
        }                                                                                                             // 445
                                                                                                                      // 446
        if (!key) {                                                                                                   // 447
            return globalLocale;                                                                                      // 448
        }                                                                                                             // 449
                                                                                                                      // 450
        if (!isArray(key)) {                                                                                          // 451
            //short-circuit everything else                                                                           // 452
            locale = loadLocale(key);                                                                                 // 453
            if (locale) {                                                                                             // 454
                return locale;                                                                                        // 455
            }                                                                                                         // 456
            key = [key];                                                                                              // 457
        }                                                                                                             // 458
                                                                                                                      // 459
        return chooseLocale(key);                                                                                     // 460
    }                                                                                                                 // 461
                                                                                                                      // 462
    function locale_locales__listLocales() {                                                                          // 463
        return Object.keys(locales);                                                                                  // 464
    }                                                                                                                 // 465
                                                                                                                      // 466
    var aliases = {};                                                                                                 // 467
                                                                                                                      // 468
    function addUnitAlias (unit, shorthand) {                                                                         // 469
        var lowerCase = unit.toLowerCase();                                                                           // 470
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;                                    // 471
    }                                                                                                                 // 472
                                                                                                                      // 473
    function normalizeUnits(units) {                                                                                  // 474
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;                // 475
    }                                                                                                                 // 476
                                                                                                                      // 477
    function normalizeObjectUnits(inputObject) {                                                                      // 478
        var normalizedInput = {},                                                                                     // 479
            normalizedProp,                                                                                           // 480
            prop;                                                                                                     // 481
                                                                                                                      // 482
        for (prop in inputObject) {                                                                                   // 483
            if (hasOwnProp(inputObject, prop)) {                                                                      // 484
                normalizedProp = normalizeUnits(prop);                                                                // 485
                if (normalizedProp) {                                                                                 // 486
                    normalizedInput[normalizedProp] = inputObject[prop];                                              // 487
                }                                                                                                     // 488
            }                                                                                                         // 489
        }                                                                                                             // 490
                                                                                                                      // 491
        return normalizedInput;                                                                                       // 492
    }                                                                                                                 // 493
                                                                                                                      // 494
    function makeGetSet (unit, keepTime) {                                                                            // 495
        return function (value) {                                                                                     // 496
            if (value != null) {                                                                                      // 497
                get_set__set(this, unit, value);                                                                      // 498
                utils_hooks__hooks.updateOffset(this, keepTime);                                                      // 499
                return this;                                                                                          // 500
            } else {                                                                                                  // 501
                return get_set__get(this, unit);                                                                      // 502
            }                                                                                                         // 503
        };                                                                                                            // 504
    }                                                                                                                 // 505
                                                                                                                      // 506
    function get_set__get (mom, unit) {                                                                               // 507
        return mom.isValid() ?                                                                                        // 508
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;                                                 // 509
    }                                                                                                                 // 510
                                                                                                                      // 511
    function get_set__set (mom, unit, value) {                                                                        // 512
        if (mom.isValid()) {                                                                                          // 513
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);                                                  // 514
        }                                                                                                             // 515
    }                                                                                                                 // 516
                                                                                                                      // 517
    // MOMENTS                                                                                                        // 518
                                                                                                                      // 519
    function getSet (units, value) {                                                                                  // 520
        var unit;                                                                                                     // 521
        if (typeof units === 'object') {                                                                              // 522
            for (unit in units) {                                                                                     // 523
                this.set(unit, units[unit]);                                                                          // 524
            }                                                                                                         // 525
        } else {                                                                                                      // 526
            units = normalizeUnits(units);                                                                            // 527
            if (isFunction(this[units])) {                                                                            // 528
                return this[units](value);                                                                            // 529
            }                                                                                                         // 530
        }                                                                                                             // 531
        return this;                                                                                                  // 532
    }                                                                                                                 // 533
                                                                                                                      // 534
    function zeroFill(number, targetLength, forceSign) {                                                              // 535
        var absNumber = '' + Math.abs(number),                                                                        // 536
            zerosToFill = targetLength - absNumber.length,                                                            // 537
            sign = number >= 0;                                                                                       // 538
        return (sign ? (forceSign ? '+' : '') : '-') +                                                                // 539
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;                                  // 540
    }                                                                                                                 // 541
                                                                                                                      // 542
    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
                                                                                                                      // 544
    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;                                         // 545
                                                                                                                      // 546
    var formatFunctions = {};                                                                                         // 547
                                                                                                                      // 548
    var formatTokenFunctions = {};                                                                                    // 549
                                                                                                                      // 550
    // token:    'M'                                                                                                  // 551
    // padded:   ['MM', 2]                                                                                            // 552
    // ordinal:  'Mo'                                                                                                 // 553
    // callback: function () { this.month() + 1 }                                                                     // 554
    function addFormatToken (token, padded, ordinal, callback) {                                                      // 555
        var func = callback;                                                                                          // 556
        if (typeof callback === 'string') {                                                                           // 557
            func = function () {                                                                                      // 558
                return this[callback]();                                                                              // 559
            };                                                                                                        // 560
        }                                                                                                             // 561
        if (token) {                                                                                                  // 562
            formatTokenFunctions[token] = func;                                                                       // 563
        }                                                                                                             // 564
        if (padded) {                                                                                                 // 565
            formatTokenFunctions[padded[0]] = function () {                                                           // 566
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);                                   // 567
            };                                                                                                        // 568
        }                                                                                                             // 569
        if (ordinal) {                                                                                                // 570
            formatTokenFunctions[ordinal] = function () {                                                             // 571
                return this.localeData().ordinal(func.apply(this, arguments), token);                                 // 572
            };                                                                                                        // 573
        }                                                                                                             // 574
    }                                                                                                                 // 575
                                                                                                                      // 576
    function removeFormattingTokens(input) {                                                                          // 577
        if (input.match(/\[[\s\S]/)) {                                                                                // 578
            return input.replace(/^\[|\]$/g, '');                                                                     // 579
        }                                                                                                             // 580
        return input.replace(/\\/g, '');                                                                              // 581
    }                                                                                                                 // 582
                                                                                                                      // 583
    function makeFormatFunction(format) {                                                                             // 584
        var array = format.match(formattingTokens), i, length;                                                        // 585
                                                                                                                      // 586
        for (i = 0, length = array.length; i < length; i++) {                                                         // 587
            if (formatTokenFunctions[array[i]]) {                                                                     // 588
                array[i] = formatTokenFunctions[array[i]];                                                            // 589
            } else {                                                                                                  // 590
                array[i] = removeFormattingTokens(array[i]);                                                          // 591
            }                                                                                                         // 592
        }                                                                                                             // 593
                                                                                                                      // 594
        return function (mom) {                                                                                       // 595
            var output = '';                                                                                          // 596
            for (i = 0; i < length; i++) {                                                                            // 597
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];                       // 598
            }                                                                                                         // 599
            return output;                                                                                            // 600
        };                                                                                                            // 601
    }                                                                                                                 // 602
                                                                                                                      // 603
    // format date using native date object                                                                           // 604
    function formatMoment(m, format) {                                                                                // 605
        if (!m.isValid()) {                                                                                           // 606
            return m.localeData().invalidDate();                                                                      // 607
        }                                                                                                             // 608
                                                                                                                      // 609
        format = expandFormat(format, m.localeData());                                                                // 610
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);                              // 611
                                                                                                                      // 612
        return formatFunctions[format](m);                                                                            // 613
    }                                                                                                                 // 614
                                                                                                                      // 615
    function expandFormat(format, locale) {                                                                           // 616
        var i = 5;                                                                                                    // 617
                                                                                                                      // 618
        function replaceLongDateFormatTokens(input) {                                                                 // 619
            return locale.longDateFormat(input) || input;                                                             // 620
        }                                                                                                             // 621
                                                                                                                      // 622
        localFormattingTokens.lastIndex = 0;                                                                          // 623
        while (i >= 0 && localFormattingTokens.test(format)) {                                                        // 624
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);                              // 625
            localFormattingTokens.lastIndex = 0;                                                                      // 626
            i -= 1;                                                                                                   // 627
        }                                                                                                             // 628
                                                                                                                      // 629
        return format;                                                                                                // 630
    }                                                                                                                 // 631
                                                                                                                      // 632
    var match1         = /\d/;            //       0 - 9                                                              // 633
    var match2         = /\d\d/;          //      00 - 99                                                             // 634
    var match3         = /\d{3}/;         //     000 - 999                                                            // 635
    var match4         = /\d{4}/;         //    0000 - 9999                                                           // 636
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999                                                         // 637
    var match1to2      = /\d\d?/;         //       0 - 99                                                             // 638
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999                                                           // 639
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999                                                         // 640
    var match1to3      = /\d{1,3}/;       //       0 - 999                                                            // 641
    var match1to4      = /\d{1,4}/;       //       0 - 9999                                                           // 642
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999                                                         // 643
                                                                                                                      // 644
    var matchUnsigned  = /\d+/;           //       0 - inf                                                            // 645
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf                                                            // 646
                                                                                                                      // 647
    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z                                      // 648
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z                       // 649
                                                                                                                      // 650
    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123                                           // 651
                                                                                                                      // 652
    // any word (or two) characters or numbers including two/three word month in arabic.                              // 653
    // includes scottish gaelic two word and hyphenated months                                                        // 654
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
                                                                                                                      // 656
                                                                                                                      // 657
    var regexes = {};                                                                                                 // 658
                                                                                                                      // 659
    function addRegexToken (token, regex, strictRegex) {                                                              // 660
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {                                // 661
            return (isStrict && strictRegex) ? strictRegex : regex;                                                   // 662
        };                                                                                                            // 663
    }                                                                                                                 // 664
                                                                                                                      // 665
    function getParseRegexForToken (token, config) {                                                                  // 666
        if (!hasOwnProp(regexes, token)) {                                                                            // 667
            return new RegExp(unescapeFormat(token));                                                                 // 668
        }                                                                                                             // 669
                                                                                                                      // 670
        return regexes[token](config._strict, config._locale);                                                        // 671
    }                                                                                                                 // 672
                                                                                                                      // 673
    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript           // 674
    function unescapeFormat(s) {                                                                                      // 675
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;                                                                              // 677
        }));                                                                                                          // 678
    }                                                                                                                 // 679
                                                                                                                      // 680
    function regexEscape(s) {                                                                                         // 681
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');                                                           // 682
    }                                                                                                                 // 683
                                                                                                                      // 684
    var tokens = {};                                                                                                  // 685
                                                                                                                      // 686
    function addParseToken (token, callback) {                                                                        // 687
        var i, func = callback;                                                                                       // 688
        if (typeof token === 'string') {                                                                              // 689
            token = [token];                                                                                          // 690
        }                                                                                                             // 691
        if (typeof callback === 'number') {                                                                           // 692
            func = function (input, array) {                                                                          // 693
                array[callback] = toInt(input);                                                                       // 694
            };                                                                                                        // 695
        }                                                                                                             // 696
        for (i = 0; i < token.length; i++) {                                                                          // 697
            tokens[token[i]] = func;                                                                                  // 698
        }                                                                                                             // 699
    }                                                                                                                 // 700
                                                                                                                      // 701
    function addWeekParseToken (token, callback) {                                                                    // 702
        addParseToken(token, function (input, array, config, token) {                                                 // 703
            config._w = config._w || {};                                                                              // 704
            callback(input, config._w, config, token);                                                                // 705
        });                                                                                                           // 706
    }                                                                                                                 // 707
                                                                                                                      // 708
    function addTimeToArrayFromToken(token, input, config) {                                                          // 709
        if (input != null && hasOwnProp(tokens, token)) {                                                             // 710
            tokens[token](input, config._a, config, token);                                                           // 711
        }                                                                                                             // 712
    }                                                                                                                 // 713
                                                                                                                      // 714
    var YEAR = 0;                                                                                                     // 715
    var MONTH = 1;                                                                                                    // 716
    var DATE = 2;                                                                                                     // 717
    var HOUR = 3;                                                                                                     // 718
    var MINUTE = 4;                                                                                                   // 719
    var SECOND = 5;                                                                                                   // 720
    var MILLISECOND = 6;                                                                                              // 721
    var WEEK = 7;                                                                                                     // 722
    var WEEKDAY = 8;                                                                                                  // 723
                                                                                                                      // 724
    function daysInMonth(year, month) {                                                                               // 725
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();                                                   // 726
    }                                                                                                                 // 727
                                                                                                                      // 728
    // FORMATTING                                                                                                     // 729
                                                                                                                      // 730
    addFormatToken('M', ['MM', 2], 'Mo', function () {                                                                // 731
        return this.month() + 1;                                                                                      // 732
    });                                                                                                               // 733
                                                                                                                      // 734
    addFormatToken('MMM', 0, 0, function (format) {                                                                   // 735
        return this.localeData().monthsShort(this, format);                                                           // 736
    });                                                                                                               // 737
                                                                                                                      // 738
    addFormatToken('MMMM', 0, 0, function (format) {                                                                  // 739
        return this.localeData().months(this, format);                                                                // 740
    });                                                                                                               // 741
                                                                                                                      // 742
    // ALIASES                                                                                                        // 743
                                                                                                                      // 744
    addUnitAlias('month', 'M');                                                                                       // 745
                                                                                                                      // 746
    // PARSING                                                                                                        // 747
                                                                                                                      // 748
    addRegexToken('M',    match1to2);                                                                                 // 749
    addRegexToken('MM',   match1to2, match2);                                                                         // 750
    addRegexToken('MMM',  function (isStrict, locale) {                                                               // 751
        return locale.monthsShortRegex(isStrict);                                                                     // 752
    });                                                                                                               // 753
    addRegexToken('MMMM', function (isStrict, locale) {                                                               // 754
        return locale.monthsRegex(isStrict);                                                                          // 755
    });                                                                                                               // 756
                                                                                                                      // 757
    addParseToken(['M', 'MM'], function (input, array) {                                                              // 758
        array[MONTH] = toInt(input) - 1;                                                                              // 759
    });                                                                                                               // 760
                                                                                                                      // 761
    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {                                           // 762
        var month = config._locale.monthsParse(input, token, config._strict);                                         // 763
        // if we didn't find a month name, mark the date as invalid.                                                  // 764
        if (month != null) {                                                                                          // 765
            array[MONTH] = month;                                                                                     // 766
        } else {                                                                                                      // 767
            getParsingFlags(config).invalidMonth = input;                                                             // 768
        }                                                                                                             // 769
    });                                                                                                               // 770
                                                                                                                      // 771
    // LOCALES                                                                                                        // 772
                                                                                                                      // 773
    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;                                                          // 774
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {                                                                               // 776
        return isArray(this._months) ? this._months[m.month()] :                                                      // 777
            this._months[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];                         // 778
    }                                                                                                                 // 779
                                                                                                                      // 780
    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');                      // 781
    function localeMonthsShort (m, format) {                                                                          // 782
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :                                            // 783
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];                    // 784
    }                                                                                                                 // 785
                                                                                                                      // 786
    function localeMonthsParse (monthName, format, strict) {                                                          // 787
        var i, mom, regex;                                                                                            // 788
                                                                                                                      // 789
        if (!this._monthsParse) {                                                                                     // 790
            this._monthsParse = [];                                                                                   // 791
            this._longMonthsParse = [];                                                                               // 792
            this._shortMonthsParse = [];                                                                              // 793
        }                                                                                                             // 794
                                                                                                                      // 795
        for (i = 0; i < 12; i++) {                                                                                    // 796
            // make the regex if we don't have it already                                                             // 797
            mom = create_utc__createUTC([2000, i]);                                                                   // 798
            if (strict && !this._longMonthsParse[i]) {                                                                // 799
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');        // 800
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');  // 801
            }                                                                                                         // 802
            if (!strict && !this._monthsParse[i]) {                                                                   // 803
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');                                // 804
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');                                       // 805
            }                                                                                                         // 806
            // test the regex                                                                                         // 807
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {                            // 808
                return i;                                                                                             // 809
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {                     // 810
                return i;                                                                                             // 811
            } else if (!strict && this._monthsParse[i].test(monthName)) {                                             // 812
                return i;                                                                                             // 813
            }                                                                                                         // 814
        }                                                                                                             // 815
    }                                                                                                                 // 816
                                                                                                                      // 817
    // MOMENTS                                                                                                        // 818
                                                                                                                      // 819
    function setMonth (mom, value) {                                                                                  // 820
        var dayOfMonth;                                                                                               // 821
                                                                                                                      // 822
        if (!mom.isValid()) {                                                                                         // 823
            // No op                                                                                                  // 824
            return mom;                                                                                               // 825
        }                                                                                                             // 826
                                                                                                                      // 827
        if (typeof value === 'string') {                                                                              // 828
            if (/^\d+$/.test(value)) {                                                                                // 829
                value = toInt(value);                                                                                 // 830
            } else {                                                                                                  // 831
                value = mom.localeData().monthsParse(value);                                                          // 832
                // TODO: Another silent failure?                                                                      // 833
                if (typeof value !== 'number') {                                                                      // 834
                    return mom;                                                                                       // 835
                }                                                                                                     // 836
            }                                                                                                         // 837
        }                                                                                                             // 838
                                                                                                                      // 839
        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));                                            // 840
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);                                       // 841
        return mom;                                                                                                   // 842
    }                                                                                                                 // 843
                                                                                                                      // 844
    function getSetMonth (value) {                                                                                    // 845
        if (value != null) {                                                                                          // 846
            setMonth(this, value);                                                                                    // 847
            utils_hooks__hooks.updateOffset(this, true);                                                              // 848
            return this;                                                                                              // 849
        } else {                                                                                                      // 850
            return get_set__get(this, 'Month');                                                                       // 851
        }                                                                                                             // 852
    }                                                                                                                 // 853
                                                                                                                      // 854
    function getDaysInMonth () {                                                                                      // 855
        return daysInMonth(this.year(), this.month());                                                                // 856
    }                                                                                                                 // 857
                                                                                                                      // 858
    var defaultMonthsShortRegex = matchWord;                                                                          // 859
    function monthsShortRegex (isStrict) {                                                                            // 860
        if (this._monthsParseExact) {                                                                                 // 861
            if (!hasOwnProp(this, '_monthsRegex')) {                                                                  // 862
                computeMonthsParse.call(this);                                                                        // 863
            }                                                                                                         // 864
            if (isStrict) {                                                                                           // 865
                return this._monthsShortStrictRegex;                                                                  // 866
            } else {                                                                                                  // 867
                return this._monthsShortRegex;                                                                        // 868
            }                                                                                                         // 869
        } else {                                                                                                      // 870
            return this._monthsShortStrictRegex && isStrict ?                                                         // 871
                this._monthsShortStrictRegex : this._monthsShortRegex;                                                // 872
        }                                                                                                             // 873
    }                                                                                                                 // 874
                                                                                                                      // 875
    var defaultMonthsRegex = matchWord;                                                                               // 876
    function monthsRegex (isStrict) {                                                                                 // 877
        if (this._monthsParseExact) {                                                                                 // 878
            if (!hasOwnProp(this, '_monthsRegex')) {                                                                  // 879
                computeMonthsParse.call(this);                                                                        // 880
            }                                                                                                         // 881
            if (isStrict) {                                                                                           // 882
                return this._monthsStrictRegex;                                                                       // 883
            } else {                                                                                                  // 884
                return this._monthsRegex;                                                                             // 885
            }                                                                                                         // 886
        } else {                                                                                                      // 887
            return this._monthsStrictRegex && isStrict ?                                                              // 888
                this._monthsStrictRegex : this._monthsRegex;                                                          // 889
        }                                                                                                             // 890
    }                                                                                                                 // 891
                                                                                                                      // 892
    function computeMonthsParse () {                                                                                  // 893
        function cmpLenRev(a, b) {                                                                                    // 894
            return b.length - a.length;                                                                               // 895
        }                                                                                                             // 896
                                                                                                                      // 897
        var shortPieces = [], longPieces = [], mixedPieces = [],                                                      // 898
            i, mom;                                                                                                   // 899
        for (i = 0; i < 12; i++) {                                                                                    // 900
            // make the regex if we don't have it already                                                             // 901
            mom = create_utc__createUTC([2000, i]);                                                                   // 902
            shortPieces.push(this.monthsShort(mom, ''));                                                              // 903
            longPieces.push(this.months(mom, ''));                                                                    // 904
            mixedPieces.push(this.months(mom, ''));                                                                   // 905
            mixedPieces.push(this.monthsShort(mom, ''));                                                              // 906
        }                                                                                                             // 907
        // Sorting makes sure if one month (or abbr) is a prefix of another it                                        // 908
        // will match the longer piece.                                                                               // 909
        shortPieces.sort(cmpLenRev);                                                                                  // 910
        longPieces.sort(cmpLenRev);                                                                                   // 911
        mixedPieces.sort(cmpLenRev);                                                                                  // 912
        for (i = 0; i < 12; i++) {                                                                                    // 913
            shortPieces[i] = regexEscape(shortPieces[i]);                                                             // 914
            longPieces[i] = regexEscape(longPieces[i]);                                                               // 915
            mixedPieces[i] = regexEscape(mixedPieces[i]);                                                             // 916
        }                                                                                                             // 917
                                                                                                                      // 918
        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');                                      // 919
        this._monthsShortRegex = this._monthsRegex;                                                                   // 920
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')$', 'i');                                // 921
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')$', 'i');                          // 922
    }                                                                                                                 // 923
                                                                                                                      // 924
    function checkOverflow (m) {                                                                                      // 925
        var overflow;                                                                                                 // 926
        var a = m._a;                                                                                                 // 927
                                                                                                                      // 928
        if (a && getParsingFlags(m).overflow === -2) {                                                                // 929
            overflow =                                                                                                // 930
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :                                                  // 931
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :                        // 932
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :                                                 // 934
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :                                                 // 935
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :                                            // 936
                -1;                                                                                                   // 937
                                                                                                                      // 938
            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {                      // 939
                overflow = DATE;                                                                                      // 940
            }                                                                                                         // 941
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {                                               // 942
                overflow = WEEK;                                                                                      // 943
            }                                                                                                         // 944
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {                                             // 945
                overflow = WEEKDAY;                                                                                   // 946
            }                                                                                                         // 947
                                                                                                                      // 948
            getParsingFlags(m).overflow = overflow;                                                                   // 949
        }                                                                                                             // 950
                                                                                                                      // 951
        return m;                                                                                                     // 952
    }                                                                                                                 // 953
                                                                                                                      // 954
    // iso 8601 regex                                                                                                 // 955
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)      // 956
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
                                                                                                                      // 959
    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;                                                                            // 960
                                                                                                                      // 961
    var isoDates = [                                                                                                  // 962
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],                                                                      // 963
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],                                                                            // 964
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],                                                                           // 965
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],                                                                         // 966
        ['YYYY-DDD', /\d{4}-\d{3}/],                                                                                  // 967
        ['YYYY-MM', /\d{4}-\d\d/, false],                                                                             // 968
        ['YYYYYYMMDD', /[+-]\d{10}/],                                                                                 // 969
        ['YYYYMMDD', /\d{8}/],                                                                                        // 970
        // YYYYMM is NOT allowed by the standard                                                                      // 971
        ['GGGG[W]WWE', /\d{4}W\d{3}/],                                                                                // 972
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],                                                                          // 973
        ['YYYYDDD', /\d{7}/]                                                                                          // 974
    ];                                                                                                                // 975
                                                                                                                      // 976
    // iso time formats and regexes                                                                                   // 977
    var isoTimes = [                                                                                                  // 978
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],                                                                     // 979
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],                                                                      // 980
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],                                                                               // 981
        ['HH:mm', /\d\d:\d\d/],                                                                                       // 982
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],                                                                         // 983
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],                                                                          // 984
        ['HHmmss', /\d\d\d\d\d\d/],                                                                                   // 985
        ['HHmm', /\d\d\d\d/],                                                                                         // 986
        ['HH', /\d\d/]                                                                                                // 987
    ];                                                                                                                // 988
                                                                                                                      // 989
    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;                                                                      // 990
                                                                                                                      // 991
    // date from iso format                                                                                           // 992
    function configFromISO(config) {                                                                                  // 993
        var i, l,                                                                                                     // 994
            string = config._i,                                                                                       // 995
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),                                      // 996
            allowTime, dateFormat, timeFormat, tzFormat;                                                              // 997
                                                                                                                      // 998
        if (match) {                                                                                                  // 999
            getParsingFlags(config).iso = true;                                                                       // 1000
                                                                                                                      // 1001
            for (i = 0, l = isoDates.length; i < l; i++) {                                                            // 1002
                if (isoDates[i][1].exec(match[1])) {                                                                  // 1003
                    dateFormat = isoDates[i][0];                                                                      // 1004
                    allowTime = isoDates[i][2] !== false;                                                             // 1005
                    break;                                                                                            // 1006
                }                                                                                                     // 1007
            }                                                                                                         // 1008
            if (dateFormat == null) {                                                                                 // 1009
                config._isValid = false;                                                                              // 1010
                return;                                                                                               // 1011
            }                                                                                                         // 1012
            if (match[3]) {                                                                                           // 1013
                for (i = 0, l = isoTimes.length; i < l; i++) {                                                        // 1014
                    if (isoTimes[i][1].exec(match[3])) {                                                              // 1015
                        // match[2] should be 'T' or space                                                            // 1016
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];                                              // 1017
                        break;                                                                                        // 1018
                    }                                                                                                 // 1019
                }                                                                                                     // 1020
                if (timeFormat == null) {                                                                             // 1021
                    config._isValid = false;                                                                          // 1022
                    return;                                                                                           // 1023
                }                                                                                                     // 1024
            }                                                                                                         // 1025
            if (!allowTime && timeFormat != null) {                                                                   // 1026
                config._isValid = false;                                                                              // 1027
                return;                                                                                               // 1028
            }                                                                                                         // 1029
            if (match[4]) {                                                                                           // 1030
                if (tzRegex.exec(match[4])) {                                                                         // 1031
                    tzFormat = 'Z';                                                                                   // 1032
                } else {                                                                                              // 1033
                    config._isValid = false;                                                                          // 1034
                    return;                                                                                           // 1035
                }                                                                                                     // 1036
            }                                                                                                         // 1037
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');                                           // 1038
            configFromStringAndFormat(config);                                                                        // 1039
        } else {                                                                                                      // 1040
            config._isValid = false;                                                                                  // 1041
        }                                                                                                             // 1042
    }                                                                                                                 // 1043
                                                                                                                      // 1044
    // date from iso format or fallback                                                                               // 1045
    function configFromString(config) {                                                                               // 1046
        var matched = aspNetJsonRegex.exec(config._i);                                                                // 1047
                                                                                                                      // 1048
        if (matched !== null) {                                                                                       // 1049
            config._d = new Date(+matched[1]);                                                                        // 1050
            return;                                                                                                   // 1051
        }                                                                                                             // 1052
                                                                                                                      // 1053
        configFromISO(config);                                                                                        // 1054
        if (config._isValid === false) {                                                                              // 1055
            delete config._isValid;                                                                                   // 1056
            utils_hooks__hooks.createFromInputFallback(config);                                                       // 1057
        }                                                                                                             // 1058
    }                                                                                                                 // 1059
                                                                                                                      // 1060
    utils_hooks__hooks.createFromInputFallback = deprecate(                                                           // 1061
        'moment construction falls back to js Date. This is ' +                                                       // 1062
        'discouraged and will be removed in upcoming major ' +                                                        // 1063
        'release. Please refer to ' +                                                                                 // 1064
        'https://github.com/moment/moment/issues/1407 for more info.',                                                // 1065
        function (config) {                                                                                           // 1066
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));                                         // 1067
        }                                                                                                             // 1068
    );                                                                                                                // 1069
                                                                                                                      // 1070
    function createDate (y, m, d, h, M, s, ms) {                                                                      // 1071
        //can't just apply() to create a date:                                                                        // 1072
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);                                                                    // 1074
                                                                                                                      // 1075
        //the date constructor remaps years 0-99 to 1900-1999                                                         // 1076
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {                                                      // 1077
            date.setFullYear(y);                                                                                      // 1078
        }                                                                                                             // 1079
        return date;                                                                                                  // 1080
    }                                                                                                                 // 1081
                                                                                                                      // 1082
    function createUTCDate (y) {                                                                                      // 1083
        var date = new Date(Date.UTC.apply(null, arguments));                                                         // 1084
                                                                                                                      // 1085
        //the Date.UTC function remaps years 0-99 to 1900-1999                                                        // 1086
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {                                                   // 1087
            date.setUTCFullYear(y);                                                                                   // 1088
        }                                                                                                             // 1089
        return date;                                                                                                  // 1090
    }                                                                                                                 // 1091
                                                                                                                      // 1092
    // FORMATTING                                                                                                     // 1093
                                                                                                                      // 1094
    addFormatToken('Y', 0, 0, function () {                                                                           // 1095
        var y = this.year();                                                                                          // 1096
        return y <= 9999 ? '' + y : '+' + y;                                                                          // 1097
    });                                                                                                               // 1098
                                                                                                                      // 1099
    addFormatToken(0, ['YY', 2], 0, function () {                                                                     // 1100
        return this.year() % 100;                                                                                     // 1101
    });                                                                                                               // 1102
                                                                                                                      // 1103
    addFormatToken(0, ['YYYY',   4],       0, 'year');                                                                // 1104
    addFormatToken(0, ['YYYYY',  5],       0, 'year');                                                                // 1105
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');                                                                // 1106
                                                                                                                      // 1107
    // ALIASES                                                                                                        // 1108
                                                                                                                      // 1109
    addUnitAlias('year', 'y');                                                                                        // 1110
                                                                                                                      // 1111
    // PARSING                                                                                                        // 1112
                                                                                                                      // 1113
    addRegexToken('Y',      matchSigned);                                                                             // 1114
    addRegexToken('YY',     match1to2, match2);                                                                       // 1115
    addRegexToken('YYYY',   match1to4, match4);                                                                       // 1116
    addRegexToken('YYYYY',  match1to6, match6);                                                                       // 1117
    addRegexToken('YYYYYY', match1to6, match6);                                                                       // 1118
                                                                                                                      // 1119
    addParseToken(['YYYYY', 'YYYYYY'], YEAR);                                                                         // 1120
    addParseToken('YYYY', function (input, array) {                                                                   // 1121
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);                // 1122
    });                                                                                                               // 1123
    addParseToken('YY', function (input, array) {                                                                     // 1124
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);                                                    // 1125
    });                                                                                                               // 1126
    addParseToken('Y', function (input, array) {                                                                      // 1127
        array[YEAR] = parseInt(input, 10);                                                                            // 1128
    });                                                                                                               // 1129
                                                                                                                      // 1130
    // HELPERS                                                                                                        // 1131
                                                                                                                      // 1132
    function daysInYear(year) {                                                                                       // 1133
        return isLeapYear(year) ? 366 : 365;                                                                          // 1134
    }                                                                                                                 // 1135
                                                                                                                      // 1136
    function isLeapYear(year) {                                                                                       // 1137
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;                                              // 1138
    }                                                                                                                 // 1139
                                                                                                                      // 1140
    // HOOKS                                                                                                          // 1141
                                                                                                                      // 1142
    utils_hooks__hooks.parseTwoDigitYear = function (input) {                                                         // 1143
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);                                                      // 1144
    };                                                                                                                // 1145
                                                                                                                      // 1146
    // MOMENTS                                                                                                        // 1147
                                                                                                                      // 1148
    var getSetYear = makeGetSet('FullYear', false);                                                                   // 1149
                                                                                                                      // 1150
    function getIsLeapYear () {                                                                                       // 1151
        return isLeapYear(this.year());                                                                               // 1152
    }                                                                                                                 // 1153
                                                                                                                      // 1154
    // start-of-first-week - start-of-year                                                                            // 1155
    function firstWeekOffset(year, dow, doy) {                                                                        // 1156
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)                   // 1157
            fwd = 7 + dow - doy,                                                                                      // 1158
            // first-week day local weekday -- which local weekday is fwd                                             // 1159
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;                                          // 1160
                                                                                                                      // 1161
        return -fwdlw + fwd - 1;                                                                                      // 1162
    }                                                                                                                 // 1163
                                                                                                                      // 1164
    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday         // 1165
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {                                                      // 1166
        var localWeekday = (7 + weekday - dow) % 7,                                                                   // 1167
            weekOffset = firstWeekOffset(year, dow, doy),                                                             // 1168
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,                                               // 1169
            resYear, resDayOfYear;                                                                                    // 1170
                                                                                                                      // 1171
        if (dayOfYear <= 0) {                                                                                         // 1172
            resYear = year - 1;                                                                                       // 1173
            resDayOfYear = daysInYear(resYear) + dayOfYear;                                                           // 1174
        } else if (dayOfYear > daysInYear(year)) {                                                                    // 1175
            resYear = year + 1;                                                                                       // 1176
            resDayOfYear = dayOfYear - daysInYear(year);                                                              // 1177
        } else {                                                                                                      // 1178
            resYear = year;                                                                                           // 1179
            resDayOfYear = dayOfYear;                                                                                 // 1180
        }                                                                                                             // 1181
                                                                                                                      // 1182
        return {                                                                                                      // 1183
            year: resYear,                                                                                            // 1184
            dayOfYear: resDayOfYear                                                                                   // 1185
        };                                                                                                            // 1186
    }                                                                                                                 // 1187
                                                                                                                      // 1188
    function weekOfYear(mom, dow, doy) {                                                                              // 1189
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),                                                       // 1190
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,                                            // 1191
            resWeek, resYear;                                                                                         // 1192
                                                                                                                      // 1193
        if (week < 1) {                                                                                               // 1194
            resYear = mom.year() - 1;                                                                                 // 1195
            resWeek = week + weeksInYear(resYear, dow, doy);                                                          // 1196
        } else if (week > weeksInYear(mom.year(), dow, doy)) {                                                        // 1197
            resWeek = week - weeksInYear(mom.year(), dow, doy);                                                       // 1198
            resYear = mom.year() + 1;                                                                                 // 1199
        } else {                                                                                                      // 1200
            resYear = mom.year();                                                                                     // 1201
            resWeek = week;                                                                                           // 1202
        }                                                                                                             // 1203
                                                                                                                      // 1204
        return {                                                                                                      // 1205
            week: resWeek,                                                                                            // 1206
            year: resYear                                                                                             // 1207
        };                                                                                                            // 1208
    }                                                                                                                 // 1209
                                                                                                                      // 1210
    function weeksInYear(year, dow, doy) {                                                                            // 1211
        var weekOffset = firstWeekOffset(year, dow, doy),                                                             // 1212
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);                                                     // 1213
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;                                                  // 1214
    }                                                                                                                 // 1215
                                                                                                                      // 1216
    // Pick the first defined of two or three arguments.                                                              // 1217
    function defaults(a, b, c) {                                                                                      // 1218
        if (a != null) {                                                                                              // 1219
            return a;                                                                                                 // 1220
        }                                                                                                             // 1221
        if (b != null) {                                                                                              // 1222
            return b;                                                                                                 // 1223
        }                                                                                                             // 1224
        return c;                                                                                                     // 1225
    }                                                                                                                 // 1226
                                                                                                                      // 1227
    function currentDateArray(config) {                                                                               // 1228
        // hooks is actually the exported moment object                                                               // 1229
        var nowValue = new Date(utils_hooks__hooks.now());                                                            // 1230
        if (config._useUTC) {                                                                                         // 1231
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];                        // 1232
        }                                                                                                             // 1233
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];                                     // 1234
    }                                                                                                                 // 1235
                                                                                                                      // 1236
    // convert an array to a date.                                                                                    // 1237
    // the array should mirror the parameters below                                                                   // 1238
    // note: all values past the year are optional and will default to the lowest possible value.                     // 1239
    // [year, month, day , hour, minute, second, millisecond]                                                         // 1240
    function configFromArray (config) {                                                                               // 1241
        var i, date, input = [], currentDate, yearToUse;                                                              // 1242
                                                                                                                      // 1243
        if (config._d) {                                                                                              // 1244
            return;                                                                                                   // 1245
        }                                                                                                             // 1246
                                                                                                                      // 1247
        currentDate = currentDateArray(config);                                                                       // 1248
                                                                                                                      // 1249
        //compute day of the year from weeks and weekdays                                                             // 1250
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {                                       // 1251
            dayOfYearFromWeekInfo(config);                                                                            // 1252
        }                                                                                                             // 1253
                                                                                                                      // 1254
        //if the day of the year is set, figure out what it is                                                        // 1255
        if (config._dayOfYear) {                                                                                      // 1256
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);                                                 // 1257
                                                                                                                      // 1258
            if (config._dayOfYear > daysInYear(yearToUse)) {                                                          // 1259
                getParsingFlags(config)._overflowDayOfYear = true;                                                    // 1260
            }                                                                                                         // 1261
                                                                                                                      // 1262
            date = createUTCDate(yearToUse, 0, config._dayOfYear);                                                    // 1263
            config._a[MONTH] = date.getUTCMonth();                                                                    // 1264
            config._a[DATE] = date.getUTCDate();                                                                      // 1265
        }                                                                                                             // 1266
                                                                                                                      // 1267
        // Default to current date.                                                                                   // 1268
        // * if no year, month, day of month are given, default to today                                              // 1269
        // * if day of month is given, default month and year                                                         // 1270
        // * if month is given, default only year                                                                     // 1271
        // * if year is given, don't default anything                                                                 // 1272
        for (i = 0; i < 3 && config._a[i] == null; ++i) {                                                             // 1273
            config._a[i] = input[i] = currentDate[i];                                                                 // 1274
        }                                                                                                             // 1275
                                                                                                                      // 1276
        // Zero out whatever was not defaulted, including time                                                        // 1277
        for (; i < 7; i++) {                                                                                          // 1278
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];                      // 1279
        }                                                                                                             // 1280
                                                                                                                      // 1281
        // Check for 24:00:00.000                                                                                     // 1282
        if (config._a[HOUR] === 24 &&                                                                                 // 1283
                config._a[MINUTE] === 0 &&                                                                            // 1284
                config._a[SECOND] === 0 &&                                                                            // 1285
                config._a[MILLISECOND] === 0) {                                                                       // 1286
            config._nextDay = true;                                                                                   // 1287
            config._a[HOUR] = 0;                                                                                      // 1288
        }                                                                                                             // 1289
                                                                                                                      // 1290
        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);                                 // 1291
        // Apply timezone offset from input. The actual utcOffset can be changed                                      // 1292
        // with parseZone.                                                                                            // 1293
        if (config._tzm != null) {                                                                                    // 1294
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);                                         // 1295
        }                                                                                                             // 1296
                                                                                                                      // 1297
        if (config._nextDay) {                                                                                        // 1298
            config._a[HOUR] = 24;                                                                                     // 1299
        }                                                                                                             // 1300
    }                                                                                                                 // 1301
                                                                                                                      // 1302
    function dayOfYearFromWeekInfo(config) {                                                                          // 1303
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;                                              // 1304
                                                                                                                      // 1305
        w = config._w;                                                                                                // 1306
        if (w.GG != null || w.W != null || w.E != null) {                                                             // 1307
            dow = 1;                                                                                                  // 1308
            doy = 4;                                                                                                  // 1309
                                                                                                                      // 1310
            // TODO: We need to take the current isoWeekYear, but that depends on                                     // 1311
            // how we interpret now (local, utc, fixed offset). So create                                             // 1312
            // a now version of current config (take local/utc/offset flags, and                                      // 1313
            // create now).                                                                                           // 1314
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);                  // 1315
            week = defaults(w.W, 1);                                                                                  // 1316
            weekday = defaults(w.E, 1);                                                                               // 1317
            if (weekday < 1 || weekday > 7) {                                                                         // 1318
                weekdayOverflow = true;                                                                               // 1319
            }                                                                                                         // 1320
        } else {                                                                                                      // 1321
            dow = config._locale._week.dow;                                                                           // 1322
            doy = config._locale._week.doy;                                                                           // 1323
                                                                                                                      // 1324
            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);              // 1325
            week = defaults(w.w, 1);                                                                                  // 1326
                                                                                                                      // 1327
            if (w.d != null) {                                                                                        // 1328
                // weekday -- low day numbers are considered next week                                                // 1329
                weekday = w.d;                                                                                        // 1330
                if (weekday < 0 || weekday > 6) {                                                                     // 1331
                    weekdayOverflow = true;                                                                           // 1332
                }                                                                                                     // 1333
            } else if (w.e != null) {                                                                                 // 1334
                // local weekday -- counting starts from begining of week                                             // 1335
                weekday = w.e + dow;                                                                                  // 1336
                if (w.e < 0 || w.e > 6) {                                                                             // 1337
                    weekdayOverflow = true;                                                                           // 1338
                }                                                                                                     // 1339
            } else {                                                                                                  // 1340
                // default to begining of week                                                                        // 1341
                weekday = dow;                                                                                        // 1342
            }                                                                                                         // 1343
        }                                                                                                             // 1344
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {                                                     // 1345
            getParsingFlags(config)._overflowWeeks = true;                                                            // 1346
        } else if (weekdayOverflow != null) {                                                                         // 1347
            getParsingFlags(config)._overflowWeekday = true;                                                          // 1348
        } else {                                                                                                      // 1349
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);                                             // 1350
            config._a[YEAR] = temp.year;                                                                              // 1351
            config._dayOfYear = temp.dayOfYear;                                                                       // 1352
        }                                                                                                             // 1353
    }                                                                                                                 // 1354
                                                                                                                      // 1355
    // constant that refers to the ISO standard                                                                       // 1356
    utils_hooks__hooks.ISO_8601 = function () {};                                                                     // 1357
                                                                                                                      // 1358
    // date from string and format string                                                                             // 1359
    function configFromStringAndFormat(config) {                                                                      // 1360
        // TODO: Move this to another part of the creation flow to prevent circular deps                              // 1361
        if (config._f === utils_hooks__hooks.ISO_8601) {                                                              // 1362
            configFromISO(config);                                                                                    // 1363
            return;                                                                                                   // 1364
        }                                                                                                             // 1365
                                                                                                                      // 1366
        config._a = [];                                                                                               // 1367
        getParsingFlags(config).empty = true;                                                                         // 1368
                                                                                                                      // 1369
        // This array is used to make a Date, either with `new Date` or `Date.UTC`                                    // 1370
        var string = '' + config._i,                                                                                  // 1371
            i, parsedInput, tokens, token, skipped,                                                                   // 1372
            stringLength = string.length,                                                                             // 1373
            totalParsedInputLength = 0;                                                                               // 1374
                                                                                                                      // 1375
        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];                               // 1376
                                                                                                                      // 1377
        for (i = 0; i < tokens.length; i++) {                                                                         // 1378
            token = tokens[i];                                                                                        // 1379
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];                              // 1380
            // console.log('token', token, 'parsedInput', parsedInput,                                                // 1381
            //         'regex', getParseRegexForToken(token, config));                                                // 1382
            if (parsedInput) {                                                                                        // 1383
                skipped = string.substr(0, string.indexOf(parsedInput));                                              // 1384
                if (skipped.length > 0) {                                                                             // 1385
                    getParsingFlags(config).unusedInput.push(skipped);                                                // 1386
                }                                                                                                     // 1387
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);                              // 1388
                totalParsedInputLength += parsedInput.length;                                                         // 1389
            }                                                                                                         // 1390
            // don't parse if it's not a known token                                                                  // 1391
            if (formatTokenFunctions[token]) {                                                                        // 1392
                if (parsedInput) {                                                                                    // 1393
                    getParsingFlags(config).empty = false;                                                            // 1394
                }                                                                                                     // 1395
                else {                                                                                                // 1396
                    getParsingFlags(config).unusedTokens.push(token);                                                 // 1397
                }                                                                                                     // 1398
                addTimeToArrayFromToken(token, parsedInput, config);                                                  // 1399
            }                                                                                                         // 1400
            else if (config._strict && !parsedInput) {                                                                // 1401
                getParsingFlags(config).unusedTokens.push(token);                                                     // 1402
            }                                                                                                         // 1403
        }                                                                                                             // 1404
                                                                                                                      // 1405
        // add remaining unparsed input length to the string                                                          // 1406
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;                                // 1407
        if (string.length > 0) {                                                                                      // 1408
            getParsingFlags(config).unusedInput.push(string);                                                         // 1409
        }                                                                                                             // 1410
                                                                                                                      // 1411
        // clear _12h flag if hour is <= 12                                                                           // 1412
        if (getParsingFlags(config).bigHour === true &&                                                               // 1413
                config._a[HOUR] <= 12 &&                                                                              // 1414
                config._a[HOUR] > 0) {                                                                                // 1415
            getParsingFlags(config).bigHour = undefined;                                                              // 1416
        }                                                                                                             // 1417
        // handle meridiem                                                                                            // 1418
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);                         // 1419
                                                                                                                      // 1420
        configFromArray(config);                                                                                      // 1421
        checkOverflow(config);                                                                                        // 1422
    }                                                                                                                 // 1423
                                                                                                                      // 1424
                                                                                                                      // 1425
    function meridiemFixWrap (locale, hour, meridiem) {                                                               // 1426
        var isPm;                                                                                                     // 1427
                                                                                                                      // 1428
        if (meridiem == null) {                                                                                       // 1429
            // nothing to do                                                                                          // 1430
            return hour;                                                                                              // 1431
        }                                                                                                             // 1432
        if (locale.meridiemHour != null) {                                                                            // 1433
            return locale.meridiemHour(hour, meridiem);                                                               // 1434
        } else if (locale.isPM != null) {                                                                             // 1435
            // Fallback                                                                                               // 1436
            isPm = locale.isPM(meridiem);                                                                             // 1437
            if (isPm && hour < 12) {                                                                                  // 1438
                hour += 12;                                                                                           // 1439
            }                                                                                                         // 1440
            if (!isPm && hour === 12) {                                                                               // 1441
                hour = 0;                                                                                             // 1442
            }                                                                                                         // 1443
            return hour;                                                                                              // 1444
        } else {                                                                                                      // 1445
            // this is not supposed to happen                                                                         // 1446
            return hour;                                                                                              // 1447
        }                                                                                                             // 1448
    }                                                                                                                 // 1449
                                                                                                                      // 1450
    // date from string and array of format strings                                                                   // 1451
    function configFromStringAndArray(config) {                                                                       // 1452
        var tempConfig,                                                                                               // 1453
            bestMoment,                                                                                               // 1454
                                                                                                                      // 1455
            scoreToBeat,                                                                                              // 1456
            i,                                                                                                        // 1457
            currentScore;                                                                                             // 1458
                                                                                                                      // 1459
        if (config._f.length === 0) {                                                                                 // 1460
            getParsingFlags(config).invalidFormat = true;                                                             // 1461
            config._d = new Date(NaN);                                                                                // 1462
            return;                                                                                                   // 1463
        }                                                                                                             // 1464
                                                                                                                      // 1465
        for (i = 0; i < config._f.length; i++) {                                                                      // 1466
            currentScore = 0;                                                                                         // 1467
            tempConfig = copyConfig({}, config);                                                                      // 1468
            if (config._useUTC != null) {                                                                             // 1469
                tempConfig._useUTC = config._useUTC;                                                                  // 1470
            }                                                                                                         // 1471
            tempConfig._f = config._f[i];                                                                             // 1472
            configFromStringAndFormat(tempConfig);                                                                    // 1473
                                                                                                                      // 1474
            if (!valid__isValid(tempConfig)) {                                                                        // 1475
                continue;                                                                                             // 1476
            }                                                                                                         // 1477
                                                                                                                      // 1478
            // if there is any input that was not parsed add a penalty for that format                                // 1479
            currentScore += getParsingFlags(tempConfig).charsLeftOver;                                                // 1480
                                                                                                                      // 1481
            //or tokens                                                                                               // 1482
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;                                     // 1483
                                                                                                                      // 1484
            getParsingFlags(tempConfig).score = currentScore;                                                         // 1485
                                                                                                                      // 1486
            if (scoreToBeat == null || currentScore < scoreToBeat) {                                                  // 1487
                scoreToBeat = currentScore;                                                                           // 1488
                bestMoment = tempConfig;                                                                              // 1489
            }                                                                                                         // 1490
        }                                                                                                             // 1491
                                                                                                                      // 1492
        extend(config, bestMoment || tempConfig);                                                                     // 1493
    }                                                                                                                 // 1494
                                                                                                                      // 1495
    function configFromObject(config) {                                                                               // 1496
        if (config._d) {                                                                                              // 1497
            return;                                                                                                   // 1498
        }                                                                                                             // 1499
                                                                                                                      // 1500
        var i = normalizeObjectUnits(config._i);                                                                      // 1501
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);                                                                          // 1503
        });                                                                                                           // 1504
                                                                                                                      // 1505
        configFromArray(config);                                                                                      // 1506
    }                                                                                                                 // 1507
                                                                                                                      // 1508
    function createFromConfig (config) {                                                                              // 1509
        var res = new Moment(checkOverflow(prepareConfig(config)));                                                   // 1510
        if (res._nextDay) {                                                                                           // 1511
            // Adding is smart enough around DST                                                                      // 1512
            res.add(1, 'd');                                                                                          // 1513
            res._nextDay = undefined;                                                                                 // 1514
        }                                                                                                             // 1515
                                                                                                                      // 1516
        return res;                                                                                                   // 1517
    }                                                                                                                 // 1518
                                                                                                                      // 1519
    function prepareConfig (config) {                                                                                 // 1520
        var input = config._i,                                                                                        // 1521
            format = config._f;                                                                                       // 1522
                                                                                                                      // 1523
        config._locale = config._locale || locale_locales__getLocale(config._l);                                      // 1524
                                                                                                                      // 1525
        if (input === null || (format === undefined && input === '')) {                                               // 1526
            return valid__createInvalid({nullInput: true});                                                           // 1527
        }                                                                                                             // 1528
                                                                                                                      // 1529
        if (typeof input === 'string') {                                                                              // 1530
            config._i = input = config._locale.preparse(input);                                                       // 1531
        }                                                                                                             // 1532
                                                                                                                      // 1533
        if (isMoment(input)) {                                                                                        // 1534
            return new Moment(checkOverflow(input));                                                                  // 1535
        } else if (isArray(format)) {                                                                                 // 1536
            configFromStringAndArray(config);                                                                         // 1537
        } else if (format) {                                                                                          // 1538
            configFromStringAndFormat(config);                                                                        // 1539
        } else if (isDate(input)) {                                                                                   // 1540
            config._d = input;                                                                                        // 1541
        } else {                                                                                                      // 1542
            configFromInput(config);                                                                                  // 1543
        }                                                                                                             // 1544
                                                                                                                      // 1545
        if (!valid__isValid(config)) {                                                                                // 1546
            config._d = null;                                                                                         // 1547
        }                                                                                                             // 1548
                                                                                                                      // 1549
        return config;                                                                                                // 1550
    }                                                                                                                 // 1551
                                                                                                                      // 1552
    function configFromInput(config) {                                                                                // 1553
        var input = config._i;                                                                                        // 1554
        if (input === undefined) {                                                                                    // 1555
            config._d = new Date(utils_hooks__hooks.now());                                                           // 1556
        } else if (isDate(input)) {                                                                                   // 1557
            config._d = new Date(+input);                                                                             // 1558
        } else if (typeof input === 'string') {                                                                       // 1559
            configFromString(config);                                                                                 // 1560
        } else if (isArray(input)) {                                                                                  // 1561
            config._a = map(input.slice(0), function (obj) {                                                          // 1562
                return parseInt(obj, 10);                                                                             // 1563
            });                                                                                                       // 1564
            configFromArray(config);                                                                                  // 1565
        } else if (typeof(input) === 'object') {                                                                      // 1566
            configFromObject(config);                                                                                 // 1567
        } else if (typeof(input) === 'number') {                                                                      // 1568
            // from milliseconds                                                                                      // 1569
            config._d = new Date(input);                                                                              // 1570
        } else {                                                                                                      // 1571
            utils_hooks__hooks.createFromInputFallback(config);                                                       // 1572
        }                                                                                                             // 1573
    }                                                                                                                 // 1574
                                                                                                                      // 1575
    function createLocalOrUTC (input, format, locale, strict, isUTC) {                                                // 1576
        var c = {};                                                                                                   // 1577
                                                                                                                      // 1578
        if (typeof(locale) === 'boolean') {                                                                           // 1579
            strict = locale;                                                                                          // 1580
            locale = undefined;                                                                                       // 1581
        }                                                                                                             // 1582
        // object construction must be done this way.                                                                 // 1583
        // https://github.com/moment/moment/issues/1423                                                               // 1584
        c._isAMomentObject = true;                                                                                    // 1585
        c._useUTC = c._isUTC = isUTC;                                                                                 // 1586
        c._l = locale;                                                                                                // 1587
        c._i = input;                                                                                                 // 1588
        c._f = format;                                                                                                // 1589
        c._strict = strict;                                                                                           // 1590
                                                                                                                      // 1591
        return createFromConfig(c);                                                                                   // 1592
    }                                                                                                                 // 1593
                                                                                                                      // 1594
    function local__createLocal (input, format, locale, strict) {                                                     // 1595
        return createLocalOrUTC(input, format, locale, strict, false);                                                // 1596
    }                                                                                                                 // 1597
                                                                                                                      // 1598
    var prototypeMin = deprecate(                                                                                     // 1599
         'moment().min is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',          // 1600
         function () {                                                                                                // 1601
             var other = local__createLocal.apply(null, arguments);                                                   // 1602
             if (this.isValid() && other.isValid()) {                                                                 // 1603
                 return other < this ? this : other;                                                                  // 1604
             } else {                                                                                                 // 1605
                 return valid__createInvalid();                                                                       // 1606
             }                                                                                                        // 1607
         }                                                                                                            // 1608
     );                                                                                                               // 1609
                                                                                                                      // 1610
    var prototypeMax = deprecate(                                                                                     // 1611
        'moment().max is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',           // 1612
        function () {                                                                                                 // 1613
            var other = local__createLocal.apply(null, arguments);                                                    // 1614
            if (this.isValid() && other.isValid()) {                                                                  // 1615
                return other > this ? this : other;                                                                   // 1616
            } else {                                                                                                  // 1617
                return valid__createInvalid();                                                                        // 1618
            }                                                                                                         // 1619
        }                                                                                                             // 1620
    );                                                                                                                // 1621
                                                                                                                      // 1622
    // Pick a moment m from moments so that m[fn](other) is true for all                                              // 1623
    // other. This relies on the function fn to be transitive.                                                        // 1624
    //                                                                                                                // 1625
    // moments should either be an array of moment objects or an array, whose                                         // 1626
    // first element is an array of moment objects.                                                                   // 1627
    function pickBy(fn, moments) {                                                                                    // 1628
        var res, i;                                                                                                   // 1629
        if (moments.length === 1 && isArray(moments[0])) {                                                            // 1630
            moments = moments[0];                                                                                     // 1631
        }                                                                                                             // 1632
        if (!moments.length) {                                                                                        // 1633
            return local__createLocal();                                                                              // 1634
        }                                                                                                             // 1635
        res = moments[0];                                                                                             // 1636
        for (i = 1; i < moments.length; ++i) {                                                                        // 1637
            if (!moments[i].isValid() || moments[i][fn](res)) {                                                       // 1638
                res = moments[i];                                                                                     // 1639
            }                                                                                                         // 1640
        }                                                                                                             // 1641
        return res;                                                                                                   // 1642
    }                                                                                                                 // 1643
                                                                                                                      // 1644
    // TODO: Use [].sort instead?                                                                                     // 1645
    function min () {                                                                                                 // 1646
        var args = [].slice.call(arguments, 0);                                                                       // 1647
                                                                                                                      // 1648
        return pickBy('isBefore', args);                                                                              // 1649
    }                                                                                                                 // 1650
                                                                                                                      // 1651
    function max () {                                                                                                 // 1652
        var args = [].slice.call(arguments, 0);                                                                       // 1653
                                                                                                                      // 1654
        return pickBy('isAfter', args);                                                                               // 1655
    }                                                                                                                 // 1656
                                                                                                                      // 1657
    var now = function () {                                                                                           // 1658
        return Date.now ? Date.now() : +(new Date());                                                                 // 1659
    };                                                                                                                // 1660
                                                                                                                      // 1661
    function Duration (duration) {                                                                                    // 1662
        var normalizedInput = normalizeObjectUnits(duration),                                                         // 1663
            years = normalizedInput.year || 0,                                                                        // 1664
            quarters = normalizedInput.quarter || 0,                                                                  // 1665
            months = normalizedInput.month || 0,                                                                      // 1666
            weeks = normalizedInput.week || 0,                                                                        // 1667
            days = normalizedInput.day || 0,                                                                          // 1668
            hours = normalizedInput.hour || 0,                                                                        // 1669
            minutes = normalizedInput.minute || 0,                                                                    // 1670
            seconds = normalizedInput.second || 0,                                                                    // 1671
            milliseconds = normalizedInput.millisecond || 0;                                                          // 1672
                                                                                                                      // 1673
        // representation for dateAddRemove                                                                           // 1674
        this._milliseconds = +milliseconds +                                                                          // 1675
            seconds * 1e3 + // 1000                                                                                   // 1676
            minutes * 6e4 + // 1000 * 60                                                                              // 1677
            hours * 36e5; // 1000 * 60 * 60                                                                           // 1678
        // Because of dateAddRemove treats 24 hours as different from a                                               // 1679
        // day when working around DST, we need to store them separately                                              // 1680
        this._days = +days +                                                                                          // 1681
            weeks * 7;                                                                                                // 1682
        // It is impossible translate months into days without knowing                                                // 1683
        // which months you are are talking about, so we have to store                                                // 1684
        // it separately.                                                                                             // 1685
        this._months = +months +                                                                                      // 1686
            quarters * 3 +                                                                                            // 1687
            years * 12;                                                                                               // 1688
                                                                                                                      // 1689
        this._data = {};                                                                                              // 1690
                                                                                                                      // 1691
        this._locale = locale_locales__getLocale();                                                                   // 1692
                                                                                                                      // 1693
        this._bubble();                                                                                               // 1694
    }                                                                                                                 // 1695
                                                                                                                      // 1696
    function isDuration (obj) {                                                                                       // 1697
        return obj instanceof Duration;                                                                               // 1698
    }                                                                                                                 // 1699
                                                                                                                      // 1700
    // FORMATTING                                                                                                     // 1701
                                                                                                                      // 1702
    function offset (token, separator) {                                                                              // 1703
        addFormatToken(token, 0, 0, function () {                                                                     // 1704
            var offset = this.utcOffset();                                                                            // 1705
            var sign = '+';                                                                                           // 1706
            if (offset < 0) {                                                                                         // 1707
                offset = -offset;                                                                                     // 1708
                sign = '-';                                                                                           // 1709
            }                                                                                                         // 1710
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);                    // 1711
        });                                                                                                           // 1712
    }                                                                                                                 // 1713
                                                                                                                      // 1714
    offset('Z', ':');                                                                                                 // 1715
    offset('ZZ', '');                                                                                                 // 1716
                                                                                                                      // 1717
    // PARSING                                                                                                        // 1718
                                                                                                                      // 1719
    addRegexToken('Z',  matchShortOffset);                                                                            // 1720
    addRegexToken('ZZ', matchShortOffset);                                                                            // 1721
    addParseToken(['Z', 'ZZ'], function (input, array, config) {                                                      // 1722
        config._useUTC = true;                                                                                        // 1723
        config._tzm = offsetFromString(matchShortOffset, input);                                                      // 1724
    });                                                                                                               // 1725
                                                                                                                      // 1726
    // HELPERS                                                                                                        // 1727
                                                                                                                      // 1728
    // timezone chunker                                                                                               // 1729
    // '+10:00' > ['10',  '00']                                                                                       // 1730
    // '-1530'  > ['-15', '30']                                                                                       // 1731
    var chunkOffset = /([\+\-]|\d\d)/gi;                                                                              // 1732
                                                                                                                      // 1733
    function offsetFromString(matcher, string) {                                                                      // 1734
        var matches = ((string || '').match(matcher) || []);                                                          // 1735
        var chunk   = matches[matches.length - 1] || [];                                                              // 1736
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];                                                 // 1737
        var minutes = +(parts[1] * 60) + toInt(parts[2]);                                                             // 1738
                                                                                                                      // 1739
        return parts[0] === '+' ? minutes : -minutes;                                                                 // 1740
    }                                                                                                                 // 1741
                                                                                                                      // 1742
    // Return a moment from input, that is local/utc/zone equivalent to model.                                        // 1743
    function cloneWithOffset(input, model) {                                                                          // 1744
        var res, diff;                                                                                                // 1745
        if (model._isUTC) {                                                                                           // 1746
            res = model.clone();                                                                                      // 1747
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);                 // 1748
            // Use low-level api, because this fn is low-level api.                                                   // 1749
            res._d.setTime(+res._d + diff);                                                                           // 1750
            utils_hooks__hooks.updateOffset(res, false);                                                              // 1751
            return res;                                                                                               // 1752
        } else {                                                                                                      // 1753
            return local__createLocal(input).local();                                                                 // 1754
        }                                                                                                             // 1755
    }                                                                                                                 // 1756
                                                                                                                      // 1757
    function getDateOffset (m) {                                                                                      // 1758
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.                                             // 1759
        // https://github.com/moment/moment/pull/1871                                                                 // 1760
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;                                                       // 1761
    }                                                                                                                 // 1762
                                                                                                                      // 1763
    // HOOKS                                                                                                          // 1764
                                                                                                                      // 1765
    // This function will be called whenever a moment is mutated.                                                     // 1766
    // It is intended to keep the offset in sync with the timezone.                                                   // 1767
    utils_hooks__hooks.updateOffset = function () {};                                                                 // 1768
                                                                                                                      // 1769
    // MOMENTS                                                                                                        // 1770
                                                                                                                      // 1771
    // keepLocalTime = true means only change the timezone, without                                                   // 1772
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->                                           // 1773
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset                                            // 1774
    // +0200, so we adjust the time as needed, to be valid.                                                           // 1775
    //                                                                                                                // 1776
    // Keeping the time actually adds/subtracts (one hour)                                                            // 1777
    // from the actual represented time. That is why we call updateOffset                                             // 1778
    // a second time. In case it wants us to change the offset again                                                  // 1779
    // _changeInProgress == true case, then we have to adjust, because                                                // 1780
    // there is no such time in the given timezone.                                                                   // 1781
    function getSetOffset (input, keepLocalTime) {                                                                    // 1782
        var offset = this._offset || 0,                                                                               // 1783
            localAdjust;                                                                                              // 1784
        if (!this.isValid()) {                                                                                        // 1785
            return input != null ? this : NaN;                                                                        // 1786
        }                                                                                                             // 1787
        if (input != null) {                                                                                          // 1788
            if (typeof input === 'string') {                                                                          // 1789
                input = offsetFromString(matchShortOffset, input);                                                    // 1790
            } else if (Math.abs(input) < 16) {                                                                        // 1791
                input = input * 60;                                                                                   // 1792
            }                                                                                                         // 1793
            if (!this._isUTC && keepLocalTime) {                                                                      // 1794
                localAdjust = getDateOffset(this);                                                                    // 1795
            }                                                                                                         // 1796
            this._offset = input;                                                                                     // 1797
            this._isUTC = true;                                                                                       // 1798
            if (localAdjust != null) {                                                                                // 1799
                this.add(localAdjust, 'm');                                                                           // 1800
            }                                                                                                         // 1801
            if (offset !== input) {                                                                                   // 1802
                if (!keepLocalTime || this._changeInProgress) {                                                       // 1803
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);           // 1804
                } else if (!this._changeInProgress) {                                                                 // 1805
                    this._changeInProgress = true;                                                                    // 1806
                    utils_hooks__hooks.updateOffset(this, true);                                                      // 1807
                    this._changeInProgress = null;                                                                    // 1808
                }                                                                                                     // 1809
            }                                                                                                         // 1810
            return this;                                                                                              // 1811
        } else {                                                                                                      // 1812
            return this._isUTC ? offset : getDateOffset(this);                                                        // 1813
        }                                                                                                             // 1814
    }                                                                                                                 // 1815
                                                                                                                      // 1816
    function getSetZone (input, keepLocalTime) {                                                                      // 1817
        if (input != null) {                                                                                          // 1818
            if (typeof input !== 'string') {                                                                          // 1819
                input = -input;                                                                                       // 1820
            }                                                                                                         // 1821
                                                                                                                      // 1822
            this.utcOffset(input, keepLocalTime);                                                                     // 1823
                                                                                                                      // 1824
            return this;                                                                                              // 1825
        } else {                                                                                                      // 1826
            return -this.utcOffset();                                                                                 // 1827
        }                                                                                                             // 1828
    }                                                                                                                 // 1829
                                                                                                                      // 1830
    function setOffsetToUTC (keepLocalTime) {                                                                         // 1831
        return this.utcOffset(0, keepLocalTime);                                                                      // 1832
    }                                                                                                                 // 1833
                                                                                                                      // 1834
    function setOffsetToLocal (keepLocalTime) {                                                                       // 1835
        if (this._isUTC) {                                                                                            // 1836
            this.utcOffset(0, keepLocalTime);                                                                         // 1837
            this._isUTC = false;                                                                                      // 1838
                                                                                                                      // 1839
            if (keepLocalTime) {                                                                                      // 1840
                this.subtract(getDateOffset(this), 'm');                                                              // 1841
            }                                                                                                         // 1842
        }                                                                                                             // 1843
        return this;                                                                                                  // 1844
    }                                                                                                                 // 1845
                                                                                                                      // 1846
    function setOffsetToParsedOffset () {                                                                             // 1847
        if (this._tzm) {                                                                                              // 1848
            this.utcOffset(this._tzm);                                                                                // 1849
        } else if (typeof this._i === 'string') {                                                                     // 1850
            this.utcOffset(offsetFromString(matchOffset, this._i));                                                   // 1851
        }                                                                                                             // 1852
        return this;                                                                                                  // 1853
    }                                                                                                                 // 1854
                                                                                                                      // 1855
    function hasAlignedHourOffset (input) {                                                                           // 1856
        if (!this.isValid()) {                                                                                        // 1857
            return false;                                                                                             // 1858
        }                                                                                                             // 1859
        input = input ? local__createLocal(input).utcOffset() : 0;                                                    // 1860
                                                                                                                      // 1861
        return (this.utcOffset() - input) % 60 === 0;                                                                 // 1862
    }                                                                                                                 // 1863
                                                                                                                      // 1864
    function isDaylightSavingTime () {                                                                                // 1865
        return (                                                                                                      // 1866
            this.utcOffset() > this.clone().month(0).utcOffset() ||                                                   // 1867
            this.utcOffset() > this.clone().month(5).utcOffset()                                                      // 1868
        );                                                                                                            // 1869
    }                                                                                                                 // 1870
                                                                                                                      // 1871
    function isDaylightSavingTimeShifted () {                                                                         // 1872
        if (!isUndefined(this._isDSTShifted)) {                                                                       // 1873
            return this._isDSTShifted;                                                                                // 1874
        }                                                                                                             // 1875
                                                                                                                      // 1876
        var c = {};                                                                                                   // 1877
                                                                                                                      // 1878
        copyConfig(c, this);                                                                                          // 1879
        c = prepareConfig(c);                                                                                         // 1880
                                                                                                                      // 1881
        if (c._a) {                                                                                                   // 1882
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);                            // 1883
            this._isDSTShifted = this.isValid() &&                                                                    // 1884
                compareArrays(c._a, other.toArray()) > 0;                                                             // 1885
        } else {                                                                                                      // 1886
            this._isDSTShifted = false;                                                                               // 1887
        }                                                                                                             // 1888
                                                                                                                      // 1889
        return this._isDSTShifted;                                                                                    // 1890
    }                                                                                                                 // 1891
                                                                                                                      // 1892
    function isLocal () {                                                                                             // 1893
        return this.isValid() ? !this._isUTC : false;                                                                 // 1894
    }                                                                                                                 // 1895
                                                                                                                      // 1896
    function isUtcOffset () {                                                                                         // 1897
        return this.isValid() ? this._isUTC : false;                                                                  // 1898
    }                                                                                                                 // 1899
                                                                                                                      // 1900
    function isUtc () {                                                                                               // 1901
        return this.isValid() ? this._isUTC && this._offset === 0 : false;                                            // 1902
    }                                                                                                                 // 1903
                                                                                                                      // 1904
    // ASP.NET json date format regex                                                                                 // 1905
    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/;                                  // 1906
                                                                                                                      // 1907
    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html                      // 1908
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere                                      // 1909
    // and further modified to allow for strings containing both week and day                                         // 1910
    var isoRegex = /^(-)?P(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)W)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?$/;
                                                                                                                      // 1912
    function create__createDuration (input, key) {                                                                    // 1913
        var duration = input,                                                                                         // 1914
            // matching against regexp is expensive, do it on demand                                                  // 1915
            match = null,                                                                                             // 1916
            sign,                                                                                                     // 1917
            ret,                                                                                                      // 1918
            diffRes;                                                                                                  // 1919
                                                                                                                      // 1920
        if (isDuration(input)) {                                                                                      // 1921
            duration = {                                                                                              // 1922
                ms : input._milliseconds,                                                                             // 1923
                d  : input._days,                                                                                     // 1924
                M  : input._months                                                                                    // 1925
            };                                                                                                        // 1926
        } else if (typeof input === 'number') {                                                                       // 1927
            duration = {};                                                                                            // 1928
            if (key) {                                                                                                // 1929
                duration[key] = input;                                                                                // 1930
            } else {                                                                                                  // 1931
                duration.milliseconds = input;                                                                        // 1932
            }                                                                                                         // 1933
        } else if (!!(match = aspNetRegex.exec(input))) {                                                             // 1934
            sign = (match[1] === '-') ? -1 : 1;                                                                       // 1935
            duration = {                                                                                              // 1936
                y  : 0,                                                                                               // 1937
                d  : toInt(match[DATE])        * sign,                                                                // 1938
                h  : toInt(match[HOUR])        * sign,                                                                // 1939
                m  : toInt(match[MINUTE])      * sign,                                                                // 1940
                s  : toInt(match[SECOND])      * sign,                                                                // 1941
                ms : toInt(match[MILLISECOND]) * sign                                                                 // 1942
            };                                                                                                        // 1943
        } else if (!!(match = isoRegex.exec(input))) {                                                                // 1944
            sign = (match[1] === '-') ? -1 : 1;                                                                       // 1945
            duration = {                                                                                              // 1946
                y : parseIso(match[2], sign),                                                                         // 1947
                M : parseIso(match[3], sign),                                                                         // 1948
                w : parseIso(match[4], sign),                                                                         // 1949
                d : parseIso(match[5], sign),                                                                         // 1950
                h : parseIso(match[6], sign),                                                                         // 1951
                m : parseIso(match[7], sign),                                                                         // 1952
                s : parseIso(match[8], sign)                                                                          // 1953
            };                                                                                                        // 1954
        } else if (duration == null) {// checks for null or undefined                                                 // 1955
            duration = {};                                                                                            // 1956
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {                        // 1957
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));          // 1958
                                                                                                                      // 1959
            duration = {};                                                                                            // 1960
            duration.ms = diffRes.milliseconds;                                                                       // 1961
            duration.M = diffRes.months;                                                                              // 1962
        }                                                                                                             // 1963
                                                                                                                      // 1964
        ret = new Duration(duration);                                                                                 // 1965
                                                                                                                      // 1966
        if (isDuration(input) && hasOwnProp(input, '_locale')) {                                                      // 1967
            ret._locale = input._locale;                                                                              // 1968
        }                                                                                                             // 1969
                                                                                                                      // 1970
        return ret;                                                                                                   // 1971
    }                                                                                                                 // 1972
                                                                                                                      // 1973
    create__createDuration.fn = Duration.prototype;                                                                   // 1974
                                                                                                                      // 1975
    function parseIso (inp, sign) {                                                                                   // 1976
        // We'd normally use ~~inp for this, but unfortunately it also                                                // 1977
        // converts floats to ints.                                                                                   // 1978
        // inp may be undefined, so careful calling replace on it.                                                    // 1979
        var res = inp && parseFloat(inp.replace(',', '.'));                                                           // 1980
        // apply sign while we're at it                                                                               // 1981
        return (isNaN(res) ? 0 : res) * sign;                                                                         // 1982
    }                                                                                                                 // 1983
                                                                                                                      // 1984
    function positiveMomentsDifference(base, other) {                                                                 // 1985
        var res = {milliseconds: 0, months: 0};                                                                       // 1986
                                                                                                                      // 1987
        res.months = other.month() - base.month() +                                                                   // 1988
            (other.year() - base.year()) * 12;                                                                        // 1989
        if (base.clone().add(res.months, 'M').isAfter(other)) {                                                       // 1990
            --res.months;                                                                                             // 1991
        }                                                                                                             // 1992
                                                                                                                      // 1993
        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));                                             // 1994
                                                                                                                      // 1995
        return res;                                                                                                   // 1996
    }                                                                                                                 // 1997
                                                                                                                      // 1998
    function momentsDifference(base, other) {                                                                         // 1999
        var res;                                                                                                      // 2000
        if (!(base.isValid() && other.isValid())) {                                                                   // 2001
            return {milliseconds: 0, months: 0};                                                                      // 2002
        }                                                                                                             // 2003
                                                                                                                      // 2004
        other = cloneWithOffset(other, base);                                                                         // 2005
        if (base.isBefore(other)) {                                                                                   // 2006
            res = positiveMomentsDifference(base, other);                                                             // 2007
        } else {                                                                                                      // 2008
            res = positiveMomentsDifference(other, base);                                                             // 2009
            res.milliseconds = -res.milliseconds;                                                                     // 2010
            res.months = -res.months;                                                                                 // 2011
        }                                                                                                             // 2012
                                                                                                                      // 2013
        return res;                                                                                                   // 2014
    }                                                                                                                 // 2015
                                                                                                                      // 2016
    function absRound (number) {                                                                                      // 2017
        if (number < 0) {                                                                                             // 2018
            return Math.round(-1 * number) * -1;                                                                      // 2019
        } else {                                                                                                      // 2020
            return Math.round(number);                                                                                // 2021
        }                                                                                                             // 2022
    }                                                                                                                 // 2023
                                                                                                                      // 2024
    // TODO: remove 'name' arg after deprecation is removed                                                           // 2025
    function createAdder(direction, name) {                                                                           // 2026
        return function (val, period) {                                                                               // 2027
            var dur, tmp;                                                                                             // 2028
            //invert the arguments, but complain about it                                                             // 2029
            if (period !== null && !isNaN(+period)) {                                                                 // 2030
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;                                                                // 2032
            }                                                                                                         // 2033
                                                                                                                      // 2034
            val = typeof val === 'string' ? +val : val;                                                               // 2035
            dur = create__createDuration(val, period);                                                                // 2036
            add_subtract__addSubtract(this, dur, direction);                                                          // 2037
            return this;                                                                                              // 2038
        };                                                                                                            // 2039
    }                                                                                                                 // 2040
                                                                                                                      // 2041
    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {                                      // 2042
        var milliseconds = duration._milliseconds,                                                                    // 2043
            days = absRound(duration._days),                                                                          // 2044
            months = absRound(duration._months);                                                                      // 2045
                                                                                                                      // 2046
        if (!mom.isValid()) {                                                                                         // 2047
            // No op                                                                                                  // 2048
            return;                                                                                                   // 2049
        }                                                                                                             // 2050
                                                                                                                      // 2051
        updateOffset = updateOffset == null ? true : updateOffset;                                                    // 2052
                                                                                                                      // 2053
        if (milliseconds) {                                                                                           // 2054
            mom._d.setTime(+mom._d + milliseconds * isAdding);                                                        // 2055
        }                                                                                                             // 2056
        if (days) {                                                                                                   // 2057
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);                                   // 2058
        }                                                                                                             // 2059
        if (months) {                                                                                                 // 2060
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);                                            // 2061
        }                                                                                                             // 2062
        if (updateOffset) {                                                                                           // 2063
            utils_hooks__hooks.updateOffset(mom, days || months);                                                     // 2064
        }                                                                                                             // 2065
    }                                                                                                                 // 2066
                                                                                                                      // 2067
    var add_subtract__add      = createAdder(1, 'add');                                                               // 2068
    var add_subtract__subtract = createAdder(-1, 'subtract');                                                         // 2069
                                                                                                                      // 2070
    function moment_calendar__calendar (time, formats) {                                                              // 2071
        // We want to compare the start of today, vs this.                                                            // 2072
        // Getting start-of-today depends on whether we're local/utc/offset or not.                                   // 2073
        var now = time || local__createLocal(),                                                                       // 2074
            sod = cloneWithOffset(now, this).startOf('day'),                                                          // 2075
            diff = this.diff(sod, 'days', true),                                                                      // 2076
            format = diff < -6 ? 'sameElse' :                                                                         // 2077
                diff < -1 ? 'lastWeek' :                                                                              // 2078
                diff < 0 ? 'lastDay' :                                                                                // 2079
                diff < 1 ? 'sameDay' :                                                                                // 2080
                diff < 2 ? 'nextDay' :                                                                                // 2081
                diff < 7 ? 'nextWeek' : 'sameElse';                                                                   // 2082
                                                                                                                      // 2083
        var output = formats && (isFunction(formats[format]) ? formats[format]() : formats[format]);                  // 2084
                                                                                                                      // 2085
        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));              // 2086
    }                                                                                                                 // 2087
                                                                                                                      // 2088
    function clone () {                                                                                               // 2089
        return new Moment(this);                                                                                      // 2090
    }                                                                                                                 // 2091
                                                                                                                      // 2092
    function isAfter (input, units) {                                                                                 // 2093
        var localInput = isMoment(input) ? input : local__createLocal(input);                                         // 2094
        if (!(this.isValid() && localInput.isValid())) {                                                              // 2095
            return false;                                                                                             // 2096
        }                                                                                                             // 2097
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');                                          // 2098
        if (units === 'millisecond') {                                                                                // 2099
            return +this > +localInput;                                                                               // 2100
        } else {                                                                                                      // 2101
            return +localInput < +this.clone().startOf(units);                                                        // 2102
        }                                                                                                             // 2103
    }                                                                                                                 // 2104
                                                                                                                      // 2105
    function isBefore (input, units) {                                                                                // 2106
        var localInput = isMoment(input) ? input : local__createLocal(input);                                         // 2107
        if (!(this.isValid() && localInput.isValid())) {                                                              // 2108
            return false;                                                                                             // 2109
        }                                                                                                             // 2110
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');                                          // 2111
        if (units === 'millisecond') {                                                                                // 2112
            return +this < +localInput;                                                                               // 2113
        } else {                                                                                                      // 2114
            return +this.clone().endOf(units) < +localInput;                                                          // 2115
        }                                                                                                             // 2116
    }                                                                                                                 // 2117
                                                                                                                      // 2118
    function isBetween (from, to, units) {                                                                            // 2119
        return this.isAfter(from, units) && this.isBefore(to, units);                                                 // 2120
    }                                                                                                                 // 2121
                                                                                                                      // 2122
    function isSame (input, units) {                                                                                  // 2123
        var localInput = isMoment(input) ? input : local__createLocal(input),                                         // 2124
            inputMs;                                                                                                  // 2125
        if (!(this.isValid() && localInput.isValid())) {                                                              // 2126
            return false;                                                                                             // 2127
        }                                                                                                             // 2128
        units = normalizeUnits(units || 'millisecond');                                                               // 2129
        if (units === 'millisecond') {                                                                                // 2130
            return +this === +localInput;                                                                             // 2131
        } else {                                                                                                      // 2132
            inputMs = +localInput;                                                                                    // 2133
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));              // 2134
        }                                                                                                             // 2135
    }                                                                                                                 // 2136
                                                                                                                      // 2137
    function isSameOrAfter (input, units) {                                                                           // 2138
        return this.isSame(input, units) || this.isAfter(input,units);                                                // 2139
    }                                                                                                                 // 2140
                                                                                                                      // 2141
    function isSameOrBefore (input, units) {                                                                          // 2142
        return this.isSame(input, units) || this.isBefore(input,units);                                               // 2143
    }                                                                                                                 // 2144
                                                                                                                      // 2145
    function diff (input, units, asFloat) {                                                                           // 2146
        var that,                                                                                                     // 2147
            zoneDelta,                                                                                                // 2148
            delta, output;                                                                                            // 2149
                                                                                                                      // 2150
        if (!this.isValid()) {                                                                                        // 2151
            return NaN;                                                                                               // 2152
        }                                                                                                             // 2153
                                                                                                                      // 2154
        that = cloneWithOffset(input, this);                                                                          // 2155
                                                                                                                      // 2156
        if (!that.isValid()) {                                                                                        // 2157
            return NaN;                                                                                               // 2158
        }                                                                                                             // 2159
                                                                                                                      // 2160
        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;                                                      // 2161
                                                                                                                      // 2162
        units = normalizeUnits(units);                                                                                // 2163
                                                                                                                      // 2164
        if (units === 'year' || units === 'month' || units === 'quarter') {                                           // 2165
            output = monthDiff(this, that);                                                                           // 2166
            if (units === 'quarter') {                                                                                // 2167
                output = output / 3;                                                                                  // 2168
            } else if (units === 'year') {                                                                            // 2169
                output = output / 12;                                                                                 // 2170
            }                                                                                                         // 2171
        } else {                                                                                                      // 2172
            delta = this - that;                                                                                      // 2173
            output = units === 'second' ? delta / 1e3 : // 1000                                                       // 2174
                units === 'minute' ? delta / 6e4 : // 1000 * 60                                                       // 2175
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60                                                   // 2176
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst                    // 2177
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst              // 2178
                delta;                                                                                                // 2179
        }                                                                                                             // 2180
        return asFloat ? output : absFloor(output);                                                                   // 2181
    }                                                                                                                 // 2182
                                                                                                                      // 2183
    function monthDiff (a, b) {                                                                                       // 2184
        // difference in months                                                                                       // 2185
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),                                  // 2186
            // b is in (anchor - 1 month, anchor + 1 month)                                                           // 2187
            anchor = a.clone().add(wholeMonthDiff, 'months'),                                                         // 2188
            anchor2, adjust;                                                                                          // 2189
                                                                                                                      // 2190
        if (b - anchor < 0) {                                                                                         // 2191
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');                                                    // 2192
            // linear across the month                                                                                // 2193
            adjust = (b - anchor) / (anchor - anchor2);                                                               // 2194
        } else {                                                                                                      // 2195
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');                                                    // 2196
            // linear across the month                                                                                // 2197
            adjust = (b - anchor) / (anchor2 - anchor);                                                               // 2198
        }                                                                                                             // 2199
                                                                                                                      // 2200
        return -(wholeMonthDiff + adjust);                                                                            // 2201
    }                                                                                                                 // 2202
                                                                                                                      // 2203
    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';                                                        // 2204
                                                                                                                      // 2205
    function toString () {                                                                                            // 2206
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');                                  // 2207
    }                                                                                                                 // 2208
                                                                                                                      // 2209
    function moment_format__toISOString () {                                                                          // 2210
        var m = this.clone().utc();                                                                                   // 2211
        if (0 < m.year() && m.year() <= 9999) {                                                                       // 2212
            if (isFunction(Date.prototype.toISOString)) {                                                             // 2213
                // native implementation is ~50x faster, use it when we can                                           // 2214
                return this.toDate().toISOString();                                                                   // 2215
            } else {                                                                                                  // 2216
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');                                               // 2217
            }                                                                                                         // 2218
        } else {                                                                                                      // 2219
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');                                                 // 2220
        }                                                                                                             // 2221
    }                                                                                                                 // 2222
                                                                                                                      // 2223
    function format (inputString) {                                                                                   // 2224
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);                             // 2225
        return this.localeData().postformat(output);                                                                  // 2226
    }                                                                                                                 // 2227
                                                                                                                      // 2228
    function from (time, withoutSuffix) {                                                                             // 2229
        if (this.isValid() &&                                                                                         // 2230
                ((isMoment(time) && time.isValid()) ||                                                                // 2231
                 local__createLocal(time).isValid())) {                                                               // 2232
            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);     // 2233
        } else {                                                                                                      // 2234
            return this.localeData().invalidDate();                                                                   // 2235
        }                                                                                                             // 2236
    }                                                                                                                 // 2237
                                                                                                                      // 2238
    function fromNow (withoutSuffix) {                                                                                // 2239
        return this.from(local__createLocal(), withoutSuffix);                                                        // 2240
    }                                                                                                                 // 2241
                                                                                                                      // 2242
    function to (time, withoutSuffix) {                                                                               // 2243
        if (this.isValid() &&                                                                                         // 2244
                ((isMoment(time) && time.isValid()) ||                                                                // 2245
                 local__createLocal(time).isValid())) {                                                               // 2246
            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);     // 2247
        } else {                                                                                                      // 2248
            return this.localeData().invalidDate();                                                                   // 2249
        }                                                                                                             // 2250
    }                                                                                                                 // 2251
                                                                                                                      // 2252
    function toNow (withoutSuffix) {                                                                                  // 2253
        return this.to(local__createLocal(), withoutSuffix);                                                          // 2254
    }                                                                                                                 // 2255
                                                                                                                      // 2256
    // If passed a locale key, it will set the locale for this                                                        // 2257
    // instance.  Otherwise, it will return the locale configuration                                                  // 2258
    // variables for this instance.                                                                                   // 2259
    function locale (key) {                                                                                           // 2260
        var newLocaleData;                                                                                            // 2261
                                                                                                                      // 2262
        if (key === undefined) {                                                                                      // 2263
            return this._locale._abbr;                                                                                // 2264
        } else {                                                                                                      // 2265
            newLocaleData = locale_locales__getLocale(key);                                                           // 2266
            if (newLocaleData != null) {                                                                              // 2267
                this._locale = newLocaleData;                                                                         // 2268
            }                                                                                                         // 2269
            return this;                                                                                              // 2270
        }                                                                                                             // 2271
    }                                                                                                                 // 2272
                                                                                                                      // 2273
    var lang = deprecate(                                                                                             // 2274
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {                                                                                              // 2276
            if (key === undefined) {                                                                                  // 2277
                return this.localeData();                                                                             // 2278
            } else {                                                                                                  // 2279
                return this.locale(key);                                                                              // 2280
            }                                                                                                         // 2281
        }                                                                                                             // 2282
    );                                                                                                                // 2283
                                                                                                                      // 2284
    function localeData () {                                                                                          // 2285
        return this._locale;                                                                                          // 2286
    }                                                                                                                 // 2287
                                                                                                                      // 2288
    function startOf (units) {                                                                                        // 2289
        units = normalizeUnits(units);                                                                                // 2290
        // the following switch intentionally omits break keywords                                                    // 2291
        // to utilize falling through the cases.                                                                      // 2292
        switch (units) {                                                                                              // 2293
        case 'year':                                                                                                  // 2294
            this.month(0);                                                                                            // 2295
            /* falls through */                                                                                       // 2296
        case 'quarter':                                                                                               // 2297
        case 'month':                                                                                                 // 2298
            this.date(1);                                                                                             // 2299
            /* falls through */                                                                                       // 2300
        case 'week':                                                                                                  // 2301
        case 'isoWeek':                                                                                               // 2302
        case 'day':                                                                                                   // 2303
            this.hours(0);                                                                                            // 2304
            /* falls through */                                                                                       // 2305
        case 'hour':                                                                                                  // 2306
            this.minutes(0);                                                                                          // 2307
            /* falls through */                                                                                       // 2308
        case 'minute':                                                                                                // 2309
            this.seconds(0);                                                                                          // 2310
            /* falls through */                                                                                       // 2311
        case 'second':                                                                                                // 2312
            this.milliseconds(0);                                                                                     // 2313
        }                                                                                                             // 2314
                                                                                                                      // 2315
        // weeks are a special case                                                                                   // 2316
        if (units === 'week') {                                                                                       // 2317
            this.weekday(0);                                                                                          // 2318
        }                                                                                                             // 2319
        if (units === 'isoWeek') {                                                                                    // 2320
            this.isoWeekday(1);                                                                                       // 2321
        }                                                                                                             // 2322
                                                                                                                      // 2323
        // quarters are also special                                                                                  // 2324
        if (units === 'quarter') {                                                                                    // 2325
            this.month(Math.floor(this.month() / 3) * 3);                                                             // 2326
        }                                                                                                             // 2327
                                                                                                                      // 2328
        return this;                                                                                                  // 2329
    }                                                                                                                 // 2330
                                                                                                                      // 2331
    function endOf (units) {                                                                                          // 2332
        units = normalizeUnits(units);                                                                                // 2333
        if (units === undefined || units === 'millisecond') {                                                         // 2334
            return this;                                                                                              // 2335
        }                                                                                                             // 2336
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');                  // 2337
    }                                                                                                                 // 2338
                                                                                                                      // 2339
    function to_type__valueOf () {                                                                                    // 2340
        return +this._d - ((this._offset || 0) * 60000);                                                              // 2341
    }                                                                                                                 // 2342
                                                                                                                      // 2343
    function unix () {                                                                                                // 2344
        return Math.floor(+this / 1000);                                                                              // 2345
    }                                                                                                                 // 2346
                                                                                                                      // 2347
    function toDate () {                                                                                              // 2348
        return this._offset ? new Date(+this) : this._d;                                                              // 2349
    }                                                                                                                 // 2350
                                                                                                                      // 2351
    function toArray () {                                                                                             // 2352
        var m = this;                                                                                                 // 2353
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];                    // 2354
    }                                                                                                                 // 2355
                                                                                                                      // 2356
    function toObject () {                                                                                            // 2357
        var m = this;                                                                                                 // 2358
        return {                                                                                                      // 2359
            years: m.year(),                                                                                          // 2360
            months: m.month(),                                                                                        // 2361
            date: m.date(),                                                                                           // 2362
            hours: m.hours(),                                                                                         // 2363
            minutes: m.minutes(),                                                                                     // 2364
            seconds: m.seconds(),                                                                                     // 2365
            milliseconds: m.milliseconds()                                                                            // 2366
        };                                                                                                            // 2367
    }                                                                                                                 // 2368
                                                                                                                      // 2369
    function toJSON () {                                                                                              // 2370
        // new Date(NaN).toJSON() === null                                                                            // 2371
        return this.isValid() ? this.toISOString() : null;                                                            // 2372
    }                                                                                                                 // 2373
                                                                                                                      // 2374
    function moment_valid__isValid () {                                                                               // 2375
        return valid__isValid(this);                                                                                  // 2376
    }                                                                                                                 // 2377
                                                                                                                      // 2378
    function parsingFlags () {                                                                                        // 2379
        return extend({}, getParsingFlags(this));                                                                     // 2380
    }                                                                                                                 // 2381
                                                                                                                      // 2382
    function invalidAt () {                                                                                           // 2383
        return getParsingFlags(this).overflow;                                                                        // 2384
    }                                                                                                                 // 2385
                                                                                                                      // 2386
    function creationData() {                                                                                         // 2387
        return {                                                                                                      // 2388
            input: this._i,                                                                                           // 2389
            format: this._f,                                                                                          // 2390
            locale: this._locale,                                                                                     // 2391
            isUTC: this._isUTC,                                                                                       // 2392
            strict: this._strict                                                                                      // 2393
        };                                                                                                            // 2394
    }                                                                                                                 // 2395
                                                                                                                      // 2396
    // FORMATTING                                                                                                     // 2397
                                                                                                                      // 2398
    addFormatToken(0, ['gg', 2], 0, function () {                                                                     // 2399
        return this.weekYear() % 100;                                                                                 // 2400
    });                                                                                                               // 2401
                                                                                                                      // 2402
    addFormatToken(0, ['GG', 2], 0, function () {                                                                     // 2403
        return this.isoWeekYear() % 100;                                                                              // 2404
    });                                                                                                               // 2405
                                                                                                                      // 2406
    function addWeekYearFormatToken (token, getter) {                                                                 // 2407
        addFormatToken(0, [token, token.length], 0, getter);                                                          // 2408
    }                                                                                                                 // 2409
                                                                                                                      // 2410
    addWeekYearFormatToken('gggg',     'weekYear');                                                                   // 2411
    addWeekYearFormatToken('ggggg',    'weekYear');                                                                   // 2412
    addWeekYearFormatToken('GGGG',  'isoWeekYear');                                                                   // 2413
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');                                                                   // 2414
                                                                                                                      // 2415
    // ALIASES                                                                                                        // 2416
                                                                                                                      // 2417
    addUnitAlias('weekYear', 'gg');                                                                                   // 2418
    addUnitAlias('isoWeekYear', 'GG');                                                                                // 2419
                                                                                                                      // 2420
    // PARSING                                                                                                        // 2421
                                                                                                                      // 2422
    addRegexToken('G',      matchSigned);                                                                             // 2423
    addRegexToken('g',      matchSigned);                                                                             // 2424
    addRegexToken('GG',     match1to2, match2);                                                                       // 2425
    addRegexToken('gg',     match1to2, match2);                                                                       // 2426
    addRegexToken('GGGG',   match1to4, match4);                                                                       // 2427
    addRegexToken('gggg',   match1to4, match4);                                                                       // 2428
    addRegexToken('GGGGG',  match1to6, match6);                                                                       // 2429
    addRegexToken('ggggg',  match1to6, match6);                                                                       // 2430
                                                                                                                      // 2431
    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {                     // 2432
        week[token.substr(0, 2)] = toInt(input);                                                                      // 2433
    });                                                                                                               // 2434
                                                                                                                      // 2435
    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {                                           // 2436
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);                                                    // 2437
    });                                                                                                               // 2438
                                                                                                                      // 2439
    // MOMENTS                                                                                                        // 2440
                                                                                                                      // 2441
    function getSetWeekYear (input) {                                                                                 // 2442
        return getSetWeekYearHelper.call(this,                                                                        // 2443
                input,                                                                                                // 2444
                this.week(),                                                                                          // 2445
                this.weekday(),                                                                                       // 2446
                this.localeData()._week.dow,                                                                          // 2447
                this.localeData()._week.doy);                                                                         // 2448
    }                                                                                                                 // 2449
                                                                                                                      // 2450
    function getSetISOWeekYear (input) {                                                                              // 2451
        return getSetWeekYearHelper.call(this,                                                                        // 2452
                input, this.isoWeek(), this.isoWeekday(), 1, 4);                                                      // 2453
    }                                                                                                                 // 2454
                                                                                                                      // 2455
    function getISOWeeksInYear () {                                                                                   // 2456
        return weeksInYear(this.year(), 1, 4);                                                                        // 2457
    }                                                                                                                 // 2458
                                                                                                                      // 2459
    function getWeeksInYear () {                                                                                      // 2460
        var weekInfo = this.localeData()._week;                                                                       // 2461
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);                                                  // 2462
    }                                                                                                                 // 2463
                                                                                                                      // 2464
    function getSetWeekYearHelper(input, week, weekday, dow, doy) {                                                   // 2465
        var weeksTarget;                                                                                              // 2466
        if (input == null) {                                                                                          // 2467
            return weekOfYear(this, dow, doy).year;                                                                   // 2468
        } else {                                                                                                      // 2469
            weeksTarget = weeksInYear(input, dow, doy);                                                               // 2470
            if (week > weeksTarget) {                                                                                 // 2471
                week = weeksTarget;                                                                                   // 2472
            }                                                                                                         // 2473
            return setWeekAll.call(this, input, week, weekday, dow, doy);                                             // 2474
        }                                                                                                             // 2475
    }                                                                                                                 // 2476
                                                                                                                      // 2477
    function setWeekAll(weekYear, week, weekday, dow, doy) {                                                          // 2478
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),                                    // 2479
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);                                     // 2480
                                                                                                                      // 2481
        this.year(date.getUTCFullYear());                                                                             // 2482
        this.month(date.getUTCMonth());                                                                               // 2483
        this.date(date.getUTCDate());                                                                                 // 2484
        return this;                                                                                                  // 2485
    }                                                                                                                 // 2486
                                                                                                                      // 2487
    // FORMATTING                                                                                                     // 2488
                                                                                                                      // 2489
    addFormatToken('Q', 0, 'Qo', 'quarter');                                                                          // 2490
                                                                                                                      // 2491
    // ALIASES                                                                                                        // 2492
                                                                                                                      // 2493
    addUnitAlias('quarter', 'Q');                                                                                     // 2494
                                                                                                                      // 2495
    // PARSING                                                                                                        // 2496
                                                                                                                      // 2497
    addRegexToken('Q', match1);                                                                                       // 2498
    addParseToken('Q', function (input, array) {                                                                      // 2499
        array[MONTH] = (toInt(input) - 1) * 3;                                                                        // 2500
    });                                                                                                               // 2501
                                                                                                                      // 2502
    // MOMENTS                                                                                                        // 2503
                                                                                                                      // 2504
    function getSetQuarter (input) {                                                                                  // 2505
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);    // 2506
    }                                                                                                                 // 2507
                                                                                                                      // 2508
    // FORMATTING                                                                                                     // 2509
                                                                                                                      // 2510
    addFormatToken('w', ['ww', 2], 'wo', 'week');                                                                     // 2511
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');                                                                  // 2512
                                                                                                                      // 2513
    // ALIASES                                                                                                        // 2514
                                                                                                                      // 2515
    addUnitAlias('week', 'w');                                                                                        // 2516
    addUnitAlias('isoWeek', 'W');                                                                                     // 2517
                                                                                                                      // 2518
    // PARSING                                                                                                        // 2519
                                                                                                                      // 2520
    addRegexToken('w',  match1to2);                                                                                   // 2521
    addRegexToken('ww', match1to2, match2);                                                                           // 2522
    addRegexToken('W',  match1to2);                                                                                   // 2523
    addRegexToken('WW', match1to2, match2);                                                                           // 2524
                                                                                                                      // 2525
    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {                                 // 2526
        week[token.substr(0, 1)] = toInt(input);                                                                      // 2527
    });                                                                                                               // 2528
                                                                                                                      // 2529
    // HELPERS                                                                                                        // 2530
                                                                                                                      // 2531
    // LOCALES                                                                                                        // 2532
                                                                                                                      // 2533
    function localeWeek (mom) {                                                                                       // 2534
        return weekOfYear(mom, this._week.dow, this._week.doy).week;                                                  // 2535
    }                                                                                                                 // 2536
                                                                                                                      // 2537
    var defaultLocaleWeek = {                                                                                         // 2538
        dow : 0, // Sunday is the first day of the week.                                                              // 2539
        doy : 6  // The week that contains Jan 1st is the first week of the year.                                     // 2540
    };                                                                                                                // 2541
                                                                                                                      // 2542
    function localeFirstDayOfWeek () {                                                                                // 2543
        return this._week.dow;                                                                                        // 2544
    }                                                                                                                 // 2545
                                                                                                                      // 2546
    function localeFirstDayOfYear () {                                                                                // 2547
        return this._week.doy;                                                                                        // 2548
    }                                                                                                                 // 2549
                                                                                                                      // 2550
    // MOMENTS                                                                                                        // 2551
                                                                                                                      // 2552
    function getSetWeek (input) {                                                                                     // 2553
        var week = this.localeData().week(this);                                                                      // 2554
        return input == null ? week : this.add((input - week) * 7, 'd');                                              // 2555
    }                                                                                                                 // 2556
                                                                                                                      // 2557
    function getSetISOWeek (input) {                                                                                  // 2558
        var week = weekOfYear(this, 1, 4).week;                                                                       // 2559
        return input == null ? week : this.add((input - week) * 7, 'd');                                              // 2560
    }                                                                                                                 // 2561
                                                                                                                      // 2562
    // FORMATTING                                                                                                     // 2563
                                                                                                                      // 2564
    addFormatToken('D', ['DD', 2], 'Do', 'date');                                                                     // 2565
                                                                                                                      // 2566
    // ALIASES                                                                                                        // 2567
                                                                                                                      // 2568
    addUnitAlias('date', 'D');                                                                                        // 2569
                                                                                                                      // 2570
    // PARSING                                                                                                        // 2571
                                                                                                                      // 2572
    addRegexToken('D',  match1to2);                                                                                   // 2573
    addRegexToken('DD', match1to2, match2);                                                                           // 2574
    addRegexToken('Do', function (isStrict, locale) {                                                                 // 2575
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;                                         // 2576
    });                                                                                                               // 2577
                                                                                                                      // 2578
    addParseToken(['D', 'DD'], DATE);                                                                                 // 2579
    addParseToken('Do', function (input, array) {                                                                     // 2580
        array[DATE] = toInt(input.match(match1to2)[0], 10);                                                           // 2581
    });                                                                                                               // 2582
                                                                                                                      // 2583
    // MOMENTS                                                                                                        // 2584
                                                                                                                      // 2585
    var getSetDayOfMonth = makeGetSet('Date', true);                                                                  // 2586
                                                                                                                      // 2587
    // FORMATTING                                                                                                     // 2588
                                                                                                                      // 2589
    addFormatToken('d', 0, 'do', 'day');                                                                              // 2590
                                                                                                                      // 2591
    addFormatToken('dd', 0, 0, function (format) {                                                                    // 2592
        return this.localeData().weekdaysMin(this, format);                                                           // 2593
    });                                                                                                               // 2594
                                                                                                                      // 2595
    addFormatToken('ddd', 0, 0, function (format) {                                                                   // 2596
        return this.localeData().weekdaysShort(this, format);                                                         // 2597
    });                                                                                                               // 2598
                                                                                                                      // 2599
    addFormatToken('dddd', 0, 0, function (format) {                                                                  // 2600
        return this.localeData().weekdays(this, format);                                                              // 2601
    });                                                                                                               // 2602
                                                                                                                      // 2603
    addFormatToken('e', 0, 0, 'weekday');                                                                             // 2604
    addFormatToken('E', 0, 0, 'isoWeekday');                                                                          // 2605
                                                                                                                      // 2606
    // ALIASES                                                                                                        // 2607
                                                                                                                      // 2608
    addUnitAlias('day', 'd');                                                                                         // 2609
    addUnitAlias('weekday', 'e');                                                                                     // 2610
    addUnitAlias('isoWeekday', 'E');                                                                                  // 2611
                                                                                                                      // 2612
    // PARSING                                                                                                        // 2613
                                                                                                                      // 2614
    addRegexToken('d',    match1to2);                                                                                 // 2615
    addRegexToken('e',    match1to2);                                                                                 // 2616
    addRegexToken('E',    match1to2);                                                                                 // 2617
    addRegexToken('dd',   matchWord);                                                                                 // 2618
    addRegexToken('ddd',  matchWord);                                                                                 // 2619
    addRegexToken('dddd', matchWord);                                                                                 // 2620
                                                                                                                      // 2621
    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {                                  // 2622
        var weekday = config._locale.weekdaysParse(input, token, config._strict);                                     // 2623
        // if we didn't get a weekday name, mark the date as invalid                                                  // 2624
        if (weekday != null) {                                                                                        // 2625
            week.d = weekday;                                                                                         // 2626
        } else {                                                                                                      // 2627
            getParsingFlags(config).invalidWeekday = input;                                                           // 2628
        }                                                                                                             // 2629
    });                                                                                                               // 2630
                                                                                                                      // 2631
    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {                                        // 2632
        week[token] = toInt(input);                                                                                   // 2633
    });                                                                                                               // 2634
                                                                                                                      // 2635
    // HELPERS                                                                                                        // 2636
                                                                                                                      // 2637
    function parseWeekday(input, locale) {                                                                            // 2638
        if (typeof input !== 'string') {                                                                              // 2639
            return input;                                                                                             // 2640
        }                                                                                                             // 2641
                                                                                                                      // 2642
        if (!isNaN(input)) {                                                                                          // 2643
            return parseInt(input, 10);                                                                               // 2644
        }                                                                                                             // 2645
                                                                                                                      // 2646
        input = locale.weekdaysParse(input);                                                                          // 2647
        if (typeof input === 'number') {                                                                              // 2648
            return input;                                                                                             // 2649
        }                                                                                                             // 2650
                                                                                                                      // 2651
        return null;                                                                                                  // 2652
    }                                                                                                                 // 2653
                                                                                                                      // 2654
    // LOCALES                                                                                                        // 2655
                                                                                                                      // 2656
    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');                // 2657
    function localeWeekdays (m, format) {                                                                             // 2658
        return isArray(this._weekdays) ? this._weekdays[m.day()] :                                                    // 2659
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];                  // 2660
    }                                                                                                                 // 2661
                                                                                                                      // 2662
    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');                                        // 2663
    function localeWeekdaysShort (m) {                                                                                // 2664
        return this._weekdaysShort[m.day()];                                                                          // 2665
    }                                                                                                                 // 2666
                                                                                                                      // 2667
    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');                                                 // 2668
    function localeWeekdaysMin (m) {                                                                                  // 2669
        return this._weekdaysMin[m.day()];                                                                            // 2670
    }                                                                                                                 // 2671
                                                                                                                      // 2672
    function localeWeekdaysParse (weekdayName, format, strict) {                                                      // 2673
        var i, mom, regex;                                                                                            // 2674
                                                                                                                      // 2675
        if (!this._weekdaysParse) {                                                                                   // 2676
            this._weekdaysParse = [];                                                                                 // 2677
            this._minWeekdaysParse = [];                                                                              // 2678
            this._shortWeekdaysParse = [];                                                                            // 2679
            this._fullWeekdaysParse = [];                                                                             // 2680
        }                                                                                                             // 2681
                                                                                                                      // 2682
        for (i = 0; i < 7; i++) {                                                                                     // 2683
            // make the regex if we don't have it already                                                             // 2684
                                                                                                                      // 2685
            mom = local__createLocal([2000, 1]).day(i);                                                               // 2686
            if (strict && !this._fullWeekdaysParse[i]) {                                                              // 2687
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }                                                                                                         // 2691
            if (!this._weekdaysParse[i]) {                                                                            // 2692
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');                                     // 2694
            }                                                                                                         // 2695
            // test the regex                                                                                         // 2696
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {                        // 2697
                return i;                                                                                             // 2698
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {                 // 2699
                return i;                                                                                             // 2700
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {                    // 2701
                return i;                                                                                             // 2702
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {                                         // 2703
                return i;                                                                                             // 2704
            }                                                                                                         // 2705
        }                                                                                                             // 2706
    }                                                                                                                 // 2707
                                                                                                                      // 2708
    // MOMENTS                                                                                                        // 2709
                                                                                                                      // 2710
    function getSetDayOfWeek (input) {                                                                                // 2711
        if (!this.isValid()) {                                                                                        // 2712
            return input != null ? this : NaN;                                                                        // 2713
        }                                                                                                             // 2714
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();                                               // 2715
        if (input != null) {                                                                                          // 2716
            input = parseWeekday(input, this.localeData());                                                           // 2717
            return this.add(input - day, 'd');                                                                        // 2718
        } else {                                                                                                      // 2719
            return day;                                                                                               // 2720
        }                                                                                                             // 2721
    }                                                                                                                 // 2722
                                                                                                                      // 2723
    function getSetLocaleDayOfWeek (input) {                                                                          // 2724
        if (!this.isValid()) {                                                                                        // 2725
            return input != null ? this : NaN;                                                                        // 2726
        }                                                                                                             // 2727
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;                                             // 2728
        return input == null ? weekday : this.add(input - weekday, 'd');                                              // 2729
    }                                                                                                                 // 2730
                                                                                                                      // 2731
    function getSetISODayOfWeek (input) {                                                                             // 2732
        if (!this.isValid()) {                                                                                        // 2733
            return input != null ? this : NaN;                                                                        // 2734
        }                                                                                                             // 2735
        // behaves the same as moment#day except                                                                      // 2736
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)                                             // 2737
        // as a setter, sunday should belong to the previous week.                                                    // 2738
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);                        // 2739
    }                                                                                                                 // 2740
                                                                                                                      // 2741
    // FORMATTING                                                                                                     // 2742
                                                                                                                      // 2743
    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');                                                          // 2744
                                                                                                                      // 2745
    // ALIASES                                                                                                        // 2746
                                                                                                                      // 2747
    addUnitAlias('dayOfYear', 'DDD');                                                                                 // 2748
                                                                                                                      // 2749
    // PARSING                                                                                                        // 2750
                                                                                                                      // 2751
    addRegexToken('DDD',  match1to3);                                                                                 // 2752
    addRegexToken('DDDD', match3);                                                                                    // 2753
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {                                                  // 2754
        config._dayOfYear = toInt(input);                                                                             // 2755
    });                                                                                                               // 2756
                                                                                                                      // 2757
    // HELPERS                                                                                                        // 2758
                                                                                                                      // 2759
    // MOMENTS                                                                                                        // 2760
                                                                                                                      // 2761
    function getSetDayOfYear (input) {                                                                                // 2762
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;         // 2763
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');                                        // 2764
    }                                                                                                                 // 2765
                                                                                                                      // 2766
    // FORMATTING                                                                                                     // 2767
                                                                                                                      // 2768
    function hFormat() {                                                                                              // 2769
        return this.hours() % 12 || 12;                                                                               // 2770
    }                                                                                                                 // 2771
                                                                                                                      // 2772
    addFormatToken('H', ['HH', 2], 0, 'hour');                                                                        // 2773
    addFormatToken('h', ['hh', 2], 0, hFormat);                                                                       // 2774
                                                                                                                      // 2775
    addFormatToken('hmm', 0, 0, function () {                                                                         // 2776
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);                                                // 2777
    });                                                                                                               // 2778
                                                                                                                      // 2779
    addFormatToken('hmmss', 0, 0, function () {                                                                       // 2780
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +                                               // 2781
            zeroFill(this.seconds(), 2);                                                                              // 2782
    });                                                                                                               // 2783
                                                                                                                      // 2784
    addFormatToken('Hmm', 0, 0, function () {                                                                         // 2785
        return '' + this.hours() + zeroFill(this.minutes(), 2);                                                       // 2786
    });                                                                                                               // 2787
                                                                                                                      // 2788
    addFormatToken('Hmmss', 0, 0, function () {                                                                       // 2789
        return '' + this.hours() + zeroFill(this.minutes(), 2) +                                                      // 2790
            zeroFill(this.seconds(), 2);                                                                              // 2791
    });                                                                                                               // 2792
                                                                                                                      // 2793
    function meridiem (token, lowercase) {                                                                            // 2794
        addFormatToken(token, 0, 0, function () {                                                                     // 2795
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);                               // 2796
        });                                                                                                           // 2797
    }                                                                                                                 // 2798
                                                                                                                      // 2799
    meridiem('a', true);                                                                                              // 2800
    meridiem('A', false);                                                                                             // 2801
                                                                                                                      // 2802
    // ALIASES                                                                                                        // 2803
                                                                                                                      // 2804
    addUnitAlias('hour', 'h');                                                                                        // 2805
                                                                                                                      // 2806
    // PARSING                                                                                                        // 2807
                                                                                                                      // 2808
    function matchMeridiem (isStrict, locale) {                                                                       // 2809
        return locale._meridiemParse;                                                                                 // 2810
    }                                                                                                                 // 2811
                                                                                                                      // 2812
    addRegexToken('a',  matchMeridiem);                                                                               // 2813
    addRegexToken('A',  matchMeridiem);                                                                               // 2814
    addRegexToken('H',  match1to2);                                                                                   // 2815
    addRegexToken('h',  match1to2);                                                                                   // 2816
    addRegexToken('HH', match1to2, match2);                                                                           // 2817
    addRegexToken('hh', match1to2, match2);                                                                           // 2818
                                                                                                                      // 2819
    addRegexToken('hmm', match3to4);                                                                                  // 2820
    addRegexToken('hmmss', match5to6);                                                                                // 2821
    addRegexToken('Hmm', match3to4);                                                                                  // 2822
    addRegexToken('Hmmss', match5to6);                                                                                // 2823
                                                                                                                      // 2824
    addParseToken(['H', 'HH'], HOUR);                                                                                 // 2825
    addParseToken(['a', 'A'], function (input, array, config) {                                                       // 2826
        config._isPm = config._locale.isPM(input);                                                                    // 2827
        config._meridiem = input;                                                                                     // 2828
    });                                                                                                               // 2829
    addParseToken(['h', 'hh'], function (input, array, config) {                                                      // 2830
        array[HOUR] = toInt(input);                                                                                   // 2831
        getParsingFlags(config).bigHour = true;                                                                       // 2832
    });                                                                                                               // 2833
    addParseToken('hmm', function (input, array, config) {                                                            // 2834
        var pos = input.length - 2;                                                                                   // 2835
        array[HOUR] = toInt(input.substr(0, pos));                                                                    // 2836
        array[MINUTE] = toInt(input.substr(pos));                                                                     // 2837
        getParsingFlags(config).bigHour = true;                                                                       // 2838
    });                                                                                                               // 2839
    addParseToken('hmmss', function (input, array, config) {                                                          // 2840
        var pos1 = input.length - 4;                                                                                  // 2841
        var pos2 = input.length - 2;                                                                                  // 2842
        array[HOUR] = toInt(input.substr(0, pos1));                                                                   // 2843
        array[MINUTE] = toInt(input.substr(pos1, 2));                                                                 // 2844
        array[SECOND] = toInt(input.substr(pos2));                                                                    // 2845
        getParsingFlags(config).bigHour = true;                                                                       // 2846
    });                                                                                                               // 2847
    addParseToken('Hmm', function (input, array, config) {                                                            // 2848
        var pos = input.length - 2;                                                                                   // 2849
        array[HOUR] = toInt(input.substr(0, pos));                                                                    // 2850
        array[MINUTE] = toInt(input.substr(pos));                                                                     // 2851
    });                                                                                                               // 2852
    addParseToken('Hmmss', function (input, array, config) {                                                          // 2853
        var pos1 = input.length - 4;                                                                                  // 2854
        var pos2 = input.length - 2;                                                                                  // 2855
        array[HOUR] = toInt(input.substr(0, pos1));                                                                   // 2856
        array[MINUTE] = toInt(input.substr(pos1, 2));                                                                 // 2857
        array[SECOND] = toInt(input.substr(pos2));                                                                    // 2858
    });                                                                                                               // 2859
                                                                                                                      // 2860
    // LOCALES                                                                                                        // 2861
                                                                                                                      // 2862
    function localeIsPM (input) {                                                                                     // 2863
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays                            // 2864
        // Using charAt should be more compatible.                                                                    // 2865
        return ((input + '').toLowerCase().charAt(0) === 'p');                                                        // 2866
    }                                                                                                                 // 2867
                                                                                                                      // 2868
    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;                                                                 // 2869
    function localeMeridiem (hours, minutes, isLower) {                                                               // 2870
        if (hours > 11) {                                                                                             // 2871
            return isLower ? 'pm' : 'PM';                                                                             // 2872
        } else {                                                                                                      // 2873
            return isLower ? 'am' : 'AM';                                                                             // 2874
        }                                                                                                             // 2875
    }                                                                                                                 // 2876
                                                                                                                      // 2877
                                                                                                                      // 2878
    // MOMENTS                                                                                                        // 2879
                                                                                                                      // 2880
    // Setting the hour should keep the time, because the user explicitly                                             // 2881
    // specified which hour he wants. So trying to maintain the same hour (in                                         // 2882
    // a new timezone) makes sense. Adding/subtracting hours does not follow                                          // 2883
    // this rule.                                                                                                     // 2884
    var getSetHour = makeGetSet('Hours', true);                                                                       // 2885
                                                                                                                      // 2886
    // FORMATTING                                                                                                     // 2887
                                                                                                                      // 2888
    addFormatToken('m', ['mm', 2], 0, 'minute');                                                                      // 2889
                                                                                                                      // 2890
    // ALIASES                                                                                                        // 2891
                                                                                                                      // 2892
    addUnitAlias('minute', 'm');                                                                                      // 2893
                                                                                                                      // 2894
    // PARSING                                                                                                        // 2895
                                                                                                                      // 2896
    addRegexToken('m',  match1to2);                                                                                   // 2897
    addRegexToken('mm', match1to2, match2);                                                                           // 2898
    addParseToken(['m', 'mm'], MINUTE);                                                                               // 2899
                                                                                                                      // 2900
    // MOMENTS                                                                                                        // 2901
                                                                                                                      // 2902
    var getSetMinute = makeGetSet('Minutes', false);                                                                  // 2903
                                                                                                                      // 2904
    // FORMATTING                                                                                                     // 2905
                                                                                                                      // 2906
    addFormatToken('s', ['ss', 2], 0, 'second');                                                                      // 2907
                                                                                                                      // 2908
    // ALIASES                                                                                                        // 2909
                                                                                                                      // 2910
    addUnitAlias('second', 's');                                                                                      // 2911
                                                                                                                      // 2912
    // PARSING                                                                                                        // 2913
                                                                                                                      // 2914
    addRegexToken('s',  match1to2);                                                                                   // 2915
    addRegexToken('ss', match1to2, match2);                                                                           // 2916
    addParseToken(['s', 'ss'], SECOND);                                                                               // 2917
                                                                                                                      // 2918
    // MOMENTS                                                                                                        // 2919
                                                                                                                      // 2920
    var getSetSecond = makeGetSet('Seconds', false);                                                                  // 2921
                                                                                                                      // 2922
    // FORMATTING                                                                                                     // 2923
                                                                                                                      // 2924
    addFormatToken('S', 0, 0, function () {                                                                           // 2925
        return ~~(this.millisecond() / 100);                                                                          // 2926
    });                                                                                                               // 2927
                                                                                                                      // 2928
    addFormatToken(0, ['SS', 2], 0, function () {                                                                     // 2929
        return ~~(this.millisecond() / 10);                                                                           // 2930
    });                                                                                                               // 2931
                                                                                                                      // 2932
    addFormatToken(0, ['SSS', 3], 0, 'millisecond');                                                                  // 2933
    addFormatToken(0, ['SSSS', 4], 0, function () {                                                                   // 2934
        return this.millisecond() * 10;                                                                               // 2935
    });                                                                                                               // 2936
    addFormatToken(0, ['SSSSS', 5], 0, function () {                                                                  // 2937
        return this.millisecond() * 100;                                                                              // 2938
    });                                                                                                               // 2939
    addFormatToken(0, ['SSSSSS', 6], 0, function () {                                                                 // 2940
        return this.millisecond() * 1000;                                                                             // 2941
    });                                                                                                               // 2942
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {                                                                // 2943
        return this.millisecond() * 10000;                                                                            // 2944
    });                                                                                                               // 2945
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {                                                               // 2946
        return this.millisecond() * 100000;                                                                           // 2947
    });                                                                                                               // 2948
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {                                                              // 2949
        return this.millisecond() * 1000000;                                                                          // 2950
    });                                                                                                               // 2951
                                                                                                                      // 2952
                                                                                                                      // 2953
    // ALIASES                                                                                                        // 2954
                                                                                                                      // 2955
    addUnitAlias('millisecond', 'ms');                                                                                // 2956
                                                                                                                      // 2957
    // PARSING                                                                                                        // 2958
                                                                                                                      // 2959
    addRegexToken('S',    match1to3, match1);                                                                         // 2960
    addRegexToken('SS',   match1to3, match2);                                                                         // 2961
    addRegexToken('SSS',  match1to3, match3);                                                                         // 2962
                                                                                                                      // 2963
    var token;                                                                                                        // 2964
    for (token = 'SSSS'; token.length <= 9; token += 'S') {                                                           // 2965
        addRegexToken(token, matchUnsigned);                                                                          // 2966
    }                                                                                                                 // 2967
                                                                                                                      // 2968
    function parseMs(input, array) {                                                                                  // 2969
        array[MILLISECOND] = toInt(('0.' + input) * 1000);                                                            // 2970
    }                                                                                                                 // 2971
                                                                                                                      // 2972
    for (token = 'S'; token.length <= 9; token += 'S') {                                                              // 2973
        addParseToken(token, parseMs);                                                                                // 2974
    }                                                                                                                 // 2975
    // MOMENTS                                                                                                        // 2976
                                                                                                                      // 2977
    var getSetMillisecond = makeGetSet('Milliseconds', false);                                                        // 2978
                                                                                                                      // 2979
    // FORMATTING                                                                                                     // 2980
                                                                                                                      // 2981
    addFormatToken('z',  0, 0, 'zoneAbbr');                                                                           // 2982
    addFormatToken('zz', 0, 0, 'zoneName');                                                                           // 2983
                                                                                                                      // 2984
    // MOMENTS                                                                                                        // 2985
                                                                                                                      // 2986
    function getZoneAbbr () {                                                                                         // 2987
        return this._isUTC ? 'UTC' : '';                                                                              // 2988
    }                                                                                                                 // 2989
                                                                                                                      // 2990
    function getZoneName () {                                                                                         // 2991
        return this._isUTC ? 'Coordinated Universal Time' : '';                                                       // 2992
    }                                                                                                                 // 2993
                                                                                                                      // 2994
    var momentPrototype__proto = Moment.prototype;                                                                    // 2995
                                                                                                                      // 2996
    momentPrototype__proto.add               = add_subtract__add;                                                     // 2997
    momentPrototype__proto.calendar          = moment_calendar__calendar;                                             // 2998
    momentPrototype__proto.clone             = clone;                                                                 // 2999
    momentPrototype__proto.diff              = diff;                                                                  // 3000
    momentPrototype__proto.endOf             = endOf;                                                                 // 3001
    momentPrototype__proto.format            = format;                                                                // 3002
    momentPrototype__proto.from              = from;                                                                  // 3003
    momentPrototype__proto.fromNow           = fromNow;                                                               // 3004
    momentPrototype__proto.to                = to;                                                                    // 3005
    momentPrototype__proto.toNow             = toNow;                                                                 // 3006
    momentPrototype__proto.get               = getSet;                                                                // 3007
    momentPrototype__proto.invalidAt         = invalidAt;                                                             // 3008
    momentPrototype__proto.isAfter           = isAfter;                                                               // 3009
    momentPrototype__proto.isBefore          = isBefore;                                                              // 3010
    momentPrototype__proto.isBetween         = isBetween;                                                             // 3011
    momentPrototype__proto.isSame            = isSame;                                                                // 3012
    momentPrototype__proto.isSameOrAfter     = isSameOrAfter;                                                         // 3013
    momentPrototype__proto.isSameOrBefore    = isSameOrBefore;                                                        // 3014
    momentPrototype__proto.isValid           = moment_valid__isValid;                                                 // 3015
    momentPrototype__proto.lang              = lang;                                                                  // 3016
    momentPrototype__proto.locale            = locale;                                                                // 3017
    momentPrototype__proto.localeData        = localeData;                                                            // 3018
    momentPrototype__proto.max               = prototypeMax;                                                          // 3019
    momentPrototype__proto.min               = prototypeMin;                                                          // 3020
    momentPrototype__proto.parsingFlags      = parsingFlags;                                                          // 3021
    momentPrototype__proto.set               = getSet;                                                                // 3022
    momentPrototype__proto.startOf           = startOf;                                                               // 3023
    momentPrototype__proto.subtract          = add_subtract__subtract;                                                // 3024
    momentPrototype__proto.toArray           = toArray;                                                               // 3025
    momentPrototype__proto.toObject          = toObject;                                                              // 3026
    momentPrototype__proto.toDate            = toDate;                                                                // 3027
    momentPrototype__proto.toISOString       = moment_format__toISOString;                                            // 3028
    momentPrototype__proto.toJSON            = toJSON;                                                                // 3029
    momentPrototype__proto.toString          = toString;                                                              // 3030
    momentPrototype__proto.unix              = unix;                                                                  // 3031
    momentPrototype__proto.valueOf           = to_type__valueOf;                                                      // 3032
    momentPrototype__proto.creationData      = creationData;                                                          // 3033
                                                                                                                      // 3034
    // Year                                                                                                           // 3035
    momentPrototype__proto.year       = getSetYear;                                                                   // 3036
    momentPrototype__proto.isLeapYear = getIsLeapYear;                                                                // 3037
                                                                                                                      // 3038
    // Week Year                                                                                                      // 3039
    momentPrototype__proto.weekYear    = getSetWeekYear;                                                              // 3040
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;                                                           // 3041
                                                                                                                      // 3042
    // Quarter                                                                                                        // 3043
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;                                 // 3044
                                                                                                                      // 3045
    // Month                                                                                                          // 3046
    momentPrototype__proto.month       = getSetMonth;                                                                 // 3047
    momentPrototype__proto.daysInMonth = getDaysInMonth;                                                              // 3048
                                                                                                                      // 3049
    // Week                                                                                                           // 3050
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;                         // 3051
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;                      // 3052
    momentPrototype__proto.weeksInYear    = getWeeksInYear;                                                           // 3053
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;                                                        // 3054
                                                                                                                      // 3055
    // Day                                                                                                            // 3056
    momentPrototype__proto.date       = getSetDayOfMonth;                                                             // 3057
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;                    // 3058
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;                                                        // 3059
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;                                                           // 3060
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;                                                              // 3061
                                                                                                                      // 3062
    // Hour                                                                                                           // 3063
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;                                          // 3064
                                                                                                                      // 3065
    // Minute                                                                                                         // 3066
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;                                    // 3067
                                                                                                                      // 3068
    // Second                                                                                                         // 3069
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;                                    // 3070
                                                                                                                      // 3071
    // Millisecond                                                                                                    // 3072
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;                     // 3073
                                                                                                                      // 3074
    // Offset                                                                                                         // 3075
    momentPrototype__proto.utcOffset            = getSetOffset;                                                       // 3076
    momentPrototype__proto.utc                  = setOffsetToUTC;                                                     // 3077
    momentPrototype__proto.local                = setOffsetToLocal;                                                   // 3078
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;                                            // 3079
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;                                               // 3080
    momentPrototype__proto.isDST                = isDaylightSavingTime;                                               // 3081
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;                                        // 3082
    momentPrototype__proto.isLocal              = isLocal;                                                            // 3083
    momentPrototype__proto.isUtcOffset          = isUtcOffset;                                                        // 3084
    momentPrototype__proto.isUtc                = isUtc;                                                              // 3085
    momentPrototype__proto.isUTC                = isUtc;                                                              // 3086
                                                                                                                      // 3087
    // Timezone                                                                                                       // 3088
    momentPrototype__proto.zoneAbbr = getZoneAbbr;                                                                    // 3089
    momentPrototype__proto.zoneName = getZoneName;                                                                    // 3090
                                                                                                                      // 3091
    // Deprecations                                                                                                   // 3092
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);   // 3093
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);       // 3094
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);          // 3095
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);
                                                                                                                      // 3097
    var momentPrototype = momentPrototype__proto;                                                                     // 3098
                                                                                                                      // 3099
    function moment__createUnix (input) {                                                                             // 3100
        return local__createLocal(input * 1000);                                                                      // 3101
    }                                                                                                                 // 3102
                                                                                                                      // 3103
    function moment__createInZone () {                                                                                // 3104
        return local__createLocal.apply(null, arguments).parseZone();                                                 // 3105
    }                                                                                                                 // 3106
                                                                                                                      // 3107
    var defaultCalendar = {                                                                                           // 3108
        sameDay : '[Today at] LT',                                                                                    // 3109
        nextDay : '[Tomorrow at] LT',                                                                                 // 3110
        nextWeek : 'dddd [at] LT',                                                                                    // 3111
        lastDay : '[Yesterday at] LT',                                                                                // 3112
        lastWeek : '[Last] dddd [at] LT',                                                                             // 3113
        sameElse : 'L'                                                                                                // 3114
    };                                                                                                                // 3115
                                                                                                                      // 3116
    function locale_calendar__calendar (key, mom, now) {                                                              // 3117
        var output = this._calendar[key];                                                                             // 3118
        return isFunction(output) ? output.call(mom, now) : output;                                                   // 3119
    }                                                                                                                 // 3120
                                                                                                                      // 3121
    var defaultLongDateFormat = {                                                                                     // 3122
        LTS  : 'h:mm:ss A',                                                                                           // 3123
        LT   : 'h:mm A',                                                                                              // 3124
        L    : 'MM/DD/YYYY',                                                                                          // 3125
        LL   : 'MMMM D, YYYY',                                                                                        // 3126
        LLL  : 'MMMM D, YYYY h:mm A',                                                                                 // 3127
        LLLL : 'dddd, MMMM D, YYYY h:mm A'                                                                            // 3128
    };                                                                                                                // 3129
                                                                                                                      // 3130
    function longDateFormat (key) {                                                                                   // 3131
        var format = this._longDateFormat[key],                                                                       // 3132
            formatUpper = this._longDateFormat[key.toUpperCase()];                                                    // 3133
                                                                                                                      // 3134
        if (format || !formatUpper) {                                                                                 // 3135
            return format;                                                                                            // 3136
        }                                                                                                             // 3137
                                                                                                                      // 3138
        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {                          // 3139
            return val.slice(1);                                                                                      // 3140
        });                                                                                                           // 3141
                                                                                                                      // 3142
        return this._longDateFormat[key];                                                                             // 3143
    }                                                                                                                 // 3144
                                                                                                                      // 3145
    var defaultInvalidDate = 'Invalid date';                                                                          // 3146
                                                                                                                      // 3147
    function invalidDate () {                                                                                         // 3148
        return this._invalidDate;                                                                                     // 3149
    }                                                                                                                 // 3150
                                                                                                                      // 3151
    var defaultOrdinal = '%d';                                                                                        // 3152
    var defaultOrdinalParse = /\d{1,2}/;                                                                              // 3153
                                                                                                                      // 3154
    function ordinal (number) {                                                                                       // 3155
        return this._ordinal.replace('%d', number);                                                                   // 3156
    }                                                                                                                 // 3157
                                                                                                                      // 3158
    function preParsePostFormat (string) {                                                                            // 3159
        return string;                                                                                                // 3160
    }                                                                                                                 // 3161
                                                                                                                      // 3162
    var defaultRelativeTime = {                                                                                       // 3163
        future : 'in %s',                                                                                             // 3164
        past   : '%s ago',                                                                                            // 3165
        s  : 'a few seconds',                                                                                         // 3166
        m  : 'a minute',                                                                                              // 3167
        mm : '%d minutes',                                                                                            // 3168
        h  : 'an hour',                                                                                               // 3169
        hh : '%d hours',                                                                                              // 3170
        d  : 'a day',                                                                                                 // 3171
        dd : '%d days',                                                                                               // 3172
        M  : 'a month',                                                                                               // 3173
        MM : '%d months',                                                                                             // 3174
        y  : 'a year',                                                                                                // 3175
        yy : '%d years'                                                                                               // 3176
    };                                                                                                                // 3177
                                                                                                                      // 3178
    function relative__relativeTime (number, withoutSuffix, string, isFuture) {                                       // 3179
        var output = this._relativeTime[string];                                                                      // 3180
        return (isFunction(output)) ?                                                                                 // 3181
            output(number, withoutSuffix, string, isFuture) :                                                         // 3182
            output.replace(/%d/i, number);                                                                            // 3183
    }                                                                                                                 // 3184
                                                                                                                      // 3185
    function pastFuture (diff, output) {                                                                              // 3186
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];                                                // 3187
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);                                   // 3188
    }                                                                                                                 // 3189
                                                                                                                      // 3190
    var prototype__proto = Locale.prototype;                                                                          // 3191
                                                                                                                      // 3192
    prototype__proto._calendar       = defaultCalendar;                                                               // 3193
    prototype__proto.calendar        = locale_calendar__calendar;                                                     // 3194
    prototype__proto._longDateFormat = defaultLongDateFormat;                                                         // 3195
    prototype__proto.longDateFormat  = longDateFormat;                                                                // 3196
    prototype__proto._invalidDate    = defaultInvalidDate;                                                            // 3197
    prototype__proto.invalidDate     = invalidDate;                                                                   // 3198
    prototype__proto._ordinal        = defaultOrdinal;                                                                // 3199
    prototype__proto.ordinal         = ordinal;                                                                       // 3200
    prototype__proto._ordinalParse   = defaultOrdinalParse;                                                           // 3201
    prototype__proto.preparse        = preParsePostFormat;                                                            // 3202
    prototype__proto.postformat      = preParsePostFormat;                                                            // 3203
    prototype__proto._relativeTime   = defaultRelativeTime;                                                           // 3204
    prototype__proto.relativeTime    = relative__relativeTime;                                                        // 3205
    prototype__proto.pastFuture      = pastFuture;                                                                    // 3206
    prototype__proto.set             = locale_set__set;                                                               // 3207
                                                                                                                      // 3208
    // Month                                                                                                          // 3209
    prototype__proto.months            =        localeMonths;                                                         // 3210
    prototype__proto._months           = defaultLocaleMonths;                                                         // 3211
    prototype__proto.monthsShort       =        localeMonthsShort;                                                    // 3212
    prototype__proto._monthsShort      = defaultLocaleMonthsShort;                                                    // 3213
    prototype__proto.monthsParse       =        localeMonthsParse;                                                    // 3214
    prototype__proto._monthsRegex      = defaultMonthsRegex;                                                          // 3215
    prototype__proto.monthsRegex       = monthsRegex;                                                                 // 3216
    prototype__proto._monthsShortRegex = defaultMonthsShortRegex;                                                     // 3217
    prototype__proto.monthsShortRegex  = monthsShortRegex;                                                            // 3218
                                                                                                                      // 3219
    // Week                                                                                                           // 3220
    prototype__proto.week = localeWeek;                                                                               // 3221
    prototype__proto._week = defaultLocaleWeek;                                                                       // 3222
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;                                                           // 3223
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;                                                           // 3224
                                                                                                                      // 3225
    // Day of Week                                                                                                    // 3226
    prototype__proto.weekdays       =        localeWeekdays;                                                          // 3227
    prototype__proto._weekdays      = defaultLocaleWeekdays;                                                          // 3228
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;                                                       // 3229
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;                                                       // 3230
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;                                                     // 3231
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;                                                     // 3232
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;                                                     // 3233
                                                                                                                      // 3234
    // Hours                                                                                                          // 3235
    prototype__proto.isPM = localeIsPM;                                                                               // 3236
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;                                                     // 3237
    prototype__proto.meridiem = localeMeridiem;                                                                       // 3238
                                                                                                                      // 3239
    function lists__get (format, index, field, setter) {                                                              // 3240
        var locale = locale_locales__getLocale();                                                                     // 3241
        var utc = create_utc__createUTC().set(setter, index);                                                         // 3242
        return locale[field](utc, format);                                                                            // 3243
    }                                                                                                                 // 3244
                                                                                                                      // 3245
    function list (format, index, field, count, setter) {                                                             // 3246
        if (typeof format === 'number') {                                                                             // 3247
            index = format;                                                                                           // 3248
            format = undefined;                                                                                       // 3249
        }                                                                                                             // 3250
                                                                                                                      // 3251
        format = format || '';                                                                                        // 3252
                                                                                                                      // 3253
        if (index != null) {                                                                                          // 3254
            return lists__get(format, index, field, setter);                                                          // 3255
        }                                                                                                             // 3256
                                                                                                                      // 3257
        var i;                                                                                                        // 3258
        var out = [];                                                                                                 // 3259
        for (i = 0; i < count; i++) {                                                                                 // 3260
            out[i] = lists__get(format, i, field, setter);                                                            // 3261
        }                                                                                                             // 3262
        return out;                                                                                                   // 3263
    }                                                                                                                 // 3264
                                                                                                                      // 3265
    function lists__listMonths (format, index) {                                                                      // 3266
        return list(format, index, 'months', 12, 'month');                                                            // 3267
    }                                                                                                                 // 3268
                                                                                                                      // 3269
    function lists__listMonthsShort (format, index) {                                                                 // 3270
        return list(format, index, 'monthsShort', 12, 'month');                                                       // 3271
    }                                                                                                                 // 3272
                                                                                                                      // 3273
    function lists__listWeekdays (format, index) {                                                                    // 3274
        return list(format, index, 'weekdays', 7, 'day');                                                             // 3275
    }                                                                                                                 // 3276
                                                                                                                      // 3277
    function lists__listWeekdaysShort (format, index) {                                                               // 3278
        return list(format, index, 'weekdaysShort', 7, 'day');                                                        // 3279
    }                                                                                                                 // 3280
                                                                                                                      // 3281
    function lists__listWeekdaysMin (format, index) {                                                                 // 3282
        return list(format, index, 'weekdaysMin', 7, 'day');                                                          // 3283
    }                                                                                                                 // 3284
                                                                                                                      // 3285
    locale_locales__getSetGlobalLocale('en', {                                                                        // 3286
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,                                                                         // 3287
        ordinal : function (number) {                                                                                 // 3288
            var b = number % 10,                                                                                      // 3289
                output = (toInt(number % 100 / 10) === 1) ? 'th' :                                                    // 3290
                (b === 1) ? 'st' :                                                                                    // 3291
                (b === 2) ? 'nd' :                                                                                    // 3292
                (b === 3) ? 'rd' : 'th';                                                                              // 3293
            return number + output;                                                                                   // 3294
        }                                                                                                             // 3295
    });                                                                                                               // 3296
                                                                                                                      // 3297
    // Side effect imports                                                                                            // 3298
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);
                                                                                                                      // 3301
    var mathAbs = Math.abs;                                                                                           // 3302
                                                                                                                      // 3303
    function duration_abs__abs () {                                                                                   // 3304
        var data           = this._data;                                                                              // 3305
                                                                                                                      // 3306
        this._milliseconds = mathAbs(this._milliseconds);                                                             // 3307
        this._days         = mathAbs(this._days);                                                                     // 3308
        this._months       = mathAbs(this._months);                                                                   // 3309
                                                                                                                      // 3310
        data.milliseconds  = mathAbs(data.milliseconds);                                                              // 3311
        data.seconds       = mathAbs(data.seconds);                                                                   // 3312
        data.minutes       = mathAbs(data.minutes);                                                                   // 3313
        data.hours         = mathAbs(data.hours);                                                                     // 3314
        data.months        = mathAbs(data.months);                                                                    // 3315
        data.years         = mathAbs(data.years);                                                                     // 3316
                                                                                                                      // 3317
        return this;                                                                                                  // 3318
    }                                                                                                                 // 3319
                                                                                                                      // 3320
    function duration_add_subtract__addSubtract (duration, input, value, direction) {                                 // 3321
        var other = create__createDuration(input, value);                                                             // 3322
                                                                                                                      // 3323
        duration._milliseconds += direction * other._milliseconds;                                                    // 3324
        duration._days         += direction * other._days;                                                            // 3325
        duration._months       += direction * other._months;                                                          // 3326
                                                                                                                      // 3327
        return duration._bubble();                                                                                    // 3328
    }                                                                                                                 // 3329
                                                                                                                      // 3330
    // supports only 2.0-style add(1, 's') or add(duration)                                                           // 3331
    function duration_add_subtract__add (input, value) {                                                              // 3332
        return duration_add_subtract__addSubtract(this, input, value, 1);                                             // 3333
    }                                                                                                                 // 3334
                                                                                                                      // 3335
    // supports only 2.0-style subtract(1, 's') or subtract(duration)                                                 // 3336
    function duration_add_subtract__subtract (input, value) {                                                         // 3337
        return duration_add_subtract__addSubtract(this, input, value, -1);                                            // 3338
    }                                                                                                                 // 3339
                                                                                                                      // 3340
    function absCeil (number) {                                                                                       // 3341
        if (number < 0) {                                                                                             // 3342
            return Math.floor(number);                                                                                // 3343
        } else {                                                                                                      // 3344
            return Math.ceil(number);                                                                                 // 3345
        }                                                                                                             // 3346
    }                                                                                                                 // 3347
                                                                                                                      // 3348
    function bubble () {                                                                                              // 3349
        var milliseconds = this._milliseconds;                                                                        // 3350
        var days         = this._days;                                                                                // 3351
        var months       = this._months;                                                                              // 3352
        var data         = this._data;                                                                                // 3353
        var seconds, minutes, hours, years, monthsFromDays;                                                           // 3354
                                                                                                                      // 3355
        // if we have a mix of positive and negative values, bubble down first                                        // 3356
        // check: https://github.com/moment/moment/issues/2166                                                        // 3357
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||                                                      // 3358
                (milliseconds <= 0 && days <= 0 && months <= 0))) {                                                   // 3359
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;                                             // 3360
            days = 0;                                                                                                 // 3361
            months = 0;                                                                                               // 3362
        }                                                                                                             // 3363
                                                                                                                      // 3364
        // The following code bubbles up values, see the tests for                                                    // 3365
        // examples of what that means.                                                                               // 3366
        data.milliseconds = milliseconds % 1000;                                                                      // 3367
                                                                                                                      // 3368
        seconds           = absFloor(milliseconds / 1000);                                                            // 3369
        data.seconds      = seconds % 60;                                                                             // 3370
                                                                                                                      // 3371
        minutes           = absFloor(seconds / 60);                                                                   // 3372
        data.minutes      = minutes % 60;                                                                             // 3373
                                                                                                                      // 3374
        hours             = absFloor(minutes / 60);                                                                   // 3375
        data.hours        = hours % 24;                                                                               // 3376
                                                                                                                      // 3377
        days += absFloor(hours / 24);                                                                                 // 3378
                                                                                                                      // 3379
        // convert days to months                                                                                     // 3380
        monthsFromDays = absFloor(daysToMonths(days));                                                                // 3381
        months += monthsFromDays;                                                                                     // 3382
        days -= absCeil(monthsToDays(monthsFromDays));                                                                // 3383
                                                                                                                      // 3384
        // 12 months -> 1 year                                                                                        // 3385
        years = absFloor(months / 12);                                                                                // 3386
        months %= 12;                                                                                                 // 3387
                                                                                                                      // 3388
        data.days   = days;                                                                                           // 3389
        data.months = months;                                                                                         // 3390
        data.years  = years;                                                                                          // 3391
                                                                                                                      // 3392
        return this;                                                                                                  // 3393
    }                                                                                                                 // 3394
                                                                                                                      // 3395
    function daysToMonths (days) {                                                                                    // 3396
        // 400 years have 146097 days (taking into account leap year rules)                                           // 3397
        // 400 years have 12 months === 4800                                                                          // 3398
        return days * 4800 / 146097;                                                                                  // 3399
    }                                                                                                                 // 3400
                                                                                                                      // 3401
    function monthsToDays (months) {                                                                                  // 3402
        // the reverse of daysToMonths                                                                                // 3403
        return months * 146097 / 4800;                                                                                // 3404
    }                                                                                                                 // 3405
                                                                                                                      // 3406
    function as (units) {                                                                                             // 3407
        var days;                                                                                                     // 3408
        var months;                                                                                                   // 3409
        var milliseconds = this._milliseconds;                                                                        // 3410
                                                                                                                      // 3411
        units = normalizeUnits(units);                                                                                // 3412
                                                                                                                      // 3413
        if (units === 'month' || units === 'year') {                                                                  // 3414
            days   = this._days   + milliseconds / 864e5;                                                             // 3415
            months = this._months + daysToMonths(days);                                                               // 3416
            return units === 'month' ? months : months / 12;                                                          // 3417
        } else {                                                                                                      // 3418
            // handle milliseconds separately because of floating point math errors (issue #1867)                     // 3419
            days = this._days + Math.round(monthsToDays(this._months));                                               // 3420
            switch (units) {                                                                                          // 3421
                case 'week'   : return days / 7     + milliseconds / 6048e5;                                          // 3422
                case 'day'    : return days         + milliseconds / 864e5;                                           // 3423
                case 'hour'   : return days * 24    + milliseconds / 36e5;                                            // 3424
                case 'minute' : return days * 1440  + milliseconds / 6e4;                                             // 3425
                case 'second' : return days * 86400 + milliseconds / 1000;                                            // 3426
                // Math.floor prevents floating point math errors here                                                // 3427
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;                                   // 3428
                default: throw new Error('Unknown unit ' + units);                                                    // 3429
            }                                                                                                         // 3430
        }                                                                                                             // 3431
    }                                                                                                                 // 3432
                                                                                                                      // 3433
    // TODO: Use this.as('ms')?                                                                                       // 3434
    function duration_as__valueOf () {                                                                                // 3435
        return (                                                                                                      // 3436
            this._milliseconds +                                                                                      // 3437
            this._days * 864e5 +                                                                                      // 3438
            (this._months % 12) * 2592e6 +                                                                            // 3439
            toInt(this._months / 12) * 31536e6                                                                        // 3440
        );                                                                                                            // 3441
    }                                                                                                                 // 3442
                                                                                                                      // 3443
    function makeAs (alias) {                                                                                         // 3444
        return function () {                                                                                          // 3445
            return this.as(alias);                                                                                    // 3446
        };                                                                                                            // 3447
    }                                                                                                                 // 3448
                                                                                                                      // 3449
    var asMilliseconds = makeAs('ms');                                                                                // 3450
    var asSeconds      = makeAs('s');                                                                                 // 3451
    var asMinutes      = makeAs('m');                                                                                 // 3452
    var asHours        = makeAs('h');                                                                                 // 3453
    var asDays         = makeAs('d');                                                                                 // 3454
    var asWeeks        = makeAs('w');                                                                                 // 3455
    var asMonths       = makeAs('M');                                                                                 // 3456
    var asYears        = makeAs('y');                                                                                 // 3457
                                                                                                                      // 3458
    function duration_get__get (units) {                                                                              // 3459
        units = normalizeUnits(units);                                                                                // 3460
        return this[units + 's']();                                                                                   // 3461
    }                                                                                                                 // 3462
                                                                                                                      // 3463
    function makeGetter(name) {                                                                                       // 3464
        return function () {                                                                                          // 3465
            return this._data[name];                                                                                  // 3466
        };                                                                                                            // 3467
    }                                                                                                                 // 3468
                                                                                                                      // 3469
    var milliseconds = makeGetter('milliseconds');                                                                    // 3470
    var seconds      = makeGetter('seconds');                                                                         // 3471
    var minutes      = makeGetter('minutes');                                                                         // 3472
    var hours        = makeGetter('hours');                                                                           // 3473
    var days         = makeGetter('days');                                                                            // 3474
    var months       = makeGetter('months');                                                                          // 3475
    var years        = makeGetter('years');                                                                           // 3476
                                                                                                                      // 3477
    function weeks () {                                                                                               // 3478
        return absFloor(this.days() / 7);                                                                             // 3479
    }                                                                                                                 // 3480
                                                                                                                      // 3481
    var round = Math.round;                                                                                           // 3482
    var thresholds = {                                                                                                // 3483
        s: 45,  // seconds to minute                                                                                  // 3484
        m: 45,  // minutes to hour                                                                                    // 3485
        h: 22,  // hours to day                                                                                       // 3486
        d: 26,  // days to month                                                                                      // 3487
        M: 11   // months to year                                                                                     // 3488
    };                                                                                                                // 3489
                                                                                                                      // 3490
    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize                         // 3491
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {                                     // 3492
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);                                   // 3493
    }                                                                                                                 // 3494
                                                                                                                      // 3495
    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {                                // 3496
        var duration = create__createDuration(posNegDuration).abs();                                                  // 3497
        var seconds  = round(duration.as('s'));                                                                       // 3498
        var minutes  = round(duration.as('m'));                                                                       // 3499
        var hours    = round(duration.as('h'));                                                                       // 3500
        var days     = round(duration.as('d'));                                                                       // 3501
        var months   = round(duration.as('M'));                                                                       // 3502
        var years    = round(duration.as('y'));                                                                       // 3503
                                                                                                                      // 3504
        var a = seconds < thresholds.s && ['s', seconds]  ||                                                          // 3505
                minutes <= 1           && ['m']           ||                                                          // 3506
                minutes < thresholds.m && ['mm', minutes] ||                                                          // 3507
                hours   <= 1           && ['h']           ||                                                          // 3508
                hours   < thresholds.h && ['hh', hours]   ||                                                          // 3509
                days    <= 1           && ['d']           ||                                                          // 3510
                days    < thresholds.d && ['dd', days]    ||                                                          // 3511
                months  <= 1           && ['M']           ||                                                          // 3512
                months  < thresholds.M && ['MM', months]  ||                                                          // 3513
                years   <= 1           && ['y']           || ['yy', years];                                           // 3514
                                                                                                                      // 3515
        a[2] = withoutSuffix;                                                                                         // 3516
        a[3] = +posNegDuration > 0;                                                                                   // 3517
        a[4] = locale;                                                                                                // 3518
        return substituteTimeAgo.apply(null, a);                                                                      // 3519
    }                                                                                                                 // 3520
                                                                                                                      // 3521
    // This function allows you to set a threshold for relative time strings                                          // 3522
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {                                      // 3523
        if (thresholds[threshold] === undefined) {                                                                    // 3524
            return false;                                                                                             // 3525
        }                                                                                                             // 3526
        if (limit === undefined) {                                                                                    // 3527
            return thresholds[threshold];                                                                             // 3528
        }                                                                                                             // 3529
        thresholds[threshold] = limit;                                                                                // 3530
        return true;                                                                                                  // 3531
    }                                                                                                                 // 3532
                                                                                                                      // 3533
    function humanize (withSuffix) {                                                                                  // 3534
        var locale = this.localeData();                                                                               // 3535
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);                                      // 3536
                                                                                                                      // 3537
        if (withSuffix) {                                                                                             // 3538
            output = locale.pastFuture(+this, output);                                                                // 3539
        }                                                                                                             // 3540
                                                                                                                      // 3541
        return locale.postformat(output);                                                                             // 3542
    }                                                                                                                 // 3543
                                                                                                                      // 3544
    var iso_string__abs = Math.abs;                                                                                   // 3545
                                                                                                                      // 3546
    function iso_string__toISOString() {                                                                              // 3547
        // for ISO strings we do not use the normal bubbling rules:                                                   // 3548
        //  * milliseconds bubble up until they become hours                                                          // 3549
        //  * days do not bubble at all                                                                               // 3550
        //  * months bubble up until they become years                                                                // 3551
        // This is because there is no context-free conversion between hours and days                                 // 3552
        // (think of clock changes)                                                                                   // 3553
        // and also not between days and months (28-31 days per month)                                                // 3554
        var seconds = iso_string__abs(this._milliseconds) / 1000;                                                     // 3555
        var days         = iso_string__abs(this._days);                                                               // 3556
        var months       = iso_string__abs(this._months);                                                             // 3557
        var minutes, hours, years;                                                                                    // 3558
                                                                                                                      // 3559
        // 3600 seconds -> 60 minutes -> 1 hour                                                                       // 3560
        minutes           = absFloor(seconds / 60);                                                                   // 3561
        hours             = absFloor(minutes / 60);                                                                   // 3562
        seconds %= 60;                                                                                                // 3563
        minutes %= 60;                                                                                                // 3564
                                                                                                                      // 3565
        // 12 months -> 1 year                                                                                        // 3566
        years  = absFloor(months / 12);                                                                               // 3567
        months %= 12;                                                                                                 // 3568
                                                                                                                      // 3569
                                                                                                                      // 3570
        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js               // 3571
        var Y = years;                                                                                                // 3572
        var M = months;                                                                                               // 3573
        var D = days;                                                                                                 // 3574
        var h = hours;                                                                                                // 3575
        var m = minutes;                                                                                              // 3576
        var s = seconds;                                                                                              // 3577
        var total = this.asSeconds();                                                                                 // 3578
                                                                                                                      // 3579
        if (!total) {                                                                                                 // 3580
            // this is the same as C#'s (Noda) and python (isodate)...                                                // 3581
            // but not other JS (goog.date)                                                                           // 3582
            return 'P0D';                                                                                             // 3583
        }                                                                                                             // 3584
                                                                                                                      // 3585
        return (total < 0 ? '-' : '') +                                                                               // 3586
            'P' +                                                                                                     // 3587
            (Y ? Y + 'Y' : '') +                                                                                      // 3588
            (M ? M + 'M' : '') +                                                                                      // 3589
            (D ? D + 'D' : '') +                                                                                      // 3590
            ((h || m || s) ? 'T' : '') +                                                                              // 3591
            (h ? h + 'H' : '') +                                                                                      // 3592
            (m ? m + 'M' : '') +                                                                                      // 3593
            (s ? s + 'S' : '');                                                                                       // 3594
    }                                                                                                                 // 3595
                                                                                                                      // 3596
    var duration_prototype__proto = Duration.prototype;                                                               // 3597
                                                                                                                      // 3598
    duration_prototype__proto.abs            = duration_abs__abs;                                                     // 3599
    duration_prototype__proto.add            = duration_add_subtract__add;                                            // 3600
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;                                       // 3601
    duration_prototype__proto.as             = as;                                                                    // 3602
    duration_prototype__proto.asMilliseconds = asMilliseconds;                                                        // 3603
    duration_prototype__proto.asSeconds      = asSeconds;                                                             // 3604
    duration_prototype__proto.asMinutes      = asMinutes;                                                             // 3605
    duration_prototype__proto.asHours        = asHours;                                                               // 3606
    duration_prototype__proto.asDays         = asDays;                                                                // 3607
    duration_prototype__proto.asWeeks        = asWeeks;                                                               // 3608
    duration_prototype__proto.asMonths       = asMonths;                                                              // 3609
    duration_prototype__proto.asYears        = asYears;                                                               // 3610
    duration_prototype__proto.valueOf        = duration_as__valueOf;                                                  // 3611
    duration_prototype__proto._bubble        = bubble;                                                                // 3612
    duration_prototype__proto.get            = duration_get__get;                                                     // 3613
    duration_prototype__proto.milliseconds   = milliseconds;                                                          // 3614
    duration_prototype__proto.seconds        = seconds;                                                               // 3615
    duration_prototype__proto.minutes        = minutes;                                                               // 3616
    duration_prototype__proto.hours          = hours;                                                                 // 3617
    duration_prototype__proto.days           = days;                                                                  // 3618
    duration_prototype__proto.weeks          = weeks;                                                                 // 3619
    duration_prototype__proto.months         = months;                                                                // 3620
    duration_prototype__proto.years          = years;                                                                 // 3621
    duration_prototype__proto.humanize       = humanize;                                                              // 3622
    duration_prototype__proto.toISOString    = iso_string__toISOString;                                               // 3623
    duration_prototype__proto.toString       = iso_string__toISOString;                                               // 3624
    duration_prototype__proto.toJSON         = iso_string__toISOString;                                               // 3625
    duration_prototype__proto.locale         = locale;                                                                // 3626
    duration_prototype__proto.localeData     = localeData;                                                            // 3627
                                                                                                                      // 3628
    // Deprecations                                                                                                   // 3629
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;                                                                            // 3631
                                                                                                                      // 3632
    // Side effect imports                                                                                            // 3633
                                                                                                                      // 3634
    // FORMATTING                                                                                                     // 3635
                                                                                                                      // 3636
    addFormatToken('X', 0, 0, 'unix');                                                                                // 3637
    addFormatToken('x', 0, 0, 'valueOf');                                                                             // 3638
                                                                                                                      // 3639
    // PARSING                                                                                                        // 3640
                                                                                                                      // 3641
    addRegexToken('x', matchSigned);                                                                                  // 3642
    addRegexToken('X', matchTimestamp);                                                                               // 3643
    addParseToken('X', function (input, array, config) {                                                              // 3644
        config._d = new Date(parseFloat(input, 10) * 1000);                                                           // 3645
    });                                                                                                               // 3646
    addParseToken('x', function (input, array, config) {                                                              // 3647
        config._d = new Date(toInt(input));                                                                           // 3648
    });                                                                                                               // 3649
                                                                                                                      // 3650
    // Side effect imports                                                                                            // 3651
                                                                                                                      // 3652
                                                                                                                      // 3653
    utils_hooks__hooks.version = '2.12.0';                                                                            // 3654
                                                                                                                      // 3655
    setHookCallback(local__createLocal);                                                                              // 3656
                                                                                                                      // 3657
    utils_hooks__hooks.fn                    = momentPrototype;                                                       // 3658
    utils_hooks__hooks.min                   = min;                                                                   // 3659
    utils_hooks__hooks.max                   = max;                                                                   // 3660
    utils_hooks__hooks.now                   = now;                                                                   // 3661
    utils_hooks__hooks.utc                   = create_utc__createUTC;                                                 // 3662
    utils_hooks__hooks.unix                  = moment__createUnix;                                                    // 3663
    utils_hooks__hooks.months                = lists__listMonths;                                                     // 3664
    utils_hooks__hooks.isDate                = isDate;                                                                // 3665
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;                                    // 3666
    utils_hooks__hooks.invalid               = valid__createInvalid;                                                  // 3667
    utils_hooks__hooks.duration              = create__createDuration;                                                // 3668
    utils_hooks__hooks.isMoment              = isMoment;                                                              // 3669
    utils_hooks__hooks.weekdays              = lists__listWeekdays;                                                   // 3670
    utils_hooks__hooks.parseZone             = moment__createInZone;                                                  // 3671
    utils_hooks__hooks.localeData            = locale_locales__getLocale;                                             // 3672
    utils_hooks__hooks.isDuration            = isDuration;                                                            // 3673
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;                                                // 3674
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;                                                // 3675
    utils_hooks__hooks.defineLocale          = defineLocale;                                                          // 3676
    utils_hooks__hooks.updateLocale          = updateLocale;                                                          // 3677
    utils_hooks__hooks.locales               = locale_locales__listLocales;                                           // 3678
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;                                              // 3679
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;                                                        // 3680
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;                        // 3681
    utils_hooks__hooks.prototype             = momentPrototype;                                                       // 3682
                                                                                                                      // 3683
    var _moment = utils_hooks__hooks;                                                                                 // 3684
                                                                                                                      // 3685
    return _moment;                                                                                                   // 3686
                                                                                                                      // 3687
}));                                                                                                                  // 3688
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/momentjs_moment/meteor/export.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// moment.js makes `moment` global on the window (or global) object, while Meteor expects a file-scoped global variable
moment = this.moment;                                                                                                 // 2
try {                                                                                                                 // 3
    delete this.moment;                                                                                               // 4
} catch (e) {                                                                                                         // 5
}                                                                                                                     // 6
                                                                                                                      // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['momentjs:moment'] = {
  moment: moment
};

})();

//# sourceMappingURL=momentjs_moment.js.map
