(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

/* Package-scope variables */
var UploadFS, domain, fs, Future, http, https, mkdirp, stream, zlib;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var stores = {};                                                                                                       // 1
                                                                                                                       // 2
UploadFS = {                                                                                                           // 3
    /**                                                                                                                // 4
     * Contains all stores                                                                                             // 5
     */                                                                                                                // 6
    store: {},                                                                                                         // 7
    /**                                                                                                                // 8
     * Returns the temporary file path                                                                                 // 9
     * @param fileId                                                                                                   // 10
     * @return {string}                                                                                                // 11
     */                                                                                                                // 12
    getTempFilePath: function (fileId) {                                                                               // 13
        return UploadFS.config.tmpDir + '/' + fileId;                                                                  // 14
    },                                                                                                                 // 15
    /**                                                                                                                // 16
     * Returns the store by its name                                                                                   // 17
     * @param name                                                                                                     // 18
     * @return {UploadFS.Store}                                                                                        // 19
     */                                                                                                                // 20
    getStore: function (name) {                                                                                        // 21
        return stores[name];                                                                                           // 22
    },                                                                                                                 // 23
    /**                                                                                                                // 24
     * Returns all stores                                                                                              // 25
     * @return {object}                                                                                                // 26
     */                                                                                                                // 27
    getStores: function () {                                                                                           // 28
        return stores;                                                                                                 // 29
    },                                                                                                                 // 30
    /**                                                                                                                // 31
     * Imports a file from a URL                                                                                       // 32
     * @param url                                                                                                      // 33
     * @param file                                                                                                     // 34
     * @param store                                                                                                    // 35
     * @param callback                                                                                                 // 36
     */                                                                                                                // 37
    importFromURL: function (url, file, store, callback) {                                                             // 38
        Meteor.call('ufsImportURL', url, file, store && store.getName(), callback);                                    // 39
    }                                                                                                                  // 40
};                                                                                                                     // 41
                                                                                                                       // 42
if (Meteor.isServer) {                                                                                                 // 43
    /**                                                                                                                // 44
     * Generates a random token using a pattern (xy)                                                                   // 45
     * @param pattern                                                                                                  // 46
     * @return {string}                                                                                                // 47
     */                                                                                                                // 48
    UploadFS.generateToken = function (pattern) {                                                                      // 49
        return (pattern || 'xyxyxyxyxy').replace(/[xy]/g, function (c) {                                               // 50
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);                                        // 51
            var s = v.toString(16);                                                                                    // 52
            return Math.round(Math.random()) ? s.toUpperCase() : s;                                                    // 53
        });                                                                                                            // 54
    };                                                                                                                 // 55
}                                                                                                                      // 56
                                                                                                                       // 57
if (Meteor.isClient) {                                                                                                 // 58
    /**                                                                                                                // 59
     * Returns file and data as ArrayBuffer for each files in the event                                                // 60
     * @param event                                                                                                    // 61
     * @param callback                                                                                                 // 62
     */                                                                                                                // 63
    UploadFS.readAsArrayBuffer = function (event, callback) {                                                          // 64
        if (typeof callback !== 'function') {                                                                          // 65
            throw new TypeError('callback is not a function');                                                         // 66
        }                                                                                                              // 67
                                                                                                                       // 68
        var files = event.target.files;                                                                                // 69
                                                                                                                       // 70
        for (var i = 0; i < files.length; i += 1) {                                                                    // 71
            var file = files[i];                                                                                       // 72
                                                                                                                       // 73
            (function (file) {                                                                                         // 74
                var reader = new FileReader();                                                                         // 75
                reader.onload = function (ev) {                                                                        // 76
                    callback.call(UploadFS, ev.target.result, file);                                                   // 77
                };                                                                                                     // 78
                reader.readAsArrayBuffer(file);                                                                        // 79
            })(file);                                                                                                  // 80
        }                                                                                                              // 81
    };                                                                                                                 // 82
                                                                                                                       // 83
    /**                                                                                                                // 84
     * Opens the browser's file selection dialog                                                                       // 85
     * @param callback                                                                                                 // 86
     */                                                                                                                // 87
    UploadFS.selectFiles = function (callback) {                                                                       // 88
        var img = document.createElement('input');                                                                     // 89
        img.type = 'file';                                                                                             // 90
        img.onchange = callback;                                                                                       // 91
        img.click();                                                                                                   // 92
    }                                                                                                                  // 93
}                                                                                                                      // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-config.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * UploadFS configuration                                                                                              // 2
 * @param options                                                                                                      // 3
 * @constructor                                                                                                        // 4
 */                                                                                                                    // 5
UploadFS.Config = function (options) {                                                                                 // 6
    // Set default options                                                                                             // 7
    options = _.extend({                                                                                               // 8
        https: false,                                                                                                  // 9
        simulateReadDelay: 0,                                                                                          // 10
        simulateUploadSpeed: 0,                                                                                        // 11
        simulateWriteDelay: 0,                                                                                         // 12
        storesPath: 'ufs',                                                                                             // 13
        tmpDir: '/tmp/ufs'                                                                                             // 14
    }, options);                                                                                                       // 15
                                                                                                                       // 16
    // Check options                                                                                                   // 17
    if (typeof options.https !== 'boolean') {                                                                          // 18
        throw new TypeError('https is not a function');                                                                // 19
    }                                                                                                                  // 20
    if (typeof options.simulateReadDelay !== 'number') {                                                               // 21
        throw new Meteor.Error('simulateReadDelay is not a number');                                                   // 22
    }                                                                                                                  // 23
    if (typeof options.simulateUploadSpeed !== 'number') {                                                             // 24
        throw new Meteor.Error('simulateUploadSpeed is not a number');                                                 // 25
    }                                                                                                                  // 26
    if (typeof options.simulateWriteDelay !== 'number') {                                                              // 27
        throw new Meteor.Error('simulateWriteDelay is not a number');                                                  // 28
    }                                                                                                                  // 29
    if (typeof options.storesPath !== 'string') {                                                                      // 30
        throw new Meteor.Error('storesPath is not a string');                                                          // 31
    }                                                                                                                  // 32
    if (typeof options.tmpDir !== 'string') {                                                                          // 33
        throw new Meteor.Error('tmpDir is not a string');                                                              // 34
    }                                                                                                                  // 35
                                                                                                                       // 36
    // Public attributes                                                                                               // 37
    this.https = options.https;                                                                                        // 38
    this.simulateReadDelay = parseInt(options.simulateReadDelay);                                                      // 39
    this.simulateUploadSpeed = parseInt(options.simulateUploadSpeed);                                                  // 40
    this.simulateWriteDelay = parseInt(options.simulateWriteDelay);                                                    // 41
    this.storesPath = options.storesPath;                                                                              // 42
    this.tmpDir = options.tmpDir;                                                                                      // 43
};                                                                                                                     // 44
                                                                                                                       // 45
/**                                                                                                                    // 46
 * Simulation read delay in milliseconds                                                                               // 47
 * @type {number}                                                                                                      // 48
 */                                                                                                                    // 49
UploadFS.Config.prototype.simulateReadDelay = 0;                                                                       // 50
                                                                                                                       // 51
/**                                                                                                                    // 52
 * Simulation upload speed in milliseconds                                                                             // 53
 * @type {number}                                                                                                      // 54
 */                                                                                                                    // 55
UploadFS.Config.prototype.simulateUploadSpeed = 0;                                                                     // 56
                                                                                                                       // 57
/**                                                                                                                    // 58
 * Simulation write delay in milliseconds                                                                              // 59
 * @type {number}                                                                                                      // 60
 */                                                                                                                    // 61
UploadFS.Config.prototype.simulateWriteDelay = 0;                                                                      // 62
                                                                                                                       // 63
/**                                                                                                                    // 64
 * URL path to stores                                                                                                  // 65
 * @type {string}                                                                                                      // 66
 */                                                                                                                    // 67
UploadFS.Config.prototype.storesPath = null;                                                                           // 68
                                                                                                                       // 69
/**                                                                                                                    // 70
 * Local temporary directory for uploading files                                                                       // 71
 * @type {string}                                                                                                      // 72
 */                                                                                                                    // 73
UploadFS.Config.prototype.tmpDir = null;                                                                               // 74
                                                                                                                       // 75
/**                                                                                                                    // 76
 * Global configuration                                                                                                // 77
 * @type {UploadFS.Config}                                                                                             // 78
 */                                                                                                                    // 79
UploadFS.config = new UploadFS.Config();                                                                               // 80
                                                                                                                       // 81
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-filter.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * File filter                                                                                                         // 2
 * @param options                                                                                                      // 3
 * @constructor                                                                                                        // 4
 */                                                                                                                    // 5
UploadFS.Filter = function (options) {                                                                                 // 6
    var self = this;                                                                                                   // 7
                                                                                                                       // 8
    // Set default options                                                                                             // 9
    options = _.extend({                                                                                               // 10
        contentTypes: null,                                                                                            // 11
        extensions: null,                                                                                              // 12
        minSize: 1,                                                                                                    // 13
        maxSize: 0,                                                                                                    // 14
        onCheck: null                                                                                                  // 15
    }, options);                                                                                                       // 16
                                                                                                                       // 17
    // Check options                                                                                                   // 18
    if (options.contentTypes && !(options.contentTypes instanceof Array)) {                                            // 19
        throw new TypeError('contentTypes is not an Array');                                                           // 20
    }                                                                                                                  // 21
    if (options.extensions && !(options.extensions instanceof Array)) {                                                // 22
        throw new TypeError('extensions is not an Array');                                                             // 23
    }                                                                                                                  // 24
    if (typeof options.minSize !== 'number') {                                                                         // 25
        throw new TypeError('minSize is not a number');                                                                // 26
    }                                                                                                                  // 27
    if (typeof options.maxSize !== 'number') {                                                                         // 28
        throw new TypeError('maxSize is not a number');                                                                // 29
    }                                                                                                                  // 30
    if (options.onCheck && typeof options.onCheck !== 'function') {                                                    // 31
        throw new TypeError('onCheck is not a function');                                                              // 32
    }                                                                                                                  // 33
                                                                                                                       // 34
    // Private attributes                                                                                              // 35
    var contentTypes = options.contentTypes;                                                                           // 36
    var extensions = options.extensions;                                                                               // 37
    var onCheck = options.onCheck;                                                                                     // 38
    var maxSize = parseInt(options.maxSize);                                                                           // 39
    var minSize = parseInt(options.minSize);                                                                           // 40
                                                                                                                       // 41
    /**                                                                                                                // 42
     * Checks the file                                                                                                 // 43
     * @param file                                                                                                     // 44
     */                                                                                                                // 45
    self.check = function (file) {                                                                                     // 46
        // Check size                                                                                                  // 47
        if (file.size <= 0 || file.size < self.getMinSize()) {                                                         // 48
            throw new Meteor.Error('file-too-small', 'File is too small (min =' + self.getMinSize() + ')');            // 49
        }                                                                                                              // 50
        if (self.getMaxSize() > 0 && file.size > self.getMaxSize()) {                                                  // 51
            throw new Meteor.Error('file-too-large', 'File is too large (max = ' + self.getMaxSize() + ')');           // 52
        }                                                                                                              // 53
        // Check extension                                                                                             // 54
        if (self.getExtensions() && !_.contains(self.getExtensions(), file.extension)) {                               // 55
            throw new Meteor.Error('invalid-file-extension', 'File extension is not accepted');                        // 56
        }                                                                                                              // 57
        // Check content type                                                                                          // 58
        if (self.getContentTypes() && !checkContentType(file.type, self.getContentTypes())) {                          // 59
            throw new Meteor.Error('invalid-file-type', 'File type is not accepted');                                  // 60
        }                                                                                                              // 61
        // Apply custom check                                                                                          // 62
        if (typeof onCheck === 'function' && !onCheck.call(self, file)) {                                              // 63
            throw new Meteor.Error('invalid-file', 'File does not match filter');                                      // 64
        }                                                                                                              // 65
    };                                                                                                                 // 66
                                                                                                                       // 67
    /**                                                                                                                // 68
     * Returns the allowed content types                                                                               // 69
     * @return {Array}                                                                                                 // 70
     */                                                                                                                // 71
    self.getContentTypes = function () {                                                                               // 72
        return contentTypes;                                                                                           // 73
    };                                                                                                                 // 74
                                                                                                                       // 75
    /**                                                                                                                // 76
     * Returns the allowed extensions                                                                                  // 77
     * @return {Array}                                                                                                 // 78
     */                                                                                                                // 79
    self.getExtensions = function () {                                                                                 // 80
        return extensions;                                                                                             // 81
    };                                                                                                                 // 82
                                                                                                                       // 83
    /**                                                                                                                // 84
     * Returns the maximum file size                                                                                   // 85
     * @return {Number}                                                                                                // 86
     */                                                                                                                // 87
    self.getMaxSize = function () {                                                                                    // 88
        return maxSize;                                                                                                // 89
    };                                                                                                                 // 90
                                                                                                                       // 91
    /**                                                                                                                // 92
     * Returns the minimum file size                                                                                   // 93
     * @return {Number}                                                                                                // 94
     */                                                                                                                // 95
    self.getMinSize = function () {                                                                                    // 96
        return minSize;                                                                                                // 97
    };                                                                                                                 // 98
                                                                                                                       // 99
    /**                                                                                                                // 100
     * Checks if the file matches filter                                                                               // 101
     * @param file                                                                                                     // 102
     * @return {boolean}                                                                                               // 103
     */                                                                                                                // 104
    self.isValid = function (file) {                                                                                   // 105
        return !(                                                                                                      // 106
            file.size <= 0 || file.size < self.getMinSize()                                                            // 107
            || self.getMaxSize() > 0 && file.size > self.getMaxSize()                                                  // 108
            || self.getExtensions() && !_.contains(self.getExtensions(), file.extension)                               // 109
            || self.getContentTypes() && !checkContentType(file.type, self.getContentTypes())                          // 110
            || (typeof onCheck === 'function' && !onCheck.call(self, file))                                            // 111
        );                                                                                                             // 112
    };                                                                                                                 // 113
};                                                                                                                     // 114
                                                                                                                       // 115
function checkContentType(type, list) {                                                                                // 116
    if (_.contains(list, type)) {                                                                                      // 117
        return true;                                                                                                   // 118
    } else {                                                                                                           // 119
        var wildCardGlob = '/*';                                                                                       // 120
        var wildcards = _.filter(list, function (item) {                                                               // 121
            return item.indexOf(wildCardGlob) > 0;                                                                     // 122
        });                                                                                                            // 123
                                                                                                                       // 124
        if (_.contains(wildcards, type.replace(/(\/.*)$/, wildCardGlob))) {                                            // 125
            return true;                                                                                               // 126
        }                                                                                                              // 127
    }                                                                                                                  // 128
    return false;                                                                                                      // 129
}                                                                                                                      // 130
                                                                                                                       // 131
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-store.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * File store                                                                                                          // 2
 * @param options                                                                                                      // 3
 * @constructor                                                                                                        // 4
 */                                                                                                                    // 5
UploadFS.Store = function (options) {                                                                                  // 6
    var self = this;                                                                                                   // 7
                                                                                                                       // 8
    // Set default options                                                                                             // 9
    options = _.extend({                                                                                               // 10
        collection: null,                                                                                              // 11
        filter: null,                                                                                                  // 12
        name: null,                                                                                                    // 13
        onCopyError: null,                                                                                             // 14
        onFinishUpload: null,                                                                                          // 15
        onRead: null,                                                                                                  // 16
        onReadError: null,                                                                                             // 17
        onWriteError: null,                                                                                            // 18
        transformRead: null,                                                                                           // 19
        transformWrite: null                                                                                           // 20
    }, options);                                                                                                       // 21
                                                                                                                       // 22
    // Check instance                                                                                                  // 23
    if (!(self instanceof UploadFS.Store)) {                                                                           // 24
        throw new Error('UploadFS.Store is not an instance');                                                          // 25
    }                                                                                                                  // 26
                                                                                                                       // 27
    // Check options                                                                                                   // 28
    if (!(options.collection instanceof Mongo.Collection)) {                                                           // 29
        throw new TypeError('collection is not a Mongo.Collection');                                                   // 30
    }                                                                                                                  // 31
    if (options.filter && !(options.filter instanceof UploadFS.Filter)) {                                              // 32
        throw new TypeError('filter is not an UploadFS.Filter');                                                       // 33
    }                                                                                                                  // 34
    if (typeof options.name !== 'string') {                                                                            // 35
        throw new TypeError('name is not a string');                                                                   // 36
    }                                                                                                                  // 37
    if (UploadFS.getStore(options.name)) {                                                                             // 38
        throw new TypeError('name already exists');                                                                    // 39
    }                                                                                                                  // 40
    if (options.onCopyError && typeof options.onCopyError !== 'function') {                                            // 41
        throw new TypeError('onCopyError is not a function');                                                          // 42
    }                                                                                                                  // 43
    if (options.onFinishUpload && typeof options.onFinishUpload !== 'function') {                                      // 44
        throw new TypeError('onFinishUpload is not a function');                                                       // 45
    }                                                                                                                  // 46
    if (options.onRead && typeof options.onRead !== 'function') {                                                      // 47
        throw new TypeError('onRead is not a function');                                                               // 48
    }                                                                                                                  // 49
    if (options.onReadError && typeof options.onReadError !== 'function') {                                            // 50
        throw new TypeError('onReadError is not a function');                                                          // 51
    }                                                                                                                  // 52
    if (options.onWriteError && typeof options.onWriteError !== 'function') {                                          // 53
        throw new TypeError('onWriteError is not a function');                                                         // 54
    }                                                                                                                  // 55
    if (options.transformRead && typeof options.transformRead !== 'function') {                                        // 56
        throw new TypeError('transformRead is not a function');                                                        // 57
    }                                                                                                                  // 58
    if (options.transformWrite && typeof options.transformWrite !== 'function') {                                      // 59
        throw new TypeError('transformWrite is not a function');                                                       // 60
    }                                                                                                                  // 61
                                                                                                                       // 62
    // Public attributes                                                                                               // 63
    self.onCopyError = options.onCopyError || self.onCopyError;                                                        // 64
    self.onFinishUpload = options.onFinishUpload || self.onFinishUpload;                                               // 65
    self.onRead = options.onRead || self.onRead;                                                                       // 66
    self.onReadError = options.onReadError || self.onReadError;                                                        // 67
    self.onWriteError = options.onWriteError || self.onWriteError;                                                     // 68
                                                                                                                       // 69
    // Private attributes                                                                                              // 70
    var collection = options.collection;                                                                               // 71
    var copyTo = options.copyTo;                                                                                       // 72
    var filter = options.filter;                                                                                       // 73
    var name = options.name;                                                                                           // 74
    var transformRead = options.transformRead;                                                                         // 75
    var transformWrite = options.transformWrite;                                                                       // 76
                                                                                                                       // 77
    // Add the store to the list                                                                                       // 78
    UploadFS.getStores()[name] = self;                                                                                 // 79
                                                                                                                       // 80
    /**                                                                                                                // 81
     * Creates the file in the collection                                                                              // 82
     * @param file                                                                                                     // 83
     * @return {string}                                                                                                // 84
     */                                                                                                                // 85
    self.create = function (file) {                                                                                    // 86
        check(file, Object);                                                                                           // 87
        file.store = name;                                                                                             // 88
        return self.getCollection().insert(file);                                                                      // 89
    };                                                                                                                 // 90
                                                                                                                       // 91
    /**                                                                                                                // 92
     * Returns the collection                                                                                          // 93
     * @return {Mongo.Collection}                                                                                      // 94
     */                                                                                                                // 95
    self.getCollection = function () {                                                                                 // 96
        return collection;                                                                                             // 97
    };                                                                                                                 // 98
                                                                                                                       // 99
    /**                                                                                                                // 100
     * Returns the file filter                                                                                         // 101
     * @return {UploadFS.Filter}                                                                                       // 102
     */                                                                                                                // 103
    self.getFilter = function () {                                                                                     // 104
        return filter;                                                                                                 // 105
    };                                                                                                                 // 106
                                                                                                                       // 107
    /**                                                                                                                // 108
     * Returns the store name                                                                                          // 109
     * @return {string}                                                                                                // 110
     */                                                                                                                // 111
    self.getName = function () {                                                                                       // 112
        return name;                                                                                                   // 113
    };                                                                                                                 // 114
                                                                                                                       // 115
                                                                                                                       // 116
    if (Meteor.isServer) {                                                                                             // 117
                                                                                                                       // 118
        /**                                                                                                            // 119
         * Copies the file to a store                                                                                  // 120
         * @param fileId                                                                                               // 121
         * @param store                                                                                                // 122
         * @param callback                                                                                             // 123
         */                                                                                                            // 124
        self.copy = function (fileId, store, callback) {                                                               // 125
            check(fileId, String);                                                                                     // 126
                                                                                                                       // 127
            if (!(store instanceof UploadFS.Store)) {                                                                  // 128
                throw new TypeError('store is not an UploadFS.store.Store');                                           // 129
            }                                                                                                          // 130
                                                                                                                       // 131
            // Get original file                                                                                       // 132
            var file = self.getCollection().findOne(fileId);                                                           // 133
            if (!file) {                                                                                               // 134
                throw new Meteor.Error(404, 'File not found');                                                         // 135
            }                                                                                                          // 136
                                                                                                                       // 137
            // Prepare copy                                                                                            // 138
            var copy = _.omit(file, '_id', 'url');                                                                     // 139
            copy.originalStore = self.getName();                                                                       // 140
            copy.originalId = fileId;                                                                                  // 141
                                                                                                                       // 142
            // Create the copy                                                                                         // 143
            var copyId = store.create(copy);                                                                           // 144
                                                                                                                       // 145
            // Get original stream                                                                                     // 146
            var rs = self.getReadStream(fileId, file);                                                                 // 147
                                                                                                                       // 148
            // Copy file data                                                                                          // 149
            store.write(rs, copyId, Meteor.bindEnvironment(function (err) {                                            // 150
                if (err) {                                                                                             // 151
                    store.getCollection().remove(copyId);                                                              // 152
                    self.onCopyError.call(self, err, fileId, file);                                                    // 153
                }                                                                                                      // 154
                if (typeof callback === 'function') {                                                                  // 155
                    callback.call(self, err, copyId, copy, store);                                                     // 156
                }                                                                                                      // 157
            }));                                                                                                       // 158
        };                                                                                                             // 159
                                                                                                                       // 160
        /**                                                                                                            // 161
         * Transforms the file on reading                                                                              // 162
         * @param from                                                                                                 // 163
         * @param to                                                                                                   // 164
         * @param fileId                                                                                               // 165
         * @param file                                                                                                 // 166
         * @param request                                                                                              // 167
         * @param headers                                                                                              // 168
         */                                                                                                            // 169
        self.transformRead = function (from, to, fileId, file, request, headers) {                                     // 170
            if (typeof transformRead === 'function') {                                                                 // 171
                transformRead.call(self, from, to, fileId, file, request, headers);                                    // 172
            } else {                                                                                                   // 173
                from.pipe(to);                                                                                         // 174
            }                                                                                                          // 175
        };                                                                                                             // 176
                                                                                                                       // 177
        /**                                                                                                            // 178
         * Transforms the file on writing                                                                              // 179
         * @param from                                                                                                 // 180
         * @param to                                                                                                   // 181
         * @param fileId                                                                                               // 182
         * @param file                                                                                                 // 183
         */                                                                                                            // 184
        self.transformWrite = function (from, to, fileId, file) {                                                      // 185
            if (typeof transformWrite === 'function') {                                                                // 186
                transformWrite.call(self, from, to, fileId, file);                                                     // 187
            } else {                                                                                                   // 188
                from.pipe(to);                                                                                         // 189
            }                                                                                                          // 190
        };                                                                                                             // 191
                                                                                                                       // 192
        /**                                                                                                            // 193
         * Writes the file to the store                                                                                // 194
         * @param rs                                                                                                   // 195
         * @param fileId                                                                                               // 196
         * @param callback                                                                                             // 197
         */                                                                                                            // 198
        self.write = function (rs, fileId, callback) {                                                                 // 199
            var file = self.getCollection().findOne(fileId);                                                           // 200
            var ws = self.getWriteStream(fileId, file);                                                                // 201
                                                                                                                       // 202
            var errorHandler = Meteor.bindEnvironment(function (err) {                                                 // 203
                self.getCollection().remove(fileId);                                                                   // 204
                self.onWriteError.call(self, err, fileId, file);                                                       // 205
                callback.call(self, err);                                                                              // 206
            });                                                                                                        // 207
                                                                                                                       // 208
            ws.on('error', errorHandler);                                                                              // 209
            ws.on('finish', Meteor.bindEnvironment(function () {                                                       // 210
                var size = 0;                                                                                          // 211
                var from = self.getReadStream(fileId, file);                                                           // 212
                                                                                                                       // 213
                from.on('data', function (data) {                                                                      // 214
                    size += data.length;                                                                               // 215
                });                                                                                                    // 216
                from.on('end', Meteor.bindEnvironment(function () {                                                    // 217
                    // Set file attribute                                                                              // 218
                    file.complete = true;                                                                              // 219
                    file.progress = 1;                                                                                 // 220
                    file.size = size;                                                                                  // 221
                    file.token = UploadFS.generateToken();                                                             // 222
                    file.uploading = false;                                                                            // 223
                    file.uploadedAt = new Date();                                                                      // 224
                    file.url = self.getFileURL(fileId);                                                                // 225
                                                                                                                       // 226
                    // Sets the file URL when file transfer is complete,                                               // 227
                    // this way, the image will loads entirely.                                                        // 228
                    self.getCollection().update(fileId, {                                                              // 229
                        $set: {                                                                                        // 230
                            complete: file.complete,                                                                   // 231
                            progress: file.progress,                                                                   // 232
                            size: file.size,                                                                           // 233
                            token: file.token,                                                                         // 234
                            uploading: file.uploading,                                                                 // 235
                            uploadedAt: file.uploadedAt,                                                               // 236
                            url: file.url                                                                              // 237
                        }                                                                                              // 238
                    });                                                                                                // 239
                                                                                                                       // 240
                    // Return file info                                                                                // 241
                    callback.call(self, null, file);                                                                   // 242
                                                                                                                       // 243
                    // Execute callback                                                                                // 244
                    if (typeof self.onFinishUpload == 'function') {                                                    // 245
                        self.onFinishUpload.call(self, file);                                                          // 246
                    }                                                                                                  // 247
                                                                                                                       // 248
                    // Simulate write speed                                                                            // 249
                    if (UploadFS.config.simulateWriteDelay) {                                                          // 250
                        Meteor._sleepForMs(UploadFS.config.simulateWriteDelay);                                        // 251
                    }                                                                                                  // 252
                                                                                                                       // 253
                    // Copy file to other stores                                                                       // 254
                    if (copyTo instanceof Array) {                                                                     // 255
                        for (var i = 0; i < copyTo.length; i += 1) {                                                   // 256
                            var store = copyTo[i];                                                                     // 257
                                                                                                                       // 258
                            if (!store.getFilter() || store.getFilter().isValid(file)) {                               // 259
                                self.copy(fileId, store);                                                              // 260
                            }                                                                                          // 261
                        }                                                                                              // 262
                    }                                                                                                  // 263
                }));                                                                                                   // 264
            }));                                                                                                       // 265
                                                                                                                       // 266
            // Execute transformation                                                                                  // 267
            self.transformWrite(rs, ws, fileId, file);                                                                 // 268
        };                                                                                                             // 269
    }                                                                                                                  // 270
                                                                                                                       // 271
    // Code executed before inserting file                                                                             // 272
    collection.before.insert(function (userId, file) {                                                                 // 273
        if (typeof file.name !== 'string' || !file.name.length) {                                                      // 274
            throw new Meteor.Error(400, "file name not defined");                                                      // 275
        }                                                                                                              // 276
        if (typeof file.store !== 'string' || !file.store.length) {                                                    // 277
            throw new Meteor.Error(400, "file store not defined");                                                     // 278
        }                                                                                                              // 279
        if (typeof file.complete !== 'boolean') {                                                                      // 280
            file.complete = false;                                                                                     // 281
        }                                                                                                              // 282
        if (typeof file.uploading !== 'boolean') {                                                                     // 283
            file.uploading = true;                                                                                     // 284
        }                                                                                                              // 285
        file.extension = file.name && file.name.substr((~-file.name.lastIndexOf('.') >>> 0) + 2).toLowerCase();        // 286
        file.progress = parseFloat(file.progress) || 0;                                                                // 287
        file.size = parseInt(file.size) || 0;                                                                          // 288
        file.userId = file.userId || userId;                                                                           // 289
    });                                                                                                                // 290
                                                                                                                       // 291
    // Code executed after removing file                                                                               // 292
    collection.after.remove(function (userId, file) {                                                                  // 293
        if (Meteor.isServer) {                                                                                         // 294
            if (copyTo instanceof Array) {                                                                             // 295
                for (var i = 0; i < copyTo.length; i += 1) {                                                           // 296
                    // Remove copies in stores                                                                         // 297
                    copyTo[i].getCollection().remove({originalId: file._id});                                          // 298
                }                                                                                                      // 299
            }                                                                                                          // 300
        }                                                                                                              // 301
    });                                                                                                                // 302
                                                                                                                       // 303
    // Code executed before removing file                                                                              // 304
    collection.before.remove(function (userId, file) {                                                                 // 305
        if (Meteor.isServer) {                                                                                         // 306
            // Delete the physical file in the store                                                                   // 307
            self.delete(file._id);                                                                                     // 308
                                                                                                                       // 309
            var tmpFile = UploadFS.getTempFilePath(file._id);                                                          // 310
                                                                                                                       // 311
            // Delete the temp file                                                                                    // 312
            fs.stat(tmpFile, function (err) {                                                                          // 313
                !err && fs.unlink(tmpFile, function (err) {                                                            // 314
                    err && console.error('ufs: cannot delete temp file at ' + tmpFile + ' (' + err.message + ')');     // 315
                });                                                                                                    // 316
            });                                                                                                        // 317
        }                                                                                                              // 318
    });                                                                                                                // 319
                                                                                                                       // 320
    collection.deny({                                                                                                  // 321
        // Test filter on file insertion                                                                               // 322
        insert: function (userId, file) {                                                                              // 323
            if (filter instanceof UploadFS.Filter) {                                                                   // 324
                filter.check(file);                                                                                    // 325
            }                                                                                                          // 326
            return typeof options.insert === 'function'                                                                // 327
                && !options.insert.apply(this, arguments);                                                             // 328
        }                                                                                                              // 329
    });                                                                                                                // 330
};                                                                                                                     // 331
                                                                                                                       // 332
/**                                                                                                                    // 333
 * Returns the file URL                                                                                                // 334
 * @param fileId                                                                                                       // 335
 */                                                                                                                    // 336
UploadFS.Store.prototype.getFileURL = function (fileId) {                                                              // 337
    var file = this.getCollection().findOne(fileId, {                                                                  // 338
        fields: {name: 1}                                                                                              // 339
    });                                                                                                                // 340
    return file && this.getURL() + '/' + fileId + '/' + encodeURIComponent(file.name);                                 // 341
};                                                                                                                     // 342
                                                                                                                       // 343
/**                                                                                                                    // 344
 * Returns the store URL                                                                                               // 345
 */                                                                                                                    // 346
UploadFS.Store.prototype.getURL = function () {                                                                        // 347
    return Meteor.absoluteUrl(UploadFS.config.storesPath + '/' + this.getName(), {                                     // 348
        secure: UploadFS.config.https                                                                                  // 349
    });                                                                                                                // 350
};                                                                                                                     // 351
                                                                                                                       // 352
if (Meteor.isServer) {                                                                                                 // 353
    /**                                                                                                                // 354
     * Deletes a file async                                                                                            // 355
     * @param fileId                                                                                                   // 356
     * @param callback                                                                                                 // 357
     */                                                                                                                // 358
    UploadFS.Store.prototype.delete = function (fileId, callback) {                                                    // 359
        throw new Error('delete is not implemented');                                                                  // 360
    };                                                                                                                 // 361
                                                                                                                       // 362
    /**                                                                                                                // 363
     * Returns the file read stream                                                                                    // 364
     * @param fileId                                                                                                   // 365
     * @param file                                                                                                     // 366
     */                                                                                                                // 367
    UploadFS.Store.prototype.getReadStream = function (fileId, file) {                                                 // 368
        throw new Error('getReadStream is not implemented');                                                           // 369
    };                                                                                                                 // 370
                                                                                                                       // 371
    /**                                                                                                                // 372
     * Returns the file write stream                                                                                   // 373
     * @param fileId                                                                                                   // 374
     * @param file                                                                                                     // 375
     */                                                                                                                // 376
    UploadFS.Store.prototype.getWriteStream = function (fileId, file) {                                                // 377
        throw new Error('getWriteStream is not implemented');                                                          // 378
    };                                                                                                                 // 379
                                                                                                                       // 380
    /**                                                                                                                // 381
     * Callback for copy errors                                                                                        // 382
     * @param err                                                                                                      // 383
     * @param fileId                                                                                                   // 384
     * @param file                                                                                                     // 385
     * @return boolean                                                                                                 // 386
     */                                                                                                                // 387
    UploadFS.Store.prototype.onCopyError = function (err, fileId, file) {                                              // 388
        console.error('ufs: cannot copy file "' + fileId + '" (' + err.message + ')');                                 // 389
    };                                                                                                                 // 390
                                                                                                                       // 391
    /**                                                                                                                // 392
     * Called when a file has been uploaded                                                                            // 393
     * @param file                                                                                                     // 394
     */                                                                                                                // 395
    UploadFS.Store.prototype.onFinishUpload = function (file) {                                                        // 396
    };                                                                                                                 // 397
                                                                                                                       // 398
    /**                                                                                                                // 399
     * Called when a file is read from the store                                                                       // 400
     * @param fileId                                                                                                   // 401
     * @param file                                                                                                     // 402
     * @param request                                                                                                  // 403
     * @param response                                                                                                 // 404
     * @return boolean                                                                                                 // 405
     */                                                                                                                // 406
    UploadFS.Store.prototype.onRead = function (fileId, file, request, response) {                                     // 407
        return true;                                                                                                   // 408
    };                                                                                                                 // 409
                                                                                                                       // 410
    /**                                                                                                                // 411
     * Callback for read errors                                                                                        // 412
     * @param err                                                                                                      // 413
     * @param fileId                                                                                                   // 414
     * @param file                                                                                                     // 415
     * @return boolean                                                                                                 // 416
     */                                                                                                                // 417
    UploadFS.Store.prototype.onReadError = function (err, fileId, file) {                                              // 418
        console.error('ufs: cannot read file "' + fileId + '" (' + err.message + ')');                                 // 419
    };                                                                                                                 // 420
                                                                                                                       // 421
    /**                                                                                                                // 422
     * Callback for write errors                                                                                       // 423
     * @param err                                                                                                      // 424
     * @param fileId                                                                                                   // 425
     * @param file                                                                                                     // 426
     * @return boolean                                                                                                 // 427
     */                                                                                                                // 428
    UploadFS.Store.prototype.onWriteError = function (err, fileId, file) {                                             // 429
        console.error('ufs: cannot write file "' + fileId + '" (' + err.message + ')');                                // 430
    };                                                                                                                 // 431
}                                                                                                                      // 432
                                                                                                                       // 433
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-methods.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
                                                                                                                       // 2
    /**                                                                                                                // 3
     * Completes the file transfer                                                                                     // 4
     * @param fileId                                                                                                   // 5
     * @param storeName                                                                                                // 6
     */                                                                                                                // 7
    ufsComplete: function (fileId, storeName) {                                                                        // 8
        check(fileId, String);                                                                                         // 9
        check(storeName, String);                                                                                      // 10
                                                                                                                       // 11
        // Allow other uploads to run concurrently                                                                     // 12
        this.unblock();                                                                                                // 13
                                                                                                                       // 14
        var store = UploadFS.getStore(storeName);                                                                      // 15
        if (!store) {                                                                                                  // 16
            throw new Meteor.Error(404, 'store "' + storeName + '" does not exist');                                   // 17
        }                                                                                                              // 18
        // Check that file exists and is owned by current user                                                         // 19
        if (store.getCollection().find({_id: fileId, userId: this.userId}).count() < 1) {                              // 20
            throw new Meteor.Error(404, 'file "' + fileId + '" does not exist');                                       // 21
        }                                                                                                              // 22
                                                                                                                       // 23
        var fut = new Future();                                                                                        // 24
        var tmpFile = UploadFS.getTempFilePath(fileId);                                                                // 25
                                                                                                                       // 26
        // Get the temp file                                                                                           // 27
        var rs = fs.createReadStream(tmpFile, {                                                                        // 28
            flags: 'r',                                                                                                // 29
            encoding: null,                                                                                            // 30
            autoClose: true                                                                                            // 31
        });                                                                                                            // 32
                                                                                                                       // 33
        rs.on('error', Meteor.bindEnvironment(function () {                                                            // 34
            store.getCollection().remove(fileId);                                                                      // 35
        }));                                                                                                           // 36
                                                                                                                       // 37
        // Save file in the store                                                                                      // 38
        store.write(rs, fileId, Meteor.bindEnvironment(function (err, file) {                                          // 39
            fs.unlink(tmpFile, function (err) {                                                                        // 40
                err && console.error('ufs: cannot delete temp file ' + tmpFile + ' (' + err.message + ')');            // 41
            });                                                                                                        // 42
                                                                                                                       // 43
            if (err) {                                                                                                 // 44
                fut.throw(err);                                                                                        // 45
            } else {                                                                                                   // 46
                fut.return(file);                                                                                      // 47
            }                                                                                                          // 48
        }));                                                                                                           // 49
        return fut.wait();                                                                                             // 50
    },                                                                                                                 // 51
                                                                                                                       // 52
    /**                                                                                                                // 53
     * Imports a file from the URL                                                                                     // 54
     * @param url                                                                                                      // 55
     * @param file                                                                                                     // 56
     * @param storeName                                                                                                // 57
     * @return {*}                                                                                                     // 58
     */                                                                                                                // 59
    ufsImportURL: function (url, file, storeName) {                                                                    // 60
        check(url, String);                                                                                            // 61
        check(file, Object);                                                                                           // 62
        check(storeName, String);                                                                                      // 63
                                                                                                                       // 64
        this.unblock();                                                                                                // 65
                                                                                                                       // 66
        var store = UploadFS.getStore(storeName);                                                                      // 67
        if (!store) {                                                                                                  // 68
            throw new Meteor.Error(404, 'Store "' + storeName + '" does not exist');                                   // 69
        }                                                                                                              // 70
                                                                                                                       // 71
        try {                                                                                                          // 72
            // Extract file info                                                                                       // 73
            if (!file.name) {                                                                                          // 74
                file.name = url.replace(/\?.*$/, '').split('/').pop();                                                 // 75
                file.extension = file.name.split('.').pop();                                                           // 76
                file.type = 'image/' + file.extension;                                                                 // 77
            }                                                                                                          // 78
            // Check if file is valid                                                                                  // 79
            if (store.getFilter() instanceof UploadFS.Filter) {                                                        // 80
                store.getFilter().check(file);                                                                         // 81
            }                                                                                                          // 82
            // Create the file                                                                                         // 83
            var fileId = store.create(file);                                                                           // 84
                                                                                                                       // 85
        } catch (err) {                                                                                                // 86
            throw new Meteor.Error(500, err.message);                                                                  // 87
        }                                                                                                              // 88
                                                                                                                       // 89
        var fut = new Future();                                                                                        // 90
        var proto;                                                                                                     // 91
                                                                                                                       // 92
        // Detect protocol to use                                                                                      // 93
        if (/http:\/\//i.test(url)) {                                                                                  // 94
            proto = http;                                                                                              // 95
        } else if (/https:\/\//i.test(url)) {                                                                          // 96
            proto = https;                                                                                             // 97
        }                                                                                                              // 98
                                                                                                                       // 99
        // Download file                                                                                               // 100
        proto.get(url, Meteor.bindEnvironment(function (res) {                                                         // 101
            // Save the file in the store                                                                              // 102
            store.write(res, fileId, function (err, file) {                                                            // 103
                if (err) {                                                                                             // 104
                    fut.throw(err);                                                                                    // 105
                } else {                                                                                               // 106
                    fut.return(fileId);                                                                                // 107
                }                                                                                                      // 108
            });                                                                                                        // 109
        })).on('error', function (err) {                                                                               // 110
            fut.throw(err);                                                                                            // 111
        });                                                                                                            // 112
        return fut.wait();                                                                                             // 113
    },                                                                                                                 // 114
                                                                                                                       // 115
    /**                                                                                                                // 116
     * Saves a chunk of file                                                                                           // 117
     * @param chunk                                                                                                    // 118
     * @param fileId                                                                                                   // 119
     * @param storeName                                                                                                // 120
     * @param progress                                                                                                 // 121
     * @return {*}                                                                                                     // 122
     */                                                                                                                // 123
    ufsWrite: function (chunk, fileId, storeName, progress) {                                                          // 124
        check(fileId, String);                                                                                         // 125
        check(storeName, String);                                                                                      // 126
        check(progress, Number);                                                                                       // 127
                                                                                                                       // 128
        this.unblock();                                                                                                // 129
                                                                                                                       // 130
        // Check arguments                                                                                             // 131
        if (!(chunk instanceof Uint8Array)) {                                                                          // 132
            throw new Meteor.Error(400, 'chunk is not an Uint8Array');                                                 // 133
        }                                                                                                              // 134
        if (chunk.length <= 0) {                                                                                       // 135
            throw new Meteor.Error(400, 'chunk is empty');                                                             // 136
        }                                                                                                              // 137
                                                                                                                       // 138
        var store = UploadFS.getStore(storeName);                                                                      // 139
        if (!store) {                                                                                                  // 140
            throw new Meteor.Error(404, 'store ' + storeName + ' does not exist');                                     // 141
        }                                                                                                              // 142
                                                                                                                       // 143
        // Check that file exists, is not complete and is owned by current user                                        // 144
        if (store.getCollection().find({_id: fileId, complete: false, userId: this.userId}).count() < 1) {             // 145
            throw new Meteor.Error(404, 'file ' + fileId + ' does not exist');                                         // 146
        }                                                                                                              // 147
                                                                                                                       // 148
        var fut = new Future();                                                                                        // 149
        var tmpFile = UploadFS.getTempFilePath(fileId);                                                                // 150
                                                                                                                       // 151
        // Save the chunk                                                                                              // 152
        fs.appendFile(tmpFile, new Buffer(chunk), Meteor.bindEnvironment(function (err) {                              // 153
            if (err) {                                                                                                 // 154
                console.error('ufs: cannot write chunk of file "' + fileId + '" (' + err.message + ')');               // 155
                fs.unlink(tmpFile, function (err) {                                                                    // 156
                    err && console.error('ufs: cannot delete temp file ' + tmpFile + ' (' + err.message + ')');        // 157
                });                                                                                                    // 158
                fut.throw(err);                                                                                        // 159
            } else {                                                                                                   // 160
                // Update completed state                                                                              // 161
                store.getCollection().update(fileId, {                                                                 // 162
                    $set: {progress: progress}                                                                         // 163
                });                                                                                                    // 164
                fut.return(chunk.length);                                                                              // 165
            }                                                                                                          // 166
        }));                                                                                                           // 167
        return fut.wait();                                                                                             // 168
    }                                                                                                                  // 169
});                                                                                                                    // 170
                                                                                                                       // 171
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-server.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
domain = Npm.require('domain');                                                                                        // 1
fs = Npm.require('fs');                                                                                                // 2
Future = Npm.require('fibers/future');                                                                                 // 3
http = Npm.require('http');                                                                                            // 4
https = Npm.require('https');                                                                                          // 5
mkdirp = Npm.require('mkdirp');                                                                                        // 6
stream = Npm.require('stream');                                                                                        // 7
zlib = Npm.require('zlib');                                                                                            // 8
                                                                                                                       // 9
Meteor.startup(function () {                                                                                           // 10
    var path = UploadFS.config.tmpDir;                                                                                 // 11
    var mode = '0744';                                                                                                 // 12
                                                                                                                       // 13
    fs.stat(path, function (err) {                                                                                     // 14
        if (err) {                                                                                                     // 15
            // Create the temp directory                                                                               // 16
            mkdirp(path, {mode: mode}, function (err) {                                                                // 17
                if (err) {                                                                                             // 18
                    console.error('ufs: cannot create temp directory at ' + path + ' (' + err.message + ')');          // 19
                } else {                                                                                               // 20
                    console.log('ufs: temp directory created at ' + path);                                             // 21
                }                                                                                                      // 22
            });                                                                                                        // 23
        } else {                                                                                                       // 24
            // Set directory permissions                                                                               // 25
            fs.chmod(path, mode, function (err) {                                                                      // 26
                err && console.error('ufs: cannot set temp directory permissions ' + mode + ' (' + err.message + ')');
            });                                                                                                        // 28
        }                                                                                                              // 29
    });                                                                                                                // 30
});                                                                                                                    // 31
                                                                                                                       // 32
// Create domain to handle errors                                                                                      // 33
// and possibly avoid server crashes.                                                                                  // 34
var d = domain.create();                                                                                               // 35
                                                                                                                       // 36
d.on('error', function (err) {                                                                                         // 37
    console.error('ufs: ' + err.message);                                                                              // 38
});                                                                                                                    // 39
                                                                                                                       // 40
// Listen HTTP requests to serve files                                                                                 // 41
WebApp.connectHandlers.use(function (req, res, next) {                                                                 // 42
    // Quick check to see if request should be catch                                                                   // 43
    if (req.url.indexOf(UploadFS.config.storesPath) === -1) {                                                          // 44
        next();                                                                                                        // 45
        return;                                                                                                        // 46
    }                                                                                                                  // 47
                                                                                                                       // 48
    // Remove store path                                                                                               // 49
    var path = req.url.substr(UploadFS.config.storesPath.length + 1);                                                  // 50
                                                                                                                       // 51
    // Get store, file Id and file name                                                                                // 52
    var regExp = new RegExp('^\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?$');                                                  // 53
    var match = regExp.exec(path);                                                                                     // 54
                                                                                                                       // 55
    if (match !== null) {                                                                                              // 56
        // Get store                                                                                                   // 57
        var storeName = match[1];                                                                                      // 58
        var store = UploadFS.getStore(storeName);                                                                      // 59
                                                                                                                       // 60
        if (!store) {                                                                                                  // 61
            res.writeHead(404);                                                                                        // 62
            res.end();                                                                                                 // 63
            return;                                                                                                    // 64
        }                                                                                                              // 65
                                                                                                                       // 66
        if (typeof store.onRead !== 'function') {                                                                      // 67
            console.error('ufs: store "' + storeName + '" onRead is not a function');                                  // 68
            res.writeHead(500);                                                                                        // 69
            res.end();                                                                                                 // 70
            return;                                                                                                    // 71
        }                                                                                                              // 72
                                                                                                                       // 73
        // Remove file extension from file Id                                                                          // 74
        var index = match[2].indexOf('.');                                                                             // 75
        var fileId = index !== -1 ? match[2].substr(0, index) : match[2];                                              // 76
                                                                                                                       // 77
        // Get file from database                                                                                      // 78
        var file = store.getCollection().findOne(fileId);                                                              // 79
        if (!file) {                                                                                                   // 80
            res.writeHead(404);                                                                                        // 81
            res.end();                                                                                                 // 82
            return;                                                                                                    // 83
        }                                                                                                              // 84
                                                                                                                       // 85
        // Simulate read speed                                                                                         // 86
        if (UploadFS.config.simulateReadDelay) {                                                                       // 87
            Meteor._sleepForMs(UploadFS.config.simulateReadDelay);                                                     // 88
        }                                                                                                              // 89
                                                                                                                       // 90
        d.run(function () {                                                                                            // 91
            // Check if the file can be accessed                                                                       // 92
            if (store.onRead.call(store, fileId, file, req, res)) {                                                    // 93
                // Open the file stream                                                                                // 94
                var rs = store.getReadStream(fileId, file);                                                            // 95
                var ws = new stream.PassThrough();                                                                     // 96
                                                                                                                       // 97
                rs.on('error', function (err) {                                                                        // 98
                    store.onReadError.call(store, err, fileId, file);                                                  // 99
                    res.end();                                                                                         // 100
                });                                                                                                    // 101
                ws.on('error', function (err) {                                                                        // 102
                    store.onReadError.call(store, err, fileId, file);                                                  // 103
                    res.end();                                                                                         // 104
                });                                                                                                    // 105
                ws.on('close', function () {                                                                           // 106
                    // Close output stream at the end                                                                  // 107
                    ws.emit('end');                                                                                    // 108
                });                                                                                                    // 109
                                                                                                                       // 110
                var accept = req.headers['accept-encoding'] || '';                                                     // 111
                var headers = {                                                                                        // 112
                    'Content-Type': file.type,                                                                         // 113
                    'Content-Length': file.size                                                                        // 114
                };                                                                                                     // 115
                                                                                                                       // 116
                // Transform stream                                                                                    // 117
                store.transformRead(rs, ws, fileId, file, req, headers);                                               // 118
                                                                                                                       // 119
                // Compress data using gzip                                                                            // 120
                if (accept.match(/\bgzip\b/)) {                                                                        // 121
                    headers['Content-Encoding'] = 'gzip';                                                              // 122
                    delete headers['Content-Length'];                                                                  // 123
                    res.writeHead(200, headers);                                                                       // 124
                    ws.pipe(zlib.createGzip()).pipe(res);                                                              // 125
                }                                                                                                      // 126
                // Compress data using deflate                                                                         // 127
                else if (accept.match(/\bdeflate\b/)) {                                                                // 128
                    headers['Content-Encoding'] = 'deflate';                                                           // 129
                    delete headers['Content-Length'];                                                                  // 130
                    res.writeHead(200, headers);                                                                       // 131
                    ws.pipe(zlib.createDeflate()).pipe(res);                                                           // 132
                }                                                                                                      // 133
                // Send raw data                                                                                       // 134
                else {                                                                                                 // 135
                    res.writeHead(200, headers);                                                                       // 136
                    ws.pipe(res);                                                                                      // 137
                }                                                                                                      // 138
            } else {                                                                                                   // 139
                res.end();                                                                                             // 140
            }                                                                                                          // 141
        });                                                                                                            // 142
                                                                                                                       // 143
    } else {                                                                                                           // 144
        next();                                                                                                        // 145
    }                                                                                                                  // 146
});                                                                                                                    // 147
                                                                                                                       // 148
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jalik:ufs'] = {
  UploadFS: UploadFS
};

})();

//# sourceMappingURL=jalik_ufs.js.map
