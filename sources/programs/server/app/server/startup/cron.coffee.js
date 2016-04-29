(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/cron.coffee.js                                       //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var generateStatistics, logger;                                        // 2
                                                                       //
logger = new Logger('SyncedCron');                                     // 2
                                                                       //
SyncedCron.config({                                                    // 2
  logger: function(opts) {                                             // 5
    return logger[opts.level].call(logger, opts.message);              //
  },                                                                   //
  collectionName: 'rocketchat_cron_history'                            // 5
});                                                                    //
                                                                       //
generateStatistics = function() {                                      // 2
  var statistics;                                                      // 10
  statistics = RocketChat.statistics.save();                           // 10
  statistics.host = Meteor.absoluteUrl();                              // 10
  if (!RocketChat.settings.get('Statistics_opt_out')) {                // 12
    HTTP.post('https://rocket.chat/stats', {                           // 13
      data: statistics                                                 // 14
    });                                                                //
  }                                                                    //
};                                                                     // 9
                                                                       //
Meteor.startup(function() {                                            // 2
  return Meteor.defer(function() {                                     //
    generateStatistics();                                              // 19
    SyncedCron.add({                                                   // 19
      name: 'Generate and save statistics',                            // 23
      schedule: function(parser) {                                     // 23
        return parser.text('every 1 hour');                            // 25
      },                                                               //
      job: generateStatistics                                          // 23
    });                                                                //
    return SyncedCron.start();                                         //
  });                                                                  //
});                                                                    // 17
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=cron.coffee.js.map
