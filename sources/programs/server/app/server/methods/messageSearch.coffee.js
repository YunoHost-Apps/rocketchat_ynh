(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/methods/messageSearch.coffee.js                              //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                       // 1
  messageSearch: function(text, rid, limit) {                          // 2
                                                                       // 3
    /*                                                                 // 3
    			text = 'from:rodrigo mention:gabriel chat'                      //
     */                                                                //
    var from, mention, options, query, result;                         // 3
    result = {                                                         // 3
      messages: [],                                                    // 8
      users: [],                                                       // 8
      channels: []                                                     // 8
    };                                                                 //
    query = {};                                                        // 3
    options = {                                                        // 3
      sort: {                                                          // 14
        ts: -1                                                         // 15
      },                                                               //
      limit: limit || 20                                               // 14
    };                                                                 //
    from = [];                                                         // 3
    text = text.replace(/from:([a-z0-9.-_]+)/ig, function(match, username, index) {
      from.push(username);                                             // 21
      return '';                                                       // 22
    });                                                                //
    if (from.length > 0) {                                             // 24
      query['u.username'] = {                                          // 25
        $regex: from.join('|'),                                        // 26
        $options: 'i'                                                  // 26
      };                                                               //
    }                                                                  //
    mention = [];                                                      // 3
    text = text.replace(/mention:([a-z0-9.-_]+)/ig, function(match, username, index) {
      mention.push(username);                                          // 33
      return '';                                                       // 34
    });                                                                //
    if (mention.length > 0) {                                          // 36
      query['mentions.username'] = {                                   // 37
        $regex: mention.join('|'),                                     // 38
        $options: 'i'                                                  // 38
      };                                                               //
    }                                                                  //
    text = text.trim().replace(/\s\s/g, ' ');                          // 3
    if (text !== '') {                                                 // 44
      query.$text = {                                                  // 45
        $search: text                                                  // 46
      };                                                               //
      options.fields = {                                               // 45
        score: {                                                       // 49
          $meta: "textScore"                                           // 50
        }                                                              //
      };                                                               //
    }                                                                  //
    if (Object.keys(query).length > 0) {                               // 56
      query.t = {                                                      // 57
        $ne: 'rm'                                                      // 57
      };                                                               //
      query._hidden = {                                                // 57
        $ne: true                                                      // 58
      };                                                               //
      if (rid != null) {                                               // 61
        query.rid = rid;                                               // 62
        try {                                                          // 63
          if (Meteor.call('canAccessRoom', rid, this.userId) !== false) {
            result.messages = RocketChat.models.Messages.find(query, options).fetch();
          }                                                            //
        } catch (_error) {}                                            //
      }                                                                //
    }                                                                  //
    return result;                                                     // 115
  }                                                                    //
});                                                                    //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=messageSearch.coffee.js.map
