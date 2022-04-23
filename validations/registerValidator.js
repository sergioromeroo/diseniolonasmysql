const {check, body} = require('express-validator');

module.exports = [
    check('nombre')
    .notEmpty().withMessage('debes ingresar un nombre putarraco').bail()/* notEmpty si esta vacio el input q tiene q llenar el usuario */
    .isLength({
        min : 2,
        max : 10
    }).withMessage('nombre debe tener entre 2 a 10 letras').bail()
    .isAlpha().withMessage('el nombre debe contener solo letras'),


    check('email')
    .notEmpty().withMessage('debes ingresar una email padreee'),

    check('contrasenia')
    .isLength({/* que tenga una longitud la palabra de 6 a 12 */
        min : 6,
        max : 12
    }).withMessage('la contraseña debe tener entre 6 a 12 caracteres'),
    
/* el body se usa en este caso es para reingresar la contraseña  */
    body('contrasenia2')
    .custom((value,{req}) => {
        if(value !== req.body.contrasenia){
            return false
        }
        return true
    }).withMessage('las contraseñas no coinciden')

]