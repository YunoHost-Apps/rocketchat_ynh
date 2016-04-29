(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var BlazeLayout;



/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['kadira:blaze-layout'] = {
  BlazeLayout: BlazeLayout
};

})();

//# sourceMappingURL=kadira_blaze-layout.js.map
