(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Inject = Package['meteorhacks:inject-initial'].Inject;
var FastRender = Package['meteorhacks:fast-render'].FastRender;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_ui-master/server/inject.js                    //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
/* globals Inject */                                                 //
                                                                     //
Inject.rawBody('page-loading', '\n\t<div id="initial-page-loading" class="page-loading">\n\t\t<div class="spinner">\n\t\t\t<div class="rect1"></div>\n\t\t\t<div class="rect2"></div>\n\t\t\t<div class="rect3"></div>\n\t\t\t<div class="rect4"></div>\n\t\t\t<div class="rect5"></div>\n\t\t</div>\n\t</div>');
                                                                     //
RocketChat.settings.get('Site_Url', function () {                    // 15
	Meteor.defer(function () {                                          // 16
		var baseUrl = undefined;                                           // 17
		if (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX && __meteor_runtime_config__.ROOT_URL_PATH_PREFIX.trim() !== '') {
			baseUrl = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;         // 19
		} else {                                                           //
			baseUrl = '/';                                                    // 21
		}                                                                  //
		if (/\/$/.test(baseUrl) === false) {                               // 23
			baseUrl += '/';                                                   // 24
		}                                                                  //
		Inject.rawHead('base', '<base href="' + baseUrl + '">');           // 26
	});                                                                 //
});                                                                  //
///////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_ui-master/server/fastRender.js                //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
/* globals FastRender */                                             //
                                                                     //
FastRender.onAllRoutes(function () /*path*/{                         // 3
	this.subscribe('settings');                                         // 4
	this.subscribe('meteor.loginServiceConfiguration');                 // 5
});                                                                  //
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:ui-master'] = {};

})();

//# sourceMappingURL=rocketchat_ui-master.js.map
