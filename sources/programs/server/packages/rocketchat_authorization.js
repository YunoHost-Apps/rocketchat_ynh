(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/lib/rocketchat.coffee.js                                              //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz = {};                                                                                     // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/models/Permissions.coffee.js                                   //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                             //
                                                                                                           //
RocketChat.models.Permissions = new ((function(superClass) {                                               // 1
  extend(_Class, superClass);                                                                              // 2
                                                                                                           //
  function _Class() {                                                                                      // 2
    this._initModel('permissions');                                                                        // 3
  }                                                                                                        //
                                                                                                           //
  _Class.prototype.findByRole = function(role, options) {                                                  // 2
    var query;                                                                                             // 7
    query = {                                                                                              // 7
      roles: role                                                                                          // 8
    };                                                                                                     //
    return this.find(query, options);                                                                      // 10
  };                                                                                                       //
                                                                                                           //
  _Class.prototype.findOneById = function(_id) {                                                           // 2
    return this.findOne(_id);                                                                              // 13
  };                                                                                                       //
                                                                                                           //
  _Class.prototype.createOrUpdate = function(name, roles) {                                                // 2
    return this.upsert({                                                                                   //
      _id: name                                                                                            // 16
    }, {                                                                                                   //
      $set: {                                                                                              // 16
        roles: roles                                                                                       // 16
      }                                                                                                    //
    });                                                                                                    //
  };                                                                                                       //
                                                                                                           //
  _Class.prototype.addRole = function(permission, role) {                                                  // 2
    return this.update({                                                                                   //
      _id: permission                                                                                      // 19
    }, {                                                                                                   //
      $addToSet: {                                                                                         // 19
        roles: role                                                                                        // 19
      }                                                                                                    //
    });                                                                                                    //
  };                                                                                                       //
                                                                                                           //
  _Class.prototype.removeRole = function(permission, role) {                                               // 2
    return this.update({                                                                                   //
      _id: permission                                                                                      // 22
    }, {                                                                                                   //
      $pull: {                                                                                             // 22
        roles: role                                                                                        // 22
      }                                                                                                    //
    });                                                                                                    //
  };                                                                                                       //
                                                                                                           //
  return _Class;                                                                                           //
                                                                                                           //
})(RocketChat.models._Base));                                                                              //
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/models/Roles.coffee.js                                         //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                             //
                                                                                                           //
RocketChat.models.Roles = new ((function(superClass) {                                                     // 1
  extend(_Class, superClass);                                                                              // 2
                                                                                                           //
  function _Class() {                                                                                      // 2
    this._initModel('roles');                                                                              // 3
    this.tryEnsureIndex({                                                                                  // 3
      'name': 1                                                                                            // 4
    });                                                                                                    //
    this.tryEnsureIndex({                                                                                  // 3
      'scope': 1                                                                                           // 5
    });                                                                                                    //
  }                                                                                                        //
                                                                                                           //
  _Class.prototype.findUsersInRole = function(name, scope, options) {                                      // 2
    var ref, role, roleScope;                                                                              // 8
    role = this.findOne(name);                                                                             // 8
    roleScope = (role != null ? role.scope : void 0) || 'Users';                                           // 8
    return (ref = RocketChat.models[roleScope]) != null ? typeof ref.findUsersInRoles === "function" ? ref.findUsersInRoles(name, scope, options) : void 0 : void 0;
  };                                                                                                       //
                                                                                                           //
  _Class.prototype.isUserInRoles = function(userId, roles, scope) {                                        // 2
    roles = [].concat(roles);                                                                              // 13
    return _.some(roles, (function(_this) {                                                                //
      return function(roleName) {                                                                          //
        var ref, role, roleScope;                                                                          // 15
        role = _this.findOne(roleName);                                                                    // 15
        roleScope = (role != null ? role.scope : void 0) || 'Users';                                       // 15
        return (ref = RocketChat.models[roleScope]) != null ? typeof ref.isUserInRole === "function" ? ref.isUserInRole(userId, roleName, scope) : void 0 : void 0;
      };                                                                                                   //
    })(this));                                                                                             //
  };                                                                                                       //
                                                                                                           //
  _Class.prototype.createOrUpdate = function(name, scope, description, protectedRole) {                    // 2
    var updateData;                                                                                        // 20
    if (scope == null) {                                                                                   //
      scope = 'Users';                                                                                     //
    }                                                                                                      //
    updateData = {};                                                                                       // 20
    updateData.name = name;                                                                                // 20
    updateData.scope = scope;                                                                              // 20
    if (description != null) {                                                                             // 24
      updateData.description = description;                                                                // 25
    }                                                                                                      //
    if (protectedRole != null) {                                                                           // 26
      updateData["protected"] = protectedRole;                                                             // 27
    }                                                                                                      //
    return this.upsert({                                                                                   //
      _id: name                                                                                            // 29
    }, {                                                                                                   //
      $set: updateData                                                                                     // 29
    });                                                                                                    //
  };                                                                                                       //
                                                                                                           //
  _Class.prototype.addUserRoles = function(userId, roles, scope) {                                         // 2
    var i, len, ref, results, role, roleName, roleScope;                                                   // 32
    roles = [].concat(roles);                                                                              // 32
    results = [];                                                                                          // 33
    for (i = 0, len = roles.length; i < len; i++) {                                                        //
      roleName = roles[i];                                                                                 //
      role = this.findOne(roleName);                                                                       // 34
      roleScope = (role != null ? role.scope : void 0) || 'Users';                                         // 34
      results.push((ref = RocketChat.models[roleScope]) != null ? typeof ref.addRolesByUserId === "function" ? ref.addRolesByUserId(userId, roleName, scope) : void 0 : void 0);
    }                                                                                                      // 33
    return results;                                                                                        //
  };                                                                                                       //
                                                                                                           //
  _Class.prototype.removeUserRoles = function(userId, roles, scope) {                                      // 2
    var i, len, ref, results, role, roleName, roleScope;                                                   // 39
    roles = [].concat(roles);                                                                              // 39
    results = [];                                                                                          // 40
    for (i = 0, len = roles.length; i < len; i++) {                                                        //
      roleName = roles[i];                                                                                 //
      role = this.findOne(roleName);                                                                       // 41
      roleScope = (role != null ? role.scope : void 0) || 'Users';                                         // 41
      results.push((ref = RocketChat.models[roleScope]) != null ? typeof ref.removeRolesByUserId === "function" ? ref.removeRolesByUserId(userId, roleName, scope) : void 0 : void 0);
    }                                                                                                      // 40
    return results;                                                                                        //
  };                                                                                                       //
                                                                                                           //
  return _Class;                                                                                           //
                                                                                                           //
})(RocketChat.models._Base));                                                                              //
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/models/Base.js                                                 //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
RocketChat.models._Base.prototype.roleBaseQuery = function () /*userId, scope*/{                           // 1
	return {};                                                                                                // 2
};                                                                                                         //
                                                                                                           //
RocketChat.models._Base.prototype.findRolesByUserId = function (userId /*, options*/) {                    // 5
	var query = this.roleBaseQuery(userId);                                                                   // 6
	return this.find(query, { fields: { roles: 1 } });                                                        // 7
};                                                                                                         //
                                                                                                           //
RocketChat.models._Base.prototype.isUserInRole = function (userId, roleName, scope) {                      // 10
	var query = this.roleBaseQuery(userId, scope);                                                            // 11
	query.roles = roleName;                                                                                   // 12
	return !_.isUndefined(this.findOne(query));                                                               // 13
};                                                                                                         //
                                                                                                           //
RocketChat.models._Base.prototype.addRolesByUserId = function (userId, roles, scope) {                     // 16
	roles = [].concat(roles);                                                                                 // 17
	var query = this.roleBaseQuery(userId, scope);                                                            // 18
	var update = {                                                                                            // 19
		$addToSet: {                                                                                             // 20
			roles: { $each: roles }                                                                                 // 21
		}                                                                                                        //
	};                                                                                                        //
	return this.update(query, update);                                                                        // 24
};                                                                                                         //
                                                                                                           //
RocketChat.models._Base.prototype.removeRolesByUserId = function (userId, roles, scope) {                  // 27
	roles = [].concat(roles);                                                                                 // 28
	var query = this.roleBaseQuery(userId, scope);                                                            // 29
	var update = {                                                                                            // 30
		$pullAll: {                                                                                              // 31
			roles: roles                                                                                            // 32
		}                                                                                                        //
	};                                                                                                        //
	return this.update(query, update);                                                                        // 35
};                                                                                                         //
                                                                                                           //
RocketChat.models._Base.prototype.findUsersInRoles = function () {                                         // 38
	throw new Meteor.Error('overwrite-function', 'You must overwrite this function in the extended classes');
};                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/models/Users.js                                                //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
RocketChat.models.Users.roleBaseQuery = function (userId) {                                                // 1
	return { _id: userId };                                                                                   // 2
};                                                                                                         //
                                                                                                           //
RocketChat.models.Users.findUsersInRoles = function (roles, scope, options) {                              // 5
	roles = [].concat(roles);                                                                                 // 6
                                                                                                           //
	var query = {                                                                                             // 8
		roles: { $in: roles }                                                                                    // 9
	};                                                                                                        //
                                                                                                           //
	return this.find(query, options);                                                                         // 12
};                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/models/Subscriptions.js                                        //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
RocketChat.models.Subscriptions.roleBaseQuery = function (userId, scope) {                                 // 1
	var query = { 'u._id': userId };                                                                          // 2
	if (!_.isUndefined(scope)) {                                                                              // 3
		query.rid = scope;                                                                                       // 4
	}                                                                                                         //
	return query;                                                                                             // 6
};                                                                                                         //
                                                                                                           //
RocketChat.models.Subscriptions.findUsersInRoles = function (roles, scope, options) {                      // 9
	roles = [].concat(roles);                                                                                 // 10
                                                                                                           //
	var query = {                                                                                             // 12
		roles: { $in: roles }                                                                                    // 13
	};                                                                                                        //
                                                                                                           //
	if (scope) {                                                                                              // 16
		query.rid = scope;                                                                                       // 17
	}                                                                                                         //
                                                                                                           //
	var subscriptions = this.find(query).fetch();                                                             // 20
                                                                                                           //
	var users = _.compact(_.map(subscriptions, function (subscription) {                                      // 22
		if ('undefined' !== typeof subscription.u && 'undefined' !== typeof subscription.u._id) {                // 23
			return subscription.u._id;                                                                              // 24
		}                                                                                                        //
	}));                                                                                                      //
                                                                                                           //
	return RocketChat.models.Users.find({ _id: { $in: users } }, options);                                    // 28
};                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/functions/addUserRoles.coffee.js                               //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz.addUserRoles = function(userId, roleNames, scope) {                                       // 1
  var existingRoleNames, i, invalidRoleNames, len, role, user;                                             // 2
  if (!userId || !roleNames) {                                                                             // 2
    return false;                                                                                          // 3
  }                                                                                                        //
  user = RocketChat.models.Users.findOneById(userId);                                                      // 2
  if (!user) {                                                                                             // 6
    throw new Meteor.Error('invalid-user');                                                                // 7
  }                                                                                                        //
  roleNames = [].concat(roleNames);                                                                        // 2
  existingRoleNames = _.pluck(RocketChat.authz.getRoles(), '_id');                                         // 2
  invalidRoleNames = _.difference(roleNames, existingRoleNames);                                           // 2
  if (!_.isEmpty(invalidRoleNames)) {                                                                      // 13
    for (i = 0, len = invalidRoleNames.length; i < len; i++) {                                             // 14
      role = invalidRoleNames[i];                                                                          //
      RocketChat.models.Roles.createOrUpdate(role);                                                        // 15
    }                                                                                                      // 14
  }                                                                                                        //
  RocketChat.models.Roles.addUserRoles(userId, roleNames, scope);                                          // 2
  return true;                                                                                             // 19
};                                                                                                         // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/functions/getRoles.coffee.js                                   //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz.getRoles = function() {                                                                   // 1
  return RocketChat.models.Roles.find().fetch();                                                           // 2
};                                                                                                         // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/functions/getUsersInRole.coffee.js                             //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz.getUsersInRole = function(roleName, scope, options) {                                     // 1
  return RocketChat.models.Roles.findUsersInRole(roleName, scope, options);                                // 2
};                                                                                                         // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/functions/hasPermission.coffee.js                              //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz.hasPermission = function(userId, permissionId, scope) {                                   // 1
  var permission;                                                                                          // 2
  permission = RocketChat.models.Permissions.findOne(permissionId);                                        // 2
  return RocketChat.models.Roles.isUserInRoles(userId, permission.roles, scope);                           // 3
};                                                                                                         // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/functions/hasRole.coffee.js                                    //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz.hasRole = function(userId, roleNames, scope) {                                            // 1
  roleNames = [].concat(roleNames);                                                                        // 2
  return RocketChat.models.Roles.isUserInRoles(userId, roleNames, scope);                                  // 3
};                                                                                                         // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/functions/removeUserFromRoles.coffee.js                        //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz.removeUserFromRoles = function(userId, roleNames, scope) {                                // 1
  var existingRoleNames, invalidRoleNames, user;                                                           // 2
  if (!userId || !roleNames) {                                                                             // 2
    return false;                                                                                          // 3
  }                                                                                                        //
  user = RocketChat.models.Users.findOneById(userId);                                                      // 2
  if (user == null) {                                                                                      // 6
    throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                         // 7
      "function": 'RocketChat.authz.removeUserRoles'                                                       // 7
    });                                                                                                    //
  }                                                                                                        //
  roleNames = [].concat(roleNames);                                                                        // 2
  existingRoleNames = _.pluck(RocketChat.authz.getRoles(), 'name');                                        // 2
  invalidRoleNames = _.difference(roleNames, existingRoleNames);                                           // 2
  if (!_.isEmpty(invalidRoleNames)) {                                                                      // 13
    throw new Meteor.Error('invalid-role', 'Invalid role', {                                               // 14
      "function": 'RocketChat.authz.removeUserRoles'                                                       // 14
    });                                                                                                    //
  }                                                                                                        //
  RocketChat.models.Roles.removeUserRoles(userId, roleNames, scope);                                       // 2
  return true;                                                                                             // 18
};                                                                                                         // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/publications/permissions.js                                    //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
Meteor.publish('permissions', function () {                                                                // 1
	return RocketChat.models.Permissions.find({});                                                            // 2
});                                                                                                        //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/publications/roles.coffee.js                                   //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('roles', function() {                                                                       // 1
  if (!this.userId) {                                                                                      // 2
    return this.ready();                                                                                   // 3
  }                                                                                                        //
  return RocketChat.models.Roles.find();                                                                   // 5
});                                                                                                        // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/publications/scopedRoles.js                                    //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
/**                                                                                                        //
 * Publish logged-in user's roles so client-side checks can work.                                          //
 */                                                                                                        //
Meteor.publish('scopedRoles', function (scope) {                                                           // 4
	if (!this.userId || _.isUndefined(RocketChat.models[scope]) || !_.isFunction(RocketChat.models[scope].findRolesByUserId)) {
		this.ready();                                                                                            // 6
		return;                                                                                                  // 7
	}                                                                                                         //
                                                                                                           //
	return RocketChat.models[scope].findRolesByUserId(this.userId);                                           // 10
});                                                                                                        //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/publications/usersInRole.coffee.js                             //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('usersInRole', function(roleName, scope, page) {                                            // 1
  var itemsPerPage, pagination;                                                                            // 2
  if (page == null) {                                                                                      //
    page = 1;                                                                                              //
  }                                                                                                        //
  if (!this.userId) {                                                                                      // 2
    return this.ready();                                                                                   // 3
  }                                                                                                        //
  if (!RocketChat.authz.hasPermission(this.userId, 'access-permissions')) {                                // 5
    throw new Meteor.Error("not-authorized");                                                              // 6
  }                                                                                                        //
  itemsPerPage = 20;                                                                                       // 2
  pagination = {                                                                                           // 2
    sort: {                                                                                                // 10
      name: 1                                                                                              // 11
    },                                                                                                     //
    limit: itemsPerPage,                                                                                   // 10
    offset: itemsPerPage * (page - 1)                                                                      // 10
  };                                                                                                       //
  return RocketChat.authz.getUsersInRole(roleName, scope, pagination);                                     // 15
});                                                                                                        // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/methods/addUserToRole.coffee.js                                //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                           // 1
  'authorization:addUserToRole': function(roleName, username, scope) {                                     // 2
    var user;                                                                                              // 3
    if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {      // 3
      throw new Meteor.Error("not-authorized");                                                            // 4
    }                                                                                                      //
    if (!roleName || !_.isString(roleName) || !username || !_.isString(username)) {                        // 6
      throw new Meteor.Error('invalid-arguments');                                                         // 7
    }                                                                                                      //
    user = RocketChat.models.Users.findOneByUsername(username, {                                           // 3
      fields: {                                                                                            // 9
        _id: 1                                                                                             // 9
      }                                                                                                    //
    });                                                                                                    //
    if ((user != null ? user._id : void 0) == null) {                                                      // 11
      throw new Meteor.Error('user-not-found', 'User_not_found');                                          // 12
    }                                                                                                      //
    RocketChat.Notifications.notifyAll('roles-change', {                                                   // 3
      type: 'added',                                                                                       // 14
      _id: roleName,                                                                                       // 14
      u: {                                                                                                 // 14
        _id: user._id,                                                                                     // 14
        username: username                                                                                 // 14
      },                                                                                                   //
      scope: scope                                                                                         // 14
    });                                                                                                    //
    return RocketChat.models.Roles.addUserRoles(user._id, roleName, scope);                                // 16
  }                                                                                                        //
});                                                                                                        //
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/methods/deleteRole.coffee.js                                   //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                           // 1
  'authorization:deleteRole': function(roleName) {                                                         // 2
    var existingUsers, ref, role, roleScope;                                                               // 3
    if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {      // 3
      throw new Meteor.Error("not-authorized");                                                            // 4
    }                                                                                                      //
    role = RocketChat.models.Roles.findOne(roleName);                                                      // 3
    if (role == null) {                                                                                    // 7
      throw new Meteor.Error('invalid-role');                                                              // 8
    }                                                                                                      //
    if (role["protected"]) {                                                                               // 10
      throw new Meteor.Error('protected-role', 'Cannot_delete_a_protected_role');                          // 11
    }                                                                                                      //
    roleScope = role.scope || 'Users';                                                                     // 3
    existingUsers = (ref = RocketChat.models[roleScope]) != null ? typeof ref.findUsersInRoles === "function" ? ref.findUsersInRoles(roleName) : void 0 : void 0;
    if ((existingUsers != null ? existingUsers.count() : void 0) > 0) {                                    // 16
      throw new Meteor.Error('role-in-use', 'Cannot_delete_role_because_its_in_use');                      // 17
    }                                                                                                      //
    return RocketChat.models.Roles.remove(role.name);                                                      // 19
  }                                                                                                        //
});                                                                                                        //
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/methods/removeUserFromRole.coffee.js                           //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                           // 1
  'authorization:removeUserFromRole': function(roleName, username, scope) {                                // 2
    var user;                                                                                              // 3
    if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {      // 3
      throw new Meteor.Error("not-authorized");                                                            // 4
    }                                                                                                      //
    if (!roleName || !_.isString(roleName) || !username || !_.isString(username)) {                        // 6
      throw new Meteor.Error('invalid-arguments');                                                         // 7
    }                                                                                                      //
    user = Meteor.users.findOne({                                                                          // 3
      username: username                                                                                   // 9
    }, {                                                                                                   //
      fields: {                                                                                            // 9
        _id: 1                                                                                             // 9
      }                                                                                                    //
    });                                                                                                    //
    if ((user != null ? user._id : void 0) == null) {                                                      // 11
      throw new Meteor.Error('user-not-found');                                                            // 12
    }                                                                                                      //
    RocketChat.Notifications.notifyAll('roles-change', {                                                   // 3
      type: 'removed',                                                                                     // 14
      _id: roleName,                                                                                       // 14
      u: {                                                                                                 // 14
        _id: user._id,                                                                                     // 14
        username: username                                                                                 // 14
      },                                                                                                   //
      scope: scope                                                                                         // 14
    });                                                                                                    //
    return RocketChat.models.Roles.removeUserRoles(user._id, roleName, scope);                             // 16
  }                                                                                                        //
});                                                                                                        //
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/methods/saveRole.coffee.js                                     //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                           // 1
  'authorization:saveRole': function(roleData) {                                                           // 2
    var ref;                                                                                               // 3
    if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {      // 3
      throw new Meteor.Error("error-not-authorized", 'Not authorized', {                                   // 4
        method: 'authorization:saveRole'                                                                   // 4
      });                                                                                                  //
    }                                                                                                      //
    if (roleData.name == null) {                                                                           // 6
      throw new Meteor.Error('error-role-name-required', 'Role name is required', {                        // 7
        method: 'authorization:saveRole'                                                                   // 7
      });                                                                                                  //
    }                                                                                                      //
    if ((ref = roleData.scope) !== 'Users' && ref !== 'Subscriptions') {                                   // 9
      roleData.scope = 'Users';                                                                            // 10
    }                                                                                                      //
    RocketChat.Notifications.notifyAll('roles-change', {                                                   // 3
      type: 'changed',                                                                                     // 12
      _id: roleData.name                                                                                   // 12
    });                                                                                                    //
    return RocketChat.models.Roles.createOrUpdate(roleData.name, roleData.scope, roleData.description);    // 14
  }                                                                                                        //
});                                                                                                        //
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/methods/addPermissionToRole.coffee.js                          //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                           // 1
  'authorization:addPermissionToRole': function(permission, role) {                                        // 2
    if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {      // 3
      throw new Meteor.Error("not-authorized");                                                            // 4
    }                                                                                                      //
    return RocketChat.models.Permissions.addRole(permission, role);                                        //
  }                                                                                                        //
});                                                                                                        //
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/methods/removeRoleFromPermission.coffee.js                     //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                           // 1
  'authorization:removeRoleFromPermission': function(permission, role) {                                   // 2
    if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {      // 3
      throw new Meteor.Error("not-authorized");                                                            // 4
    }                                                                                                      //
    return RocketChat.models.Permissions.removeRole(permission, role);                                     //
  }                                                                                                        //
});                                                                                                        //
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_authorization/server/startup.coffee.js                                              //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                // 1
  var defaultRoles, i, j, len, len1, permission, permissions, results, role;                               // 7
  permissions = [                                                                                          // 7
    {                                                                                                      //
      _id: 'access-permissions',                                                                           // 8
      roles: ['admin']                                                                                     // 8
    }, {                                                                                                   //
      _id: 'add-oauth-service',                                                                            // 9
      roles: ['admin']                                                                                     // 9
    }, {                                                                                                   //
      _id: 'add-user-to-room',                                                                             // 10
      roles: ['admin', 'owner', 'moderator']                                                               // 10
    }, {                                                                                                   //
      _id: 'archive-room',                                                                                 // 11
      roles: ['admin', 'owner']                                                                            // 11
    }, {                                                                                                   //
      _id: 'assign-admin-role',                                                                            // 12
      roles: ['admin']                                                                                     // 12
    }, {                                                                                                   //
      _id: 'ban-user',                                                                                     // 13
      roles: ['admin', 'moderator', 'owner']                                                               // 13
    }, {                                                                                                   //
      _id: 'bulk-create-c',                                                                                // 14
      roles: ['admin']                                                                                     // 14
    }, {                                                                                                   //
      _id: 'bulk-register-user',                                                                           // 15
      roles: ['admin']                                                                                     // 15
    }, {                                                                                                   //
      _id: 'create-c',                                                                                     // 16
      roles: ['admin', 'user']                                                                             // 16
    }, {                                                                                                   //
      _id: 'create-p',                                                                                     // 17
      roles: ['admin', 'user']                                                                             // 17
    }, {                                                                                                   //
      _id: 'create-user',                                                                                  // 18
      roles: ['admin']                                                                                     // 18
    }, {                                                                                                   //
      _id: 'delete-c',                                                                                     // 19
      roles: ['admin']                                                                                     // 19
    }, {                                                                                                   //
      _id: 'delete-d',                                                                                     // 20
      roles: ['admin']                                                                                     // 20
    }, {                                                                                                   //
      _id: 'delete-message',                                                                               // 21
      roles: ['admin', 'moderator', 'owner']                                                               // 21
    }, {                                                                                                   //
      _id: 'delete-p',                                                                                     // 22
      roles: ['admin']                                                                                     // 22
    }, {                                                                                                   //
      _id: 'delete-user',                                                                                  // 23
      roles: ['admin']                                                                                     // 23
    }, {                                                                                                   //
      _id: 'edit-message',                                                                                 // 24
      roles: ['admin', 'moderator', 'owner']                                                               // 24
    }, {                                                                                                   //
      _id: 'edit-other-user-active-status',                                                                // 25
      roles: ['admin']                                                                                     // 25
    }, {                                                                                                   //
      _id: 'edit-other-user-info',                                                                         // 26
      roles: ['admin']                                                                                     // 26
    }, {                                                                                                   //
      _id: 'edit-other-user-password',                                                                     // 27
      roles: ['admin']                                                                                     // 27
    }, {                                                                                                   //
      _id: 'edit-privileged-setting',                                                                      // 28
      roles: ['admin']                                                                                     // 28
    }, {                                                                                                   //
      _id: 'edit-room',                                                                                    // 29
      roles: ['admin', 'moderator', 'owner']                                                               // 29
    }, {                                                                                                   //
      _id: 'manage-assets',                                                                                // 30
      roles: ['admin']                                                                                     // 30
    }, {                                                                                                   //
      _id: 'manage-integrations',                                                                          // 31
      roles: ['admin', 'bot']                                                                              // 31
    }, {                                                                                                   //
      _id: 'manage-oauth-apps',                                                                            // 32
      roles: ['admin']                                                                                     // 32
    }, {                                                                                                   //
      _id: 'mute-user',                                                                                    // 33
      roles: ['admin', 'moderator', 'owner']                                                               // 33
    }, {                                                                                                   //
      _id: 'remove-user',                                                                                  // 34
      roles: ['admin', 'moderator', 'owner']                                                               // 34
    }, {                                                                                                   //
      _id: 'run-import',                                                                                   // 35
      roles: ['admin']                                                                                     // 35
    }, {                                                                                                   //
      _id: 'run-migration',                                                                                // 36
      roles: ['admin']                                                                                     // 36
    }, {                                                                                                   //
      _id: 'set-moderator',                                                                                // 37
      roles: ['admin', 'owner']                                                                            // 37
    }, {                                                                                                   //
      _id: 'set-owner',                                                                                    // 38
      roles: ['admin', 'owner']                                                                            // 38
    }, {                                                                                                   //
      _id: 'unarchive-room',                                                                               // 39
      roles: ['admin']                                                                                     // 39
    }, {                                                                                                   //
      _id: 'view-c-room',                                                                                  // 40
      roles: ['admin', 'user', 'bot']                                                                      // 40
    }, {                                                                                                   //
      _id: 'view-d-room',                                                                                  // 41
      roles: ['admin', 'user']                                                                             // 41
    }, {                                                                                                   //
      _id: 'view-full-other-user-info',                                                                    // 42
      roles: ['admin']                                                                                     // 42
    }, {                                                                                                   //
      _id: 'view-logs',                                                                                    // 43
      roles: ['admin']                                                                                     // 43
    }, {                                                                                                   //
      _id: 'view-other-user-channels',                                                                     // 44
      roles: ['admin']                                                                                     // 44
    }, {                                                                                                   //
      _id: 'view-p-room',                                                                                  // 45
      roles: ['admin', 'user']                                                                             // 45
    }, {                                                                                                   //
      _id: 'view-privileged-setting',                                                                      // 46
      roles: ['admin']                                                                                     // 46
    }, {                                                                                                   //
      _id: 'view-room-administration',                                                                     // 47
      roles: ['admin']                                                                                     // 47
    }, {                                                                                                   //
      _id: 'view-statistics',                                                                              // 48
      roles: ['admin']                                                                                     // 48
    }, {                                                                                                   //
      _id: 'view-user-administration',                                                                     // 49
      roles: ['admin']                                                                                     // 49
    }                                                                                                      //
  ];                                                                                                       //
  for (i = 0, len = permissions.length; i < len; i++) {                                                    // 52
    permission = permissions[i];                                                                           //
    if (RocketChat.models.Permissions.findOneById(permission._id) == null) {                               // 53
      RocketChat.models.Permissions.upsert(permission._id, {                                               // 54
        $set: permission                                                                                   // 54
      });                                                                                                  //
    }                                                                                                      //
  }                                                                                                        // 52
  defaultRoles = [                                                                                         // 7
    {                                                                                                      //
      name: 'admin',                                                                                       // 57
      scope: 'Users',                                                                                      // 57
      description: 'Admin'                                                                                 // 57
    }, {                                                                                                   //
      name: 'moderator',                                                                                   // 58
      scope: 'Subscriptions',                                                                              // 58
      description: 'Moderator'                                                                             // 58
    }, {                                                                                                   //
      name: 'owner',                                                                                       // 59
      scope: 'Subscriptions',                                                                              // 59
      description: 'Owner'                                                                                 // 59
    }, {                                                                                                   //
      name: 'user',                                                                                        // 60
      scope: 'Users',                                                                                      // 60
      description: ''                                                                                      // 60
    }, {                                                                                                   //
      name: 'bot',                                                                                         // 61
      scope: 'Users',                                                                                      // 61
      description: ''                                                                                      // 61
    }                                                                                                      //
  ];                                                                                                       //
  results = [];                                                                                            // 64
  for (j = 0, len1 = defaultRoles.length; j < len1; j++) {                                                 //
    role = defaultRoles[j];                                                                                //
    results.push(RocketChat.models.Roles.upsert({                                                          // 65
      _id: role.name                                                                                       // 65
    }, {                                                                                                   //
      $setOnInsert: {                                                                                      // 65
        scope: role.scope,                                                                                 // 65
        description: role.description || '',                                                               // 65
        "protected": true                                                                                  // 65
      }                                                                                                    //
    }));                                                                                                   //
  }                                                                                                        // 64
  return results;                                                                                          //
});                                                                                                        // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:authorization'] = {};

})();

//# sourceMappingURL=rocketchat_authorization.js.map
