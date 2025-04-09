function verificarSesion(req, res, next) {
    if (!req.session.logged) {
        return res.status(401).redirect('/');
    }
    next();
}
module.exports = verificarSesion;