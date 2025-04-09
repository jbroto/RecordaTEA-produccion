const UsuariosDao = require('../dao/usuariosDao');
const bcrypt = require('bcrypt');
const imagenUtils = require('../utils/imagenUtils');

const usuariosDao = new UsuariosDao();

class UsuariosService {
    constructor() {
    }

    async leerUsuarioId(id) {
        try {
            const usuario = await usuariosDao.leerUsuarioId(id);
            return usuario;
        }
        catch (error) {
        }
    }

    async leerUsuariosCuidador(idCuidador) {
        try {
            let usuarios = await usuariosDao.leerUsuariosCuidador(idCuidador);
            usuarios.forEach(elem => {
                if (elem.imagen !== null) {
                    elem.imagen = imagenUtils.renderImage(elem)
                }
            });
            return usuarios;
        }
        catch (error) {

        }
    }

    async login(usuario) {
        let u = await usuariosDao.login(usuario);

        if (!u) {
            return { mensaje: -1 };
        }

        const esValida = await bcrypt.compare(usuario.password, u.contraseña);
        if (!esValida) {
            return { mensaje: -2 }
        }

        return { mensaje: u }
    }


    async registro(usuario, imagen) {
        const hashedPassword = await bcrypt.hash(usuario.passw, 10);
        usuario.password = hashedPassword;

        let existeUsuario = await usuariosDao.leerUsuario(usuario.usuario);
        if (existeUsuario.length !== 0) {
            return { mensaje: -3 };
        }
        else {
            let registerResult = await usuariosDao.registrarUsuario(usuario);
            if (registerResult.insertId > 0 && imagen !== null) {
                imagen.id_usuario = registerResult.insertId;
                if (!imagenUtils.comprobarDimensiones(imagen)) {
                    //Código de error: El archivo no es una imagen
                    return { mensaje: -5 };
                }
                else if (!imagenUtils.comprobarTipo(imagen)) {
                    //Código de error: El archivo no es un tipo de imagen permitido
                    return { mensaje: -6 };
                }
                else if (!imagenUtils.comprobarTamaño(imagen)) {
                    //Código de error: El archivo excede el tamaño máximo permitido
                    return { mensaje: -7 };
                }
                else {
                    let result = await usuariosDao.imagenUsuario(imagen);
                    if (result > 0) {
                        return { mensaje: registerResult.insertId };
                    }
                    else {
                        return { mensaje: -11 };
                    }
                }
            }
            else{
                return { mensaje: registerResult.insertId };
            }
        }
    }

    async realacionCuidador(usuarioId, cuidadorId) {
        if (usuarioId > 0) {
            let resultado = await usuariosDao.realcionCuidador(usuarioId, cuidadorId);
            return { mensaje: resultado.affectedRows };
        } else {
            return { mensaje: -4 };
        }
    }
}

module.exports = UsuariosService;