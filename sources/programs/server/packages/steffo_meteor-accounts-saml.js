(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var Accounts = Package['accounts-base'].Accounts;
var AccountsServer = Package['accounts-base'].AccountsServer;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var SAML, __coffeescriptShare;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/steffo_meteor-accounts-saml/saml_server.js                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* globals RoutePolicy, SAML */                                                                                      // 1
/* jshint newcap: false */                                                                                           // 2
                                                                                                                     // 3
if (!Accounts.saml) {                                                                                                // 4
	Accounts.saml = {                                                                                                   // 5
		settings: {                                                                                                        // 6
			debug: true,                                                                                                      // 7
			generateUsername: false,                                                                                          // 8
			providers: []                                                                                                     // 9
		}                                                                                                                  // 10
	};                                                                                                                  // 11
}                                                                                                                    // 12
                                                                                                                     // 13
var fiber = Npm.require('fibers');                                                                                   // 14
var connect = Npm.require('connect');                                                                                // 15
RoutePolicy.declare('/_saml/', 'network');                                                                           // 16
                                                                                                                     // 17
Meteor.methods({                                                                                                     // 18
	samlLogout: function (provider) {                                                                                   // 19
		// Make sure the user is logged in before initiate SAML SLO                                                        // 20
		if (!Meteor.userId()) {                                                                                            // 21
			throw new Meteor.Error('not-authorized');                                                                         // 22
		}                                                                                                                  // 23
		var samlProvider = function (element) {                                                                            // 24
			return (element.provider === provider);                                                                           // 25
		};                                                                                                                 // 26
		var providerConfig = Accounts.saml.settings.providers.filter(samlProvider)[0];                                     // 27
                                                                                                                     // 28
		if (Accounts.saml.settings.debug) {                                                                                // 29
			console.log('Logout request from ' + JSON.stringify(providerConfig));                                             // 30
		}                                                                                                                  // 31
		// This query should respect upcoming array of SAML logins                                                         // 32
		var user = Meteor.users.findOne({                                                                                  // 33
			_id: Meteor.userId(),                                                                                             // 34
			'services.saml.provider': provider                                                                                // 35
		}, {                                                                                                               // 36
			'services.saml': 1                                                                                                // 37
		});                                                                                                                // 38
		var nameID = user.services.saml.nameID;                                                                            // 39
		var sessionIndex = user.services.saml.idpSession;                                                                  // 40
		nameID = sessionIndex;                                                                                             // 41
		if (Accounts.saml.settings.debug) {                                                                                // 42
			console.log('NameID for user ' + Meteor.userId() + ' found: ' + JSON.stringify(nameID));                          // 43
		}                                                                                                                  // 44
                                                                                                                     // 45
		var _saml = new SAML(providerConfig);                                                                              // 46
                                                                                                                     // 47
		var request = _saml.generateLogoutRequest({                                                                        // 48
			nameID: nameID,                                                                                                   // 49
			sessionIndex: sessionIndex                                                                                        // 50
		});                                                                                                                // 51
                                                                                                                     // 52
		// request.request: actual XML SAML Request                                                                        // 53
		// request.id: comminucation id which will be mentioned in the ResponseTo field of SAMLResponse                    // 54
                                                                                                                     // 55
		Meteor.users.update({                                                                                              // 56
			_id: Meteor.userId()                                                                                              // 57
		}, {                                                                                                               // 58
			$set: {                                                                                                           // 59
				'services.saml.inResponseTo': request.id                                                                         // 60
			}                                                                                                                 // 61
		});                                                                                                                // 62
                                                                                                                     // 63
		var _syncRequestToUrl = Meteor.wrapAsync(_saml.requestToUrl, _saml);                                               // 64
		var result = _syncRequestToUrl(request.request, 'logout');                                                         // 65
		if (Accounts.saml.settings.debug) {                                                                                // 66
			console.log('SAML Logout Request ' + result);                                                                     // 67
		}                                                                                                                  // 68
                                                                                                                     // 69
                                                                                                                     // 70
		return result;                                                                                                     // 71
	}                                                                                                                   // 72
});                                                                                                                  // 73
                                                                                                                     // 74
Accounts.registerLoginHandler(function (loginRequest) {                                                              // 75
	if (!loginRequest.saml || !loginRequest.credentialToken) {                                                          // 76
		return undefined;                                                                                                  // 77
	}                                                                                                                   // 78
                                                                                                                     // 79
	var loginResult = Accounts.saml.retrieveCredential(loginRequest.credentialToken);                                   // 80
	if (Accounts.saml.settings.debug) {                                                                                 // 81
		console.log('RESULT :' + JSON.stringify(loginResult));                                                             // 82
	}                                                                                                                   // 83
                                                                                                                     // 84
	if (loginResult === undefined) {                                                                                    // 85
		return {                                                                                                           // 86
			type: 'saml',                                                                                                     // 87
			error: new Meteor.Error(Accounts.LoginCancelledError.numericError, 'No matching login attempt found')             // 88
		};                                                                                                                 // 89
	}                                                                                                                   // 90
                                                                                                                     // 91
	if (loginResult && loginResult.profile && loginResult.profile.email) {                                              // 92
		var user = Meteor.users.findOne({                                                                                  // 93
			'emails.address': loginResult.profile.email                                                                       // 94
		});                                                                                                                // 95
                                                                                                                     // 96
		if (!user) {                                                                                                       // 97
			var newUser = {                                                                                                   // 98
				name: loginResult.profile.cn || loginResult.profile.username,                                                    // 99
				active: true,                                                                                                    // 100
				globalRoles: ['user'],                                                                                           // 101
				emails: [{                                                                                                       // 102
					address: loginResult.profile.email,                                                                             // 103
					verified: true                                                                                                  // 104
				}]                                                                                                               // 105
			};                                                                                                                // 106
                                                                                                                     // 107
			if (Accounts.saml.settings.generateUsername === true) {                                                           // 108
				var username = RocketChat.generateUsernameSuggestion(newUser);                                                   // 109
				if (username) {                                                                                                  // 110
					newUser.username = username;                                                                                    // 111
				}                                                                                                                // 112
			}                                                                                                                 // 113
                                                                                                                     // 114
			var userId = Accounts.insertUserDoc({}, newUser);                                                                 // 115
			user = Meteor.users.findOne(userId);                                                                              // 116
		}                                                                                                                  // 117
                                                                                                                     // 118
		//creating the token and adding to the user                                                                        // 119
		var stampedToken = Accounts._generateStampedLoginToken();                                                          // 120
		Meteor.users.update(user, {                                                                                        // 121
			$push: {                                                                                                          // 122
				'services.resume.loginTokens': stampedToken                                                                      // 123
			}                                                                                                                 // 124
		});                                                                                                                // 125
                                                                                                                     // 126
		var samlLogin = {                                                                                                  // 127
			provider: Accounts.saml.RelayState,                                                                               // 128
			idp: loginResult.profile.issuer,                                                                                  // 129
			idpSession: loginResult.profile.sessionIndex,                                                                     // 130
			nameID: loginResult.profile.nameID                                                                                // 131
		};                                                                                                                 // 132
                                                                                                                     // 133
		Meteor.users.update({                                                                                              // 134
			_id: user._id                                                                                                     // 135
		}, {                                                                                                               // 136
			$set: {                                                                                                           // 137
				// TBD this should be pushed, otherwise we're only able to SSO into a single IDP at a time                       // 138
				'services.saml': samlLogin                                                                                       // 139
			}                                                                                                                 // 140
		});                                                                                                                // 141
                                                                                                                     // 142
		//sending token along with the userId                                                                              // 143
		var result = {                                                                                                     // 144
			userId: user._id,                                                                                                 // 145
			token: stampedToken.token                                                                                         // 146
		};                                                                                                                 // 147
                                                                                                                     // 148
		return result;                                                                                                     // 149
                                                                                                                     // 150
	} else {                                                                                                            // 151
		throw new Error('SAML Profile did not contain an email address');                                                  // 152
	}                                                                                                                   // 153
});                                                                                                                  // 154
                                                                                                                     // 155
Accounts.saml._loginResultForCredentialToken = {};                                                                   // 156
                                                                                                                     // 157
Accounts.saml.hasCredential = function (credentialToken) {                                                           // 158
	return _.has(Accounts.saml._loginResultForCredentialToken, credentialToken);                                        // 159
};                                                                                                                   // 160
                                                                                                                     // 161
Accounts.saml.retrieveCredential = function (credentialToken) {                                                      // 162
	// The credentialToken in all these functions corresponds to SAMLs inResponseTo field and is mandatory to check.    // 163
	var result = Accounts.saml._loginResultForCredentialToken[credentialToken];                                         // 164
	delete Accounts.saml._loginResultForCredentialToken[credentialToken];                                               // 165
	return result;                                                                                                      // 166
};                                                                                                                   // 167
                                                                                                                     // 168
var closePopup = function (res, err) {                                                                               // 169
	res.writeHead(200, {                                                                                                // 170
		'Content-Type': 'text/html'                                                                                        // 171
	});                                                                                                                 // 172
	var content = '<html><head><script>window.close()</script></head><body><H1>Verified</H1></body></html>';            // 173
	if (err) {                                                                                                          // 174
		content = '<html><body><h2>Sorry, an annoying error occured</h2><div>' + err + '</div><a onclick="window.close();">Close Window</a></body></html>';
	}                                                                                                                   // 176
	res.end(content, 'utf-8');                                                                                          // 177
};                                                                                                                   // 178
                                                                                                                     // 179
var samlUrlToObject = function (url) {                                                                               // 180
	// req.url will be '/_saml/<action>/<service name>/<credentialToken>'                                               // 181
	if (!url) {                                                                                                         // 182
		return null;                                                                                                       // 183
	}                                                                                                                   // 184
                                                                                                                     // 185
	var splitPath = url.split('/');                                                                                     // 186
                                                                                                                     // 187
	// Any non-saml request will continue down the default                                                              // 188
	// middlewares.                                                                                                     // 189
	if (splitPath[1] !== '_saml') {                                                                                     // 190
		return null;                                                                                                       // 191
	}                                                                                                                   // 192
                                                                                                                     // 193
	var result = {                                                                                                      // 194
		actionName: splitPath[2],                                                                                          // 195
		serviceName: splitPath[3],                                                                                         // 196
		credentialToken: splitPath[4]                                                                                      // 197
	};                                                                                                                  // 198
	if (Accounts.saml.settings.debug) {                                                                                 // 199
		console.log(result);                                                                                               // 200
	}                                                                                                                   // 201
	return result;                                                                                                      // 202
};                                                                                                                   // 203
                                                                                                                     // 204
var middleware = function (req, res, next) {                                                                         // 205
	// Make sure to catch any exceptions because otherwise we'd crash                                                   // 206
	// the runner                                                                                                       // 207
	try {                                                                                                               // 208
		var samlObject = samlUrlToObject(req.url);                                                                         // 209
		if (!samlObject || !samlObject.serviceName) {                                                                      // 210
			next();                                                                                                           // 211
			return;                                                                                                           // 212
		}                                                                                                                  // 213
                                                                                                                     // 214
		if (!samlObject.actionName) {                                                                                      // 215
			throw new Error('Missing SAML action');                                                                           // 216
		}                                                                                                                  // 217
                                                                                                                     // 218
		console.log(Accounts.saml.settings.providers);                                                                     // 219
		console.log(samlObject.serviceName);                                                                               // 220
		var service = _.find(Accounts.saml.settings.providers, function (samlSetting) {                                    // 221
			return samlSetting.provider === samlObject.serviceName;                                                           // 222
		});                                                                                                                // 223
                                                                                                                     // 224
		// Skip everything if there's no service set by the saml middleware                                                // 225
		if (!service) {                                                                                                    // 226
			throw new Error('Unexpected SAML service ' + samlObject.serviceName);                                             // 227
		}                                                                                                                  // 228
		var _saml;                                                                                                         // 229
		switch (samlObject.actionName) {                                                                                   // 230
		case 'metadata':                                                                                                   // 231
			_saml = new SAML(service);                                                                                        // 232
			service.callbackUrl = Meteor.absoluteUrl('_saml/validate/' + service.provider);                                   // 233
			res.writeHead(200);                                                                                               // 234
			res.write(_saml.generateServiceProviderMetadata(service.callbackUrl));                                            // 235
			res.end();                                                                                                        // 236
			//closePopup(res);                                                                                                // 237
			break;                                                                                                            // 238
		case 'logout':                                                                                                     // 239
			// This is where we receive SAML LogoutResponse                                                                   // 240
			_saml = new SAML(service);                                                                                        // 241
			_saml.validateLogoutResponse(req.query.SAMLResponse, function (err, result) {                                     // 242
				if (!err) {                                                                                                      // 243
					var logOutUser = function (inResponseTo) {                                                                      // 244
						if (Accounts.saml.settings.debug) {                                                                            // 245
						console.log('Logging Out user via inResponseTo ' + inResponseTo);                                              // 246
						}                                                                                                              // 247
						var loggedOutUser = Meteor.users.find({                                                                        // 248
							'services.saml.inResponseTo': inResponseTo                                                                    // 249
						}).fetch();                                                                                                    // 250
						if (loggedOutUser.length === 1) {                                                                              // 251
							if (Accounts.saml.settings.debug) {                                                                           // 252
							console.log('Found user ' + loggedOutUser[0]._id);                                                            // 253
							}                                                                                                             // 254
							Meteor.users.update({                                                                                         // 255
								_id: loggedOutUser[0]._id                                                                                    // 256
							}, {                                                                                                          // 257
								$set: {                                                                                                      // 258
									'services.resume.loginTokens': []                                                                           // 259
								}                                                                                                            // 260
							});                                                                                                           // 261
							Meteor.users.update({                                                                                         // 262
								_id: loggedOutUser[0]._id                                                                                    // 263
							}, {                                                                                                          // 264
								$unset: {                                                                                                    // 265
									'services.saml': ''                                                                                         // 266
								}                                                                                                            // 267
							});                                                                                                           // 268
						} else {                                                                                                       // 269
							throw new Meteor.Error('Found multiple users matching SAML inResponseTo fields');                             // 270
						}                                                                                                              // 271
					};                                                                                                              // 272
                                                                                                                     // 273
					fiber(function () {                                                                                             // 274
						logOutUser(result);                                                                                            // 275
					}).run();                                                                                                       // 276
                                                                                                                     // 277
                                                                                                                     // 278
					res.writeHead(302, {                                                                                            // 279
						'Location': req.query.RelayState                                                                               // 280
					});                                                                                                             // 281
					res.end();                                                                                                      // 282
				}                                                                                                                // 283
				//  else {                                                                                                       // 284
				// 	// TBD thinking of sth meaning full.                                                                         // 285
				// }                                                                                                             // 286
			});                                                                                                               // 287
			break;                                                                                                            // 288
		case 'sloRedirect':                                                                                                // 289
			var idpLogout = req.query.redirect;                                                                               // 290
			res.writeHead(302, {                                                                                              // 291
				// credentialToken here is the SAML LogOut Request that we'll send back to IDP                                   // 292
				'Location': idpLogout                                                                                            // 293
			});                                                                                                               // 294
			res.end();                                                                                                        // 295
			break;                                                                                                            // 296
		case 'authorize':                                                                                                  // 297
			service.callbackUrl = Meteor.absoluteUrl('_saml/validate/' + service.provider);                                   // 298
			service.id = samlObject.credentialToken;                                                                          // 299
			_saml = new SAML(service);                                                                                        // 300
			_saml.getAuthorizeUrl(req, function (err, url) {                                                                  // 301
				if (err) {                                                                                                       // 302
					throw new Error('Unable to generate authorize url');                                                            // 303
				}                                                                                                                // 304
				res.writeHead(302, {                                                                                             // 305
					'Location': url                                                                                                 // 306
				});                                                                                                              // 307
				res.end();                                                                                                       // 308
			});                                                                                                               // 309
			break;                                                                                                            // 310
		case 'validate':                                                                                                   // 311
			_saml = new SAML(service);                                                                                        // 312
			Accounts.saml.RelayState = req.body.RelayState;                                                                   // 313
			_saml.validateResponse(req.body.SAMLResponse, req.body.RelayState, function (err, profile/*, loggedOut*/) {       // 314
				if (err) {                                                                                                       // 315
					throw new Error('Unable to validate response url: ' + err);                                                     // 316
				}                                                                                                                // 317
                                                                                                                     // 318
				var credentialToken = profile.inResponseToId || profile.InResponseTo || samlObject.credentialToken;              // 319
				if (!credentialToken) {                                                                                          // 320
					throw new Error('Unable to determine credentialToken');                                                         // 321
				}                                                                                                                // 322
				Accounts.saml._loginResultForCredentialToken[credentialToken] = {                                                // 323
					profile: profile                                                                                                // 324
				};                                                                                                               // 325
				closePopup(res);                                                                                                 // 326
			});                                                                                                               // 327
			break;                                                                                                            // 328
		default:                                                                                                           // 329
			throw new Error('Unexpected SAML action ' + samlObject.actionName);                                               // 330
                                                                                                                     // 331
		}                                                                                                                  // 332
	} catch (err) {                                                                                                     // 333
		closePopup(res, err);                                                                                              // 334
	}                                                                                                                   // 335
};                                                                                                                   // 336
                                                                                                                     // 337
// Listen to incoming SAML http requests                                                                             // 338
WebApp.connectHandlers.use(connect.bodyParser()).use(function (req, res, next) {                                     // 339
	// Need to create a fiber since we're using synchronous http calls and nothing                                      // 340
	// else is wrapping this in a fiber automatically                                                                   // 341
	fiber(function () {                                                                                                 // 342
		middleware(req, res, next);                                                                                        // 343
	}).run();                                                                                                           // 344
});                                                                                                                  // 345
                                                                                                                     // 346
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/steffo_meteor-accounts-saml/saml_utils.js                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* globals SAML:true */                                                                                              // 1
                                                                                                                     // 2
var zlib = Npm.require('zlib');                                                                                      // 3
var xml2js = Npm.require('xml2js');                                                                                  // 4
var xmlCrypto = Npm.require('xml-crypto');                                                                           // 5
var crypto = Npm.require('crypto');                                                                                  // 6
var xmldom = Npm.require('xmldom');                                                                                  // 7
var querystring = Npm.require('querystring');                                                                        // 8
var xmlbuilder = Npm.require('xmlbuilder');                                                                          // 9
// var xmlenc = Npm.require('xml-encryption');                                                                       // 10
// var xpath = xmlCrypto.xpath;                                                                                      // 11
// var Dom = xmldom.DOMParser;                                                                                       // 12
                                                                                                                     // 13
// var prefixMatch = new RegExp(/(?!xmlns)^.*:/);                                                                    // 14
                                                                                                                     // 15
                                                                                                                     // 16
SAML = function (options) {                                                                                          // 17
	this.options = this.initialize(options);                                                                            // 18
};                                                                                                                   // 19
                                                                                                                     // 20
// var stripPrefix = function (str) {                                                                                // 21
// 	return str.replace(prefixMatch, '');                                                                             // 22
// };                                                                                                                // 23
                                                                                                                     // 24
SAML.prototype.initialize = function (options) {                                                                     // 25
	if (!options) {                                                                                                     // 26
		options = {};                                                                                                      // 27
	}                                                                                                                   // 28
                                                                                                                     // 29
	if (!options.protocol) {                                                                                            // 30
		options.protocol = 'https://';                                                                                     // 31
	}                                                                                                                   // 32
                                                                                                                     // 33
	if (!options.path) {                                                                                                // 34
		options.path = '/saml/consume';                                                                                    // 35
	}                                                                                                                   // 36
                                                                                                                     // 37
	if (!options.issuer) {                                                                                              // 38
		options.issuer = 'onelogin_saml';                                                                                  // 39
	}                                                                                                                   // 40
                                                                                                                     // 41
	if (options.identifierFormat === undefined) {                                                                       // 42
		options.identifierFormat = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress';                               // 43
	}                                                                                                                   // 44
                                                                                                                     // 45
	if (options.authnContext === undefined) {                                                                           // 46
		options.authnContext = 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport';                        // 47
	}                                                                                                                   // 48
                                                                                                                     // 49
	return options;                                                                                                     // 50
};                                                                                                                   // 51
                                                                                                                     // 52
SAML.prototype.generateUniqueID = function () {                                                                      // 53
	var chars = 'abcdef0123456789';                                                                                     // 54
	var uniqueID = '';                                                                                                  // 55
	for (var i = 0; i < 20; i++) {                                                                                      // 56
		uniqueID += chars.substr(Math.floor((Math.random() * 15)), 1);                                                     // 57
	}                                                                                                                   // 58
	return uniqueID;                                                                                                    // 59
};                                                                                                                   // 60
                                                                                                                     // 61
SAML.prototype.generateInstant = function () {                                                                       // 62
	return new Date().toISOString();                                                                                    // 63
};                                                                                                                   // 64
                                                                                                                     // 65
SAML.prototype.signRequest = function (xml) {                                                                        // 66
	var signer = crypto.createSign('RSA-SHA1');                                                                         // 67
	signer.update(xml);                                                                                                 // 68
	return signer.sign(this.options.privateKey, 'base64');                                                              // 69
};                                                                                                                   // 70
                                                                                                                     // 71
SAML.prototype.generateAuthorizeRequest = function (req) {                                                           // 72
	var id = '_' + this.generateUniqueID();                                                                             // 73
	var instant = this.generateInstant();                                                                               // 74
                                                                                                                     // 75
	// Post-auth destination                                                                                            // 76
	var callbackUrl;                                                                                                    // 77
	if (this.options.callbackUrl) {                                                                                     // 78
		callbackUrl = this.options.callbackUrl;                                                                            // 79
	} else {                                                                                                            // 80
		callbackUrl = this.options.protocol + req.headers.host + this.options.path;                                        // 81
	}                                                                                                                   // 82
                                                                                                                     // 83
	if (this.options.id) {                                                                                              // 84
		id = this.options.id;                                                                                              // 85
	}                                                                                                                   // 86
                                                                                                                     // 87
	var request =                                                                                                       // 88
		'<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="' + id + '" Version="2.0" IssueInstant="' + instant +
		'" ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" AssertionConsumerServiceURL="' + callbackUrl + '" Destination="' +
		this.options.entryPoint + '">' +                                                                                   // 91
		'<saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">' + this.options.issuer + '</saml:Issuer>\n';     // 92
                                                                                                                     // 93
	if (this.options.identifierFormat) {                                                                                // 94
		request += '<samlp:NameIDPolicy xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" Format="' + this.options.identifierFormat +
			'" AllowCreate="true"></samlp:NameIDPolicy>\n';                                                                   // 96
	}                                                                                                                   // 97
                                                                                                                     // 98
	request +=                                                                                                          // 99
		'<samlp:RequestedAuthnContext xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" Comparison="exact">' +            // 100
		'<saml:AuthnContextClassRef xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef></samlp:RequestedAuthnContext>\n' +
		'</samlp:AuthnRequest>';                                                                                           // 102
                                                                                                                     // 103
	return request;                                                                                                     // 104
};                                                                                                                   // 105
                                                                                                                     // 106
SAML.prototype.generateLogoutRequest = function (options) {                                                          // 107
	// options should be of the form                                                                                    // 108
	// nameId: <nameId as submitted during SAML SSO>                                                                    // 109
	// sessionIndex: sessionIndex                                                                                       // 110
	// --- NO SAMLsettings: <Meteor.setting.saml  entry for the provider you want to SLO from                           // 111
                                                                                                                     // 112
	var id = '_' + this.generateUniqueID();                                                                             // 113
	var instant = this.generateInstant();                                                                               // 114
                                                                                                                     // 115
	var request = '<samlp:LogoutRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ' +                          // 116
		'xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="' + id + '" Version="2.0" IssueInstant="' + instant +      // 117
		'" Destination="' + this.options.idpSLORedirectURL + '">' +                                                        // 118
		'<saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">' + this.options.issuer + '</saml:Issuer>' +      // 119
		'<saml:NameID Format="' + this.options.identifierFormat + '">' + options.nameID + '</saml:NameID>' +               // 120
		'</samlp:LogoutRequest>';                                                                                          // 121
                                                                                                                     // 122
	request = '<samlp:LogoutRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"  ' +                             // 123
		'ID="' + id + '" ' +                                                                                               // 124
		'Version="2.0" ' +                                                                                                 // 125
		'IssueInstant="' + instant + '" ' +                                                                                // 126
		'Destination="' + this.options.idpSLORedirectURL + '" ' +                                                          // 127
		'>' +                                                                                                              // 128
		'<saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">' + this.options.issuer + '</saml:Issuer>' +      // 129
		'<saml:NameID xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ' +                                               // 130
		'NameQualifier="http://id.init8.net:8080/openam" ' +                                                               // 131
		'SPNameQualifier="' + this.options.issuer + '" ' +                                                                 // 132
		'Format="' + this.options.identifierFormat + '">' +                                                                // 133
		options.nameID + '</saml:NameID>' +                                                                                // 134
		'<samlp:SessionIndex xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">' + options.sessionIndex + '</samlp:SessionIndex>' +
		'</samlp:LogoutRequest>';                                                                                          // 136
	if (Meteor.settings.debug) {                                                                                        // 137
		console.log('------- SAML Logout request -----------');                                                            // 138
		console.log(request);                                                                                              // 139
	}                                                                                                                   // 140
	return {                                                                                                            // 141
		request: request,                                                                                                  // 142
		id: id                                                                                                             // 143
	};                                                                                                                  // 144
};                                                                                                                   // 145
                                                                                                                     // 146
SAML.prototype.requestToUrl = function (request, operation, callback) {                                              // 147
	var self = this;                                                                                                    // 148
	zlib.deflateRaw(request, function (err, buffer) {                                                                   // 149
		if (err) {                                                                                                         // 150
			return callback(err);                                                                                             // 151
		}                                                                                                                  // 152
                                                                                                                     // 153
		var base64 = buffer.toString('base64');                                                                            // 154
		var target = self.options.entryPoint;                                                                              // 155
                                                                                                                     // 156
		if (operation === 'logout') {                                                                                      // 157
			if (self.options.idpSLORedirectURL) {                                                                             // 158
				target = self.options.idpSLORedirectURL;                                                                         // 159
			}                                                                                                                 // 160
		}                                                                                                                  // 161
                                                                                                                     // 162
		if (target.indexOf('?') > 0) {                                                                                     // 163
			target += '&';                                                                                                    // 164
		} else {                                                                                                           // 165
			target += '?';                                                                                                    // 166
		}                                                                                                                  // 167
                                                                                                                     // 168
		var samlRequest = {                                                                                                // 169
			SAMLRequest: base64                                                                                               // 170
		};                                                                                                                 // 171
                                                                                                                     // 172
		if (self.options.privateCert) {                                                                                    // 173
			samlRequest.SigAlg = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';                                                // 174
			samlRequest.Signature = self.signRequest(querystring.stringify(samlRequest));                                     // 175
		}                                                                                                                  // 176
                                                                                                                     // 177
		// TBD. We should really include a proper RelayState here                                                          // 178
		var relayState;                                                                                                    // 179
		if (operation === 'logout') {                                                                                      // 180
			// in case of logout we want to be redirected back to the Meteor app.                                             // 181
			relayState = Meteor.absoluteUrl();                                                                                // 182
		} else {                                                                                                           // 183
			relayState = self.options.provider;                                                                               // 184
		}                                                                                                                  // 185
		target += querystring.stringify(samlRequest) + '&RelayState=' + relayState;                                        // 186
                                                                                                                     // 187
		if (Meteor.settings.debug) {                                                                                       // 188
			console.log('requestToUrl: ' + target);                                                                           // 189
		}                                                                                                                  // 190
		if (operation === 'logout') {                                                                                      // 191
			// in case of logout we want to be redirected back to the Meteor app.                                             // 192
			return callback(null, target);                                                                                    // 193
                                                                                                                     // 194
		} else {                                                                                                           // 195
			callback(null, target);                                                                                           // 196
		}                                                                                                                  // 197
	});                                                                                                                 // 198
};                                                                                                                   // 199
                                                                                                                     // 200
SAML.prototype.getAuthorizeUrl = function (req, callback) {                                                          // 201
	var request = this.generateAuthorizeRequest(req);                                                                   // 202
                                                                                                                     // 203
	this.requestToUrl(request, 'authorize', callback);                                                                  // 204
};                                                                                                                   // 205
                                                                                                                     // 206
SAML.prototype.getLogoutUrl = function (req, callback) {                                                             // 207
	var request = this.generateLogoutRequest(req);                                                                      // 208
                                                                                                                     // 209
	this.requestToUrl(request, 'logout', callback);                                                                     // 210
};                                                                                                                   // 211
                                                                                                                     // 212
SAML.prototype.certToPEM = function (cert) {                                                                         // 213
	cert = cert.match(/.{1,64}/g).join('\n');                                                                           // 214
	cert = '-----BEGIN CERTIFICATE-----\n' + cert;                                                                      // 215
	cert = cert + '\n-----END CERTIFICATE-----\n';                                                                      // 216
	return cert;                                                                                                        // 217
};                                                                                                                   // 218
                                                                                                                     // 219
// function findChilds(node, localName, namespace) {                                                                 // 220
// 	var res = [];                                                                                                    // 221
// 	for (var i = 0; i < node.childNodes.length; i++) {                                                               // 222
// 		var child = node.childNodes[i];                                                                                 // 223
// 		if (child.localName === localName && (child.namespaceURI === namespace || !namespace)) {                        // 224
// 			res.push(child);                                                                                               // 225
// 		}                                                                                                               // 226
// 	}                                                                                                                // 227
// 	return res;                                                                                                      // 228
// }                                                                                                                 // 229
                                                                                                                     // 230
SAML.prototype.validateSignature = function (xml, cert) {                                                            // 231
	var self = this;                                                                                                    // 232
                                                                                                                     // 233
	var doc = new xmldom.DOMParser().parseFromString(xml);                                                              // 234
	var signature = xmlCrypto.xpath(doc, '//*[local-name(.)=\'Signature\' and namespace-uri(.)=\'http://www.w3.org/2000/09/xmldsig#\']')[0];
                                                                                                                     // 236
	var sig = new xmlCrypto.SignedXml();                                                                                // 237
                                                                                                                     // 238
	sig.keyInfoProvider = {                                                                                             // 239
		getKeyInfo: function (/*key*/) {                                                                                   // 240
			return '<X509Data></X509Data>';                                                                                   // 241
		},                                                                                                                 // 242
		getKey: function (/*keyInfo*/) {                                                                                   // 243
			return self.certToPEM(cert);                                                                                      // 244
		}                                                                                                                  // 245
	};                                                                                                                  // 246
                                                                                                                     // 247
	sig.loadSignature(signature);                                                                                       // 248
                                                                                                                     // 249
	return sig.checkSignature(xml);                                                                                     // 250
};                                                                                                                   // 251
                                                                                                                     // 252
SAML.prototype.getElement = function (parentElement, elementName) {                                                  // 253
	if (parentElement['saml:' + elementName]) {                                                                         // 254
		return parentElement['saml:' + elementName];                                                                       // 255
	} else if (parentElement['samlp:' + elementName]) {                                                                 // 256
		return parentElement['samlp:' + elementName];                                                                      // 257
	} else if (parentElement['saml2p:' + elementName]) {                                                                // 258
		return parentElement['saml2p:' + elementName];                                                                     // 259
	} else if (parentElement['saml2:' + elementName]) {                                                                 // 260
		return parentElement['saml2:' + elementName];                                                                      // 261
	}                                                                                                                   // 262
	return parentElement[elementName];                                                                                  // 263
};                                                                                                                   // 264
                                                                                                                     // 265
SAML.prototype.validateLogoutResponse = function (samlResponse, callback) {                                          // 266
	var self = this;                                                                                                    // 267
                                                                                                                     // 268
	var compressedSAMLResponse = new Buffer(samlResponse, 'base64');                                                    // 269
	zlib.inflateRaw(compressedSAMLResponse, function (err, decoded) {                                                   // 270
                                                                                                                     // 271
		if (err) {                                                                                                         // 272
			if (Meteor.settings.debug) {                                                                                      // 273
				console.log(err);                                                                                                // 274
			}                                                                                                                 // 275
		} else {                                                                                                           // 276
			var parser = new xml2js.Parser({                                                                                  // 277
				explicitRoot: true                                                                                               // 278
			});                                                                                                               // 279
			parser.parseString(decoded, function (err, doc) {                                                                 // 280
				var response = self.getElement(doc, 'LogoutResponse');                                                           // 281
                                                                                                                     // 282
				if (response) {                                                                                                  // 283
					// TBD. Check if this msg corresponds to one we sent                                                            // 284
					var inResponseTo = response.$.InResponseTo;                                                                     // 285
					if (Meteor.settings.debug) {                                                                                    // 286
						console.log('In Response to: ' + inResponseTo);                                                                // 287
					}                                                                                                               // 288
					var status = self.getElement(response, 'Status');                                                               // 289
					var statusCode = self.getElement(status[0], 'StatusCode')[0].$.Value;                                           // 290
					if (Meteor.settings.debug) {                                                                                    // 291
						console.log('StatusCode: ' + JSON.stringify(statusCode));                                                      // 292
					}                                                                                                               // 293
					if (statusCode === 'urn:oasis:names:tc:SAML:2.0:status:Success') {                                              // 294
						// In case of a successful logout at IDP we return inResponseTo value.                                         // 295
						// This is the only way how we can identify the Meteor user (as we don't use Session Cookies)                  // 296
						callback(null, inResponseTo);                                                                                  // 297
					} else {                                                                                                        // 298
						callback('Error. Logout not confirmed by IDP', null);                                                          // 299
					}                                                                                                               // 300
				} else {                                                                                                         // 301
					callback('No Response Found', null);                                                                            // 302
				}                                                                                                                // 303
			});                                                                                                               // 304
		}                                                                                                                  // 305
                                                                                                                     // 306
	});                                                                                                                 // 307
};                                                                                                                   // 308
                                                                                                                     // 309
SAML.prototype.validateResponse = function (samlResponse, relayState, callback) {                                    // 310
	var self = this;                                                                                                    // 311
	var xml = new Buffer(samlResponse, 'base64').toString('ascii');                                                     // 312
	// We currently use RelayState to save SAML provider                                                                // 313
	if (Meteor.settings.debug) {                                                                                        // 314
		console.log('Validating response with relay state: ' + xml);                                                       // 315
	}                                                                                                                   // 316
	var parser = new xml2js.Parser({                                                                                    // 317
		explicitRoot: true                                                                                                 // 318
	});                                                                                                                 // 319
                                                                                                                     // 320
	parser.parseString(xml, function (err, doc) {                                                                       // 321
		// Verify signature                                                                                                // 322
		if (Meteor.settings.debug) {                                                                                       // 323
			console.log('Verify signature');                                                                                  // 324
		}                                                                                                                  // 325
		if (self.options.cert && !self.validateSignature(xml, self.options.cert)) {                                        // 326
			if (Meteor.settings.debug) {                                                                                      // 327
				console.log('Signature WRONG');                                                                                  // 328
			}                                                                                                                 // 329
			return callback(new Error('Invalid signature'), null, false);                                                     // 330
		}                                                                                                                  // 331
		if (Meteor.settings.debug) {                                                                                       // 332
			console.log('Signature OK');                                                                                      // 333
		}                                                                                                                  // 334
		var response = self.getElement(doc, 'Response');                                                                   // 335
		if (Meteor.settings.debug) {                                                                                       // 336
			console.log('Got response');                                                                                      // 337
		}                                                                                                                  // 338
		if (response) {                                                                                                    // 339
			var assertion = self.getElement(response, 'Assertion');                                                           // 340
			if (!assertion) {                                                                                                 // 341
				return callback(new Error('Missing SAML assertion'), null, false);                                               // 342
			}                                                                                                                 // 343
                                                                                                                     // 344
			var profile = {};                                                                                                 // 345
                                                                                                                     // 346
			if (response.$ && response.$.InResponseTo) {                                                                      // 347
				profile.inResponseToId = response.$.InResponseTo;                                                                // 348
			}                                                                                                                 // 349
                                                                                                                     // 350
			var issuer = self.getElement(assertion[0], 'Issuer');                                                             // 351
			if (issuer) {                                                                                                     // 352
				profile.issuer = issuer[0];                                                                                      // 353
			}                                                                                                                 // 354
                                                                                                                     // 355
			var subject = self.getElement(assertion[0], 'Subject');                                                           // 356
                                                                                                                     // 357
			if (subject) {                                                                                                    // 358
				var nameID = self.getElement(subject[0], 'NameID');                                                              // 359
				if (nameID) {                                                                                                    // 360
					profile.nameID = nameID[0]._;                                                                                   // 361
                                                                                                                     // 362
					if (nameID[0].$.Format) {                                                                                       // 363
						profile.nameIDFormat = nameID[0].$.Format;                                                                     // 364
					}                                                                                                               // 365
				}                                                                                                                // 366
			}                                                                                                                 // 367
                                                                                                                     // 368
			var authnStatement = self.getElement(assertion[0], 'AuthnStatement');                                             // 369
                                                                                                                     // 370
			if (authnStatement) {                                                                                             // 371
				if (authnStatement[0].$.SessionIndex) {                                                                          // 372
                                                                                                                     // 373
					profile.sessionIndex = authnStatement[0].$.SessionIndex;                                                        // 374
					if (Meteor.settings.debug) {                                                                                    // 375
						console.log('Session Index: ' + profile.sessionIndex);                                                         // 376
					}                                                                                                               // 377
				} else {                                                                                                         // 378
					if (Meteor.settings.debug) {                                                                                    // 379
						console.log('No Session Index Found');                                                                         // 380
					}                                                                                                               // 381
				}                                                                                                                // 382
                                                                                                                     // 383
                                                                                                                     // 384
			} else {                                                                                                          // 385
				if (Meteor.settings.debug) {                                                                                     // 386
					console.log('No AuthN Statement found');                                                                        // 387
				}                                                                                                                // 388
			}                                                                                                                 // 389
                                                                                                                     // 390
			var attributeStatement = self.getElement(assertion[0], 'AttributeStatement');                                     // 391
			if (attributeStatement) {                                                                                         // 392
				var attributes = self.getElement(attributeStatement[0], 'Attribute');                                            // 393
                                                                                                                     // 394
				if (attributes) {                                                                                                // 395
					attributes.forEach(function (attribute) {                                                                       // 396
						var value = self.getElement(attribute, 'AttributeValue');                                                      // 397
						if (typeof value[0] === 'string') {                                                                            // 398
							profile[attribute.$.Name] = value[0];                                                                         // 399
						} else {                                                                                                       // 400
							profile[attribute.$.Name] = value[0]._;                                                                       // 401
						}                                                                                                              // 402
					});                                                                                                             // 403
				}                                                                                                                // 404
                                                                                                                     // 405
				if (!profile.mail && profile['urn:oid:0.9.2342.19200300.100.1.3']) {                                             // 406
					// See http://www.incommonfederation.org/attributesummary.html for definition of attribute OIDs                 // 407
					profile.mail = profile['urn:oid:0.9.2342.19200300.100.1.3'];                                                    // 408
				}                                                                                                                // 409
                                                                                                                     // 410
				if (!profile.email && profile.mail) {                                                                            // 411
					profile.email = profile.mail;                                                                                   // 412
				}                                                                                                                // 413
			}                                                                                                                 // 414
                                                                                                                     // 415
			if (!profile.email && profile.nameID && profile.nameIDFormat && profile.nameIDFormat.indexOf('emailAddress') >= 0) {
				profile.email = profile.nameID;                                                                                  // 417
			}                                                                                                                 // 418
			if (Meteor.settings.debug) {                                                                                      // 419
				console.log('NameID: ' + JSON.stringify(profile));                                                               // 420
			}                                                                                                                 // 421
                                                                                                                     // 422
			callback(null, profile, false);                                                                                   // 423
		} else {                                                                                                           // 424
			var logoutResponse = self.getElement(doc, 'LogoutResponse');                                                      // 425
                                                                                                                     // 426
			if (logoutResponse) {                                                                                             // 427
				callback(null, null, true);                                                                                      // 428
			} else {                                                                                                          // 429
				return callback(new Error('Unknown SAML response message'), null, false);                                        // 430
			}                                                                                                                 // 431
                                                                                                                     // 432
		}                                                                                                                  // 433
	});                                                                                                                 // 434
};                                                                                                                   // 435
                                                                                                                     // 436
var decryptionCert;                                                                                                  // 437
SAML.prototype.generateServiceProviderMetadata = function (callbackUrl) {                                            // 438
                                                                                                                     // 439
	var keyDescriptor = null;                                                                                           // 440
                                                                                                                     // 441
	if (!decryptionCert) {                                                                                              // 442
		decryptionCert = this.options.privateCert;                                                                         // 443
	}                                                                                                                   // 444
                                                                                                                     // 445
	if (this.options.privateKey) {                                                                                      // 446
		if (!decryptionCert) {                                                                                             // 447
			throw new Error(                                                                                                  // 448
				'Missing decryptionCert while generating metadata for decrypting service provider');                             // 449
		}                                                                                                                  // 450
                                                                                                                     // 451
		decryptionCert = decryptionCert.replace(/-+BEGIN CERTIFICATE-+\r?\n?/, '');                                        // 452
		decryptionCert = decryptionCert.replace(/-+END CERTIFICATE-+\r?\n?/, '');                                          // 453
		decryptionCert = decryptionCert.replace(/\r\n/g, '\n');                                                            // 454
                                                                                                                     // 455
		keyDescriptor = {                                                                                                  // 456
			'ds:KeyInfo': {                                                                                                   // 457
				'ds:X509Data': {                                                                                                 // 458
					'ds:X509Certificate': {                                                                                         // 459
						'#text': decryptionCert                                                                                        // 460
					}                                                                                                               // 461
				}                                                                                                                // 462
			},                                                                                                                // 463
			'#list': [                                                                                                        // 464
				// this should be the set that the xmlenc library supports                                                       // 465
				{                                                                                                                // 466
					'EncryptionMethod': {                                                                                           // 467
						'@Algorithm': 'http://www.w3.org/2001/04/xmlenc#aes256-cbc'                                                    // 468
					}                                                                                                               // 469
				},                                                                                                               // 470
				{                                                                                                                // 471
					'EncryptionMethod': {                                                                                           // 472
						'@Algorithm': 'http://www.w3.org/2001/04/xmlenc#aes128-cbc'                                                    // 473
					}                                                                                                               // 474
				},                                                                                                               // 475
				{                                                                                                                // 476
					'EncryptionMethod': {                                                                                           // 477
						'@Algorithm': 'http://www.w3.org/2001/04/xmlenc#tripledes-cbc'                                                 // 478
					}                                                                                                               // 479
				},                                                                                                               // 480
			]                                                                                                                 // 481
		};                                                                                                                 // 482
	}                                                                                                                   // 483
                                                                                                                     // 484
	if (!this.options.callbackUrl && !callbackUrl) {                                                                    // 485
		throw new Error(                                                                                                   // 486
			'Unable to generate service provider metadata when callbackUrl option is not set');                               // 487
	}                                                                                                                   // 488
                                                                                                                     // 489
	var metadata = {                                                                                                    // 490
		'EntityDescriptor': {                                                                                              // 491
			'@xmlns': 'urn:oasis:names:tc:SAML:2.0:metadata',                                                                 // 492
			'@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',                                                                // 493
			'@entityID': this.options.issuer,                                                                                 // 494
			'SPSSODescriptor': {                                                                                              // 495
				'@protocolSupportEnumeration': 'urn:oasis:names:tc:SAML:2.0:protocol',                                           // 496
				'KeyDescriptor': keyDescriptor,                                                                                  // 497
				'SingleLogoutService': {                                                                                         // 498
					'@Binding': 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',                                               // 499
					'@Location': Meteor.absoluteUrl() + '_saml/logout/' + this.options.provider + '/',                              // 500
					'@ResponseLocation': Meteor.absoluteUrl() + '_saml/logout/' + this.options.provider + '/'                       // 501
				},                                                                                                               // 502
				'NameIDFormat': this.options.identifierFormat,                                                                   // 503
				'AssertionConsumerService': {                                                                                    // 504
					'@index': '1',                                                                                                  // 505
					'@isDefault': 'true',                                                                                           // 506
					'@Binding': 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',                                                   // 507
					'@Location': callbackUrl                                                                                        // 508
				}                                                                                                                // 509
			}                                                                                                                 // 510
		}                                                                                                                  // 511
	};                                                                                                                  // 512
                                                                                                                     // 513
	return xmlbuilder.create(metadata).end({                                                                            // 514
		pretty: true,                                                                                                      // 515
		indent: '  ',                                                                                                      // 516
		newline: '\n'                                                                                                      // 517
	});                                                                                                                 // 518
};                                                                                                                   // 519
                                                                                                                     // 520
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/steffo_meteor-accounts-saml/saml_rocketchat.coffee.js                                                    //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var logger, timer, updateServices;                                                                                   // 1
                                                                                                                     //
logger = new Logger('steffo:meteor-accounts-saml', {                                                                 // 1
  methods: {                                                                                                         // 2
    updated: {                                                                                                       // 3
      type: 'info'                                                                                                   // 4
    }                                                                                                                //
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
RocketChat.settings.addGroup('SAML');                                                                                // 1
                                                                                                                     //
Meteor.methods({                                                                                                     // 1
  addSamlService: function(name) {                                                                                   // 8
    RocketChat.settings.add("SAML_Custom_" + name, false, {                                                          // 9
      type: 'boolean',                                                                                               // 9
      group: 'SAML',                                                                                                 // 9
      section: name,                                                                                                 // 9
      i18nLabel: 'Accounts_OAuth_Custom_Enable'                                                                      // 9
    });                                                                                                              //
    RocketChat.settings.add("SAML_Custom_" + name + "_provider", 'openidp', {                                        // 9
      type: 'string',                                                                                                // 10
      group: 'SAML',                                                                                                 // 10
      section: name,                                                                                                 // 10
      i18nLabel: 'SAML_Custom_Provider'                                                                              // 10
    });                                                                                                              //
    RocketChat.settings.add("SAML_Custom_" + name + "_entry_point", 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php', {
      type: 'string',                                                                                                // 11
      group: 'SAML',                                                                                                 // 11
      section: name,                                                                                                 // 11
      i18nLabel: 'SAML_Custom_Entry_point'                                                                           // 11
    });                                                                                                              //
    RocketChat.settings.add("SAML_Custom_" + name + "_issuer", 'https://rocket.chat/', {                             // 9
      type: 'string',                                                                                                // 12
      group: 'SAML',                                                                                                 // 12
      section: name,                                                                                                 // 12
      i18nLabel: 'SAML_Custom_Issuer'                                                                                // 12
    });                                                                                                              //
    RocketChat.settings.add("SAML_Custom_" + name + "_cert", '', {                                                   // 9
      type: 'string',                                                                                                // 13
      group: 'SAML',                                                                                                 // 13
      section: name,                                                                                                 // 13
      i18nLabel: 'SAML_Custom_Cert'                                                                                  // 13
    });                                                                                                              //
    RocketChat.settings.add("SAML_Custom_" + name + "_button_label_text", '', {                                      // 9
      type: 'string',                                                                                                // 14
      group: 'SAML',                                                                                                 // 14
      section: name,                                                                                                 // 14
      i18nLabel: 'Accounts_OAuth_Custom_Button_Label_Text'                                                           // 14
    });                                                                                                              //
    RocketChat.settings.add("SAML_Custom_" + name + "_button_label_color", '#FFFFFF', {                              // 9
      type: 'string',                                                                                                // 15
      group: 'SAML',                                                                                                 // 15
      section: name,                                                                                                 // 15
      i18nLabel: 'Accounts_OAuth_Custom_Button_Label_Color'                                                          // 15
    });                                                                                                              //
    RocketChat.settings.add("SAML_Custom_" + name + "_button_color", '#13679A', {                                    // 9
      type: 'string',                                                                                                // 16
      group: 'SAML',                                                                                                 // 16
      section: name,                                                                                                 // 16
      i18nLabel: 'Accounts_OAuth_Custom_Button_Color'                                                                // 16
    });                                                                                                              //
    return RocketChat.settings.add("SAML_Custom_" + name + "_generate_username", false, {                            //
      type: 'boolean',                                                                                               // 17
      group: 'SAML',                                                                                                 // 17
      section: name,                                                                                                 // 17
      i18nLabel: 'SAML_Custom_Generate_Username'                                                                     // 17
    });                                                                                                              //
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
timer = void 0;                                                                                                      // 1
                                                                                                                     //
updateServices = function() {                                                                                        // 1
  if (timer != null) {                                                                                               // 21
    Meteor.clearTimeout(timer);                                                                                      // 21
  }                                                                                                                  //
  return timer = Meteor.setTimeout(function() {                                                                      //
    var data, i, len, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, results, service, serviceName, services;        // 24
    services = RocketChat.models.Settings.find({                                                                     // 24
      _id: /^(SAML_Custom_)[a-z]+$/i                                                                                 // 24
    }).fetch();                                                                                                      //
    Accounts.saml.settings.providers = [];                                                                           // 24
    results = [];                                                                                                    // 28
    for (i = 0, len = services.length; i < len; i++) {                                                               //
      service = services[i];                                                                                         //
      logger.updated(service._id);                                                                                   // 29
      serviceName = 'saml';                                                                                          // 29
      if (service.value === true) {                                                                                  // 33
        data = {                                                                                                     // 34
          buttonLabelText: (ref = RocketChat.models.Settings.findOneById(service._id + "_button_label_text")) != null ? ref.value : void 0,
          buttonLabelColor: (ref1 = RocketChat.models.Settings.findOneById(service._id + "_button_label_color")) != null ? ref1.value : void 0,
          buttonColor: (ref2 = RocketChat.models.Settings.findOneById(service._id + "_button_color")) != null ? ref2.value : void 0,
          clientConfig: {                                                                                            // 35
            provider: (ref3 = RocketChat.models.Settings.findOneById(service._id + "_provider")) != null ? ref3.value : void 0
          }                                                                                                          //
        };                                                                                                           //
        Accounts.saml.settings.generateUsername = (ref4 = RocketChat.models.Settings.findOneById(service._id + "_generate_username")) != null ? ref4.value : void 0;
        Accounts.saml.settings.providers.push({                                                                      // 34
          provider: data.clientConfig.provider,                                                                      // 44
          entryPoint: (ref5 = RocketChat.models.Settings.findOneById(service._id + "_entry_point")) != null ? ref5.value : void 0,
          issuer: (ref6 = RocketChat.models.Settings.findOneById(service._id + "_issuer")) != null ? ref6.value : void 0,
          cert: (ref7 = RocketChat.models.Settings.findOneById(service._id + "_cert")) != null ? ref7.value : void 0
        });                                                                                                          //
        results.push(ServiceConfiguration.configurations.upsert({                                                    // 34
          service: serviceName.toLowerCase()                                                                         // 49
        }, {                                                                                                         //
          $set: data                                                                                                 // 49
        }));                                                                                                         //
      } else {                                                                                                       //
        results.push(ServiceConfiguration.configurations.remove({                                                    //
          service: serviceName.toLowerCase()                                                                         // 51
        }));                                                                                                         //
      }                                                                                                              //
    }                                                                                                                // 28
    return results;                                                                                                  //
  }, 2000);                                                                                                          //
};                                                                                                                   // 20
                                                                                                                     //
RocketChat.models.Settings.find().observe({                                                                          // 1
  added: function(record) {                                                                                          // 55
    if (/^SAML_.+/.test(record._id)) {                                                                               // 56
      return updateServices();                                                                                       //
    }                                                                                                                //
  },                                                                                                                 //
  changed: function(record) {                                                                                        // 55
    if (/^SAML_.+/.test(record._id)) {                                                                               // 60
      return updateServices();                                                                                       //
    }                                                                                                                //
  },                                                                                                                 //
  removed: function(record) {                                                                                        // 55
    if (/^SAML_.+/.test(record._id)) {                                                                               // 64
      return updateServices();                                                                                       //
    }                                                                                                                //
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Meteor.startup(function() {                                                                                          // 1
  if (RocketChat.models.Settings.findOne({                                                                           // 68
    _id: /^(SAML_Custom)[a-z]+$/i                                                                                    //
  }) == null) {                                                                                                      //
    return Meteor.call('addSamlService', 'Default');                                                                 //
  }                                                                                                                  //
});                                                                                                                  // 67
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['steffo:meteor-accounts-saml'] = {};

})();

//# sourceMappingURL=steffo_meteor-accounts-saml.js.map
