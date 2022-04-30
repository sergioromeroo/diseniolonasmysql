const {check, body} = require('express-validator');
const {usuarios, guardar} = require('../data/users_db')
const bcrypt = require('bcryptjs')


module.exports = [
    check('name')
    .notEmpty().withMessage('debes ingresar un titulo putarraco'),/* Empty si esta vacio el input q tiene q llenar el usuario */


    check('description')
    .notEmpty().withMessage('te olvidaste aca dale media pila'),

    check('categoryId')
    .notEmpty().withMessage('primero selecciona una categoria maestro'),
]