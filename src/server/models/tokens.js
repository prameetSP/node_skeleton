'use strict';
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {

var Token = sequelize.define("tokens",
    {
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
        token:{
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true,
        },
        userId:{
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        is_active: { 
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
    }, {
      tableName: 'tokens',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      classMethods: {},
      scopes:{
        active: {where:{ is_active:true }},
        all: {where:{}}
      }
    })

    Token.associate = function (models){
        Token.belongsTo(models.tokens,{
          as: 'tokens', targetKey: 'id', foreignKey:'userId'
        });
      }
  
    return Token;
};
