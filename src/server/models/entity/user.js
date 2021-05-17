const Sequelize = require('sequelize');
module.exports = function () {
    return {
        id: {
            type: Sequelize.INTEGER(20),
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unsigned: true
        },
        firstName: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull: true
        },
        phone: {
            type: Sequelize.NUMBER,
            unique: true,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
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
        access_token: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull: true
        }
    };
};
