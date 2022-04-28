'use strict';

  const imagenes = ['1.jpeg','22.jpeg','222.jpeg','f.jpeg','999.jpeg'];

  const images = [];

  for (let i = 0; i < 36 ; i++){

    var image = {
      file : imagenes[Math.floor(Math.random() * (4 - 0)) + 0],
      productId : i + 1,
      createdAt : new Date,
      updatedAt : new Date
    }
    images.push(image)


  }



module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkInsert('Images',images, {});

  },

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.bulkDelete('Images', null, {});

  }
};
