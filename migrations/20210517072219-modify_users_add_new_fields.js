'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users',
      'phone',
      {
        type: Sequelize.INTEGER(20),
        unique: true,
        allowNull: true
      }),
      await queryInterface.addColumn('Users', 'email',
        {
          type: Sequelize.STRING,
          unique: true,
          allowNull: true
        })
    await queryInterface.addColumn('Users', 'country_code',
      {
        type: Sequelize.STRING,
        allowNull: true
      })
    await queryInterface.addColumn('Users', 'image_path',
      {
        type: Sequelize.STRING(255),
        allowNull: true
      })
    await queryInterface.addColumn('Users', 'password',
      {
        type: Sequelize.STRING(255),
        allowNull: true
      })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User1s');
  }
};