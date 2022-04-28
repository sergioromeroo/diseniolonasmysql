'use strict';

const faker = require('faker');
const products = [];

for (let i = 0; i < 36; i++) {  /* me crea hasta 36 productos */
  
  var product = {
    name : faker.commerce.productName(),
    description : faker.commerce.productDescription(),
    categoryId : faker.datatype.number({min:1,max:6}),
    createdAt : new Date,
    updatedAt : new Date
  }

  products.push(product)
  
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
  
     await queryInterface.bulkInsert('Products',products, {});
   
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Products', null, {});
     
  }
};