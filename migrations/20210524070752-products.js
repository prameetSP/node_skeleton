'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products',
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
        product_name: {
          type: Sequelize.STRING(150),
          allowNull: true,
          unique: true
        },
        category_id: {
          type: Sequelize.INTEGER(20),
          allowNull: false
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          default: true
        }
      },{
        engine:'InnoDB',
        schema:'',
        comment:'products table',
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
