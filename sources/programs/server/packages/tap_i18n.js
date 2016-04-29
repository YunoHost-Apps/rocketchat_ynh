(function () {

/* Imports */
var _ = Package.underscore._;
var Meteor = Package.meteor.Meteor;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var Util = Package['meteorspark:util'].Util;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var HTTP = Package['cfs:http-methods'].HTTP;

/* Package-scope variables */
var globals, TAPi18next, __coffeescriptShare, TAPi18n;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/tap_i18n/lib/globals.js                                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// The globals object will be accessible to the build plugin, the server and                                          // 1
// the client                                                                                                         // 2
                                                                                                                      // 3
globals = {                                                                                                           // 4
  fallback_language: "en",                                                                                            // 5
  langauges_tags_regex: "([a-z]{2})(-[A-Z]{2})?",                                                                     // 6
  project_translations_domain: "project",                                                                             // 7
  browser_path: "/tap-i18n",                                                                                          // 8
  debug: false                                                                                                        // 9
};                                                                                                                    // 10
                                                                                                                      // 11
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/tap_i18n/lib/tap_i18next/tap_i18next-1.7.3.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// tap_i18next is a copy of i18next that expose i18next to the global namespace                                       // 1
// under the name name TAPi18next instead of i18n to (1) avoid interfering with other                                 // 2
// Meteor packages that might use i18n with different configurations than we do                                       // 3
// or worse - (2) using a different version of i18next                                                                // 4
//                                                                                                                    // 5
// setJqueryExt is disabled by default in TAPi18next                                                                  // 6
// sprintf is a default postProcess in TAPi18next                                                                     // 7
//                                                                                                                    // 8
// TAPi18next is set outside of the singleton builder to make it available in the                                     // 9
// package level                                                                                                      // 10
                                                                                                                      // 11
// i18next, v1.7.3                                                                                                    // 12
// Copyright (c)2014 Jan Mühlemann (jamuhl).                                                                          // 13
// Distributed under MIT license                                                                                      // 14
// http://i18next.com                                                                                                 // 15
                                                                                                                      // 16
// set TAPi18next outseid of the singleton builder to make it available in the package level                          // 17
TAPi18next = {};                                                                                                      // 18
(function() {                                                                                                         // 19
                                                                                                                      // 20
    // add indexOf to non ECMA-262 standard compliant browsers                                                        // 21
    if (!Array.prototype.indexOf) {                                                                                   // 22
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {                                        // 23
            "use strict";                                                                                             // 24
            if (this == null) {                                                                                       // 25
                throw new TypeError();                                                                                // 26
            }                                                                                                         // 27
            var t = Object(this);                                                                                     // 28
            var len = t.length >>> 0;                                                                                 // 29
            if (len === 0) {                                                                                          // 30
                return -1;                                                                                            // 31
            }                                                                                                         // 32
            var n = 0;                                                                                                // 33
            if (arguments.length > 0) {                                                                               // 34
                n = Number(arguments[1]);                                                                             // 35
                if (n != n) { // shortcut for verifying if it's NaN                                                   // 36
                    n = 0;                                                                                            // 37
                } else if (n != 0 && n != Infinity && n != -Infinity) {                                               // 38
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));                                                      // 39
                }                                                                                                     // 40
            }                                                                                                         // 41
            if (n >= len) {                                                                                           // 42
                return -1;                                                                                            // 43
            }                                                                                                         // 44
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);                                                      // 45
            for (; k < len; k++) {                                                                                    // 46
                if (k in t && t[k] === searchElement) {                                                               // 47
                    return k;                                                                                         // 48
                }                                                                                                     // 49
            }                                                                                                         // 50
            return -1;                                                                                                // 51
        }                                                                                                             // 52
    }                                                                                                                 // 53
                                                                                                                      // 54
    // add lastIndexOf to non ECMA-262 standard compliant browsers                                                    // 55
    if (!Array.prototype.lastIndexOf) {                                                                               // 56
        Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {                                       // 57
            "use strict";                                                                                             // 58
            if (this == null) {                                                                                       // 59
                throw new TypeError();                                                                                // 60
            }                                                                                                         // 61
            var t = Object(this);                                                                                     // 62
            var len = t.length >>> 0;                                                                                 // 63
            if (len === 0) {                                                                                          // 64
                return -1;                                                                                            // 65
            }                                                                                                         // 66
            var n = len;                                                                                              // 67
            if (arguments.length > 1) {                                                                               // 68
                n = Number(arguments[1]);                                                                             // 69
                if (n != n) {                                                                                         // 70
                    n = 0;                                                                                            // 71
                } else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {                                                 // 72
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));                                                      // 73
                }                                                                                                     // 74
            }                                                                                                         // 75
            var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);                                                // 76
            for (; k >= 0; k--) {                                                                                     // 77
                if (k in t && t[k] === searchElement) {                                                               // 78
                    return k;                                                                                         // 79
                }                                                                                                     // 80
            }                                                                                                         // 81
            return -1;                                                                                                // 82
        };                                                                                                            // 83
    }                                                                                                                 // 84
                                                                                                                      // 85
    // Add string trim for IE8.                                                                                       // 86
    if (typeof String.prototype.trim !== 'function') {                                                                // 87
        String.prototype.trim = function() {                                                                          // 88
            return this.replace(/^\s+|\s+$/g, '');                                                                    // 89
        }                                                                                                             // 90
    }                                                                                                                 // 91
                                                                                                                      // 92
    var root = this                                                                                                   // 93
      , $ = root.jQuery || root.Zepto                                                                                 // 94
      , resStore = {}                                                                                                 // 95
      , currentLng                                                                                                    // 96
      , replacementCounter = 0                                                                                        // 97
      , languages = []                                                                                                // 98
      , initialized = false;                                                                                          // 99
                                                                                                                      // 100
                                                                                                                      // 101
    // Export the i18next object for **CommonJS**.                                                                    // 102
    // If we're not in CommonJS, add `i18n` to the                                                                    // 103
    // global object or to jquery.                                                                                    // 104
    if (typeof module !== 'undefined' && module.exports) {                                                            // 105
        module.exports = TAPi18next;                                                                                  // 106
    } else {                                                                                                          // 107
        if ($) {                                                                                                      // 108
            $.TAPi18next = $.TAPi18next || TAPi18next;                                                                // 109
        }                                                                                                             // 110
                                                                                                                      // 111
        root.TAPi18next = root.TAPi18next || TAPi18next;                                                              // 112
    }                                                                                                                 // 113
    // defaults                                                                                                       // 114
    var o = {                                                                                                         // 115
        lng: undefined,                                                                                               // 116
        load: 'all',                                                                                                  // 117
        preload: [],                                                                                                  // 118
        lowerCaseLng: false,                                                                                          // 119
        returnObjectTrees: false,                                                                                     // 120
        fallbackLng: ['dev'],                                                                                         // 121
        fallbackNS: [],                                                                                               // 122
        detectLngQS: 'setLng',                                                                                        // 123
        ns: 'translation',                                                                                            // 124
        fallbackOnNull: true,                                                                                         // 125
        fallbackOnEmpty: false,                                                                                       // 126
        fallbackToDefaultNS: false,                                                                                   // 127
        nsseparator: ':',                                                                                             // 128
        keyseparator: '.',                                                                                            // 129
        selectorAttr: 'data-i18n',                                                                                    // 130
        debug: false,                                                                                                 // 131
                                                                                                                      // 132
        resGetPath: 'locales/__lng__/__ns__.json',                                                                    // 133
        resPostPath: 'locales/add/__lng__/__ns__',                                                                    // 134
                                                                                                                      // 135
        getAsync: true,                                                                                               // 136
        postAsync: true,                                                                                              // 137
                                                                                                                      // 138
        resStore: undefined,                                                                                          // 139
        useLocalStorage: false,                                                                                       // 140
        localStorageExpirationTime: 7*24*60*60*1000,                                                                  // 141
                                                                                                                      // 142
        dynamicLoad: false,                                                                                           // 143
        sendMissing: false,                                                                                           // 144
        sendMissingTo: 'fallback', // current | all                                                                   // 145
        sendType: 'POST',                                                                                             // 146
                                                                                                                      // 147
        interpolationPrefix: '__',                                                                                    // 148
        interpolationSuffix: '__',                                                                                    // 149
        reusePrefix: '$t(',                                                                                           // 150
        reuseSuffix: ')',                                                                                             // 151
        pluralSuffix: '_plural',                                                                                      // 152
        pluralNotFound: ['plural_not_found', Math.random()].join(''),                                                 // 153
        contextNotFound: ['context_not_found', Math.random()].join(''),                                               // 154
        escapeInterpolation: false,                                                                                   // 155
                                                                                                                      // 156
        setJqueryExt: false,                                                                                          // 157
        defaultValueFromContent: true,                                                                                // 158
        useDataAttrOptions: false,                                                                                    // 159
        cookieExpirationTime: undefined,                                                                              // 160
        useCookie: true,                                                                                              // 161
        cookieName: 'TAPi18next',                                                                                     // 162
        cookieDomain: undefined,                                                                                      // 163
                                                                                                                      // 164
        objectTreeKeyHandler: undefined,                                                                              // 165
        postProcess: ["sprintf"],                                                                                     // 166
        parseMissingKey: undefined,                                                                                   // 167
                                                                                                                      // 168
        shortcutFunction: 'sprintf' // or: defaultValue                                                               // 169
    };                                                                                                                // 170
    function _extend(target, source) {                                                                                // 171
        if (!source || typeof source === 'function') {                                                                // 172
            return target;                                                                                            // 173
        }                                                                                                             // 174
                                                                                                                      // 175
        for (var attr in source) { target[attr] = source[attr]; }                                                     // 176
        return target;                                                                                                // 177
    }                                                                                                                 // 178
                                                                                                                      // 179
    function _each(object, callback, args) {                                                                          // 180
        var name, i = 0,                                                                                              // 181
            length = object.length,                                                                                   // 182
            isObj = length === undefined || Object.prototype.toString.apply(object) !== '[object Array]' || typeof object === "function";
                                                                                                                      // 184
        if (args) {                                                                                                   // 185
            if (isObj) {                                                                                              // 186
                for (name in object) {                                                                                // 187
                    if (callback.apply(object[name], args) === false) {                                               // 188
                        break;                                                                                        // 189
                    }                                                                                                 // 190
                }                                                                                                     // 191
            } else {                                                                                                  // 192
                for ( ; i < length; ) {                                                                               // 193
                    if (callback.apply(object[i++], args) === false) {                                                // 194
                        break;                                                                                        // 195
                    }                                                                                                 // 196
                }                                                                                                     // 197
            }                                                                                                         // 198
                                                                                                                      // 199
        // A special, fast, case for the most common use of each                                                      // 200
        } else {                                                                                                      // 201
            if (isObj) {                                                                                              // 202
                for (name in object) {                                                                                // 203
                    if (callback.call(object[name], name, object[name]) === false) {                                  // 204
                        break;                                                                                        // 205
                    }                                                                                                 // 206
                }                                                                                                     // 207
            } else {                                                                                                  // 208
                for ( ; i < length; ) {                                                                               // 209
                    if (callback.call(object[i], i, object[i++]) === false) {                                         // 210
                        break;                                                                                        // 211
                    }                                                                                                 // 212
                }                                                                                                     // 213
            }                                                                                                         // 214
        }                                                                                                             // 215
                                                                                                                      // 216
        return object;                                                                                                // 217
    }                                                                                                                 // 218
                                                                                                                      // 219
    var _entityMap = {                                                                                                // 220
        "&": "&amp;",                                                                                                 // 221
        "<": "&lt;",                                                                                                  // 222
        ">": "&gt;",                                                                                                  // 223
        '"': '&quot;',                                                                                                // 224
        "'": '&#39;',                                                                                                 // 225
        "/": '&#x2F;'                                                                                                 // 226
    };                                                                                                                // 227
                                                                                                                      // 228
    function _escape(data) {                                                                                          // 229
        if (typeof data === 'string') {                                                                               // 230
            return data.replace(/[&<>"'\/]/g, function (s) {                                                          // 231
                return _entityMap[s];                                                                                 // 232
            });                                                                                                       // 233
        }else{                                                                                                        // 234
            return data;                                                                                              // 235
        }                                                                                                             // 236
    }                                                                                                                 // 237
                                                                                                                      // 238
    function _ajax(options) {                                                                                         // 239
                                                                                                                      // 240
        // v0.5.0 of https://github.com/goloroden/http.js                                                             // 241
        var getXhr = function (callback) {                                                                            // 242
            // Use the native XHR object if the browser supports it.                                                  // 243
            if (window.XMLHttpRequest) {                                                                              // 244
                return callback(null, new XMLHttpRequest());                                                          // 245
            } else if (window.ActiveXObject) {                                                                        // 246
                // In Internet Explorer check for ActiveX versions of the XHR object.                                 // 247
                try {                                                                                                 // 248
                    return callback(null, new ActiveXObject("Msxml2.XMLHTTP"));                                       // 249
                } catch (e) {                                                                                         // 250
                    return callback(null, new ActiveXObject("Microsoft.XMLHTTP"));                                    // 251
                }                                                                                                     // 252
            }                                                                                                         // 253
                                                                                                                      // 254
            // If no XHR support was found, throw an error.                                                           // 255
            return callback(new Error());                                                                             // 256
        };                                                                                                            // 257
                                                                                                                      // 258
        var encodeUsingUrlEncoding = function (data) {                                                                // 259
            if(typeof data === 'string') {                                                                            // 260
                return data;                                                                                          // 261
            }                                                                                                         // 262
                                                                                                                      // 263
            var result = [];                                                                                          // 264
            for(var dataItem in data) {                                                                               // 265
                if(data.hasOwnProperty(dataItem)) {                                                                   // 266
                    result.push(encodeURIComponent(dataItem) + '=' + encodeURIComponent(data[dataItem]));             // 267
                }                                                                                                     // 268
            }                                                                                                         // 269
                                                                                                                      // 270
            return result.join('&');                                                                                  // 271
        };                                                                                                            // 272
                                                                                                                      // 273
        var utf8 = function (text) {                                                                                  // 274
            text = text.replace(/\r\n/g, '\n');                                                                       // 275
            var result = '';                                                                                          // 276
                                                                                                                      // 277
            for(var i = 0; i < text.length; i++) {                                                                    // 278
                var c = text.charCodeAt(i);                                                                           // 279
                                                                                                                      // 280
                if(c < 128) {                                                                                         // 281
                        result += String.fromCharCode(c);                                                             // 282
                } else if((c > 127) && (c < 2048)) {                                                                  // 283
                        result += String.fromCharCode((c >> 6) | 192);                                                // 284
                        result += String.fromCharCode((c & 63) | 128);                                                // 285
                } else {                                                                                              // 286
                        result += String.fromCharCode((c >> 12) | 224);                                               // 287
                        result += String.fromCharCode(((c >> 6) & 63) | 128);                                         // 288
                        result += String.fromCharCode((c & 63) | 128);                                                // 289
                }                                                                                                     // 290
            }                                                                                                         // 291
                                                                                                                      // 292
            return result;                                                                                            // 293
        };                                                                                                            // 294
                                                                                                                      // 295
        var base64 = function (text) {                                                                                // 296
            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';                         // 297
                                                                                                                      // 298
            text = utf8(text);                                                                                        // 299
            var result = '',                                                                                          // 300
                    chr1, chr2, chr3,                                                                                 // 301
                    enc1, enc2, enc3, enc4,                                                                           // 302
                    i = 0;                                                                                            // 303
                                                                                                                      // 304
            do {                                                                                                      // 305
                chr1 = text.charCodeAt(i++);                                                                          // 306
                chr2 = text.charCodeAt(i++);                                                                          // 307
                chr3 = text.charCodeAt(i++);                                                                          // 308
                                                                                                                      // 309
                enc1 = chr1 >> 2;                                                                                     // 310
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);                                                               // 311
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);                                                              // 312
                enc4 = chr3 & 63;                                                                                     // 313
                                                                                                                      // 314
                if(isNaN(chr2)) {                                                                                     // 315
                    enc3 = enc4 = 64;                                                                                 // 316
                } else if(isNaN(chr3)) {                                                                              // 317
                    enc4 = 64;                                                                                        // 318
                }                                                                                                     // 319
                                                                                                                      // 320
                result +=                                                                                             // 321
                    keyStr.charAt(enc1) +                                                                             // 322
                    keyStr.charAt(enc2) +                                                                             // 323
                    keyStr.charAt(enc3) +                                                                             // 324
                    keyStr.charAt(enc4);                                                                              // 325
                chr1 = chr2 = chr3 = '';                                                                              // 326
                enc1 = enc2 = enc3 = enc4 = '';                                                                       // 327
            } while(i < text.length);                                                                                 // 328
                                                                                                                      // 329
            return result;                                                                                            // 330
        };                                                                                                            // 331
                                                                                                                      // 332
        var mergeHeaders = function () {                                                                              // 333
            // Use the first header object as base.                                                                   // 334
            var result = arguments[0];                                                                                // 335
                                                                                                                      // 336
            // Iterate through the remaining header objects and add them.                                             // 337
            for(var i = 1; i < arguments.length; i++) {                                                               // 338
                var currentHeaders = arguments[i];                                                                    // 339
                for(var header in currentHeaders) {                                                                   // 340
                    if(currentHeaders.hasOwnProperty(header)) {                                                       // 341
                        result[header] = currentHeaders[header];                                                      // 342
                    }                                                                                                 // 343
                }                                                                                                     // 344
            }                                                                                                         // 345
                                                                                                                      // 346
            // Return the merged headers.                                                                             // 347
            return result;                                                                                            // 348
        };                                                                                                            // 349
                                                                                                                      // 350
        var ajax = function (method, url, options, callback) {                                                        // 351
            // Adjust parameters.                                                                                     // 352
            if(typeof options === 'function') {                                                                       // 353
                callback = options;                                                                                   // 354
                options = {};                                                                                         // 355
            }                                                                                                         // 356
                                                                                                                      // 357
            // Set default parameter values.                                                                          // 358
            options.cache = options.cache || false;                                                                   // 359
            options.data = options.data || {};                                                                        // 360
            options.headers = options.headers || {};                                                                  // 361
            options.jsonp = options.jsonp || false;                                                                   // 362
            options.async = options.async === undefined ? true : options.async;                                       // 363
                                                                                                                      // 364
            // Merge the various header objects.                                                                      // 365
            var headers = mergeHeaders({                                                                              // 366
                'accept': '*/*',                                                                                      // 367
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'                                     // 368
            }, ajax.headers, options.headers);                                                                        // 369
                                                                                                                      // 370
            // Encode the data according to the content-type.                                                         // 371
            var payload;                                                                                              // 372
            if (headers['content-type'] === 'application/json') {                                                     // 373
                payload = JSON.stringify(options.data);                                                               // 374
            } else {                                                                                                  // 375
                payload = encodeUsingUrlEncoding(options.data);                                                       // 376
            }                                                                                                         // 377
                                                                                                                      // 378
            // Specially prepare GET requests: Setup the query string, handle caching and make a JSONP call           // 379
            // if neccessary.                                                                                         // 380
            if(method === 'GET') {                                                                                    // 381
                // Setup the query string.                                                                            // 382
                var queryString = [];                                                                                 // 383
                if(payload) {                                                                                         // 384
                    queryString.push(payload);                                                                        // 385
                    payload = null;                                                                                   // 386
                }                                                                                                     // 387
                                                                                                                      // 388
                // Handle caching.                                                                                    // 389
                if(!options.cache) {                                                                                  // 390
                    queryString.push('_=' + (new Date()).getTime());                                                  // 391
                }                                                                                                     // 392
                                                                                                                      // 393
                // If neccessary prepare the query string for a JSONP call.                                           // 394
                if(options.jsonp) {                                                                                   // 395
                    queryString.push('callback=' + options.jsonp);                                                    // 396
                    queryString.push('jsonp=' + options.jsonp);                                                       // 397
                }                                                                                                     // 398
                                                                                                                      // 399
                // Merge the query string and attach it to the url.                                                   // 400
                queryString = queryString.join('&');                                                                  // 401
                if (queryString.length > 1) {                                                                         // 402
                    if (url.indexOf('?') > -1) {                                                                      // 403
                        url += '&' + queryString;                                                                     // 404
                    } else {                                                                                          // 405
                        url += '?' + queryString;                                                                     // 406
                    }                                                                                                 // 407
                }                                                                                                     // 408
                                                                                                                      // 409
                // Make a JSONP call if neccessary.                                                                   // 410
                if(options.jsonp) {                                                                                   // 411
                    var head = document.getElementsByTagName('head')[0];                                              // 412
                    var script = document.createElement('script');                                                    // 413
                    script.type = 'text/javascript';                                                                  // 414
                    script.src = url;                                                                                 // 415
                    head.appendChild(script);                                                                         // 416
                    return;                                                                                           // 417
                }                                                                                                     // 418
            }                                                                                                         // 419
                                                                                                                      // 420
            // Since we got here, it is no JSONP request, so make a normal XHR request.                               // 421
            getXhr(function (err, xhr) {                                                                              // 422
                if(err) return callback(err);                                                                         // 423
                                                                                                                      // 424
                // Open the request.                                                                                  // 425
                xhr.open(method, url, options.async);                                                                 // 426
                                                                                                                      // 427
                // Set the request headers.                                                                           // 428
                for(var header in headers) {                                                                          // 429
                    if(headers.hasOwnProperty(header)) {                                                              // 430
                        xhr.setRequestHeader(header, headers[header]);                                                // 431
                    }                                                                                                 // 432
                }                                                                                                     // 433
                                                                                                                      // 434
                // Handle the request events.                                                                         // 435
                xhr.onreadystatechange = function () {                                                                // 436
                    if(xhr.readyState === 4) {                                                                        // 437
                        var data = xhr.responseText || '';                                                            // 438
                                                                                                                      // 439
                        // If no callback is given, return.                                                           // 440
                        if(!callback) {                                                                               // 441
                            return;                                                                                   // 442
                        }                                                                                             // 443
                                                                                                                      // 444
                        // Return an object that provides access to the data as text and JSON.                        // 445
                        callback(xhr.status, {                                                                        // 446
                            text: function () {                                                                       // 447
                                return data;                                                                          // 448
                            },                                                                                        // 449
                                                                                                                      // 450
                            json: function () {                                                                       // 451
                                return JSON.parse(data);                                                              // 452
                            }                                                                                         // 453
                        });                                                                                           // 454
                    }                                                                                                 // 455
                };                                                                                                    // 456
                                                                                                                      // 457
                // Actually send the XHR request.                                                                     // 458
                xhr.send(payload);                                                                                    // 459
            });                                                                                                       // 460
        };                                                                                                            // 461
                                                                                                                      // 462
        // Define the external interface.                                                                             // 463
        var http = {                                                                                                  // 464
            authBasic: function (username, password) {                                                                // 465
                ajax.headers['Authorization'] = 'Basic ' + base64(username + ':' + password);                         // 466
            },                                                                                                        // 467
                                                                                                                      // 468
            connect: function (url, options, callback) {                                                              // 469
                return ajax('CONNECT', url, options, callback);                                                       // 470
            },                                                                                                        // 471
                                                                                                                      // 472
            del: function (url, options, callback) {                                                                  // 473
                return ajax('DELETE', url, options, callback);                                                        // 474
            },                                                                                                        // 475
                                                                                                                      // 476
            get: function (url, options, callback) {                                                                  // 477
                return ajax('GET', url, options, callback);                                                           // 478
            },                                                                                                        // 479
                                                                                                                      // 480
            head: function (url, options, callback) {                                                                 // 481
                return ajax('HEAD', url, options, callback);                                                          // 482
            },                                                                                                        // 483
                                                                                                                      // 484
            headers: function (headers) {                                                                             // 485
                ajax.headers = headers || {};                                                                         // 486
            },                                                                                                        // 487
                                                                                                                      // 488
            isAllowed: function (url, verb, callback) {                                                               // 489
                this.options(url, function (status, data) {                                                           // 490
                    callback(data.text().indexOf(verb) !== -1);                                                       // 491
                });                                                                                                   // 492
            },                                                                                                        // 493
                                                                                                                      // 494
            options: function (url, options, callback) {                                                              // 495
                return ajax('OPTIONS', url, options, callback);                                                       // 496
            },                                                                                                        // 497
                                                                                                                      // 498
            patch: function (url, options, callback) {                                                                // 499
                return ajax('PATCH', url, options, callback);                                                         // 500
            },                                                                                                        // 501
                                                                                                                      // 502
            post: function (url, options, callback) {                                                                 // 503
                return ajax('POST', url, options, callback);                                                          // 504
            },                                                                                                        // 505
                                                                                                                      // 506
            put: function (url, options, callback) {                                                                  // 507
                return ajax('PUT', url, options, callback);                                                           // 508
            },                                                                                                        // 509
                                                                                                                      // 510
            trace: function (url, options, callback) {                                                                // 511
                return ajax('TRACE', url, options, callback);                                                         // 512
            }                                                                                                         // 513
        };                                                                                                            // 514
                                                                                                                      // 515
                                                                                                                      // 516
        var methode = options.type ? options.type.toLowerCase() : 'get';                                              // 517
                                                                                                                      // 518
        http[methode](options.url, options, function (status, data) {                                                 // 519
            if (status === 200) {                                                                                     // 520
                options.success(data.json(), status, null);                                                           // 521
            } else {                                                                                                  // 522
                options.error(data.text(), status, null);                                                             // 523
            }                                                                                                         // 524
        });                                                                                                           // 525
    }                                                                                                                 // 526
                                                                                                                      // 527
    var _cookie = {                                                                                                   // 528
        create: function(name,value,minutes,domain) {                                                                 // 529
            var expires;                                                                                              // 530
            if (minutes) {                                                                                            // 531
                var date = new Date();                                                                                // 532
                date.setTime(date.getTime()+(minutes*60*1000));                                                       // 533
                expires = "; expires="+date.toGMTString();                                                            // 534
            }                                                                                                         // 535
            else expires = "";                                                                                        // 536
            domain = (domain)? "domain="+domain+";" : "";                                                             // 537
            document.cookie = name+"="+value+expires+";"+domain+"path=/";                                             // 538
        },                                                                                                            // 539
                                                                                                                      // 540
        read: function(name) {                                                                                        // 541
            var nameEQ = name + "=";                                                                                  // 542
            var ca = document.cookie.split(';');                                                                      // 543
            for(var i=0;i < ca.length;i++) {                                                                          // 544
                var c = ca[i];                                                                                        // 545
                while (c.charAt(0)==' ') c = c.substring(1,c.length);                                                 // 546
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);                              // 547
            }                                                                                                         // 548
            return null;                                                                                              // 549
        },                                                                                                            // 550
                                                                                                                      // 551
        remove: function(name) {                                                                                      // 552
            this.create(name,"",-1);                                                                                  // 553
        }                                                                                                             // 554
    };                                                                                                                // 555
                                                                                                                      // 556
    var cookie_noop = {                                                                                               // 557
        create: function(name,value,minutes,domain) {},                                                               // 558
        read: function(name) { return null; },                                                                        // 559
        remove: function(name) {}                                                                                     // 560
    };                                                                                                                // 561
                                                                                                                      // 562
                                                                                                                      // 563
                                                                                                                      // 564
    // move dependent functions to a container so that                                                                // 565
    // they can be overriden easier in no jquery environment (node.js)                                                // 566
    var f = {                                                                                                         // 567
        extend: $ ? $.extend : _extend,                                                                               // 568
        each: $ ? $.each : _each,                                                                                     // 569
        ajax: $ ? $.ajax : (typeof document !== 'undefined' ? _ajax : function() {}),                                 // 570
        cookie: typeof document !== 'undefined' ? _cookie : cookie_noop,                                              // 571
        detectLanguage: detectLanguage,                                                                               // 572
        escape: _escape,                                                                                              // 573
        log: function(str) {                                                                                          // 574
            if (o.debug && typeof console !== "undefined") console.log(str);                                          // 575
        },                                                                                                            // 576
        toLanguages: function(lng) {                                                                                  // 577
            var languages = [];                                                                                       // 578
            if (typeof lng === 'string' && lng.indexOf('-') > -1) {                                                   // 579
                var parts = lng.split('-');                                                                           // 580
                                                                                                                      // 581
                lng = o.lowerCaseLng ?                                                                                // 582
                    parts[0].toLowerCase() +  '-' + parts[1].toLowerCase() :                                          // 583
                    parts[0].toLowerCase() +  '-' + parts[1].toUpperCase();                                           // 584
                                                                                                                      // 585
                if (o.load !== 'unspecific') languages.push(lng);                                                     // 586
                if (o.load !== 'current') languages.push(parts[0]);                                                   // 587
            } else {                                                                                                  // 588
                languages.push(lng);                                                                                  // 589
            }                                                                                                         // 590
                                                                                                                      // 591
            for (var i = 0; i < o.fallbackLng.length; i++) {                                                          // 592
                if (languages.indexOf(o.fallbackLng[i]) === -1 && o.fallbackLng[i]) languages.push(o.fallbackLng[i]);
            }                                                                                                         // 594
                                                                                                                      // 595
            return languages;                                                                                         // 596
        },                                                                                                            // 597
        regexEscape: function(str) {                                                                                  // 598
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");                                        // 599
        }                                                                                                             // 600
    };                                                                                                                // 601
    function init(options, cb) {                                                                                      // 602
                                                                                                                      // 603
        if (typeof options === 'function') {                                                                          // 604
            cb = options;                                                                                             // 605
            options = {};                                                                                             // 606
        }                                                                                                             // 607
        options = options || {};                                                                                      // 608
                                                                                                                      // 609
        // override defaults with passed in options                                                                   // 610
        f.extend(o, options);                                                                                         // 611
        delete o.fixLng; /* passed in each time */                                                                    // 612
                                                                                                                      // 613
        // create namespace object if namespace is passed in as string                                                // 614
        if (typeof o.ns == 'string') {                                                                                // 615
            o.ns = { namespaces: [o.ns], defaultNs: o.ns};                                                            // 616
        }                                                                                                             // 617
                                                                                                                      // 618
        // fallback namespaces                                                                                        // 619
        if (typeof o.fallbackNS == 'string') {                                                                        // 620
            o.fallbackNS = [o.fallbackNS];                                                                            // 621
        }                                                                                                             // 622
                                                                                                                      // 623
        // fallback languages                                                                                         // 624
        if (typeof o.fallbackLng == 'string' || typeof o.fallbackLng == 'boolean') {                                  // 625
            o.fallbackLng = [o.fallbackLng];                                                                          // 626
        }                                                                                                             // 627
                                                                                                                      // 628
        // escape prefix/suffix                                                                                       // 629
        o.interpolationPrefixEscaped = f.regexEscape(o.interpolationPrefix);                                          // 630
        o.interpolationSuffixEscaped = f.regexEscape(o.interpolationSuffix);                                          // 631
                                                                                                                      // 632
        if (!o.lng) o.lng = f.detectLanguage();                                                                       // 633
        if (o.lng) {                                                                                                  // 634
            // set cookie with lng set (as detectLanguage will set cookie on need)                                    // 635
            if (o.useCookie) f.cookie.create(o.cookieName, o.lng, o.cookieExpirationTime, o.cookieDomain);            // 636
        } else {                                                                                                      // 637
            o.lng =  o.fallbackLng[0];                                                                                // 638
            if (o.useCookie) f.cookie.remove(o.cookieName);                                                           // 639
        }                                                                                                             // 640
                                                                                                                      // 641
        languages = f.toLanguages(o.lng);                                                                             // 642
        currentLng = languages[0];                                                                                    // 643
        f.log('currentLng set to: ' + currentLng);                                                                    // 644
                                                                                                                      // 645
        var lngTranslate = translate;                                                                                 // 646
        if (options.fixLng) {                                                                                         // 647
            lngTranslate = function(key, options) {                                                                   // 648
                options = options || {};                                                                              // 649
                options.lng = options.lng || lngTranslate.lng;                                                        // 650
                return translate(key, options);                                                                       // 651
            };                                                                                                        // 652
            lngTranslate.lng = currentLng;                                                                            // 653
        }                                                                                                             // 654
                                                                                                                      // 655
        pluralExtensions.setCurrentLng(currentLng);                                                                   // 656
                                                                                                                      // 657
        // add JQuery extensions                                                                                      // 658
        if ($ && o.setJqueryExt) addJqueryFunct();                                                                    // 659
                                                                                                                      // 660
        // jQuery deferred                                                                                            // 661
        var deferred;                                                                                                 // 662
        if ($ && $.Deferred) {                                                                                        // 663
            deferred = $.Deferred();                                                                                  // 664
        }                                                                                                             // 665
                                                                                                                      // 666
        // return immidiatly if res are passed in                                                                     // 667
        if (o.resStore) {                                                                                             // 668
            resStore = o.resStore;                                                                                    // 669
            initialized = true;                                                                                       // 670
            if (cb) cb(lngTranslate);                                                                                 // 671
            if (deferred) deferred.resolve(lngTranslate);                                                             // 672
            if (deferred) return deferred.promise();                                                                  // 673
            return;                                                                                                   // 674
        }                                                                                                             // 675
                                                                                                                      // 676
        // languages to load                                                                                          // 677
        var lngsToLoad = f.toLanguages(o.lng);                                                                        // 678
        if (typeof o.preload === 'string') o.preload = [o.preload];                                                   // 679
        for (var i = 0, l = o.preload.length; i < l; i++) {                                                           // 680
            var pres = f.toLanguages(o.preload[i]);                                                                   // 681
            for (var y = 0, len = pres.length; y < len; y++) {                                                        // 682
                if (lngsToLoad.indexOf(pres[y]) < 0) {                                                                // 683
                    lngsToLoad.push(pres[y]);                                                                         // 684
                }                                                                                                     // 685
            }                                                                                                         // 686
        }                                                                                                             // 687
                                                                                                                      // 688
        // else load them                                                                                             // 689
        TAPi18next.sync.load(lngsToLoad, o, function(err, store) {                                                    // 690
            resStore = store;                                                                                         // 691
            initialized = true;                                                                                       // 692
                                                                                                                      // 693
            if (cb) cb(lngTranslate);                                                                                 // 694
            if (deferred) deferred.resolve(lngTranslate);                                                             // 695
        });                                                                                                           // 696
                                                                                                                      // 697
        if (deferred) return deferred.promise();                                                                      // 698
    }                                                                                                                 // 699
    function preload(lngs, cb) {                                                                                      // 700
        if (typeof lngs === 'string') lngs = [lngs];                                                                  // 701
        for (var i = 0, l = lngs.length; i < l; i++) {                                                                // 702
            if (o.preload.indexOf(lngs[i]) < 0) {                                                                     // 703
                o.preload.push(lngs[i]);                                                                              // 704
            }                                                                                                         // 705
        }                                                                                                             // 706
        return init(cb);                                                                                              // 707
    }                                                                                                                 // 708
                                                                                                                      // 709
    function addResourceBundle(lng, ns, resources) {                                                                  // 710
        if (typeof ns !== 'string') {                                                                                 // 711
            resources = ns;                                                                                           // 712
            ns = o.ns.defaultNs;                                                                                      // 713
        } else if (o.ns.namespaces.indexOf(ns) < 0) {                                                                 // 714
            o.ns.namespaces.push(ns);                                                                                 // 715
        }                                                                                                             // 716
                                                                                                                      // 717
        resStore[lng] = resStore[lng] || {};                                                                          // 718
        resStore[lng][ns] = resStore[lng][ns] || {};                                                                  // 719
                                                                                                                      // 720
        f.extend(resStore[lng][ns], resources);                                                                       // 721
    }                                                                                                                 // 722
                                                                                                                      // 723
    function removeResourceBundle(lng, ns) {                                                                          // 724
        if (typeof ns !== 'string') {                                                                                 // 725
            ns = o.ns.defaultNs;                                                                                      // 726
        }                                                                                                             // 727
                                                                                                                      // 728
        resStore[lng] = resStore[lng] || {};                                                                          // 729
        resStore[lng][ns] = {};                                                                                       // 730
    }                                                                                                                 // 731
                                                                                                                      // 732
    function setDefaultNamespace(ns) {                                                                                // 733
        o.ns.defaultNs = ns;                                                                                          // 734
    }                                                                                                                 // 735
                                                                                                                      // 736
    function loadNamespace(namespace, cb) {                                                                           // 737
        loadNamespaces([namespace], cb);                                                                              // 738
    }                                                                                                                 // 739
                                                                                                                      // 740
    function loadNamespaces(namespaces, cb) {                                                                         // 741
        var opts = {                                                                                                  // 742
            dynamicLoad: o.dynamicLoad,                                                                               // 743
            resGetPath: o.resGetPath,                                                                                 // 744
            getAsync: o.getAsync,                                                                                     // 745
            customLoad: o.customLoad,                                                                                 // 746
            ns: { namespaces: namespaces, defaultNs: ''} /* new namespaces to load */                                 // 747
        };                                                                                                            // 748
                                                                                                                      // 749
        // languages to load                                                                                          // 750
        var lngsToLoad = f.toLanguages(o.lng);                                                                        // 751
        if (typeof o.preload === 'string') o.preload = [o.preload];                                                   // 752
        for (var i = 0, l = o.preload.length; i < l; i++) {                                                           // 753
            var pres = f.toLanguages(o.preload[i]);                                                                   // 754
            for (var y = 0, len = pres.length; y < len; y++) {                                                        // 755
                if (lngsToLoad.indexOf(pres[y]) < 0) {                                                                // 756
                    lngsToLoad.push(pres[y]);                                                                         // 757
                }                                                                                                     // 758
            }                                                                                                         // 759
        }                                                                                                             // 760
                                                                                                                      // 761
        // check if we have to load                                                                                   // 762
        var lngNeedLoad = [];                                                                                         // 763
        for (var a = 0, lenA = lngsToLoad.length; a < lenA; a++) {                                                    // 764
            var needLoad = false;                                                                                     // 765
            var resSet = resStore[lngsToLoad[a]];                                                                     // 766
            if (resSet) {                                                                                             // 767
                for (var b = 0, lenB = namespaces.length; b < lenB; b++) {                                            // 768
                    if (!resSet[namespaces[b]]) needLoad = true;                                                      // 769
                }                                                                                                     // 770
            } else {                                                                                                  // 771
                needLoad = true;                                                                                      // 772
            }                                                                                                         // 773
                                                                                                                      // 774
            if (needLoad) lngNeedLoad.push(lngsToLoad[a]);                                                            // 775
        }                                                                                                             // 776
                                                                                                                      // 777
        if (lngNeedLoad.length) {                                                                                     // 778
            TAPi18next.sync._fetch(lngNeedLoad, opts, function(err, store) {                                          // 779
                var todo = namespaces.length * lngNeedLoad.length;                                                    // 780
                                                                                                                      // 781
                // load each file individual                                                                          // 782
                f.each(namespaces, function(nsIndex, nsValue) {                                                       // 783
                                                                                                                      // 784
                    // append namespace to namespace array                                                            // 785
                    if (o.ns.namespaces.indexOf(nsValue) < 0) {                                                       // 786
                        o.ns.namespaces.push(nsValue);                                                                // 787
                    }                                                                                                 // 788
                                                                                                                      // 789
                    f.each(lngNeedLoad, function(lngIndex, lngValue) {                                                // 790
                        resStore[lngValue] = resStore[lngValue] || {};                                                // 791
                        resStore[lngValue][nsValue] = store[lngValue][nsValue];                                       // 792
                                                                                                                      // 793
                        todo--; // wait for all done befor callback                                                   // 794
                        if (todo === 0 && cb) {                                                                       // 795
                            if (o.useLocalStorage) TAPi18next.sync._storeLocal(resStore);                             // 796
                            cb();                                                                                     // 797
                        }                                                                                             // 798
                    });                                                                                               // 799
                });                                                                                                   // 800
            });                                                                                                       // 801
        } else {                                                                                                      // 802
            if (cb) cb();                                                                                             // 803
        }                                                                                                             // 804
    }                                                                                                                 // 805
                                                                                                                      // 806
    function setLng(lng, options, cb) {                                                                               // 807
        if (typeof options === 'function') {                                                                          // 808
            cb = options;                                                                                             // 809
            options = {};                                                                                             // 810
        } else if (!options) {                                                                                        // 811
            options = {};                                                                                             // 812
        }                                                                                                             // 813
                                                                                                                      // 814
        options.lng = lng;                                                                                            // 815
        return init(options, cb);                                                                                     // 816
    }                                                                                                                 // 817
                                                                                                                      // 818
    function lng() {                                                                                                  // 819
        return currentLng;                                                                                            // 820
    }                                                                                                                 // 821
    function addJqueryFunct() {                                                                                       // 822
        // $.t shortcut                                                                                               // 823
        $.t = $.t || translate;                                                                                       // 824
                                                                                                                      // 825
        function parse(ele, key, options) {                                                                           // 826
            if (key.length === 0) return;                                                                             // 827
                                                                                                                      // 828
            var attr = 'text';                                                                                        // 829
                                                                                                                      // 830
            if (key.indexOf('[') === 0) {                                                                             // 831
                var parts = key.split(']');                                                                           // 832
                key = parts[1];                                                                                       // 833
                attr = parts[0].substr(1, parts[0].length-1);                                                         // 834
            }                                                                                                         // 835
                                                                                                                      // 836
            if (key.indexOf(';') === key.length-1) {                                                                  // 837
                key = key.substr(0, key.length-2);                                                                    // 838
            }                                                                                                         // 839
                                                                                                                      // 840
            var optionsToUse;                                                                                         // 841
            if (attr === 'html') {                                                                                    // 842
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
                ele.html($.t(key, optionsToUse));                                                                     // 844
            } else if (attr === 'text') {                                                                             // 845
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.text() }, options) : options;
                ele.text($.t(key, optionsToUse));                                                                     // 847
            } else if (attr === 'prepend') {                                                                          // 848
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
                ele.prepend($.t(key, optionsToUse));                                                                  // 850
            } else if (attr === 'append') {                                                                           // 851
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
                ele.append($.t(key, optionsToUse));                                                                   // 853
            } else if (attr.indexOf("data-") === 0) {                                                                 // 854
                var dataAttr = attr.substr(("data-").length);                                                         // 855
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.data(dataAttr) }, options) : options;
                var translated = $.t(key, optionsToUse);                                                              // 857
                //we change into the data cache                                                                       // 858
                ele.data(dataAttr, translated);                                                                       // 859
                //we change into the dom                                                                              // 860
                ele.attr(attr, translated);                                                                           // 861
            } else {                                                                                                  // 862
                optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.attr(attr) }, options) : options;
                ele.attr(attr, $.t(key, optionsToUse));                                                               // 864
            }                                                                                                         // 865
        }                                                                                                             // 866
                                                                                                                      // 867
        function localize(ele, options) {                                                                             // 868
            var key = ele.attr(o.selectorAttr);                                                                       // 869
            if (!key && typeof key !== 'undefined' && key !== false) key = ele.text() || ele.val();                   // 870
            if (!key) return;                                                                                         // 871
                                                                                                                      // 872
            var target = ele                                                                                          // 873
              , targetSelector = ele.data("i18n-target");                                                             // 874
            if (targetSelector) {                                                                                     // 875
                target = ele.find(targetSelector) || ele;                                                             // 876
            }                                                                                                         // 877
                                                                                                                      // 878
            if (!options && o.useDataAttrOptions === true) {                                                          // 879
                options = ele.data("i18n-options");                                                                   // 880
            }                                                                                                         // 881
            options = options || {};                                                                                  // 882
                                                                                                                      // 883
            if (key.indexOf(';') >= 0) {                                                                              // 884
                var keys = key.split(';');                                                                            // 885
                                                                                                                      // 886
                $.each(keys, function(m, k) {                                                                         // 887
                    if (k !== '') parse(target, k, options);                                                          // 888
                });                                                                                                   // 889
                                                                                                                      // 890
            } else {                                                                                                  // 891
                parse(target, key, options);                                                                          // 892
            }                                                                                                         // 893
                                                                                                                      // 894
            if (o.useDataAttrOptions === true) ele.data("i18n-options", options);                                     // 895
        }                                                                                                             // 896
                                                                                                                      // 897
        // fn                                                                                                         // 898
        $.fn.TAPi18next = function (options) {                                                                        // 899
            return this.each(function() {                                                                             // 900
                // localize element itself                                                                            // 901
                localize($(this), options);                                                                           // 902
                                                                                                                      // 903
                // localize childs                                                                                    // 904
                var elements =  $(this).find('[' + o.selectorAttr + ']');                                             // 905
                elements.each(function() {                                                                            // 906
                    localize($(this), options);                                                                       // 907
                });                                                                                                   // 908
            });                                                                                                       // 909
        };                                                                                                            // 910
    }                                                                                                                 // 911
    function applyReplacement(str, replacementHash, nestedKey, options) {                                             // 912
        if (!str) return str;                                                                                         // 913
                                                                                                                      // 914
        options = options || replacementHash; // first call uses replacement hash combined with options               // 915
        if (str.indexOf(options.interpolationPrefix || o.interpolationPrefix) < 0) return str;                        // 916
                                                                                                                      // 917
        var prefix = options.interpolationPrefix ? f.regexEscape(options.interpolationPrefix) : o.interpolationPrefixEscaped
          , suffix = options.interpolationSuffix ? f.regexEscape(options.interpolationSuffix) : o.interpolationSuffixEscaped
          , unEscapingSuffix = 'HTML'+suffix;                                                                         // 920
                                                                                                                      // 921
        f.each(replacementHash, function(key, value) {                                                                // 922
            var nextKey = nestedKey ? nestedKey + o.keyseparator + key : key;                                         // 923
            if (typeof value === 'object' && value !== null) {                                                        // 924
                str = applyReplacement(str, value, nextKey, options);                                                 // 925
            } else {                                                                                                  // 926
                if (options.escapeInterpolation || o.escapeInterpolation) {                                           // 927
                    str = str.replace(new RegExp([prefix, nextKey, unEscapingSuffix].join(''), 'g'), value);          // 928
                    str = str.replace(new RegExp([prefix, nextKey, suffix].join(''), 'g'), f.escape(value));          // 929
                } else {                                                                                              // 930
                    str = str.replace(new RegExp([prefix, nextKey, suffix].join(''), 'g'), value);                    // 931
                }                                                                                                     // 932
                // str = options.escapeInterpolation;                                                                 // 933
            }                                                                                                         // 934
        });                                                                                                           // 935
        return str;                                                                                                   // 936
    }                                                                                                                 // 937
                                                                                                                      // 938
    // append it to functions                                                                                         // 939
    f.applyReplacement = applyReplacement;                                                                            // 940
                                                                                                                      // 941
    function applyReuse(translated, options) {                                                                        // 942
        var comma = ',';                                                                                              // 943
        var options_open = '{';                                                                                       // 944
        var options_close = '}';                                                                                      // 945
                                                                                                                      // 946
        var opts = f.extend({}, options);                                                                             // 947
        delete opts.postProcess;                                                                                      // 948
                                                                                                                      // 949
        while (translated.indexOf(o.reusePrefix) != -1) {                                                             // 950
            replacementCounter++;                                                                                     // 951
            if (replacementCounter > o.maxRecursion) { break; } // safety net for too much recursion                  // 952
            var index_of_opening = translated.lastIndexOf(o.reusePrefix);                                             // 953
            var index_of_end_of_closing = translated.indexOf(o.reuseSuffix, index_of_opening) + o.reuseSuffix.length;
            var token = translated.substring(index_of_opening, index_of_end_of_closing);                              // 955
            var token_without_symbols = token.replace(o.reusePrefix, '').replace(o.reuseSuffix, '');                  // 956
                                                                                                                      // 957
                                                                                                                      // 958
            if (token_without_symbols.indexOf(comma) != -1) {                                                         // 959
                var index_of_token_end_of_closing = token_without_symbols.indexOf(comma);                             // 960
                if (token_without_symbols.indexOf(options_open, index_of_token_end_of_closing) != -1 && token_without_symbols.indexOf(options_close, index_of_token_end_of_closing) != -1) {
                    var index_of_opts_opening = token_without_symbols.indexOf(options_open, index_of_token_end_of_closing);
                    var index_of_opts_end_of_closing = token_without_symbols.indexOf(options_close, index_of_opts_opening) + options_close.length;
                    try {                                                                                             // 964
                        opts = f.extend(opts, JSON.parse(token_without_symbols.substring(index_of_opts_opening, index_of_opts_end_of_closing)));
                        token_without_symbols = token_without_symbols.substring(0, index_of_token_end_of_closing);    // 966
                    } catch (e) {                                                                                     // 967
                    }                                                                                                 // 968
                }                                                                                                     // 969
            }                                                                                                         // 970
                                                                                                                      // 971
            var translated_token = _translate(token_without_symbols, opts);                                           // 972
            translated = translated.replace(token, translated_token);                                                 // 973
        }                                                                                                             // 974
        return translated;                                                                                            // 975
    }                                                                                                                 // 976
                                                                                                                      // 977
    function hasContext(options) {                                                                                    // 978
        return (options.context && (typeof options.context == 'string' || typeof options.context == 'number'));       // 979
    }                                                                                                                 // 980
                                                                                                                      // 981
    function needsPlural(options) {                                                                                   // 982
        return (options.count !== undefined && typeof options.count != 'string' && options.count !== 1);              // 983
    }                                                                                                                 // 984
                                                                                                                      // 985
    function exists(key, options) {                                                                                   // 986
        options = options || {};                                                                                      // 987
                                                                                                                      // 988
        var notFound = _getDefaultValue(key, options)                                                                 // 989
            , found = _find(key, options);                                                                            // 990
                                                                                                                      // 991
        return found !== undefined || found === notFound;                                                             // 992
    }                                                                                                                 // 993
                                                                                                                      // 994
    function translate(key, options) {                                                                                // 995
        if (typeof options === 'undefined') {                                                                         // 996
          options = {};                                                                                               // 997
        }                                                                                                             // 998
                                                                                                                      // 999
        if (!initialized) {                                                                                           // 1000
            f.log('i18next not finished initialization. you might have called t function before loading resources finished.')
            return options.defaultValue || '';                                                                        // 1002
        };                                                                                                            // 1003
        replacementCounter = 0;                                                                                       // 1004
        return _translate.apply(null, arguments);                                                                     // 1005
    }                                                                                                                 // 1006
                                                                                                                      // 1007
    function _getDefaultValue(key, options) {                                                                         // 1008
        return (options.defaultValue !== undefined) ? options.defaultValue : key;                                     // 1009
    }                                                                                                                 // 1010
                                                                                                                      // 1011
    function _injectSprintfProcessor() {                                                                              // 1012
                                                                                                                      // 1013
        var values = [];                                                                                              // 1014
                                                                                                                      // 1015
        // mh: build array from second argument onwards                                                               // 1016
        for (var i = 1; i < arguments.length; i++) {                                                                  // 1017
            values.push(arguments[i]);                                                                                // 1018
        }                                                                                                             // 1019
                                                                                                                      // 1020
        return {                                                                                                      // 1021
            postProcess: 'sprintf',                                                                                   // 1022
            sprintf:     values                                                                                       // 1023
        };                                                                                                            // 1024
    }                                                                                                                 // 1025
                                                                                                                      // 1026
    function _translate(potentialKeys, options) {                                                                     // 1027
        if (typeof options !== "undefined" && options !== null && typeof options !== 'object') {                      // 1028
            if (o.shortcutFunction === 'sprintf') {                                                                   // 1029
                // mh: gettext like sprintf syntax found, automatically create sprintf processor                      // 1030
                options = _injectSprintfProcessor.apply(null, arguments);                                             // 1031
            } else if (o.shortcutFunction === 'defaultValue') {                                                       // 1032
                options = {                                                                                           // 1033
                    defaultValue: options                                                                             // 1034
                }                                                                                                     // 1035
            }                                                                                                         // 1036
        } else {                                                                                                      // 1037
            options = options || {};                                                                                  // 1038
        }                                                                                                             // 1039
                                                                                                                      // 1040
        if (potentialKeys === undefined || potentialKeys === null) return '';                                         // 1041
                                                                                                                      // 1042
        if (typeof potentialKeys == 'string') {                                                                       // 1043
            potentialKeys = [potentialKeys];                                                                          // 1044
        }                                                                                                             // 1045
                                                                                                                      // 1046
        var key = potentialKeys[0];                                                                                   // 1047
                                                                                                                      // 1048
        if (potentialKeys.length > 1) {                                                                               // 1049
            for (var i = 0; i < potentialKeys.length; i++) {                                                          // 1050
                key = potentialKeys[i];                                                                               // 1051
                if (exists(key, options)) {                                                                           // 1052
                    break;                                                                                            // 1053
                }                                                                                                     // 1054
            }                                                                                                         // 1055
        }                                                                                                             // 1056
                                                                                                                      // 1057
        var notFound = _getDefaultValue(key, options)                                                                 // 1058
            , found = _find(key, options)                                                                             // 1059
            , lngs = options.lng ? f.toLanguages(options.lng) : languages                                             // 1060
            , ns = options.ns || o.ns.defaultNs                                                                       // 1061
            , parts;                                                                                                  // 1062
                                                                                                                      // 1063
        // split ns and key                                                                                           // 1064
        if (key.indexOf(o.nsseparator) > -1) {                                                                        // 1065
            parts = key.split(o.nsseparator);                                                                         // 1066
            ns = parts[0];                                                                                            // 1067
            key = parts[1];                                                                                           // 1068
        }                                                                                                             // 1069
                                                                                                                      // 1070
        if (found === undefined && o.sendMissing) {                                                                   // 1071
            if (options.lng) {                                                                                        // 1072
                sync.postMissing(lngs[0], ns, key, notFound, lngs);                                                   // 1073
            } else {                                                                                                  // 1074
                sync.postMissing(o.lng, ns, key, notFound, lngs);                                                     // 1075
            }                                                                                                         // 1076
        }                                                                                                             // 1077
                                                                                                                      // 1078
        var postProcessor = options.postProcess || o.postProcess;                                                     // 1079
        if (found !== undefined && postProcessor) {                                                                   // 1080
            if (postProcessors[postProcessor]) {                                                                      // 1081
                found = postProcessors[postProcessor](found, key, options);                                           // 1082
            }                                                                                                         // 1083
        }                                                                                                             // 1084
                                                                                                                      // 1085
        // process notFound if function exists                                                                        // 1086
        var splitNotFound = notFound;                                                                                 // 1087
        if (notFound.indexOf(o.nsseparator) > -1) {                                                                   // 1088
            parts = notFound.split(o.nsseparator);                                                                    // 1089
            splitNotFound = parts[1];                                                                                 // 1090
        }                                                                                                             // 1091
        if (splitNotFound === key && o.parseMissingKey) {                                                             // 1092
            notFound = o.parseMissingKey(notFound);                                                                   // 1093
        }                                                                                                             // 1094
                                                                                                                      // 1095
        if (found === undefined) {                                                                                    // 1096
            notFound = applyReplacement(notFound, options);                                                           // 1097
            notFound = applyReuse(notFound, options);                                                                 // 1098
                                                                                                                      // 1099
            if (postProcessor && postProcessors[postProcessor]) {                                                     // 1100
                var val = _getDefaultValue(key, options);                                                             // 1101
                found = postProcessors[postProcessor](val, key, options);                                             // 1102
            }                                                                                                         // 1103
        }                                                                                                             // 1104
                                                                                                                      // 1105
        return (found !== undefined) ? found : notFound;                                                              // 1106
    }                                                                                                                 // 1107
                                                                                                                      // 1108
    function _find(key, options) {                                                                                    // 1109
        options = options || {};                                                                                      // 1110
                                                                                                                      // 1111
        var optionWithoutCount, translated                                                                            // 1112
            , notFound = _getDefaultValue(key, options)                                                               // 1113
            , lngs = languages;                                                                                       // 1114
                                                                                                                      // 1115
        if (!resStore) { return notFound; } // no resStore to translate from                                          // 1116
                                                                                                                      // 1117
        // CI mode                                                                                                    // 1118
        if (lngs[0].toLowerCase() === 'cimode') return notFound;                                                      // 1119
                                                                                                                      // 1120
        // passed in lng                                                                                              // 1121
        if (options.lng) {                                                                                            // 1122
            lngs = f.toLanguages(options.lng);                                                                        // 1123
                                                                                                                      // 1124
            if (!resStore[lngs[0]]) {                                                                                 // 1125
                var oldAsync = o.getAsync;                                                                            // 1126
                o.getAsync = false;                                                                                   // 1127
                                                                                                                      // 1128
                TAPi18next.sync.load(lngs, o, function(err, store) {                                                  // 1129
                    f.extend(resStore, store);                                                                        // 1130
                    o.getAsync = oldAsync;                                                                            // 1131
                });                                                                                                   // 1132
            }                                                                                                         // 1133
        }                                                                                                             // 1134
                                                                                                                      // 1135
        var ns = options.ns || o.ns.defaultNs;                                                                        // 1136
        if (key.indexOf(o.nsseparator) > -1) {                                                                        // 1137
            var parts = key.split(o.nsseparator);                                                                     // 1138
            ns = parts[0];                                                                                            // 1139
            key = parts[1];                                                                                           // 1140
        }                                                                                                             // 1141
                                                                                                                      // 1142
        if (hasContext(options)) {                                                                                    // 1143
            optionWithoutCount = f.extend({}, options);                                                               // 1144
            delete optionWithoutCount.context;                                                                        // 1145
            optionWithoutCount.defaultValue = o.contextNotFound;                                                      // 1146
                                                                                                                      // 1147
            var contextKey = ns + o.nsseparator + key + '_' + options.context;                                        // 1148
                                                                                                                      // 1149
            translated = translate(contextKey, optionWithoutCount);                                                   // 1150
            if (translated != o.contextNotFound) {                                                                    // 1151
                return applyReplacement(translated, { context: options.context }); // apply replacement for context only
            } // else continue translation with original/nonContext key                                               // 1153
        }                                                                                                             // 1154
                                                                                                                      // 1155
        if (needsPlural(options)) {                                                                                   // 1156
            optionWithoutCount = f.extend({}, options);                                                               // 1157
            delete optionWithoutCount.count;                                                                          // 1158
            optionWithoutCount.defaultValue = o.pluralNotFound;                                                       // 1159
                                                                                                                      // 1160
            var pluralKey = ns + o.nsseparator + key + o.pluralSuffix;                                                // 1161
            var pluralExtension = pluralExtensions.get(lngs[0], options.count);                                       // 1162
            if (pluralExtension >= 0) {                                                                               // 1163
                pluralKey = pluralKey + '_' + pluralExtension;                                                        // 1164
            } else if (pluralExtension === 1) {                                                                       // 1165
                pluralKey = ns + o.nsseparator + key; // singular                                                     // 1166
            }                                                                                                         // 1167
                                                                                                                      // 1168
            translated = translate(pluralKey, optionWithoutCount);                                                    // 1169
            if (translated != o.pluralNotFound) {                                                                     // 1170
                return applyReplacement(translated, {                                                                 // 1171
                    count: options.count,                                                                             // 1172
                    interpolationPrefix: options.interpolationPrefix,                                                 // 1173
                    interpolationSuffix: options.interpolationSuffix                                                  // 1174
                }); // apply replacement for count only                                                               // 1175
            } // else continue translation with original/singular key                                                 // 1176
        }                                                                                                             // 1177
                                                                                                                      // 1178
        var found;                                                                                                    // 1179
        var keys = key.split(o.keyseparator);                                                                         // 1180
        for (var i = 0, len = lngs.length; i < len; i++ ) {                                                           // 1181
            if (found !== undefined) break;                                                                           // 1182
                                                                                                                      // 1183
            var l = lngs[i];                                                                                          // 1184
                                                                                                                      // 1185
            var x = 0;                                                                                                // 1186
            var value = resStore[l] && resStore[l][ns];                                                               // 1187
            while (keys[x]) {                                                                                         // 1188
                value = value && value[keys[x]];                                                                      // 1189
                x++;                                                                                                  // 1190
            }                                                                                                         // 1191
            if (value !== undefined) {                                                                                // 1192
                var valueType = Object.prototype.toString.apply(value);                                               // 1193
                if (typeof value === 'string') {                                                                      // 1194
                    value = applyReplacement(value, options);                                                         // 1195
                    value = applyReuse(value, options);                                                               // 1196
                } else if (valueType === '[object Array]' && !o.returnObjectTrees && !options.returnObjectTrees) {    // 1197
                    value = value.join('\n');                                                                         // 1198
                    value = applyReplacement(value, options);                                                         // 1199
                    value = applyReuse(value, options);                                                               // 1200
                } else if (value === null && o.fallbackOnNull === true) {                                             // 1201
                    value = undefined;                                                                                // 1202
                } else if (value !== null) {                                                                          // 1203
                    if (!o.returnObjectTrees && !options.returnObjectTrees) {                                         // 1204
                        if (o.objectTreeKeyHandler && typeof o.objectTreeKeyHandler == 'function') {                  // 1205
                            value = o.objectTreeKeyHandler(key, value, l, ns, options);                               // 1206
                        } else {                                                                                      // 1207
                            value = 'key \'' + ns + ':' + key + ' (' + l + ')\' ' +                                   // 1208
                                'returned an object instead of string.';                                              // 1209
                            f.log(value);                                                                             // 1210
                        }                                                                                             // 1211
                    } else if (valueType !== '[object Number]' && valueType !== '[object Function]' && valueType !== '[object RegExp]') {
                        var copy = (valueType === '[object Array]') ? [] : {}; // apply child translation on a copy   // 1213
                        f.each(value, function(m) {                                                                   // 1214
                            copy[m] = _translate(ns + o.nsseparator + key + o.keyseparator + m, options);             // 1215
                        });                                                                                           // 1216
                        value = copy;                                                                                 // 1217
                    }                                                                                                 // 1218
                }                                                                                                     // 1219
                                                                                                                      // 1220
                if (typeof value === 'string' && value.trim() === '' && o.fallbackOnEmpty === true)                   // 1221
                    value = undefined;                                                                                // 1222
                                                                                                                      // 1223
                found = value;                                                                                        // 1224
            }                                                                                                         // 1225
        }                                                                                                             // 1226
                                                                                                                      // 1227
        if (found === undefined && !options.isFallbackLookup && (o.fallbackToDefaultNS === true || (o.fallbackNS && o.fallbackNS.length > 0))) {
            // set flag for fallback lookup - avoid recursion                                                         // 1229
            options.isFallbackLookup = true;                                                                          // 1230
                                                                                                                      // 1231
            if (o.fallbackNS.length) {                                                                                // 1232
                                                                                                                      // 1233
                for (var y = 0, lenY = o.fallbackNS.length; y < lenY; y++) {                                          // 1234
                    found = _find(o.fallbackNS[y] + o.nsseparator + key, options);                                    // 1235
                                                                                                                      // 1236
                    if (found) {                                                                                      // 1237
                        /* compare value without namespace */                                                         // 1238
                        var foundValue = found.indexOf(o.nsseparator) > -1 ? found.split(o.nsseparator)[1] : found    // 1239
                          , notFoundValue = notFound.indexOf(o.nsseparator) > -1 ? notFound.split(o.nsseparator)[1] : notFound;
                                                                                                                      // 1241
                        if (foundValue !== notFoundValue) break;                                                      // 1242
                    }                                                                                                 // 1243
                }                                                                                                     // 1244
            } else {                                                                                                  // 1245
                found = _find(key, options); // fallback to default NS                                                // 1246
            }                                                                                                         // 1247
        }                                                                                                             // 1248
                                                                                                                      // 1249
        return found;                                                                                                 // 1250
    }                                                                                                                 // 1251
    function detectLanguage() {                                                                                       // 1252
        var detectedLng;                                                                                              // 1253
                                                                                                                      // 1254
        // get from qs                                                                                                // 1255
        var qsParm = [];                                                                                              // 1256
        if (typeof window !== 'undefined') {                                                                          // 1257
            (function() {                                                                                             // 1258
                var query = window.location.search.substring(1);                                                      // 1259
                var parms = query.split('&');                                                                         // 1260
                for (var i=0; i<parms.length; i++) {                                                                  // 1261
                    var pos = parms[i].indexOf('=');                                                                  // 1262
                    if (pos > 0) {                                                                                    // 1263
                        var key = parms[i].substring(0,pos);                                                          // 1264
                        var val = parms[i].substring(pos+1);                                                          // 1265
                        qsParm[key] = val;                                                                            // 1266
                    }                                                                                                 // 1267
                }                                                                                                     // 1268
            })();                                                                                                     // 1269
            if (qsParm[o.detectLngQS]) {                                                                              // 1270
                detectedLng = qsParm[o.detectLngQS];                                                                  // 1271
            }                                                                                                         // 1272
        }                                                                                                             // 1273
                                                                                                                      // 1274
        // get from cookie                                                                                            // 1275
        if (!detectedLng && typeof document !== 'undefined' && o.useCookie ) {                                        // 1276
            var c = f.cookie.read(o.cookieName);                                                                      // 1277
            if (c) detectedLng = c;                                                                                   // 1278
        }                                                                                                             // 1279
                                                                                                                      // 1280
        // get from navigator                                                                                         // 1281
        if (!detectedLng && typeof navigator !== 'undefined') {                                                       // 1282
            detectedLng =  (navigator.language) ? navigator.language : navigator.userLanguage;                        // 1283
        }                                                                                                             // 1284
                                                                                                                      // 1285
        return detectedLng;                                                                                           // 1286
    }                                                                                                                 // 1287
    var sync = {                                                                                                      // 1288
                                                                                                                      // 1289
        load: function(lngs, options, cb) {                                                                           // 1290
            if (options.useLocalStorage) {                                                                            // 1291
                sync._loadLocal(lngs, options, function(err, store) {                                                 // 1292
                    var missingLngs = [];                                                                             // 1293
                    for (var i = 0, len = lngs.length; i < len; i++) {                                                // 1294
                        if (!store[lngs[i]]) missingLngs.push(lngs[i]);                                               // 1295
                    }                                                                                                 // 1296
                                                                                                                      // 1297
                    if (missingLngs.length > 0) {                                                                     // 1298
                        sync._fetch(missingLngs, options, function(err, fetched) {                                    // 1299
                            f.extend(store, fetched);                                                                 // 1300
                            sync._storeLocal(fetched);                                                                // 1301
                                                                                                                      // 1302
                            cb(null, store);                                                                          // 1303
                        });                                                                                           // 1304
                    } else {                                                                                          // 1305
                        cb(null, store);                                                                              // 1306
                    }                                                                                                 // 1307
                });                                                                                                   // 1308
            } else {                                                                                                  // 1309
                sync._fetch(lngs, options, function(err, store){                                                      // 1310
                    cb(null, store);                                                                                  // 1311
                });                                                                                                   // 1312
            }                                                                                                         // 1313
        },                                                                                                            // 1314
                                                                                                                      // 1315
        _loadLocal: function(lngs, options, cb) {                                                                     // 1316
            var store = {}                                                                                            // 1317
              , nowMS = new Date().getTime();                                                                         // 1318
                                                                                                                      // 1319
            if(window.localStorage) {                                                                                 // 1320
                                                                                                                      // 1321
                var todo = lngs.length;                                                                               // 1322
                                                                                                                      // 1323
                f.each(lngs, function(key, lng) {                                                                     // 1324
                    var local = window.localStorage.getItem('res_' + lng);                                            // 1325
                                                                                                                      // 1326
                    if (local) {                                                                                      // 1327
                        local = JSON.parse(local);                                                                    // 1328
                                                                                                                      // 1329
                        if (local.i18nStamp && local.i18nStamp + options.localStorageExpirationTime > nowMS) {        // 1330
                            store[lng] = local;                                                                       // 1331
                        }                                                                                             // 1332
                    }                                                                                                 // 1333
                                                                                                                      // 1334
                    todo--; // wait for all done befor callback                                                       // 1335
                    if (todo === 0) cb(null, store);                                                                  // 1336
                });                                                                                                   // 1337
            }                                                                                                         // 1338
        },                                                                                                            // 1339
                                                                                                                      // 1340
        _storeLocal: function(store) {                                                                                // 1341
            if(window.localStorage) {                                                                                 // 1342
                for (var m in store) {                                                                                // 1343
                    store[m].i18nStamp = new Date().getTime();                                                        // 1344
                    window.localStorage.setItem('res_' + m, JSON.stringify(store[m]));                                // 1345
                }                                                                                                     // 1346
            }                                                                                                         // 1347
            return;                                                                                                   // 1348
        },                                                                                                            // 1349
                                                                                                                      // 1350
        _fetch: function(lngs, options, cb) {                                                                         // 1351
            var ns = options.ns                                                                                       // 1352
              , store = {};                                                                                           // 1353
                                                                                                                      // 1354
            if (!options.dynamicLoad) {                                                                               // 1355
                var todo = ns.namespaces.length * lngs.length                                                         // 1356
                  , errors;                                                                                           // 1357
                                                                                                                      // 1358
                // load each file individual                                                                          // 1359
                f.each(ns.namespaces, function(nsIndex, nsValue) {                                                    // 1360
                    f.each(lngs, function(lngIndex, lngValue) {                                                       // 1361
                                                                                                                      // 1362
                        // Call this once our translation has returned.                                               // 1363
                        var loadComplete = function(err, data) {                                                      // 1364
                            if (err) {                                                                                // 1365
                                errors = errors || [];                                                                // 1366
                                errors.push(err);                                                                     // 1367
                            }                                                                                         // 1368
                            store[lngValue] = store[lngValue] || {};                                                  // 1369
                            store[lngValue][nsValue] = data;                                                          // 1370
                                                                                                                      // 1371
                            todo--; // wait for all done befor callback                                               // 1372
                            if (todo === 0) cb(errors, store);                                                        // 1373
                        };                                                                                            // 1374
                                                                                                                      // 1375
                        if(typeof options.customLoad == 'function'){                                                  // 1376
                            // Use the specified custom callback.                                                     // 1377
                            options.customLoad(lngValue, nsValue, options, loadComplete);                             // 1378
                        } else {                                                                                      // 1379
                            //~ // Use our inbuilt sync.                                                              // 1380
                            sync._fetchOne(lngValue, nsValue, options, loadComplete);                                 // 1381
                        }                                                                                             // 1382
                    });                                                                                               // 1383
                });                                                                                                   // 1384
            } else {                                                                                                  // 1385
                // Call this once our translation has returned.                                                       // 1386
                var loadComplete = function(err, data) {                                                              // 1387
                    cb(null, data);                                                                                   // 1388
                };                                                                                                    // 1389
                                                                                                                      // 1390
                if(typeof options.customLoad == 'function'){                                                          // 1391
                    // Use the specified custom callback.                                                             // 1392
                    options.customLoad(lngs, ns.namespaces, options, loadComplete);                                   // 1393
                } else {                                                                                              // 1394
                    var url = applyReplacement(options.resGetPath, { lng: lngs.join('+'), ns: ns.namespaces.join('+') });
                    // load all needed stuff once                                                                     // 1396
                    f.ajax({                                                                                          // 1397
                        url: url,                                                                                     // 1398
                        success: function(data, status, xhr) {                                                        // 1399
                            f.log('loaded: ' + url);                                                                  // 1400
                            loadComplete(null, data);                                                                 // 1401
                        },                                                                                            // 1402
                        error : function(xhr, status, error) {                                                        // 1403
                            f.log('failed loading: ' + url);                                                          // 1404
                            loadComplete('failed loading resource.json error: ' + error);                             // 1405
                        },                                                                                            // 1406
                        dataType: "json",                                                                             // 1407
                        async : options.getAsync                                                                      // 1408
                    });                                                                                               // 1409
                }                                                                                                     // 1410
            }                                                                                                         // 1411
        },                                                                                                            // 1412
                                                                                                                      // 1413
        _fetchOne: function(lng, ns, options, done) {                                                                 // 1414
            var url = applyReplacement(options.resGetPath, { lng: lng, ns: ns });                                     // 1415
            f.ajax({                                                                                                  // 1416
                url: url,                                                                                             // 1417
                success: function(data, status, xhr) {                                                                // 1418
                    f.log('loaded: ' + url);                                                                          // 1419
                    done(null, data);                                                                                 // 1420
                },                                                                                                    // 1421
                error : function(xhr, status, error) {                                                                // 1422
                    if ((status && status == 200) || (xhr && xhr.status && xhr.status == 200)) {                      // 1423
                        // file loaded but invalid json, stop waste time !                                            // 1424
                        f.log('There is a typo in: ' + url);                                                          // 1425
                    } else if ((status && status == 404) || (xhr && xhr.status && xhr.status == 404)) {               // 1426
                        f.log('Does not exist: ' + url);                                                              // 1427
                    } else {                                                                                          // 1428
                        var theStatus = status ? status : ((xhr && xhr.status) ? xhr.status : null);                  // 1429
                        f.log(theStatus + ' when loading ' + url);                                                    // 1430
                    }                                                                                                 // 1431
                                                                                                                      // 1432
                    done(error, {});                                                                                  // 1433
                },                                                                                                    // 1434
                dataType: "json",                                                                                     // 1435
                async : options.getAsync                                                                              // 1436
            });                                                                                                       // 1437
        },                                                                                                            // 1438
                                                                                                                      // 1439
        postMissing: function(lng, ns, key, defaultValue, lngs) {                                                     // 1440
            var payload = {};                                                                                         // 1441
            payload[key] = defaultValue;                                                                              // 1442
                                                                                                                      // 1443
            var urls = [];                                                                                            // 1444
                                                                                                                      // 1445
            if (o.sendMissingTo === 'fallback' && o.fallbackLng[0] !== false) {                                       // 1446
                for (var i = 0; i < o.fallbackLng.length; i++) {                                                      // 1447
                    urls.push({lng: o.fallbackLng[i], url: applyReplacement(o.resPostPath, { lng: o.fallbackLng[i], ns: ns })});
                }                                                                                                     // 1449
            } else if (o.sendMissingTo === 'current' || (o.sendMissingTo === 'fallback' && o.fallbackLng[0] === false) ) {
                urls.push({lng: lng, url: applyReplacement(o.resPostPath, { lng: lng, ns: ns })});                    // 1451
            } else if (o.sendMissingTo === 'all') {                                                                   // 1452
                for (var i = 0, l = lngs.length; i < l; i++) {                                                        // 1453
                    urls.push({lng: lngs[i], url: applyReplacement(o.resPostPath, { lng: lngs[i], ns: ns })});        // 1454
                }                                                                                                     // 1455
            }                                                                                                         // 1456
                                                                                                                      // 1457
            for (var y = 0, len = urls.length; y < len; y++) {                                                        // 1458
                var item = urls[y];                                                                                   // 1459
                f.ajax({                                                                                              // 1460
                    url: item.url,                                                                                    // 1461
                    type: o.sendType,                                                                                 // 1462
                    data: payload,                                                                                    // 1463
                    success: function(data, status, xhr) {                                                            // 1464
                        f.log('posted missing key \'' + key + '\' to: ' + item.url);                                  // 1465
                                                                                                                      // 1466
                        // add key to resStore                                                                        // 1467
                        var keys = key.split('.');                                                                    // 1468
                        var x = 0;                                                                                    // 1469
                        var value = resStore[item.lng][ns];                                                           // 1470
                        while (keys[x]) {                                                                             // 1471
                            if (x === keys.length - 1) {                                                              // 1472
                                value = value[keys[x]] = defaultValue;                                                // 1473
                            } else {                                                                                  // 1474
                                value = value[keys[x]] = value[keys[x]] || {};                                        // 1475
                            }                                                                                         // 1476
                            x++;                                                                                      // 1477
                        }                                                                                             // 1478
                    },                                                                                                // 1479
                    error : function(xhr, status, error) {                                                            // 1480
                        f.log('failed posting missing key \'' + key + '\' to: ' + item.url);                          // 1481
                    },                                                                                                // 1482
                    dataType: "json",                                                                                 // 1483
                    async : o.postAsync                                                                               // 1484
                });                                                                                                   // 1485
            }                                                                                                         // 1486
        }                                                                                                             // 1487
    };                                                                                                                // 1488
    // definition http://translate.sourceforge.net/wiki/l10n/pluralforms                                              // 1489
    var pluralExtensions = {                                                                                          // 1490
                                                                                                                      // 1491
        rules: {                                                                                                      // 1492
            "ach": {                                                                                                  // 1493
                "name": "Acholi",                                                                                     // 1494
                "numbers": [                                                                                          // 1495
                    1,                                                                                                // 1496
                    2                                                                                                 // 1497
                ],                                                                                                    // 1498
                "plurals": function(n) { return Number(n > 1); }                                                      // 1499
            },                                                                                                        // 1500
            "af": {                                                                                                   // 1501
                "name": "Afrikaans",                                                                                  // 1502
                "numbers": [                                                                                          // 1503
                    1,                                                                                                // 1504
                    2                                                                                                 // 1505
                ],                                                                                                    // 1506
                "plurals": function(n) { return Number(n != 1); }                                                     // 1507
            },                                                                                                        // 1508
            "ak": {                                                                                                   // 1509
                "name": "Akan",                                                                                       // 1510
                "numbers": [                                                                                          // 1511
                    1,                                                                                                // 1512
                    2                                                                                                 // 1513
                ],                                                                                                    // 1514
                "plurals": function(n) { return Number(n > 1); }                                                      // 1515
            },                                                                                                        // 1516
            "am": {                                                                                                   // 1517
                "name": "Amharic",                                                                                    // 1518
                "numbers": [                                                                                          // 1519
                    1,                                                                                                // 1520
                    2                                                                                                 // 1521
                ],                                                                                                    // 1522
                "plurals": function(n) { return Number(n > 1); }                                                      // 1523
            },                                                                                                        // 1524
            "an": {                                                                                                   // 1525
                "name": "Aragonese",                                                                                  // 1526
                "numbers": [                                                                                          // 1527
                    1,                                                                                                // 1528
                    2                                                                                                 // 1529
                ],                                                                                                    // 1530
                "plurals": function(n) { return Number(n != 1); }                                                     // 1531
            },                                                                                                        // 1532
            "ar": {                                                                                                   // 1533
                "name": "Arabic",                                                                                     // 1534
                "numbers": [                                                                                          // 1535
                    0,                                                                                                // 1536
                    1,                                                                                                // 1537
                    2,                                                                                                // 1538
                    3,                                                                                                // 1539
                    11,                                                                                               // 1540
                    100                                                                                               // 1541
                ],                                                                                                    // 1542
                "plurals": function(n) { return Number(n===0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5); }
            },                                                                                                        // 1544
            "arn": {                                                                                                  // 1545
                "name": "Mapudungun",                                                                                 // 1546
                "numbers": [                                                                                          // 1547
                    1,                                                                                                // 1548
                    2                                                                                                 // 1549
                ],                                                                                                    // 1550
                "plurals": function(n) { return Number(n > 1); }                                                      // 1551
            },                                                                                                        // 1552
            "ast": {                                                                                                  // 1553
                "name": "Asturian",                                                                                   // 1554
                "numbers": [                                                                                          // 1555
                    1,                                                                                                // 1556
                    2                                                                                                 // 1557
                ],                                                                                                    // 1558
                "plurals": function(n) { return Number(n != 1); }                                                     // 1559
            },                                                                                                        // 1560
            "ay": {                                                                                                   // 1561
                "name": "Aymar\u00e1",                                                                                // 1562
                "numbers": [                                                                                          // 1563
                    1                                                                                                 // 1564
                ],                                                                                                    // 1565
                "plurals": function(n) { return 0; }                                                                  // 1566
            },                                                                                                        // 1567
            "az": {                                                                                                   // 1568
                "name": "Azerbaijani",                                                                                // 1569
                "numbers": [                                                                                          // 1570
                    1,                                                                                                // 1571
                    2                                                                                                 // 1572
                ],                                                                                                    // 1573
                "plurals": function(n) { return Number(n != 1); }                                                     // 1574
            },                                                                                                        // 1575
            "be": {                                                                                                   // 1576
                "name": "Belarusian",                                                                                 // 1577
                "numbers": [                                                                                          // 1578
                    1,                                                                                                // 1579
                    2,                                                                                                // 1580
                    5                                                                                                 // 1581
                ],                                                                                                    // 1582
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },                                                                                                        // 1584
            "bg": {                                                                                                   // 1585
                "name": "Bulgarian",                                                                                  // 1586
                "numbers": [                                                                                          // 1587
                    1,                                                                                                // 1588
                    2                                                                                                 // 1589
                ],                                                                                                    // 1590
                "plurals": function(n) { return Number(n != 1); }                                                     // 1591
            },                                                                                                        // 1592
            "bn": {                                                                                                   // 1593
                "name": "Bengali",                                                                                    // 1594
                "numbers": [                                                                                          // 1595
                    1,                                                                                                // 1596
                    2                                                                                                 // 1597
                ],                                                                                                    // 1598
                "plurals": function(n) { return Number(n != 1); }                                                     // 1599
            },                                                                                                        // 1600
            "bo": {                                                                                                   // 1601
                "name": "Tibetan",                                                                                    // 1602
                "numbers": [                                                                                          // 1603
                    1                                                                                                 // 1604
                ],                                                                                                    // 1605
                "plurals": function(n) { return 0; }                                                                  // 1606
            },                                                                                                        // 1607
            "br": {                                                                                                   // 1608
                "name": "Breton",                                                                                     // 1609
                "numbers": [                                                                                          // 1610
                    1,                                                                                                // 1611
                    2                                                                                                 // 1612
                ],                                                                                                    // 1613
                "plurals": function(n) { return Number(n > 1); }                                                      // 1614
            },                                                                                                        // 1615
            "bs": {                                                                                                   // 1616
                "name": "Bosnian",                                                                                    // 1617
                "numbers": [                                                                                          // 1618
                    1,                                                                                                // 1619
                    2,                                                                                                // 1620
                    5                                                                                                 // 1621
                ],                                                                                                    // 1622
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },                                                                                                        // 1624
            "ca": {                                                                                                   // 1625
                "name": "Catalan",                                                                                    // 1626
                "numbers": [                                                                                          // 1627
                    1,                                                                                                // 1628
                    2                                                                                                 // 1629
                ],                                                                                                    // 1630
                "plurals": function(n) { return Number(n != 1); }                                                     // 1631
            },                                                                                                        // 1632
            "cgg": {                                                                                                  // 1633
                "name": "Chiga",                                                                                      // 1634
                "numbers": [                                                                                          // 1635
                    1                                                                                                 // 1636
                ],                                                                                                    // 1637
                "plurals": function(n) { return 0; }                                                                  // 1638
            },                                                                                                        // 1639
            "cs": {                                                                                                   // 1640
                "name": "Czech",                                                                                      // 1641
                "numbers": [                                                                                          // 1642
                    1,                                                                                                // 1643
                    2,                                                                                                // 1644
                    5                                                                                                 // 1645
                ],                                                                                                    // 1646
                "plurals": function(n) { return Number((n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2); }                        // 1647
            },                                                                                                        // 1648
            "csb": {                                                                                                  // 1649
                "name": "Kashubian",                                                                                  // 1650
                "numbers": [                                                                                          // 1651
                    1,                                                                                                // 1652
                    2,                                                                                                // 1653
                    5                                                                                                 // 1654
                ],                                                                                                    // 1655
                "plurals": function(n) { return Number(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },                                                                                                        // 1657
            "cy": {                                                                                                   // 1658
                "name": "Welsh",                                                                                      // 1659
                "numbers": [                                                                                          // 1660
                    1,                                                                                                // 1661
                    2,                                                                                                // 1662
                    3,                                                                                                // 1663
                    8                                                                                                 // 1664
                ],                                                                                                    // 1665
                "plurals": function(n) { return Number((n==1) ? 0 : (n==2) ? 1 : (n != 8 && n != 11) ? 2 : 3); }      // 1666
            },                                                                                                        // 1667
            "da": {                                                                                                   // 1668
                "name": "Danish",                                                                                     // 1669
                "numbers": [                                                                                          // 1670
                    1,                                                                                                // 1671
                    2                                                                                                 // 1672
                ],                                                                                                    // 1673
                "plurals": function(n) { return Number(n != 1); }                                                     // 1674
            },                                                                                                        // 1675
            "de": {                                                                                                   // 1676
                "name": "German",                                                                                     // 1677
                "numbers": [                                                                                          // 1678
                    1,                                                                                                // 1679
                    2                                                                                                 // 1680
                ],                                                                                                    // 1681
                "plurals": function(n) { return Number(n != 1); }                                                     // 1682
            },                                                                                                        // 1683
            "dz": {                                                                                                   // 1684
                "name": "Dzongkha",                                                                                   // 1685
                "numbers": [                                                                                          // 1686
                    1                                                                                                 // 1687
                ],                                                                                                    // 1688
                "plurals": function(n) { return 0; }                                                                  // 1689
            },                                                                                                        // 1690
            "el": {                                                                                                   // 1691
                "name": "Greek",                                                                                      // 1692
                "numbers": [                                                                                          // 1693
                    1,                                                                                                // 1694
                    2                                                                                                 // 1695
                ],                                                                                                    // 1696
                "plurals": function(n) { return Number(n != 1); }                                                     // 1697
            },                                                                                                        // 1698
            "en": {                                                                                                   // 1699
                "name": "English",                                                                                    // 1700
                "numbers": [                                                                                          // 1701
                    1,                                                                                                // 1702
                    2                                                                                                 // 1703
                ],                                                                                                    // 1704
                "plurals": function(n) { return Number(n != 1); }                                                     // 1705
            },                                                                                                        // 1706
            "eo": {                                                                                                   // 1707
                "name": "Esperanto",                                                                                  // 1708
                "numbers": [                                                                                          // 1709
                    1,                                                                                                // 1710
                    2                                                                                                 // 1711
                ],                                                                                                    // 1712
                "plurals": function(n) { return Number(n != 1); }                                                     // 1713
            },                                                                                                        // 1714
            "es": {                                                                                                   // 1715
                "name": "Spanish",                                                                                    // 1716
                "numbers": [                                                                                          // 1717
                    1,                                                                                                // 1718
                    2                                                                                                 // 1719
                ],                                                                                                    // 1720
                "plurals": function(n) { return Number(n != 1); }                                                     // 1721
            },                                                                                                        // 1722
            "es_ar": {                                                                                                // 1723
                "name": "Argentinean Spanish",                                                                        // 1724
                "numbers": [                                                                                          // 1725
                    1,                                                                                                // 1726
                    2                                                                                                 // 1727
                ],                                                                                                    // 1728
                "plurals": function(n) { return Number(n != 1); }                                                     // 1729
            },                                                                                                        // 1730
            "et": {                                                                                                   // 1731
                "name": "Estonian",                                                                                   // 1732
                "numbers": [                                                                                          // 1733
                    1,                                                                                                // 1734
                    2                                                                                                 // 1735
                ],                                                                                                    // 1736
                "plurals": function(n) { return Number(n != 1); }                                                     // 1737
            },                                                                                                        // 1738
            "eu": {                                                                                                   // 1739
                "name": "Basque",                                                                                     // 1740
                "numbers": [                                                                                          // 1741
                    1,                                                                                                // 1742
                    2                                                                                                 // 1743
                ],                                                                                                    // 1744
                "plurals": function(n) { return Number(n != 1); }                                                     // 1745
            },                                                                                                        // 1746
            "fa": {                                                                                                   // 1747
                "name": "Persian",                                                                                    // 1748
                "numbers": [                                                                                          // 1749
                    1                                                                                                 // 1750
                ],                                                                                                    // 1751
                "plurals": function(n) { return 0; }                                                                  // 1752
            },                                                                                                        // 1753
            "fi": {                                                                                                   // 1754
                "name": "Finnish",                                                                                    // 1755
                "numbers": [                                                                                          // 1756
                    1,                                                                                                // 1757
                    2                                                                                                 // 1758
                ],                                                                                                    // 1759
                "plurals": function(n) { return Number(n != 1); }                                                     // 1760
            },                                                                                                        // 1761
            "fil": {                                                                                                  // 1762
                "name": "Filipino",                                                                                   // 1763
                "numbers": [                                                                                          // 1764
                    1,                                                                                                // 1765
                    2                                                                                                 // 1766
                ],                                                                                                    // 1767
                "plurals": function(n) { return Number(n > 1); }                                                      // 1768
            },                                                                                                        // 1769
            "fo": {                                                                                                   // 1770
                "name": "Faroese",                                                                                    // 1771
                "numbers": [                                                                                          // 1772
                    1,                                                                                                // 1773
                    2                                                                                                 // 1774
                ],                                                                                                    // 1775
                "plurals": function(n) { return Number(n != 1); }                                                     // 1776
            },                                                                                                        // 1777
            "fr": {                                                                                                   // 1778
                "name": "French",                                                                                     // 1779
                "numbers": [                                                                                          // 1780
                    1,                                                                                                // 1781
                    2                                                                                                 // 1782
                ],                                                                                                    // 1783
                "plurals": function(n) { return Number(n > 1); }                                                      // 1784
            },                                                                                                        // 1785
            "fur": {                                                                                                  // 1786
                "name": "Friulian",                                                                                   // 1787
                "numbers": [                                                                                          // 1788
                    1,                                                                                                // 1789
                    2                                                                                                 // 1790
                ],                                                                                                    // 1791
                "plurals": function(n) { return Number(n != 1); }                                                     // 1792
            },                                                                                                        // 1793
            "fy": {                                                                                                   // 1794
                "name": "Frisian",                                                                                    // 1795
                "numbers": [                                                                                          // 1796
                    1,                                                                                                // 1797
                    2                                                                                                 // 1798
                ],                                                                                                    // 1799
                "plurals": function(n) { return Number(n != 1); }                                                     // 1800
            },                                                                                                        // 1801
            "ga": {                                                                                                   // 1802
                "name": "Irish",                                                                                      // 1803
                "numbers": [                                                                                          // 1804
                    1,                                                                                                // 1805
                    2,                                                                                                // 1806
                    3,                                                                                                // 1807
                    7,                                                                                                // 1808
                    11                                                                                                // 1809
                ],                                                                                                    // 1810
                "plurals": function(n) { return Number(n==1 ? 0 : n==2 ? 1 : n<7 ? 2 : n<11 ? 3 : 4) ;}               // 1811
            },                                                                                                        // 1812
            "gd": {                                                                                                   // 1813
                "name": "Scottish Gaelic",                                                                            // 1814
                "numbers": [                                                                                          // 1815
                    1,                                                                                                // 1816
                    2,                                                                                                // 1817
                    3,                                                                                                // 1818
                    20                                                                                                // 1819
                ],                                                                                                    // 1820
                "plurals": function(n) { return Number((n==1 || n==11) ? 0 : (n==2 || n==12) ? 1 : (n > 2 && n < 20) ? 2 : 3); }
            },                                                                                                        // 1822
            "gl": {                                                                                                   // 1823
                "name": "Galician",                                                                                   // 1824
                "numbers": [                                                                                          // 1825
                    1,                                                                                                // 1826
                    2                                                                                                 // 1827
                ],                                                                                                    // 1828
                "plurals": function(n) { return Number(n != 1); }                                                     // 1829
            },                                                                                                        // 1830
            "gu": {                                                                                                   // 1831
                "name": "Gujarati",                                                                                   // 1832
                "numbers": [                                                                                          // 1833
                    1,                                                                                                // 1834
                    2                                                                                                 // 1835
                ],                                                                                                    // 1836
                "plurals": function(n) { return Number(n != 1); }                                                     // 1837
            },                                                                                                        // 1838
            "gun": {                                                                                                  // 1839
                "name": "Gun",                                                                                        // 1840
                "numbers": [                                                                                          // 1841
                    1,                                                                                                // 1842
                    2                                                                                                 // 1843
                ],                                                                                                    // 1844
                "plurals": function(n) { return Number(n > 1); }                                                      // 1845
            },                                                                                                        // 1846
            "ha": {                                                                                                   // 1847
                "name": "Hausa",                                                                                      // 1848
                "numbers": [                                                                                          // 1849
                    1,                                                                                                // 1850
                    2                                                                                                 // 1851
                ],                                                                                                    // 1852
                "plurals": function(n) { return Number(n != 1); }                                                     // 1853
            },                                                                                                        // 1854
            "he": {                                                                                                   // 1855
                "name": "Hebrew",                                                                                     // 1856
                "numbers": [                                                                                          // 1857
                    1,                                                                                                // 1858
                    2                                                                                                 // 1859
                ],                                                                                                    // 1860
                "plurals": function(n) { return Number(n != 1); }                                                     // 1861
            },                                                                                                        // 1862
            "hi": {                                                                                                   // 1863
                "name": "Hindi",                                                                                      // 1864
                "numbers": [                                                                                          // 1865
                    1,                                                                                                // 1866
                    2                                                                                                 // 1867
                ],                                                                                                    // 1868
                "plurals": function(n) { return Number(n != 1); }                                                     // 1869
            },                                                                                                        // 1870
            "hr": {                                                                                                   // 1871
                "name": "Croatian",                                                                                   // 1872
                "numbers": [                                                                                          // 1873
                    1,                                                                                                // 1874
                    2,                                                                                                // 1875
                    5                                                                                                 // 1876
                ],                                                                                                    // 1877
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },                                                                                                        // 1879
            "hu": {                                                                                                   // 1880
                "name": "Hungarian",                                                                                  // 1881
                "numbers": [                                                                                          // 1882
                    1,                                                                                                // 1883
                    2                                                                                                 // 1884
                ],                                                                                                    // 1885
                "plurals": function(n) { return Number(n != 1); }                                                     // 1886
            },                                                                                                        // 1887
            "hy": {                                                                                                   // 1888
                "name": "Armenian",                                                                                   // 1889
                "numbers": [                                                                                          // 1890
                    1,                                                                                                // 1891
                    2                                                                                                 // 1892
                ],                                                                                                    // 1893
                "plurals": function(n) { return Number(n != 1); }                                                     // 1894
            },                                                                                                        // 1895
            "ia": {                                                                                                   // 1896
                "name": "Interlingua",                                                                                // 1897
                "numbers": [                                                                                          // 1898
                    1,                                                                                                // 1899
                    2                                                                                                 // 1900
                ],                                                                                                    // 1901
                "plurals": function(n) { return Number(n != 1); }                                                     // 1902
            },                                                                                                        // 1903
            "id": {                                                                                                   // 1904
                "name": "Indonesian",                                                                                 // 1905
                "numbers": [                                                                                          // 1906
                    1                                                                                                 // 1907
                ],                                                                                                    // 1908
                "plurals": function(n) { return 0; }                                                                  // 1909
            },                                                                                                        // 1910
            "is": {                                                                                                   // 1911
                "name": "Icelandic",                                                                                  // 1912
                "numbers": [                                                                                          // 1913
                    1,                                                                                                // 1914
                    2                                                                                                 // 1915
                ],                                                                                                    // 1916
                "plurals": function(n) { return Number(n%10!=1 || n%100==11); }                                       // 1917
            },                                                                                                        // 1918
            "it": {                                                                                                   // 1919
                "name": "Italian",                                                                                    // 1920
                "numbers": [                                                                                          // 1921
                    1,                                                                                                // 1922
                    2                                                                                                 // 1923
                ],                                                                                                    // 1924
                "plurals": function(n) { return Number(n != 1); }                                                     // 1925
            },                                                                                                        // 1926
            "ja": {                                                                                                   // 1927
                "name": "Japanese",                                                                                   // 1928
                "numbers": [                                                                                          // 1929
                    1                                                                                                 // 1930
                ],                                                                                                    // 1931
                "plurals": function(n) { return 0; }                                                                  // 1932
            },                                                                                                        // 1933
            "jbo": {                                                                                                  // 1934
                "name": "Lojban",                                                                                     // 1935
                "numbers": [                                                                                          // 1936
                    1                                                                                                 // 1937
                ],                                                                                                    // 1938
                "plurals": function(n) { return 0; }                                                                  // 1939
            },                                                                                                        // 1940
            "jv": {                                                                                                   // 1941
                "name": "Javanese",                                                                                   // 1942
                "numbers": [                                                                                          // 1943
                    0,                                                                                                // 1944
                    1                                                                                                 // 1945
                ],                                                                                                    // 1946
                "plurals": function(n) { return Number(n !== 0); }                                                    // 1947
            },                                                                                                        // 1948
            "ka": {                                                                                                   // 1949
                "name": "Georgian",                                                                                   // 1950
                "numbers": [                                                                                          // 1951
                    1                                                                                                 // 1952
                ],                                                                                                    // 1953
                "plurals": function(n) { return 0; }                                                                  // 1954
            },                                                                                                        // 1955
            "kk": {                                                                                                   // 1956
                "name": "Kazakh",                                                                                     // 1957
                "numbers": [                                                                                          // 1958
                    1                                                                                                 // 1959
                ],                                                                                                    // 1960
                "plurals": function(n) { return 0; }                                                                  // 1961
            },                                                                                                        // 1962
            "km": {                                                                                                   // 1963
                "name": "Khmer",                                                                                      // 1964
                "numbers": [                                                                                          // 1965
                    1                                                                                                 // 1966
                ],                                                                                                    // 1967
                "plurals": function(n) { return 0; }                                                                  // 1968
            },                                                                                                        // 1969
            "kn": {                                                                                                   // 1970
                "name": "Kannada",                                                                                    // 1971
                "numbers": [                                                                                          // 1972
                    1,                                                                                                // 1973
                    2                                                                                                 // 1974
                ],                                                                                                    // 1975
                "plurals": function(n) { return Number(n != 1); }                                                     // 1976
            },                                                                                                        // 1977
            "ko": {                                                                                                   // 1978
                "name": "Korean",                                                                                     // 1979
                "numbers": [                                                                                          // 1980
                    1                                                                                                 // 1981
                ],                                                                                                    // 1982
                "plurals": function(n) { return 0; }                                                                  // 1983
            },                                                                                                        // 1984
            "ku": {                                                                                                   // 1985
                "name": "Kurdish",                                                                                    // 1986
                "numbers": [                                                                                          // 1987
                    1,                                                                                                // 1988
                    2                                                                                                 // 1989
                ],                                                                                                    // 1990
                "plurals": function(n) { return Number(n != 1); }                                                     // 1991
            },                                                                                                        // 1992
            "kw": {                                                                                                   // 1993
                "name": "Cornish",                                                                                    // 1994
                "numbers": [                                                                                          // 1995
                    1,                                                                                                // 1996
                    2,                                                                                                // 1997
                    3,                                                                                                // 1998
                    4                                                                                                 // 1999
                ],                                                                                                    // 2000
                "plurals": function(n) { return Number((n==1) ? 0 : (n==2) ? 1 : (n == 3) ? 2 : 3); }                 // 2001
            },                                                                                                        // 2002
            "ky": {                                                                                                   // 2003
                "name": "Kyrgyz",                                                                                     // 2004
                "numbers": [                                                                                          // 2005
                    1                                                                                                 // 2006
                ],                                                                                                    // 2007
                "plurals": function(n) { return 0; }                                                                  // 2008
            },                                                                                                        // 2009
            "lb": {                                                                                                   // 2010
                "name": "Letzeburgesch",                                                                              // 2011
                "numbers": [                                                                                          // 2012
                    1,                                                                                                // 2013
                    2                                                                                                 // 2014
                ],                                                                                                    // 2015
                "plurals": function(n) { return Number(n != 1); }                                                     // 2016
            },                                                                                                        // 2017
            "ln": {                                                                                                   // 2018
                "name": "Lingala",                                                                                    // 2019
                "numbers": [                                                                                          // 2020
                    1,                                                                                                // 2021
                    2                                                                                                 // 2022
                ],                                                                                                    // 2023
                "plurals": function(n) { return Number(n > 1); }                                                      // 2024
            },                                                                                                        // 2025
            "lo": {                                                                                                   // 2026
                "name": "Lao",                                                                                        // 2027
                "numbers": [                                                                                          // 2028
                    1                                                                                                 // 2029
                ],                                                                                                    // 2030
                "plurals": function(n) { return 0; }                                                                  // 2031
            },                                                                                                        // 2032
            "lt": {                                                                                                   // 2033
                "name": "Lithuanian",                                                                                 // 2034
                "numbers": [                                                                                          // 2035
                    1,                                                                                                // 2036
                    2,                                                                                                // 2037
                    10                                                                                                // 2038
                ],                                                                                                    // 2039
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },                                                                                                        // 2041
            "lv": {                                                                                                   // 2042
                "name": "Latvian",                                                                                    // 2043
                "numbers": [                                                                                          // 2044
                    1,                                                                                                // 2045
                    2,                                                                                                // 2046
                    0                                                                                                 // 2047
                ],                                                                                                    // 2048
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n !== 0 ? 1 : 2); }                 // 2049
            },                                                                                                        // 2050
            "mai": {                                                                                                  // 2051
                "name": "Maithili",                                                                                   // 2052
                "numbers": [                                                                                          // 2053
                    1,                                                                                                // 2054
                    2                                                                                                 // 2055
                ],                                                                                                    // 2056
                "plurals": function(n) { return Number(n != 1); }                                                     // 2057
            },                                                                                                        // 2058
            "mfe": {                                                                                                  // 2059
                "name": "Mauritian Creole",                                                                           // 2060
                "numbers": [                                                                                          // 2061
                    1,                                                                                                // 2062
                    2                                                                                                 // 2063
                ],                                                                                                    // 2064
                "plurals": function(n) { return Number(n > 1); }                                                      // 2065
            },                                                                                                        // 2066
            "mg": {                                                                                                   // 2067
                "name": "Malagasy",                                                                                   // 2068
                "numbers": [                                                                                          // 2069
                    1,                                                                                                // 2070
                    2                                                                                                 // 2071
                ],                                                                                                    // 2072
                "plurals": function(n) { return Number(n > 1); }                                                      // 2073
            },                                                                                                        // 2074
            "mi": {                                                                                                   // 2075
                "name": "Maori",                                                                                      // 2076
                "numbers": [                                                                                          // 2077
                    1,                                                                                                // 2078
                    2                                                                                                 // 2079
                ],                                                                                                    // 2080
                "plurals": function(n) { return Number(n > 1); }                                                      // 2081
            },                                                                                                        // 2082
            "mk": {                                                                                                   // 2083
                "name": "Macedonian",                                                                                 // 2084
                "numbers": [                                                                                          // 2085
                    1,                                                                                                // 2086
                    2                                                                                                 // 2087
                ],                                                                                                    // 2088
                "plurals": function(n) { return Number(n==1 || n%10==1 ? 0 : 1); }                                    // 2089
            },                                                                                                        // 2090
            "ml": {                                                                                                   // 2091
                "name": "Malayalam",                                                                                  // 2092
                "numbers": [                                                                                          // 2093
                    1,                                                                                                // 2094
                    2                                                                                                 // 2095
                ],                                                                                                    // 2096
                "plurals": function(n) { return Number(n != 1); }                                                     // 2097
            },                                                                                                        // 2098
            "mn": {                                                                                                   // 2099
                "name": "Mongolian",                                                                                  // 2100
                "numbers": [                                                                                          // 2101
                    1,                                                                                                // 2102
                    2                                                                                                 // 2103
                ],                                                                                                    // 2104
                "plurals": function(n) { return Number(n != 1); }                                                     // 2105
            },                                                                                                        // 2106
            "mnk": {                                                                                                  // 2107
                "name": "Mandinka",                                                                                   // 2108
                "numbers": [                                                                                          // 2109
                    0,                                                                                                // 2110
                    1,                                                                                                // 2111
                    2                                                                                                 // 2112
                ],                                                                                                    // 2113
                "plurals": function(n) { return Number(n == 0 ? 0 : n==1 ? 1 : 2); }                                  // 2114
            },                                                                                                        // 2115
            "mr": {                                                                                                   // 2116
                "name": "Marathi",                                                                                    // 2117
                "numbers": [                                                                                          // 2118
                    1,                                                                                                // 2119
                    2                                                                                                 // 2120
                ],                                                                                                    // 2121
                "plurals": function(n) { return Number(n != 1); }                                                     // 2122
            },                                                                                                        // 2123
            "ms": {                                                                                                   // 2124
                "name": "Malay",                                                                                      // 2125
                "numbers": [                                                                                          // 2126
                    1                                                                                                 // 2127
                ],                                                                                                    // 2128
                "plurals": function(n) { return 0; }                                                                  // 2129
            },                                                                                                        // 2130
            "mt": {                                                                                                   // 2131
                "name": "Maltese",                                                                                    // 2132
                "numbers": [                                                                                          // 2133
                    1,                                                                                                // 2134
                    2,                                                                                                // 2135
                    11,                                                                                               // 2136
                    20                                                                                                // 2137
                ],                                                                                                    // 2138
                "plurals": function(n) { return Number(n==1 ? 0 : n===0 || ( n%100>1 && n%100<11) ? 1 : (n%100>10 && n%100<20 ) ? 2 : 3); }
            },                                                                                                        // 2140
            "nah": {                                                                                                  // 2141
                "name": "Nahuatl",                                                                                    // 2142
                "numbers": [                                                                                          // 2143
                    1,                                                                                                // 2144
                    2                                                                                                 // 2145
                ],                                                                                                    // 2146
                "plurals": function(n) { return Number(n != 1); }                                                     // 2147
            },                                                                                                        // 2148
            "nap": {                                                                                                  // 2149
                "name": "Neapolitan",                                                                                 // 2150
                "numbers": [                                                                                          // 2151
                    1,                                                                                                // 2152
                    2                                                                                                 // 2153
                ],                                                                                                    // 2154
                "plurals": function(n) { return Number(n != 1); }                                                     // 2155
            },                                                                                                        // 2156
            "nb": {                                                                                                   // 2157
                "name": "Norwegian Bokmal",                                                                           // 2158
                "numbers": [                                                                                          // 2159
                    1,                                                                                                // 2160
                    2                                                                                                 // 2161
                ],                                                                                                    // 2162
                "plurals": function(n) { return Number(n != 1); }                                                     // 2163
            },                                                                                                        // 2164
            "ne": {                                                                                                   // 2165
                "name": "Nepali",                                                                                     // 2166
                "numbers": [                                                                                          // 2167
                    1,                                                                                                // 2168
                    2                                                                                                 // 2169
                ],                                                                                                    // 2170
                "plurals": function(n) { return Number(n != 1); }                                                     // 2171
            },                                                                                                        // 2172
            "nl": {                                                                                                   // 2173
                "name": "Dutch",                                                                                      // 2174
                "numbers": [                                                                                          // 2175
                    1,                                                                                                // 2176
                    2                                                                                                 // 2177
                ],                                                                                                    // 2178
                "plurals": function(n) { return Number(n != 1); }                                                     // 2179
            },                                                                                                        // 2180
            "nn": {                                                                                                   // 2181
                "name": "Norwegian Nynorsk",                                                                          // 2182
                "numbers": [                                                                                          // 2183
                    1,                                                                                                // 2184
                    2                                                                                                 // 2185
                ],                                                                                                    // 2186
                "plurals": function(n) { return Number(n != 1); }                                                     // 2187
            },                                                                                                        // 2188
            "no": {                                                                                                   // 2189
                "name": "Norwegian",                                                                                  // 2190
                "numbers": [                                                                                          // 2191
                    1,                                                                                                // 2192
                    2                                                                                                 // 2193
                ],                                                                                                    // 2194
                "plurals": function(n) { return Number(n != 1); }                                                     // 2195
            },                                                                                                        // 2196
            "nso": {                                                                                                  // 2197
                "name": "Northern Sotho",                                                                             // 2198
                "numbers": [                                                                                          // 2199
                    1,                                                                                                // 2200
                    2                                                                                                 // 2201
                ],                                                                                                    // 2202
                "plurals": function(n) { return Number(n != 1); }                                                     // 2203
            },                                                                                                        // 2204
            "oc": {                                                                                                   // 2205
                "name": "Occitan",                                                                                    // 2206
                "numbers": [                                                                                          // 2207
                    1,                                                                                                // 2208
                    2                                                                                                 // 2209
                ],                                                                                                    // 2210
                "plurals": function(n) { return Number(n > 1); }                                                      // 2211
            },                                                                                                        // 2212
            "or": {                                                                                                   // 2213
                "name": "Oriya",                                                                                      // 2214
                "numbers": [                                                                                          // 2215
                    2,                                                                                                // 2216
                    1                                                                                                 // 2217
                ],                                                                                                    // 2218
                "plurals": function(n) { return Number(n != 1); }                                                     // 2219
            },                                                                                                        // 2220
            "pa": {                                                                                                   // 2221
                "name": "Punjabi",                                                                                    // 2222
                "numbers": [                                                                                          // 2223
                    1,                                                                                                // 2224
                    2                                                                                                 // 2225
                ],                                                                                                    // 2226
                "plurals": function(n) { return Number(n != 1); }                                                     // 2227
            },                                                                                                        // 2228
            "pap": {                                                                                                  // 2229
                "name": "Papiamento",                                                                                 // 2230
                "numbers": [                                                                                          // 2231
                    1,                                                                                                // 2232
                    2                                                                                                 // 2233
                ],                                                                                                    // 2234
                "plurals": function(n) { return Number(n != 1); }                                                     // 2235
            },                                                                                                        // 2236
            "pl": {                                                                                                   // 2237
                "name": "Polish",                                                                                     // 2238
                "numbers": [                                                                                          // 2239
                    1,                                                                                                // 2240
                    2,                                                                                                // 2241
                    5                                                                                                 // 2242
                ],                                                                                                    // 2243
                "plurals": function(n) { return Number(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },                                                                                                        // 2245
            "pms": {                                                                                                  // 2246
                "name": "Piemontese",                                                                                 // 2247
                "numbers": [                                                                                          // 2248
                    1,                                                                                                // 2249
                    2                                                                                                 // 2250
                ],                                                                                                    // 2251
                "plurals": function(n) { return Number(n != 1); }                                                     // 2252
            },                                                                                                        // 2253
            "ps": {                                                                                                   // 2254
                "name": "Pashto",                                                                                     // 2255
                "numbers": [                                                                                          // 2256
                    1,                                                                                                // 2257
                    2                                                                                                 // 2258
                ],                                                                                                    // 2259
                "plurals": function(n) { return Number(n != 1); }                                                     // 2260
            },                                                                                                        // 2261
            "pt": {                                                                                                   // 2262
                "name": "Portuguese",                                                                                 // 2263
                "numbers": [                                                                                          // 2264
                    1,                                                                                                // 2265
                    2                                                                                                 // 2266
                ],                                                                                                    // 2267
                "plurals": function(n) { return Number(n != 1); }                                                     // 2268
            },                                                                                                        // 2269
            "pt_br": {                                                                                                // 2270
                "name": "Brazilian Portuguese",                                                                       // 2271
                "numbers": [                                                                                          // 2272
                    1,                                                                                                // 2273
                    2                                                                                                 // 2274
                ],                                                                                                    // 2275
                "plurals": function(n) { return Number(n != 1); }                                                     // 2276
            },                                                                                                        // 2277
            "rm": {                                                                                                   // 2278
                "name": "Romansh",                                                                                    // 2279
                "numbers": [                                                                                          // 2280
                    1,                                                                                                // 2281
                    2                                                                                                 // 2282
                ],                                                                                                    // 2283
                "plurals": function(n) { return Number(n != 1); }                                                     // 2284
            },                                                                                                        // 2285
            "ro": {                                                                                                   // 2286
                "name": "Romanian",                                                                                   // 2287
                "numbers": [                                                                                          // 2288
                    1,                                                                                                // 2289
                    2,                                                                                                // 2290
                    20                                                                                                // 2291
                ],                                                                                                    // 2292
                "plurals": function(n) { return Number(n==1 ? 0 : (n===0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2); }    // 2293
            },                                                                                                        // 2294
            "ru": {                                                                                                   // 2295
                "name": "Russian",                                                                                    // 2296
                "numbers": [                                                                                          // 2297
                    1,                                                                                                // 2298
                    2,                                                                                                // 2299
                    5                                                                                                 // 2300
                ],                                                                                                    // 2301
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },                                                                                                        // 2303
            "sah": {                                                                                                  // 2304
                "name": "Yakut",                                                                                      // 2305
                "numbers": [                                                                                          // 2306
                    1                                                                                                 // 2307
                ],                                                                                                    // 2308
                "plurals": function(n) { return 0; }                                                                  // 2309
            },                                                                                                        // 2310
            "sco": {                                                                                                  // 2311
                "name": "Scots",                                                                                      // 2312
                "numbers": [                                                                                          // 2313
                    1,                                                                                                // 2314
                    2                                                                                                 // 2315
                ],                                                                                                    // 2316
                "plurals": function(n) { return Number(n != 1); }                                                     // 2317
            },                                                                                                        // 2318
            "se": {                                                                                                   // 2319
                "name": "Northern Sami",                                                                              // 2320
                "numbers": [                                                                                          // 2321
                    1,                                                                                                // 2322
                    2                                                                                                 // 2323
                ],                                                                                                    // 2324
                "plurals": function(n) { return Number(n != 1); }                                                     // 2325
            },                                                                                                        // 2326
            "si": {                                                                                                   // 2327
                "name": "Sinhala",                                                                                    // 2328
                "numbers": [                                                                                          // 2329
                    1,                                                                                                // 2330
                    2                                                                                                 // 2331
                ],                                                                                                    // 2332
                "plurals": function(n) { return Number(n != 1); }                                                     // 2333
            },                                                                                                        // 2334
            "sk": {                                                                                                   // 2335
                "name": "Slovak",                                                                                     // 2336
                "numbers": [                                                                                          // 2337
                    1,                                                                                                // 2338
                    2,                                                                                                // 2339
                    5                                                                                                 // 2340
                ],                                                                                                    // 2341
                "plurals": function(n) { return Number((n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2); }                        // 2342
            },                                                                                                        // 2343
            "sl": {                                                                                                   // 2344
                "name": "Slovenian",                                                                                  // 2345
                "numbers": [                                                                                          // 2346
                    5,                                                                                                // 2347
                    1,                                                                                                // 2348
                    2,                                                                                                // 2349
                    3                                                                                                 // 2350
                ],                                                                                                    // 2351
                "plurals": function(n) { return Number(n%100==1 ? 1 : n%100==2 ? 2 : n%100==3 || n%100==4 ? 3 : 0); }
            },                                                                                                        // 2353
            "so": {                                                                                                   // 2354
                "name": "Somali",                                                                                     // 2355
                "numbers": [                                                                                          // 2356
                    1,                                                                                                // 2357
                    2                                                                                                 // 2358
                ],                                                                                                    // 2359
                "plurals": function(n) { return Number(n != 1); }                                                     // 2360
            },                                                                                                        // 2361
            "son": {                                                                                                  // 2362
                "name": "Songhay",                                                                                    // 2363
                "numbers": [                                                                                          // 2364
                    1,                                                                                                // 2365
                    2                                                                                                 // 2366
                ],                                                                                                    // 2367
                "plurals": function(n) { return Number(n != 1); }                                                     // 2368
            },                                                                                                        // 2369
            "sq": {                                                                                                   // 2370
                "name": "Albanian",                                                                                   // 2371
                "numbers": [                                                                                          // 2372
                    1,                                                                                                // 2373
                    2                                                                                                 // 2374
                ],                                                                                                    // 2375
                "plurals": function(n) { return Number(n != 1); }                                                     // 2376
            },                                                                                                        // 2377
            "sr": {                                                                                                   // 2378
                "name": "Serbian",                                                                                    // 2379
                "numbers": [                                                                                          // 2380
                    1,                                                                                                // 2381
                    2,                                                                                                // 2382
                    5                                                                                                 // 2383
                ],                                                                                                    // 2384
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },                                                                                                        // 2386
            "su": {                                                                                                   // 2387
                "name": "Sundanese",                                                                                  // 2388
                "numbers": [                                                                                          // 2389
                    1                                                                                                 // 2390
                ],                                                                                                    // 2391
                "plurals": function(n) { return 0; }                                                                  // 2392
            },                                                                                                        // 2393
            "sv": {                                                                                                   // 2394
                "name": "Swedish",                                                                                    // 2395
                "numbers": [                                                                                          // 2396
                    1,                                                                                                // 2397
                    2                                                                                                 // 2398
                ],                                                                                                    // 2399
                "plurals": function(n) { return Number(n != 1); }                                                     // 2400
            },                                                                                                        // 2401
            "sw": {                                                                                                   // 2402
                "name": "Swahili",                                                                                    // 2403
                "numbers": [                                                                                          // 2404
                    1,                                                                                                // 2405
                    2                                                                                                 // 2406
                ],                                                                                                    // 2407
                "plurals": function(n) { return Number(n != 1); }                                                     // 2408
            },                                                                                                        // 2409
            "ta": {                                                                                                   // 2410
                "name": "Tamil",                                                                                      // 2411
                "numbers": [                                                                                          // 2412
                    1,                                                                                                // 2413
                    2                                                                                                 // 2414
                ],                                                                                                    // 2415
                "plurals": function(n) { return Number(n != 1); }                                                     // 2416
            },                                                                                                        // 2417
            "te": {                                                                                                   // 2418
                "name": "Telugu",                                                                                     // 2419
                "numbers": [                                                                                          // 2420
                    1,                                                                                                // 2421
                    2                                                                                                 // 2422
                ],                                                                                                    // 2423
                "plurals": function(n) { return Number(n != 1); }                                                     // 2424
            },                                                                                                        // 2425
            "tg": {                                                                                                   // 2426
                "name": "Tajik",                                                                                      // 2427
                "numbers": [                                                                                          // 2428
                    1,                                                                                                // 2429
                    2                                                                                                 // 2430
                ],                                                                                                    // 2431
                "plurals": function(n) { return Number(n > 1); }                                                      // 2432
            },                                                                                                        // 2433
            "th": {                                                                                                   // 2434
                "name": "Thai",                                                                                       // 2435
                "numbers": [                                                                                          // 2436
                    1                                                                                                 // 2437
                ],                                                                                                    // 2438
                "plurals": function(n) { return 0; }                                                                  // 2439
            },                                                                                                        // 2440
            "ti": {                                                                                                   // 2441
                "name": "Tigrinya",                                                                                   // 2442
                "numbers": [                                                                                          // 2443
                    1,                                                                                                // 2444
                    2                                                                                                 // 2445
                ],                                                                                                    // 2446
                "plurals": function(n) { return Number(n > 1); }                                                      // 2447
            },                                                                                                        // 2448
            "tk": {                                                                                                   // 2449
                "name": "Turkmen",                                                                                    // 2450
                "numbers": [                                                                                          // 2451
                    1,                                                                                                // 2452
                    2                                                                                                 // 2453
                ],                                                                                                    // 2454
                "plurals": function(n) { return Number(n != 1); }                                                     // 2455
            },                                                                                                        // 2456
            "tr": {                                                                                                   // 2457
                "name": "Turkish",                                                                                    // 2458
                "numbers": [                                                                                          // 2459
                    1,                                                                                                // 2460
                    2                                                                                                 // 2461
                ],                                                                                                    // 2462
                "plurals": function(n) { return Number(n > 1); }                                                      // 2463
            },                                                                                                        // 2464
            "tt": {                                                                                                   // 2465
                "name": "Tatar",                                                                                      // 2466
                "numbers": [                                                                                          // 2467
                    1                                                                                                 // 2468
                ],                                                                                                    // 2469
                "plurals": function(n) { return 0; }                                                                  // 2470
            },                                                                                                        // 2471
            "ug": {                                                                                                   // 2472
                "name": "Uyghur",                                                                                     // 2473
                "numbers": [                                                                                          // 2474
                    1                                                                                                 // 2475
                ],                                                                                                    // 2476
                "plurals": function(n) { return 0; }                                                                  // 2477
            },                                                                                                        // 2478
            "uk": {                                                                                                   // 2479
                "name": "Ukrainian",                                                                                  // 2480
                "numbers": [                                                                                          // 2481
                    1,                                                                                                // 2482
                    2,                                                                                                // 2483
                    5                                                                                                 // 2484
                ],                                                                                                    // 2485
                "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
            },                                                                                                        // 2487
            "ur": {                                                                                                   // 2488
                "name": "Urdu",                                                                                       // 2489
                "numbers": [                                                                                          // 2490
                    1,                                                                                                // 2491
                    2                                                                                                 // 2492
                ],                                                                                                    // 2493
                "plurals": function(n) { return Number(n != 1); }                                                     // 2494
            },                                                                                                        // 2495
            "uz": {                                                                                                   // 2496
                "name": "Uzbek",                                                                                      // 2497
                "numbers": [                                                                                          // 2498
                    1,                                                                                                // 2499
                    2                                                                                                 // 2500
                ],                                                                                                    // 2501
                "plurals": function(n) { return Number(n > 1); }                                                      // 2502
            },                                                                                                        // 2503
            "vi": {                                                                                                   // 2504
                "name": "Vietnamese",                                                                                 // 2505
                "numbers": [                                                                                          // 2506
                    1                                                                                                 // 2507
                ],                                                                                                    // 2508
                "plurals": function(n) { return 0; }                                                                  // 2509
            },                                                                                                        // 2510
            "wa": {                                                                                                   // 2511
                "name": "Walloon",                                                                                    // 2512
                "numbers": [                                                                                          // 2513
                    1,                                                                                                // 2514
                    2                                                                                                 // 2515
                ],                                                                                                    // 2516
                "plurals": function(n) { return Number(n > 1); }                                                      // 2517
            },                                                                                                        // 2518
            "wo": {                                                                                                   // 2519
                "name": "Wolof",                                                                                      // 2520
                "numbers": [                                                                                          // 2521
                    1                                                                                                 // 2522
                ],                                                                                                    // 2523
                "plurals": function(n) { return 0; }                                                                  // 2524
            },                                                                                                        // 2525
            "yo": {                                                                                                   // 2526
                "name": "Yoruba",                                                                                     // 2527
                "numbers": [                                                                                          // 2528
                    1,                                                                                                // 2529
                    2                                                                                                 // 2530
                ],                                                                                                    // 2531
                "plurals": function(n) { return Number(n != 1); }                                                     // 2532
            },                                                                                                        // 2533
            "zh": {                                                                                                   // 2534
                "name": "Chinese",                                                                                    // 2535
                "numbers": [                                                                                          // 2536
                    1                                                                                                 // 2537
                ],                                                                                                    // 2538
                "plurals": function(n) { return 0; }                                                                  // 2539
            }                                                                                                         // 2540
        },                                                                                                            // 2541
                                                                                                                      // 2542
        // for demonstration only sl and ar is added but you can add your own pluralExtensions                        // 2543
        addRule: function(lng, obj) {                                                                                 // 2544
            pluralExtensions.rules[lng] = obj;                                                                        // 2545
        },                                                                                                            // 2546
                                                                                                                      // 2547
        setCurrentLng: function(lng) {                                                                                // 2548
            if (!pluralExtensions.currentRule || pluralExtensions.currentRule.lng !== lng) {                          // 2549
                var parts = lng.split('-');                                                                           // 2550
                                                                                                                      // 2551
                pluralExtensions.currentRule = {                                                                      // 2552
                    lng: lng,                                                                                         // 2553
                    rule: pluralExtensions.rules[parts[0]]                                                            // 2554
                };                                                                                                    // 2555
            }                                                                                                         // 2556
        },                                                                                                            // 2557
                                                                                                                      // 2558
        get: function(lng, count) {                                                                                   // 2559
            var parts = lng.split('-');                                                                               // 2560
                                                                                                                      // 2561
            function getResult(l, c) {                                                                                // 2562
                var ext;                                                                                              // 2563
                if (pluralExtensions.currentRule && pluralExtensions.currentRule.lng === lng) {                       // 2564
                    ext = pluralExtensions.currentRule.rule;                                                          // 2565
                } else {                                                                                              // 2566
                    ext = pluralExtensions.rules[l];                                                                  // 2567
                }                                                                                                     // 2568
                if (ext) {                                                                                            // 2569
                    var i = ext.plurals(c);                                                                           // 2570
                    var number = ext.numbers[i];                                                                      // 2571
                    if (ext.numbers.length === 2 && ext.numbers[0] === 1) {                                           // 2572
                        if (number === 2) {                                                                           // 2573
                            number = -1; // regular plural                                                            // 2574
                        } else if (number === 1) {                                                                    // 2575
                            number = 1; // singular                                                                   // 2576
                        }                                                                                             // 2577
                    }//console.log(count + '-' + number);                                                             // 2578
                    return number;                                                                                    // 2579
                } else {                                                                                              // 2580
                    return c === 1 ? '1' : '-1';                                                                      // 2581
                }                                                                                                     // 2582
            }                                                                                                         // 2583
                                                                                                                      // 2584
            return getResult(parts[0], count);                                                                        // 2585
        }                                                                                                             // 2586
                                                                                                                      // 2587
    };                                                                                                                // 2588
    var postProcessors = {};                                                                                          // 2589
    var addPostProcessor = function(name, fc) {                                                                       // 2590
        postProcessors[name] = fc;                                                                                    // 2591
    };                                                                                                                // 2592
    // sprintf support                                                                                                // 2593
    var sprintf = (function() {                                                                                       // 2594
        function get_type(variable) {                                                                                 // 2595
            return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();                               // 2596
        }                                                                                                             // 2597
        function str_repeat(input, multiplier) {                                                                      // 2598
            for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}                    // 2599
            return output.join('');                                                                                   // 2600
        }                                                                                                             // 2601
                                                                                                                      // 2602
        var str_format = function() {                                                                                 // 2603
            if (!str_format.cache.hasOwnProperty(arguments[0])) {                                                     // 2604
                str_format.cache[arguments[0]] = str_format.parse(arguments[0]);                                      // 2605
            }                                                                                                         // 2606
            return str_format.format.call(null, str_format.cache[arguments[0]], arguments);                           // 2607
        };                                                                                                            // 2608
                                                                                                                      // 2609
        str_format.format = function(parse_tree, argv) {                                                              // 2610
            var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
            for (i = 0; i < tree_length; i++) {                                                                       // 2612
                node_type = get_type(parse_tree[i]);                                                                  // 2613
                if (node_type === 'string') {                                                                         // 2614
                    output.push(parse_tree[i]);                                                                       // 2615
                }                                                                                                     // 2616
                else if (node_type === 'array') {                                                                     // 2617
                    match = parse_tree[i]; // convenience purposes only                                               // 2618
                    if (match[2]) { // keyword argument                                                               // 2619
                        arg = argv[cursor];                                                                           // 2620
                        for (k = 0; k < match[2].length; k++) {                                                       // 2621
                            if (!arg.hasOwnProperty(match[2][k])) {                                                   // 2622
                                throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));                // 2623
                            }                                                                                         // 2624
                            arg = arg[match[2][k]];                                                                   // 2625
                        }                                                                                             // 2626
                    }                                                                                                 // 2627
                    else if (match[1]) { // positional argument (explicit)                                            // 2628
                        arg = argv[match[1]];                                                                         // 2629
                    }                                                                                                 // 2630
                    else { // positional argument (implicit)                                                          // 2631
                        arg = argv[cursor++];                                                                         // 2632
                    }                                                                                                 // 2633
                                                                                                                      // 2634
                    if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {                                       // 2635
                        throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));                     // 2636
                    }                                                                                                 // 2637
                    switch (match[8]) {                                                                               // 2638
                        case 'b': arg = arg.toString(2); break;                                                       // 2639
                        case 'c': arg = String.fromCharCode(arg); break;                                              // 2640
                        case 'd': arg = parseInt(arg, 10); break;                                                     // 2641
                        case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;          // 2642
                        case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;        // 2643
                        case 'o': arg = arg.toString(8); break;                                                       // 2644
                        case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;  // 2645
                        case 'u': arg = Math.abs(arg); break;                                                         // 2646
                        case 'x': arg = arg.toString(16); break;                                                      // 2647
                        case 'X': arg = arg.toString(16).toUpperCase(); break;                                        // 2648
                    }                                                                                                 // 2649
                    arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);                          // 2650
                    pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';                      // 2651
                    pad_length = match[6] - String(arg).length;                                                       // 2652
                    pad = match[6] ? str_repeat(pad_character, pad_length) : '';                                      // 2653
                    output.push(match[5] ? arg + pad : pad + arg);                                                    // 2654
                }                                                                                                     // 2655
            }                                                                                                         // 2656
            return output.join('');                                                                                   // 2657
        };                                                                                                            // 2658
                                                                                                                      // 2659
        str_format.cache = {};                                                                                        // 2660
                                                                                                                      // 2661
        str_format.parse = function(fmt) {                                                                            // 2662
            var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;                                               // 2663
            while (_fmt) {                                                                                            // 2664
                if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {                                                      // 2665
                    parse_tree.push(match[0]);                                                                        // 2666
                }                                                                                                     // 2667
                else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {                                                  // 2668
                    parse_tree.push('%');                                                                             // 2669
                }                                                                                                     // 2670
                else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
                    if (match[2]) {                                                                                   // 2672
                        arg_names |= 1;                                                                               // 2673
                        var field_list = [], replacement_field = match[2], field_match = [];                          // 2674
                        if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {                 // 2675
                            field_list.push(field_match[1]);                                                          // 2676
                            while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {       // 2678
                                    field_list.push(field_match[1]);                                                  // 2679
                                }                                                                                     // 2680
                                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {             // 2681
                                    field_list.push(field_match[1]);                                                  // 2682
                                }                                                                                     // 2683
                                else {                                                                                // 2684
                                    throw('[sprintf] huh?');                                                          // 2685
                                }                                                                                     // 2686
                            }                                                                                         // 2687
                        }                                                                                             // 2688
                        else {                                                                                        // 2689
                            throw('[sprintf] huh?');                                                                  // 2690
                        }                                                                                             // 2691
                        match[2] = field_list;                                                                        // 2692
                    }                                                                                                 // 2693
                    else {                                                                                            // 2694
                        arg_names |= 2;                                                                               // 2695
                    }                                                                                                 // 2696
                    if (arg_names === 3) {                                                                            // 2697
                        throw('[sprintf] mixing positional and named placeholders is not (yet) supported');           // 2698
                    }                                                                                                 // 2699
                    parse_tree.push(match);                                                                           // 2700
                }                                                                                                     // 2701
                else {                                                                                                // 2702
                    throw('[sprintf] huh?');                                                                          // 2703
                }                                                                                                     // 2704
                _fmt = _fmt.substring(match[0].length);                                                               // 2705
            }                                                                                                         // 2706
            return parse_tree;                                                                                        // 2707
        };                                                                                                            // 2708
                                                                                                                      // 2709
        return str_format;                                                                                            // 2710
    })();                                                                                                             // 2711
                                                                                                                      // 2712
    var vsprintf = function(fmt, argv) {                                                                              // 2713
        argv.unshift(fmt);                                                                                            // 2714
        return sprintf.apply(null, argv);                                                                             // 2715
    };                                                                                                                // 2716
                                                                                                                      // 2717
    addPostProcessor("sprintf", function(val, key, opts) {                                                            // 2718
        if (!opts.sprintf) return val;                                                                                // 2719
                                                                                                                      // 2720
        if (Object.prototype.toString.apply(opts.sprintf) === '[object Array]') {                                     // 2721
            return vsprintf(val, opts.sprintf);                                                                       // 2722
        } else if (typeof opts.sprintf === 'object') {                                                                // 2723
            return sprintf(val, opts.sprintf);                                                                        // 2724
        }                                                                                                             // 2725
                                                                                                                      // 2726
        return val;                                                                                                   // 2727
    });                                                                                                               // 2728
    // public api interface                                                                                           // 2729
    TAPi18next.init = init;                                                                                           // 2730
    TAPi18next.setLng = setLng;                                                                                       // 2731
    TAPi18next.preload = preload;                                                                                     // 2732
    TAPi18next.addResourceBundle = addResourceBundle;                                                                 // 2733
    TAPi18next.removeResourceBundle = removeResourceBundle;                                                           // 2734
    TAPi18next.loadNamespace = loadNamespace;                                                                         // 2735
    TAPi18next.loadNamespaces = loadNamespaces;                                                                       // 2736
    TAPi18next.setDefaultNamespace = setDefaultNamespace;                                                             // 2737
    TAPi18next.t = translate;                                                                                         // 2738
    TAPi18next.translate = translate;                                                                                 // 2739
    TAPi18next.exists = exists;                                                                                       // 2740
    TAPi18next.detectLanguage = f.detectLanguage;                                                                     // 2741
    TAPi18next.pluralExtensions = pluralExtensions;                                                                   // 2742
    TAPi18next.sync = sync;                                                                                           // 2743
    TAPi18next.functions = f;                                                                                         // 2744
    TAPi18next.lng = lng;                                                                                             // 2745
    TAPi18next.addPostProcessor = addPostProcessor;                                                                   // 2746
    TAPi18next.options = o;                                                                                           // 2747
})();                                                                                                                 // 2748
                                                                                                                      // 2749
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/tap_i18n/lib/tap_i18next/tap_i18next_init.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
TAPi18next.init({resStore: {}, fallbackLng: globals.fallback_language, useCookie: false});                            // 1
                                                                                                                      // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/tap_i18n/lib/tap_i18n/tap_i18n-helpers.coffee.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
share.helpers = {};                                                                                                   // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/tap_i18n/lib/tap_i18n/tap_i18n-common.coffee.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var fallback_language;                                                                                                // 1
                                                                                                                      //
fallback_language = globals.fallback_language;                                                                        // 1
                                                                                                                      //
TAPi18n = function() {                                                                                                // 1
  EventEmitter.call(this);                                                                                            // 4
  this._fallback_language = fallback_language;                                                                        // 4
  this._language_changed_tracker = new Tracker.Dependency;                                                            // 4
  this._loaded_languages = [fallback_language];                                                                       // 4
  this.conf = null;                                                                                                   // 4
  this.packages = {};                                                                                                 // 4
  this.languages_names = {};                                                                                          // 4
  this.translations = {};                                                                                             // 4
  if (Meteor.isClient) {                                                                                              // 27
    Session.set(this._loaded_lang_session_key, null);                                                                 // 28
    this._languageSpecificTranslators = {};                                                                           // 28
    this._languageSpecificTranslatorsTrackers = {};                                                                   // 28
  }                                                                                                                   //
  if (Meteor.isServer) {                                                                                              // 33
    this.server_translators = {};                                                                                     // 34
    Meteor.startup((function(_this) {                                                                                 // 34
      return function() {                                                                                             //
        if (_this._enabled()) {                                                                                       // 38
          return _this._registerHTTPMethod();                                                                         //
        }                                                                                                             //
      };                                                                                                              //
    })(this));                                                                                                        //
  }                                                                                                                   //
  this.__ = this._getPackageI18nextProxy(globals.project_translations_domain);                                        // 4
  TAPi18next.setLng(fallback_language);                                                                               // 4
  return this;                                                                                                        // 45
};                                                                                                                    // 3
                                                                                                                      //
Util.inherits(TAPi18n, EventEmitter);                                                                                 // 1
                                                                                                                      //
_.extend(TAPi18n.prototype, {                                                                                         // 1
  _loaded_lang_session_key: "TAPi18n::loaded_lang",                                                                   // 50
  _enable: function(conf) {                                                                                           // 50
    this.conf = conf;                                                                                                 // 57
    return this._onceEnabled();                                                                                       //
  },                                                                                                                  //
  _onceEnabled: function() {},                                                                                        // 50
  _enabled: function() {                                                                                              // 50
    return this.conf != null;                                                                                         //
  },                                                                                                                  //
  _getPackageDomain: function(package_name) {                                                                         // 50
    return package_name.replace(/:/g, "-");                                                                           //
  },                                                                                                                  //
  addResourceBundle: function(lang_tag, package_name, translations) {                                                 // 50
    return TAPi18next.addResourceBundle(lang_tag, this._getPackageDomain(package_name), translations);                //
  },                                                                                                                  //
  _getSpecificLangTranslator: function(lang) {                                                                        // 50
    var current_lang, translator;                                                                                     // 77
    current_lang = TAPi18next.lng();                                                                                  // 77
    translator = null;                                                                                                // 77
    TAPi18next.setLng(lang, {                                                                                         // 77
      fixLng: true                                                                                                    // 80
    }, (function(_this) {                                                                                             //
      return function(lang_translator) {                                                                              //
        return translator = lang_translator;                                                                          //
      };                                                                                                              //
    })(this));                                                                                                        //
    TAPi18next.setLng(current_lang);                                                                                  // 77
    return translator;                                                                                                // 87
  },                                                                                                                  //
  _getProjectLanguages: function() {                                                                                  // 50
    if (this._enabled()) {                                                                                            // 91
      if (_.isArray(this.conf.supported_languages)) {                                                                 // 92
        return _.union([this._fallback_language], this.conf.supported_languages);                                     // 93
      } else {                                                                                                        //
        return _.keys(this.languages_names);                                                                          // 103
      }                                                                                                               //
    } else {                                                                                                          //
      return [this._fallback_language];                                                                               // 105
    }                                                                                                                 //
  },                                                                                                                  //
  getLanguages: function() {                                                                                          // 50
    var i, lang_tag, languages, len, ref;                                                                             // 108
    if (!this._enabled()) {                                                                                           // 108
      return null;                                                                                                    // 109
    }                                                                                                                 //
    languages = {};                                                                                                   // 108
    ref = this._getProjectLanguages();                                                                                // 112
    for (i = 0, len = ref.length; i < len; i++) {                                                                     // 112
      lang_tag = ref[i];                                                                                              //
      languages[lang_tag] = {                                                                                         // 113
        name: this.languages_names[lang_tag][1],                                                                      // 114
        en: this.languages_names[lang_tag][0]                                                                         // 114
      };                                                                                                              //
    }                                                                                                                 // 112
    return languages;                                                                                                 //
  },                                                                                                                  //
  _loadLangFileObject: function(language_tag, data) {                                                                 // 50
    var package_keys, package_name, ref, results;                                                                     // 120
    results = [];                                                                                                     // 120
    for (package_name in data) {                                                                                      //
      package_keys = data[package_name];                                                                              //
      package_keys = _.extend({}, package_keys, ((ref = this._loadTranslations_cache[language_tag]) != null ? ref[package_name] : void 0) || {});
      results.push(this.addResourceBundle(language_tag, package_name, package_keys));                                 // 122
    }                                                                                                                 // 120
    return results;                                                                                                   //
  },                                                                                                                  //
  _loadTranslations_cache: {},                                                                                        // 50
  loadTranslations: function(translations, namespace) {                                                               // 50
    var language_tag, project_languages, results, translation_keys;                                                   // 128
    project_languages = this._getProjectLanguages();                                                                  // 128
    results = [];                                                                                                     // 130
    for (language_tag in translations) {                                                                              //
      translation_keys = translations[language_tag];                                                                  //
      if (this._loadTranslations_cache[language_tag] == null) {                                                       // 131
        this._loadTranslations_cache[language_tag] = {};                                                              // 132
      }                                                                                                               //
      if (this._loadTranslations_cache[language_tag][namespace] == null) {                                            // 134
        this._loadTranslations_cache[language_tag][namespace] = {};                                                   // 135
      }                                                                                                               //
      _.extend(this._loadTranslations_cache[language_tag][namespace], translation_keys);                              // 131
      this.addResourceBundle(language_tag, namespace, translation_keys);                                              // 131
      if (Meteor.isClient && this.getLanguage() === language_tag) {                                                   // 141
        results.push(this._language_changed_tracker.changed());                                                       //
      } else {                                                                                                        //
        results.push(void 0);                                                                                         //
      }                                                                                                               //
    }                                                                                                                 // 130
    return results;                                                                                                   //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/tap_i18n/lib/tap_i18n/tap_i18n-server.coffee.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                      //
_.extend(TAPi18n.prototype, {                                                                                         // 1
  server_translators: null,                                                                                           // 2
  _registerServerTranslator: function(lang_tag, package_name) {                                                       // 2
    if (this._enabled()) {                                                                                            // 5
      if (!(lang_tag in this.server_translators)) {                                                                   // 6
        this.server_translators[lang_tag] = this._getSpecificLangTranslator(lang_tag);                                // 7
      }                                                                                                               //
      if (lang_tag !== this._fallback_language) {                                                                     // 10
        this.addResourceBundle(lang_tag, package_name, this.translations[lang_tag][package_name]);                    // 11
      }                                                                                                               //
    }                                                                                                                 //
    if (!(this._fallback_language in this.server_translators)) {                                                      // 13
      return this.server_translators[this._fallback_language] = this._getSpecificLangTranslator(this._fallback_language);
    }                                                                                                                 //
  },                                                                                                                  //
  _registerAllServerTranslators: function() {                                                                         // 2
    var i, lang_tag, len, package_name, ref, results;                                                                 // 17
    ref = this._getProjectLanguages();                                                                                // 17
    results = [];                                                                                                     // 17
    for (i = 0, len = ref.length; i < len; i++) {                                                                     //
      lang_tag = ref[i];                                                                                              //
      results.push((function() {                                                                                      // 18
        var results1;                                                                                                 //
        results1 = [];                                                                                                // 18
        for (package_name in this.translations[lang_tag]) {                                                           //
          results1.push(this._registerServerTranslator(lang_tag, package_name));                                      // 19
        }                                                                                                             // 18
        return results1;                                                                                              //
      }).call(this));                                                                                                 //
    }                                                                                                                 // 17
    return results;                                                                                                   //
  },                                                                                                                  //
  _getPackageI18nextProxy: function(package_name) {                                                                   // 2
    return (function(_this) {                                                                                         //
      return function(key, options, lang_tag) {                                                                       //
        if (lang_tag == null) {                                                                                       //
          lang_tag = null;                                                                                            //
        }                                                                                                             //
        if (lang_tag == null) {                                                                                       // 24
          return _this.server_translators[_this._fallback_language]((_this._getPackageDomain(package_name)) + ":" + key, options);
        } else if (!(lang_tag in _this.server_translators)) {                                                         //
          console.log("Warning: language " + lang_tag + " is not supported in this project, fallback language (" + _this._fallback_language + ")");
          return _this.server_translators[_this._fallback_language]((_this._getPackageDomain(package_name)) + ":" + key, options);
        } else {                                                                                                      //
          return _this.server_translators[lang_tag]((_this._getPackageDomain(package_name)) + ":" + key, options);    // 31
        }                                                                                                             //
      };                                                                                                              //
    })(this);                                                                                                         //
  },                                                                                                                  //
  _registerHTTPMethod: function() {                                                                                   // 2
    var methods, self;                                                                                                // 34
    self = this;                                                                                                      // 34
    methods = {};                                                                                                     // 34
    if (!self._enabled()) {                                                                                           // 38
      throw new Meteor.Error(500, "tap-i18n has to be enabled in order to register the HTTP method");                 // 39
    }                                                                                                                 //
    methods[(self.conf.i18n_files_route.replace(/\/$/, "")) + "/multi/:langs"] = {                                    // 34
      get: function() {                                                                                               // 42
        var i, lang_tag, langs, language_translations, len, output;                                                   // 43
        if (!RegExp("^((" + globals.langauges_tags_regex + ",)*" + globals.langauges_tags_regex + "|all).json$").test(this.params.langs)) {
          return this.setStatusCode(401);                                                                             // 44
        }                                                                                                             //
        langs = this.params.langs.replace(".json", "");                                                               // 43
        if (langs === "all") {                                                                                        // 48
          output = self.translations;                                                                                 // 49
        } else {                                                                                                      //
          output = {};                                                                                                // 51
          langs = langs.split(",");                                                                                   // 51
          for (i = 0, len = langs.length; i < len; i++) {                                                             // 54
            lang_tag = langs[i];                                                                                      //
            if (indexOf.call(self._getProjectLanguages(), lang_tag) >= 0 && lang_tag !== self._fallback_language) {   // 55
              language_translations = self.translations[lang_tag];                                                    // 57
              if (language_translations != null) {                                                                    // 59
                output[lang_tag] = language_translations;                                                             // 60
              }                                                                                                       //
            }                                                                                                         //
          }                                                                                                           // 54
        }                                                                                                             //
        return JSON.stringify(output);                                                                                // 62
      }                                                                                                               //
    };                                                                                                                //
    methods[(self.conf.i18n_files_route.replace(/\/$/, "")) + "/:lang"] = {                                           // 34
      get: function() {                                                                                               // 65
        var lang_tag, language_translations;                                                                          // 66
        if (!RegExp("^" + globals.langauges_tags_regex + ".json$").test(this.params.lang)) {                          // 66
          return this.setStatusCode(401);                                                                             // 67
        }                                                                                                             //
        lang_tag = this.params.lang.replace(".json", "");                                                             // 66
        if (indexOf.call(self._getProjectLanguages(), lang_tag) < 0 || lang_tag === self._fallback_language) {        // 71
          return this.setStatusCode(404);                                                                             // 73
        }                                                                                                             //
        language_translations = self.translations[lang_tag];                                                          // 66
        return JSON.stringify(language_translations != null ? language_translations : {});                            // 80
      }                                                                                                               //
    };                                                                                                                //
    return HTTP.methods(methods);                                                                                     //
  },                                                                                                                  //
  _onceEnabled: function() {                                                                                          // 2
    return this._registerAllServerTranslators();                                                                      //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/tap_i18n/lib/tap_i18n/tap_i18n-init.coffee.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                                      // 1
                                                                                                                      //
TAPi18n = new TAPi18n();                                                                                              // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['tap:i18n'] = {
  TAPi18next: TAPi18next,
  TAPi18n: TAPi18n
};

})();

//# sourceMappingURL=tap_i18n.js.map
