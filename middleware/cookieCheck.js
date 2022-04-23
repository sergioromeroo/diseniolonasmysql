module.exports = (req,res,next) => {
    if(req.cookies.adminFerchu){
        req.session.userLogin = req.cookies.adminFerchu;
    }
    next()
}
