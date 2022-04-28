 'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Product.belongsTo(models.Category,{/* ---------producto le pertenece a 1 categoria-------- */
        as : 'category' /* la relacion se llama categoria */
      })

      Product.hasMany(models.Image,{
        as : 'images',
        onDelete : 'cascade' /* me borre las imagenes associado con aca productos cuando use metodo delete en controlador */
      })
    }
  };
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};