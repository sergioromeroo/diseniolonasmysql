module.exports = {//TODO ESTO ES PARA  ME RENDERISE EL INDEX.EJS A HTML
    index : (req,res) => {
        return res.render('index')
    },

    quienessomos : (req,res) => {
        return res.render('quienessomos')
    }
}
