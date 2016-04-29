(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// server/startup/migrations/xrun.coffee.js                            //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var control;                                                           // 1
                                                                       //
if (RocketChat.Migrations.getVersion() !== 0) {                        // 1
  RocketChat.Migrations.migrateTo('latest');                           // 2
} else {                                                               //
  control = RocketChat.Migrations._getControl();                       // 4
  control.version = _.last(RocketChat.Migrations._list).version;       // 4
  RocketChat.Migrations._setControl(control);                          // 4
}                                                                      //
                                                                       //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=xrun.coffee.js.map
