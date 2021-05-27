'use strict'
const Sequelize = require('sequelize');
const { unique, defualts } = require('underscore');

module.exports = function (sequelize, DataTypes) {
    var Products = sequelize.define('products', {
        id: {
            type: Sequelize.INTEGER(20),
            unique: true,
            primaryKey: true,
            autoIncrement: true,
            unsigned: true
        },
        category_id: {
            type: Sequelize.INTEGER(20),
            allowNull: false,
        },
        product_name: {
            type: Sequelize.STRING(150),
            allowNull: true,
            unique: true,
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        image: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defualts: true
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt: {
            type: Sequelize.DATE
        }
    }, {
        tableName: 'products',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        classMethod: {},
        scopes: {
            active: { where: { is_active: true } },
            all: { where: {} }
        }
    })
    Products.associate = function (models) {
        Products.belongsTo(models.category, {
            as: 'category', targetKey: 'id', foreignKey: 'category_id'
        })
    }
    return Products;
}