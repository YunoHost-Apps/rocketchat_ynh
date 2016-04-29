(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var __coffeescriptShare, DelayedTask;

(function(){

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/konecty_delayed-task/packages/konecty_delayed-task.js                  //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
(function () {                                                                     // 1
                                                                                   // 2
//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/konecty:delayed-task/konecty:delayed-task.coffee.js                 //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var                                                                                // 10
  __slice = [].slice;                                                              // 11
                                                                                   // 12
new (DelayedTask = (function() {                                                   // 13
  var count, timer;                                                                // 14
                                                                                   // 15
  timer = null;                                                                    // 16
                                                                                   // 17
  count = 0;                                                                       // 18
                                                                                   // 19
  function DelayedTask() {                                                         // 20
    var args, flushCount, fn, time;                                                // 21
    fn = arguments[0], time = arguments[1], flushCount = arguments[2], args = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
    this.fn = fn;                                                                  // 23
    this.time = time != null ? time : 500;                                         // 24
    this.flushCount = flushCount != null ? flushCount : 0;                         // 25
    this.args = args;                                                              // 26
    return this;                                                                   // 27
  }                                                                                // 28
                                                                                   // 29
  DelayedTask.prototype.run = function() {                                         // 30
    var args, self;                                                                // 31
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];                // 32
    self = this;                                                                   // 33
    return Tracker.nonreactive(function() {                                        // 34
      var call;                                                                    // 35
      if (args.length > 0) {                                                       // 36
        throw new Error('[DelayedTask] Tasks can\'t be called with arguments');    // 37
      }                                                                            // 38
      if (timer != null) {                                                         // 39
        Meteor.clearTimeout(timer);                                                // 40
      }                                                                            // 41
      count++;                                                                     // 42
      call = function() {                                                          // 43
        count = 0;                                                                 // 44
        return self.fn.apply(self, self.args);                                     // 45
      };                                                                           // 46
      if (self.flushCount > 0 && count >= self.flushCount) {                       // 47
        return call();                                                             // 48
      }                                                                            // 49
      return timer = Meteor.setTimeout(call, self.time);                           // 50
    });                                                                            // 51
  };                                                                               // 52
                                                                                   // 53
  return DelayedTask;                                                              // 54
                                                                                   // 55
})());                                                                             // 56
//////////////////////////////////////////////////////////////////////////////////
                                                                                   // 58
}).call(this);                                                                     // 59
                                                                                   // 60
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['konecty:delayed-task'] = {
  DelayedTask: DelayedTask
};

})();

//# sourceMappingURL=konecty_delayed-task.js.map
