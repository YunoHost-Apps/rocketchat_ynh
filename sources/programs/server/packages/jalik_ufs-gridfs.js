(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var UploadFS = Package['jalik:ufs'].UploadFS;

/* Package-scope variables */
var mongoStore;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/jalik_ufs-gridfs/ufs-gridfs.js                                              //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
if (Meteor.isServer) {                                                                  // 1
    var Grid = Npm.require('gridfs-stream');                                            // 2
}                                                                                       // 3
                                                                                        // 4
/**                                                                                     // 5
 * GridFS store                                                                         // 6
 * @param options                                                                       // 7
 * @constructor                                                                         // 8
 */                                                                                     // 9
UploadFS.store.GridFS = function (options) {                                            // 10
    // Set default options                                                              // 11
    options = _.extend({                                                                // 12
        chunkSize: 1024 * 255,                                                          // 13
        collectionName: 'uploadfs'                                                      // 14
    }, options);                                                                        // 15
                                                                                        // 16
    // Check options                                                                    // 17
    if (!Match.test(options.chunkSize, Number)) {                                       // 18
        throw new TypeError('chunkSize is not a number');                               // 19
    }                                                                                   // 20
                                                                                        // 21
    if (!Match.test(options.collectionName, String)) {                                  // 22
        throw new TypeError('collectionName is not a string');                          // 23
    }                                                                                   // 24
                                                                                        // 25
    // Create the store                                                                 // 26
    var store = new UploadFS.Store(options);                                            // 27
                                                                                        // 28
    if (Meteor.isServer) {                                                              // 29
        var mongo = Package.mongo.MongoInternals.NpmModule;                             // 30
        var db = Package.mongo.MongoInternals.defaultRemoteCollectionDriver().mongo.db;
                                                                                        // 32
        mongoStore = new Grid(db, mongo);                                               // 33
                                                                                        // 34
        /**                                                                             // 35
         * Removes the file                                                             // 36
         * @param fileId                                                                // 37
         * @param callback                                                              // 38
         */                                                                             // 39
        store.delete = function (fileId, callback) {                                    // 40
            if (typeof callback !== 'function') {                                       // 41
                callback = function (err) {                                             // 42
                    if (err) {                                                          // 43
                        console.error(err);                                             // 44
                    }                                                                   // 45
                }                                                                       // 46
            }                                                                           // 47
                                                                                        // 48
            return mongoStore.remove({                                                  // 49
                filename: fileId,                                                       // 50
                root: options.collectionName                                            // 51
            }, callback);                                                               // 52
        };                                                                              // 53
                                                                                        // 54
        /**                                                                             // 55
         * Returns the file read stream                                                 // 56
         * @param fileId                                                                // 57
         * @return {*}                                                                  // 58
         */                                                                             // 59
        store.getReadStream = function (fileId) {                                       // 60
            return mongoStore.createReadStream({                                        // 61
                _id: fileId,                                                            // 62
                root: options.collectionName                                            // 63
            });                                                                         // 64
        };                                                                              // 65
                                                                                        // 66
        /**                                                                             // 67
         * Returns the file write stream                                                // 68
         * @param fileId                                                                // 69
         * @return {*}                                                                  // 70
         */                                                                             // 71
        store.getWriteStream = function (fileId, file) {                                // 72
            var writeStream = mongoStore.createWriteStream({                            // 73
                _id: fileId,                                                            // 74
                filename: fileId,                                                       // 75
                mode: 'w',                                                              // 76
                chunkSize: options.chunkSize,                                           // 77
                root: options.collectionName,                                           // 78
                content_type: file.type                                                 // 79
            });                                                                         // 80
                                                                                        // 81
            writeStream.on('close', function() {                                        // 82
                writeStream.emit('finish');                                             // 83
            });                                                                         // 84
                                                                                        // 85
            return writeStream;                                                         // 86
        };                                                                              // 87
    }                                                                                   // 88
                                                                                        // 89
    return store;                                                                       // 90
};                                                                                      // 91
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jalik:ufs-gridfs'] = {};

})();

//# sourceMappingURL=jalik_ufs-gridfs.js.map
