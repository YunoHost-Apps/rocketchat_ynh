(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var changeCase = Package['konecty:change-case'].changeCase;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, OEmbed;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/rocketchat_oembed/server/server.coffee.js                                                     //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var URL, getCharset, getRelevantHeaders, getRelevantMetaTags, getUrlContent, iconv, querystring, request, toUtf8;        
                                                                                                          //
URL = Npm.require('url');                                                                                 // 1
                                                                                                          //
querystring = Npm.require('querystring');                                                                 // 1
                                                                                                          //
request = HTTPInternals.NpmModules.request.module;                                                        // 1
                                                                                                          //
iconv = Npm.require('iconv-lite');                                                                        // 1
                                                                                                          //
OEmbed = {};                                                                                              // 1
                                                                                                          //
getCharset = function(body) {                                                                             // 1
  var binary, matches;                                                                                    // 10
  binary = body.toString('binary');                                                                       // 10
  matches = binary.match(/<meta\b[^>]*charset=["']?([\w\-]+)/i);                                          // 10
  if (matches) {                                                                                          // 12
    return matches[1];                                                                                    // 13
  }                                                                                                       //
  return 'utf-8';                                                                                         // 14
};                                                                                                        // 9
                                                                                                          //
toUtf8 = function(body) {                                                                                 // 1
  return iconv.decode(body, getCharset(body));                                                            // 17
};                                                                                                        // 16
                                                                                                          //
getUrlContent = function(urlObj, redirectCount, callback) {                                               // 1
  var chunks, chunksTotalLength, data, headers, opts, parsedUrl, stream, url;                             // 20
  if (redirectCount == null) {                                                                            //
    redirectCount = 5;                                                                                    //
  }                                                                                                       //
  if (_.isString(urlObj)) {                                                                               // 20
    urlObj = URL.parse(urlObj);                                                                           // 21
  }                                                                                                       //
  parsedUrl = _.pick(urlObj, ['host', 'hash', 'pathname', 'protocol', 'port', 'query', 'search']);        // 20
  data = RocketChat.callbacks.run('oembed:beforeGetUrlContent', {                                         // 20
    urlObj: urlObj,                                                                                       // 26
    parsedUrl: parsedUrl                                                                                  // 26
  });                                                                                                     //
  if (data.attachments != null) {                                                                         // 29
    return callback(null, data);                                                                          // 30
  }                                                                                                       //
  url = URL.format(data.urlObj);                                                                          // 20
  opts = {                                                                                                // 20
    url: url,                                                                                             // 34
    strictSSL: !RocketChat.settings.get('Allow_Invalid_SelfSigned_Certs'),                                // 34
    gzip: true,                                                                                           // 34
    maxRedirects: redirectCount,                                                                          // 34
    headers: {                                                                                            // 34
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'
    }                                                                                                     //
  };                                                                                                      //
  headers = null;                                                                                         // 20
  chunks = [];                                                                                            // 20
  chunksTotalLength = 0;                                                                                  // 20
  stream = request(opts);                                                                                 // 20
  stream.on('response', function(response) {                                                              // 20
    if (response.statusCode !== 200) {                                                                    // 47
      return stream.abort();                                                                              // 48
    }                                                                                                     //
    return headers = response.headers;                                                                    //
  });                                                                                                     //
  stream.on('data', function(chunk) {                                                                     // 20
    chunks.push(chunk);                                                                                   // 52
    chunksTotalLength += chunk.length;                                                                    // 52
    if (chunksTotalLength > 250000) {                                                                     // 54
      return stream.abort();                                                                              //
    }                                                                                                     //
  });                                                                                                     //
  stream.on('end', Meteor.bindEnvironment(function() {                                                    // 20
    var buffer;                                                                                           // 58
    buffer = Buffer.concat(chunks);                                                                       // 58
    return callback(null, {                                                                               //
      headers: headers,                                                                                   // 60
      body: toUtf8(buffer),                                                                               // 60
      parsedUrl: parsedUrl                                                                                // 60
    });                                                                                                   //
  }));                                                                                                    //
  return stream.on('error', function(error) {                                                             //
    return callback(null, {                                                                               //
      error: error,                                                                                       // 67
      parsedUrl: parsedUrl                                                                                // 67
    });                                                                                                   //
  });                                                                                                     //
};                                                                                                        // 19
                                                                                                          //
OEmbed.getUrlMeta = function(url, withFragment) {                                                         // 1
  var content, data, getUrlContentSync, header, headers, metas, path, queryStringObj, ref, urlObj, value;
  getUrlContentSync = Meteor.wrapAsync(getUrlContent);                                                    // 73
  urlObj = URL.parse(url);                                                                                // 73
  if (withFragment != null) {                                                                             // 77
    queryStringObj = querystring.parse(urlObj.query);                                                     // 78
    queryStringObj._escaped_fragment_ = '';                                                               // 78
    urlObj.query = querystring.stringify(queryStringObj);                                                 // 78
    path = urlObj.pathname;                                                                               // 78
    if (urlObj.query != null) {                                                                           // 83
      path += '?' + urlObj.query;                                                                         // 84
    }                                                                                                     //
    urlObj.path = path;                                                                                   // 78
  }                                                                                                       //
  content = getUrlContentSync(urlObj, 5);                                                                 // 73
  if (content.attachments != null) {                                                                      // 90
    return content;                                                                                       // 91
  }                                                                                                       //
  metas = void 0;                                                                                         // 73
  if ((content != null ? content.body : void 0) != null) {                                                // 95
    metas = {};                                                                                           // 96
    content.body.replace(/<title>((.|\n)+?)<\/title>/gmi, function(meta, title) {                         // 96
      return metas.pageTitle = title;                                                                     //
    });                                                                                                   //
    content.body.replace(/<meta[^>]*(?:name|property)=[']([^']*)['][^>]*content=[']([^']*)['][^>]*>/gmi, function(meta, name, value) {
      return metas[changeCase.camelCase(name)] = value;                                                   //
    });                                                                                                   //
    content.body.replace(/<meta[^>]*(?:name|property)=["]([^"]*)["][^>]*content=["]([^"]*)["][^>]*>/gmi, function(meta, name, value) {
      return metas[changeCase.camelCase(name)] = value;                                                   //
    });                                                                                                   //
    content.body.replace(/<meta[^>]*content=[']([^']*)['][^>]*(?:name|property)=[']([^']*)['][^>]*>/gmi, function(meta, value, name) {
      return metas[changeCase.camelCase(name)] = value;                                                   //
    });                                                                                                   //
    content.body.replace(/<meta[^>]*content=["]([^"]*)["][^>]*(?:name|property)=["]([^"]*)["][^>]*>/gmi, function(meta, value, name) {
      return metas[changeCase.camelCase(name)] = value;                                                   //
    });                                                                                                   //
    if (metas.fragment === '!' && (withFragment == null)) {                                               // 113
      return OEmbed.getUrlMeta(url, true);                                                                // 114
    }                                                                                                     //
  }                                                                                                       //
  headers = void 0;                                                                                       // 73
  if ((content != null ? content.headers : void 0) != null) {                                             // 118
    headers = {};                                                                                         // 119
    ref = content.headers;                                                                                // 120
    for (header in ref) {                                                                                 // 120
      value = ref[header];                                                                                //
      headers[changeCase.camelCase(header)] = value;                                                      // 121
    }                                                                                                     // 120
  }                                                                                                       //
  data = RocketChat.callbacks.run('oembed:afterParseContent', {                                           // 73
    meta: metas,                                                                                          // 124
    headers: headers,                                                                                     // 124
    parsedUrl: content.parsedUrl,                                                                         // 124
    content: content                                                                                      // 124
  });                                                                                                     //
  return data;                                                                                            // 129
};                                                                                                        // 72
                                                                                                          //
OEmbed.getUrlMetaWithCache = function(url, withFragment) {                                                // 1
  var cache, data;                                                                                        // 132
  cache = RocketChat.models.OEmbedCache.findOneById(url);                                                 // 132
  if (cache != null) {                                                                                    // 133
    return cache.data;                                                                                    // 134
  }                                                                                                       //
  data = OEmbed.getUrlMeta(url, withFragment);                                                            // 132
  if (data != null) {                                                                                     // 138
    RocketChat.models.OEmbedCache.createWithIdAndData(url, data);                                         // 139
    return data;                                                                                          // 141
  }                                                                                                       //
};                                                                                                        // 131
                                                                                                          //
getRelevantHeaders = function(headersObj) {                                                               // 1
  var headers, key, ref, value;                                                                           // 146
  headers = {};                                                                                           // 146
  for (key in headersObj) {                                                                               // 147
    value = headersObj[key];                                                                              //
    if (((ref = key.toLowerCase()) === 'contenttype' || ref === 'contentlength') && (value != null ? value.trim() : void 0) !== '') {
      headers[key] = value;                                                                               // 149
    }                                                                                                     //
  }                                                                                                       // 147
  if (Object.keys(headers).length > 0) {                                                                  // 151
    return headers;                                                                                       // 152
  }                                                                                                       //
};                                                                                                        // 145
                                                                                                          //
getRelevantMetaTags = function(metaObj) {                                                                 // 1
  var key, tags, value;                                                                                   // 156
  tags = {};                                                                                              // 156
  for (key in metaObj) {                                                                                  // 157
    value = metaObj[key];                                                                                 //
    if (/^(og|fb|twitter|oembed).+|description|title|pageTitle$/.test(key.toLowerCase()) && (value != null ? value.trim() : void 0) !== '') {
      tags[key] = value;                                                                                  // 159
    }                                                                                                     //
  }                                                                                                       // 157
  if (Object.keys(tags).length > 0) {                                                                     // 161
    return tags;                                                                                          // 162
  }                                                                                                       //
};                                                                                                        // 155
                                                                                                          //
OEmbed.RocketUrlParser = function(message) {                                                              // 1
  var attachments, changed;                                                                               // 166
  if (Array.isArray(message.urls)) {                                                                      // 166
    attachments = [];                                                                                     // 167
    changed = false;                                                                                      // 167
    message.urls.forEach(function(item) {                                                                 // 167
      var data;                                                                                           // 170
      if (item.ignoreParse === true) {                                                                    // 170
        return;                                                                                           // 170
      }                                                                                                   //
      if (!/^https?:\/\//i.test(item.url)) {                                                              // 171
        return;                                                                                           // 171
      }                                                                                                   //
      data = OEmbed.getUrlMetaWithCache(item.url);                                                        // 170
      if (data != null) {                                                                                 // 175
        if (data.attachments) {                                                                           // 176
          return attachments = _.union(attachments, data.attachments);                                    //
        } else {                                                                                          //
          if (data.meta != null) {                                                                        // 179
            item.meta = getRelevantMetaTags(data.meta);                                                   // 180
          }                                                                                               //
          if (data.headers != null) {                                                                     // 182
            item.headers = getRelevantHeaders(data.headers);                                              // 183
          }                                                                                               //
          item.parsedUrl = data.parsedUrl;                                                                // 179
          return changed = true;                                                                          //
        }                                                                                                 //
      }                                                                                                   //
    });                                                                                                   //
    if (attachments.length) {                                                                             // 188
      RocketChat.models.Messages.setMessageAttachments(message._id, attachments);                         // 189
    }                                                                                                     //
    if (changed === true) {                                                                               // 191
      RocketChat.models.Messages.setUrlsById(message._id, message.urls);                                  // 192
    }                                                                                                     //
  }                                                                                                       //
  return message;                                                                                         // 194
};                                                                                                        // 165
                                                                                                          //
RocketChat.settings.get('API_Embed', function(key, value) {                                               // 1
  if (value) {                                                                                            // 197
    return RocketChat.callbacks.add('afterSaveMessage', OEmbed.RocketUrlParser, RocketChat.callbacks.priority.LOW, 'API_Embed');
  } else {                                                                                                //
    return RocketChat.callbacks.remove('afterSaveMessage', 'API_Embed');                                  //
  }                                                                                                       //
});                                                                                                       // 196
                                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/rocketchat_oembed/server/providers.coffee.js                                                  //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Providers, QueryString, URL, providers;                                                               // 1
                                                                                                          //
URL = Npm.require('url');                                                                                 // 1
                                                                                                          //
QueryString = Npm.require('querystring');                                                                 // 1
                                                                                                          //
Providers = (function() {                                                                                 // 1
  function Providers() {}                                                                                 //
                                                                                                          //
  Providers.prototype.providers = [];                                                                     // 5
                                                                                                          //
  Providers.getConsumerUrl = function(provider, url) {                                                    // 5
    var urlObj;                                                                                           // 8
    urlObj = URL.parse(provider.endPoint, true);                                                          // 8
    urlObj.query['url'] = url;                                                                            // 8
    delete urlObj.search;                                                                                 // 8
    return URL.format(urlObj);                                                                            // 11
  };                                                                                                      //
                                                                                                          //
  Providers.prototype.registerProvider = function(provider) {                                             // 5
    return this.providers.push(provider);                                                                 //
  };                                                                                                      //
                                                                                                          //
  Providers.prototype.getProviders = function() {                                                         // 5
    return this.providers;                                                                                // 17
  };                                                                                                      //
                                                                                                          //
  Providers.prototype.getProviderForUrl = function(url) {                                                 // 5
    return _.find(this.providers, function(provider) {                                                    // 20
      var candidate;                                                                                      // 21
      candidate = _.find(provider.urls, function(re) {                                                    // 21
        return re.test(url);                                                                              // 22
      });                                                                                                 //
      return candidate != null;                                                                           // 23
    });                                                                                                   //
  };                                                                                                      //
                                                                                                          //
  return Providers;                                                                                       //
                                                                                                          //
})();                                                                                                     //
                                                                                                          //
providers = new Providers();                                                                              // 1
                                                                                                          //
providers.registerProvider({                                                                              // 1
  urls: [new RegExp('https?://soundcloud.com/\\S+')],                                                     // 27
  endPoint: 'https://soundcloud.com/oembed?format=json&maxheight=150'                                     // 27
});                                                                                                       //
                                                                                                          //
providers.registerProvider({                                                                              // 1
  urls: [new RegExp('https?://vimeo.com/[^/]+'), new RegExp('https?://vimeo.com/channels/[^/]+/[^/]+'), new RegExp('https://vimeo.com/groups/[^/]+/videos/[^/]+')],
  endPoint: 'https://vimeo.com/api/oembed.json?maxheight=200'                                             // 30
});                                                                                                       //
                                                                                                          //
providers.registerProvider({                                                                              // 1
  urls: [new RegExp('https?://www.youtube.com/\\S+'), new RegExp('https?://www.youtu.be/\\S+')],          // 33
  endPoint: 'https://www.youtube.com/oembed?maxheight=200'                                                // 33
});                                                                                                       //
                                                                                                          //
providers.registerProvider({                                                                              // 1
  urls: [new RegExp('https?://www.rdio.com/\\S+'), new RegExp('https?://rd.io/\\S+')],                    // 36
  endPoint: 'https://www.rdio.com/api/oembed/?format=json&maxheight=150'                                  // 36
});                                                                                                       //
                                                                                                          //
providers.registerProvider({                                                                              // 1
  urls: [new RegExp('https?://www.slideshare.net/[^/]+/[^/]+')],                                          // 39
  endPoint: 'https://www.slideshare.net/api/oembed/2?format=json&maxheight=200'                           // 39
});                                                                                                       //
                                                                                                          //
providers.registerProvider({                                                                              // 1
  urls: [new RegExp('https?://www.dailymotion.com/video/\\S+')],                                          // 42
  endPoint: 'https://www.dailymotion.com/services/oembed?maxheight=200'                                   // 42
});                                                                                                       //
                                                                                                          //
RocketChat.oembed = {};                                                                                   // 1
                                                                                                          //
RocketChat.oembed.providers = providers;                                                                  // 1
                                                                                                          //
RocketChat.callbacks.add('oembed:beforeGetUrlContent', function(data) {                                   // 1
  var consumerUrl, provider, url;                                                                         // 49
  if (data.parsedUrl != null) {                                                                           // 49
    url = URL.format(data.parsedUrl);                                                                     // 50
    provider = providers.getProviderForUrl(url);                                                          // 50
    if (provider != null) {                                                                               // 52
      consumerUrl = Providers.getConsumerUrl(provider, url);                                              // 53
      consumerUrl = URL.parse(consumerUrl, true);                                                         // 53
      _.extend(data.parsedUrl, consumerUrl);                                                              // 53
      data.urlObj.port = consumerUrl.port;                                                                // 53
      data.urlObj.hostname = consumerUrl.hostname;                                                        // 53
      data.urlObj.pathname = consumerUrl.pathname;                                                        // 53
      data.urlObj.query = consumerUrl.query;                                                              // 53
      delete data.urlObj.search;                                                                          // 53
    }                                                                                                     //
  }                                                                                                       //
  return data;                                                                                            // 62
});                                                                                                       // 48
                                                                                                          //
RocketChat.callbacks.add('oembed:afterParseContent', function(data) {                                     // 1
  var metas, provider, queryString, ref, ref1, url;                                                       // 65
  if (((ref = data.parsedUrl) != null ? ref.query : void 0) != null) {                                    // 65
    queryString = data.parsedUrl.query;                                                                   // 66
    if (_.isString(data.parsedUrl.query)) {                                                               // 67
      queryString = QueryString.parse(data.parsedUrl.query);                                              // 68
    }                                                                                                     //
    if (queryString.url != null) {                                                                        // 69
      url = queryString.url;                                                                              // 70
      provider = providers.getProviderForUrl(url);                                                        // 70
      if (provider != null) {                                                                             // 72
        if (((ref1 = data.content) != null ? ref1.body : void 0) != null) {                               // 73
          metas = JSON.parse(data.content.body);                                                          // 74
          _.each(metas, function(value, key) {                                                            // 74
            if (_.isString(value)) {                                                                      // 76
              return data.meta[changeCase.camelCase('oembed_' + key)] = value;                            //
            }                                                                                             //
          });                                                                                             //
          data.meta['oembedUrl'] = url;                                                                   // 74
        }                                                                                                 //
      }                                                                                                   //
    }                                                                                                     //
  }                                                                                                       //
  return data;                                                                                            // 80
});                                                                                                       // 64
                                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/rocketchat_oembed/server/jumpToMessage.js                                                     //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
/* globals getAvatarUrlFromUsername */                                                                    //
                                                                                                          //
var URL = Npm.require('url');                                                                             // 3
var QueryString = Npm.require('querystring');                                                             // 4
                                                                                                          //
RocketChat.callbacks.add('beforeSaveMessage', function (msg) {                                            // 6
	if (msg && msg.urls) {                                                                                   // 7
		msg.urls.forEach(function (item) {                                                                      // 8
			if (item.url.indexOf(Meteor.absoluteUrl()) === 0) {                                                    // 9
				var urlObj = URL.parse(item.url);                                                                     // 10
				if (urlObj.query) {                                                                                   // 11
					var queryString = QueryString.parse(urlObj.query);                                                   // 12
					if (_.isString(queryString.j)) {                                                                     // 13
						// Jump-to query param                                                                              //
						var jumpToMessage = RocketChat.models.Messages.findOneById(queryString.j);                          // 14
						if (jumpToMessage) {                                                                                // 15
							msg.attachments = msg.attachments || [];                                                           // 16
							msg.attachments.push({                                                                             // 17
								'text': jumpToMessage.msg,                                                                        // 18
								'author_name': jumpToMessage.u.username,                                                          // 19
								'author_icon': getAvatarUrlFromUsername(jumpToMessage.u.username)                                 // 20
							});                                                                                                //
							item.ignoreParse = true;                                                                           // 22
						}                                                                                                   //
					}                                                                                                    //
				}                                                                                                     //
			}                                                                                                      //
		});                                                                                                     //
	}                                                                                                        //
	return msg;                                                                                              // 29
}, RocketChat.callbacks.priority.LOW);                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/rocketchat_oembed/server/models/OEmbedCache.coffee.js                                         //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                            //
                                                                                                          //
RocketChat.models.OEmbedCache = new ((function(superClass) {                                              // 1
  extend(_Class, superClass);                                                                             // 2
                                                                                                          //
  function _Class() {                                                                                     // 2
    this._initModel('oembed_cache');                                                                      // 3
  }                                                                                                       //
                                                                                                          //
  _Class.prototype.findOneById = function(_id, options) {                                                 // 2
    var query;                                                                                            // 8
    query = {                                                                                             // 8
      _id: _id                                                                                            // 9
    };                                                                                                    //
    return this.findOne(query, options);                                                                  // 11
  };                                                                                                      //
                                                                                                          //
  _Class.prototype.createWithIdAndData = function(_id, data) {                                            // 2
    var record;                                                                                           // 16
    record = {                                                                                            // 16
      _id: _id,                                                                                           // 17
      data: data,                                                                                         // 17
      updatedAt: new Date                                                                                 // 17
    };                                                                                                    //
    record._id = this.insert(record);                                                                     // 16
    return record;                                                                                        // 22
  };                                                                                                      //
                                                                                                          //
  return _Class;                                                                                          //
                                                                                                          //
})(RocketChat.models._Base));                                                                             //
                                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:oembed'] = {
  OEmbed: OEmbed
};

})();

//# sourceMappingURL=rocketchat_oembed.js.map
