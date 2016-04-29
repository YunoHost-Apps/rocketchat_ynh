(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChatFile = Package['rocketchat:file'].RocketChatFile;
var UploadFS = Package['jalik:ufs'].UploadFS;
var Slingshot = Package['edgee:slingshot'].Slingshot;
var AWS = Package['peerlibrary:aws-sdk'].AWS;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Random = Package.random.Random;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var FileUpload, FileUploadBase, FileSystemStore, fileUploadHandler;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/globalFileRestrictions.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Slingshot */                                                                                                //
                                                                                                                       //
Slingshot.fileRestrictions('rocketchat-uploads', {                                                                     // 3
	authorize: function (file /*, metaContext*/) {                                                                        // 4
		if (!RocketChat.fileUploadIsValidContentType(file.type)) {                                                           // 5
			throw new Meteor.Error(TAPi18n.__('Invalid_file_type'));                                                            // 6
		}                                                                                                                    //
                                                                                                                       //
		var maxFileSize = RocketChat.settings.get('FileUpload_MaxFileSize');                                                 // 9
                                                                                                                       //
		if (maxFileSize && maxFileSize < file.size) {                                                                        // 11
			throw new Meteor.Error(TAPi18n.__('File_exceeds_allowed_size_of_bytes', { size: maxFileSize }));                    // 12
		}                                                                                                                    //
                                                                                                                       //
		//Deny uploads if user is not logged in.                                                                             //
		if (!this.userId) {                                                                                                  // 16
			throw new Meteor.Error('login-require', 'Please login before posting files');                                       // 17
		}                                                                                                                    //
                                                                                                                       //
		return true;                                                                                                         // 20
	},                                                                                                                    //
	maxSize: 0,                                                                                                           // 22
	allowedFileTypes: null                                                                                                // 23
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/lib/FileUpload.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals FileUpload:true */                                                                                          //
/* exported FileUpload */                                                                                              //
                                                                                                                       //
var maxFileSize = 0;                                                                                                   // 4
                                                                                                                       //
FileUpload = {                                                                                                         // 6
	validateFileUpload: function (file) {                                                                                 // 7
		if (file.size > maxFileSize) {                                                                                       // 8
			throw new Meteor.Error('file-too-large', 'File is too large');                                                      // 9
		}                                                                                                                    //
                                                                                                                       //
		if (!RocketChat.fileUploadIsValidContentType(file.type)) {                                                           // 12
			throw new Meteor.Error('invalid-file-type', 'File type is not accepted');                                           // 13
		}                                                                                                                    //
                                                                                                                       //
		return true;                                                                                                         // 16
	}                                                                                                                     //
};                                                                                                                     //
                                                                                                                       //
RocketChat.settings.get('FileUpload_MaxFileSize', function (key, value) {                                              // 20
	maxFileSize = value;                                                                                                  // 21
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/lib/FileUploadBase.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals FileUploadBase:true */                                                                                      //
/* exported FileUploadBase */                                                                                          //
                                                                                                                       //
FileUploadBase = (function () {                                                                                        // 4
	function FileUploadBase(meta, file /*, data*/) {                                                                      // 5
		babelHelpers.classCallCheck(this, FileUploadBase);                                                                   //
                                                                                                                       //
		this.id = Random.id();                                                                                               // 6
		this.meta = meta;                                                                                                    // 7
		this.file = file;                                                                                                    // 8
	}                                                                                                                     //
                                                                                                                       //
	FileUploadBase.prototype.getProgress = (function () {                                                                 // 4
		function getProgress() {}                                                                                            // 11
                                                                                                                       //
		return getProgress;                                                                                                  //
	})();                                                                                                                 //
                                                                                                                       //
	FileUploadBase.prototype.getFileName = (function () {                                                                 // 4
		function getFileName() {                                                                                             // 15
			return this.meta.name;                                                                                              // 16
		}                                                                                                                    //
                                                                                                                       //
		return getFileName;                                                                                                  //
	})();                                                                                                                 //
                                                                                                                       //
	FileUploadBase.prototype.start = (function () {                                                                       // 4
		function start() {}                                                                                                  // 19
                                                                                                                       //
		return start;                                                                                                        //
	})();                                                                                                                 //
                                                                                                                       //
	FileUploadBase.prototype.stop = (function () {                                                                        // 4
		function stop() {}                                                                                                   // 23
                                                                                                                       //
		return stop;                                                                                                         //
	})();                                                                                                                 //
                                                                                                                       //
	return FileUploadBase;                                                                                                //
})();                                                                                                                  //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/lib/FileUpload.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals FileUpload:true */                                                                                          //
FileUpload.handlers = {};                                                                                              // 2
                                                                                                                       //
FileUpload.addHandler = function (store, handler) {                                                                    // 4
	this.handlers[store] = handler;                                                                                       // 5
};                                                                                                                     //
                                                                                                                       //
FileUpload["delete"] = function (fileId) {                                                                             // 8
	var file = RocketChat.models.Uploads.findOneById(fileId);                                                             // 9
                                                                                                                       //
	if (!file) {                                                                                                          // 11
		return;                                                                                                              // 12
	}                                                                                                                     //
                                                                                                                       //
	this.handlers[file.store]["delete"](file);                                                                            // 15
                                                                                                                       //
	return RocketChat.models.Uploads.remove(file._id);                                                                    // 17
};                                                                                                                     //
                                                                                                                       //
FileUpload.get = function (file, req, res, next) {                                                                     // 20
	if (file.store && this.handlers && this.handlers[file.store] && this.handlers[file.store].get) {                      // 21
		this.handlers[file.store].get.call(this, file, req, res, next);                                                      // 22
	} else {                                                                                                              //
		res.writeHead(404);                                                                                                  // 24
		res.end();                                                                                                           // 25
		return;                                                                                                              // 26
	}                                                                                                                     //
};                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/lib/requests.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals FileUpload, WebApp, Cookies */                                                                              //
var protectedFiles;                                                                                                    // 2
                                                                                                                       //
RocketChat.settings.get('FileUpload_ProtectFiles', function (key, value) {                                             // 4
	protectedFiles = value;                                                                                               // 5
});                                                                                                                    //
                                                                                                                       //
WebApp.connectHandlers.use('/file-upload/', function (req, res, next) {                                                // 8
	var file;                                                                                                             // 9
                                                                                                                       //
	var match = /^\/([^\/]+)\/(.*)/.exec(req.url);                                                                        // 11
                                                                                                                       //
	if (match[1]) {                                                                                                       // 13
		file = RocketChat.models.Uploads.findOneById(match[1]);                                                              // 14
                                                                                                                       //
		if (file) {                                                                                                          // 16
			if (protectedFiles) {                                                                                               // 17
				var cookie, rawCookies, ref, token, uid;                                                                           // 18
				cookie = new Cookies();                                                                                            // 19
                                                                                                                       //
				if ((typeof req !== 'undefined' && req !== null ? (ref = req.headers) != null ? ref.cookie : void 0 : void 0) != null) {
					rawCookies = req.headers.cookie;                                                                                  // 22
				}                                                                                                                  //
                                                                                                                       //
				if (rawCookies != null) {                                                                                          // 25
					uid = cookie.get('rc_uid', rawCookies);                                                                           // 26
				}                                                                                                                  //
                                                                                                                       //
				if (rawCookies != null) {                                                                                          // 29
					token = cookie.get('rc_token', rawCookies);                                                                       // 30
				}                                                                                                                  //
                                                                                                                       //
				if (uid == null) {                                                                                                 // 33
					uid = req.query.rc_uid;                                                                                           // 34
					token = req.query.rc_token;                                                                                       // 35
				}                                                                                                                  //
                                                                                                                       //
				if (!(uid && token && RocketChat.models.Users.findOneByIdAndLoginToken(uid, token))) {                             // 38
					res.writeHead(403);                                                                                               // 39
					res.end();                                                                                                        // 40
					return false;                                                                                                     // 41
				}                                                                                                                  //
			}                                                                                                                   //
                                                                                                                       //
			return FileUpload.get(file, req, res, next);                                                                        // 45
		}                                                                                                                    //
	}                                                                                                                     //
                                                                                                                       //
	res.writeHead(404);                                                                                                   // 49
	res.end();                                                                                                            // 50
	return;                                                                                                               // 51
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/config/configFileUploadAmazonS3.js                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Slingshot, FileUpload, AWS, SystemLogger */                                                                 //
var crypto = Npm.require('crypto');                                                                                    // 2
                                                                                                                       //
var S3accessKey, S3secretKey;                                                                                          // 4
                                                                                                                       //
var generateURL = function (file) {                                                                                    // 6
	if (!file || !file.s3) {                                                                                              // 7
		return;                                                                                                              // 8
	}                                                                                                                     //
	var resourceURL = '/' + file.s3.bucket + '/' + file.s3.path + file._id;                                               // 10
	var expires = parseInt(new Date().getTime() / 1000) + 60;                                                             // 11
	var StringToSign = 'GET\n\n\n' + expires + '\n' + resourceURL;                                                        // 12
	var signature = crypto.createHmac('sha1', S3secretKey).update(new Buffer(StringToSign, 'utf-8')).digest('base64');    // 13
	return file.url + '?AWSAccessKeyId=' + encodeURIComponent(S3accessKey) + '&Expires=' + expires + '&Signature=' + encodeURIComponent(signature);
};                                                                                                                     //
                                                                                                                       //
FileUpload.addHandler('s3', {                                                                                          // 17
	get: function (file, req, res) {                                                                                      // 18
		var fileUrl = generateURL(file);                                                                                     // 19
                                                                                                                       //
		if (fileUrl) {                                                                                                       // 21
			res.setHeader('Location', fileUrl);                                                                                 // 22
			res.writeHead(302);                                                                                                 // 23
		}                                                                                                                    //
		res.end();                                                                                                           // 25
	},                                                                                                                    //
	'delete': function (file) {                                                                                           // 27
		var s3 = new AWS.S3();                                                                                               // 28
		var request = s3.deleteObject({                                                                                      // 29
			Bucket: file.s3.bucket,                                                                                             // 30
			Key: file.s3.path + file._id                                                                                        // 31
		});                                                                                                                  //
		request.send();                                                                                                      // 33
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
var createS3Directive = _.debounce(function () {                                                                       // 37
	var directiveName = 'rocketchat-uploads';                                                                             // 38
                                                                                                                       //
	var type = RocketChat.settings.get('FileUpload_Storage_Type');                                                        // 40
	var bucket = RocketChat.settings.get('FileUpload_S3_Bucket');                                                         // 41
	var acl = RocketChat.settings.get('FileUpload_S3_Acl');                                                               // 42
	var accessKey = RocketChat.settings.get('FileUpload_S3_AWSAccessKeyId');                                              // 43
	var secretKey = RocketChat.settings.get('FileUpload_S3_AWSSecretAccessKey');                                          // 44
	var cdn = RocketChat.settings.get('FileUpload_S3_CDN');                                                               // 45
	var region = RocketChat.settings.get('FileUpload_S3_Region');                                                         // 46
	var bucketUrl = RocketChat.settings.get('FileUpload_S3_BucketURL');                                                   // 47
                                                                                                                       //
	AWS.config.update({                                                                                                   // 49
		accessKeyId: RocketChat.settings.get('FileUpload_S3_AWSAccessKeyId'),                                                // 50
		secretAccessKey: RocketChat.settings.get('FileUpload_S3_AWSSecretAccessKey')                                         // 51
	});                                                                                                                   //
                                                                                                                       //
	if (type === 'AmazonS3' && !_.isEmpty(bucket) && !_.isEmpty(accessKey) && !_.isEmpty(secretKey)) {                    // 54
		if (Slingshot._directives[directiveName]) {                                                                          // 55
			delete Slingshot._directives[directiveName];                                                                        // 56
		}                                                                                                                    //
		var config = {                                                                                                       // 58
			bucket: bucket,                                                                                                     // 59
			AWSAccessKeyId: accessKey,                                                                                          // 60
			AWSSecretAccessKey: secretKey,                                                                                      // 61
			key: function (file, metaContext) {                                                                                 // 62
				var path = RocketChat.hostname + '/' + metaContext.rid + '/' + this.userId + '/';                                  // 63
                                                                                                                       //
				var upload = {                                                                                                     // 65
					s3: {                                                                                                             // 66
						bucket: bucket,                                                                                                  // 67
						region: region,                                                                                                  // 68
						path: path                                                                                                       // 69
					}                                                                                                                 //
				};                                                                                                                 //
				var fileId = RocketChat.models.Uploads.insertFileInit(metaContext.rid, this.userId, 's3', file, upload);           // 72
                                                                                                                       //
				return path + fileId;                                                                                              // 74
			}                                                                                                                   //
		};                                                                                                                   //
                                                                                                                       //
		if (!_.isEmpty(acl)) {                                                                                               // 78
			config.acl = acl;                                                                                                   // 79
		}                                                                                                                    //
                                                                                                                       //
		if (!_.isEmpty(cdn)) {                                                                                               // 82
			config.cdn = cdn;                                                                                                   // 83
		}                                                                                                                    //
                                                                                                                       //
		if (!_.isEmpty(region)) {                                                                                            // 86
			config.region = region;                                                                                             // 87
		}                                                                                                                    //
                                                                                                                       //
		if (!_.isEmpty(bucketUrl)) {                                                                                         // 90
			config.bucketUrl = bucketUrl;                                                                                       // 91
		}                                                                                                                    //
                                                                                                                       //
		try {                                                                                                                // 94
			Slingshot.createDirective(directiveName, Slingshot.S3Storage, config);                                              // 95
		} catch (e) {                                                                                                        //
			SystemLogger.error('Error configuring S3 ->', e.message);                                                           // 97
		}                                                                                                                    //
	} else {                                                                                                              //
		if (Slingshot._directives[directiveName]) {                                                                          // 100
			delete Slingshot._directives[directiveName];                                                                        // 101
		}                                                                                                                    //
	}                                                                                                                     //
}, 500);                                                                                                               //
                                                                                                                       //
RocketChat.settings.get('FileUpload_Storage_Type', createS3Directive);                                                 // 106
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_Bucket', createS3Directive);                                                    // 108
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_Acl', createS3Directive);                                                       // 110
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_AWSAccessKeyId', function (key, value) {                                        // 112
	S3accessKey = value;                                                                                                  // 113
	createS3Directive();                                                                                                  // 114
});                                                                                                                    //
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_AWSSecretAccessKey', function (key, value) {                                    // 117
	S3secretKey = value;                                                                                                  // 118
	createS3Directive();                                                                                                  // 119
});                                                                                                                    //
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_CDN', createS3Directive);                                                       // 122
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_Region', createS3Directive);                                                    // 124
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_BucketURL', createS3Directive);                                                 // 126
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/config/configFileUploadFileSystem.js                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals FileSystemStore:true, FileUpload, UploadFS, RocketChatFile */                                               //
                                                                                                                       //
var storeName = 'fileSystem';                                                                                          // 3
                                                                                                                       //
FileSystemStore = null;                                                                                                // 5
                                                                                                                       //
var createFileSystemStore = _.debounce(function () {                                                                   // 7
	var stores = UploadFS.getStores();                                                                                    // 8
	if (stores[storeName]) {                                                                                              // 9
		delete stores[storeName];                                                                                            // 10
	}                                                                                                                     //
	FileSystemStore = new UploadFS.store.Local({                                                                          // 12
		collection: RocketChat.models.Uploads.model,                                                                         // 13
		name: storeName,                                                                                                     // 14
		path: RocketChat.settings.get('FileUpload_FileSystemPath'), //'/tmp/uploads/photos',                                 // 15
		filter: new UploadFS.Filter({                                                                                        // 16
			onCheck: FileUpload.validateFileUpload                                                                              // 17
		}),                                                                                                                  //
		transformWrite: function (readStream, writeStream, fileId, file) {                                                   // 19
			var identify, stream;                                                                                               // 20
			if (RocketChatFile.enabled === false || !/^image\/.+/.test(file.type)) {                                            // 21
				return readStream.pipe(writeStream);                                                                               // 22
			}                                                                                                                   //
			stream = void 0;                                                                                                    // 24
			identify = function (err, data) {                                                                                   // 25
				var ref;                                                                                                           // 26
				if (err != null) {                                                                                                 // 27
					return stream.pipe(writeStream);                                                                                  // 28
				}                                                                                                                  //
				file.identify = {                                                                                                  // 30
					format: data.format,                                                                                              // 31
					size: data.size                                                                                                   // 32
				};                                                                                                                 //
				if (data.Orientation != null && ((ref = data.Orientation) !== '' && ref !== 'Unknown' && ref !== 'Undefined')) {   // 34
					return RocketChatFile.gm(stream).autoOrient().stream().pipe(writeStream);                                         // 35
				} else {                                                                                                           //
					return stream.pipe(writeStream);                                                                                  // 37
				}                                                                                                                  //
			};                                                                                                                  //
			stream = RocketChatFile.gm(readStream).identify(identify).stream();                                                 // 40
			return;                                                                                                             // 41
		}                                                                                                                    //
	});                                                                                                                   //
}, 500);                                                                                                               //
                                                                                                                       //
RocketChat.settings.get('FileUpload_FileSystemPath', createFileSystemStore);                                           // 46
                                                                                                                       //
var fs = Npm.require('fs');                                                                                            // 48
                                                                                                                       //
FileUpload.addHandler(storeName, {                                                                                     // 50
	get: function (file, req, res) {                                                                                      // 51
		var filePath = FileSystemStore.getFilePath(file._id, file);                                                          // 52
                                                                                                                       //
		try {                                                                                                                // 54
			var stat = Meteor.wrapAsync(fs.stat)(filePath);                                                                     // 55
                                                                                                                       //
			if (stat && stat.isFile()) {                                                                                        // 57
				res.setHeader('Content-Disposition', 'attachment; filename="' + encodeURIComponent(file.name) + '"');              // 58
				res.setHeader('Last-Modified', file.uploadedAt.toUTCString());                                                     // 59
				res.setHeader('Content-Type', file.type);                                                                          // 60
				res.setHeader('Content-Length', file.size);                                                                        // 61
                                                                                                                       //
				FileSystemStore.getReadStream(file._id, file).pipe(res);                                                           // 63
			}                                                                                                                   //
		} catch (e) {                                                                                                        //
			res.writeHead(404);                                                                                                 // 66
			res.end();                                                                                                          // 67
			return;                                                                                                             // 68
		}                                                                                                                    //
	},                                                                                                                    //
	'delete': function (file) {                                                                                           // 71
		return FileSystemStore['delete'](file._id);                                                                          // 72
	}                                                                                                                     //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/config/configFileUploadGridFS.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals FileUpload, UploadFS */                                                                                     //
var stream = Npm.require('stream');                                                                                    // 2
var zlib = Npm.require('zlib');                                                                                        // 3
                                                                                                                       //
// code from: https://github.com/jalik/jalik-ufs/blob/master/ufs-server.js#L91                                         //
var readFromGridFS = function (storeName, fileId, file, headers, req, res) {                                           // 6
	var store = UploadFS.getStore(storeName);                                                                             // 7
	var rs = store.getReadStream(fileId, file);                                                                           // 8
	var ws = new stream.PassThrough();                                                                                    // 9
                                                                                                                       //
	rs.on('error', function (err) {                                                                                       // 11
		store.onReadError.call(store, err, fileId, file);                                                                    // 12
		res.end();                                                                                                           // 13
	});                                                                                                                   //
	ws.on('error', function (err) {                                                                                       // 15
		store.onReadError.call(store, err, fileId, file);                                                                    // 16
		res.end();                                                                                                           // 17
	});                                                                                                                   //
	ws.on('close', function () {                                                                                          // 19
		// Close output stream at the end                                                                                    //
		ws.emit('end');                                                                                                      // 21
	});                                                                                                                   //
                                                                                                                       //
	var accept = req.headers['accept-encoding'] || '';                                                                    // 24
                                                                                                                       //
	// Transform stream                                                                                                   //
	store.transformRead(rs, ws, fileId, file, req, headers);                                                              // 27
                                                                                                                       //
	// Compress data using gzip                                                                                           //
	if (accept.match(/\bgzip\b/)) {                                                                                       // 30
		headers['Content-Encoding'] = 'gzip';                                                                                // 31
		delete headers['Content-Length'];                                                                                    // 32
		res.writeHead(200, headers);                                                                                         // 33
		ws.pipe(zlib.createGzip()).pipe(res);                                                                                // 34
	}                                                                                                                     //
	// Compress data using deflate                                                                                        //
	else if (accept.match(/\bdeflate\b/)) {                                                                               //
			headers['Content-Encoding'] = 'deflate';                                                                            // 38
			delete headers['Content-Length'];                                                                                   // 39
			res.writeHead(200, headers);                                                                                        // 40
			ws.pipe(zlib.createDeflate()).pipe(res);                                                                            // 41
		}                                                                                                                    //
		// Send raw data                                                                                                     //
		else {                                                                                                               //
				res.writeHead(200, headers);                                                                                       // 45
				ws.pipe(res);                                                                                                      // 46
			}                                                                                                                   //
};                                                                                                                     //
                                                                                                                       //
FileUpload.addHandler('rocketchat_uploads', {                                                                          // 50
	get: function (file, req, res) {                                                                                      // 51
		var headers = {                                                                                                      // 52
			'Content-Disposition': 'attachment; filename="' + encodeURIComponent(file.name) + '"',                              // 53
			'Last-Modified': file.uploadedAt.toUTCString(),                                                                     // 54
			'Content-Type': file.type,                                                                                          // 55
			'Content-Length': file.size                                                                                         // 56
		};                                                                                                                   //
		return readFromGridFS(file.store, file._id, file, headers, req, res);                                                // 58
	},                                                                                                                    //
	'delete': function (file) {                                                                                           // 60
		return Meteor.fileStore['delete'](file._id);                                                                         // 61
	}                                                                                                                     //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/methods/sendFileMessage.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'sendFileMessage': function (roomId, store, file) {                                                                   // 2
		if (!Meteor.userId()) {                                                                                              // 3
			throw new Meteor.Error(203, 'User_logged_out');                                                                     // 4
		}                                                                                                                    //
                                                                                                                       //
		var room = Meteor.call('canAccessRoom', roomId, Meteor.userId());                                                    // 7
                                                                                                                       //
		if (!room) {                                                                                                         // 9
			return false;                                                                                                       // 10
		}                                                                                                                    //
                                                                                                                       //
		RocketChat.models.Uploads.updateFileComplete(file._id, Meteor.userId(), _.omit(file, '_id'));                        // 13
                                                                                                                       //
		var fileUrl = '/file-upload/' + file._id + '/' + file.name;                                                          // 15
                                                                                                                       //
		var attachment = {                                                                                                   // 17
			title: 'File Uploaded: ' + file.name,                                                                               // 18
			title_link: fileUrl,                                                                                                // 19
			title_link_download: true                                                                                           // 20
		};                                                                                                                   //
                                                                                                                       //
		if (/^image\/.+/.test(file.type)) {                                                                                  // 23
			attachment.image_url = fileUrl;                                                                                     // 24
			attachment.image_type = file.type;                                                                                  // 25
			attachment.image_size = file.size;                                                                                  // 26
			if (file.identify && file.identify.size) {                                                                          // 27
				attachment.image_dimensions = file.identify.size;                                                                  // 28
			}                                                                                                                   //
		} else if (/^audio\/.+/.test(file.type)) {                                                                           //
			attachment.audio_url = fileUrl;                                                                                     // 31
			attachment.audio_type = file.type;                                                                                  // 32
			attachment.audio_size = file.size;                                                                                  // 33
		} else if (/^video\/.+/.test(file.type)) {                                                                           //
			attachment.video_url = fileUrl;                                                                                     // 35
			attachment.video_type = file.type;                                                                                  // 36
			attachment.video_size = file.size;                                                                                  // 37
		}                                                                                                                    //
                                                                                                                       //
		var msg = {                                                                                                          // 40
			_id: Random.id(),                                                                                                   // 41
			rid: roomId,                                                                                                        // 42
			msg: '',                                                                                                            // 43
			file: {                                                                                                             // 44
				_id: file._id                                                                                                      // 45
			},                                                                                                                  //
			groupable: false,                                                                                                   // 47
			attachments: [attachment]                                                                                           // 48
		};                                                                                                                   //
                                                                                                                       //
		msg = Meteor.call('sendMessage', msg);                                                                               // 51
	}                                                                                                                     //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/startup/settings.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.settings.addGroup('FileUpload', function () {                                                               // 1
	this.add('FileUpload_Enabled', true, {                                                                                // 2
		type: 'boolean',                                                                                                     // 3
		'public': true                                                                                                       // 4
	});                                                                                                                   //
                                                                                                                       //
	this.add('FileUpload_MaxFileSize', 2097152, {                                                                         // 7
		type: 'int',                                                                                                         // 8
		'public': true                                                                                                       // 9
	});                                                                                                                   //
                                                                                                                       //
	this.add('FileUpload_MediaTypeWhiteList', 'image/*,audio/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', {
		type: 'string',                                                                                                      // 13
		'public': true,                                                                                                      // 14
		i18nDescription: 'FileUpload_MediaTypeWhiteListDescription'                                                          // 15
	});                                                                                                                   //
                                                                                                                       //
	this.add('FileUpload_ProtectFiles', true, {                                                                           // 18
		type: 'boolean',                                                                                                     // 19
		'public': true,                                                                                                      // 20
		i18nDescription: 'FileUpload_ProtectFilesDescription'                                                                // 21
	});                                                                                                                   //
                                                                                                                       //
	this.add('FileUpload_Storage_Type', 'GridFS', {                                                                       // 24
		type: 'select',                                                                                                      // 25
		values: [{                                                                                                           // 26
			key: 'GridFS',                                                                                                      // 27
			i18nLabel: 'GridFS'                                                                                                 // 28
		}, {                                                                                                                 //
			key: 'AmazonS3',                                                                                                    // 30
			i18nLabel: 'AmazonS3'                                                                                               // 31
		}, {                                                                                                                 //
			key: 'FileSystem',                                                                                                  // 33
			i18nLabel: 'FileSystem'                                                                                             // 34
		}],                                                                                                                  //
		'public': true                                                                                                       // 36
	});                                                                                                                   //
                                                                                                                       //
	this.section('Amazon S3', function () {                                                                               // 39
		this.add('FileUpload_S3_Bucket', '', {                                                                               // 40
			type: 'string',                                                                                                     // 41
			enableQuery: {                                                                                                      // 42
				_id: 'FileUpload_Storage_Type',                                                                                    // 43
				value: 'AmazonS3'                                                                                                  // 44
			}                                                                                                                   //
		});                                                                                                                  //
		this.add('FileUpload_S3_Acl', '', {                                                                                  // 47
			type: 'string',                                                                                                     // 48
			enableQuery: {                                                                                                      // 49
				_id: 'FileUpload_Storage_Type',                                                                                    // 50
				value: 'AmazonS3'                                                                                                  // 51
			}                                                                                                                   //
		});                                                                                                                  //
		this.add('FileUpload_S3_AWSAccessKeyId', '', {                                                                       // 54
			type: 'string',                                                                                                     // 55
			enableQuery: {                                                                                                      // 56
				_id: 'FileUpload_Storage_Type',                                                                                    // 57
				value: 'AmazonS3'                                                                                                  // 58
			}                                                                                                                   //
		});                                                                                                                  //
		this.add('FileUpload_S3_AWSSecretAccessKey', '', {                                                                   // 61
			type: 'string',                                                                                                     // 62
			enableQuery: {                                                                                                      // 63
				_id: 'FileUpload_Storage_Type',                                                                                    // 64
				value: 'AmazonS3'                                                                                                  // 65
			}                                                                                                                   //
		});                                                                                                                  //
		this.add('FileUpload_S3_CDN', '', {                                                                                  // 68
			type: 'string',                                                                                                     // 69
			enableQuery: {                                                                                                      // 70
				_id: 'FileUpload_Storage_Type',                                                                                    // 71
				value: 'AmazonS3'                                                                                                  // 72
			}                                                                                                                   //
		});                                                                                                                  //
		this.add('FileUpload_S3_Region', '', {                                                                               // 75
			type: 'string',                                                                                                     // 76
			enableQuery: {                                                                                                      // 77
				_id: 'FileUpload_Storage_Type',                                                                                    // 78
				value: 'AmazonS3'                                                                                                  // 79
			}                                                                                                                   //
		});                                                                                                                  //
		this.add('FileUpload_S3_BucketURL', '', {                                                                            // 82
			type: 'string',                                                                                                     // 83
			enableQuery: {                                                                                                      // 84
				_id: 'FileUpload_Storage_Type',                                                                                    // 85
				value: 'AmazonS3'                                                                                                  // 86
			},                                                                                                                  //
			i18nDescription: 'Override_URL_to_which_files_are_uploaded_This_url_also_used_for_downloads_unless_a_CDN_is_given.'
		});                                                                                                                  //
	});                                                                                                                   //
                                                                                                                       //
	this.section('File System', function () {                                                                             // 92
		this.add('FileUpload_FileSystemPath', '', {                                                                          // 93
			type: 'string',                                                                                                     // 94
			enableQuery: {                                                                                                      // 95
				_id: 'FileUpload_Storage_Type',                                                                                    // 96
				value: 'FileSystem'                                                                                                // 97
			}                                                                                                                   //
		});                                                                                                                  //
	});                                                                                                                   //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:file-upload'] = {
  fileUploadHandler: fileUploadHandler,
  FileUpload: FileUpload
};

})();

//# sourceMappingURL=rocketchat_file-upload.js.map
