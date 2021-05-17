module.exports = function(sequelize, DataTypes) {

    var fs              = require('fs');
    var path            = require('path');

    var user_fields     = require(path.join(__dirname, './entity/user.js'));
    var user_meta       = require(path.join(__dirname, './table/user.js'));
    var User            = sequelize.define('user', user_fields(),user_meta());
    
    return User;

};
