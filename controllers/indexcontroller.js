
const db = require('../database/models')

module.exports = {//TODO ESTO ES PARA  ME RENDERISE EL INDEX.EJS A HTML
    index : (req,res) => {
        return res.render('index')
    },

    quienessomos : (req,res) => {
        return res.render('quienessomos')
    },
    admin : (req,res) =>{

        db.Product.findAll({
            include : [
                {association : 'category'}
            ]
        }).then(productos => res.render('admin/index',{
            productos/* este productos es el que pongo en foreach de la vista de admin */
        }))

    }
}
