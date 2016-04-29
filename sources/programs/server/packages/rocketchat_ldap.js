(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var LDAPJS = Package['rocketchat:ldapjs'].LDAPJS;
var Logger = Package['rocketchat:logger'].Logger;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var slugify = Package['yasaricli:slugify'].slugify;
var ECMAScript = Package.ecmascript.ECMAScript;
var SHA256 = Package.sha.SHA256;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var LDAP, slug, getLdapUsername, getLdapUserUniqueID, getDataToSyncUserData, syncUserData, sync;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_ldap/server/ldap.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals LDAP:true, LDAPJS */                                                                                        //
/* exported LDAP */                                                                                                    //
                                                                                                                       //
var ldapjs = LDAPJS;                                                                                                   // 4
                                                                                                                       //
var logger = new Logger('LDAP', {                                                                                      // 6
	sections: {                                                                                                           // 7
		connection: 'Connection',                                                                                            // 8
		bind: 'Bind',                                                                                                        // 9
		search: 'Search',                                                                                                    // 10
		auth: 'Auth'                                                                                                         // 11
	}                                                                                                                     //
});                                                                                                                    //
                                                                                                                       //
LDAP = (function () {                                                                                                  // 15
	function LDAP() {                                                                                                     // 16
		babelHelpers.classCallCheck(this, LDAP);                                                                             //
                                                                                                                       //
		var self = this;                                                                                                     // 17
                                                                                                                       //
		self.ldapjs = ldapjs;                                                                                                // 19
                                                                                                                       //
		self.connected = false;                                                                                              // 21
                                                                                                                       //
		self.options = {                                                                                                     // 23
			host: RocketChat.settings.get('LDAP_Host'),                                                                         // 24
			port: RocketChat.settings.get('LDAP_Port'),                                                                         // 25
			encryption: RocketChat.settings.get('LDAP_Encryption'),                                                             // 26
			ca_cert: RocketChat.settings.get('LDAP_CA_Cert'),                                                                   // 27
			reject_unauthorized: RocketChat.settings.get('LDAP_Reject_Unauthorized') || false,                                  // 28
			domain_base: RocketChat.settings.get('LDAP_Domain_Base'),                                                           // 29
			use_custom_domain_search: RocketChat.settings.get('LDAP_Use_Custom_Domain_Search'),                                 // 30
			custom_domain_search: RocketChat.settings.get('LDAP_Custom_Domain_Search'),                                         // 31
			domain_search_user: RocketChat.settings.get('LDAP_Domain_Search_User'),                                             // 32
			domain_search_password: RocketChat.settings.get('LDAP_Domain_Search_Password'),                                     // 33
			domain_search_filter: RocketChat.settings.get('LDAP_Domain_Search_Filter'),                                         // 34
			domain_search_user_id: RocketChat.settings.get('LDAP_Domain_Search_User_ID'),                                       // 35
			domain_search_object_class: RocketChat.settings.get('LDAP_Domain_Search_Object_Class'),                             // 36
			domain_search_object_category: RocketChat.settings.get('LDAP_Domain_Search_Object_Category')                        // 37
		};                                                                                                                   //
                                                                                                                       //
		self.connectSync = Meteor.wrapAsync(self.connectAsync, self);                                                        // 40
		self.searchAllSync = Meteor.wrapAsync(self.searchAllAsync, self);                                                    // 41
	}                                                                                                                     //
                                                                                                                       //
	LDAP.prototype.connectAsync = (function () {                                                                          // 15
		function connectAsync(callback) {                                                                                    // 44
			var self = this;                                                                                                    // 45
                                                                                                                       //
			logger.connection.info('Init setup');                                                                               // 47
                                                                                                                       //
			var replied = false;                                                                                                // 49
                                                                                                                       //
			var connectionOptions = {                                                                                           // 51
				url: self.options.host + ':' + self.options.port,                                                                  // 52
				timeout: 1000 * 5,                                                                                                 // 53
				connectTimeout: 1000 * 10,                                                                                         // 54
				idleTimeout: 1000 * 10,                                                                                            // 55
				reconnect: false                                                                                                   // 56
			};                                                                                                                  //
                                                                                                                       //
			var tlsOptions = {                                                                                                  // 59
				rejectUnauthorized: self.options.reject_unauthorized                                                               // 60
			};                                                                                                                  //
                                                                                                                       //
			if (self.options.ca_cert && self.options.ca_cert !== '') {                                                          // 63
				// Split CA cert into array of strings                                                                             //
				var chainLines = RocketChat.settings.get('LDAP_CA_Cert').split('\n');                                              // 65
				var cert = [];                                                                                                     // 66
				var ca = [];                                                                                                       // 67
				chainLines.forEach(function (line) {                                                                               // 68
					cert.push(line);                                                                                                  // 69
					if (line.match(/-END CERTIFICATE-/)) {                                                                            // 70
						ca.push(cert.join('\n'));                                                                                        // 71
						cert = [];                                                                                                       // 72
					}                                                                                                                 //
				});                                                                                                                //
				tlsOptions.ca = ca;                                                                                                // 75
			}                                                                                                                   //
                                                                                                                       //
			if (self.options.encryption === 'ssl') {                                                                            // 78
				connectionOptions.url = 'ldaps://' + connectionOptions.url;                                                        // 79
				connectionOptions.tlsOptions = tlsOptions;                                                                         // 80
			} else {                                                                                                            //
				connectionOptions.url = 'ldap://' + connectionOptions.url;                                                         // 82
			}                                                                                                                   //
                                                                                                                       //
			logger.connection.info('Connecting', connectionOptions.url);                                                        // 85
			logger.connection.debug('connectionOptions', connectionOptions);                                                    // 86
                                                                                                                       //
			self.client = ldapjs.createClient(connectionOptions);                                                               // 88
                                                                                                                       //
			self.bindSync = Meteor.wrapAsync(self.client.bind, self.client);                                                    // 90
                                                                                                                       //
			self.client.on('error', function (error) {                                                                          // 92
				logger.connection.error('connection', error);                                                                      // 93
				if (replied === false) {                                                                                           // 94
					replied = true;                                                                                                   // 95
					callback(error, null);                                                                                            // 96
				}                                                                                                                  //
			});                                                                                                                 //
                                                                                                                       //
			if (self.options.encryption === 'tls') {                                                                            // 100
                                                                                                                       //
				// Set host parameter for tls.connect which is used by ldapjs starttls. This shouldn't be needed in newer nodejs versions (e.g v5.6.0).
				// https://github.com/RocketChat/Rocket.Chat/issues/2035                                                           //
				// https://github.com/mcavage/node-ldapjs/issues/349                                                               //
				tlsOptions.host = [self.options.host];                                                                             // 105
                                                                                                                       //
				logger.connection.info('Starting TLS');                                                                            // 107
				logger.connection.debug('tlsOptions', tlsOptions);                                                                 // 108
                                                                                                                       //
				self.client.starttls(tlsOptions, null, function (error, response) {                                                // 110
					if (error) {                                                                                                      // 111
						logger.connection.error('TLS connection', error);                                                                // 112
						if (replied === false) {                                                                                         // 113
							replied = true;                                                                                                 // 114
							callback(error, null);                                                                                          // 115
						}                                                                                                                //
						return;                                                                                                          // 117
					}                                                                                                                 //
                                                                                                                       //
					logger.connection.info('TLS connected');                                                                          // 120
					self.connected = true;                                                                                            // 121
					if (replied === false) {                                                                                          // 122
						replied = true;                                                                                                  // 123
						callback(null, response);                                                                                        // 124
					}                                                                                                                 //
				});                                                                                                                //
			} else {                                                                                                            //
				self.client.on('connect', function (response) {                                                                    // 128
					logger.connection.info('LDAP connected');                                                                         // 129
					self.connected = true;                                                                                            // 130
					if (replied === false) {                                                                                          // 131
						replied = true;                                                                                                  // 132
						callback(null, response);                                                                                        // 133
					}                                                                                                                 //
				});                                                                                                                //
			}                                                                                                                   //
                                                                                                                       //
			setTimeout(function () {                                                                                            // 138
				if (replied === false) {                                                                                           // 139
					logger.connection.error('connection time out', connectionOptions.timeout);                                        // 140
					replied = true;                                                                                                   // 141
					callback(new Error('Timeout'));                                                                                   // 142
				}                                                                                                                  //
			}, connectionOptions.timeout);                                                                                      //
		}                                                                                                                    //
                                                                                                                       //
		return connectAsync;                                                                                                 //
	})();                                                                                                                 //
                                                                                                                       //
	LDAP.prototype.getDomainBindSearch = (function () {                                                                   // 15
		function getDomainBindSearch() {                                                                                     // 147
			var self = this;                                                                                                    // 148
                                                                                                                       //
			if (self.options.use_custom_domain_search === true) {                                                               // 150
				var custom_domain_search = undefined;                                                                              // 151
				try {                                                                                                              // 152
					custom_domain_search = JSON.parse(self.options.custom_domain_search);                                             // 153
				} catch (error) {                                                                                                  //
					throw new Error('Invalid Custom Domain Search JSON');                                                             // 155
				}                                                                                                                  //
                                                                                                                       //
				return {                                                                                                           // 158
					filter: custom_domain_search.filter,                                                                              // 159
					domain_search_user: custom_domain_search.userDN || '',                                                            // 160
					domain_search_password: custom_domain_search.password || ''                                                       // 161
				};                                                                                                                 //
			}                                                                                                                   //
                                                                                                                       //
			var filter = ['(&'];                                                                                                // 165
                                                                                                                       //
			if (self.options.domain_search_object_category !== '') {                                                            // 167
				filter.push('(objectCategory=' + self.options.domain_search_object_category + ')');                                // 168
			}                                                                                                                   //
                                                                                                                       //
			if (self.options.domain_search_object_class !== '') {                                                               // 171
				filter.push('(objectclass=' + self.options.domain_search_object_class + ')');                                      // 172
			}                                                                                                                   //
                                                                                                                       //
			if (self.options.domain_search_filter !== '') {                                                                     // 175
				filter.push('(' + self.options.domain_search_filter + ')');                                                        // 176
			}                                                                                                                   //
                                                                                                                       //
			var domain_search_user_id = self.options.domain_search_user_id.split(',');                                          // 179
			if (domain_search_user_id.length === 1) {                                                                           // 180
				filter.push('(' + domain_search_user_id[0] + '=#{username})');                                                     // 181
			} else {                                                                                                            //
				filter.push('(|');                                                                                                 // 183
				domain_search_user_id.forEach(function (item) {                                                                    // 184
					filter.push('(' + item + '=#{username})');                                                                        // 185
				});                                                                                                                //
				filter.push(')');                                                                                                  // 187
			}                                                                                                                   //
                                                                                                                       //
			filter.push(')');                                                                                                   // 190
                                                                                                                       //
			return {                                                                                                            // 192
				filter: filter.join(''),                                                                                           // 193
				domain_search_user: self.options.domain_search_user || '',                                                         // 194
				domain_search_password: self.options.domain_search_password || ''                                                  // 195
			};                                                                                                                  //
		}                                                                                                                    //
                                                                                                                       //
		return getDomainBindSearch;                                                                                          //
	})();                                                                                                                 //
                                                                                                                       //
	LDAP.prototype.bindIfNecessary = (function () {                                                                       // 15
		function bindIfNecessary() {                                                                                         // 199
			var self = this;                                                                                                    // 200
                                                                                                                       //
			if (self.domainBinded === true) {                                                                                   // 202
				return;                                                                                                            // 203
			}                                                                                                                   //
                                                                                                                       //
			var domain_search = self.getDomainBindSearch();                                                                     // 206
                                                                                                                       //
			if (domain_search.domain_search_user !== '' && domain_search.domain_search_password !== '') {                       // 208
				logger.bind.info('Binding admin user', domain_search.domain_search_user);                                          // 209
				self.bindSync(domain_search.domain_search_user, domain_search.domain_search_password);                             // 210
				self.domainBinded = true;                                                                                          // 211
			}                                                                                                                   //
		}                                                                                                                    //
                                                                                                                       //
		return bindIfNecessary;                                                                                              //
	})();                                                                                                                 //
                                                                                                                       //
	LDAP.prototype.searchUsersSync = (function () {                                                                       // 15
		function searchUsersSync(username) {                                                                                 // 215
			var self = this;                                                                                                    // 216
                                                                                                                       //
			self.bindIfNecessary();                                                                                             // 218
                                                                                                                       //
			var domain_search = self.getDomainBindSearch();                                                                     // 220
                                                                                                                       //
			var searchOptions = {                                                                                               // 222
				filter: domain_search.filter.replace(/#{username}/g, username),                                                    // 223
				scope: 'sub'                                                                                                       // 224
			};                                                                                                                  //
                                                                                                                       //
			logger.search.info('Searching user', username);                                                                     // 227
			logger.search.debug('searchOptions', searchOptions);                                                                // 228
			logger.search.debug('domain_base', self.options.domain_base);                                                       // 229
                                                                                                                       //
			return self.searchAllSync(self.options.domain_base, searchOptions);                                                 // 231
		}                                                                                                                    //
                                                                                                                       //
		return searchUsersSync;                                                                                              //
	})();                                                                                                                 //
                                                                                                                       //
	LDAP.prototype.getUserByIdSync = (function () {                                                                       // 15
		function getUserByIdSync(id, attribute) {                                                                            // 234
			var self = this;                                                                                                    // 235
                                                                                                                       //
			self.bindIfNecessary();                                                                                             // 237
                                                                                                                       //
			var Unique_Identifier_Field = RocketChat.settings.get('LDAP_Unique_Identifier_Field').split(',');                   // 239
                                                                                                                       //
			var filter = undefined;                                                                                             // 241
                                                                                                                       //
			if (attribute) {                                                                                                    // 243
				filter = new self.ldapjs.filters.EqualityFilter({                                                                  // 244
					attribute: attribute,                                                                                             // 245
					value: new Buffer(id, 'hex')                                                                                      // 246
				});                                                                                                                //
			} else {                                                                                                            //
				(function () {                                                                                                     //
					var filters = [];                                                                                                 // 249
					Unique_Identifier_Field.forEach(function (item) {                                                                 // 250
						filters.push(new self.ldapjs.filters.EqualityFilter({                                                            // 251
							attribute: item,                                                                                                // 252
							value: new Buffer(id, 'hex')                                                                                    // 253
						}));                                                                                                             //
					});                                                                                                               //
                                                                                                                       //
					filter = new self.ldapjs.filters.OrFilter({ filters: filters });                                                  // 257
				})();                                                                                                              //
			}                                                                                                                   //
                                                                                                                       //
			var searchOptions = {                                                                                               // 260
				filter: filter,                                                                                                    // 261
				scope: 'sub'                                                                                                       // 262
			};                                                                                                                  //
                                                                                                                       //
			logger.search.info('Searching by id', id);                                                                          // 265
			logger.search.debug('search filter', searchOptions.filter.toString());                                              // 266
			logger.search.debug('domain_base', self.options.domain_base);                                                       // 267
                                                                                                                       //
			var result = self.searchAllSync(self.options.domain_base, searchOptions);                                           // 269
                                                                                                                       //
			if (!Array.isArray(result) || result.length === 0) {                                                                // 271
				return;                                                                                                            // 272
			}                                                                                                                   //
                                                                                                                       //
			if (result.length > 1) {                                                                                            // 275
				logger.search.error('Search by id', id, 'returned', result.length, 'records');                                     // 276
			}                                                                                                                   //
                                                                                                                       //
			return result[0];                                                                                                   // 279
		}                                                                                                                    //
                                                                                                                       //
		return getUserByIdSync;                                                                                              //
	})();                                                                                                                 //
                                                                                                                       //
	LDAP.prototype.getUserByUsernameSync = (function () {                                                                 // 15
		function getUserByUsernameSync(username) {                                                                           // 282
			var self = this;                                                                                                    // 283
                                                                                                                       //
			self.bindIfNecessary();                                                                                             // 285
                                                                                                                       //
			var domain_search = self.getDomainBindSearch();                                                                     // 287
                                                                                                                       //
			var searchOptions = {                                                                                               // 289
				filter: domain_search.filter.replace(/#{username}/g, username),                                                    // 290
				scope: 'sub'                                                                                                       // 291
			};                                                                                                                  //
                                                                                                                       //
			logger.search.info('Searching user', username);                                                                     // 294
			logger.search.debug('searchOptions', searchOptions);                                                                // 295
			logger.search.debug('domain_base', self.options.domain_base);                                                       // 296
                                                                                                                       //
			var result = self.searchAllSync(self.options.domain_base, searchOptions);                                           // 298
                                                                                                                       //
			if (!Array.isArray(result) || result.length === 0) {                                                                // 300
				return;                                                                                                            // 301
			}                                                                                                                   //
                                                                                                                       //
			if (result.length > 1) {                                                                                            // 304
				logger.search.error('Search by username', username, 'returned', result.length, 'records');                         // 305
			}                                                                                                                   //
                                                                                                                       //
			return result[0];                                                                                                   // 308
		}                                                                                                                    //
                                                                                                                       //
		return getUserByUsernameSync;                                                                                        //
	})();                                                                                                                 //
                                                                                                                       //
	LDAP.prototype.searchAllAsync = (function () {                                                                        // 15
		function searchAllAsync(domain_base, options, callback) {                                                            // 311
			var self = this;                                                                                                    // 312
                                                                                                                       //
			self.client.search(domain_base, options, function (error, res) {                                                    // 314
				if (error) {                                                                                                       // 315
					logger.search.error(error);                                                                                       // 316
					callback(error);                                                                                                  // 317
					return;                                                                                                           // 318
				}                                                                                                                  //
                                                                                                                       //
				res.on('error', function (error) {                                                                                 // 321
					logger.search.error(error);                                                                                       // 322
					callback(error);                                                                                                  // 323
					return;                                                                                                           // 324
				});                                                                                                                //
                                                                                                                       //
				var entries = [];                                                                                                  // 327
				var jsonEntries = [];                                                                                              // 328
                                                                                                                       //
				res.on('searchEntry', function (entry) {                                                                           // 330
					entries.push(entry);                                                                                              // 331
					jsonEntries.push(entry.json);                                                                                     // 332
				});                                                                                                                //
                                                                                                                       //
				res.on('end', function () /*result*/{                                                                              // 335
					logger.search.info('Search result count', entries.length);                                                        // 336
					logger.search.debug('Search result', JSON.stringify(jsonEntries, null, 2));                                       // 337
					callback(null, entries);                                                                                          // 338
				});                                                                                                                //
			});                                                                                                                 //
		}                                                                                                                    //
                                                                                                                       //
		return searchAllAsync;                                                                                               //
	})();                                                                                                                 //
                                                                                                                       //
	LDAP.prototype.authSync = (function () {                                                                              // 15
		function authSync(dn, password) {                                                                                    // 343
			var self = this;                                                                                                    // 344
                                                                                                                       //
			logger.auth.info('Authenticating', dn);                                                                             // 346
                                                                                                                       //
			try {                                                                                                               // 348
				self.bindSync(dn, password);                                                                                       // 349
				logger.auth.info('Authenticated', dn);                                                                             // 350
				return true;                                                                                                       // 351
			} catch (error) {                                                                                                   //
				logger.auth.info('Not authenticated', dn);                                                                         // 353
				logger.auth.debug('error', error);                                                                                 // 354
				return false;                                                                                                      // 355
			}                                                                                                                   //
		}                                                                                                                    //
                                                                                                                       //
		return authSync;                                                                                                     //
	})();                                                                                                                 //
                                                                                                                       //
	LDAP.prototype.disconnect = (function () {                                                                            // 15
		function disconnect() {                                                                                              // 359
			var self = this;                                                                                                    // 360
                                                                                                                       //
			self.connected = false;                                                                                             // 362
			logger.connection.info('Disconecting');                                                                             // 363
			self.client.unbind();                                                                                               // 364
		}                                                                                                                    //
                                                                                                                       //
		return disconnect;                                                                                                   //
	})();                                                                                                                 //
                                                                                                                       //
	return LDAP;                                                                                                          //
})();                                                                                                                  //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_ldap/server/sync.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals slug:true, slugify, LDAP, getLdapUsername:true, getLdapUserUniqueID:true, getDataToSyncUserData:true, syncUserData:true, sync:true  */
                                                                                                                       //
var logger = new Logger('LDAPSync', {});                                                                               // 3
                                                                                                                       //
slug = (function () {                                                                                                  // 5
	function slug(text) {                                                                                                 // 5
		if (RocketChat.settings.get('UTF8_Names_Slugify') !== true) {                                                        // 6
			return text;                                                                                                        // 7
		}                                                                                                                    //
		text = slugify(text, '.');                                                                                           // 9
		return text.replace(/[^0-9a-z-_.]/g, '');                                                                            // 10
	}                                                                                                                     //
                                                                                                                       //
	return slug;                                                                                                          //
})();                                                                                                                  //
                                                                                                                       //
getLdapUsername = (function () {                                                                                       // 14
	function getLdapUsername(ldapUser) {                                                                                  // 14
		var usernameField = RocketChat.settings.get('LDAP_Username_Field');                                                  // 15
                                                                                                                       //
		if (usernameField.indexOf('#{') > -1) {                                                                              // 17
			return usernameField.replace(/#{(.+?)}/g, function (match, field) {                                                 // 18
				return ldapUser.object[field];                                                                                     // 19
			});                                                                                                                 //
		}                                                                                                                    //
                                                                                                                       //
		return ldapUser.object[usernameField];                                                                               // 23
	}                                                                                                                     //
                                                                                                                       //
	return getLdapUsername;                                                                                               //
})();                                                                                                                  //
                                                                                                                       //
getLdapUserUniqueID = (function () {                                                                                   // 27
	function getLdapUserUniqueID(ldapUser) {                                                                              // 27
		var Unique_Identifier_Field = RocketChat.settings.get('LDAP_Unique_Identifier_Field');                               // 28
                                                                                                                       //
		if (Unique_Identifier_Field !== '') {                                                                                // 30
			Unique_Identifier_Field = Unique_Identifier_Field.replace(/\s/g, '').split(',');                                    // 31
		} else {                                                                                                             //
			Unique_Identifier_Field = [];                                                                                       // 33
		}                                                                                                                    //
                                                                                                                       //
		var LDAP_Domain_Search_User_ID = RocketChat.settings.get('LDAP_Domain_Search_User_ID');                              // 36
                                                                                                                       //
		if (LDAP_Domain_Search_User_ID !== '') {                                                                             // 38
			LDAP_Domain_Search_User_ID = LDAP_Domain_Search_User_ID.replace(/\s/g, '').split(',');                              // 39
		} else {                                                                                                             //
			LDAP_Domain_Search_User_ID = [];                                                                                    // 41
		}                                                                                                                    //
                                                                                                                       //
		Unique_Identifier_Field = Unique_Identifier_Field.concat(LDAP_Domain_Search_User_ID);                                // 44
                                                                                                                       //
		if (Unique_Identifier_Field.length > 0) {                                                                            // 46
			Unique_Identifier_Field = Unique_Identifier_Field.find(function (field) {                                           // 47
				return !_.isEmpty(ldapUser.object[field]);                                                                         // 48
			});                                                                                                                 //
			if (Unique_Identifier_Field) {                                                                                      // 50
				Unique_Identifier_Field = {                                                                                        // 51
					attribute: Unique_Identifier_Field,                                                                               // 52
					value: ldapUser.raw[Unique_Identifier_Field].toString('hex')                                                      // 53
				};                                                                                                                 //
			}                                                                                                                   //
			return Unique_Identifier_Field;                                                                                     // 56
		}                                                                                                                    //
	}                                                                                                                     //
                                                                                                                       //
	return getLdapUserUniqueID;                                                                                           //
})();                                                                                                                  //
                                                                                                                       //
getDataToSyncUserData = (function () {                                                                                 // 61
	function getDataToSyncUserData(ldapUser, user) {                                                                      // 61
		var syncUserData = RocketChat.settings.get('LDAP_Sync_User_Data');                                                   // 62
		var syncUserDataFieldMap = RocketChat.settings.get('LDAP_Sync_User_Data_FieldMap').trim();                           // 63
                                                                                                                       //
		if (syncUserData && syncUserDataFieldMap) {                                                                          // 65
			var _ret = (function () {                                                                                           //
				var fieldMap = JSON.parse(syncUserDataFieldMap);                                                                   // 66
				var userData = {};                                                                                                 // 67
                                                                                                                       //
				var emailList = [];                                                                                                // 69
				_.map(fieldMap, function (userField, ldapField) {                                                                  // 70
					if (!ldapUser.object.hasOwnProperty(ldapField)) {                                                                 // 71
						return;                                                                                                          // 72
					}                                                                                                                 //
                                                                                                                       //
					switch (userField) {                                                                                              // 75
						case 'email':                                                                                                    // 76
							if (_.isObject(ldapUser.object[ldapField] === 'object')) {                                                      // 77
								_.map(ldapUser.object[ldapField], function (item) {                                                            // 78
									emailList.push({ address: item, verified: true });                                                            // 79
								});                                                                                                            //
							} else {                                                                                                        //
								emailList.push({ address: ldapUser.object[ldapField], verified: true });                                       // 82
							}                                                                                                               //
							break;                                                                                                          // 84
                                                                                                                       //
						case 'name':                                                                                                     // 84
							if (user.name !== ldapUser.object[ldapField]) {                                                                 // 87
								userData.name = ldapUser.object[ldapField];                                                                    // 88
							}                                                                                                               //
							break;                                                                                                          // 90
					}                                                                                                                 // 90
				});                                                                                                                //
                                                                                                                       //
				if (emailList.length > 0) {                                                                                        // 94
					if (JSON.stringify(user.emails) !== JSON.stringify(emailList)) {                                                  // 95
						userData.emails = emailList;                                                                                     // 96
					}                                                                                                                 //
				}                                                                                                                  //
                                                                                                                       //
				var uniqueId = getLdapUserUniqueID(ldapUser);                                                                      // 100
                                                                                                                       //
				if (uniqueId && (!user.services || !user.services.ldap || user.services.ldap.id !== uniqueId.value || user.services.ldap.idAttribute !== uniqueId.attribute)) {
					userData['services.ldap.id'] = uniqueId.value;                                                                    // 103
					userData['services.ldap.idAttribute'] = uniqueId.attribute;                                                       // 104
				}                                                                                                                  //
                                                                                                                       //
				if (_.size(userData)) {                                                                                            // 107
					return {                                                                                                          // 108
						v: userData                                                                                                      //
					};                                                                                                                //
				}                                                                                                                  //
			})();                                                                                                               //
                                                                                                                       //
			if (typeof _ret === 'object') return _ret.v;                                                                        //
		}                                                                                                                    //
	}                                                                                                                     //
                                                                                                                       //
	return getDataToSyncUserData;                                                                                         //
})();                                                                                                                  //
                                                                                                                       //
syncUserData = (function () {                                                                                          // 114
	function syncUserData(user, ldapUser) {                                                                               // 114
		logger.info('Syncing user data');                                                                                    // 115
		logger.debug('user', user);                                                                                          // 116
		logger.debug('ldapUser', ldapUser);                                                                                  // 117
                                                                                                                       //
		var userData = getDataToSyncUserData(ldapUser, user);                                                                // 119
		if (user && user._id && userData) {                                                                                  // 120
			Meteor.users.update(user._id, { $set: userData });                                                                  // 121
			user = Meteor.users.findOne({ _id: user._id });                                                                     // 122
			logger.debug('setting', JSON.stringify(userData, null, 2));                                                         // 123
		}                                                                                                                    //
                                                                                                                       //
		var username = slug(getLdapUsername(ldapUser));                                                                      // 126
		if (user && user._id && username !== user.username) {                                                                // 127
			logger.info('Syncing user username', user.username, '->', username);                                                // 128
			RocketChat._setUsername(user._id, username);                                                                        // 129
		}                                                                                                                    //
                                                                                                                       //
		if (user && user._id && RocketChat.settings.get('LDAP_Sync_User_Avatar') === true) {                                 // 132
			var avatar = ldapUser.raw.thumbnailPhoto || ldapUser.raw.jpegPhoto;                                                 // 133
			if (avatar) {                                                                                                       // 134
				logger.info('Syncing user avatar');                                                                                // 135
				var rs = RocketChatFile.bufferToStream(avatar);                                                                    // 136
				RocketChatFileAvatarInstance.deleteFile(encodeURIComponent(user.username + '.jpg'));                               // 137
				var ws = RocketChatFileAvatarInstance.createWriteStream(encodeURIComponent(user.username + '.jpg'), 'image/jpeg');
				ws.on('end', Meteor.bindEnvironment(function () {                                                                  // 139
					Meteor.setTimeout(function () {                                                                                   // 140
						RocketChat.models.Users.setAvatarOrigin(user._id, 'ldap');                                                       // 141
						RocketChat.Notifications.notifyAll('updateAvatar', { username: user.username });                                 // 142
					}, 500);                                                                                                          //
				}));                                                                                                               //
				rs.pipe(ws);                                                                                                       // 145
			}                                                                                                                   //
		}                                                                                                                    //
	}                                                                                                                     //
                                                                                                                       //
	return syncUserData;                                                                                                  //
})();                                                                                                                  //
                                                                                                                       //
sync = (function () {                                                                                                  // 151
	function sync() {                                                                                                     // 151
		if (RocketChat.settings.get('LDAP_Enable') !== true) {                                                               // 152
			return;                                                                                                             // 153
		}                                                                                                                    //
                                                                                                                       //
		var ldap = new LDAP();                                                                                               // 156
                                                                                                                       //
		try {                                                                                                                // 158
			ldap.connectSync();                                                                                                 // 159
                                                                                                                       //
			var users = RocketChat.models.Users.findLDAPUsers();                                                                // 161
                                                                                                                       //
			users.forEach(function (user) {                                                                                     // 163
				var ldapUser = undefined;                                                                                          // 164
                                                                                                                       //
				if (user.services && user.services.ldap && user.services.ldap.id) {                                                // 166
					ldapUser = ldap.getUserByIdSync(user.services.ldap.id, user.services.ldap.idAttribute);                           // 167
				} else {                                                                                                           //
					ldapUser = ldap.getUserByUsernameSync(user.username);                                                             // 169
				}                                                                                                                  //
                                                                                                                       //
				if (ldapUser) {                                                                                                    // 172
					syncUserData(user, ldapUser);                                                                                     // 173
				} else {                                                                                                           //
					logger.info('Can\'t sync user', user.username);                                                                   // 175
				}                                                                                                                  //
			});                                                                                                                 //
		} catch (error) {                                                                                                    //
			logger.error(error);                                                                                                // 179
			return error;                                                                                                       // 180
		}                                                                                                                    //
                                                                                                                       //
		ldap.disconnect();                                                                                                   // 183
		return true;                                                                                                         // 184
	}                                                                                                                     //
                                                                                                                       //
	return sync;                                                                                                          //
})();                                                                                                                  //
                                                                                                                       //
var interval = undefined;                                                                                              // 187
var timeout = undefined;                                                                                               // 188
                                                                                                                       //
RocketChat.settings.get('LDAP_Sync_User_Data', function (key, value) {                                                 // 190
	Meteor.clearInterval(interval);                                                                                       // 191
	Meteor.clearTimeout(timeout);                                                                                         // 192
                                                                                                                       //
	if (value === true) {                                                                                                 // 194
		logger.info('Enabling LDAP user sync');                                                                              // 195
		interval = Meteor.setInterval(sync, 1000 * 60 * 60);                                                                 // 196
		timeout = Meteor.setTimeout(function () {                                                                            // 197
			sync();                                                                                                             // 198
		}, 1000 * 30);                                                                                                       //
	} else {                                                                                                              //
		logger.info('Disabling LDAP user sync');                                                                             // 201
	}                                                                                                                     //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_ldap/server/loginHandler.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals LDAP, slug, getLdapUsername, getLdapUserUniqueID, syncUserData, getDataToSyncUserData */                    //
/* eslint new-cap: [2, {"capIsNewExceptions": ["SHA256"]}] */                                                          //
                                                                                                                       //
var logger = new Logger('LDAPHandler', {});                                                                            // 4
                                                                                                                       //
function fallbackDefaultAccountSystem(bind, username, password) {                                                      // 6
	if (typeof username === 'string') {                                                                                   // 7
		if (username.indexOf('@') === -1) {                                                                                  // 8
			username = { username: username };                                                                                  // 9
		} else {                                                                                                             //
			username = { email: username };                                                                                     // 11
		}                                                                                                                    //
	}                                                                                                                     //
                                                                                                                       //
	logger.info('Fallback to default account systen', username);                                                          // 15
                                                                                                                       //
	var loginRequest = {                                                                                                  // 17
		user: username,                                                                                                      // 18
		password: {                                                                                                          // 19
			digest: SHA256(password),                                                                                           // 20
			algorithm: 'sha-256'                                                                                                // 21
		}                                                                                                                    //
	};                                                                                                                    //
                                                                                                                       //
	return Accounts._runLoginHandlers(bind, loginRequest);                                                                // 25
}                                                                                                                      //
                                                                                                                       //
Accounts.registerLoginHandler('ldap', function (loginRequest) {                                                        // 29
	var self = this;                                                                                                      // 30
                                                                                                                       //
	if (!loginRequest.ldapOptions) {                                                                                      // 32
		return undefined;                                                                                                    // 33
	}                                                                                                                     //
                                                                                                                       //
	logger.info('Init login', loginRequest.username);                                                                     // 36
                                                                                                                       //
	if (RocketChat.settings.get('LDAP_Enable') !== true) {                                                                // 38
		return fallbackDefaultAccountSystem(self, loginRequest.username, loginRequest.ldapPass);                             // 39
	}                                                                                                                     //
                                                                                                                       //
	var ldap = new LDAP();                                                                                                // 42
	var ldapUser = undefined;                                                                                             // 43
                                                                                                                       //
	try {                                                                                                                 // 45
		ldap.connectSync();                                                                                                  // 46
		var users = ldap.searchUsersSync(loginRequest.username);                                                             // 47
                                                                                                                       //
		if (users.length !== 1) {                                                                                            // 49
			logger.info('Search returned', users.length, 'record(s) for', loginRequest.username);                               // 50
			throw new Error('User not Found');                                                                                  // 51
		}                                                                                                                    //
                                                                                                                       //
		if (ldap.authSync(users[0].dn, loginRequest.ldapPass) === true) {                                                    // 54
			ldapUser = users[0];                                                                                                // 55
		} else {                                                                                                             //
			logger.info('Wrong password for', loginRequest.username);                                                           // 57
		}                                                                                                                    //
	} catch (error) {                                                                                                     //
		logger.error(error);                                                                                                 // 60
	}                                                                                                                     //
                                                                                                                       //
	ldap.disconnect();                                                                                                    // 63
                                                                                                                       //
	if (ldapUser === undefined) {                                                                                         // 65
		return fallbackDefaultAccountSystem(self, loginRequest.username, loginRequest.ldapPass);                             // 66
	}                                                                                                                     //
                                                                                                                       //
	var username = undefined;                                                                                             // 69
                                                                                                                       //
	if (RocketChat.settings.get('LDAP_Username_Field') !== '') {                                                          // 71
		username = slug(getLdapUsername(ldapUser));                                                                          // 72
	} else {                                                                                                              //
		username = slug(loginRequest.username);                                                                              // 74
	}                                                                                                                     //
                                                                                                                       //
	// Look to see if user already exists                                                                                 //
	var userQuery = undefined;                                                                                            // 78
                                                                                                                       //
	var Unique_Identifier_Field = getLdapUserUniqueID(ldapUser);                                                          // 80
	var user = undefined;                                                                                                 // 81
                                                                                                                       //
	if (Unique_Identifier_Field) {                                                                                        // 83
		userQuery = {                                                                                                        // 84
			'services.ldap.id': Unique_Identifier_Field.value                                                                   // 85
		};                                                                                                                   //
                                                                                                                       //
		logger.info('Querying user');                                                                                        // 88
		logger.debug('userQuery', userQuery);                                                                                // 89
                                                                                                                       //
		user = Meteor.users.findOne(userQuery);                                                                              // 91
	}                                                                                                                     //
                                                                                                                       //
	if (!user) {                                                                                                          // 94
		userQuery = {                                                                                                        // 95
			username: username                                                                                                  // 96
		};                                                                                                                   //
                                                                                                                       //
		logger.debug('userQuery', userQuery);                                                                                // 99
                                                                                                                       //
		user = Meteor.users.findOne(userQuery);                                                                              // 101
	}                                                                                                                     //
                                                                                                                       //
	// Login user if they exist                                                                                           //
	if (user) {                                                                                                           // 105
		if (user.ldap !== true) {                                                                                            // 106
			logger.info('User exists without "ldap: true"');                                                                    // 107
			throw new Meteor.Error('LDAP-login-error', 'LDAP Authentication succeded, but there\'s already an existing user with provided username [' + username + '] in Mongo.');
		}                                                                                                                    //
                                                                                                                       //
		logger.info('Logging user');                                                                                         // 111
                                                                                                                       //
		var stampedToken = Accounts._generateStampedLoginToken();                                                            // 113
                                                                                                                       //
		Meteor.users.update(user._id, {                                                                                      // 115
			$push: {                                                                                                            // 116
				'services.resume.loginTokens': Accounts._hashStampedToken(stampedToken)                                            // 117
			}                                                                                                                   //
		});                                                                                                                  //
                                                                                                                       //
		syncUserData(user, ldapUser);                                                                                        // 121
		Accounts.setPassword(user._id, loginRequest.ldapPass, { logout: false });                                            // 122
		return {                                                                                                             // 123
			userId: user._id,                                                                                                   // 124
			token: stampedToken.token                                                                                           // 125
		};                                                                                                                   //
	}                                                                                                                     //
                                                                                                                       //
	logger.info('User does not exists, creating', username);                                                              // 129
	// Create new user                                                                                                    //
	var userObject = {                                                                                                    // 131
		username: username                                                                                                   // 132
	};                                                                                                                    //
                                                                                                                       //
	var userData = getDataToSyncUserData(ldapUser, {});                                                                   // 135
                                                                                                                       //
	if (userData && userData.emails) {                                                                                    // 137
		userObject.email = userData.emails[0].address;                                                                       // 138
	} else if (ldapUser.object.mail && ldapUser.object.mail.indexOf('@') > -1) {                                          //
		userObject.email = ldapUser.object.mail;                                                                             // 140
	} else if (RocketChat.settings.get('LDAP_Default_Domain') !== '') {                                                   //
		userObject.email = username + '@' + RocketChat.settings.get('LDAP_Default_Domain');                                  // 142
	} else {                                                                                                              //
		var error = new Meteor.Error('LDAP-login-error', 'LDAP Authentication succeded, there is no email to create an account. Have you tried setting your Default Domain in LDAP Settings?');
		logger.error(error);                                                                                                 // 145
		throw error;                                                                                                         // 146
	}                                                                                                                     //
                                                                                                                       //
	logger.debug('New user data', userObject);                                                                            // 149
                                                                                                                       //
	userObject.password = loginRequest.ldapPass;                                                                          // 151
                                                                                                                       //
	try {                                                                                                                 // 153
		userObject._id = Accounts.createUser(userObject);                                                                    // 154
	} catch (error) {                                                                                                     //
		logger.error('Error creating user', error);                                                                          // 156
		throw error;                                                                                                         // 157
	}                                                                                                                     //
                                                                                                                       //
	syncUserData(userObject, ldapUser);                                                                                   // 160
                                                                                                                       //
	var ldapUserService = {                                                                                               // 162
		ldap: true                                                                                                           // 163
	};                                                                                                                    //
                                                                                                                       //
	if (Unique_Identifier_Field) {                                                                                        // 166
		ldapUserService['services.ldap.idAttribute'] = Unique_Identifier_Field.attribute;                                    // 167
		ldapUserService['services.ldap.id'] = Unique_Identifier_Field.value;                                                 // 168
	}                                                                                                                     //
                                                                                                                       //
	Meteor.users.update(userObject._id, {                                                                                 // 171
		$set: ldapUserService                                                                                                // 172
	});                                                                                                                   //
                                                                                                                       //
	logger.info('Joining user to default channels');                                                                      // 175
	Meteor.runAsUser(userObject._id, function () {                                                                        // 176
		Meteor.call('joinDefaultChannels');                                                                                  // 177
	});                                                                                                                   //
                                                                                                                       //
	return {                                                                                                              // 180
		userId: userObject._id                                                                                               // 181
	};                                                                                                                    //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_ldap/server/settings.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
	RocketChat.settings.addGroup('LDAP', function () {                                                                    // 2
		var enableQuery = { _id: 'LDAP_Enable', value: true };                                                               // 3
		var enableTLSQuery = [{ _id: 'LDAP_Enable', value: true }, { _id: 'LDAP_Encryption', value: { $in: ['tls', 'ssl'] } }];
		var customBindSearchEnabledQuery = [{ _id: 'LDAP_Enable', value: true }, { _id: 'LDAP_Use_Custom_Domain_Search', value: true }];
		var customBindSearchDisabledQuery = [{ _id: 'LDAP_Enable', value: true }, { _id: 'LDAP_Use_Custom_Domain_Search', value: false }];
		var syncDataQuery = [{ _id: 'LDAP_Enable', value: true }, { _id: 'LDAP_Sync_User_Data', value: true }];              // 16
                                                                                                                       //
		this.add('LDAP_Enable', false, { type: 'boolean', 'public': true });                                                 // 21
		this.add('LDAP_Host', '', { type: 'string', enableQuery: enableQuery });                                             // 22
		this.add('LDAP_Port', '389', { type: 'string', enableQuery: enableQuery });                                          // 23
		this.add('LDAP_Encryption', 'plain', { type: 'select', values: [{ key: 'plain', i18nLabel: 'No_Encryption' }, { key: 'tls', i18nLabel: 'StartTLS' }, { key: 'ssl', i18nLabel: 'SSL/LDAPS' }], enableQuery: enableQuery });
		this.add('LDAP_CA_Cert', '', { type: 'string', multiline: true, enableQuery: enableTLSQuery });                      // 25
		this.add('LDAP_Reject_Unauthorized', true, { type: 'boolean', enableQuery: enableTLSQuery });                        // 26
		this.add('LDAP_Domain_Base', '', { type: 'string', enableQuery: enableQuery });                                      // 27
		this.add('LDAP_Use_Custom_Domain_Search', false, { type: 'boolean', enableQuery: enableQuery });                     // 28
		this.add('LDAP_Custom_Domain_Search', '', { type: 'string', enableQuery: customBindSearchEnabledQuery });            // 29
		this.add('LDAP_Domain_Search_User', '', { type: 'string', enableQuery: customBindSearchDisabledQuery });             // 30
		this.add('LDAP_Domain_Search_Password', '', { type: 'password', enableQuery: customBindSearchDisabledQuery });       // 31
		this.add('LDAP_Domain_Search_Filter', '', { type: 'string', enableQuery: customBindSearchDisabledQuery });           // 32
		this.add('LDAP_Domain_Search_User_ID', 'sAMAccountName', { type: 'string', enableQuery: customBindSearchDisabledQuery });
		this.add('LDAP_Domain_Search_Object_Class', 'user', { type: 'string', enableQuery: customBindSearchDisabledQuery });
		this.add('LDAP_Domain_Search_Object_Category', 'person', { type: 'string', enableQuery: customBindSearchDisabledQuery });
		this.add('LDAP_Username_Field', 'sAMAccountName', { type: 'string', enableQuery: enableQuery });                     // 36
		this.add('LDAP_Unique_Identifier_Field', 'objectGUID,ibm-entryUUID,GUID,dominoUNID,nsuniqueId,uidNumber', { type: 'string', enableQuery: enableQuery });
		this.add('LDAP_Sync_User_Data', false, { type: 'boolean', enableQuery: enableQuery });                               // 38
		this.add('LDAP_Sync_User_Avatar', true, { type: 'boolean', enableQuery: syncDataQuery });                            // 39
		this.add('LDAP_Sync_User_Data_FieldMap', '{"cn":"name", "mail":"email"}', { type: 'string', enableQuery: syncDataQuery });
		this.add('LDAP_Default_Domain', '', { type: 'string', enableQuery: enableQuery });                                   // 41
		this.add('LDAP_Test_Connection', 'ldap_test_connection', { type: 'action', actionText: 'Test_Connection' });         // 42
		this.add('LDAP_Sync_Users', 'ldap_sync_users', { type: 'action', actionText: 'Sync_Users' });                        // 43
	});                                                                                                                   //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_ldap/server/testConnection.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals LDAP */                                                                                                     //
                                                                                                                       //
Meteor.methods({                                                                                                       // 3
	ldap_test_connection: function () {                                                                                   // 4
		var user = Meteor.user();                                                                                            // 5
		if (!user) {                                                                                                         // 6
			throw new Meteor.Error('unauthorized', '[methods] ldap_test_connection -> Unauthorized');                           // 7
		}                                                                                                                    //
                                                                                                                       //
		if (!RocketChat.authz.hasRole(user._id, 'admin')) {                                                                  // 10
			throw new Meteor.Error('unauthorized', '[methods] ldap_test_connection -> Unauthorized');                           // 11
		}                                                                                                                    //
                                                                                                                       //
		if (RocketChat.settings.get('LDAP_Enable') !== true) {                                                               // 14
			throw new Meteor.Error('LDAP_disabled');                                                                            // 15
		}                                                                                                                    //
                                                                                                                       //
		var ldap = undefined;                                                                                                // 18
		try {                                                                                                                // 19
			ldap = new LDAP();                                                                                                  // 20
			ldap.connectSync();                                                                                                 // 21
		} catch (error) {                                                                                                    //
			console.log(error);                                                                                                 // 23
			throw new Meteor.Error(error.message);                                                                              // 24
		}                                                                                                                    //
                                                                                                                       //
		try {                                                                                                                // 27
			ldap.bindIfNecessary();                                                                                             // 28
			ldap.disconnect();                                                                                                  // 29
		} catch (error) {                                                                                                    //
			throw new Meteor.Error(error.name || error.message);                                                                // 31
		}                                                                                                                    //
                                                                                                                       //
		return {                                                                                                             // 34
			message: 'Connection_success',                                                                                      // 35
			params: []                                                                                                          // 36
		};                                                                                                                   //
	}                                                                                                                     //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_ldap/server/syncUsers.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals sync */                                                                                                     //
                                                                                                                       //
Meteor.methods({                                                                                                       // 3
	ldap_sync_users: function () {                                                                                        // 4
		var user = Meteor.user();                                                                                            // 5
		if (!user) {                                                                                                         // 6
			throw new Meteor.Error('unauthorized', '[methods] ldap_sync_users -> Unauthorized');                                // 7
		}                                                                                                                    //
                                                                                                                       //
		if (!RocketChat.authz.hasRole(user._id, 'admin')) {                                                                  // 10
			throw new Meteor.Error('unauthorized', '[methods] ldap_sync_users -> Unauthorized');                                // 11
		}                                                                                                                    //
                                                                                                                       //
		if (RocketChat.settings.get('LDAP_Enable') !== true) {                                                               // 14
			throw new Meteor.Error('LDAP_disabled');                                                                            // 15
		}                                                                                                                    //
                                                                                                                       //
		var result = sync();                                                                                                 // 18
                                                                                                                       //
		if (result === true) {                                                                                               // 20
			return {                                                                                                            // 21
				message: 'Sync_success',                                                                                           // 22
				params: []                                                                                                         // 23
			};                                                                                                                  //
		}                                                                                                                    //
                                                                                                                       //
		throw result;                                                                                                        // 27
	}                                                                                                                     //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:ldap'] = {
  LDAP: LDAP
};

})();

//# sourceMappingURL=rocketchat_ldap.js.map
