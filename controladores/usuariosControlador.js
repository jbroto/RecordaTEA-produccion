const UsuariosService = require('../servicios/usuariosService');
const CuidadoresService = require('../servicios/cuidadoresService');
const TarjetasService = require('../servicios/tarjetasService');

const cuidadoresService = new CuidadoresService();
const usuariosServicio = new UsuariosService();
const tarjetasService = new TarjetasService();

class UsuariosControlador {
    constructor() { }

    async leerUsuarioId(req, res, next) {
        try {
            res.render('TEA/indexTEA');
        }
        catch (error) {
            const rr = new Error('Ha ocurrido algo en el servidor, lamentamos las molestias.');
            rr.status = 500;
            next(rr);
        }
    }


    async login(req, res, next) {
        try {
            let usuario = {
                usuario: req.body.usuario,
                password: req.body.passw,
            }
            let u = await usuariosServicio.login(usuario);
            if (u.mensaje === -1 || u.mensaje === -2) {
                res.send(u);
            }
            else {
                let cuidador = await cuidadoresService.login(u.mensaje);
                if (cuidador.length > 0) {
                    req.session.rol = cuidador[0].rol;
                    req.session.nombre = u.mensaje.nombre;
                    req.session.idUsuario = u.mensaje.id;
                    req.session.cuidador = 1;
                }
                else {
                    let config = await tarjetasService.leerConfiguracionVocabulario(u.mensaje.id);
                    req.session.usuario = u.mensaje;
                    req.session.cuidador = 0;
                    req.session.config = config;
                }
                req.session.logged = 1;
                let esCuidador = req.session.cuidador;
                res.send({ mensaje: 1, cuidador: esCuidador });
            }
        }
        catch (error) {
            const rr = new Error('Ha ocurrido algo en el servidor, lamentamos las molestias.');
            rr.status = 500;
            next(rr);
        }
    }

    async registro(req, res, next) {
        try {
            let usuario = {
                usuario: req.body.usuario,
                passw: req.body.passw,
                nombre: req.body.nombre
            };

            let imagen;

            if (req.file) {
                imagen = {
                    imagen: req.file.buffer,
                    mimetype: req.file.mimetype,
                }
            }
            else {
                imagen = null;
            }

            let resultado = await usuariosServicio.registro(usuario, imagen);
            if (resultado.mensaje > 0) {
                var u = await usuariosServicio.leerUsuarioId(resultado.mensaje);
                let r = await usuariosServicio.realacionCuidador(u[0].id, req.session.idUsuario);
                if (r.mensaje > 0) {
                    req.session.usuarios.push(u[0]);
                    return res.send({ mensaje: resultado.mensaje, usuario: u[0] });
                }
            }
            return res.send({ mensaje: resultado.mensaje });
        }
        catch (error) {
            const rr = new Error('Ha ocurrido algo en el servidor, lamentamos las molestias.');
            rr.status = 500;
            next(rr);
        }
    }

    logout(req, res, next) {
        try {
            req.session.destroy();
            res.redirect('/');
        }
        catch (error) {
            const rr = new Error('Ha ocurrido algo en el servidor, lamentamos las molestias.');
            rr.status = 500;
            next(rr);
        }
    }

}
module.exports = UsuariosControlador;