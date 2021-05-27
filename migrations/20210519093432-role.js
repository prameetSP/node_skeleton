'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('roles',
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
        roleName: {
          type: Sequelize.STRING
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
      }, {

      engine: 'InnoDB',    // default: 'InnoDB'
      schema: '',    // default: public, PostgreSQL only.
      comment: 'roles table', // comment for table
      collate: 'utf8_general_ci' // collation, MYSQL only

    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
