(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/v009.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                            // 1
  version: 9,                                                          // 2
  up: function() {                                                     // 2
    var toMigrate;                                                     // 7
    toMigrate = [                                                      // 7
      {                                                                //
        source: new Meteor.Collection('data.ChatRoom'),                // 8
        target: RocketChat.models.Rooms.model                          // 8
      }, {                                                             //
        source: new Meteor.Collection('data.ChatSubscription'),        // 12
        target: RocketChat.models.Subscriptions.model                  // 12
      }, {                                                             //
        source: new Meteor.Collection('data.ChatMessage'),             // 16
        target: RocketChat.models.Messages.model                       // 16
      }, {                                                             //
        source: new Meteor.Collection('settings'),                     // 20
        target: Settings                                               // 20
      }, {                                                             //
        source: new Meteor.Collection('oembed_cache'),                 // 24
        target: OEmbed.cache                                           // 24
      }                                                                //
    ];                                                                 //
    return toMigrate.forEach(function(collection) {                    //
      var rawSource, source, target;                                   // 32
      source = collection.source;                                      // 32
      target = collection.target;                                      // 32
      console.log('Migrating data from: ' + source.rawCollection().collectionName + ' to: ' + target.rawCollection().collectionName);
      source.find().forEach(function(doc) {                            // 32
        return target.upsert({                                         //
          _id: doc._id                                                 // 39
        }, doc);                                                       //
      });                                                              //
      rawSource = source.rawCollection();                              // 32
      return Meteor.wrapAsync(rawSource.drop, rawSource)(function(err, res) {
        if (err) {                                                     // 44
          return console.log('Error dropping ' + rawSource.collectionName + ' collection due to: ' + err.errmsg);
        }                                                              //
      });                                                              //
    });                                                                //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=v009.coffee.js.map
