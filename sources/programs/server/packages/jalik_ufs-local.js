(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var UploadFS = Package['jalik:ufs'].UploadFS;
var _ = Package.underscore._;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/jalik_ufs-local/ufs-local.js                                                                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
if (Meteor.isServer) {                                                                                            // 1
    var fs = Npm.require('fs');                                                                                   // 2
    var mkdirp = Npm.require('mkdirp');                                                                           // 3
}                                                                                                                 // 4
                                                                                                                  // 5
/**                                                                                                               // 6
 * File system store                                                                                              // 7
 * @param options                                                                                                 // 8
 * @constructor                                                                                                   // 9
 */                                                                                                               // 10
UploadFS.store.Local = function (options) {                                                                       // 11
    // Set default options                                                                                        // 12
    options = _.extend({                                                                                          // 13
        mode: '0744',                                                                                             // 14
        path: 'ufs/uploads',                                                                                      // 15
        writeMode: '0744'                                                                                         // 16
    }, options);                                                                                                  // 17
                                                                                                                  // 18
    // Check options                                                                                              // 19
    if (typeof options.mode !== 'string') {                                                                       // 20
        throw new TypeError('mode is not a string');                                                              // 21
    }                                                                                                             // 22
    if (typeof options.path !== 'string') {                                                                       // 23
        throw new TypeError('path is not a string');                                                              // 24
    }                                                                                                             // 25
    if (typeof options.writeMode !== 'string') {                                                                  // 26
        throw new TypeError('writeMode is not a string');                                                         // 27
    }                                                                                                             // 28
                                                                                                                  // 29
    // Private attributes                                                                                         // 30
    var mode = options.mode;                                                                                      // 31
    var path = options.path;                                                                                      // 32
    var writeMode = options.writeMode;                                                                            // 33
                                                                                                                  // 34
    if (Meteor.isServer) {                                                                                        // 35
        fs.stat(path, function (err) {                                                                            // 36
            if (err) {                                                                                            // 37
                // Create the directory                                                                           // 38
                mkdirp(path, {mode: mode}, function (err) {                                                       // 39
                    if (err) {                                                                                    // 40
                        console.error('ufs: cannot create store at ' + path + ' (' + err.message + ')');          // 41
                    } else {                                                                                      // 42
                        console.info('ufs: store created at ' + path);                                            // 43
                    }                                                                                             // 44
                });                                                                                               // 45
            } else {                                                                                              // 46
                // Set directory permissions                                                                      // 47
                fs.chmod(path, mode, function (err) {                                                             // 48
                    err && console.error('ufs: cannot set store permissions ' + mode + ' (' + err.message + ')');
                });                                                                                               // 50
            }                                                                                                     // 51
        });                                                                                                       // 52
    }                                                                                                             // 53
                                                                                                                  // 54
    // Create the store                                                                                           // 55
    var self = new UploadFS.Store(options);                                                                       // 56
                                                                                                                  // 57
    /**                                                                                                           // 58
     * Returns the file path                                                                                      // 59
     * @param fileId                                                                                              // 60
     * @param file                                                                                                // 61
     * @return {string}                                                                                           // 62
     */                                                                                                           // 63
    self.getFilePath = function (fileId, file) {                                                                  // 64
        file = file || self.getCollection().findOne(fileId, {fields: {extension: 1}});                            // 65
        return file && self.getPath(fileId + (file.extension ? '.' + file.extension : ''));                       // 66
    };                                                                                                            // 67
                                                                                                                  // 68
    /**                                                                                                           // 69
     * Returns the path or sub path                                                                               // 70
     * @param file                                                                                                // 71
     * @return {string}                                                                                           // 72
     */                                                                                                           // 73
    self.getPath = function (file) {                                                                              // 74
        return path + (file ? '/' + file : '');                                                                   // 75
    };                                                                                                            // 76
                                                                                                                  // 77
                                                                                                                  // 78
    if (Meteor.isServer) {                                                                                        // 79
        /**                                                                                                       // 80
         * Removes the file                                                                                       // 81
         * @param fileId                                                                                          // 82
         * @param callback                                                                                        // 83
         */                                                                                                       // 84
        self.delete = function (fileId, callback) {                                                               // 85
            var path = self.getFilePath(fileId);                                                                  // 86
                                                                                                                  // 87
            if (typeof callback !== 'function') {                                                                 // 88
                callback = function (err) {                                                                       // 89
                    err && console.error('ufs: cannot delete file "' + fileId + '" at ' + path + ' (' + err.message + ')');
                }                                                                                                 // 91
            }                                                                                                     // 92
            fs.stat(path, Meteor.bindEnvironment(function (err, stat) {                                           // 93
                if (!err && stat && stat.isFile()) {                                                              // 94
                    fs.unlink(path, Meteor.bindEnvironment(callback));                                            // 95
                }                                                                                                 // 96
            }));                                                                                                  // 97
        };                                                                                                        // 98
                                                                                                                  // 99
        /**                                                                                                       // 100
         * Returns the file read stream                                                                           // 101
         * @param fileId                                                                                          // 102
         * @param file                                                                                            // 103
         * @return {*}                                                                                            // 104
         */                                                                                                       // 105
        self.getReadStream = function (fileId, file) {                                                            // 106
            return fs.createReadStream(self.getFilePath(fileId, file), {                                          // 107
                flags: 'r',                                                                                       // 108
                encoding: null,                                                                                   // 109
                autoClose: true                                                                                   // 110
            });                                                                                                   // 111
        };                                                                                                        // 112
                                                                                                                  // 113
        /**                                                                                                       // 114
         * Returns the file write stream                                                                          // 115
         * @param fileId                                                                                          // 116
         * @param file                                                                                            // 117
         * @return {*}                                                                                            // 118
         */                                                                                                       // 119
        self.getWriteStream = function (fileId, file) {                                                           // 120
            return fs.createWriteStream(self.getFilePath(fileId, file), {                                         // 121
                flags: 'a',                                                                                       // 122
                encoding: null,                                                                                   // 123
                mode: writeMode                                                                                   // 124
            });                                                                                                   // 125
        };                                                                                                        // 126
    }                                                                                                             // 127
                                                                                                                  // 128
    return self;                                                                                                  // 129
};                                                                                                                // 130
                                                                                                                  // 131
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jalik:ufs-local'] = {};

})();

//# sourceMappingURL=jalik_ufs-local.js.map
