'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references : {
          model :{
            tableName: 'Users'/* la vinculacion la relaciones muchos carrito tienen 1 usuario*/
          },
          key : 'id'
        }
      },
      productId: {
        type: Sequelize.INTEGER,
        references : {
          model :{
            tableName: 'Products'/* la vinculacion la relaciones muchos carritos tienen 1producto*/
          },
          key : 'id'
        }
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
    await queryInterface.dropTable('Carts');
  }
};