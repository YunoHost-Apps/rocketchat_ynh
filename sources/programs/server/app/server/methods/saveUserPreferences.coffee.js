(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/saveUserPreferences.coffee.js                        //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  saveUserPreferences: function(settings) {                            // 2
    var preferences;                                                   // 3
    if (Meteor.userId()) {                                             // 3
      preferences = {};                                                // 4
      if (settings.language != null) {                                 // 6
        RocketChat.models.Users.setLanguage(Meteor.userId(), settings.language);
      }                                                                //
      if (settings.disableNewRoomNotification != null) {               // 9
        preferences.disableNewRoomNotification = settings.disableNewRoomNotification === "1" ? true : false;
      }                                                                //
      if (settings.disableNewMessageNotification != null) {            // 12
        preferences.disableNewMessageNotification = settings.disableNewMessageNotification === "1" ? true : false;
      }                                                                //
      if (settings.useEmojis != null) {                                // 15
        preferences.useEmojis = settings.useEmojis === "1" ? true : false;
      }                                                                //
      if (settings.convertAsciiEmoji != null) {                        // 18
        preferences.convertAsciiEmoji = settings.convertAsciiEmoji === "1" ? true : false;
      }                                                                //
      if (settings.saveMobileBandwidth != null) {                      // 21
        preferences.saveMobileBandwidth = settings.saveMobileBandwidth === "1" ? true : false;
      }                                                                //
      if (settings.collapseMediaByDefault != null) {                   // 24
        preferences.collapseMediaByDefault = settings.collapseMediaByDefault === "1" ? true : false;
      }                                                                //
      if (settings.compactView != null) {                              // 27
        preferences.compactView = settings.compactView === "1" ? true : false;
      }                                                                //
      if (settings.unreadRoomsMode != null) {                          // 30
        preferences.unreadRoomsMode = settings.unreadRoomsMode === "1" ? true : false;
      }                                                                //
      if (settings.autoImageLoad != null) {                            // 33
        preferences.autoImageLoad = settings.autoImageLoad === "1" ? true : false;
      }                                                                //
      if (settings.emailNotificationMode != null) {                    // 36
        preferences.emailNotificationMode = settings.emailNotificationMode;
      }                                                                //
      preferences.highlights = settings.highlights;                    // 4
      RocketChat.models.Users.setPreferences(Meteor.userId(), preferences);
      return true;                                                     // 43
    }                                                                  //
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=saveUserPreferences.coffee.js.map
