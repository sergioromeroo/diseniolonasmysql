const fs = require('fs');
const path = require('path');
const {productos} = require('../data/products_db');
const {usuarios, guardar} = require('../data/users_db')
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs'); /* hashear la contraseña encriptar la contraseña */


module.exports = {//TODO ESTO ES PARA  ME RENDERISE EL INDEX.EJS A HTML
    register : (req,res) => {
        return res.render('register',{
            productos
        })
    },
    
    processRegister : (req, res) => {
        let errors = validationResult(req)
        let {nombre,email,contrasenia} = req.body;
        if(errors.isEmpty()){
            let usuario = {
                id : usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1, /* si no hay usuario agregame 1 en mi base datos */
                nombre,
                email,
                contrasenia : bcrypt.hashSync(contrasenia,10), /* encriptado la contraseña */
                rol : "user"
            }
            usuarios.push(usuario)
            guardar(usuarios);
            return res.redirect('/')
        }else{
            return res.render('register',{
                productos,
                old : req.body, 
                errores : errors.mapped()
            })

        }
        
    },

    login : (req,res) => {
        return res.render('login',{
            productos
        })
    },
    processLogin : (req,res) => {
        let errors = validationResult(req);
        const {email, recordar} = req.body;
        if(errors.isEmpty()){
            let usuario = usuarios.find(usuario => usuario.email === email)
            /* levanto sesion */
            req.session.userLogin = {
                id : usuario.id,
                nombre : usuario.nombre,
                rol : usuario.rol
            }
            /* guardo la cookie */
            if(recordar){
                res.cookie('adminFerchu',req.session.userLogin,{maxAge: 60000})/* esto es para q despues de 5min se cierra la sesion solo osino entras mñna misma pagina sigue abierta es por seguridad */
            }
            return res.redirect('/')
        }else{
            return res.render('login',{
                productos,
                errores : errors.mapped()
            })
        }
    },
    logout: (req,res) => {/* para romper todas las sessiones abiertas es decir cerrar sesion con esto */
        req.session.destroy();
        res.cookie('adminFerchu',null,{maxAge:-1})/* ademas q me cierra sesion que me borre la cookies */
        return res.redirect('/')
    }
    
}