(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var Email;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/idorecall_email-normalize/packages/idorecall_email-norma //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
(function () {                                                       // 1
                                                                     // 2
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/idorecall:email-normalize/email.js                                                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
'use strict';                                                                                                        // 1
                                                                                                                     // 2
// TODO extract out Node.js module. See http://stackoverflow.com/questions/6048504/synchronous-request-in-nodejs     // 3
                                                                                                                     // 4
Email = this.Email || {};                                                                                            // 5
                                                                                                                     // 6
Email.domainsWithTags = {                                                                                            // 7
  // Google only has two Gmail domains: https://en.wikipedia.org/wiki/List_of_Google_domains                         // 8
  'gmail.com': '+',                                                                                                  // 9
  'googlemail.com': '+',                                                                                             // 10
  'google.com': '+',  // corporate email addresses; TODO presumably country domains also receive corporate email?    // 11
  // Microsoft                                                                                                       // 12
  'outlook.com': '+',                                                                                                // 13
  'hotmail.com': '+',                                                                                                // 14
  'live.com': '+',                                                                                                   // 15
  // Fastmail - https://www.fastmail.com/help/receive/addressing.html TODO: whatever@username.fastmail.com -> username@fastmail.com
  'fastmail.com': '+',                                                                                               // 17
  'fastmail.fm': '+',                                                                                                // 18
  // Yahoo Mail Plus accounts, per https://en.wikipedia.org/wiki/Yahoo!_Mail#Email_domains, use hyphens - http://www.cnet.com/forums/discussions/did-yahoo-break-disposable-email-addresses-mail-plus-395088/
  'yahoo.com.ar' : '-',                                                                                              // 20
  'yahoo.com.au' : '-',                                                                                              // 21
  'yahoo.at' : '-',                                                                                                  // 22
  'yahoo.be/fr' : '-',                                                                                               // 23
  'yahoo.be/nl' : '-',                                                                                               // 24
  'yahoo.com.br' : '-',                                                                                              // 25
  'ca.yahoo.com' : '-',                                                                                              // 26
  'qc.yahoo.com' : '-',                                                                                              // 27
  'yahoo.com.co' : '-',                                                                                              // 28
  'yahoo.com.hr' : '-',                                                                                              // 29
  'yahoo.cz' : '-',                                                                                                  // 30
  'yahoo.dk' : '-',                                                                                                  // 31
  'yahoo.fi' : '-',                                                                                                  // 32
  'yahoo.fr' : '-',                                                                                                  // 33
  'yahoo.de' : '-',                                                                                                  // 34
  'yahoo.gr' : '-',                                                                                                  // 35
  'yahoo.com.hk' : '-',                                                                                              // 36
  'yahoo.hu' : '-',                                                                                                  // 37
  'yahoo.co.in/yahoo.in' : '-',                                                                                      // 38
  'yahoo.co.id' : '-',                                                                                               // 39
  'yahoo.ie' : '-',                                                                                                  // 40
  'yahoo.co.il' : '-',                                                                                               // 41
  'yahoo.it' : '-',                                                                                                  // 42
  'yahoo.co.jp' : '-',                                                                                               // 43
  'yahoo.com.my' : '-',                                                                                              // 44
  'yahoo.com.mx' : '-',                                                                                              // 45
  'yahoo.ae' : '-',                                                                                                  // 46
  'yahoo.nl' : '-',                                                                                                  // 47
  'yahoo.co.nz' : '-',                                                                                               // 48
  'yahoo.no' : '-',                                                                                                  // 49
  'yahoo.com.ph' : '-',                                                                                              // 50
  'yahoo.pl' : '-',                                                                                                  // 51
  'yahoo.pt' : '-',                                                                                                  // 52
  'yahoo.ro' : '-',                                                                                                  // 53
  'yahoo.ru' : '-',                                                                                                  // 54
  'yahoo.com.sg' : '-',                                                                                              // 55
  'yahoo.co.za' : '-',                                                                                               // 56
  'yahoo.es' : '-',                                                                                                  // 57
  'yahoo.se' : '-',                                                                                                  // 58
  'yahoo.ch/fr' : '-',                                                                                               // 59
  'yahoo.ch/de' : '-',                                                                                               // 60
  'yahoo.com.tw' : '-',                                                                                              // 61
  'yahoo.co.th' : '-',                                                                                               // 62
  'yahoo.com.tr' : '-',                                                                                              // 63
  'yahoo.co.uk' : '-',                                                                                               // 64
  'yahoo.com' : '-',                                                                                                 // 65
  'yahoo.com.vn' : '-'                                                                                               // 66
};                                                                                                                   // 67
                                                                                                                     // 68
                                                                                                                     // 69
/**                                                                                                                  // 70
 * Normalize an email address by removing the dots and address tag.                                                  // 71
 * @param {string} email                                                                                             // 72
 * @param {object} [options]                                                                                         // 73
 * @param {boolean} options.forceRemoveDots                                                                          // 74
 * @param {boolean} options.forceRemoveTags                                                                          // 75
 * @param {boolean} options.detectProvider - Make a DNS call to detect if the email host provider is one that might  // 76
 *        provide email address tags, such as Google Apps for Work. Requires callback on the client.                 // 77
 * @param {function} [callback] - On the client and only if `detectProvider` is true: callback that will be passed   // 78
 *        `error` and `result`. This is required because we make an async HTTP request to DNS resolve the domain.    // 79
 * @returns {string}                                                                                                 // 80
 */                                                                                                                  // 81
Email.normalize = function normalizeEmail(email, options, callback) {                                                // 82
  // TODO destructure when ES6 lands                                                                                 // 83
  options = options || {};                                                                                           // 84
  options.forceRemoveDots = options.forceRemoveDots || false;                                                        // 85
  options.forceRemoveTags = options.forceRemoveTags || false;                                                        // 86
  options.detectProvider = options.detectProvider || false;                                                          // 87
                                                                                                                     // 88
  email = email.trim().toLowerCase();                                                                                // 89
                                                                                                                     // 90
  var emailParts = email.split(/@/);                                                                                 // 91
  var user = emailParts[0];                                                                                          // 92
  var domain = emailParts[1];                                                                                        // 93
                                                                                                                     // 94
  if (options.forceRemoveTags) {                                                                                     // 95
    user = user.replace(/[-+=].*/, '');                                                                              // 96
  } else {                                                                                                           // 97
    var separator = Email.domainsWithTags[domain];                                                                   // 98
    if (separator) user = user.split(separator)[0];                                                                  // 99
  }                                                                                                                  // 100
                                                                                                                     // 101
  if (options.forceRemoveDots || /^(gmail|googlemail|google)\.com$/.test(domain)) {                                  // 102
    user = user.replace(/\./g, '');                                                                                  // 103
  }                                                                                                                  // 104
                                                                                                                     // 105
  if (domain === 'googlemail.com') {                                                                                 // 106
    domain = 'gmail.com';                                                                                            // 107
  }                                                                                                                  // 108
                                                                                                                     // 109
  if (options.detectProvider) {                                                                                      // 110
    // detect custom domain email hosting providers TODO providers from https://news.ycombinator.com/item?id=8533588 // 111
                                                                                                                     // 112
    var processMXRecords = function processMXRecords(address, user) {                                                // 113
      // presumably, if at least one MX points to a service provider, then the user should expect the provider's special handling when it comes to dots or address tags
      if (/aspmx.*google.*\.com\.?$/i.test(address)) {                                                               // 115
        return user.split('+')[0].replace(/\./g, '');  // Google Apps for Work                                       // 116
      }                                                                                                              // 117
      // FastMail - https://www.fastmail.com/help/receive/domains.html                                               // 118
      if (/\.messagingengine\.com\.?$/i.test(address)) {                                                             // 119
        return user.split('+')[0];  // dots are significant - https://www.fastmail.com/help/account/changeusername.html
      }                                                                                                              // 121
      return user;                                                                                                   // 122
    };                                                                                                               // 123
                                                                                                                     // 124
    if (Meteor.isClient) {                                                                                           // 125
      if (typeof callback !== 'function')                                                                            // 126
        throw new Error('Detecting the provider from the client requires a callback.');                              // 127
                                                                                                                     // 128
      return HTTP.get('http://enclout.com/api/v1/dns/show.json', {params: {url: domain}}, function (error, result) { // 129
        if (error) return callback(error);                                                                           // 130
        var addresses = result.data.dns_entries;                                                                     // 131
        for (var i = 0; i < addresses.length; i++) {                                                                 // 132
          if (!addresses[i].Type) return callback('Could not find Type field in Enclout API result. Has the format changed?');
          if (addresses[i].Type === 'MX') user = processMXRecords(addresses[i].RData, user);                         // 134
        }                                                                                                            // 135
        // Either nothing matched, or some MX record did, and `user` was changed. Yes, multiple records could in theory match, but how would anyone decide in that case how to treat the user part?
        return callback(null, user + '@' + domain);                                                                  // 137
      });                                                                                                            // 138
    } else {                                                                                                         // 139
      // On the server, we can use directly https://nodejs.org/api/dns.html#dns_dns_resolvemx_hostname_callback      // 140
      var resolveMx = Meteor.wrapAsync(Npm.require('dns').resolveMx);                                                // 141
      if (typeof callback === 'function') {                                                                          // 142
        resolveMx(domain, function (error, addresses) {                                                              // 143
          if (error) return callback(error);                                                                         // 144
                                                                                                                     // 145
          for (var i = 0; i < addresses.length; i++) {                                                               // 146
            user = processMXRecords(addresses[i].exchange, user);                                                    // 147
          }                                                                                                          // 148
          // nothing matched                                                                                         // 149
          return callback(null, user + '@' + domain);                                                                // 150
        });                                                                                                          // 151
      } else {                                                                                                       // 152
        // synchronous server code                                                                                   // 153
        var addresses = resolveMx(domain);                                                                           // 154
        for (var i = 0; i < addresses.length; i++ ) {                                                                // 155
          user = processMXRecords(addresses[i].exchange, user);                                                      // 156
        }                                                                                                            // 157
        return user + '@' + domain;                                                                                  // 158
      }                                                                                                              // 159
    }                                                                                                                // 160
  }                                                                                                                  // 161
                                                                                                                     // 162
  return user + '@' + domain;                                                                                        // 163
};                                                                                                                   // 164
                                                                                                                     // 165
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                     // 175
}).call(this);                                                       // 176
                                                                     // 177
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['idorecall:email-normalize'] = {
  Email: Email
};

})();

//# sourceMappingURL=idorecall_email-normalize.js.map
