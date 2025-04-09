const CuidadoresDao = require('../dao/cuidadoresDao')
const UsuariosDao = require('../dao/usuariosDao');
const bcrypt = require('bcrypt');

const cuidadoresDao = new CuidadoresDao();
const usuariosDao = new UsuariosDao();

class CuidadoresService {
    constructor() { }

    async leerCuidadorId(id) {
        try{
            if(id > 0){
                const cuidador = await cuidadoresDao.leerCuidadorId(id);
                return cuidador[0];
            }
            else{
                return null;
            }
        }
        catch(error){
            throw error;
        }
    }

    async registroCuidador(usuario) {
        try{
            let cuidador = await cuidadoresDao.registro(usuario);
            return { mensaje: cuidador };
        }
        catch (error){
            throw error;
        }
    }

    async login(usuario) {
        try{
            let u = await cuidadoresDao.login(usuario);
            return u;
        }
        catch (error){
            throw error;
        }
    }

    async compartirPerfil(usuario, idPerfil){
        try{
            if(idPerfil > 0){
                let existe = await usuariosDao.leerUsuario(usuario);
                if(existe.length > 0){
                    let hayRelacion = await cuidadoresDao.perfilVinculadoId(existe[0].id, idPerfil);
                    if(hayRelacion.length > 0){
                        return {mensaje: -9};
                    }
                    else{
                        let msj = await cuidadoresDao.compartirPerfil(existe[0].id, idPerfil);
                        return {mensaje: msj};
                    }
                }
                else{
                    return {mensaje: -1};
                }
            }
            else{
                return {mensaje: -8};
            }
        }
        catch (error){
            throw error;
        }
    }

}

module.exports = CuidadoresService;