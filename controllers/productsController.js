
const productos = require('../data/products_db');
const {validationResult} = require('express-validator')
const db = require('../database/models')
const {Op} = require('sequelize') /* operadores que me trae sequelize como el 'or' que usamos en search */
module.exports = {
    products : (req,res) => {

        let productos = db.Product.findAll();/* traemelo todos */
        let Letreros = db.Category.findOne({
            where : {
                name : 'Letreros'
            },
            include : [
                {
                    association : 'products',/* incluime la associacion q tiene categoria con producto */
                    include : [
                        {association : 'images'}
                    ]
                } 
            ]
        });
        let Carteles = db.Category.findOne({
            where : {
                name : 'Carteles'
            },
            include : [
                {
                    association : 'products',/* incluime la associacion q tiene categoria con producto */
                    include : [
                        {association : 'images'}
                    ]
                } 
            ]
        });
        let Gigantografias = db.Category.findOne({
            where : {
                name : 'Gigantografias'
            },
            include : [
                {
                    association : 'products',/* incluime la associacion q tiene categoria con producto */
                    include : [
                        {association : 'images'}
                    ]
                } 
            ]
        });
        let Impresiones = db.Category.findOne({
            where : {
                name : 'Impresiones'
            },
            include : [
                {
                    association : 'products',/* incluime la associacion q tiene categoria con producto */
                    include : [
                        {association : 'images'}
                    ]
                } 
            ]
        });
        let Autoadhesivos = db.Category.findOne({
            where : {
                name : 'Autoadhesivos'
            },
            include : [
                {
                    association : 'products',/* incluime la associacion q tiene categoria con producto */
                    include : [
                        {association : 'images'}
                    ]
                } 
            ]
        });
        let Ploteos = db.Category.findOne({
            where : {
                name : 'Ploteos'
            },
            include : [
                {
                    association : 'products',/* incluime la associacion q tiene categoria con producto */
                    include : [
                        {association : 'images'}
                    ]
                } 
            ]
        });
        Promise.all([productos,Letreros,Carteles,Gigantografias,Impresiones,Autoadhesivos,Ploteos])
        .then(([productos,Letreros,Carteles,Gigantografias,Impresiones,Autoadhesivos,Ploteos]) => {
            return res.render('products',{
                productos,
                Letreros : Letreros.products,
                Carteles : Carteles.products,
                Gigantografias : Gigantografias.products,
                Impresiones : Impresiones.products,
                Autoadhesivos : Autoadhesivos.products,
                Ploteos : Ploteos.products
            })
        }).catch(error => console.log(error))
        
    },

    add: (req, res) => {
        db.Category.findAll()
            .then(categorias => {
                return res.render('productAdd', {
                    categorias,
                })
            }).catch(error => console.log(error))

    },

    save: (req, res) => {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            const { name, description, categoryId } = req.body;

            db.Product.create({
                
                name: name.trim(),
                description: description.trim(),
                categoryId

            }).then(product => {

                if (req.files) {
                    var images = [];
                    var imagenes = req.files.map(imagen => imagen.filename);/* capturo las imagenes */
                    imagenes.forEach(img => {/* recorro el array voy fabricando un objeto  */
                        var image = {
                            file: img,
                            productId: product.id
                        }
                        images.push(image)
                    });

                    db.Image.bulkCreate(images, { validate: true })
                        .then(() => console.log('imagenes agregadas'))
                }

                return res.redirect('/admin')
            }).catch(error => console.log(error))

        } else {
            db.Category.findAll()
                .then(categorias => {
                    return res.render('productAdd', {
                        categorias,
                        errores: errors.mapped(),
                        old: req.body
                    })
                }).catch(error => console.log(error))
        }
    },

    

    detail: (req, res) => {

        db.Product.findOne({
            where: {
                id: req.params.id
            },
            include: [
                { association: 'images' },
                { association: 'category' }
            ]
        }).then(producto => {
            console.log(producto);
            db.Category.findOne({
               /*  where: {
                    id: producto.categoryId
                }, */
                include: [
                    {
                        association: 'products',
                        include: [
                            { association: 'images' }
                        ],
                        /* limit : 4   aca van carrusel de productos relacionados limito a q se vean 4 */
                    }
                ]
            }).then(category => {
                return res.render('productDetail', {
                    producto,
                    relacionados: category.products /* esto por si le quiero agregar productos relacionados abajo un carrusel */
                })
            })
        }).catch(error => console.log(error))

    },

    edit: (req, res) => {
        let categorias = db.Category.findAll();
        let producto = db.Product.findByPk(req.params.id);
        Promise.all([categorias, producto])
            .then(([categorias, producto]) => {
                return res.render('productEdit', {
                    categorias,
                    producto
                })
            })

    },
    
    update : (req,res) => {
        const { name, description, categoryId } = req.body;

        db.Product.update(
            {
                name: name.trim(),
                description: description.trim(),
                categoryId
            },
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(() => res.redirect('/admin'))
            .catch(error => console.log(error))
    },
    

    destroy : (req,res) => {
        db.Product.destroy({
            where: {
                id : req.params.id
            }
        }).then(() => res.redirect('/admin'))
        .catch(error => console.log(error))
    },


    search : (req,res) => {
       db.Product.findAll({
           where: {
               [Op.or] : [
                   {
                       name : {
                           [Op.substring] : req.query.search
                       }
                   },
                   {
                    categoryId : {/* que tambien me busque por descripcion en la busqueda */
                        [Op.substring] : req.query.search
                       }
                   },
               ] 
           },

           include : [
            {association : 'images'},/* que t ambien me busque en esta vista de result las imagenes osino no muestra imagenes sin esto */
            
        ]


       }).then(result => res.render('result',{
        result, /* el if o foreach q uso en mi vista es result asi q aca pongo result para ponerlo en la vista */
        busqueda : req.query.search /* aca me aparesca el nombre de la busqueda y no id */
       })).catch(error => console.log(error))
       
    }
}