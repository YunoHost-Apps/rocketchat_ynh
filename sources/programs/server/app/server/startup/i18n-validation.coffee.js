(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/i18n-validation.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var flat;                                                              // 1
                                                                       //
flat = function(obj, newObj, path) {                                   // 1
  var key, value;                                                      // 2
  if (newObj == null) {                                                //
    newObj = {};                                                       //
  }                                                                    //
  if (path == null) {                                                  //
    path = '';                                                         //
  }                                                                    //
  for (key in obj) {                                                   // 2
    value = obj[key];                                                  //
    if (_.isObject(value)) {                                           // 3
      flat(value, newObj, key + '.');                                  // 4
    } else {                                                           //
      newObj[path + key] = value;                                      // 6
    }                                                                  //
  }                                                                    // 2
  return newObj;                                                       // 8
};                                                                     // 1
                                                                       //
Meteor.startup(function() {                                            // 1
  var error, errors, i, key, keys, l, lang, langs, len, len1, present, ref, ref1, value;
  return;                                                              // 12
  l = {};                                                              // 12
  keys = {};                                                           // 12
  errors = [];                                                         // 12
  langs = Object.keys(TAPi18next.options.resStore);                    // 12
  ref = TAPi18next.options.resStore;                                   // 18
  for (lang in ref) {                                                  // 18
    value = ref[lang];                                                 //
    l[lang] = flat(value);                                             // 19
    ref1 = l[lang];                                                    // 20
    for (key in ref1) {                                                // 20
      value = ref1[key];                                               //
      if (keys[key] == null) {                                         //
        keys[key] = [];                                                //
      }                                                                //
      keys[key].push(lang);                                            // 21
    }                                                                  // 20
  }                                                                    // 18
  len = 0;                                                             // 12
  for (key in keys) {                                                  // 25
    present = keys[key];                                               //
    if (!(present.length !== langs.length)) {                          //
      continue;                                                        //
    }                                                                  //
    error = ((_.difference(langs, present).join(',')) + ": missing translation for ").red + key.white + (". Present in [" + (present.join(',')) + "]").red;
    errors.push(error);                                                // 26
    if (error.length > len) {                                          // 28
      len = error.length;                                              // 29
    }                                                                  //
  }                                                                    // 25
  if (errors.length > 0) {                                             // 31
    console.log("+".red + s.rpad('', len - 28, '-').red + "+".red);    // 32
    for (i = 0, len1 = errors.length; i < len1; i++) {                 // 33
      error = errors[i];                                               //
      console.log("|".red, s.rpad("" + error, len).red, "|".red);      // 34
    }                                                                  // 33
    return console.log("+".red + s.rpad('', len - 28, '-').red + "+".red);
  }                                                                    //
});                                                                    // 11
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=i18n-validation.coffee.js.map
