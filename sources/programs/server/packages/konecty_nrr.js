(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/konecty_nrr/packages/konecty_nrr.js                                                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
(function () {                                                                                             // 1
                                                                                                           // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/konecty:nrr/konecty:nrr.coffee.js                                                           //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Blaze, HTML, Template;                                                                                 // 10
                                                                                                           // 11
if (Package.templating != null) {                                                                          // 12
  Template = Package.templating.Template;                                                                  // 13
  Blaze = Package.blaze.Blaze;                                                                             // 14
  HTML = Package.htmljs.HTML;                                                                              // 15
  Blaze.toHTMLWithDataNonReactive = function(content, data) {                                              // 16
    var html, key, makeCursorReactive, value, _ref;                                                        // 17
    makeCursorReactive = function(obj) {                                                                   // 18
      if (obj instanceof Meteor.Collection.Cursor) {                                                       // 19
        return obj._depend({                                                                               // 20
          added: true,                                                                                     // 21
          removed: true,                                                                                   // 22
          changed: true                                                                                    // 23
        });                                                                                                // 24
      }                                                                                                    // 25
    };                                                                                                     // 26
    makeCursorReactive(data);                                                                              // 27
    if (data instanceof Spacebars.kw && Object.keys(data.hash).length > 0) {                               // 28
      _ref = data.hash;                                                                                    // 29
      for (key in _ref) {                                                                                  // 30
        value = _ref[key];                                                                                 // 31
        makeCursorReactive(value);                                                                         // 32
      }                                                                                                    // 33
      data = data.hash;                                                                                    // 34
    }                                                                                                      // 35
    html = '';                                                                                             // 36
    Tracker.nonreactive(function() {                                                                       // 37
      return html = Blaze.toHTMLWithData(content, data);                                                   // 38
    });                                                                                                    // 39
    return html;                                                                                           // 40
  };                                                                                                       // 41
  Blaze.registerHelper('nrrargs', function() {                                                             // 42
    var obj;                                                                                               // 43
    obj = {};                                                                                              // 44
    obj._arguments = arguments;                                                                            // 45
    return obj;                                                                                            // 46
  });                                                                                                      // 47
  Blaze.renderNonReactive = function(templateName, data) {                                                 // 48
    var view, _arguments;                                                                                  // 49
    _arguments = this.parentView.dataVar.get()._arguments;                                                 // 50
    templateName = _arguments[0];                                                                          // 51
    data = _arguments[1];                                                                                  // 52
    view = void 0;                                                                                         // 53
    Tracker.nonreactive(function() {                                                                       // 54
      view = new Blaze.View('nrr', function() {                                                            // 55
        return HTML.Raw(Blaze.toHTMLWithDataNonReactive(Template[templateName], data));                    // 56
      });                                                                                                  // 57
      view.onViewReady(function() {                                                                        // 58
        var _ref;                                                                                          // 59
        return (_ref = Template[templateName].onViewReady) != null ? _ref.call(view, data) : void 0;       // 60
      });                                                                                                  // 61
      return view._onViewRendered(function() {                                                             // 62
        var _ref;                                                                                          // 63
        return (_ref = Template[templateName].onViewRendered) != null ? _ref.call(view, data) : void 0;    // 64
      });                                                                                                  // 65
    });                                                                                                    // 66
    return view;                                                                                           // 67
  };                                                                                                       // 68
  Blaze.registerHelper('nrr', Blaze.Template('nrr', Blaze.renderNonReactive));                             // 69
}                                                                                                          // 70
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           // 72
}).call(this);                                                                                             // 73
                                                                                                           // 74
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['konecty:nrr'] = {};

})();

//# sourceMappingURL=konecty_nrr.js.map
