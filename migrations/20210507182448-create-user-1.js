'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
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
      email: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: true
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User1s');
  }
};