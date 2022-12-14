function auth(req, res, next) {
    if(req.isAuthenticated()) {
        console.log(req)
        console.log(res)
        return next()
    }
    return res.redirect('/login')
}

module.exports = auth