const fs = require('fs');
const path = require('path');
const productos = require('../data/products_db');
const categorias = require('../data/categories_db');
const {validationResult} = require('express-validator')
const db = require('../database/models')

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

    add : (req,res) => {
        return res.render('productAdd',{
            categorias,
            productos
        })
    },

    save : (req,res) =>{
        let errors = validationResult(req);/* validaciones del back si esta vacio los datos dame error sino hace lo siguiente lo de abajo*/
        if(errors.isEmpty()){
            const {title,extra,category,images} = req.body;
            let producto ={
                id : productos[productos.length - 1].id + 1,
                title,     
                extra,
                images: req.file ? req.file.filename : 'default-image.png',
                category
            }
            productos.push(producto)    
            fs.writeFileSync(path.join(__dirname,'..','data','products.json'),JSON.stringify(productos,null,2),'utf-8')/* q se me guarde en el json  */
            return res.redirect('/products/products')
        }else{
            return res.render('productAdd',{
                categorias,
                productos,
                errores : errors.mapped(),
                old : req.body
            })
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
                        ]
                    }
                ]
            }).then(category => {
                return res.render('productDetail', {
                    producto,
                    relacionados: category.products
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
        let result = productos.filter(producto => producto.category === req.query.search)
        return res.render('result',{
            result,
            productos,
            busqueda : req.query.search /* esto para el titulo de la busqueda de banner lona etc */
        })
    }
}