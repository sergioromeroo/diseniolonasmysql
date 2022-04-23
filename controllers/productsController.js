const fs = require('fs');
const path = require('path');
const productos = require('../data/products_db');
const categorias = require('../data/categories_db');
const {validationResult} = require('express-validator')

module.exports = {//TODO ESTO ES PARA  ME RENDERISE EL INDEX.EJS A HTML
    products : (req,res) => {
        return res.render('products',{
            productos,
            Letreros : productos.filter(producto => producto.category === "Letreros"),
            Carteles : productos.filter(producto => producto.category === "Carteles"),
            Gigantografias : productos.filter(producto => producto.category === "Gigantografias"),
            Impresiones : productos.filter(producto => producto.category === "Impresiones"),
            Autoadhesivos : productos.filter(producto => producto.category === "Autoadhesivos"),
            Ploteos : productos.filter(producto => producto.category === "Ploteos")
        })
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

    detail : (req,res) => {/* busco producto con el id */
        let producto = productos.find(producto => producto.id === +req.params.id)

        return res.render('productDetail',{
            producto
        })
    },

    edit : (req,res) => {
        let producto = productos.find(producto => producto.id === +req.params.id)

        return res.render('productEdit',{
            categorias,
            productos,
            producto
        })
    },

    update : (req,res) => {
        const {title, description,extra,category} = req.body;

        let producto = productos.find(producto => producto.id === +req.params.id)
        let productoEditado = {
            id : +req.params.id,
            title,
            description,
            extra,
            category
        }

        let productosModificados = productos.map(producto => producto.id === +req.params.id ? productoEditado : producto)

        fs.writeFileSync(path.join(__dirname,'..','data','products.json'),JSON.stringify(productosModificados,null,2),'utf-8')/* q se me guarde en el json  */

        res.redirect('/')
    },
    

    destroy : (req,res) => {
        //productos = productos.filter(producto => producto.id !== +req.params.id)  este seria otra opcion tambien debe de las 4 lineas de abajo
        productos.forEach(producto=>{
            if(producto.id === +req.params.id){
                let productoAEliminar = productos.indexOf(producto);
                productos.splice(productoAEliminar,1)
            }
        });
        fs.writeFileSync(path.join(__dirname,'..','data','products.json'),JSON.stringify(productos,null,2),'utf-8')
        res.redirect('/products/products')
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