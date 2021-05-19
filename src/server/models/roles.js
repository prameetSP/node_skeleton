'use strict'
const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    var Role = sequelize.define(
        'roles', {
        id: {
            type: Sequelize.INTEGER(20),
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unsigned: true
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt: {
            type: Sequelize.DATE
        },
        roleName: {
            type: Sequelize.STRING
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
    }, {
        tableName: 'roles',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        classMethods: {},
        scopes: {
            active: { where: { is_active: true } },
            all: { where: {} }
        }
    });
   return Role;
}