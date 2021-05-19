'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {


    await queryInterface.bulkInsert('roles', [{
      roleName: 'endUser',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      roleName: 'vendor',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      roleName: 'admin',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
