'use strict'
const Sequelize = require('sequelize');
const { unique, defaults } = require('underscore');

module.exports = function (sequelize, DataTypes) {
    var Category = sequelize.define('category', {
        id: {
            type: Sequelize.INTEGER(20),
            unique: true,
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
        category_name: {
            type: Sequelize.STRING(30),
            allowNull: false,
            unique: true
        },
        is_active: {
            type: Sequelize.BOOLEAN
        },
    }, {
        tableName: 'category',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        classMethods: {},
        scopes: {
            active: { where: { is_active: true } },
            all: { where: {} }
        }
    });
    return Category;
}