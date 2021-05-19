'use strict';
const Sequelize = require('sequelize');
const roles = require('./roles');

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("user",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      access_token: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: true
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: true
      },
      country_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image_path: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    classMethods: {}
  });

  User.associate = function (models){
    User.belongsTo(models.roles,{
      as: 'roles', targetKey: 'id', foreignKey:'roleId'
    });
  }

  return User;
};
