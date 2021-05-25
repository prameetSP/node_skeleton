'use strict';
const Sequelize = require('sequelize');
const { unique } = require('underscore');

module.exports = function (sequelize, DataTypes) {
    var Vendor = sequelize.define("vendorsDetails", {
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
        upatedAt: {
            type: Sequelize.DATE
        },
        userId: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false
        },
        address_line: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        address_lat: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        address_long: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }

    },
        {
            tableName: 'vendorsDetails',
            timestamps: true,
            createdAt: 'createdAt',
            upatedAt: 'updatedAt',
            classMethod: {},
            scopes: {
                active: { where: { is_active: true } },
                all: { where: {} }
            }
        })
    Vendor.associate = function (models) {
        Vendor.belongsTo(models.user, {
            as: 'user', targetKey: 'id', foreignKey: 'userId'
        })
    }
    return Vendor;
}