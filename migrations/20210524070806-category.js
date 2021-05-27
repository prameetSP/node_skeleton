'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:*/
    await queryInterface.createTable('category',
      {
        id: {
          type: Sequelize.INTEGER,
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
          type: Sequelize.STRING(150),
          allowNull: true,
          unique: true
        },
     
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        }
      },{
        engine:'InnoDB',
        schema:'',
        comment:'category table',
        collate:'utf8_general_ci'
      });

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
