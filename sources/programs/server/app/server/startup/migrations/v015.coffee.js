(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v015.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 15,                                                         // 2
  up: function() {                                                     // 2
    var newChunkCollection, newFilesCollection, newGridFSCollection, oldChunkCollection, oldFilesCollection, oldGridFSCollection;
    console.log('Starting file migration');                            // 5
    oldFilesCollection = new Meteor.Collection('cfs.Files.filerecord');
    oldGridFSCollection = new Meteor.Collection('cfs_gridfs.files.files');
    oldChunkCollection = new Meteor.Collection('cfs_gridfs.files.chunks');
    newFilesCollection = RocketChat.models.Uploads;                    // 5
    newGridFSCollection = new Meteor.Collection('rocketchat_uploads.files');
    newChunkCollection = new Meteor.Collection('rocketchat_uploads.chunks');
    oldFilesCollection.find({                                          // 5
      'copies.files.key': {                                            // 15
        $exists: true                                                  // 15
      }                                                                //
    }).forEach(function(cfsRecord) {                                   //
      var extension, nameParts, oldGridFsFile, record, ref, url;       // 16
      nameParts = (ref = cfsRecord.original.name) != null ? ref.split('.') : void 0;
      extension = '';                                                  // 16
      url = "ufs/rocketchat_uploads/" + cfsRecord._id;                 // 16
      console.log('migrating file', url);                              // 16
      if ((nameParts != null ? nameParts.length : void 0) > 1) {       // 22
        extension = nameParts.pop();                                   // 23
        url = url + '.' + extension;                                   // 23
      }                                                                //
      record = {                                                       // 16
        _id: cfsRecord._id,                                            // 27
        name: cfsRecord.original.name || '',                           // 27
        size: cfsRecord.original.size,                                 // 27
        type: cfsRecord.original.type,                                 // 27
        complete: true,                                                // 27
        uploading: false,                                              // 27
        store: "rocketchat_uploads",                                   // 27
        extension: extension,                                          // 27
        userId: cfsRecord.userId,                                      // 27
        uploadedAt: cfsRecord.updatedAt,                               // 27
        url: Meteor.absoluteUrl() + url                                // 27
      };                                                               //
      newFilesCollection.insert(record);                               // 16
      oldGridFsFile = oldGridFSCollection.findOne({                    // 16
        _id: new Meteor.Collection.ObjectID(cfsRecord.copies.files.key)
      });                                                              //
      newGridFSCollection.insert({                                     // 16
        _id: cfsRecord._id,                                            // 44
        filename: cfsRecord._id,                                       // 44
        contentType: oldGridFsFile.contentType,                        // 44
        length: oldGridFsFile.length,                                  // 44
        chunkSize: oldGridFsFile.chunkSize,                            // 44
        uploadDate: oldGridFsFile.uploadDate,                          // 44
        aliases: null,                                                 // 44
        metadata: null,                                                // 44
        md5: oldGridFsFile.md5                                         // 44
      });                                                              //
      oldChunkCollection.find({                                        // 16
        files_id: new Meteor.Collection.ObjectID(cfsRecord.copies.files.key)
      }).forEach(function(oldChunk) {                                  //
        return newChunkCollection.insert({                             //
          _id: oldChunk._id,                                           // 56
          files_id: cfsRecord._id,                                     // 56
          n: oldChunk.n,                                               // 56
          data: oldChunk.data                                          // 56
        });                                                            //
      });                                                              //
      RocketChat.models.Messages.find({                                // 16
        $or: [                                                         // 61
          {                                                            //
            'urls.url': "https://demo.rocket.chat/cfs/files/Files/" + cfsRecord._id
          }, {                                                         //
            'urls.url': "https://rocket.chat/cfs/files/Files/" + cfsRecord._id
          }                                                            //
        ]                                                              //
      }).forEach(function(message) {                                   //
        var i, len, ref1, ref2, urlsItem;                              // 62
        ref1 = message.urls;                                           // 62
        for (i = 0, len = ref1.length; i < len; i++) {                 // 62
          urlsItem = ref1[i];                                          //
          if (urlsItem.url === ("https://demo.rocket.chat/cfs/files/Files/" + cfsRecord._id) || urlsItem.url === ("https://rocket.chat/cfs/files/Files/" + cfsRecord._id)) {
            urlsItem.url = Meteor.absoluteUrl() + url;                 // 64
            if (((ref2 = urlsItem.parsedUrl) != null ? ref2.pathname : void 0) != null) {
              urlsItem.parsedUrl.pathname = "/" + url;                 // 66
            }                                                          //
            message.msg = message.msg.replace("https://demo.rocket.chat/cfs/files/Files/" + cfsRecord._id, Meteor.absoluteUrl() + url);
            message.msg = message.msg.replace("https://rocket.chat/cfs/files/Files/" + cfsRecord._id, Meteor.absoluteUrl() + url);
          }                                                            //
        }                                                              // 62
        return RocketChat.models.Messages.update({                     //
          _id: message._id                                             // 70
        }, {                                                           //
          $set: {                                                      // 70
            urls: message.urls,                                        // 70
            msg: message.msg                                           // 70
          }                                                            //
        });                                                            //
      });                                                              //
      oldFilesCollection.remove({                                      // 16
        _id: cfsRecord._id                                             // 72
      });                                                              //
      oldGridFSCollection.remove({                                     // 16
        _id: oldGridFsFile._id                                         // 73
      });                                                              //
      return oldChunkCollection.remove({                               //
        files_id: new Meteor.Collection.ObjectID(cfsRecord.copies.files.key)
      });                                                              //
    });                                                                //
    return console.log('End of file migration');                       //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v015.coffee.js.map
