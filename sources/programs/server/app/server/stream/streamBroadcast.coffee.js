(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/stream/streamBroadcast.coffee.js                             //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var authorizeConnection, logger;                                       // 1
                                                                       //
logger = new Logger('StreamBroadcast', {                               // 1
  sections: {                                                          // 2
    connection: 'Connection',                                          // 3
    auth: 'Auth',                                                      // 3
    stream: 'Stream'                                                   // 3
  }                                                                    //
});                                                                    //
                                                                       //
authorizeConnection = function(connection) {                           // 1
  logger.auth.info("Authorizing with localhost:" + connection.instanceRecord.extraInformation.port);
  return connection.call('broadcastAuth', connection.instanceRecord._id, InstanceStatus.id(), function(err, ok) {
    connection.broadcastAuth = ok;                                     // 10
    return logger.auth.info("broadcastAuth with localhost:" + connection.instanceRecord.extraInformation.port, ok);
  });                                                                  //
};                                                                     // 7
                                                                       //
this.connections = {};                                                 // 1
                                                                       //
this.startStreamBroadcast = function() {                               // 1
  var broadcast;                                                       // 15
  logger.info('startStreamBroadcast');                                 // 15
  InstanceStatus.getCollection().find({                                // 15
    'extraInformation.port': {                                         // 19
      $exists: true                                                    // 19
    }                                                                  //
  }, {                                                                 //
    sort: {                                                            // 19
      _createdAt: -1                                                   // 19
    }                                                                  //
  }).observe({                                                         //
    added: function(record) {                                          // 20
      var ref;                                                         // 21
      if (record.extraInformation.port === process.env.PORT) {         // 21
        return;                                                        // 22
      }                                                                //
      if (((ref = connections[record.extraInformation.port]) != null ? ref.instanceRecord : void 0) != null) {
        if (connections[record.extraInformation.port].instanceRecord._createdAt < record._createdAt) {
          connections[record.extraInformation.port].disconnect();      // 26
          delete connections[record.extraInformation.port];            // 26
        } else {                                                       //
          return;                                                      // 29
        }                                                              //
      }                                                                //
      logger.connection.info('connecting in', "localhost:" + record.extraInformation.port);
      connections[record.extraInformation.port] = DDP.connect("localhost:" + record.extraInformation.port, {
        _dontPrintErrors: true                                         // 32
      });                                                              //
      connections[record.extraInformation.port].instanceRecord = record;
      authorizeConnection(connections[record.extraInformation.port]);  // 21
      return connections[record.extraInformation.port].onReconnect = function() {
        return authorizeConnection(connections[record.extraInformation.port]);
      };                                                               //
    },                                                                 //
    removed: function(record) {                                        // 20
      if ((connections[record.extraInformation.port] != null) && (InstanceStatus.getCollection().findOne({
        'extraInformation.port': record.extraInformation.port          //
      }) == null)) {                                                   //
        logger.connection.info('disconnecting from', "localhost:" + record.extraInformation.port);
        connections[record.extraInformation.port].disconnect();        // 40
        return delete connections[record.extraInformation.port];       //
      }                                                                //
    }                                                                  //
  });                                                                  //
  broadcast = function(streamName, eventName, args, userId) {          // 15
    var connection, port, results;                                     // 45
    results = [];                                                      // 45
    for (port in connections) {                                        //
      connection = connections[port];                                  //
      results.push((function(port, connection) {                       // 46
        if (connection.status().connected === true) {                  // 47
          return connection.call('stream', streamName, eventName, args, function(error, response) {
            if (error != null) {                                       // 49
              logger.error("Stream broadcast error", error);           // 50
            }                                                          //
            switch (response) {                                        // 52
              case 'self-not-authorized':                              // 52
                logger.stream.error(("Stream broadcast from:" + process.env.PORT + " to:" + connection._stream.endpoint + " with name " + streamName + " to self is not authorized").red);
                logger.stream.debug("    -> connection authorized".red, connection.broadcastAuth);
                logger.stream.debug("    -> connection status".red, connection.status());
                return logger.stream.debug("    -> arguments".red, eventName, args);
              case 'not-authorized':                                   // 52
                logger.stream.error(("Stream broadcast from:" + process.env.PORT + " to:" + connection._stream.endpoint + " with name " + streamName + " not authorized").red);
                logger.stream.debug("    -> connection authorized".red, connection.broadcastAuth);
                logger.stream.debug("    -> connection status".red, connection.status());
                logger.stream.debug("    -> arguments".red, eventName, args);
                return authorizeConnection(connection);                //
              case 'stream-not-exists':                                // 52
                logger.stream.error(("Stream broadcast from:" + process.env.PORT + " to:" + connection._stream.endpoint + " with name " + streamName + " does not exists").red);
                logger.stream.debug("    -> connection authorized".red, connection.broadcastAuth);
                logger.stream.debug("    -> connection status".red, connection.status());
                return logger.stream.debug("    -> arguments".red, eventName, args);
            }                                                          // 52
          });                                                          //
        }                                                              //
      })(port, connection));                                           //
    }                                                                  // 45
    return results;                                                    //
  };                                                                   //
  Meteor.methods({                                                     // 15
    showConnections: function() {                                      // 74
      var connection, data, port;                                      // 75
      data = {};                                                       // 75
      for (port in connections) {                                      // 76
        connection = connections[port];                                //
        data[port] = {                                                 // 77
          status: connection.status(),                                 // 78
          broadcastAuth: connection.broadcastAuth                      // 78
        };                                                             //
      }                                                                // 76
      return data;                                                     // 80
    }                                                                  //
  });                                                                  //
  Meteor.StreamerCentral.on('broadcast', function(streamName, eventName, args) {
    return broadcast(streamName, eventName, args);                     //
  });                                                                  //
  return Meteor.methods({                                              //
    broadcastAuth: function(selfId, remoteId) {                        // 86
      check(selfId, String);                                           // 87
      check(remoteId, String);                                         // 87
      this.unblock();                                                  // 87
      if (selfId === InstanceStatus.id() && remoteId !== InstanceStatus.id() && (InstanceStatus.getCollection().findOne({
        _id: remoteId                                                  //
      }) != null)) {                                                   //
        this.connection.broadcastAuth = true;                          // 92
      }                                                                //
      return this.connection.broadcastAuth === true;                   // 94
    },                                                                 //
    stream: function(streamName, eventName, args) {                    // 86
      if (this.connection == null) {                                   // 98
        return 'self-not-authorized';                                  // 99
      }                                                                //
      if (this.connection.broadcastAuth !== true) {                    // 102
        return 'not-authorized';                                       // 103
      }                                                                //
      if (Meteor.StreamerCentral.instances[streamName] == null) {      // 105
        return 'stream-not-exists';                                    // 106
      }                                                                //
      Meteor.StreamerCentral.instances[streamName]._emit(eventName, args);
      return void 0;                                                   // 110
    }                                                                  //
  });                                                                  //
};                                                                     // 14
                                                                       //
Meteor.startup(function() {                                            // 1
  return startStreamBroadcast();                                       //
});                                                                    // 113
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=streamBroadcast.coffee.js.map
