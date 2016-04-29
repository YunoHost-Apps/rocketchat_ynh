(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/todda00_friendly-slugs/slugs.coffee.js                                                                  //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Mongo, slugify, stringToNested;                                                                                 // 2
                                                                                                                    //
if (typeof Mongo === "undefined") {                                                                                 // 2
  Mongo = {};                                                                                                       // 3
  Mongo.Collection = Meteor.Collection;                                                                             // 3
}                                                                                                                   //
                                                                                                                    //
Mongo.Collection.prototype.friendlySlugs = function(options) {                                                      // 2
  var collection, fsDebug, runSlug;                                                                                 // 7
  if (options == null) {                                                                                            //
    options = {};                                                                                                   //
  }                                                                                                                 //
  collection = this;                                                                                                // 7
  if (!_.isArray(options)) {                                                                                        // 9
    options = [options];                                                                                            // 10
  }                                                                                                                 //
  _.each(options, function(opts) {                                                                                  // 7
    var defaults, fields;                                                                                           // 13
    if (_.isString(opts)) {                                                                                         // 13
      opts = {                                                                                                      // 14
        slugFrom: opts                                                                                              // 14
      };                                                                                                            //
    }                                                                                                               //
    defaults = {                                                                                                    // 13
      slugFrom: 'name',                                                                                             // 19
      slugField: 'slug',                                                                                            // 19
      distinct: true,                                                                                               // 19
      distinctUpTo: [],                                                                                             // 19
      updateSlug: true,                                                                                             // 19
      createOnUpdate: true,                                                                                         // 19
      maxLength: 0,                                                                                                 // 19
      debug: false,                                                                                                 // 19
      transliteration: [                                                                                            // 19
        {                                                                                                           //
          from: 'àáâäåãа',                                                                                          // 28
          to: 'a'                                                                                                   // 28
        }, {                                                                                                        //
          from: 'б',                                                                                                // 29
          to: 'b'                                                                                                   // 29
        }, {                                                                                                        //
          from: 'ç',                                                                                                // 30
          to: 'c'                                                                                                   // 30
        }, {                                                                                                        //
          from: 'д',                                                                                                // 31
          to: 'd'                                                                                                   // 31
        }, {                                                                                                        //
          from: 'èéêëẽэе',                                                                                          // 32
          to: 'e'                                                                                                   // 32
        }, {                                                                                                        //
          from: 'ф',                                                                                                // 33
          to: 'f'                                                                                                   // 33
        }, {                                                                                                        //
          from: 'г',                                                                                                // 34
          to: 'g'                                                                                                   // 34
        }, {                                                                                                        //
          from: 'х',                                                                                                // 35
          to: 'h'                                                                                                   // 35
        }, {                                                                                                        //
          from: 'ìíîïи',                                                                                            // 36
          to: 'i'                                                                                                   // 36
        }, {                                                                                                        //
          from: 'к',                                                                                                // 37
          to: 'k'                                                                                                   // 37
        }, {                                                                                                        //
          from: 'л',                                                                                                // 38
          to: 'l'                                                                                                   // 38
        }, {                                                                                                        //
          from: 'м',                                                                                                // 39
          to: 'm'                                                                                                   // 39
        }, {                                                                                                        //
          from: 'ñн',                                                                                               // 40
          to: 'n'                                                                                                   // 40
        }, {                                                                                                        //
          from: 'òóôöõо',                                                                                           // 41
          to: 'o'                                                                                                   // 41
        }, {                                                                                                        //
          from: 'п',                                                                                                // 42
          to: 'p'                                                                                                   // 42
        }, {                                                                                                        //
          from: 'р',                                                                                                // 43
          to: 'r'                                                                                                   // 43
        }, {                                                                                                        //
          from: 'с',                                                                                                // 44
          to: 's'                                                                                                   // 44
        }, {                                                                                                        //
          from: 'т',                                                                                                // 45
          to: 't'                                                                                                   // 45
        }, {                                                                                                        //
          from: 'ùúûüу',                                                                                            // 46
          to: 'u'                                                                                                   // 46
        }, {                                                                                                        //
          from: 'в',                                                                                                // 47
          to: 'v'                                                                                                   // 47
        }, {                                                                                                        //
          from: 'йы',                                                                                               // 48
          to: 'y'                                                                                                   // 48
        }, {                                                                                                        //
          from: 'з',                                                                                                // 49
          to: 'z'                                                                                                   // 49
        }, {                                                                                                        //
          from: 'æ',                                                                                                // 50
          to: 'ae'                                                                                                  // 50
        }, {                                                                                                        //
          from: 'ч',                                                                                                // 51
          to: 'ch'                                                                                                  // 51
        }, {                                                                                                        //
          from: 'щ',                                                                                                // 52
          to: 'sch'                                                                                                 // 52
        }, {                                                                                                        //
          from: 'ш',                                                                                                // 53
          to: 'sh'                                                                                                  // 53
        }, {                                                                                                        //
          from: 'ц',                                                                                                // 54
          to: 'ts'                                                                                                  // 54
        }, {                                                                                                        //
          from: 'я',                                                                                                // 55
          to: 'ya'                                                                                                  // 55
        }, {                                                                                                        //
          from: 'ю',                                                                                                // 56
          to: 'yu'                                                                                                  // 56
        }, {                                                                                                        //
          from: 'ж',                                                                                                // 57
          to: 'zh'                                                                                                  // 57
        }, {                                                                                                        //
          from: 'ъь',                                                                                               // 58
          to: ''                                                                                                    // 58
        }                                                                                                           //
      ]                                                                                                             //
    };                                                                                                              //
    _.defaults(opts, defaults);                                                                                     // 13
    fields = {                                                                                                      // 13
      slugFrom: String,                                                                                             // 64
      slugField: String,                                                                                            // 64
      distinct: Boolean,                                                                                            // 64
      updateSlug: Boolean,                                                                                          // 64
      createOnUpdate: Boolean,                                                                                      // 64
      maxLength: Number,                                                                                            // 64
      debug: Boolean                                                                                                // 64
    };                                                                                                              //
    check(opts, Match.ObjectIncluding(fields));                                                                     // 13
    collection.before.insert(function(userId, doc) {                                                                // 13
      fsDebug(opts, 'before.insert function');                                                                      // 75
      runSlug(doc, opts);                                                                                           // 75
    });                                                                                                             //
    collection.before.update(function(userId, doc, fieldNames, modifier, options) {                                 // 13
      var cleanModifier, slugFromChanged;                                                                           // 80
      fsDebug(opts, 'before.update function');                                                                      // 80
      cleanModifier = function() {                                                                                  // 80
        if (_.isEmpty(modifier.$set)) {                                                                             // 83
          return delete modifier.$set;                                                                              //
        }                                                                                                           //
      };                                                                                                            //
      options = options || {};                                                                                      // 80
      if (options.multi) {                                                                                          // 87
        fsDebug(opts, "multi doc update attempted, can't update slugs this way, leaving.");                         // 88
        return true;                                                                                                // 89
      }                                                                                                             //
      modifier = modifier || {};                                                                                    // 80
      modifier.$set = modifier.$set || {};                                                                          // 80
      if ((doc[opts.slugFrom] == null) && (modifier.$set[opts.slugFrom] == null)) {                                 // 95
        cleanModifier();                                                                                            // 96
        return true;                                                                                                // 97
      }                                                                                                             //
      slugFromChanged = false;                                                                                      // 80
      if (modifier.$set[opts.slugFrom] != null) {                                                                   // 101
        if (doc[opts.slugFrom] !== modifier.$set[opts.slugFrom]) {                                                  // 102
          slugFromChanged = true;                                                                                   // 103
        }                                                                                                           //
      }                                                                                                             //
      fsDebug(opts, slugFromChanged, 'slugFromChanged');                                                            // 80
      if ((doc[opts.slugField] == null) && opts.createOnUpdate) {                                                   // 108
        fsDebug(opts, 'Update: Slug Field is missing and createOnUpdate is set to true');                           // 109
        if (slugFromChanged) {                                                                                      // 111
          fsDebug(opts, 'slugFrom field has changed, runSlug with modifier');                                       // 112
          runSlug(doc, opts, modifier);                                                                             // 112
        } else {                                                                                                    //
          fsDebug(opts, 'runSlug to create');                                                                       // 116
          runSlug(doc, opts, modifier, true);                                                                       // 116
          cleanModifier();                                                                                          // 116
          return true;                                                                                              // 119
        }                                                                                                           //
      } else {                                                                                                      //
        if (opts.updateSlug === false) {                                                                            // 123
          fsDebug(opts, 'updateSlug is false, nothing to do.');                                                     // 124
          cleanModifier();                                                                                          // 124
          return true;                                                                                              // 126
        }                                                                                                           //
        if (stringToNested(doc, opts.slugFrom) === stringToNested(modifier.$set, opts.slugFrom)) {                  // 129
          fsDebug(opts, 'slugFrom field has not changed, nothing to do.');                                          // 130
          cleanModifier();                                                                                          // 130
          return true;                                                                                              // 132
        }                                                                                                           //
        runSlug(doc, opts, modifier);                                                                               // 123
        cleanModifier();                                                                                            // 123
        return true;                                                                                                // 137
      }                                                                                                             //
      cleanModifier();                                                                                              // 80
      return true;                                                                                                  // 140
    });                                                                                                             //
  });                                                                                                               //
  runSlug = function(doc, opts, modifier, create) {                                                                 // 7
    var baseField, defaultSlugGenerator, f, fieldSelector, finalSlug, from, i, index, indexField, limitSelector, ref, result, slugBase, slugGenerator, sortSelector;
    if (modifier == null) {                                                                                         //
      modifier = false;                                                                                             //
    }                                                                                                               //
    if (create == null) {                                                                                           //
      create = false;                                                                                               //
    }                                                                                                               //
    fsDebug(opts, 'Begin runSlug');                                                                                 // 143
    fsDebug(opts, opts, 'Options');                                                                                 // 143
    fsDebug(opts, modifier, 'Modifier');                                                                            // 143
    fsDebug(opts, create, 'Create');                                                                                // 143
    from = create || !modifier ? stringToNested(doc, opts.slugFrom) : stringToNested(modifier.$set, opts.slugFrom);
    fsDebug(opts, from, 'Slugging From');                                                                           // 143
    slugBase = slugify(from, opts.transliteration, opts.maxLength);                                                 // 143
    if (!slugBase) {                                                                                                // 153
      return false;                                                                                                 // 153
    }                                                                                                               //
    fsDebug(opts, slugBase, 'SlugBase before reduction');                                                           // 143
    if (opts.distinct) {                                                                                            // 157
      slugBase = slugBase.replace(/(-\d+)+$/, '');                                                                  // 160
      fsDebug(opts, slugBase, 'SlugBase after reduction');                                                          // 160
      baseField = "friendlySlugs." + opts.slugField + ".base";                                                      // 160
      indexField = "friendlySlugs." + opts.slugField + ".index";                                                    // 160
      fieldSelector = {};                                                                                           // 160
      fieldSelector[baseField] = slugBase;                                                                          // 160
      i = 0;                                                                                                        // 160
      while (i < opts.distinctUpTo.length) {                                                                        // 170
        f = opts.distinctUpTo[i];                                                                                   // 171
        fieldSelector[f] = doc[f];                                                                                  // 171
        i++;                                                                                                        // 171
      }                                                                                                             //
      sortSelector = {};                                                                                            // 160
      sortSelector[indexField] = -1;                                                                                // 160
      limitSelector = {};                                                                                           // 160
      limitSelector[indexField] = 1;                                                                                // 160
      result = collection.findOne(fieldSelector, {                                                                  // 160
        sort: sortSelector,                                                                                         // 182
        fields: limitSelector,                                                                                      // 182
        limit: 1                                                                                                    // 182
      });                                                                                                           //
      fsDebug(opts, result, 'Highest indexed base found');                                                          // 160
      if ((result == null) || (result.friendlySlugs == null) || (result.friendlySlugs[opts.slugField] == null) || (result.friendlySlugs[opts.slugField].index == null)) {
        index = 0;                                                                                                  // 190
      } else {                                                                                                      //
        index = result.friendlySlugs[opts.slugField].index + 1;                                                     // 192
      }                                                                                                             //
      defaultSlugGenerator = function(slugBase, index) {                                                            // 160
        if (index === 0) {                                                                                          // 195
          return slugBase;                                                                                          //
        } else {                                                                                                    //
          return slugBase + '-' + index;                                                                            //
        }                                                                                                           //
      };                                                                                                            //
      slugGenerator = (ref = opts.slugGenerator) != null ? ref : defaultSlugGenerator;                              // 160
      finalSlug = slugGenerator(slugBase, index);                                                                   // 160
    } else {                                                                                                        //
      index = false;                                                                                                // 203
      finalSlug = slugBase;                                                                                         // 203
    }                                                                                                               //
    fsDebug(opts, finalSlug, 'finalSlug');                                                                          // 143
    if (modifier || create) {                                                                                       // 208
      fsDebug(opts, 'Set to modify or create slug on update');                                                      // 209
      modifier = modifier || {};                                                                                    // 209
      modifier.$set = modifier.$set || {};                                                                          // 209
      modifier.$set.friendlySlugs = doc.friendlySlugs || {};                                                        // 209
      modifier.$set.friendlySlugs[opts.slugField] = modifier.$set.friendlySlugs[opts.slugField] || {};              // 209
      modifier.$set.friendlySlugs[opts.slugField].base = slugBase;                                                  // 209
      modifier.$set.friendlySlugs[opts.slugField].index = index;                                                    // 209
      modifier.$set[opts.slugField] = finalSlug;                                                                    // 209
      fsDebug(opts, modifier, 'Final Modifier');                                                                    // 209
    } else {                                                                                                        //
      fsDebug(opts, 'Set to update');                                                                               // 220
      doc.friendlySlugs = doc.friendlySlugs || {};                                                                  // 220
      doc.friendlySlugs[opts.slugField] = doc.friendlySlugs[opts.slugField] || {};                                  // 220
      doc.friendlySlugs[opts.slugField].base = slugBase;                                                            // 220
      doc.friendlySlugs[opts.slugField].index = index;                                                              // 220
      doc[opts.slugField] = finalSlug;                                                                              // 220
      fsDebug(opts, doc, 'Final Doc');                                                                              // 220
    }                                                                                                               //
    return true;                                                                                                    // 227
  };                                                                                                                //
  return fsDebug = function(opts, item, label) {                                                                    //
    if (label == null) {                                                                                            //
      label = '';                                                                                                   //
    }                                                                                                               //
    if (!opts.debug) {                                                                                              // 230
      return;                                                                                                       // 230
    }                                                                                                               //
    if (typeof item === 'object') {                                                                                 // 231
      console.log("friendlySlugs DEBUG: " + label + '↓');                                                           // 232
      return console.log(item);                                                                                     //
    } else {                                                                                                        //
      return console.log("friendlySlugs DEBUG: " + label + '= ' + item);                                            //
    }                                                                                                               //
  };                                                                                                                //
};                                                                                                                  // 6
                                                                                                                    //
slugify = function(text, transliteration, maxLength) {                                                              // 2
  var lastDash, slug;                                                                                               // 238
  if (text == null) {                                                                                               // 238
    return false;                                                                                                   // 238
  }                                                                                                                 //
  if (text.length < 1) {                                                                                            // 239
    return false;                                                                                                   // 239
  }                                                                                                                 //
  text = text.toString().toLowerCase();                                                                             // 238
  _.each(transliteration, function(item) {                                                                          // 238
    return text = text.replace(new RegExp('[' + item.from + ']', 'g'), item.to);                                    //
  });                                                                                                               //
  slug = text.replace(/'/g, '').replace(/[^0-9a-z-]/g, '-').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  if (maxLength > 0 && slug.length > maxLength) {                                                                   // 249
    lastDash = slug.substring(0, maxLength).lastIndexOf('-');                                                       // 250
    slug = slug.substring(0, lastDash);                                                                             // 250
  }                                                                                                                 //
  return slug;                                                                                                      // 252
};                                                                                                                  // 237
                                                                                                                    //
stringToNested = function(obj, path) {                                                                              // 2
  var parts;                                                                                                        // 255
  parts = path.split(".");                                                                                          // 255
  if (parts.length === 1) {                                                                                         // 256
    return obj[parts[0]];                                                                                           // 256
  }                                                                                                                 //
  return stringToNested(obj[parts[0]], parts.slice(1).join("."));                                                   // 257
};                                                                                                                  // 254
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['todda00:friendly-slugs'] = {};

})();

//# sourceMappingURL=todda00_friendly-slugs.js.map
